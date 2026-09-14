import { describe, expect, it } from 'vitest';
import { parseCurseForgeManifest, validateCurseForgeManifest } from '../curseforgeParser';
import type { CurseForgeManifest } from '../../../../../shared/types/modpack';

const base: CurseForgeManifest = {
  manifestVersion: 1,
  manifestType: 'minecraftModpack',
  minecraft: { version: '1.20.1', modLoaders: [] },
  name: 'Pack',
  version: '1.0.0',
  files: [{ projectID: 1, fileID: 2, required: true }],
  overrides: 'custom-content',
};

describe('CurseForge manifest parser', () => {
  it('retains a custom overrides directory', () => {
    expect(parseCurseForgeManifest(JSON.stringify(base)).overrides).toBe('custom-content');
  });

  it.each([0, -1, 1.5])('rejects non-positive or non-integer provider ids: %s', (id) => {
    const manifest = { ...base, files: [{ projectID: id, fileID: 2, required: true }] };
    expect(() => parseCurseForgeManifest(JSON.stringify(manifest))).toThrow(/positive project and file IDs/i);
    expect(validateCurseForgeManifest(manifest)).toBe(false);
  });
});
