import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { ZipFile } from 'yazl';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({ download: vi.fn() }));
vi.mock('@xmcl/file-transfer', () => ({ download: mocked.download }));
import { createImportOperationAdapter } from '../importOperation';
import { stageArchiveImport } from '../../modpacks/importers/localInstaller';
import { OperationRunner } from '../operationRunner';
import { OperationJournal } from '../operationJournal';
import type { InstanceCommand } from '../../../domains/instances/instanceTypes';

describe('staged archive import operation', () => {
  const tempDirs: string[] = [];
  afterEach(() => {
    mocked.download.mockReset();
    for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
  });

  it.each(['extraction', 'validation', 'publish', 'control-plane'] as const)(
    'preserves existing bytes and index when %s fails',
    async (fault) => {
      const rootPath = seedRoot();
      tempDirs.push(rootPath);
      const before = capture(rootPath);
      const archivePath = await writeMultiMCArchive(rootPath);
      const { runner } = createRunner({ faults: { [fault]: () => { throw new Error(`${fault} failed`); } } });

      const started = runner.start({ kind: 'import', rootPath, filePath: archivePath, destinationId: 'destination' });
      const completed = await runner.waitFor(started.id);

      expect(completed).toMatchObject({ status: 'failed', result: { status: 'failed' } });
      expect(capture(rootPath)).toEqual(before);
      expect(fs.existsSync(path.join(rootPath, '.burrow-operations', 'staging', started.id))).toBe(false);
    },
  );

  it('cancels before publish without changing live files', async () => {
    const rootPath = seedRoot();
    tempDirs.push(rootPath);
    const before = capture(rootPath);
    const archivePath = await writeMultiMCArchive(rootPath);
    let cancel: (() => boolean) | undefined;
    const { runner } = createRunner({ faults: { validation: () => { cancel?.(); } } });
    const started = runner.start({ kind: 'import', rootPath, filePath: archivePath, destinationId: 'destination' });
    cancel = () => runner.cancel(started.id);

    expect(await runner.waitFor(started.id)).toMatchObject({ status: 'cancelled', result: { status: 'cancelled' } });
    expect(capture(rootPath)).toEqual(before);
  });

  it('downloads URL-only required Modrinth files, preserves the descriptor, and reports an explicit optional miss as degraded', async () => {
    const rootPath = seedRoot();
    tempDirs.push(rootPath);
    mocked.download.mockImplementation(async ({ destination }: { destination: string }) => {
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, 'downloaded required bytes');
    });
    const archivePath = await writeModrinthArchive(rootPath);
    const { runner, execute } = createRunner();

    const started = runner.start({ kind: 'import', rootPath, filePath: archivePath, destinationId: 'modrinth-import' });
    const completed = await runner.waitFor(started.id);

    expect(completed).toMatchObject({
      status: 'degraded',
      result: { status: 'degraded', missing: ['mods/optional.jar'] },
    });
    expect(fs.readFileSync(path.join(rootPath, 'modpacks', 'modrinth-import', 'config', 'required.txt'), 'utf8')).toBe('client override');
    expect(fs.existsSync(path.join(rootPath, 'modpacks', 'modrinth-import', 'modrinth.index.json'))).toBe(true);
    expect(fs.readFileSync(path.join(rootPath, 'modpacks', 'modrinth-import', 'config', 'required.txt'), 'utf8')).toBe('client override');
    expect(fs.existsSync(path.join(rootPath, 'modpacks', 'modrinth-import', 'mods', 'server-only.jar'))).toBe(false);
    expect(execute).toHaveBeenCalledWith(expect.objectContaining({
      version: 1,
      type: 'commit-published',
      select: true,
      record: expect.objectContaining({ id: 'modrinth-import', name: 'Test pack' }),
    }));
    expect(mocked.download).toHaveBeenCalledWith(expect.objectContaining({
      url: ['https://cdn.example.com/required.txt'],
      validator: { algorithm: 'sha1', hash: crypto.createHash('sha1').update('downloaded required bytes').digest('hex') },
    }));
  });

  it('rejects a CurseForge archive before publishing when its provider capability is unavailable', async () => {
    const rootPath = seedRoot();
    tempDirs.push(rootPath);
    const before = capture(rootPath);
    const archivePath = await writeCurseForgeArchive(rootPath);
    const { runner, execute } = createRunner();

    const started = runner.start({ kind: 'import', rootPath, filePath: archivePath, destinationId: 'curseforge-import' });
    await expect(runner.waitFor(started.id)).resolves.toMatchObject({ status: 'failed', result: { message: expect.stringMatching(/Configure a CurseForge API key/i) } });
    expect(capture(rootPath)).toEqual(before);
    expect(execute).not.toHaveBeenCalled();
  });

  it('rejects a bundled Modrinth hash mismatch before publish', async () => {
    const rootPath = seedRoot(); tempDirs.push(rootPath); const before = capture(rootPath);
    const archivePath = await writeZip(path.join(rootPath, 'bad.mrpack'), [
      ['modrinth.index.json', Buffer.from(JSON.stringify({ formatVersion: 1, game: 'minecraft', versionId: 'bad', name: 'Bad', dependencies: { minecraft: '1.20.1' }, files: [{ path: 'mods/bad.jar', hashes: { sha1: '0'.repeat(40), sha512: '0'.repeat(128) }, downloads: [], env: { client: 'required' } }] }))],
      ['mods/bad.jar', Buffer.from('bad bytes')],
    ]);
    const { runner } = createRunner();
    const started = runner.start({ kind: 'import', rootPath, filePath: archivePath, destinationId: 'bad' });
    await expect(runner.waitFor(started.id)).resolves.toMatchObject({ status: 'failed' });
    expect(capture(rootPath)).toEqual(before);
  });

  it('keeps an existing staging file intact when a normal archive entry collides', async () => {
    const rootPath = seedRoot(); tempDirs.push(rootPath);
    const archivePath = await writeZip(path.join(rootPath, 'collision.mrpack'), [
      ['modrinth.index.json', Buffer.from(JSON.stringify({ formatVersion: 1, game: 'minecraft', versionId: 'collision', name: 'Collision', dependencies: { minecraft: '1.20.1' }, files: [{ path: 'config/existing.txt', hashes: {}, downloads: [], env: { client: 'required' } }] }))],
      ['config/existing.txt', Buffer.from('archive bytes')],
    ]);
    const staging = path.join(rootPath, 'staging'); fs.mkdirSync(path.join(staging, 'config'), { recursive: true }); fs.writeFileSync(path.join(staging, 'config', 'existing.txt'), 'existing bytes');
    await expect(stageArchiveImport(archivePath, staging)).rejects.toThrow(/EEXIST/);
    expect(fs.readFileSync(path.join(staging, 'config', 'existing.txt'), 'utf8')).toBe('existing bytes');
  });

  it('rolls back a required CurseForge content failure before publishing', async () => {
    const rootPath = seedRoot();
    tempDirs.push(rootPath);
    const before = capture(rootPath);
    const archivePath = await writeCurseForgeArchive(rootPath);
    const { runner, execute } = createRunner({ installManifestContent: async () => [{ index: 0, reason: 'download failed' }] });

    const started = runner.start({ kind: 'import', rootPath, filePath: archivePath, destinationId: 'curseforge-import' });
    await expect(runner.waitFor(started.id)).resolves.toMatchObject({ status: 'failed', result: { status: 'failed' } });
    expect(capture(rootPath)).toEqual(before);
    expect(execute).not.toHaveBeenCalled();
  });

  it('reports optional CurseForge content misses as degraded after staging all required content', async () => {
    const rootPath = seedRoot();
    tempDirs.push(rootPath);
    const archivePath = await writeCurseForgeArchive(rootPath, false);
    const installManifestContent = vi.fn(async (stagingRoot: string, destinationId: string) => {
      fs.mkdirSync(path.join(stagingRoot, 'modpacks', destinationId, 'mods'), { recursive: true });
      fs.writeFileSync(path.join(stagingRoot, 'modpacks', destinationId, 'mods', 'required.jar'), 'downloaded');
      return [{ index: 1, reason: 'CurseForge client is unavailable' }];
    });
    const { runner } = createRunner({ installManifestContent });

    const started = runner.start({ kind: 'import', rootPath, filePath: archivePath, destinationId: 'curseforge-import' });
    await expect(runner.waitFor(started.id)).resolves.toMatchObject({ status: 'degraded', result: { missing: ['curseforge:3/4'] } });
    expect(fs.readFileSync(path.join(rootPath, 'modpacks', 'curseforge-import', 'mods', 'required.jar'), 'utf8')).toBe('downloaded');
    expect(fs.existsSync(path.join(rootPath, 'modpacks', 'curseforge-import', 'manifest.json'))).toBe(true);
  });

  it('rejects traversal archives before they reach the live destination', async () => {
    const rootPath = seedRoot();
    tempDirs.push(rootPath);
    const before = capture(rootPath);
    const archivePath = await writeTraversalArchive(rootPath);
    const { runner } = createRunner();

    const started = runner.start({ kind: 'import', rootPath, filePath: archivePath, destinationId: 'destination' });
    expect(await runner.waitFor(started.id)).toMatchObject({ status: 'failed', result: { status: 'failed' } });
    expect(capture(rootPath)).toEqual(before);
    expect(fs.existsSync(path.join(rootPath, 'escape.txt'))).toBe(false);
  });

  it('persists the complete canonical command before a post-publish fault', async () => {
    const rootPath = seedRoot();
    tempDirs.push(rootPath);
    const archivePath = await writeMultiMCArchive(rootPath);
    let recorded: unknown;
    const { runner } = createRunner({ faults: {
      'control-plane': () => {
        recorded = new OperationJournal(rootPath).get(started.id)?.recovery?.canonicalCommand;
        throw new Error('simulated crash after publish');
      },
    } });
    const started = runner.start({ kind: 'import', rootPath, filePath: archivePath, destinationId: 'published-import' });

    await expect(runner.waitFor(started.id)).resolves.toMatchObject({ status: 'failed' });
    expect(recorded).toMatchObject({
      version: 1,
      rootPath,
      operationId: started.id,
      command: { version: 1, type: 'commit-published', select: true, record: { id: 'published-import' } },
    });
  });
});

function seedRoot(): string {
  const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-import-operation-'));
  fs.mkdirSync(path.join(rootPath, 'modpacks', 'destination'), { recursive: true });
  fs.writeFileSync(path.join(rootPath, 'modpacks', 'destination', 'payload.txt'), 'original destination');
  fs.writeFileSync(path.join(rootPath, 'modpacks', 'destination', 'modpack.json'), JSON.stringify({ id: 'destination', name: 'Original', runtime: { minecraft: '1.20.1' }, memory: { maxMb: 4096 }, vmOptions: [] }));
  fs.writeFileSync(path.join(rootPath, 'modpacks.json'), JSON.stringify({ selectedModpack: 'destination', modpacks: { destination: { name: 'Original' } } }));
  fs.writeFileSync(path.join(rootPath, 'modpacks-metadata.json'), JSON.stringify({ selectedModpack: 'destination', modpacks: {} }));
  return rootPath;
}

function createRunner(options: Parameters<typeof createImportOperationAdapter>[0] = {}) {
  const execute = vi.fn(async (command: InstanceCommand) => ({
    status: 'committed' as const,
    snapshot: command.type === 'commit-published'
      ? { selectedId: command.record.id, records: [command.record] }
      : { selectedId: 'destination', records: [record('destination', 'Original')] },
  }));
  return {
    execute,
    runner: new OperationRunner([createImportOperationAdapter(options)], {
      rootMutationCoordinator: {
        forRoot: () => ({
          read: async () => ({ status: 'ready' as const, snapshot: { selectedId: 'destination', records: [record('destination', 'Original')] } }),
          prepare: async () => ({ status: 'ready' as const, source: 'canonical' as const, snapshot: { selectedId: 'destination', records: [record('destination', 'Original')] } }),
          execute,
        }),
      },
    }),
  };
}

function record(id: string, name: string) {
  return {
    id,
    name,
    source: { source: 'local' as const, createdAt: '2026-08-04T00:00:00.000Z', updatedAt: '2026-08-04T00:00:00.000Z' },
    config: { runtime: { minecraftVersion: '1.20.1', modLoader: { type: 'vanilla' as const } } },
    summary: { minecraftVersion: '1.20.1', modLoader: { type: 'vanilla' as const } },
  };
}

function capture(rootPath: string): Record<string, string> {
  const files = ['modpacks/destination/payload.txt', 'modpacks/destination/modpack.json', 'modpacks.json', 'modpacks-metadata.json'];
  return Object.fromEntries(files.map((file) => [file, fs.readFileSync(path.join(rootPath, file), 'utf8')]));
}

async function writeMultiMCArchive(rootPath: string): Promise<string> {
  return await writeZip(path.join(rootPath, 'multimc.zip'), [
    ['mmc-pack.json', Buffer.from(JSON.stringify({ components: [{ uid: 'net.minecraft', version: '1.20.1' }] }))],
    ['.minecraft/config/options.txt', Buffer.from('safe')],
  ]);
}

async function writeModrinthArchive(rootPath: string): Promise<string> {
  const requiredBytes = 'downloaded required bytes';
  return await writeZip(path.join(rootPath, 'modrinth.mrpack'), [
    ['modrinth.index.json', Buffer.from(JSON.stringify({ formatVersion: 1, game: 'minecraft', versionId: 'test', name: 'Test pack', dependencies: { minecraft: '1.20.1', 'fabric-loader': '0.16.0' }, files: [
      { path: 'config/required.txt', hashes: { sha1: crypto.createHash('sha1').update(requiredBytes).digest('hex'), sha512: 'b' }, downloads: ['https://cdn.example.com/required.txt'], fileSize: requiredBytes.length, env: { client: 'required' } },
      { path: 'mods/optional.jar', hashes: { sha1: 'a', sha512: 'b' }, downloads: [], fileSize: 0, env: { client: 'optional' } },
      { path: 'mods/server-only.jar', hashes: { sha1: 'a', sha512: 'b' }, downloads: ['https://cdn.example.com/server.jar'], fileSize: 0, env: { client: 'unsupported' } },
    ] }))],
    ['overrides/config/required.txt', Buffer.from('override')],
    ['client-overrides/config/required.txt', Buffer.from('client override')],
  ]);
}

async function writeCurseForgeArchive(rootPath: string, required = true): Promise<string> {
  return await writeZip(path.join(rootPath, 'curseforge.zip'), [
    ['manifest.json', Buffer.from(JSON.stringify({ manifestVersion: 1, manifestType: 'minecraftModpack', minecraft: { version: '1.20.1', modLoaders: [] }, name: 'Curse pack', version: '1.0.0', files: [
      { projectID: 1, fileID: 2, required },
      { projectID: 3, fileID: 4, required: false },
    ] }))],
    ['overrides/config/options.txt', Buffer.from('override')],
  ]);
}

async function writeTraversalArchive(rootPath: string): Promise<string> {
  const archivePath = await writeZip(path.join(rootPath, 'traversal.zip'), [['xx/escape.txt', Buffer.from('blocked')]]);
  const bytes = fs.readFileSync(archivePath);
  for (let offset = bytes.indexOf('xx/escape.txt'); offset !== -1; offset = bytes.indexOf('xx/escape.txt', offset + 1)) {
    bytes.write('../escape.txt', offset, 'utf8');
  }
  fs.writeFileSync(archivePath, bytes);
  return archivePath;
}

async function writeZip(archivePath: string, entries: Array<[string, Buffer]>): Promise<string> {
  const zip = new ZipFile();
  for (const [name, bytes] of entries) zip.addBuffer(bytes, name);
  await new Promise<void>((resolve, reject) => {
    zip.outputStream.pipe(fs.createWriteStream(archivePath)).once('close', resolve).once('error', reject);
    zip.end();
  });
  return archivePath;
}
