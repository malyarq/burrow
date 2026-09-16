import { afterEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({ handlers: new Map<string, (...args: unknown[]) => unknown>() }));

vi.mock('electron', () => ({
  ipcMain: {
    removeHandler: (channel: string) => mocked.handlers.delete(channel),
    handle: (channel: string, handler: (...args: unknown[]) => unknown) => mocked.handlers.set(channel, handler),
  },
}));

import { registerLauncherHandlers } from '../launcherHandlers';

describe('launcher session IPC', () => {
  afterEach(() => mocked.handlers.clear());

  it('returns the main-owned snapshot and forwards revisioned updates', async () => {
    let listener: ((snapshot: { revision: number; phase: 'running' }) => void) | null = null;
    const launcher = {
      setStateListener: (next: typeof listener) => { listener = next; },
      setGameLifecycleListeners: vi.fn(),
      shouldHideLauncherWindow: () => false,
      getSessionState: () => ({ revision: 7, phase: 'running' as const }),
    };
    const send = vi.fn();
    registerLauncherHandlers({
      window: { isDestroyed: () => false, webContents: { send } } as never,
      launcher: launcher as never,
      sendLog: vi.fn(),
    });

    expect(mocked.handlers.get('launcher:getSessionState')?.({})).toEqual({ revision: 7, phase: 'running' });
    const publish = listener as unknown as (snapshot: { revision: number; phase: 'running' }) => void;
    publish({ revision: 8, phase: 'running' });
    expect(send).toHaveBeenCalledWith('launcher:sessionState', { revision: 8, phase: 'running' });
  });
});
