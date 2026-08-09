import { useCallback, useEffect, useState } from 'react';
import { appUpdaterIPC } from '../../../services/ipc/appUpdaterIPC';
import { analyticsClient, durationBucket } from '../../analytics/analyticsClient';

const capturedUpdaterEvents = new Set<string>();
let downloadStartedAt = 0;

function safeVersion(value: string | undefined): string {
  return value && /^[A-Za-z0-9_.:+-]{1,64}$/.test(value) ? value : 'unknown';
}

function captureUpdaterEventOnce(key: string, capture: () => void): void {
  if (capturedUpdaterEvents.has(key)) return;
  capturedUpdaterEvents.add(key);
  capture();
}

export interface UpdateInfo {
  version: string;
  releaseDate?: string;
  releaseName?: string;
  releaseNotes?: string;
}

export interface UpdateProgress {
  percent: number;
  transferred: number;
  total: number;
}

export type UpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error' | 'up-to-date';

export interface UseAppUpdaterReturn {
  status: UpdateStatus;
  updateInfo: UpdateInfo | null;
  progress: UpdateProgress | null;
  error: string | null;
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  installUpdate: () => void;
}

export function useAppUpdater(autoCheck: boolean = true): UseAppUpdaterReturn {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [progress, setProgress] = useState<UpdateProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if appUpdater API is available
  const isAvailable = appUpdaterIPC.isAvailable();

  const performCheck = useCallback(async (source: 'automatic' | 'manual') => {
    void analyticsClient.capture('app_update_checked', { source });
    if (!isAvailable) {
      setError('Update system not available');
      void analyticsClient.capture('app_update_failed', { failure_stage: 'check' });
      return;
    }

    setStatus('checking');
    setError(null);
    setProgress(null);

    try {
      const result = await appUpdaterIPC.check();
      // In dev mode, electron-updater skips checking (app not packed)
      // This is expected behavior, not an error
      if (!result || result.cancelled) {
        setStatus('idle');
      }
    } catch (err) {
      // Ignore dev mode errors
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('not packed') || errorMsg.includes('dev update config')) {
        setStatus('idle');
        setError(null);
      } else {
        setStatus('error');
        setError(errorMsg || 'Failed to check for updates');
        void analyticsClient.capture('app_update_failed', { failure_stage: 'check' });
      }
    }
  }, [isAvailable]);

  const checkForUpdates = useCallback(async () => {
    await performCheck('manual');
  }, [performCheck]);

  const installUpdate = useCallback(() => {
    if (!isAvailable) return;
    void analyticsClient.capture('app_update_install_requested', { target_version: safeVersion(updateInfo?.version) });
    try {
      appUpdaterIPC.quitAndInstall();
    } catch (error) {
      void analyticsClient.capture('app_update_failed', { failure_stage: 'install' });
      throw error;
    }
  }, [isAvailable, updateInfo?.version]);

  const downloadUpdate = useCallback(async () => {
    if (!isAvailable) return;
    downloadStartedAt = Date.now();
    void analyticsClient.capture('app_update_download_started', { target_version: safeVersion(updateInfo?.version) });
    setStatus('downloading');
    setError(null);
    try {
      await appUpdaterIPC.download();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : String(err));
      void analyticsClient.capture('app_update_failed', { failure_stage: 'download' });
    }
  }, [isAvailable, updateInfo?.version]);

  useEffect(() => {
    if (!isAvailable) return;

    const statusUnsub = appUpdaterIPC.onStatus((newStatus: string) => {
      if (newStatus === 'checking') {
        setStatus('checking');
      }
    });

    const availableUnsub = appUpdaterIPC.onAvailable((info) => {
      const version = safeVersion(info.version || info.tag);
      captureUpdaterEventOnce(`available:${version}`, () => {
        void analyticsClient.capture('app_update_available', { target_version: version });
      });
      setStatus('available');
      setUpdateInfo({
        version: info.version || info.tag || 'Unknown',
        releaseDate: info.releaseDate,
        releaseName: info.releaseName,
        releaseNotes: info.releaseNotes,
      });
    });

    const notAvailableUnsub = appUpdaterIPC.onNotAvailable(() => {
      setStatus('up-to-date');
      setUpdateInfo(null);
    });

    const errorUnsub = appUpdaterIPC.onError((err: string) => {
      captureUpdaterEventOnce('event-error', () => {
        void analyticsClient.capture('app_update_failed', { failure_stage: 'event' });
      });
      setStatus('error');
      setError(err);
    });

    const progressUnsub = appUpdaterIPC.onProgress((prog) => {
      setStatus('downloading');
      setProgress({
        percent: prog.percent || 0,
        transferred: prog.transferred || 0,
        total: prog.total || 0,
      });
    });

    const downloadedUnsub = appUpdaterIPC.onDownloaded((info) => {
      const version = safeVersion(info.version);
      captureUpdaterEventOnce(`downloaded:${version}`, () => {
        void analyticsClient.capture('app_update_downloaded', {
          target_version: version,
          duration: durationBucket(downloadStartedAt ? Date.now() - downloadStartedAt : 0),
        });
      });
      setStatus('downloaded');
      setProgress(null);
      setUpdateInfo((prev) => ({
        ...prev!,
        version: info.version || prev?.version || 'Unknown',
      }));
    });

    // Auto-check on mount if enabled
    if (autoCheck) {
      // Delay auto-check slightly to avoid blocking initial render
      const timer = setTimeout(() => {
        void performCheck('automatic');
      }, 2000);
      return () => {
        clearTimeout(timer);
        statusUnsub();
        availableUnsub();
        notAvailableUnsub();
        errorUnsub();
        progressUnsub();
        downloadedUnsub();
      };
    }

    return () => {
      statusUnsub();
      availableUnsub();
      notAvailableUnsub();
      errorUnsub();
      progressUnsub();
      downloadedUnsub();
    };
  }, [isAvailable, autoCheck, performCheck]);

  return {
    status,
    updateInfo,
    progress,
    error,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
  };
}
