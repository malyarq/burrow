// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_INSTALL_ID_KEY,
  ANALYTICS_QUEUE_KEY,
  createAnalyticsClient,
  getAnalyticsConsent,
  normalizePostHogHost,
  persistAnalyticsConsent,
} from '../analyticsClient';

describe('privacy-first analytics client', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sends nothing and creates no local data before explicit current consent', async () => {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted');
    const fetcher = vi.fn();
    const client = createAnalyticsClient({
      fetcher,
      projectToken: 'phc_public_project_token',
      randomId: () => 'random-id',
      storage: localStorage,
    });

    expect(getAnalyticsConsent(localStorage)).toBe('unknown');
    await expect(client.capture('app_opened', {
      language: 'en', ui_mode: 'simple', startup_duration: 'under_250ms',
    })).resolves.toBe('disabled');
    expect(fetcher).not.toHaveBeenCalled();
    expect(localStorage.getItem(ANALYTICS_INSTALL_ID_KEY)).toBeNull();
    expect(localStorage.getItem(ANALYTICS_QUEUE_KEY)).toBeNull();
  });

  it('uses the public endpoint and strips every property outside the runtime allowlist', async () => {
    persistAnalyticsConsent(true, localStorage);
    const fetcher = vi.fn().mockResolvedValue({ ok: true } as Response);
    const ids = ['event-id', 'install-id'];
    const client = createAnalyticsClient({
      fetcher,
      host: 'https://eu.i.posthog.com/project/path',
      now: () => Date.parse('2026-08-09T12:00:00.000Z'),
      platform: 'linux',
      projectToken: 'phc_public_project_token',
      randomId: () => ids.shift() ?? 'unused-id',
      storage: localStorage,
    });

    await expect(client.capture('game_launch_failed', {
      failure_stage: 'launch',
      loader: 'fabric',
      link_active: true,
      duration: '3s_10s',
      nickname: 'must-not-leave-device',
      path: '/Users/example/.minecraft',
    } as never)).resolves.toBe('sent');

    const [requestUrl, request] = fetcher.mock.calls[0] as [URL, NonNullable<Parameters<typeof fetch>[1]>];
    expect(requestUrl.toString()).toBe('https://eu.i.posthog.com/i/v0/e/');
    expect(request.credentials).toBe('omit');
    expect(request.referrerPolicy).toBe('no-referrer');

    const payload = JSON.parse(String(request.body)) as Record<string, unknown>;
    expect(payload).toMatchObject({
      api_key: 'phc_public_project_token',
      distinct_id: 'install-id',
      event: 'game_launch_failed',
      timestamp: '2026-08-09T12:00:00.000Z',
      properties: {
        $geoip_disable: true,
        $insert_id: 'event-id',
        $process_person_profile: false,
        analytics_schema_version: 2,
        app_platform: 'linux',
        failure_stage: 'launch',
        loader: 'fabric',
        link_active: true,
        duration: '3s_10s',
      },
    });
    expect(JSON.stringify(payload)).not.toContain('must-not-leave-device');
    expect(JSON.stringify(payload)).not.toContain('/Users/example');
  });

  it('keeps a bounded local retry queue and flushes it after connectivity returns', async () => {
    persistAnalyticsConsent(true, localStorage);
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('offline'));
    const client = createAnalyticsClient({
      fetcher,
      projectToken: 'phc_public_project_token',
      randomId: vi.fn()
        .mockReturnValueOnce('event-id')
        .mockReturnValueOnce('install-id'),
      storage: localStorage,
    });

    await expect(client.capture('onboarding_shown', {})).resolves.toBe('queued');
    expect(JSON.parse(localStorage.getItem(ANALYTICS_QUEUE_KEY) ?? '[]')).toHaveLength(1);

    fetcher.mockResolvedValue({ ok: true } as Response);
    await client.flush();
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem(ANALYTICS_QUEUE_KEY)).toBeNull();
  });

  it('does not lose events captured while an earlier request is being flushed', async () => {
    persistAnalyticsConsent(true, localStorage);
    const fetcher = vi.fn().mockResolvedValue({ ok: true } as Response);
    let nextId = 0;
    const client = createAnalyticsClient({
      fetcher,
      projectToken: 'phc_public_project_token',
      randomId: () => `id-${++nextId}`,
      storage: localStorage,
    });

    await Promise.all([
      client.capture('onboarding_shown', {}),
      client.capture('feedback_opened', { source: 'launcher_settings' }),
    ]);

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem(ANALYTICS_QUEUE_KEY)).toBeNull();
  });

  it('deletes the identifier and pending events when consent is withdrawn', () => {
    localStorage.setItem(ANALYTICS_INSTALL_ID_KEY, 'old-id');
    localStorage.setItem(ANALYTICS_QUEUE_KEY, '[{"event":"onboarding_shown"}]');
    persistAnalyticsConsent(false, localStorage);

    expect(getAnalyticsConsent(localStorage)).toBe('denied');
    expect(localStorage.getItem(ANALYTICS_INSTALL_ID_KEY)).toBeNull();
    expect(localStorage.getItem(ANALYTICS_QUEUE_KEY)).toBeNull();
  });

  it('rejects insecure or credential-bearing analytics hosts', () => {
    expect(normalizePostHogHost('http://posthog.example')).toBeNull();
    expect(normalizePostHogHost('https://user:pass@posthog.example')).toBeNull();
    expect(normalizePostHogHost('https://posthog.example/path')).toBe('https://posthog.example');
  });
});
