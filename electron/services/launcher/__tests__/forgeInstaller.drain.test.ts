import { describe, expect, it, vi } from 'vitest';
import type { Task } from '@xmcl/task';

const mocked = vi.hoisted(() => ({ prefetch: vi.fn() }));
vi.mock('@xmcl/installer', () => ({ getForgeVersionList: vi.fn(async () => []), installForgeTask: vi.fn(() => ({})) }));
vi.mock('../forge/forgeVersionSelection', () => ({ selectForgeVersion: () => ({ version: '47.0.0' }), getForgeVersionFromPromotions: vi.fn() }));
vi.mock('../forgePatches', () => ({ ensureVersionInheritsFromBase: vi.fn(), rewriteForgeInstallProfile: () => true, rewriteForgeVersionJson: () => true }));
vi.mock('../forge/createForgeDispatcher', () => ({ createForgeDispatcher: () => ({}) }));
vi.mock('../forge/mcpConfigRecovery', () => ({ ensureForgeMcpConfig: mocked.prefetch }));
import { installForge } from '../forgeInstaller';

describe('Forge background preparation drain', () => {
  it.each([false, true])('awaits prefetch even when the installer task fails=%s', async (fails) => {
    let finish!: (value: boolean) => void;
    let started!: () => void;
    const prefetch = new Promise<boolean>((resolve) => { finish = resolve; });
    const entered = new Promise<void>((resolve) => { started = resolve; });
    mocked.prefetch.mockReset().mockImplementationOnce(() => { started(); return prefetch; }).mockResolvedValue(false);
    const install = installForge({
      rootPath: 'C:/unused-fixture', mcVersion: '1.20.1', javaPath: 'java',
      downloadProvider: { injectURLWithCandidates: (url: string) => [url] } as never,
      downloadOptions: {}, onLog: vi.fn(), onProgress: vi.fn(),
      runTaskWithProgress: async <T>(_task: Task<T>, _progress: unknown, _log: unknown, _label: string, _type: string | undefined, onStart?: (task: Task) => void): Promise<T> => {
        onStart?.({ path: 'installForge.library' } as Task);
        if (fails) throw Error('installer failed');
        return '1.20.1-forge-47.0.0' as T;
      },
    });
    let settled = false;
    const observed = install.then(value => { settled = true; return value; }, error => { settled = true; throw error; });
    await entered;
    await Promise.resolve();
    expect(settled).toBe(false);
    finish(true);
    if (fails) await expect(observed).rejects.toThrow('installer failed');
    else await expect(observed).resolves.toBe('1.20.1-forge-47.0.0');
  });
});
