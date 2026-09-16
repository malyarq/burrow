import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import fsExtra from 'fs-extra';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ModrinthV2Client } from '@xmcl/modrinth';
import type { InstanceApplication } from '../../../../domains/instances/instanceApplication';
import type { LauncherRoot } from '../../../../domains/instances/instanceTypes';
import { classifyPackPath, ModPlatformService, PREVIEW_ARCHIVE_MAX_BYTES } from '../modPlatformService';
import { InstanceManifestManager } from '../../../instances/manifestManager';

const mocked = vi.hoisted(() => ({
  fetchPublicHttpsUrl: vi.fn(),
  download: vi.fn(),
}));
const fetchPublicHttpsUrlMock = mocked.fetchPublicHttpsUrl;
vi.mock('../../../../security/remoteUrls', () => ({ fetchPublicHttpsUrl: (...args: unknown[]) => fetchPublicHttpsUrlMock(...args) }));
vi.mock('@xmcl/file-transfer', () => ({ download: (...args: unknown[]) => mocked.download(...args) }));

type ModrinthSearchResult = Awaited<ReturnType<ModrinthV2Client['searchProjects']>>;
type ModrinthSearchHit = ModrinthSearchResult['hits'][number];

function createHit(index: number, title: string): ModrinthSearchHit {
  return {
    project_id: `project-${index}`,
    slug: `project-${index}`,
    title,
    description: `${title} description`,
    icon_url: `https://example.test/${index}.png`,
    downloads: 1_000 - index,
    date_created: `2026-01-${String((index % 28) + 1).padStart(2, '0')}T00:00:00.000Z`,
    date_modified: `2026-02-${String((index % 28) + 1).padStart(2, '0')}T00:00:00.000Z`,
  } as ModrinthSearchHit;
}

function createSearchResult(hits: ModrinthSearchHit[], offset: number, limit: number, totalHits: number): ModrinthSearchResult {
  return {
    hits,
    offset,
    limit,
    total_hits: totalHits,
  } as ModrinthSearchResult;
}

function createDescendingHits(total: number): ModrinthSearchHit[] {
  return Array.from({ length: total }, (_, index) => {
    const label = String(total - index).padStart(3, '0');
    return createHit(index, `Pack ${label}`);
  });
}

function createPlatformService(): ModPlatformService {
  return new ModPlatformService(
    {} as InstanceApplication,
    {
      resolveRoot: async () => ({} as LauncherRoot),
      getModpackDir: (_rootPath, instanceId) => `/tmp/burrow-platform-test/modpacks/${instanceId}`,
    },
  );
}

describe('ModPlatformService alphabetical modpack pagination', () => {
  afterEach(() => {
    mocked.download.mockReset();
    vi.restoreAllMocks();
  });
  it('classifies manifest and all supported override roots as user-visible content', () => {
    expect(classifyPackPath(undefined)).toBe('other');
    expect(classifyPackPath('mods/example.jar')).toBe('mod');
    expect(classifyPackPath('overrides/mods/example.jar')).toBe('mod');
    expect(classifyPackPath('client-overrides/resourcepacks/example.zip')).toBe('resourcepack');
    expect(classifyPackPath('server-overrides/shaderpacks/example.zip')).toBe('shader');
    expect(classifyPackPath('custom-content/mods/example.jar', ['custom-content'])).toBe('mod');
  });

  it('keeps the remote preview archive cap bounded and removes its temporary directory after a failed inspection', async () => {
    const service = createPlatformService();
    const before = new Set(fs.readdirSync(os.tmpdir()).filter((name) => name.startsWith('burrow-pack-preview-')));
    expect(PREVIEW_ARCHIVE_MAX_BYTES).toBe(32 * 1024 * 1024);
    vi.spyOn(service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce({
      project_id: 'project', files: [{ filename: 'pack.mrpack', url: 'https://example.test/pack.mrpack', hashes: {} }],
    } as Awaited<ReturnType<ModrinthV2Client['getProjectVersion']>>);
    fetchPublicHttpsUrlMock.mockResolvedValueOnce(new Response('not a zip'));

    await expect(service.inspectModpackContents({ platform: 'modrinth', projectId: 'project', versionId: 'version' })).rejects.toThrow();
    expect(fs.readdirSync(os.tmpdir()).filter((name) => name.startsWith('burrow-pack-preview-'))).toEqual([...before]);
  });

  it('rejects a Modrinth version that belongs to another project before downloading its archive', async () => {
    const service = createPlatformService();
    vi.spyOn(service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce({
      project_id: 'other-project',
      files: [{ filename: 'pack.mrpack', url: 'https://example.test/pack.mrpack', hashes: {} }],
    } as Awaited<ReturnType<ModrinthV2Client['getProjectVersion']>>);

    await expect(service.inspectModpackContents({
      platform: 'modrinth', projectId: 'expected-project', versionId: 'version',
    })).rejects.toThrow('does not belong to the requested project');
  });

  it('rejects a provider install before network access when its canonical instance is absent', async () => {
    const root = {} as LauncherRoot;
    const application = {
      read: vi.fn(async () => ({ status: 'uninitialized' as const })),
    } as unknown as InstanceApplication;
    const content = {
      resolveRoot: vi.fn(async () => root),
      getModpackDir: vi.fn(),
    };
    const service = new ModPlatformService(application, content);

    await expect(service.installModFile({
      platform: 'modrinth',
      projectId: 'project',
      versionId: 'version',
      instanceId: 'missing',
      contentType: 'mod',
    }, '/tmp/burrow-platform-test')).rejects.toThrow('Canonical instance does not exist: missing');

    expect(application.read).toHaveBeenCalledWith(root);
    expect(content.getModpackDir).not.toHaveBeenCalled();
  });

  it('rejects path-shaped provider filenames before using them as a destination', async () => {
    const root = {} as LauncherRoot;
    const application = {
      read: vi.fn(async () => ({
        status: 'ready' as const,
        snapshot: { records: [{ id: 'alpha' }] },
      })),
    } as unknown as InstanceApplication;
    const content = {
      resolveRoot: vi.fn(async () => root),
      getModpackDir: vi.fn(() => '/tmp/burrow-platform-test/modpacks/alpha'),
    };
    const service = new ModPlatformService(application, content);
    vi.spyOn(service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce({
      files: [{
        url: 'https://example.test/escape.jar',
        filename: '../escape.jar',
        primary: true,
        hashes: {},
      }],
    } as Awaited<ReturnType<ModrinthV2Client['getProjectVersion']>>);

    await expect(service.installModFile({
      platform: 'modrinth',
      projectId: 'project',
      versionId: 'version',
      instanceId: 'alpha',
      contentType: 'mod',
    }, '/tmp/burrow-platform-test')).rejects.toThrow(/provider filename/i);

    expect(content.getModpackDir).toHaveBeenCalledWith('/tmp/burrow-platform-test', 'alpha');
  });

  it('replaces a tracked project with a renamed provider file only after its download succeeds', async () => {
    const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-platform-replace-'));
    const instancePath = path.join(rootPath, 'modpacks', 'alpha');
    fs.mkdirSync(path.join(instancePath, 'mods'), { recursive: true });
    fs.writeFileSync(path.join(instancePath, 'mods', 'project-v1.jar'), 'v1');
    const manifests = new InstanceManifestManager();
    manifests.addMod(instancePath, {
      fileName: 'project-v1.jar', source: 'modrinth', projectId: 'project', versionId: 'v1', installDate: '2026-09-01T00:00:00.000Z',
    });
    const application = { read: vi.fn(async () => ({ status: 'ready' as const, snapshot: { records: [{ id: 'alpha' }] } })) } as unknown as InstanceApplication;
    const service = new ModPlatformService(application, {
      resolveRoot: async () => ({} as LauncherRoot),
      getModpackDir: () => instancePath,
    });
    mocked.download.mockImplementation(async ({ destination }: { destination: string }) => fs.writeFileSync(destination, 'v2'));
    vi.spyOn(service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce({
      files: [{ primary: true, filename: 'project-v2.jar', url: 'https://example.test/project-v2.jar', hashes: {} }],
    } as Awaited<ReturnType<ModrinthV2Client['getProjectVersion']>>);

    try {
      await service.installModFile({ platform: 'modrinth', projectId: 'project', versionId: 'v2', instanceId: 'alpha', contentType: 'mod' }, rootPath);
      expect(fs.existsSync(path.join(instancePath, 'mods', 'project-v1.jar'))).toBe(false);
      expect(fs.readFileSync(path.join(instancePath, 'mods', 'project-v2.jar'), 'utf8')).toBe('v2');
      expect(manifests.loadManifest(instancePath).mods).toMatchObject([{ fileName: 'project-v2.jar', projectId: 'project', versionId: 'v2' }]);
    } finally {
      fs.rmSync(rootPath, { recursive: true, force: true });
    }
  });

  it('keeps a disabled tracked version when replacement download fails', async () => {
    const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-platform-preserve-'));
    const instancePath = path.join(rootPath, 'modpacks', 'alpha');
    fs.mkdirSync(path.join(instancePath, 'mods'), { recursive: true });
    fs.writeFileSync(path.join(instancePath, 'mods', 'project-v1.jar.disabled'), 'v1-disabled');
    const manifests = new InstanceManifestManager();
    manifests.addMod(instancePath, {
      fileName: 'project-v1.jar', source: 'modrinth', projectId: 'project', versionId: 'v1', installDate: '2026-09-01T00:00:00.000Z',
    });
    const application = { read: vi.fn(async () => ({ status: 'ready' as const, snapshot: { records: [{ id: 'alpha' }] } })) } as unknown as InstanceApplication;
    const service = new ModPlatformService(application, {
      resolveRoot: async () => ({} as LauncherRoot),
      getModpackDir: () => instancePath,
    });
    mocked.download.mockRejectedValueOnce(new Error('network failed'));
    vi.spyOn(service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce({
      files: [{ primary: true, filename: 'project-v2.jar', url: 'https://example.test/project-v2.jar', hashes: {} }],
    } as Awaited<ReturnType<ModrinthV2Client['getProjectVersion']>>);

    try {
      await expect(service.installModFile({ platform: 'modrinth', projectId: 'project', versionId: 'v2', instanceId: 'alpha', contentType: 'mod' }, rootPath)).rejects.toThrow('network failed');
      expect(fs.readFileSync(path.join(instancePath, 'mods', 'project-v1.jar.disabled'), 'utf8')).toBe('v1-disabled');
      expect(manifests.loadManifest(instancePath).mods).toMatchObject([{ fileName: 'project-v1.jar', projectId: 'project', versionId: 'v1' }]);
      expect(fs.readdirSync(path.join(instancePath, 'mods')).some((name) => name.includes('.burrow-download-'))).toBe(false);
    } finally {
      fs.rmSync(rootPath, { recursive: true, force: true });
    }
  });

  it('keeps a replacement disabled when the tracked version is disabled', async () => {
    const fixture = createReplacementFixture(true);
    mocked.download.mockImplementation(async ({ destination }: { destination: string }) => fs.writeFileSync(destination, 'v2'));
    vi.spyOn(fixture.service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce(providerVersion('project-v2.jar'));

    try {
      await fixture.service.installModFile(request(), fixture.rootPath);
      expect(fs.existsSync(path.join(fixture.instancePath, 'mods', 'project-v2.jar'))).toBe(false);
      expect(fs.readFileSync(path.join(fixture.instancePath, 'mods', 'project-v2.jar.disabled'), 'utf8')).toBe('v2');
      expect(fixture.manifests.loadManifest(fixture.instancePath).mods).toMatchObject([{ fileName: 'project-v2.jar.disabled', versionId: 'v2' }]);
    } finally { fs.rmSync(fixture.rootPath, { recursive: true, force: true }); }
  });

  it('does not remove the existing version when creating its backup fails', async () => {
    const fixture = createReplacementFixture();
    mocked.download.mockImplementation(async ({ destination }: { destination: string }) => fs.writeFileSync(destination, 'v2'));
    vi.spyOn(fixture.service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce(providerVersion('project-v2.jar'));
    const originalMove = fsExtra.move.bind(fsExtra);
    const move = vi.spyOn(fsExtra, 'move');
    move.mockImplementation(async (source, destination, options) => {
      if (String(source).endsWith('project-v1.jar') && String(destination).includes('.burrow-backup-')) throw new Error('backup failed');
      return await originalMove(source, destination, options);
    });

    try {
      await expect(fixture.service.installModFile(request(), fixture.rootPath)).rejects.toThrow('backup failed');
      expect(fs.readFileSync(path.join(fixture.instancePath, 'mods', 'project-v1.jar'), 'utf8')).toBe('v1');
      expect(fs.existsSync(path.join(fixture.instancePath, 'mods', 'project-v2.jar'))).toBe(false);
      expect(fixture.manifests.loadManifest(fixture.instancePath).mods).toMatchObject([{ fileName: 'project-v1.jar', versionId: 'v1' }]);
    } finally { fs.rmSync(fixture.rootPath, { recursive: true, force: true }); }
  });

  it('preserves the committed new version if backup cleanup fails', async () => {
    const fixture = createReplacementFixture();
    mocked.download.mockImplementation(async ({ destination }: { destination: string }) => fs.writeFileSync(destination, 'v2'));
    vi.spyOn(fixture.service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce(providerVersion('project-v2.jar'));
    const originalRemove = fsExtra.remove.bind(fsExtra);
    const remove = vi.spyOn(fsExtra, 'remove');
    remove.mockImplementation(async (target) => {
      if (String(target).includes('.burrow-backup-')) throw new Error('cleanup failed');
      return await originalRemove(target);
    });

    try {
      await expect(fixture.service.installModFile(request(), fixture.rootPath)).resolves.toMatchObject({ filename: 'project-v2.jar' });
      expect(fs.readFileSync(path.join(fixture.instancePath, 'mods', 'project-v2.jar'), 'utf8')).toBe('v2');
      expect(fixture.manifests.loadManifest(fixture.instancePath).mods).toMatchObject([{ fileName: 'project-v2.jar', versionId: 'v2' }]);
    } finally { fs.rmSync(fixture.rootPath, { recursive: true, force: true }); }
  });

  it('restores the previous version when committing the manifest fails', async () => {
    const fixture = createReplacementFixture();
    mocked.download.mockImplementation(async ({ destination }: { destination: string }) => fs.writeFileSync(destination, 'v2'));
    vi.spyOn(fixture.service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce(providerVersion('project-v2.jar'));
    vi.spyOn(InstanceManifestManager.prototype, 'addMod').mockImplementation(() => { throw new Error('manifest failed'); });

    try {
      await expect(fixture.service.installModFile(request(), fixture.rootPath)).rejects.toThrow('manifest failed');
      expect(fs.readFileSync(path.join(fixture.instancePath, 'mods', 'project-v1.jar'), 'utf8')).toBe('v1');
      expect(fs.existsSync(path.join(fixture.instancePath, 'mods', 'project-v2.jar'))).toBe(false);
      expect(fixture.manifests.loadManifest(fixture.instancePath).mods).toMatchObject([{ fileName: 'project-v1.jar', versionId: 'v1' }]);
    } finally { fs.rmSync(fixture.rootPath, { recursive: true, force: true }); }
  });

  it('rejects a path-shaped tracked filename without touching files outside mods', async () => {
    const fixture = createReplacementFixture();
    const outside = path.join(fixture.instancePath, 'escape.jar');
    fs.writeFileSync(outside, 'outside');
    fs.writeFileSync(path.join(fixture.instancePath, 'instance-manifest.json'), JSON.stringify({
      version: 1,
      mods: [{ fileName: '../escape.jar', source: 'modrinth', projectId: 'project', versionId: 'v1', installDate: '2026-09-01T00:00:00.000Z' }],
    }));
    mocked.download.mockImplementation(async ({ destination }: { destination: string }) => fs.writeFileSync(destination, 'v2'));
    vi.spyOn(fixture.service.getModrinthClient(), 'getProjectVersion').mockResolvedValueOnce(providerVersion('project-v2.jar'));

    try {
      await expect(fixture.service.installModFile(request(), fixture.rootPath)).rejects.toThrow(/tracked mod filename/i);
      expect(fs.readFileSync(outside, 'utf8')).toBe('outside');
      expect(fs.readFileSync(path.join(fixture.instancePath, 'mods', 'project-v1.jar'), 'utf8')).toBe('v1');
      expect(fs.readdirSync(path.join(fixture.instancePath, 'mods')).some((name) => name.includes('.burrow-download-'))).toBe(false);
    } finally { fs.rmSync(fixture.rootPath, { recursive: true, force: true }); }
  });

  it('fetches enough Modrinth pages to serve later alphabetical pages correctly', async () => {
    const service = createPlatformService();
    const allHits = createDescendingHits(135);
    const searchProjectsMock = vi.spyOn(service.getModrinthClient(), 'searchProjects').mockImplementation(async ({ offset = 0, limit = 20 }) => {
      return createSearchResult(allHits.slice(offset, offset + limit), offset, limit, allHits.length);
    });

    const result = await service.searchModrinthModpacks('', undefined, undefined, 'alphabetical', 120, 10);

    expect(searchProjectsMock).toHaveBeenCalledTimes(2);
    expect(result.total).toBe(135);
    expect(result.offset).toBe(120);
    expect(result.limit).toBe(10);
    expect(result.items).toHaveLength(10);
    expect(result.items[0]?.title).toBe('Pack 121');
    expect(result.items.at(-1)?.title).toBe('Pack 130');
  });

  it('keeps larger alphabetical page sizes aligned with the fully sorted result set', async () => {
    const service = createPlatformService();
    const allHits = createDescendingHits(140);
    vi.spyOn(service.getModrinthClient(), 'searchProjects').mockImplementation(async ({ offset = 0, limit = 20 }) => {
      return createSearchResult(allHits.slice(offset, offset + limit), offset, limit, allHits.length);
    });

    const result = await service.searchModrinthModpacks('', undefined, undefined, 'alphabetical', 60, 48);

    expect(result.total).toBe(140);
    expect(result.limit).toBe(48);
    expect(result.items).toHaveLength(48);
    expect(result.items[0]?.title).toBe('Pack 061');
    expect(result.items.at(-1)?.title).toBe('Pack 108');
  });
});

function providerVersion(filename: string): Awaited<ReturnType<ModrinthV2Client['getProjectVersion']>> {
  return { files: [{ primary: true, filename, url: `https://example.test/${filename}`, hashes: {} }] } as Awaited<ReturnType<ModrinthV2Client['getProjectVersion']>>;
}

function request() {
  return { platform: 'modrinth' as const, projectId: 'project', versionId: 'v2', instanceId: 'alpha', contentType: 'mod' as const };
}

function createReplacementFixture(disabled = false) {
  const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-platform-transaction-'));
  const instancePath = path.join(rootPath, 'modpacks', 'alpha');
  fs.mkdirSync(path.join(instancePath, 'mods'), { recursive: true });
  fs.writeFileSync(path.join(instancePath, 'mods', disabled ? 'project-v1.jar.disabled' : 'project-v1.jar'), 'v1');
  const manifests = new InstanceManifestManager();
  manifests.addMod(instancePath, { fileName: disabled ? 'project-v1.jar.disabled' : 'project-v1.jar', source: 'modrinth', projectId: 'project', versionId: 'v1', installDate: '2026-09-01T00:00:00.000Z' });
  const application = { read: vi.fn(async () => ({ status: 'ready' as const, snapshot: { records: [{ id: 'alpha' }] } })) } as unknown as InstanceApplication;
  const service = new ModPlatformService(application, { resolveRoot: async () => ({} as LauncherRoot), getModpackDir: () => instancePath });
  return { rootPath, instancePath, manifests, service };
}
