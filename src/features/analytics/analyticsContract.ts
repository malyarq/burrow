export type AnalyticsPlatform = 'windows' | 'macos' | 'linux' | 'other';
export type ModLoader = 'vanilla' | 'forge' | 'fabric' | 'neoforge';
export type DurationBucket =
  | 'under_250ms' | '250ms_1s' | '1s_3s' | '3s_10s' | '10s_30s'
  | '30s_1m' | '1m_3m' | '3m_10m' | 'over_10m';
export type CountBucket = '0' | '1' | '2' | '3_5' | '6_10' | 'over_10';
export type ResultCountBucket = '0' | '1_10' | '11_50' | '51_100' | 'over_100';
export type TrafficBucket = 'none' | 'under_1mb' | '1mb_10mb' | '10mb_100mb' | '100mb_1gb' | '1gb_10gb' | 'over_10gb';

export type AnalyticsEventMap = {
  analytics_enabled: { source: 'onboarding' | 'settings' };
  app_opened: { language: 'en' | 'ru'; ui_mode: 'simple' | 'modpacks'; startup_duration: DurationBucket };
  fatal_error: { surface: 'bootstrap' | 'app'; recovery: 'restart' | 'recover' | 'unavailable' };
  fatal_recovery: { surface: 'bootstrap' | 'app'; outcome: 'succeeded' | 'failed' };
  game_launch_started: { loader: ModLoader; link_active: boolean };
  game_launch_succeeded: { loader: ModLoader; link_active: boolean; duration: DurationBucket };
  game_launch_failed: { failure_stage: 'ipc_unavailable' | 'launch'; loader: ModLoader; link_active: boolean; duration: DurationBucket };
  feedback_opened: { source: 'launcher_settings' };
  onboarding_shown: Record<string, never>;
  onboarding_action: {
    action: 'play_now' | 'burrow_link' | 'modpacks' | 'settings' | 'tour_started' | 'tour_completed' | 'tour_skipped';
  };
  burrow_link_viewed: { network_mode: 'hyperswarm' | 'lan' | 'upnp' };
  burrow_link_attempt_started: { role: 'host' | 'join'; attempt_id?: string };
  burrow_link_discovery_ready: { role: 'host' | 'join'; attempt_id?: string; duration: DurationBucket };
  burrow_link_invite_copied: { attempt_id?: string };
  burrow_link_peer_connected: {
    role: 'host' | 'join'; attempt_id?: string; connection_mode: 'direct' | 'relayed' | 'unknown'; duration: DurationBucket;
  };
  burrow_link_game_connected: { role: 'host' | 'join'; attempt_id?: string };
  burrow_link_peer_disconnected: { role: 'host' | 'join'; attempt_id?: string; qualified: boolean; duration: DurationBucket };
  burrow_link_session_ended: {
    role: 'host' | 'join'; attempt_id?: string; connection_mode: 'direct' | 'relayed' | 'unknown';
    duration: DurationBucket; traffic: TrafficBucket; peak_peers: CountBucket; game_connections: CountBucket;
    qualified: boolean; end_reason: 'user' | 'cleanup_failed' | 'unknown';
  };
  burrow_link_failed: {
    role: 'host' | 'join'; attempt_id?: string;
    failure_stage: 'validation' | 'discovery' | 'peer' | 'local_game' | 'cleanup' | 'unknown';
    diagnostic_code: string; duration: DurationBucket;
  };
  network_mode_selected: { mode: 'hyperswarm' | 'lan' | 'upnp' };
  settings_backup_exported: Record<string, never>;
  settings_backup_imported: Record<string, never>;
  operation_finished: {
    kind: 'duplicate' | 'import' | 'import_share' | 'install_curseforge' | 'install_modrinth' | 'update' | 'delete' | 'export';
    result: 'succeeded' | 'recovered' | 'degraded' | 'cancelled' | 'failed' | 'recovery_required';
    duration: DurationBucket;
  };
  app_update_checked: { source: 'automatic' | 'manual' };
  app_update_available: { target_version: string };
  app_update_download_started: { target_version: string };
  app_update_downloaded: { target_version: string; duration: DurationBucket };
  app_update_install_requested: { target_version: string };
  app_update_failed: { failure_stage: 'check' | 'download' | 'install' | 'event' };
  catalog_search_finished: {
    provider: 'modrinth' | 'curseforge'; outcome: 'succeeded' | 'failed'; has_query: boolean; has_filters: boolean;
    results: ResultCountBucket; duration: DurationBucket;
  };
  catalog_project_opened: { provider: 'modrinth' | 'curseforge'; outcome: 'succeeded' | 'failed'; duration: DurationBucket };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export const ANALYTICS_PROPERTY_KEYS = {
  analytics_enabled: ['source'],
  app_opened: ['language', 'ui_mode', 'startup_duration'],
  fatal_error: ['surface', 'recovery'],
  fatal_recovery: ['surface', 'outcome'],
  game_launch_started: ['loader', 'link_active'],
  game_launch_succeeded: ['loader', 'link_active', 'duration'],
  game_launch_failed: ['failure_stage', 'loader', 'link_active', 'duration'],
  feedback_opened: ['source'],
  onboarding_shown: [],
  onboarding_action: ['action'],
  burrow_link_viewed: ['network_mode'],
  burrow_link_attempt_started: ['role', 'attempt_id'],
  burrow_link_discovery_ready: ['role', 'attempt_id', 'duration'],
  burrow_link_invite_copied: ['attempt_id'],
  burrow_link_peer_connected: ['role', 'attempt_id', 'connection_mode', 'duration'],
  burrow_link_game_connected: ['role', 'attempt_id'],
  burrow_link_peer_disconnected: ['role', 'attempt_id', 'qualified', 'duration'],
  burrow_link_session_ended: ['role', 'attempt_id', 'connection_mode', 'duration', 'traffic', 'peak_peers', 'game_connections', 'qualified', 'end_reason'],
  burrow_link_failed: ['role', 'attempt_id', 'failure_stage', 'diagnostic_code', 'duration'],
  network_mode_selected: ['mode'],
  settings_backup_exported: [],
  settings_backup_imported: [],
  operation_finished: ['kind', 'result', 'duration'],
  app_update_checked: ['source'],
  app_update_available: ['target_version'],
  app_update_download_started: ['target_version'],
  app_update_downloaded: ['target_version', 'duration'],
  app_update_install_requested: ['target_version'],
  app_update_failed: ['failure_stage'],
  catalog_search_finished: ['provider', 'outcome', 'has_query', 'has_filters', 'results', 'duration'],
  catalog_project_opened: ['provider', 'outcome', 'duration'],
} as const satisfies { [K in AnalyticsEventName]: readonly (keyof AnalyticsEventMap[K] & string)[] };

export function durationBucket(milliseconds: number): DurationBucket {
  if (milliseconds < 250) return 'under_250ms';
  if (milliseconds < 1_000) return '250ms_1s';
  if (milliseconds < 3_000) return '1s_3s';
  if (milliseconds < 10_000) return '3s_10s';
  if (milliseconds < 30_000) return '10s_30s';
  if (milliseconds < 60_000) return '30s_1m';
  if (milliseconds < 180_000) return '1m_3m';
  if (milliseconds < 600_000) return '3m_10m';
  return 'over_10m';
}

export function countBucket(value: number): CountBucket {
  if (value <= 0) return '0';
  if (value === 1) return '1';
  if (value === 2) return '2';
  if (value <= 5) return '3_5';
  if (value <= 10) return '6_10';
  return 'over_10';
}

export function resultCountBucket(value: number): ResultCountBucket {
  if (value <= 0) return '0';
  if (value <= 10) return '1_10';
  if (value <= 50) return '11_50';
  if (value <= 100) return '51_100';
  return 'over_100';
}

export function trafficBucket(bytes: number): TrafficBucket {
  if (bytes <= 0) return 'none';
  if (bytes < 1_000_000) return 'under_1mb';
  if (bytes < 10_000_000) return '1mb_10mb';
  if (bytes < 100_000_000) return '10mb_100mb';
  if (bytes < 1_000_000_000) return '100mb_1gb';
  if (bytes < 10_000_000_000) return '1gb_10gb';
  return 'over_10gb';
}

export async function deriveAnalyticsAttemptId(roomCode: string): Promise<string | undefined> {
  const normalized = roomCode.trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(normalized) || !globalThis.crypto?.subtle) return undefined;
  const input = new TextEncoder().encode(`burrow-link-analytics-v1:${normalized}`);
  const digest = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', input));
  return Array.from(digest.slice(0, 16), (value) => value.toString(16).padStart(2, '0')).join('');
}
