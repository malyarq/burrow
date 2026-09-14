import { describe, expect, it } from 'vitest';
import type { ModpackConfig } from '../types';
import { MAX_INSTANCE_MEMORY_GB, withModpackMemoryGb, withModpackMinMemoryGb } from './configPatching';

const config: ModpackConfig = {
  id: 'memory-test',
  name: 'Memory test',
  runtime: { minecraft: '1.20.1', modLoader: { type: 'vanilla' } },
  memory: { maxMb: 4096, minMb: 1024 },
  vmOptions: [],
};

describe('instance memory patching', () => {
  it('accepts manual allocations above the old 64 GB ceiling up to the validated maximum', () => {
    expect(withModpackMemoryGb(config, 128).memory).toEqual({ maxMb: 131_072, minMb: 1024 });
    expect(withModpackMemoryGb(config, 999).memory?.maxMb).toBe(MAX_INSTANCE_MEMORY_GB * 1024);
  });

  it('keeps initial memory valid when max memory is reduced or edited', () => {
    expect(withModpackMemoryGb(config, 0.5).memory).toEqual({ maxMb: 1024, minMb: 1024 });
    expect(withModpackMinMemoryGb(config, 12).memory).toEqual({ maxMb: 4096, minMb: 4096 });
  });
});
