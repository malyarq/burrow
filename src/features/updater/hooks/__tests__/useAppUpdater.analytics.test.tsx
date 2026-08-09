// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppUpdater } from '../useAppUpdater';

const mocks = vi.hoisted(() => ({
  analyticsCapture: vi.fn(),
  available: undefined as ((info: { version?: string; tag?: string }) => void) | undefined,
  check: vi.fn(),
  download: vi.fn(),
  downloaded: undefined as ((info: { version?: string }) => void) | undefined,
  error: undefined as ((error: string) => void) | undefined,
  install: vi.fn(),
}));

vi.mock('../../../../services/ipc/appUpdaterIPC', () => ({
  appUpdaterIPC: {
    isAvailable: () => true,
    check: mocks.check,
    download: mocks.download,
    quitAndInstall: mocks.install,
    onStatus: () => vi.fn(),
    onAvailable: (callback: typeof mocks.available) => { mocks.available = callback; return vi.fn(); },
    onNotAvailable: () => vi.fn(),
    onError: (callback: typeof mocks.error) => { mocks.error = callback; return vi.fn(); },
    onProgress: () => vi.fn(),
    onDownloaded: (callback: typeof mocks.downloaded) => { mocks.downloaded = callback; return vi.fn(); },
  },
}));

vi.mock('../../../analytics/analyticsClient', () => ({
  analyticsClient: { capture: mocks.analyticsCapture },
  durationBucket: () => '1s_3s',
}));

describe('useAppUpdater analytics', () => {
  beforeEach(() => {
    mocks.analyticsCapture.mockReset().mockResolvedValue('sent');
    mocks.check.mockReset().mockResolvedValue({ cancelled: false });
    mocks.download.mockReset().mockResolvedValue(undefined);
    mocks.install.mockReset();
  });

  it('records the update funnel without release notes or error text', async () => {
    const { result } = renderHook(() => useAppUpdater(false));

    await act(async () => result.current.checkForUpdates());
    expect(mocks.analyticsCapture).toHaveBeenCalledWith('app_update_checked', { source: 'manual' });

    act(() => mocks.available?.({ version: '0.13.0' }));
    expect(mocks.analyticsCapture).toHaveBeenCalledWith('app_update_available', { target_version: '0.13.0' });

    await act(async () => result.current.downloadUpdate());
    expect(mocks.analyticsCapture).toHaveBeenCalledWith('app_update_download_started', { target_version: '0.13.0' });

    act(() => mocks.downloaded?.({ version: '0.13.0' }));
    expect(mocks.analyticsCapture).toHaveBeenCalledWith('app_update_downloaded', {
      target_version: '0.13.0', duration: '1s_3s',
    });

    act(() => result.current.installUpdate());
    expect(mocks.analyticsCapture).toHaveBeenCalledWith('app_update_install_requested', { target_version: '0.13.0' });

    act(() => mocks.error?.('private path /Users/example and raw updater response'));
    expect(mocks.analyticsCapture).toHaveBeenCalledWith('app_update_failed', { failure_stage: 'event' });
    expect(JSON.stringify(mocks.analyticsCapture.mock.calls)).not.toContain('/Users/example');
  });
});
