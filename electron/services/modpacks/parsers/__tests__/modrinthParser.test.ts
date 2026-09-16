import { describe, expect, it } from 'vitest';
import { parseModrinthManifest, validateModrinthManifest } from '../modrinthParser';

describe('Modrinth manifest parser', () => {
  it('uses index dependencies for the Minecraft runtime and primary loader', () => {
    const index = {
      formatVersion: 1,
      game: 'minecraft' as const,
      versionId: 'pack-version',
      name: 'Fabric pack',
      dependencies: { minecraft: '1.21.1', 'fabric-loader': '0.16.10' },
      files: [],
    };

    expect(parseModrinthManifest(JSON.stringify(index))).toMatchObject({
      minecraft: { version: '1.21.1', modLoaders: [{ id: 'fabric-0.16.10', primary: true }] },
    });
    expect(validateModrinthManifest(index)).toBe(true);
  });

  it('rejects indexes that cannot identify a Minecraft runtime', () => {
    const index = { formatVersion: 1, game: 'minecraft' as const, versionId: 'pack-version', name: 'Broken pack', files: [] };
    expect(() => parseModrinthManifest(JSON.stringify(index))).toThrow(/dependencies\.minecraft/i);
    expect(validateModrinthManifest(index)).toBe(false);
  });
});
