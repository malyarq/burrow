import { describe, expect, it, vi } from 'vitest';

const { list } = vi.hoisted(() => ({ list: vi.fn() }));

vi.mock('../../../../services/ipc/instancesIPC', () => ({
  instancesIPC: { list },
}));

import { loadInstalledModpackCatalog } from '../installedModpackCatalogService';

describe('loadInstalledModpackCatalog', () => {
  it('builds every catalog item from one canonical list snapshot', async () => {
    list.mockResolvedValue({
      ok: true,
      value: {
        status: 'ready',
        instances: [
          {
            id: 'alpha',
            name: 'Alpha from snapshot',
            selected: true,
            summary: { minecraftVersion: '1.21.1' },
            metadata: {
              source: 'modrinth',
              sourceId: 'alpha-project',
              version: '1.2.3',
              createdAt: '2026-09-01T00:00:00.000Z',
              updatedAt: '2026-09-02T00:00:00.000Z',
            },
          },
          {
            id: 'beta',
            name: 'Beta from snapshot',
            selected: false,
            summary: { minecraftVersion: '1.20.1' },
            metadata: {
              source: 'local',
              createdAt: '2026-09-03T00:00:00.000Z',
              updatedAt: '2026-09-04T00:00:00.000Z',
            },
          },
        ],
      },
    });

    await expect(loadInstalledModpackCatalog()).resolves.toEqual([
      expect.objectContaining({ id: 'alpha', name: 'Alpha from snapshot', metadata: expect.objectContaining({ source: 'modrinth', sourceId: 'alpha-project' }) }),
      expect.objectContaining({ id: 'beta', name: 'Beta from snapshot', metadata: expect.objectContaining({ source: 'local' }) }),
    ]);

    expect(list).toHaveBeenCalledTimes(1);
  });
});
