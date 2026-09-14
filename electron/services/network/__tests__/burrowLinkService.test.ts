import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BurrowLinkService } from '../burrowLinkService';
import * as joinPeer from '../joinPeer';

function joinHarness(swarm: FakeSwarm) {
  let accept: (socket: PassThrough) => Promise<void>;
  const server = Object.assign(new EventEmitter(), {
    listening: false,
    listen: vi.fn((_port: number, _host: string, ready: () => void) => { server.listening = true; ready(); }),
    address: () => ({ port: 30000 }),
    close: vi.fn((done: () => void) => { server.listening = false; done(); }),
  });
  const service = new BurrowLinkService({
    createSwarm: (() => swarm) as never,
    createServer: ((callback: typeof accept) => { accept = callback; return server; }) as never,
  });
  return { service, connect: (socket: PassThrough) => accept(socket) };
}

class FakeDiscovery {
  public flushed = vi.fn(async () => undefined);
  public destroy = vi.fn(async () => undefined);
}

class FakeSwarm extends EventEmitter {
  public readonly discovery = new FakeDiscovery();
  public readonly connections = new Set<unknown>();
  public join = vi.fn(() => this.discovery);
  public destroy = vi.fn(async () => undefined);
  public leave = vi.fn(async () => undefined);
}

class FakeConnection extends EventEmitter {
  public write = vi.fn();
  public destroy = vi.fn();
}

function serviceWith(...swarms: FakeSwarm[]) {
  let index = 0;
  return new BurrowLinkService({
    createSwarm: (() => swarms[index++]) as never,
    randomBytes: (() => Buffer.alloc(32, 7)) as never,
  });
}

describe('BurrowLinkService', () => {
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it('exposes a timeout while keeping the endpoint usable for retry', async () => {
    vi.useFakeTimers();
    const swarm = new FakeSwarm();
    const { service, connect } = joinHarness(swarm);
    await expect(service.join('ab'.repeat(32))).resolves.toMatchObject({ state: 'active', peerCount: 0, metrics: { activeGameConnectionCount: 0, gameConnectionCount: 0 } });
    const socket = new PassThrough();
    const attempt = connect(socket);
    await vi.advanceTimersByTimeAsync(5000);
    await attempt;
    expect(socket.destroyed).toBe(true);
    expect(service.getState()).toMatchObject({ state: 'active', localPort: 30000, diagnostic: { code: 'TUNNEL_PEER_UNAVAILABLE' }, metrics: { gameConnectionCount: 0 } });
    expect(swarm.listenerCount('connection')).toBe(1);
    const peer = new FakeConnection();
    swarm.connections.add(peer);
    swarm.emit('connection', peer);
    let finish: (() => void) | undefined;
    vi.spyOn(joinPeer, 'bridgeLocalSocketToMuxer').mockImplementation(({ onGameConnectionOpened, onGameConnectionClosed }) => {
      onGameConnectionOpened?.();
      finish = () => onGameConnectionClosed?.(12);
    });
    const retry = new PassThrough();
    await connect(retry);
    expect(service.getState()).toMatchObject({ peerCount: 1, metrics: { gameConnectionCount: 1, activeGameConnectionCount: 1 } });
    expect(service.getState().diagnostic).toBeUndefined();
    finish?.();
    expect(service.getState().metrics).toMatchObject({ gameConnectionCount: 1, activeGameConnectionCount: 0, transferredBytes: 12 });
    await service.stop();
    expect(retry.destroyed).toBe(true);
  });

  it.each(['socket', 'stop'] as const)('cancels peer waiting on %s close without a false failure', async (reason) => {
    const swarm = new FakeSwarm();
    const { service, connect } = joinHarness(swarm);
    await service.join('ab'.repeat(32));
    const socket = new PassThrough();
    const attempt = connect(socket);
    expect(swarm.listenerCount('connection')).toBe(2);
    if (reason === 'socket') socket.destroy();
    else await service.stop();
    await attempt;
    expect(swarm.listenerCount('connection')).toBe(1);
    expect(service.getState().diagnostic).toBeUndefined();
    expect(service.getState().metrics?.gameConnectionCount ?? 0).toBe(0);
    await service.stop();
  });
  it('owns and destroys a complete host session', async () => {
    const swarm = new FakeSwarm();
    const service = serviceWith(swarm);
    const active = await service.host(25_565);
    expect(active).toMatchObject({ state: 'active', role: 'host', roomCode: '07'.repeat(32) });
    expect(swarm.join).toHaveBeenCalledOnce();

    await expect(service.stop()).resolves.toMatchObject({ state: 'idle', role: null });
    expect(swarm.discovery.destroy).toHaveBeenCalledOnce();
    expect(swarm.destroy).toHaveBeenCalledOnce();
  });

  it('publishes only coarse-safe source metrics for a direct peer session', async () => {
    const swarm = new FakeSwarm();
    let now = 1_000;
    const service = new BurrowLinkService({
      createSwarm: (() => swarm) as never,
      now: () => now,
      randomBytes: (() => Buffer.alloc(32, 7)) as never,
    });
    const snapshots: ReturnType<typeof service.getState>[] = [];
    service.subscribe((snapshot) => snapshots.push(snapshot));

    await service.host(25_565);
    now = 1_500;
    const connection = new FakeConnection();
    swarm.emit('connection', connection);

    expect(service.getState()).toMatchObject({
      peerCount: 1,
      metrics: {
        connectionMode: 'direct',
        connectDurationMs: 500,
        peakPeerCount: 1,
        gameConnectionCount: 0,
        transferredBytes: 0,
      },
    });

    now = 62_000;
    await service.stop();
    expect(snapshots.filter((snapshot) => snapshot.state === 'stopping').at(-1)?.metrics).toMatchObject({
      sessionDurationMs: 61_000,
      peakPeerCount: 1,
    });
  });

  it('rejects malformed room codes before discovery', async () => {
    const swarm = new FakeSwarm();
    const service = serviceWith(swarm);
    await expect(service.join('not-a-room')).resolves.toMatchObject({
      state: 'failed', diagnostic: { code: 'INVALID_REQUEST' },
    });
    expect(swarm.join).not.toHaveBeenCalled();
  });

  it('contains discovery failure and cleans the created swarm', async () => {
    const swarm = new FakeSwarm();
    swarm.discovery.flushed.mockRejectedValueOnce(new Error('DHT unavailable'));
    const service = serviceWith(swarm);
    await expect(service.host(25_565)).resolves.toMatchObject({
      state: 'failed', diagnostic: { code: 'TUNNEL_DISCOVERY_FAILED' },
    });
    expect(swarm.discovery.destroy).toHaveBeenCalledOnce();
    expect(swarm.destroy).toHaveBeenCalledOnce();
  });

  it('fully stops the host before starting a join session', async () => {
    const hostSwarm = new FakeSwarm();
    const joinSwarm = new FakeSwarm();
    const service = serviceWith(hostSwarm, joinSwarm);
    await service.host(25_565);
    const joined = await service.join('ab'.repeat(32));
    expect(hostSwarm.destroy).toHaveBeenCalledOnce();
    expect(joined).toMatchObject({ state: 'active', role: 'join' });
    await service.stop();
    expect(joinSwarm.destroy).toHaveBeenCalledOnce();
  });

  it('serializes concurrent starts without retaining the first session', async () => {
    const first = new FakeSwarm();
    const second = new FakeSwarm();
    const service = serviceWith(first, second);
    const [host, join] = await Promise.all([service.host(25_565), service.join('cd'.repeat(32))]);
    expect(host.role).toBe('host');
    expect(join.role).toBe('join');
    expect(first.destroy).toHaveBeenCalledOnce();
    await service.stop();
  });
});
