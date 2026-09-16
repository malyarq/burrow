// @vitest-environment jsdom

import { renderHook, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useLauncherIPC } from '../useLauncherIPC';
import type { LauncherSessionSnapshot } from '@shared/contracts';

const mocked = vi.hoisted(() => ({
  sessionListeners: new Set<(snapshot: LauncherSessionSnapshot) => void>(),
  snapshot: Promise.resolve({ revision: 0, phase: 'idle' as const }) as Promise<LauncherSessionSnapshot>,
}));

vi.mock('../../../../services/ipc/launcherIPC', () => ({
  launcherIPC: {
    isAvailable: () => true,
    onLog: () => () => undefined,
    onProgress: () => () => undefined,
    onClose: () => () => undefined,
    onSessionState: (listener: (snapshot: LauncherSessionSnapshot) => void) => {
      mocked.sessionListeners.add(listener);
      return () => mocked.sessionListeners.delete(listener);
    },
    getSessionState: () => mocked.snapshot,
    has: () => false,
  },
}));

describe('useLauncherIPC session snapshots', () => {
  it('keeps a newer running event when an older snapshot query resolves after remount', async () => {
    let resolveSnapshot!: (snapshot: LauncherSessionSnapshot) => void;
    mocked.snapshot = new Promise<LauncherSessionSnapshot>((resolve) => { resolveSnapshot = resolve; });

    const { result } = renderHook(() => {
      const [isLaunching, setIsLaunching] = useState(false);
      const [stage, setStage] = useState('idle');
      useLauncherIPC({
        t: (key) => key,
        onAppendLog: vi.fn(),
        onSetProgress: vi.fn(),
        onSetStatusText: vi.fn(),
        onSetStatusDetail: vi.fn(),
        onSetLaunchStage: setStage as never,
        onSetLaunching: setIsLaunching,
        onClearProgress: vi.fn(),
        getLaunchStage: () => stage as never,
      });
      return { isLaunching, stage };
    });

    for (const listener of mocked.sessionListeners) listener({ revision: 4, phase: 'starting' });
    await waitFor(() => expect(result.current).toEqual({ isLaunching: true, stage: 'waiting' }));

    resolveSnapshot({ revision: 3, phase: 'idle' });
    await Promise.resolve();
    expect(result.current).toEqual({ isLaunching: true, stage: 'waiting' });
  });
});
