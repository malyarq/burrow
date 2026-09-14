import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getOrWaitPeerConnection } from '../joinPeer';

class Swarm extends EventEmitter {
  connections = new Set<unknown>();
}

describe('getOrWaitPeerConnection', () => {
  afterEach(() => vi.useRealTimers());

  it('rejects an already aborted attempt even if a peer exists', async () => {
    const swarm = new Swarm();
    swarm.connections.add({});
    await expect(getOrWaitPeerConnection({ swarm: swarm as never, signal: AbortSignal.abort() })).rejects.toThrow('stopped');
    expect(swarm.listenerCount('connection')).toBe(0);
  });

  it.each(['timeout', 'abort', 'peer'] as const)('cleans listeners and timer after %s', async (outcome) => {
    vi.useFakeTimers();
    const swarm = new Swarm();
    const controller = new AbortController();
    const remove = vi.spyOn(controller.signal, 'removeEventListener');
    const pending = getOrWaitPeerConnection({ swarm: swarm as never, signal: controller.signal, timeoutMs: 10 });
    const result = pending.then((peer) => ({ peer }), (error: Error) => ({ error: error.message }));
    if (outcome === 'timeout') await vi.advanceTimersByTimeAsync(10);
    if (outcome === 'abort') controller.abort();
    if (outcome === 'peer') swarm.emit('connection', 'peer');
    expect(await result).toEqual(outcome === 'peer' ? { peer: 'peer' } : { error: expect.stringMatching(outcome === 'abort' ? /stopped/ : /timeout/) });
    expect(swarm.listenerCount('connection')).toBe(0);
    expect(remove).toHaveBeenCalledWith('abort', expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
    swarm.emit('connection', 'late peer');
    controller.abort();
  });

  it('settles once when a peer arrives immediately before timeout', async () => {
    vi.useFakeTimers();
    const swarm = new Swarm();
    const pending = getOrWaitPeerConnection({ swarm: swarm as never, timeoutMs: 10 });
    await vi.advanceTimersByTimeAsync(9);
    swarm.emit('connection', 'peer');
    await vi.advanceTimersByTimeAsync(1);
    await expect(pending).resolves.toBe('peer');
    expect(swarm.listenerCount('connection')).toBe(0);
  });
});
