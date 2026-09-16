import { useEffect, useRef } from 'react';
import type { LauncherSessionSnapshot } from '@shared/contracts';
import { launcherIPC } from '../../../services/ipc/launcherIPC';
import {
  getLaunchStageTitle,
  getLaunchStatusFromLog,
  getLauncherSessionEndedLog,
  getLauncherUnavailableDetail,
  getMeaningfulProgressPercent,
  getProgressStatus,
  isTrackableProgressType,
  shouldApplyLaunchStatus,
  type LaunchStage,
  type LauncherProgressEvent,
} from '../services/launcherService';

function translateWithFallback(t: (key: string) => string, key: string, fallback: string) {
  const translated = t(key);
  return translated === key ? fallback : translated;
}

export function useLauncherIPC(params: {
  t: (key: string, params?: Record<string, string | number>) => string;
  onAppendLog: (log: string) => void;
  onSetProgress: (percent: number) => void;
  onSetStatusText: (text: string) => void;
  onSetStatusDetail: (text: string) => void;
  onSetLaunchStage: (stage: LaunchStage) => void;
  onSetLaunching: (isLaunching: boolean) => void;
  onClearProgress: () => void;
  getLaunchStage: () => LaunchStage;
}) {
  const {
    t,
    onAppendLog,
    onSetProgress,
    onSetStatusText,
    onSetStatusDetail,
    onSetLaunchStage,
    onSetLaunching,
    onClearProgress,
    getLaunchStage,
  } = params;
  const lastSessionRevision = useRef(-1);

  // Subscribe to launcher events once for the active language.
  useEffect(() => {
    if (!launcherIPC.isAvailable()) {
      const unavailableDetail = getLauncherUnavailableDetail(t);
      onSetStatusText(getLaunchStageTitle('failed', t));
      onSetStatusDetail(unavailableDetail);
      onSetLaunchStage('failed');
      onAppendLog(unavailableDetail);
      return;
    }

    const unsubLog = launcherIPC.onLog((log) => {
      onAppendLog(log);
      const nextStatus = getLaunchStatusFromLog(log, t);
      if (nextStatus && shouldApplyLaunchStatus({ currentStage: getLaunchStage(), nextStage: nextStatus.stage, source: 'log' })) {
        onSetLaunchStage(nextStatus.stage);
        onSetStatusText(nextStatus.title);
        onSetStatusDetail(nextStatus.detail);
      }
    });

    const unsubProgress = launcherIPC.onProgress((data: LauncherProgressEvent) => {
      if (isTrackableProgressType(data.type)) {
        const percent = getMeaningfulProgressPercent(data);
        const nextStatus = getProgressStatus(data, t);
        if (percent === null) {
          onClearProgress();
        } else {
          onSetProgress(percent);
        }
        onSetLaunchStage(nextStatus.stage);
        onSetStatusText(nextStatus.title);
        onSetStatusDetail(nextStatus.detail);
      }
    });

    const unsubClose = launcherIPC.onClose((code) => {
      onAppendLog(getLauncherSessionEndedLog(code, t));
      const currentStage = getLaunchStage();
      if (code !== 0 && currentStage !== 'failed') {
        onSetLaunchStage('failed');
        onSetStatusText(translateWithFallback(t, 'status.failed', 'Launch Failed'));
        onSetStatusDetail(
          translateWithFallback(t, 'status.exit_code', 'Minecraft closed with exit code {{code}}').replace('{{code}}', String(code))
        );
      } else if (currentStage !== 'failed') {
        onSetLaunchStage('idle');
        onSetStatusText('');
        onSetStatusDetail('');
      }
      onSetLaunching(false);
      onClearProgress();
    });

    const applySessionState = (snapshot: LauncherSessionSnapshot) => {
      if (snapshot.revision < lastSessionRevision.current) return;
      lastSessionRevision.current = snapshot.revision;
      if (snapshot.phase === 'preparing') {
        onSetLaunching(true);
        onSetLaunchStage('preparing');
        onSetStatusText(getLaunchStageTitle('preparing', t));
        onSetStatusDetail(translateWithFallback(t, 'status.preparing_detail', 'Checking runtime requirements and selected pack.'));
        return;
      }
      if (snapshot.phase === 'starting') {
        onSetLaunching(true);
        onClearProgress();
        onSetLaunchStage('waiting');
        onSetStatusText(getLaunchStageTitle('waiting', t));
        onSetStatusDetail(translateWithFallback(t, 'status.waiting_detail', 'Minecraft process started. Waiting for the game window and logs.'));
        return;
      }
      if (snapshot.phase === 'running') {
        onSetLaunching(true);
        onClearProgress();
        onSetLaunchStage('running');
        onSetStatusText(getLaunchStageTitle('running', t));
        onSetStatusDetail('');
        return;
      }
      onSetLaunching(false);
      onClearProgress();
      if (snapshot.phase === 'failed') {
        onSetLaunchStage('failed');
        onSetStatusText(getLaunchStageTitle('failed', t));
        onSetStatusDetail(snapshot.exitCode === undefined
          ? translateWithFallback(t, 'status.launch_failed_detail', 'Minecraft could not be started.')
          : translateWithFallback(t, 'status.exit_code', 'Minecraft closed with exit code {{code}}').replace('{{code}}', String(snapshot.exitCode)));
        return;
      }
      onSetLaunchStage('idle');
      onSetStatusText('');
      onSetStatusDetail('');
    };

    let mounted = true;
    const unsubSessionState = launcherIPC.onSessionState(applySessionState);
    void launcherIPC.getSessionState().then((snapshot) => {
      if (mounted) applySessionState(snapshot);
    }).catch(() => {
      // The launch boundary reports unavailable IPC to the user.
    });

    return () => {
      mounted = false;
      unsubLog();
      unsubProgress();
      unsubClose();
      unsubSessionState();
    };
  }, [
    t,
    onAppendLog,
    onSetProgress,
    onSetStatusText,
    onSetStatusDetail,
    onSetLaunchStage,
    onSetLaunching,
    onClearProgress,
    getLaunchStage,
  ]);

  const sendStdin = async (data: string) => {
    if (launcherIPC.isAvailable() && launcherIPC.has('sendStdin')) {
      await launcherIPC.sendStdin(data);
    }
  };

  return { sendStdin };
}
