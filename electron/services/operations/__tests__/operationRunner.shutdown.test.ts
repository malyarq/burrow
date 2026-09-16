import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OperationJournal } from '../operationJournal';
import { OperationRunner } from '../operationRunner';

describe('OperationRunner shutdown', () => {
  const tempDirectories: string[] = [];
  afterEach(() => tempDirectories.splice(0).forEach((directory) => fs.rmSync(directory, { recursive: true, force: true })));

  it('closes admission, requests cancellation and drains durable terminal state', async () => {
    const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-operation-shutdown-'));
    tempDirectories.push(rootPath);
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const runner = new OperationRunner([{
      kind: 'duplicate',
      run: async (context) => {
        context.transition('staged');
        await gate;
        return context.isCancelled() ? { status: 'cancelled' } : { status: 'succeeded', instanceId: 'copy' };
      },
    }]);
    const started = runner.start({ kind: 'duplicate', rootPath, sourceId: 'source' });
    await vi.waitFor(() => expect(runner.get(started.id)?.status).toBe('running'));

    const drain = runner.beginShutdown();
    expect(runner.isShuttingDown).toBe(true);
    expect(runner.get(started.id)?.status).toBe('cancelling');
    expect(() => runner.start({ kind: 'duplicate', rootPath, sourceId: 'other' })).toThrow('shutting down');
    release?.();
    await drain;

    expect(runner.get(started.id)?.status).toBe('cancelled');
    expect(new OperationJournal(rootPath).get(started.id)).toMatchObject({ status: 'cancelled' });
  });

  it('returns one idempotent drain promise', async () => {
    const runner = new OperationRunner([]);
    expect(runner.beginShutdown()).toBe(runner.beginShutdown());
    await runner.beginShutdown();
  });

  it('drains an admitted content mutation and rejects new ones after shutdown', async () => {
    const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-content-shutdown-'));
    tempDirectories.push(rootPath);
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const runner = new OperationRunner([], { rootMutationCoordinator: coordinator() });
    let started = false;
    const content = runner.runContentMutation(rootPath, 'source', async () => { started = true; await gate; });
    await vi.waitFor(() => expect(started).toBe(true));

    const drain = runner.beginShutdown();
    await expect(runner.runContentMutation(rootPath, 'source', async () => undefined)).rejects.toThrow('shutting down');
    release?.();
    await content;
    await drain;
  });
});

function coordinator() {
  const record = {
    id: 'source',
    name: 'Source',
    source: { source: 'local' as const, createdAt: '2026-08-04T00:00:00.000Z', updatedAt: '2026-08-04T00:00:00.000Z' },
    config: { runtime: { minecraftVersion: '1.20.1', modLoader: { type: 'vanilla' as const } } },
    summary: { minecraftVersion: '1.20.1', modLoader: { type: 'vanilla' as const } },
  };
  return {
    forRoot: () => ({
      read: async () => ({ status: 'ready' as const, snapshot: { selectedId: record.id, records: [record] } }),
      prepare: async () => ({ status: 'ready' as const, source: 'canonical' as const, snapshot: { selectedId: record.id, records: [record] } }),
      execute: async () => ({ status: 'committed' as const, snapshot: { selectedId: record.id, records: [record] } }),
    }),
  };
}
