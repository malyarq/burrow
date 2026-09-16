import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import type { ChildProcess } from 'node:child_process';
import type { LaunchAdapters } from '../../../infrastructure/instances/launchAdapters';

const mocked = vi.hoisted(() => ({ prepare: vi.fn(), kill: vi.fn() }));
vi.mock('tree-kill', () => ({ default: mocked.kill }));
vi.mock('../preLaunchSetup', () => ({
  prepareLaunchContext: mocked.prepare,
  ensureAuthInjector: vi.fn(async () => ({ destInjectorPath: 'injector.jar' })),
  createOfflineSession: vi.fn(() => ({ accessToken: 'token', selectedProfile: { id: 'id', name: 'Steve' } })),
}));
vi.mock('../modLoaderInstaller', () => ({ installModLoaderIfNeeded: vi.fn(async () => '1.20.1') }));
vi.mock('../legacyCompatibility', () => ({ patchForgeVersionMetadata: vi.fn(), prefetchLegacyForgeRuntimeDeps: vi.fn() }));
import { LauncherManager } from '../orchestrator';

const options = { nickname: 'Steve', version: '1.20.1', ram: 4 };
const prepared = {
  rootPath: 'C:/launcher', instanceId: 'classic', instancePath: 'C:/launcher/classic', record: { name: 'Classic' },
  effective: { requestedVersion: '1.20.1', ramGb: 4, effectiveVmOptions: [], effectiveMcArgs: [] },
};
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function childProcess() {
  return Object.assign(new EventEmitter(), { pid: 123456, kill: vi.fn(() => true) }) as unknown as ChildProcess;
}
function createLauncher(spawnMinecraft: LaunchAdapters['spawnMinecraft']) {
  return new LauncherManager({
    javaManager: {} as never,
    downloads: { getDownloadProvider: () => ({}), warmupMirrors: async () => undefined, buildInstallerOptions: () => ({}) } as never,
    vanilla: { ensureVanillaInstalled: async () => undefined } as never,
    instances: {} as never, rootResolver: {} as never,
    launchAdapters: { resolveJavaPath: async () => 'java', spawnMinecraft } as never,
    launcherRootPath: 'C:/launcher', logInstalledMods: async () => undefined,
  });
}

describe('LauncherManager public lifecycle', () => {
  beforeEach(() => {
    mocked.prepare.mockReset().mockResolvedValue(prepared);
    mocked.kill.mockReset().mockImplementation((_pid, _signal, callback) => callback(null));
  });
  afterEach(() => vi.useRealTimers());

  it('rejects concurrent launch and drains cancelled preparation without spawning', async () => {
    const pending = deferred<typeof prepared>();
    mocked.prepare.mockReturnValueOnce(pending.promise);
    const spawn = vi.fn();
    const manager = createLauncher(spawn);
    const first = manager.launchGame(options, vi.fn(), vi.fn(), vi.fn());
    await expect(manager.launchGame(options, vi.fn(), vi.fn(), vi.fn())).rejects.toThrow('already in progress');
    let drained = false;
    const shutdown = manager.beginShutdown().then(() => { drained = true; });
    await Promise.resolve();
    expect(drained).toBe(false);
    const failure = expect(first).rejects.toThrow('cancelled');
    pending.resolve(prepared);
    await failure;
    await shutdown;
    expect(spawn).not.toHaveBeenCalled();
    await expect(manager.launchGame(options, vi.fn(), vi.fn(), vi.fn())).rejects.toThrow('shutting down');
  });

  it.each([false, true])('closes once without reattaching an early-exit child; shutdown=%s', async (shutdownRequested) => {
    const settled = deferred<void>();
    const attached = deferred<void>();
    const child = childProcess();
    const spawn = vi.fn<LaunchAdapters['spawnMinecraft']>().mockImplementation(async ({ onSpawn }) => {
      onSpawn?.(child);
      child.emit('close', 0);
      child.emit('close', 0);
      attached.resolve();
      await settled.promise;
      return child;
    });
    const manager = createLauncher(spawn);
    const onClose = vi.fn();
    const launch = manager.launchGame(options, vi.fn(), vi.fn(), onClose);
    await attached.promise;
    expect(onClose).toHaveBeenCalledOnce();
    let drained = false;
    const shutdown = shutdownRequested ? manager.beginShutdown().then(() => { drained = true; }) : Promise.resolve();
    await Promise.resolve();
    expect(drained).toBe(false);
    settled.resolve();
    await launch;
    await shutdown;
    expect(manager.getSessionState().phase).toBe('idle');
    expect(onClose).toHaveBeenCalledOnce();
    expect(mocked.kill).not.toHaveBeenCalled();
    if (!shutdownRequested) {
      await manager.launchGame(options, vi.fn(), vi.fn(), onClose);
      expect(onClose).toHaveBeenCalledTimes(2);
    }
  });

  it('kills and drains a child returned after shutdown started', async () => {
    const spawning = deferred<void>();
    const started = deferred<void>();
    const child = childProcess();
    const manager = createLauncher(async ({ onSpawn }) => {
      started.resolve();
      await spawning.promise;
      onSpawn?.(child);
      return child;
    });
    mocked.kill.mockImplementation((_pid, _signal, callback) => { child.emit('close', 0); callback(null); });
    const launch = manager.launchGame(options, vi.fn(), vi.fn(), vi.fn());
    await started.promise;
    const shutdown = manager.beginShutdown();
    spawning.resolve();
    await launch;
    await shutdown;
    expect(mocked.kill).toHaveBeenCalledOnce();
    expect(manager.getSessionState().phase).toBe('idle');
  });

  it('reports failure to shutdown if a late child cannot be killed', async () => {
    const spawning = deferred<void>();
    const started = deferred<void>();
    const child = childProcess();
    vi.mocked(child.kill).mockImplementation(() => { throw Error('denied'); });
    mocked.kill.mockImplementation((_pid, _signal, callback) => callback(Error('denied')));
    const manager = createLauncher(async ({ onSpawn }) => {
      started.resolve(); await spawning.promise; onSpawn?.(child); return child;
    });
    const launch = manager.launchGame(options, vi.fn(), vi.fn(), vi.fn());
    await started.promise;
    const shutdown = manager.beginShutdown();
    const launchFailure = expect(launch).rejects.toThrow('denied');
    const shutdownFailure = expect(shutdown).rejects.toThrow('denied');
    spawning.resolve();
    await Promise.all([launchFailure, shutdownFailure]);
    child.emit('close', 0);
  });

  it('keeps admission closed when restart cannot observe child exit, and leaves a running game alive on quit', async () => {
    const child = childProcess();
    const manager = createLauncher(async ({ onSpawn }) => { onSpawn?.(child); return child; });
    await manager.launchGame(options, vi.fn(), vi.fn(), vi.fn());
    vi.useFakeTimers();
    const stopping = expect(manager.killGameProcess()).rejects.toThrow('Timed out');
    await vi.advanceTimersByTimeAsync(5001);
    await stopping;
    await expect(manager.launchGame(options, vi.fn(), vi.fn(), vi.fn())).rejects.toThrow('already in progress');
    mocked.kill.mockClear();
    await manager.beginShutdown();
    expect(mocked.kill).not.toHaveBeenCalled();
    child.emit('close', 0);
  });
});
