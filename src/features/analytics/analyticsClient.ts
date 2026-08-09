import pkg from '../../../package.json';
import {
  ANALYTICS_PROPERTY_KEYS,
  type AnalyticsEventMap,
  type AnalyticsEventName,
  type AnalyticsPlatform,
} from './analyticsContract';

export type {
  AnalyticsEventMap,
  AnalyticsEventName,
  AnalyticsPlatform,
  CountBucket,
  DurationBucket,
  ModLoader,
  ResultCountBucket,
  TrafficBucket,
} from './analyticsContract';
export {
  countBucket,
  deriveAnalyticsAttemptId,
  durationBucket,
  resultCountBucket,
  trafficBucket,
} from './analyticsContract';

export const ANALYTICS_CONSENT_KEY = 'burrow_analytics_consent';
export const ANALYTICS_INSTALL_ID_KEY = 'burrow_analytics_install_id';
export const ANALYTICS_QUEUE_KEY = 'burrow_analytics_queue_v2';
export const ANALYTICS_CONSENT_VERSION = 2;
export const ANALYTICS_SCHEMA_VERSION = 2;
export const DEFAULT_POSTHOG_HOST = 'https://eu.i.posthog.com';

const MAX_QUEUED_EVENTS = 100;
const MAX_QUEUE_AGE_MS = 7 * 24 * 60 * 60 * 1_000;
const SAFE_TOKEN = /^[A-Za-z0-9_.:+-]{1,64}$/;

export type AnalyticsConsent = 'unknown' | 'granted' | 'denied';
export type AnalyticsCaptureResult = 'sent' | 'queued' | 'disabled' | 'unconfigured';

type AnalyticsStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
type AnalyticsFetcher = typeof fetch;
type SafeProperty = boolean | number | string;

type QueuedEvent = {
  event: AnalyticsEventName;
  insertId: string;
  properties: Record<string, SafeProperty>;
  timestamp: string;
};

export interface AnalyticsClient {
  readonly configured: boolean;
  readonly host: string;
  capture<K extends AnalyticsEventName>(event: K, properties: AnalyticsEventMap[K]): Promise<AnalyticsCaptureResult>;
  clearLocalData(): void;
  flush(): Promise<void>;
}

type AnalyticsClientOptions = {
  fetcher?: AnalyticsFetcher;
  host?: string;
  now?: () => number;
  platform?: AnalyticsPlatform;
  projectToken?: string;
  randomId?: () => string;
  storage?: AnalyticsStorage | null;
};

function browserStorage(): AnalyticsStorage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function browserFetcher(): AnalyticsFetcher | undefined {
  return typeof fetch === 'function' ? fetch.bind(globalThis) : undefined;
}

function createRandomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const values = crypto.getRandomValues(new Uint32Array(4));
    return Array.from(values, (value) => value.toString(16).padStart(8, '0')).join('');
  }
  throw new Error('Secure random identifiers are unavailable.');
}

export function detectAnalyticsPlatform(userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent): AnalyticsPlatform {
  const normalized = userAgent.toLowerCase();
  if (normalized.includes('windows')) return 'windows';
  if (normalized.includes('macintosh') || normalized.includes('mac os')) return 'macos';
  if (normalized.includes('linux')) return 'linux';
  return 'other';
}

export function normalizePostHogHost(candidate: string | undefined): string | null {
  try {
    const url = new URL(candidate?.trim() || DEFAULT_POSTHOG_HOST);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function getAnalyticsConsent(storage: AnalyticsStorage | null = browserStorage()): AnalyticsConsent {
  const value = storage?.getItem(ANALYTICS_CONSENT_KEY);
  if (value === `granted:${ANALYTICS_CONSENT_VERSION}`) return 'granted';
  if (value === `denied:${ANALYTICS_CONSENT_VERSION}`) return 'denied';
  return 'unknown';
}

export function hasAnalyticsConsent(storage: AnalyticsStorage | null = browserStorage()): boolean {
  return getAnalyticsConsent(storage) === 'granted';
}

export function persistAnalyticsConsent(enabled: boolean, storage: AnalyticsStorage | null = browserStorage()): void {
  if (!storage) return;
  storage.setItem(ANALYTICS_CONSENT_KEY, `${enabled ? 'granted' : 'denied'}:${ANALYTICS_CONSENT_VERSION}`);
  if (!enabled) {
    storage.removeItem(ANALYTICS_INSTALL_ID_KEY);
    storage.removeItem(ANALYTICS_QUEUE_KEY);
  }
}

function sanitizeProperties<K extends AnalyticsEventName>(
  event: K,
  properties: AnalyticsEventMap[K] | Record<string, unknown>,
): Record<string, SafeProperty> {
  const safe: Record<string, SafeProperty> = {};
  const source = properties as Record<string, unknown>;
  for (const key of ANALYTICS_PROPERTY_KEYS[event]) {
    const value = source[key];
    if (typeof value === 'boolean') safe[key] = value;
    else if (typeof value === 'number' && Number.isFinite(value)) safe[key] = value;
    else if (typeof value === 'string' && SAFE_TOKEN.test(value)) safe[key] = value;
  }
  return safe;
}

function readQueue(storage: AnalyticsStorage, now: number): QueuedEvent[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(ANALYTICS_QUEUE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    const oldest = now - MAX_QUEUE_AGE_MS;
    return parsed.filter((candidate): candidate is QueuedEvent => {
      if (!candidate || typeof candidate !== 'object') return false;
      const item = candidate as Partial<QueuedEvent>;
      return typeof item.event === 'string'
        && item.event in ANALYTICS_PROPERTY_KEYS
        && typeof item.insertId === 'string'
        && SAFE_TOKEN.test(item.insertId)
        && typeof item.timestamp === 'string'
        && Number.isFinite(Date.parse(item.timestamp))
        && Date.parse(item.timestamp) >= oldest
        && Boolean(item.properties)
        && typeof item.properties === 'object';
    }).slice(-MAX_QUEUED_EVENTS);
  } catch {
    return [];
  }
}

function writeQueue(storage: AnalyticsStorage, queue: QueuedEvent[]): void {
  if (queue.length === 0) storage.removeItem(ANALYTICS_QUEUE_KEY);
  else storage.setItem(ANALYTICS_QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUED_EVENTS)));
}

export function createAnalyticsClient(options: AnalyticsClientOptions = {}): AnalyticsClient {
  const projectToken = options.projectToken?.trim() ?? '';
  const host = normalizePostHogHost(options.host);
  const storage = options.storage === undefined ? browserStorage() : options.storage;
  const fetcher = options.fetcher ?? browserFetcher();
  const platform = options.platform ?? detectAnalyticsPlatform();
  const randomId = options.randomId ?? createRandomId;
  const now = options.now ?? Date.now;
  const configured = Boolean(projectToken && host && fetcher && storage);
  let flushPromise: Promise<void> | null = null;

  function getInstallId(): string {
    const existing = storage?.getItem(ANALYTICS_INSTALL_ID_KEY);
    if (existing && SAFE_TOKEN.test(existing)) return existing;
    const created = randomId();
    storage?.setItem(ANALYTICS_INSTALL_ID_KEY, created);
    return created;
  }

  async function flushQueue(): Promise<void> {
    if (flushPromise) return flushPromise;
    if (!configured || !host || !fetcher || !storage || !hasAnalyticsConsent(storage)) return;

    flushPromise = (async () => {
      let queue = readQueue(storage, now());
      while (queue.length > 0 && hasAnalyticsConsent(storage)) {
        const item = queue[0];
        const properties = sanitizeProperties(item.event, item.properties);
        try {
          const response = await fetcher(new URL('/i/v0/e/', host), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: projectToken,
              distinct_id: getInstallId(),
              event: item.event,
              timestamp: item.timestamp,
              properties: {
                $geoip_disable: true,
                $insert_id: item.insertId,
                $process_person_profile: false,
                analytics_schema_version: ANALYTICS_SCHEMA_VERSION,
                app_platform: platform,
                app_version: pkg.version,
                ...properties,
              },
            }),
            credentials: 'omit',
            keepalive: true,
            referrerPolicy: 'no-referrer',
          });
          if (!response.ok) break;
          const latestQueue = readQueue(storage, now()).filter((candidate) => candidate.insertId !== item.insertId);
          writeQueue(storage, latestQueue);
          queue = latestQueue;
        } catch {
          break;
        }
      }
    })().finally(() => {
      flushPromise = null;
    });
    return flushPromise;
  }

  return {
    configured,
    host: host ?? '',
    async capture<K extends AnalyticsEventName>(event: K, properties: AnalyticsEventMap[K]): Promise<AnalyticsCaptureResult> {
      if (!hasAnalyticsConsent(storage)) return 'disabled';
      if (!configured || !storage) return 'unconfigured';

      const queued: QueuedEvent = {
        event,
        insertId: randomId(),
        properties: sanitizeProperties(event, properties),
        timestamp: new Date(now()).toISOString(),
      };
      const queue = [...readQueue(storage, now()), queued].slice(-MAX_QUEUED_EVENTS);
      writeQueue(storage, queue);
      await flushQueue();
      return readQueue(storage, now()).some((item) => item.insertId === queued.insertId) ? 'queued' : 'sent';
    },
    clearLocalData(): void {
      storage?.removeItem(ANALYTICS_INSTALL_ID_KEY);
      storage?.removeItem(ANALYTICS_QUEUE_KEY);
    },
    flush: flushQueue,
  };
}

export const analyticsClient = createAnalyticsClient({
  projectToken: import.meta.env.VITE_POSTHOG_PROJECT_TOKEN,
  host: import.meta.env.VITE_POSTHOG_HOST,
});
