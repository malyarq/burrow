// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BurrowLinkSnapshot } from '../../../../../shared/contracts/network';
import { useMultiplayer } from '../useMultiplayer';

const mocks = vi.hoisted(() => ({
  getState: vi.fn(), onState: vi.fn(), join: vi.fn(), patchConfig: vi.fn(), unsubscribe: vi.fn(),
  beginAttempt: vi.fn(), discoveryReady: vi.fn(), failed: vi.fn(), validationFailed: vi.fn(),
  t: (key: string) => key,
}));
vi.mock('../../../../contexts/SettingsContext', () => ({ useSettings: () => ({ t: mocks.t }) }));
vi.mock('../../../instances/hooks/useEffectiveInstance', () => ({ useEffectiveInstance: () => ({ status: 'ready', data: { id: 'test', snapshot: { id: 'test', networkMode: 'hyperswarm' } } }) }));
vi.mock('../../../instances/hooks/useInstanceConfigCommands', () => ({
  useInstanceConfigCommands: () => ({ patchConfig: mocks.patchConfig }), dispatchInstanceConfigCommand: vi.fn(),
}));
vi.mock('../useBurrowLinkAnalytics', () => ({ useBurrowLinkAnalytics: () => mocks }));
vi.mock('../../../../services/ipc/networkIPC', () => ({ networkIPC: {
  isAvailable: () => true,
  tunnel: { getState: mocks.getState, onState: mocks.onState, join: mocks.join },
  lan: { getState: async () => ({ revision: 0, state: 'idle' }), onState: () => () => undefined, onDiscover: () => () => undefined },
  upnp: { getState: async () => ({ revision: 0, state: 'idle' }), onState: () => () => undefined },
} }));

const idle: BurrowLinkSnapshot = { revision: 0, state: 'idle', role: null, peerCount: 0 };
describe('useMultiplayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.getState.mockResolvedValue(idle);
    mocks.onState.mockReturnValue(mocks.unsubscribe);
    mocks.patchConfig.mockResolvedValue(undefined);
  });
  afterEach(cleanup);

  it('does not overwrite events with a delayed initial snapshot or older event', async () => {
    let resolve!: (value: BurrowLinkSnapshot) => void;
    mocks.getState.mockReturnValue(new Promise<BurrowLinkSnapshot>((done) => { resolve = done; }));
    const { result, unmount } = renderHook(() => useMultiplayer());
    const onState = mocks.onState.mock.calls[0][0] as (value: BurrowLinkSnapshot) => void;
    act(() => onState({ ...idle, revision: 3, state: 'active', role: 'join', localPort: 30000, peerCount: 1 }));
    await act(async () => resolve({ ...idle, revision: 1 }));
    act(() => onState({ ...idle, revision: 2 }));
    expect(result.current.tunnel.revision).toBe(3);
    expect(result.current.directAddress).toBe('localhost:30000');
    unmount();
    expect(mocks.unsubscribe).toHaveBeenCalledOnce();
    act(() => onState({ ...idle, revision: 4 }));
  });

  it('rejects invalid input without changing the instance server', async () => {
    const { result } = renderHook(() => useMultiplayer());
    act(() => result.current.setJoinCode('invalid'));
    await act(async () => result.current.join());
    expect(mocks.join).not.toHaveBeenCalled();
    expect(mocks.patchConfig).not.toHaveBeenCalled();
    expect(result.current.status).toBe('multiplayer.room_code_invalid');
  });

  it('persists a usable local game address without asserting a peer exists', async () => {
    const code = 'ab'.repeat(32);
    mocks.join.mockResolvedValue({ ...idle, revision: 1, state: 'active', role: 'join', localPort: 30000 });
    const { result } = renderHook(() => useMultiplayer());
    act(() => result.current.setJoinCode(code));
    await act(async () => result.current.join());
    expect(mocks.patchConfig).toHaveBeenCalledWith({ server: { host: 'localhost', port: 30000 } });
    expect(mocks.discoveryReady).toHaveBeenCalledWith(code);
    expect(result.current.tunnel.peerCount).toBe(0);
  });
});
