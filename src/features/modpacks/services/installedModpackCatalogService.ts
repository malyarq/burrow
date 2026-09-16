import type { ModpackMetadata } from '@shared/types/modpack';
import { archiveInspectionIPC } from '../../../services/ipc/archiveInspectionIPC';
import { instancesIPC } from '../../../services/ipc/instancesIPC';

export interface InstalledModpackCatalogItem {
  id: string;
  name: string;
  selected: boolean;
  metadata: ModpackMetadata;
}

function instanceValue<T>(result: { ok: true; value: T } | { ok: false; error: { message: string } }): T {
  if (result.ok) return result.value;
  throw new Error(result.error.message);
}

export async function loadInstalledModpackCatalog(): Promise<InstalledModpackCatalogItem[]> {
  const catalog = instanceValue(await instancesIPC.list());
  if (catalog.status === 'uninitialized') return [];

  return catalog.instances.map((instance) => {
    const metadata = instance.metadata;
    return {
      id: instance.id,
      name: instance.name,
      selected: instance.selected,
      metadata: {
        id: instance.id,
        name: instance.name,
        source: metadata.source,
        ...(metadata.sourceId === undefined ? {} : { sourceId: metadata.sourceId }),
        ...(metadata.sourceVersionId === undefined ? {} : { sourceVersionId: metadata.sourceVersionId }),
        ...(metadata.version === undefined ? {} : { version: metadata.version }),
        ...(metadata.iconUrl === undefined ? {} : { iconUrl: metadata.iconUrl }),
        ...(metadata.description === undefined ? {} : { description: metadata.description }),
        ...(metadata.author === undefined ? {} : { author: metadata.author }),
        minecraftVersion: instance.summary.minecraftVersion,
        ...(instance.summary.modLoader === undefined ? {} : { modLoader: { ...instance.summary.modLoader } }),
        createdAt: metadata.createdAt,
        updatedAt: metadata.updatedAt,
      },
    };
  });
}

export async function selectInstalledModpackArchive() {
  return archiveInspectionIPC.select();
}
