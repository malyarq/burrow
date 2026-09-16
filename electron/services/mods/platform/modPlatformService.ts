import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';
import fs from 'fs-extra';
import { download } from '@xmcl/file-transfer';
import { ModrinthV2Client } from '@xmcl/modrinth';
import { CurseforgeV1Client, type File as CurseforgeFile, type Mod as CurseforgeMod } from '@xmcl/curseforge';
import type { InstanceApplication } from '../../../domains/instances/instanceApplication';
import type { LauncherRoot } from '../../../domains/instances/instanceTypes';
import type { ModInstallRequest } from '../../../../shared/contracts/mods';
import type { ProviderCatalogContents, ProviderCatalogContentsRequest } from '../../../../shared/contracts/providerCatalog';
import { ensureDir } from './fsUtils';
import { CF_SORT_POPULARITY, CF_SORT_LAST_UPDATED, CF_SORT_NAME, mapLoaderToCurseforge, mapLoaderToModrinth } from './loaderMapping';
import { pickPrimaryModrinthFile } from './modrinthUtils';
import { InstanceManifestManager } from '../../instances/manifestManager';
import { openValidatedZip } from '../../../security/archivePolicy';
import { fetchPublicHttpsUrl } from '../../../security/remoteUrls';
import { assertChildName, resolvePathWithinRoot } from '../../../security/pathGuards';
import { parseCurseForgeManifest } from '../../modpacks/parsers/curseforgeParser';
import { parseModrinthManifest } from '../../modpacks/parsers/modrinthParser';
import {
  type GuidedContentInstallIssue,
  type GuidedContentInstallIssueStatus,
  type GuidedContentInstallResult,
  isManifestManagedContentType,
  type ModInstallResult,
  type ModSearchQuery,
  type ModSearchResult,
  type ModVersionDescriptor,
  type ModVersionQuery,
} from './types';

type CurseforgeSearchMod = CurseforgeMod & {
  dateCreated?: string;
  dateModified?: string;
  latestFilesIndexes?: Array<{
    gameVersion?: string | null;
  }>;
  latestFiles?: Array<{
    gameVersions?: string[] | null;
  }>;
};

type ModrinthSearchHitWithVersions = Awaited<ReturnType<ModrinthV2Client['searchProjects']>>['hits'][number] & {
  versions?: string[];
};

/** Filesystem-backed instance access remains at the provider infrastructure edge. */
export interface ModPlatformContentPort {
  resolveRoot(rootPath: string): Promise<LauncherRoot>;
  getModpackDir(rootPath: string, instanceId: string): string;
}

function isReleaseMinecraftVersion(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^\d+\.\d+(?:\.\d+)?$/.test(value.trim());
}

function compareMinecraftReleaseVersions(left: string, right: string): number {
  const leftParts = left.split('.').map((part) => Number.parseInt(part, 10));
  const rightParts = right.split('.').map((part) => Number.parseInt(part, 10));
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;

    if (leftPart !== rightPart) {
      return rightPart - leftPart;
    }
  }

  return 0;
}

function pickPreferredMinecraftVersion(values: Array<string | null | undefined>): string | undefined {
  const versions = Array.from(
    new Set(values.map((value) => value?.trim()).filter(isReleaseMinecraftVersion)),
  );

  versions.sort(compareMinecraftReleaseVersions);
  return versions[0];
}

function isGuidedContentType(contentType: ModInstallRequest['contentType']): contentType is 'resourcepack' | 'shader' {
  return contentType === 'resourcepack' || contentType === 'shader';
}

const DEFAULT_OVERRIDE_ROOTS = ['overrides', 'client-overrides', 'server-overrides'];

export function classifyPackPath(value: string | undefined, overrideRoots: readonly string[] = DEFAULT_OVERRIDE_ROOTS): 'mod' | 'resourcepack' | 'shader' | 'other' {
  const normalized = value?.replace(/\\/g, '/') ?? '';
  const root = overrideRoots.find((candidate) => normalized.toLowerCase().startsWith(`${candidate.toLowerCase()}/`));
  const path = (root ? normalized.slice(root.length + 1) : normalized).toLowerCase();
  if (path.startsWith('mods/')) return 'mod';
  if (path.startsWith('resourcepacks/')) return 'resourcepack';
  if (path.startsWith('shaderpacks/')) return 'shader';
  return 'other';
}

export const PREVIEW_ARCHIVE_MAX_BYTES = 32 * 1024 * 1024;
const PREVIEW_ARCHIVE_TIMEOUT_MS = 20_000;

async function downloadPreviewArchive(url: string, destination: string, label: string): Promise<void> {
  const response = await fetchPublicHttpsUrl(url, label, { signal: AbortSignal.timeout(PREVIEW_ARCHIVE_TIMEOUT_MS) });
  if (!response.ok || !response.body) throw new Error(`${label} could not be downloaded (${response.status})`);
  const length = Number(response.headers.get('content-length'));
  if (Number.isFinite(length) && length > PREVIEW_ARCHIVE_MAX_BYTES) {
    await response.body.cancel();
    throw new Error(`${label} exceeds the ${PREVIEW_ARCHIVE_MAX_BYTES / (1024 * 1024)} MB preview limit`);
  }
  const handle = await fs.promises.open(destination, 'w');
  let received = 0;
  try {
    const reader = response.body.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > PREVIEW_ARCHIVE_MAX_BYTES) {
          await reader.cancel();
          throw new Error(`${label} exceeds the ${PREVIEW_ARCHIVE_MAX_BYTES / (1024 * 1024)} MB preview limit`);
        }
        await handle.writeFile(value);
      }
    } finally {
      await reader.cancel().catch(() => undefined);
      reader.releaseLock();
    }
  } finally {
    await handle.close();
  }
}

export class ModPlatformService {
  private readonly modrinth: ModrinthV2Client;
  private readonly curseforge: CurseforgeV1Client | null;
  private readonly previewContents = new Map<string, Promise<ProviderCatalogContents>>();

  constructor(
    private readonly instanceApplication: InstanceApplication,
    private readonly content: ModPlatformContentPort,
    options?: { curseforgeApiKey?: string },
  ) {
    this.modrinth = new ModrinthV2Client();
    const key = options?.curseforgeApiKey ?? process.env.CURSEFORGE_API_KEY;
    this.curseforge = key ? new CurseforgeV1Client(key) : null;
  }

  private manifestManager = new InstanceManifestManager();

  private createGuidedContentInstallIssue(
    fileName: string,
    status: GuidedContentInstallIssueStatus,
    message: string,
  ): GuidedContentInstallIssue {
    return { fileName, status, message };
  }

  private createGuidedContentInstallResult(
    status: GuidedContentInstallResult['status'],
    details: Partial<Omit<GuidedContentInstallResult, 'status' | 'issues'>> = {},
    issues: GuidedContentInstallIssue[] = [],
  ): GuidedContentInstallResult {
    return {
      status,
      destination: details.destination,
      filename: details.filename,
      usedUrl: details.usedUrl,
      issues,
    };
  }

  private async hasResourcePackPayload(filePath: string): Promise<boolean> {
    try {
      if (!filePath.toLowerCase().endsWith('.zip')) {
        return false;
      }

      const zip = await openValidatedZip(filePath, 'Mod archive');
      try {
        const mcmetaEntry = zip.getEntry('pack.mcmeta');
        if (!mcmetaEntry) return false;

        const content = JSON.parse((await zip.getData(mcmetaEntry, 1024 * 1024)).toString('utf8')) as {
          pack?: { pack_format?: number };
        };
        return typeof content.pack?.pack_format === 'number';
      } finally {
        zip.close();
      }
    } catch {
      return false;
    }
  }

  private async hasShaderPayload(filePath: string): Promise<boolean> {
    try {
      if (!filePath.toLowerCase().endsWith('.zip')) {
        return false;
      }

      const zip = await openValidatedZip(filePath, 'Mod archive');
      try {
        return zip.getEntries().some((entry) => entry.fileName.startsWith('shaders/'));
      } finally {
        zip.close();
      }
    } catch {
      return false;
    }
  }

  private async validateGuidedContentArchive(
    filePath: string,
    fileName: string,
    contentType: 'resourcepack' | 'shader',
  ): Promise<GuidedContentInstallIssue | null> {
    const isValid = contentType === 'resourcepack'
      ? await this.hasResourcePackPayload(filePath)
      : await this.hasShaderPayload(filePath);

    if (isValid) {
      return null;
    }

    const message = contentType === 'resourcepack'
      ? 'The downloaded archive is missing a readable pack.mcmeta file.'
      : 'The downloaded archive does not contain a shaders/ directory.';

    return this.createGuidedContentInstallIssue(fileName, 'invalid-archive', message);
  }

  private getGuidedContentFailureMessage(contentType: 'resourcepack' | 'shader'): string {
    return contentType === 'resourcepack'
      ? 'Burrow could not download this resource pack into the current modpack.'
      : 'Burrow could not download this shader pack into the current modpack.';
  }

  public async searchMods(query: ModSearchQuery): Promise<ModSearchResult> {
    const sort = query.sort ?? 'popularity';
    const contentType = query.contentType ?? 'mod';

    // Map contentType to platform-specific filter
    const modrinthProjectType = contentType === 'resourcepack' ? 'resourcepack'
      : contentType === 'shader' ? 'shader'
        : contentType === 'datapack' ? 'datapack'
          : 'mod';
    // CurseForge classIds: 6=Mods, 12=Resource Packs, 6552=Shaders
    const curseforgeClassId = contentType === 'resourcepack' ? 12
      : contentType === 'shader' ? 6552
        : 6;

    if (query.platform === 'modrinth') {
      const facets: string[][] = [[`project_type:${modrinthProjectType}`]];
      const loader = mapLoaderToModrinth(query.loader);
      if (loader) facets.push([`categories:${loader}`]);
      if (query.mcVersion) facets.push([`versions:${query.mcVersion}`]);

      let index: string;
      switch (sort) {
        case 'date':
          index = 'newest';
          break;
        case 'alphabetical':
          index = 'relevance'; // will sort client-side
          break;
        case 'popularity':
        default:
          index = 'downloads';
          break;
      }

      const fetchLimit = sort === 'alphabetical' ? Math.min((query.limit ?? 20) * 10, 100) : (query.limit ?? 20);
      const result = await this.modrinth.searchProjects({
        query: query.query,
        facets: JSON.stringify(facets),
        index,
        offset: sort === 'alphabetical' ? 0 : (query.offset ?? 0),
        limit: fetchLimit,
      });

      let items = result.hits.map((h) => ({
        platform: 'modrinth' as const,
        projectId: h.project_id,
        slug: h.slug,
        title: h.title,
        description: h.description,
        iconUrl: h.icon_url,
        downloads: h.downloads,
      }));

      if (sort === 'alphabetical') {
        items.sort((a, b) => a.title.localeCompare(b.title));
        const start = query.offset ?? 0;
        const limit = query.limit ?? 20;
        items = items.slice(start, start + limit);
      }

      return {
        items,
        total: result.total_hits,
        offset: query.offset ?? 0,
        limit: query.limit ?? 20,
      };
    }

    // curseforge
    if (!this.curseforge) {
      throw new Error('CurseForge API key is not configured. Set CURSEFORGE_API_KEY env var.');
    }

    let sortField: number;
    switch (sort) {
      case 'date':
        sortField = CF_SORT_LAST_UPDATED;
        break;
      case 'alphabetical':
        sortField = CF_SORT_NAME;
        break;
      case 'popularity':
      default:
        sortField = CF_SORT_POPULARITY;
        break;
    }

    const modLoaderType = mapLoaderToCurseforge(query.loader);
    const res = await this.curseforge.searchMods({
      gameId: 432,
      classId: curseforgeClassId,
      searchFilter: query.query,
      gameVersion: query.mcVersion,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modLoaderType: modLoaderType as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sortField: sortField as any,
      sortOrder: sort === 'alphabetical' ? 'asc' : 'desc',
      index: query.offset ?? 0,
      pageSize: query.limit ?? 20,
    });

    return {
      items: res.data.map((m: CurseforgeMod) => ({
        platform: 'curseforge',
        projectId: String(m.id),
        slug: m.slug,
        title: m.name,
        description: m.summary,
        iconUrl: m.logo?.thumbnailUrl,
        downloads: m.downloadCount,
      })),
      total: res.pagination.totalCount,
      offset: res.pagination.index,
      limit: res.pagination.pageSize,
    };
  }

  public async getModVersions(query: ModVersionQuery): Promise<ModVersionDescriptor[]> {
    if (query.platform === 'modrinth') {
      const projectId = query.projectId.startsWith('local-') ? query.projectId.slice('local-'.length) : query.projectId;
      const loaders = mapLoaderToModrinth(query.loader) ? [mapLoaderToModrinth(query.loader)!] : undefined;
      const versions = query.mcVersion ? [query.mcVersion] : undefined;
      const all = await this.modrinth.getProjectVersions(projectId, { loaders, gameVersions: versions });

      const sliced = (typeof query.offset === 'number' || typeof query.limit === 'number')
        ? all.slice(query.offset ?? 0, (query.offset ?? 0) + (query.limit ?? all.length))
        : all;

      return sliced.map((v) => ({
        platform: 'modrinth',
        versionId: v.id,
        name: v.name,
        versionNumber: v.version_number,
        mcVersions: v.game_versions,
        loaders: v.loaders,
        files: v.files.map((f) => ({
          url: f.url,
          filename: f.filename,
          size: f.size,
          hashes: f.hashes,
          sha1: f.hashes?.sha1,
        })),
      }));
    }

    // curseforge
    if (!this.curseforge) {
      throw new Error('CurseForge API key is not configured. Set CURSEFORGE_API_KEY env var.');
    }

    const modId = Number(query.projectId);
    if (!Number.isFinite(modId)) throw new Error(`Invalid CurseForge modId: ${query.projectId}`);

    const modLoaderType = mapLoaderToCurseforge(query.loader);
    const pageSize = query.limit ?? 20;
    const index = query.offset ?? 0;
    const res = await this.curseforge.getModFiles({
      modId,
      gameVersion: query.mcVersion,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modLoaderType: modLoaderType as any,
      index,
      pageSize,
    });

    return res.data.map((f: CurseforgeFile) => ({
      platform: 'curseforge',
      versionId: String(f.id),
      name: f.displayName || f.fileName,
      versionNumber: undefined,
      mcVersions: f.gameVersions ?? [],
      loaders: [],
      files: [
        {
          url: f.downloadUrl ?? '',
          filename: f.fileName,
          size: f.fileLength,
          sha1: f.hashes?.find((h) => h.algo === 1 /* sha1 */)?.value,
        },
      ],
    }));
  }

  public async installModFile(req: ModInstallRequest, rootPath: string): Promise<ModInstallResult> {
    const root = await this.content.resolveRoot(rootPath);
    const state = await this.instanceApplication.read(root);
    if (state.status !== 'ready' || !state.snapshot.records.some((record) => record.id === req.instanceId)) {
      throw new Error(`Canonical instance does not exist: ${req.instanceId}`);
    }

    // Determine destination folder based on contentType
    const contentType = req.contentType ?? 'mod';
    const folderName = contentType === 'resourcepack' ? 'resourcepacks'
      : contentType === 'shader' ? 'shaderpacks'
        : 'mods';

    // IPC installs are always scoped to a canonical instance resolved by main.
    const instanceDir = this.content.getModpackDir(rootPath, req.instanceId);
    const destDir = path.join(instanceDir, folderName);

    const guidedContentType = isGuidedContentType(contentType) ? contentType : null;

    const finalizeInstall = async (params: {
      destination: string;
      primaryUrl: string;
      fallbackUrls?: string[];
      filename: string;
      sha1?: string;
      trackSource: 'modrinth' | 'curseforge';
      trackProjectId: string;
      trackVersionId: string;
    }): Promise<ModInstallResult> => {
      const {
        destination,
        primaryUrl,
        fallbackUrls,
        filename,
        sha1,
        trackSource,
        trackProjectId,
        trackVersionId,
      } = params;

      if (guidedContentType) {
        if (await fs.pathExists(destination)) {
          return this.createGuidedContentInstallResult('duplicate', {}, [
            this.createGuidedContentInstallIssue(
              filename,
              'duplicate',
              guidedContentType === 'resourcepack'
                ? 'A resource pack with this file name already exists in the instance.'
                : 'A shader pack with this file name already exists in the instance.',
            ),
          ]);
        }
      }

      const tempDestination = path.join(destDir, `.${filename}.burrow-download-${randomUUID()}`);

      try {
        if (guidedContentType && await fs.pathExists(tempDestination)) {
          await fs.remove(tempDestination);
        }

        await download({
          url: [primaryUrl, ...(fallbackUrls ?? [])],
          destination: tempDestination,
          validator: sha1 ? { algorithm: 'sha1', hash: sha1 } : undefined,
        });

        if (guidedContentType) {
          const validationIssue = await this.validateGuidedContentArchive(
            tempDestination,
            filename,
            guidedContentType,
          );

          if (validationIssue) {
            await fs.remove(tempDestination);
            return this.createGuidedContentInstallResult('invalid-archive', {}, [validationIssue]);
          }

          await fs.move(tempDestination, destination, { overwrite: false });
          return this.createGuidedContentInstallResult(
            'success',
            {
              destination,
              filename,
              usedUrl: primaryUrl,
            },
            [],
          );
        }
      } catch (error) {
        if (guidedContentType) {
          if (await fs.pathExists(tempDestination)) {
            await fs.remove(tempDestination);
          }

          return this.createGuidedContentInstallResult('failure', {}, [
            this.createGuidedContentInstallIssue(
              filename,
              'failure',
              this.getGuidedContentFailureMessage(guidedContentType),
            ),
          ]);
        }

        await fs.remove(tempDestination).catch(() => undefined);
        throw error;
      }

      if (instanceDir && isManifestManagedContentType(contentType)) {
        const installedFileName = await this.replaceTrackedModFile({
          instanceDir,
          temporaryPath: tempDestination,
          filename,
          source: trackSource,
          projectId: trackProjectId,
          versionId: trackVersionId,
          sha1,
        });
        return {
          destination: path.join(destDir, installedFileName),
          filename: installedFileName,
          usedUrl: primaryUrl,
        };
      } else {
        await fs.move(tempDestination, destination, { overwrite: true });
      }

      return { destination, filename, usedUrl: primaryUrl };
    };

    if (req.platform === 'modrinth') {
      const version = await this.modrinth.getProjectVersion(req.versionId);
      const file = pickPrimaryModrinthFile(version);
      if (!file?.url || !file.filename) throw new Error('Modrinth version has no downloadable file.');

      const filename = assertChildName(file.filename, 'Provider filename');
      const destination = path.join(destDir, filename);
      ensureDir(destDir);
      const sha1 = file.hashes?.sha1;
      return finalizeInstall({
        destination,
        primaryUrl: file.url,
        filename,
        sha1,
        trackSource: 'modrinth',
        trackProjectId: req.projectId,
        trackVersionId: req.versionId,
      });
    }

    // curseforge
    if (!this.curseforge) {
      throw new Error('CurseForge API key is not configured. Set CURSEFORGE_API_KEY env var.');
    }

    const modId = Number(req.projectId);
    const fileId = Number(req.versionId);
    if (!Number.isFinite(modId)) throw new Error(`Invalid CurseForge modId: ${req.projectId}`);
    if (!Number.isFinite(fileId)) throw new Error(`Invalid CurseForge fileId: ${req.versionId}`);

    const file = await this.curseforge.getModFile(modId, fileId);
    const url = file.downloadUrl;
    if (!url) {
      throw new Error('CurseForge file has no downloadUrl (distribution might be disabled).');
    }
    const filename = assertChildName(file.fileName, 'Provider filename');
    const destination = path.join(destDir, filename);
    ensureDir(destDir);
    const sha1 = file.hashes?.find((h) => h.algo === 1 /* sha1 */)?.value;
    return finalizeInstall({
      destination,
      primaryUrl: url,
      filename,
      sha1,
      trackSource: 'curseforge',
      trackProjectId: String(modId),
      trackVersionId: String(fileId),
    });
  }

  /**
   * Поиск модпаков на CurseForge
   */
  public async searchCurseForgeModpacks(
    query: string,
    mcVersion?: string,
    loader?: string,
    sort: 'popularity' | 'date' | 'alphabetical' = 'popularity',
    offset: number = 0,
    limit: number = 20,
  ): Promise<ModSearchResult> {
    if (!this.curseforge) {
      throw new Error('CurseForge API key is not configured. Set CURSEFORGE_API_KEY env var.');
    }

    // Map sort option to CurseForge sortField
    let sortField: number;
    switch (sort) {
      case 'date':
        sortField = CF_SORT_LAST_UPDATED;
        break;
      case 'alphabetical':
        sortField = CF_SORT_NAME;
        break;
      case 'popularity':
      default:
        sortField = CF_SORT_POPULARITY;
        break;
    }

    // Map loader to CurseForge modLoaderType
    const modLoaderType = loader && loader !== 'all' ? mapLoaderToCurseforge(loader) : undefined;

    const res = await this.curseforge.searchMods({
      gameId: 432,
      classId: 4471, // Modpacks category
      searchFilter: query,
      gameVersion: mcVersion,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modLoaderType: modLoaderType as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sortField: sortField as any,
      sortOrder: sort === 'alphabetical' ? 'asc' : 'desc',
      index: offset,
      pageSize: limit,
    });

    return {
      items: res.data.map((m: CurseforgeMod) => {
        const modWithMetadata = m as CurseforgeSearchMod;
        const minecraftVersion =
          mcVersion && mcVersion !== 'all'
            ? mcVersion
            : pickPreferredMinecraftVersion([
                ...(modWithMetadata.latestFilesIndexes?.map((item) => item.gameVersion) ?? []),
                ...(modWithMetadata.latestFiles?.flatMap((item) => item.gameVersions ?? []) ?? []),
              ]);

        return {
          platform: 'curseforge',
          projectId: String(m.id),
          slug: m.slug,
          projectUrl: m.slug ? `https://www.curseforge.com/minecraft/modpacks/${encodeURIComponent(m.slug)}` : undefined,
          title: m.name,
          description: m.summary,
          iconUrl: m.logo?.thumbnailUrl,
          minecraftVersion,
          downloads: m.downloadCount,
          dateCreated: modWithMetadata.dateCreated,
          dateModified: modWithMetadata.dateModified,
        };
      }),
      total: res.pagination.totalCount,
      offset: res.pagination.index,
      limit: res.pagination.pageSize,
    };
  }

  /**
   * Получить список версий модпака CurseForge
   */
  public async getCurseForgeModpackVersions(projectId: number): Promise<ModVersionDescriptor[]> {
    if (!this.curseforge) {
      throw new Error('CurseForge API key is not configured. Set CURSEFORGE_API_KEY env var.');
    }

    if (!Number.isFinite(projectId)) {
      throw new Error(`Invalid CurseForge projectId: ${projectId}`);
    }

    const res = await this.curseforge.getModFiles({
      modId: projectId,
      index: 0,
      pageSize: 50, // Get more versions for modpacks
    });

    return res.data.map((f: CurseforgeFile) => {
      // CurseForge File type may not include changelog in type definition
      // but it might be available at runtime, so we check safely
      const fileWithChangelog = f as CurseforgeFile & { changelog?: string };
      return {
        platform: 'curseforge' as const,
        versionId: String(f.id),
        name: f.displayName || f.fileName,
        versionNumber: undefined,
        mcVersions: f.gameVersions ?? [],
        loaders: [],
        fileId: f.id, // CurseForge fileId (same as versionId but as number)
        changelog: fileWithChangelog.changelog || undefined, // Changelog from CurseForge API (may not be in type definition)
        files: [
          {
            url: f.downloadUrl ?? '',
            filename: f.fileName,
            size: f.fileLength,
            sha1: f.hashes?.find((h) => h.algo === 1 /* sha1 */)?.value,
          },
        ],
      };
    });
  }

  /**
   * Поиск модпаков на Modrinth
   */
  public async searchModrinthModpacks(
    query: string,
    mcVersion?: string,
    loader?: string,
    sort: 'popularity' | 'date' | 'alphabetical' = 'popularity',
    offset: number = 0,
    limit: number = 20,
  ): Promise<ModSearchResult> {
    const facets: string[][] = [['project_type:modpack']];
    if (mcVersion && mcVersion !== 'all') {
      facets.push([`versions:${mcVersion}`]);
    }
    if (loader && loader !== 'all') {
      const modrinthLoader = mapLoaderToModrinth(loader);
      if (modrinthLoader) {
        facets.push([`categories:${modrinthLoader}`]);
      }
    }

    const facetsJson = JSON.stringify(facets);
    const mapSearchHit = (hit: Awaited<ReturnType<ModrinthV2Client['searchProjects']>>['hits'][number]) => {
      const hitWithVersions = hit as ModrinthSearchHitWithVersions;
      const minecraftVersion =
        mcVersion && mcVersion !== 'all'
          ? mcVersion
          : pickPreferredMinecraftVersion(hitWithVersions.versions ?? []);

      return {
        platform: 'modrinth' as const,
        projectId: hit.project_id,
        slug: hit.slug,
        title: hit.title,
        description: hit.description,
        iconUrl: hit.icon_url,
        minecraftVersion,
        downloads: hit.downloads,
        dateCreated: hit.date_created,
        dateModified: hit.date_modified,
      };
    };

    // Map sort option to Modrinth index
    let index: string;
    switch (sort) {
      case 'date':
        index = 'newest';
        break;
      case 'alphabetical':
        index = 'relevance'; // Modrinth doesn't have alphabetical index, we'll sort client-side
        break;
      case 'popularity':
      default:
        index = 'downloads';
        break;
    }

    if (sort === 'alphabetical') {
      const pageSize = 100;
      const allHits: Awaited<ReturnType<ModrinthV2Client['searchProjects']>>['hits'] = [];
      let nextOffset = 0;
      let totalHits = 0;

      while (nextOffset === 0 || nextOffset < totalHits) {
        const page = await this.modrinth.searchProjects({
          query,
          facets: facetsJson,
          index,
          offset: nextOffset,
          limit: pageSize,
        });

        totalHits = page.total_hits;
        allHits.push(...page.hits);

        if (page.hits.length === 0) {
          break;
        }

        nextOffset += page.hits.length;
      }

      const items = allHits
        .map(mapSearchHit)
        .sort((left, right) => left.title.localeCompare(right.title))
        .slice(offset, offset + limit);

      return {
        items,
        total: totalHits,
        offset,
        limit,
      };
    }

    const result = await this.modrinth.searchProjects({
      query,
      facets: facetsJson,
      index,
      offset,
      limit,
    });

    const items = result.hits.map(mapSearchHit);

    return {
      items,
      total: result.total_hits,
      offset: result.offset,
      limit: result.limit,
    };
  }

  /**
   * Получить список версий модпака Modrinth
   */
  public async getModrinthModpackVersions(projectId: string): Promise<ModVersionDescriptor[]> {
    const all = await this.modrinth.getProjectVersions(projectId);

    return all.map((v) => ({
      platform: 'modrinth',
      versionId: v.id,
      name: v.name,
      versionNumber: v.version_number,
      mcVersions: v.game_versions,
      loaders: v.loaders,
      changelog: v.changelog, // Changelog from Modrinth API
      files: v.files.map((f) => ({
        url: f.url,
        filename: f.filename,
        size: f.size,
        hashes: f.hashes,
        sha1: f.hashes?.sha1,
      })),
    }));
  }

  private async replaceTrackedModFile(params: {
    instanceDir: string;
    temporaryPath: string;
    filename: string;
    source: 'modrinth' | 'curseforge';
    projectId: string;
    versionId: string;
    sha1?: string;
  }): Promise<string> {
    const previous = this.manifestManager.findMod(params.instanceDir, params.source, params.projectId);
    const backups: Array<{ original: string; backup: string }> = [];
    let published = false;
    let destination: string | undefined;
    try {
      const modsDirectory = resolvePathWithinRoot(params.instanceDir, 'mods', 'Mods directory');
      const providerFileName = assertChildName(params.filename, 'Provider filename');
      let targetFileName = providerFileName;
      let previousPath: string | undefined;
      let disabledPreviousPath: string | undefined;
      if (previous) {
        const previousFileName = assertChildName(previous.fileName, 'Tracked mod filename');
        const trackedDisabled = previousFileName.endsWith('.disabled');
        const enabledPreviousFileName = trackedDisabled
          ? assertChildName(previousFileName.slice(0, -'.disabled'.length), 'Tracked mod filename')
          : previousFileName;
        previousPath = resolvePathWithinRoot(modsDirectory, enabledPreviousFileName, 'Tracked mod file path');
        const disabledPreviousFileName = assertChildName(`${enabledPreviousFileName}.disabled`, 'Disabled tracked mod filename');
        disabledPreviousPath = resolvePathWithinRoot(modsDirectory, disabledPreviousFileName, 'Disabled tracked mod file path');
        if (trackedDisabled || (!await fs.pathExists(previousPath) && await fs.pathExists(disabledPreviousPath))) {
          targetFileName = assertChildName(`${providerFileName}.disabled`, 'Disabled provider filename');
        }
      }
      destination = resolvePathWithinRoot(modsDirectory, targetFileName, 'New mod file path');
      const candidates = new Set<string>([destination, ...(previousPath ? [previousPath] : []), ...(disabledPreviousPath ? [disabledPreviousPath] : [])]);
      for (const original of candidates) {
        if (!await fs.pathExists(original)) continue;
        const backup = path.join(path.dirname(original), `.${path.basename(original)}.burrow-backup-${randomUUID()}`);
        await fs.move(original, backup, { overwrite: false });
        backups.push({ original, backup });
      }
      await fs.move(params.temporaryPath, destination, { overwrite: false });
      published = true;
      this.manifestManager.addMod(params.instanceDir, {
        fileName: targetFileName,
        source: params.source,
        projectId: params.projectId,
        versionId: params.versionId,
        sha1: params.sha1,
        installDate: new Date().toISOString(),
      });
    } catch (error) {
      if (published && destination) await fs.remove(destination).catch(() => undefined);
      for (const { original, backup } of backups.reverse()) {
        if (await fs.pathExists(backup)) await fs.move(backup, original, { overwrite: false });
      }
      await fs.remove(params.temporaryPath).catch(() => undefined);
      throw error;
    }
    // The manifest write is the commit boundary. A failed cleanup can leave
    // harmless hidden backups, but must not roll back the published version.
    await Promise.all(backups.map(async ({ backup }) => await fs.remove(backup).catch(() => undefined)));
    return path.basename(destination!);
  }

  /**
   * Reads only a selected provider archive into a temporary file, then exposes
   * its manifest and bundled override paths. It never creates an instance or
   * downloads the mod files referenced by that manifest.
   */
  public async inspectModpackContents(request: ProviderCatalogContentsRequest): Promise<ProviderCatalogContents> {
    const key = `${request.platform}:${request.projectId}:${request.versionId}`;
    const existing = this.previewContents.get(key);
    if (existing) return await existing;
    const inspection = this.inspectModpackContentsOnce(request);
    this.previewContents.set(key, inspection);
    try { return await inspection; } finally { this.previewContents.delete(key); }
  }

  private async inspectModpackContentsOnce(request: ProviderCatalogContentsRequest): Promise<ProviderCatalogContents> {
    const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-pack-preview-'));
    const archivePath = path.join(temporaryDirectory, request.platform === 'modrinth' ? 'pack.mrpack' : 'pack.zip');
    try {
      const source = await this.resolveModpackArchive(request);
      await downloadPreviewArchive(source.url, archivePath, `${request.platform} modpack preview URL`);
      const archive = await openValidatedZip(archivePath, `${request.platform} modpack preview`);
      try {
        const manifestName = request.platform === 'modrinth' ? 'modrinth.index.json' : 'manifest.json';
        const manifestEntry = archive.getEntry(manifestName);
        if (!manifestEntry) throw new Error(`${request.platform} modpack does not contain ${manifestName}`);
        const manifest = request.platform === 'modrinth'
          ? parseModrinthManifest((await archive.getData(manifestEntry, 8 * 1024 * 1024)).toString('utf8'))
          : parseCurseForgeManifest((await archive.getData(manifestEntry, 8 * 1024 * 1024)).toString('utf8'));
        const overrideRoots = Array.from(new Set(['overrides', 'client-overrides', 'server-overrides', manifest.overrides]
          .filter((root): root is string => typeof root === 'string' && root.length > 0)
          .map((root) => root.replace(/\\/g, '/').replace(/^\/+|\/+$/g, ''))));
        const entries = manifest.files.map((file) => ({
          kind: file.path ? classifyPackPath(file.path) : 'mod' as const,
          label: file.path ?? `CurseForge project ${file.projectID ?? '?'} / file ${file.fileID ?? '?'}`,
          required: file.required,
        }));
        for (const entry of archive.getEntries()) {
          if (entry.fileName === manifestName || entry.fileName.endsWith('/')) continue;
          const normalized = entry.fileName.replace(/\\/g, '/');
          if (!overrideRoots.some((root) => normalized.toLowerCase().startsWith(`${root.toLowerCase()}/`))) continue;
          entries.push({ kind: classifyPackPath(normalized, overrideRoots), label: normalized, required: true });
        }
        return { entries: entries.slice(0, 500), truncated: entries.length > 500 };
      } finally {
        archive.close();
      }
    } finally {
      fs.rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  }

  private async resolveModpackArchive(request: ProviderCatalogContentsRequest): Promise<{ url: string; sha1?: string }> {
    if (request.platform === 'modrinth') {
      const version = await this.modrinth.getProjectVersion(request.versionId);
      if (version.project_id !== request.projectId) throw new Error('Modrinth version does not belong to the requested project.');
      const file = version.files.find((candidate) => candidate.filename.endsWith('.mrpack'));
      if (!file?.url) throw new Error('Modrinth modpack version has no download URL');
      return { url: file.url, sha1: file.hashes?.sha1 };
    }
    if (!this.curseforge) throw new Error('CurseForge API key is not configured. Set CURSEFORGE_API_KEY env var.');
    const projectId = Number(request.projectId);
    const fileId = Number(request.versionId);
    if (!Number.isSafeInteger(projectId) || !Number.isSafeInteger(fileId)) throw new Error('CurseForge project and version ids must be positive integers.');
    const file = await this.curseforge.getModFile(projectId, fileId);
    if (!file.downloadUrl) throw new Error('CurseForge modpack file has no download URL');
    return { url: file.downloadUrl, sha1: file.hashes?.find((hash) => hash.algo === 1)?.value };
  }

  /**
   * Получить CurseForge клиент (для использования в установщиках)
   */
  public getCurseForgeClient(): CurseforgeV1Client | null {
    return this.curseforge;
  }

  /**
   * Получить Modrinth клиент (для использования в установщиках)
   */
  public getModrinthClient(): ModrinthV2Client {
    return this.modrinth;
  }
}
