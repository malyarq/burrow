import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { assertAbsolutePath, assertRelativePath, resolvePathWithinRoot } from '../../../security/pathGuards';
import { resolveApprovedInstancePath } from '../../instances/paths';
import { parseCurseForgeManifest } from '../parsers/curseforgeParser';
import { parseModrinthManifest } from '../parsers/modrinthParser';
import { nodeProviderDownloadPort } from '../installers';
import type { ModpackManifest } from '../../../../shared/types/modpack';
import { openValidatedZip, type ValidatedZip, type ValidatedZipEntry } from '../../../security/archivePolicy';

type ArchiveWriteTask = {
  entry: ValidatedZipEntry;
  targetPath: string;
  overwrite?: boolean;
};

type ModpackFormat = 'curseforge' | 'modrinth' | 'zip' | 'multimc';
type ModpackInfo = {
  format: ModpackFormat | null;
  manifest: ModpackManifest | null;
  error?: string;
};

function normalizeArchiveRelativePath(value: string, label: string): string {
  const trimmedValue = value.replace(/[\\/]+$/, '');
  if (!trimmedValue) throw new Error(`${label} must stay inside the launcher root`);
  return assertRelativePath(trimmedValue, label).split(path.sep).join('/');
}

function collectZipExtractionTasks(zip: ValidatedZip, targetDir: string): ArchiveWriteTask[] {
  const safeTargetDir = resolveApprovedInstancePath(targetDir);
  const tasks: ArchiveWriteTask[] = [];
  for (const entry of zip.getEntries()) {
    const normalizedEntryPath = normalizeArchiveRelativePath(entry.fileName, 'Archive entry path');
    if (entry.fileName.endsWith('/')) continue;
    tasks.push({
      entry,
      targetPath: resolvePathWithinRoot(safeTargetDir, normalizedEntryPath, `Archive entry "${entry.fileName}"`),
    });
  }
  return tasks;
}

function buildZipEntryLookup(zip: ValidatedZip): Map<string, ValidatedZipEntry> {
  const entryMap = new Map<string, ValidatedZipEntry>();
  for (const entry of zip.getEntries()) {
    const normalizedEntryPath = normalizeArchiveRelativePath(entry.fileName, 'Archive entry path');
    const existingEntry = entryMap.get(normalizedEntryPath);
    if (!existingEntry || existingEntry.fileName.endsWith('/')) entryMap.set(normalizedEntryPath, entry);
  }
  return entryMap;
}

async function writeArchiveTasks(zip: ValidatedZip, tasks: ArchiveWriteTask[]): Promise<void> {
  for (const task of tasks) {
    await fs.promises.mkdir(path.dirname(task.targetPath), { recursive: true });
    const output = fs.createWriteStream(task.targetPath, { flags: task.overwrite ? 'w' : 'wx' });
    try {
      const input = await zip.openReadStream(task.entry);
      await pipeline(input, output);
    } catch (error) {
      output.destroy();
      if (!task.overwrite && (error as NodeJS.ErrnoException).code !== 'EEXIST') await fs.promises.rm(task.targetPath, { force: true });
      throw error;
    }
  }
}

async function writeArchiveEntry(zip: ValidatedZip, entry: ValidatedZipEntry, targetPath: string): Promise<void> {
  await writeArchiveTasks(zip, [{ entry, targetPath }]);
}

export async function detectModpackFormat(filePath: string): Promise<ModpackFormat | null> {
  const safeFilePath = assertAbsolutePath(filePath, 'Modpack file path');
  if (path.extname(safeFilePath).toLowerCase() === '.mrpack') return 'modrinth';

  try {
    const zip = await openValidatedZip(safeFilePath, 'Modpack archive');
    try {
      const entries = zip.getEntries();
      if (entries.some((entry) => entry.fileName === 'modrinth.index.json')) return 'modrinth';
      if (entries.some((entry) => entry.fileName === 'manifest.json')) return 'curseforge';
      if (entries.some((entry) => entry.fileName.endsWith('mmc-pack.json') && !entry.fileName.includes('__MACOSX'))) return 'multimc';
      return 'zip';
    } finally {
      zip.close();
    }
  } catch {
    return null;
  }
}

export async function getModpackInfoFromFile(filePath: string): Promise<ModpackInfo> {
  try {
    const safeFilePath = assertAbsolutePath(filePath, 'Modpack file path');
    const format = await detectModpackFormat(safeFilePath);
    if (!format) return { format: null, manifest: null, error: 'Unable to detect modpack format' };

    const zip = await openValidatedZip(safeFilePath, 'Modpack archive');
    try {
      let manifest: ModpackManifest | null = null;
      if (format === 'curseforge') {
        const entry = zip.getEntry('manifest.json');
        if (!entry) return { format, manifest: null, error: 'CurseForge modpack missing manifest.json' };
        manifest = parseCurseForgeManifest((await zip.getData(entry, 8 * 1024 * 1024)).toString('utf8'));
      } else if (format === 'modrinth') {
        const entry = zip.getEntry('modrinth.index.json');
        if (!entry) return { format, manifest: null, error: 'Modrinth modpack missing modrinth.index.json' };
        manifest = parseModrinthManifest((await zip.getData(entry, 8 * 1024 * 1024)).toString('utf8'));
      } else if (format === 'multimc') {
        const entry = zip.getEntries().find((candidate) => candidate.fileName.endsWith('mmc-pack.json') && !candidate.fileName.includes('__MACOSX'));
        if (!entry) return { format, manifest: null, error: 'MultiMC pack missing mmc-pack.json' };
        const pack = JSON.parse((await zip.getData(entry, 8 * 1024 * 1024)).toString('utf8')) as {
          components?: Array<{ uid?: string; version?: string }>;
        };
        const components = pack.components ?? [];
        const findComponent = (uid: string) => components.find((component) => component.uid === uid);
        const minecraft = findComponent('net.minecraft');
        const loaders = [
          ['net.minecraftforge', 'forge'],
          ['net.fabricmc.fabric-loader', 'fabric'],
          ['org.quiltmc.quilt-loader', 'quilt'],
          ['net.neoforged.neoforge', 'neoforge'],
        ].flatMap(([uid, name]) => {
          const component = findComponent(uid);
          return component ? [{ id: `${name}-${component.version}`, primary: true }] : [];
        });
        const modsCount = zip.getEntries().filter((candidate) => !candidate.fileName.endsWith('/')
          && (candidate.fileName.includes('/mods/') || candidate.fileName.startsWith('mods/'))
          && candidate.fileName.endsWith('.jar')).length;
        const cfgEntry = zip.getEntries().find((candidate) => candidate.fileName.endsWith('instance.cfg') && !candidate.fileName.includes('__MACOSX'));
        let name = path.basename(safeFilePath, path.extname(safeFilePath));
        if (cfgEntry) {
          const match = (await zip.getData(cfgEntry, 1024 * 1024)).toString('utf8').match(/name=(.*)/);
          if (match) name = match[1];
        }
        manifest = {
          formatVersion: 1,
          minecraft: { version: minecraft?.version || 'Unknown', modLoaders: loaders },
          name,
          version: '1.0.0',
          files: new Array(modsCount).fill({ required: true }),
          author: 'MultiMC Export',
        };
      } else {
        const entry = zip.getEntry('manifest.json');
        manifest = entry
          ? parseCurseForgeManifest((await zip.getData(entry, 8 * 1024 * 1024)).toString('utf8'))
          : {
            formatVersion: 1,
            minecraft: { version: 'Unknown', modLoaders: [] },
            name: path.basename(safeFilePath, path.extname(safeFilePath)),
            version: '1.0.0',
            files: [],
          };
      }
      return { format, manifest };
    } finally {
      zip.close();
    }
  } catch (error) {
    return { format: null, manifest: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function importModpack(filePath: string, targetDir: string): Promise<{ manifest: ModpackManifest; format: ModpackFormat }> {
  const safeFilePath = assertAbsolutePath(filePath, 'Modpack file path');
  const safeTargetDir = resolveApprovedInstancePath(targetDir);
  const format = await detectModpackFormat(safeFilePath);
  if (!format) throw new Error('Unable to detect modpack format');

  const zip = await openValidatedZip(safeFilePath, 'Modpack archive');
  try {
    await fs.promises.mkdir(safeTargetDir, { recursive: true });
    let manifest: ModpackManifest;
    if (format === 'curseforge') {
      const entry = zip.getEntry('manifest.json');
      if (!entry) throw new Error('CurseForge modpack missing manifest.json');
      manifest = parseCurseForgeManifest((await zip.getData(entry, 8 * 1024 * 1024)).toString('utf8'));
      await extractOverrides(zip, resolvePathWithinRoot(safeTargetDir, manifest.overrides || 'overrides', 'Overrides directory'), manifest.overrides || 'overrides');
    } else if (format === 'modrinth') {
      const entry = zip.getEntry('modrinth.index.json');
      if (!entry) throw new Error('Modrinth modpack missing modrinth.index.json');
      manifest = parseModrinthManifest((await zip.getData(entry, 8 * 1024 * 1024)).toString('utf8'));
      const entryMap = buildZipEntryLookup(zip);
      const tasks: ArchiveWriteTask[] = [];
      for (const file of manifest.files) {
        if (!file.path) continue;
        const normalizedFilePath = normalizeArchiveRelativePath(file.path, 'Modrinth file path');
        const fileEntry = entryMap.get(normalizedFilePath);
        if (fileEntry && !fileEntry.fileName.endsWith('/')) {
          tasks.push({ entry: fileEntry, targetPath: resolvePathWithinRoot(safeTargetDir, normalizedFilePath, `Modrinth file "${file.path}"`) });
        }
      }
      await writeArchiveTasks(zip, tasks);
      await extractOverrides(zip, resolvePathWithinRoot(safeTargetDir, 'overrides', 'Overrides directory'), 'overrides');
    } else {
      await writeArchiveTasks(zip, collectZipExtractionTasks(zip, safeTargetDir));
      const manifestPath = resolvePathWithinRoot(safeTargetDir, 'manifest.json', 'Manifest path');
      manifest = fs.existsSync(manifestPath)
        ? parseCurseForgeManifest(await fs.promises.readFile(manifestPath, 'utf8'))
        : {
          formatVersion: 1,
          minecraft: { version: '1.20.1', modLoaders: [] },
          name: path.basename(targetDir),
          version: '1.0.0',
          files: [],
        };
    }
    return { manifest, format };
  } finally {
    zip.close();
  }
}

/**
 * Extract a supported local archive into a caller-owned private staging directory.
 * This function deliberately has no knowledge of live instance indexes or metadata.
 */
export async function stageArchiveImport(filePath: string, stagingDir: string): Promise<{
  manifest: ModpackManifest;
  format: Exclude<ModpackFormat, 'zip'>;
  missing: string[];
}> {
  const safeFilePath = assertAbsolutePath(filePath, 'Modpack file path');
  const safeStagingDir = assertAbsolutePath(stagingDir, 'Operation staging directory');
  const info = await getModpackInfoFromFile(safeFilePath);
  if (!info.format || !info.manifest || info.format === 'zip') {
    throw new Error('Unsupported import archive format');
  }

  const zip = await openValidatedZip(safeFilePath, 'Modpack archive');
  try {
    await fs.promises.mkdir(safeStagingDir, { recursive: true });
    const missing: string[] = [];
    if (info.format === 'curseforge') {
      const descriptor = zip.getEntry('manifest.json');
      if (!descriptor) throw new Error('CurseForge modpack missing manifest.json');
      await writeArchiveEntry(zip, descriptor, resolvePathWithinRoot(safeStagingDir, 'manifest.json', 'CurseForge manifest'));
      await extractOverrides(zip, safeStagingDir, info.manifest.overrides || 'overrides');
    } else if (info.format === 'modrinth') {
      const descriptor = zip.getEntry('modrinth.index.json');
      if (!descriptor) throw new Error('Modrinth modpack missing modrinth.index.json');
      await writeArchiveEntry(zip, descriptor, resolvePathWithinRoot(safeStagingDir, 'modrinth.index.json', 'Modrinth manifest'));
      const entryMap = buildZipEntryLookup(zip);
      const tasks: ArchiveWriteTask[] = [];
      for (const file of info.manifest.files) {
        if (!file.path) continue;
        if (file.env?.client === 'unsupported') continue;
        const normalizedFilePath = normalizeArchiveRelativePath(file.path, 'Modrinth file path');
        const entry = entryMap.get(normalizedFilePath);
        if (entry && !entry.fileName.endsWith('/')) {
          tasks.push({ entry, targetPath: resolvePathWithinRoot(safeStagingDir, normalizedFilePath, `Modrinth file "${file.path}"`) });
        }
      }
      await writeArchiveTasks(zip, tasks);
      for (const file of info.manifest.files) {
        if (!file.path) continue;
        if (file.env?.client === 'unsupported') continue;
        const normalizedFilePath = normalizeArchiveRelativePath(file.path, 'Modrinth file path');
        const targetPath = resolvePathWithinRoot(safeStagingDir, normalizedFilePath, `Modrinth file "${file.path}"`);
        if (fs.existsSync(targetPath)) {
          await verifyManifestFile(targetPath, file.path, file.hashes);
          continue;
        }
        try {
          if (!file.downloads?.length) throw new Error('Modrinth manifest file has no download URL');
          await nodeProviderDownloadPort.download({
            urls: file.downloads,
            destination: targetPath,
            sha1: file.hashes?.sha1,
            label: `Modrinth file ${file.path} download URL`,
          });
        } catch (error) {
          if (file.required) throw new Error(`Required Modrinth file could not be staged: ${file.path}: ${error instanceof Error ? error.message : 'download failed'}`);
          missing.push(file.path);
        }
      }
      await extractOverrides(zip, safeStagingDir, 'overrides');
      await extractOverrides(zip, safeStagingDir, 'client-overrides');
    } else {
      const manifestEntry = zip.getEntries().find((entry) => entry.fileName.endsWith('mmc-pack.json') && !entry.fileName.includes('__MACOSX'));
      if (!manifestEntry) throw new Error('MultiMC pack missing mmc-pack.json');
      const manifestPath = normalizeArchiveRelativePath(manifestEntry.fileName, 'MultiMC manifest path');
      const zipRoot = path.posix.dirname(manifestPath) === '.' ? '' : path.posix.dirname(manifestPath);
      const minecraftPrefix = zipRoot ? `${zipRoot}/.minecraft/` : '.minecraft/';
      const tasks = zip.getEntries().flatMap((entry): ArchiveWriteTask[] => {
        const entryPath = normalizeArchiveRelativePath(entry.fileName, 'Archive entry path');
        if (!entryPath.startsWith(minecraftPrefix) || entry.fileName.endsWith('/')) return [];
        const relativePath = entryPath.slice(minecraftPrefix.length);
        return relativePath ? [{ entry, targetPath: resolvePathWithinRoot(safeStagingDir, relativePath, `Archive entry "${entry.fileName}"`) }] : [];
      });
      await writeArchiveTasks(zip, tasks);
    }
    return { manifest: info.manifest, format: info.format, missing };
  } finally {
    zip.close();
  }
}

async function verifyManifestFile(filePath: string, label: string, hashes: { sha1?: string; sha512?: string } | undefined): Promise<void> {
  const checks = ([['sha1', hashes?.sha1], ['sha512', hashes?.sha512]] as const)
    .flatMap(([algorithm, expected]) => expected ? [{ hash: crypto.createHash(algorithm), expected }] : []);
  if (checks.length === 0) return;
  for await (const chunk of fs.createReadStream(filePath)) {
    for (const { hash } of checks) hash.update(chunk);
  }
  for (const { hash, expected } of checks) {
    if (hash.digest('hex').toLowerCase() !== expected.toLowerCase()) {
      throw new Error(`Bundled Modrinth file hash mismatch: ${label}`);
    }
  }
}

async function extractOverrides(zip: ValidatedZip, targetDir: string, zipPath: string): Promise<void> {
  const safeTargetDir = assertAbsolutePath(targetDir, 'Overrides directory');
  const safeZipPath = normalizeArchiveRelativePath(zipPath, 'Archive overrides path');
  const tasks: ArchiveWriteTask[] = [];
  for (const entry of zip.getEntries()) {
    const normalizedEntryPath = normalizeArchiveRelativePath(entry.fileName, 'Archive entry path');
    if (normalizedEntryPath !== safeZipPath && !normalizedEntryPath.startsWith(`${safeZipPath}/`)) continue;
    const relativePath = normalizedEntryPath === safeZipPath ? '' : normalizedEntryPath.slice(safeZipPath.length + 1);
    if (!relativePath || entry.fileName.endsWith('/')) continue;
    tasks.push({
      entry,
      targetPath: resolvePathWithinRoot(safeTargetDir, relativePath, `Archive entry "${entry.fileName}"`),
      overwrite: true,
    });
  }
  await writeArchiveTasks(zip, tasks);
}
