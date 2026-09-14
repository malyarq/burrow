import fs from 'node:fs';
import path from 'node:path';
import type { CurseforgeV1Client } from '@xmcl/curseforge';
import type { ModrinthV2Client } from '@xmcl/modrinth';
import { assertChildName, assertRelativePath, resolvePathWithinRoot } from '../../security/pathGuards';
import { getModpackDir, resolveLauncherRootPath } from '../instances/paths';
import {
  nodeProviderArchivePort,
  nodeProviderContentPort,
  nodeProviderDownloadPort,
  stageCurseForgeModpack,
  stageModrinthModpack,
  type ProviderStagedInstall,
} from '../modpacks/installers';
import { readCanonicalRecordFromContent } from './canonicalRecord';
import { StagingWorkspace } from './stagingWorkspace';
import type { InstanceCommand, InstanceEditableConfig } from '../../domains/instances/instanceTypes';
import type { OperationAdapter, OperationContext, OperationInput, OperationResult } from './operationTypes';

export type ProviderStageInput = Readonly<{
  rootPath: string;
  destinationId: string;
  checkCancelled(): void;
}>;

export type ProviderStageResult = ProviderStagedInstall;

export type ProviderInstallers = Readonly<{
  curseforge(input: ProviderStageInput & Readonly<{ projectId: number; fileId: number }>): Promise<ProviderStageResult>;
  modrinth(input: ProviderStageInput & Readonly<{ projectId: string; versionId: string }>): Promise<ProviderStageResult>;
}>;

export type ProviderInstallOperationOptions = Readonly<{
  installers: ProviderInstallers;
  faults?: Partial<Record<'validation' | 'publish' | 'control-plane', () => void>>;
}>;

/** Live provider SDKs remain staging-only adapters; publication belongs to OperationRunner. */
export function createLiveProviderInstallers(
  providers: Readonly<{ curseforge(): CurseforgeV1Client | null; modrinth(): ModrinthV2Client }>,
): ProviderInstallers {
  return {
    curseforge: async ({ rootPath, destinationId, projectId, fileId, checkCancelled }) => {
      const provider = providers.curseforge();
      if (!provider) throw new Error('CurseForge API key is not configured');
      return await stageCurseForgeModpack({ provider, download: nodeProviderDownloadPort, archive: nodeProviderArchivePort, content: nodeProviderContentPort }, {
        projectId, fileId, destinationId, stagingRoot: rootPath, checkCancelled,
      });
    },
    modrinth: async ({ rootPath, destinationId, projectId, versionId, checkCancelled }) => await stageModrinthModpack({
      provider: providers.modrinth(), download: nodeProviderDownloadPort, archive: nodeProviderArchivePort, content: nodeProviderContentPort,
    }, { projectId, versionId, destinationId, stagingRoot: rootPath, checkCancelled }),
  };
}

export function createProviderInstallOperationAdapters(options: ProviderInstallOperationOptions): OperationAdapter[] {
  return [
    createProviderInstallOperationAdapter('install-curseforge', options),
    createProviderInstallOperationAdapter('install-modrinth', options),
  ];
}

function createProviderInstallOperationAdapter(kind: Extract<OperationInput['kind'], 'install-curseforge' | 'install-modrinth'>, options: ProviderInstallOperationOptions): OperationAdapter {
  return {
    kind,
    async run(context): Promise<OperationResult> {
      const input = context.snapshot.input;
      if (input.kind !== kind) throw new Error(`Provider adapter received an invalid ${kind} input`);
      const rootPath = resolveLauncherRootPath(input.rootPath);
      const destinationId = assertChildName(input.destinationId ?? defaultDestinationId(input), 'Provider destination modpack id');
      const destinationPath = getModpackDir(rootPath, destinationId);
      const workspace = new StagingWorkspace(rootPath, context.snapshot.id);
      let backupCreated = false;
      let published = false;

      context.setRecoveryData({ destinationId, destinationName: input.name?.trim() || destinationId, missing: [] });
      try {
        const stage = input.kind === 'install-curseforge'
          ? await options.installers.curseforge({ rootPath: workspace.stagingRoot, destinationId, projectId: input.projectId, fileId: input.fileId, checkCancelled: () => throwIfCancelled(context) })
          : await options.installers.modrinth({ rootPath: workspace.stagingRoot, destinationId, projectId: input.projectId, versionId: input.versionId, checkCancelled: () => throwIfCancelled(context) });
        throwIfCancelled(context);
        validateStageResult(stage, destinationId);
        const providerFiles = listFiles(workspace.stagedModpack(destinationId));
        if (fs.existsSync(destinationPath)) {
          if (stage.source.source === 'curseforge' && !hasProviderOwnership(destinationPath)) {
            throw new Error('This legacy CurseForge instance cannot be safely updated. Install the new version as a separate copy, then move your saves and local content manually.');
          }
          mergeProviderUpdate(workspace.stagedModpack(destinationId), destinationPath, destinationId, providerFiles, canonicalPreferences(context, destinationId));
        }
        writeProviderOwnership(workspace.stagedModpack(destinationId), providerFiles);
        context.setRecoveryData({ destinationId, destinationName: stage.config.name, missing: [...stage.missing] });
        workspace.markStaged(workspace.stagedModpack(destinationId));
        context.transition('staged', { completed: 1, total: 4, message: 'staged' });

        options.faults?.validation?.();
        throwIfCancelled(context);
        validateStagedProviderInstall(workspace.stagedModpack(destinationId), destinationId);
        const command = canonicalCommand(workspace.stagedModpack(destinationId), destinationId, stage);
        context.recordCanonicalCommand(command);
        context.transition('validated', { completed: 2, total: 4, message: 'validated' });
        throwIfCancelled(context);

        options.faults?.publish?.();
        context.setPublishIntent(destinationId, fs.existsSync(destinationPath), { completed: 2, total: 4, message: 'publish-intent' });
        backupCreated = workspace.createBackup(destinationPath, destinationId);
        if (backupCreated) context.transition('backup-created', { completed: 2, total: 4, message: 'backup-created' });
        workspace.publish(destinationPath, destinationId);
        published = true;
        context.transition('published', { completed: 3, total: 4, message: 'published' });

        options.faults?.['control-plane']?.();
        await commitControlPlane(context, command);
        context.transition('control-plane-committed', { completed: 4, total: 4, message: 'control-plane-committed' });
        workspace.removePublishMarker(destinationPath);
        workspace.cleanupStaging();
        workspace.cleanupBackups();
        return stage.missing.length > 0 ? { status: 'degraded', instanceId: destinationId, missing: [...stage.missing] } : { status: 'succeeded', instanceId: destinationId };
      } catch (error) {
        if (context.isControlPlaneCommitted()) {
          workspace.cleanupStaging();
          throw error;
        }
        if (backupCreated && !workspace.restoreDestination(destinationPath, destinationId)) return { status: 'recovery-required', message: 'Provider rollback destination is ambiguous' };
        if (published && !backupCreated && workspace.recoverUncommittedDestination(destinationPath, destinationId) === false) throw new Error('ROLLBACK_RECOVERY_REQUIRED');
        workspace.cleanupStaging();
        if (backupCreated) workspace.cleanupBackups();
        throw error;
      }
    },
    async recoverPublished(context): Promise<OperationResult> {
      return await context.replayCanonicalCommand();
    },
  };
}

const PROVIDER_OWNERSHIP_FILE = '.burrow-provider-content.json';
const USER_CONTENT = new Set(['saves', 'screenshots', 'config', 'resourcepacks', 'shaderpacks', 'options.txt', 'optionsshaders.txt']);

/**
 * Provider updates begin with the old instance, remove only files previously
 * attributed to the provider, then overlay the new provider stage. This keeps
 * saves, settings, and locally added content while removing obsolete provider
 * files whenever the previous descriptor or ownership record proves ownership.
 */
function mergeProviderUpdate(stagedPath: string, existingPath: string, destinationId: string, providerFiles: readonly string[], preferences: Partial<InstanceEditableConfig>): void {
  const oldOwned = readProviderOwnership(existingPath);
  assertNoSymlinks(stagedPath);
  assertNoSymlinks(existingPath);
  const mergedPath = resolvePathWithinRoot(path.dirname(stagedPath), `${path.basename(stagedPath)}.merged`, 'Provider merged staging directory');
  fs.cpSync(existingPath, mergedPath, { recursive: true, force: false, errorOnExist: true });
  for (const relativePath of oldOwned) removeOwnedPath(mergedPath, relativePath);
  for (const relativePath of providerFiles) {
    const source = resolvePathWithinRoot(stagedPath, relativePath, 'Provider staged file');
    const destination = resolvePathWithinRoot(mergedPath, relativePath, 'Provider merged file');
    if (isUserContent(relativePath) && fs.existsSync(destination)) continue;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
  preserveCanonicalPreferences(mergedPath, destinationId, preferences);
  fs.rmSync(stagedPath, { recursive: true, force: true });
  fs.renameSync(mergedPath, stagedPath);
}

function hasProviderOwnership(instancePath: string): boolean {
  try {
    const parsed = JSON.parse(fs.readFileSync(resolvePathWithinRoot(instancePath, PROVIDER_OWNERSHIP_FILE, 'Provider ownership record'), 'utf8')) as { files?: unknown };
    return Array.isArray(parsed.files) && parsed.files.every((file) => typeof file === 'string' && isSafeRelativeFile(file));
  } catch { return false; }
}

function readProviderOwnership(instancePath: string): string[] {
  const ownershipPath = resolvePathWithinRoot(instancePath, PROVIDER_OWNERSHIP_FILE, 'Provider ownership record');
  try {
    const parsed = JSON.parse(fs.readFileSync(ownershipPath, 'utf8')) as { files?: unknown };
    if (Array.isArray(parsed.files) && parsed.files.every((file) => typeof file === 'string')) return parsed.files.filter((file) => isSafeRelativeFile(file));
  } catch {
    // Older instances did not have an ownership record; their descriptor still
    // proves Modrinth file paths without guessing about user content.
  }
  return legacyProviderFiles(instancePath);
}

function legacyProviderFiles(instancePath: string): string[] {
  const descriptor = resolvePathWithinRoot(instancePath, 'modrinth.index.json', 'Modrinth descriptor');
  try {
    const parsed = JSON.parse(fs.readFileSync(descriptor, 'utf8')) as { files?: Array<{ path?: unknown }> };
    if (Array.isArray(parsed.files)) return ['modpack.json', 'modrinth.index.json', ...parsed.files.map((file) => file.path).filter((file): file is string => typeof file === 'string' && isSafeRelativeFile(file))];
  } catch {
    // CurseForge manifests do not include installed filenames, so retaining an
    // unproven legacy mod is safer than deleting a user's local mod.
  }
  return ['modpack.json', 'manifest.json'];
}

function writeProviderOwnership(stagedPath: string, providerFiles: readonly string[]): void {
  fs.writeFileSync(resolvePathWithinRoot(stagedPath, PROVIDER_OWNERSHIP_FILE, 'Provider ownership record'), JSON.stringify({ version: 1, files: providerFiles }));
}

function listFiles(root: string): string[] {
  const result: string[] = [];
  const visit = (directory: string, prefix: string): void => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) throw new Error('Provider updates reject symbolic links');
      if (entry.isDirectory()) visit(resolvePathWithinRoot(root, relativePath, 'Provider staged directory'), relativePath);
      else if (entry.isFile() && isSafeRelativeFile(relativePath)) result.push(relativePath);
    }
  };
  visit(root, '');
  return result;
}

function isSafeRelativeFile(relativePath: string): boolean {
  try { return assertRelativePath(relativePath, 'Provider content path') !== PROVIDER_OWNERSHIP_FILE; } catch { return false; }
}

function removeOwnedPath(root: string, relativePath: string): void {
  if (!isSafeRelativeFile(relativePath) || isUserContent(relativePath)) return;
  fs.rmSync(resolvePathWithinRoot(root, relativePath, 'Provider-owned file'), { force: true });
}

function isUserContent(relativePath: string): boolean {
  return USER_CONTENT.has(relativePath.split(/[\\/]/)[0].toLocaleLowerCase('en-US'));
}

function assertNoSymlinks(root: string): void { listFiles(root); }

function canonicalPreferences(context: OperationContext, destinationId: string): Partial<InstanceEditableConfig> {
  const current = context.currentControlPlane();
  const record = current?.status === 'ready'
    ? current.snapshot.records.find((candidate) => candidate.id === destinationId)
    : undefined;
  return record?.config ?? {};
}

function preserveCanonicalPreferences(stagedPath: string, destinationId: string, preferences: Partial<InstanceEditableConfig>): void {
  const configPath = resolvePathWithinRoot(stagedPath, 'modpack.json', 'Provider staged config');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as Record<string, unknown>;
  if (config.id !== destinationId) throw new Error('Staged provider install config id is invalid');
  for (const key of ['memory', 'vmOptions', 'game', 'server', 'networkMode'] as const) if (preferences[key] !== undefined) config[key] = preferences[key];
  if (preferences.java !== undefined) config.java = { path: preferences.java.executable };
  fs.writeFileSync(configPath, JSON.stringify(config));
}

function defaultDestinationId(input: Extract<OperationInput, { kind: 'install-curseforge' | 'install-modrinth' }>): string {
  const seed = input.kind === 'install-curseforge' ? `curseforge-${input.projectId}-${input.fileId}` : `modrinth-${input.projectId}-${input.versionId}`;
  return seed.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').slice(0, 80) || 'provider-install';
}

function validateStageResult(stage: ProviderStageResult, destinationId: string): void {
  if (stage.config.id !== destinationId || stage.content.instanceId !== destinationId) throw new Error('Provider installer returned an invalid staged instance');
  if (!['curseforge', 'modrinth'].includes(stage.source.source) || !stage.source.sourceId || !stage.source.sourceVersionId) throw new Error('Provider installer returned invalid source metadata');
}

function validateStagedProviderInstall(stagedPath: string, destinationId: string): void {
  const configPath = resolvePathWithinRoot(stagedPath, 'modpack.json', 'Staged provider install config');
  if (!fs.existsSync(configPath)) throw new Error('Staged provider install is missing modpack.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as { id?: unknown; runtime?: { minecraft?: unknown } };
  if (config.id !== destinationId || typeof config.runtime?.minecraft !== 'string' || !config.runtime.minecraft) throw new Error('Staged provider install config is invalid');
}

function canonicalCommand(stagedPath: string, destinationId: string, stage: ProviderStageResult): InstanceCommand {
  const record = readCanonicalRecordFromContent(stagedPath, destinationId);
  return {
    version: 1,
    type: 'commit-published',
    record: { ...record, source: { ...stage.source, createdAt: record.source.createdAt, updatedAt: record.source.updatedAt } },
    select: true,
  };
}

async function commitControlPlane(context: OperationContext, command: InstanceCommand): Promise<void> {
  const result = await context.commitControlPlane(command);
  if ('code' in result) throw new Error(result.message);
}

function throwIfCancelled(context: OperationContext): void {
  if (context.isCancelled()) throw new Error('Operation cancelled');
}
