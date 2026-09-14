import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import fsExtra from 'fs-extra';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mutateOptionsFile } from '../optionsFileMutation';

describe('mutateOptionsFile', () => {
  const directories: string[] = [];

  afterEach(() => { for (const directory of directories.splice(0)) fs.rmSync(directory, { recursive: true, force: true }); });

  it('serializes concurrent read-modify-write updates without losing either change', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-options-mutation-'));
    directories.push(directory);
    const optionsPath = path.join(directory, 'options.txt');
    fs.writeFileSync(optionsPath, 'existing:value\n');

    await Promise.all([
      mutateOptionsFile(optionsPath, (content) => `${content}resourcePacks:["file/pack.zip"]\n`),
      mutateOptionsFile(optionsPath, (content) => `${content}other:value\n`),
    ]);

    expect(fs.readFileSync(optionsPath, 'utf8')).toBe('existing:value\nresourcePacks:["file/pack.zip"]\nother:value\n');
  });

  it('does not overwrite an options file when reading it fails for a reason other than absence', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-options-mutation-'));
    directories.push(directory);
    const optionsPath = path.join(directory, 'options.txt');
    fs.writeFileSync(optionsPath, 'keep:this\n');
    const error = Object.assign(new Error('access denied'), { code: 'EACCES' });
    const read = vi.spyOn(fsExtra, 'readFile').mockRejectedValueOnce(error);
    try {
      await expect(mutateOptionsFile(optionsPath, (content) => `${content}new:value\n`)).rejects.toBe(error);
      expect(fs.readFileSync(optionsPath, 'utf8')).toBe('keep:this\n');
    } finally {
      read.mockRestore();
    }
  });
});
