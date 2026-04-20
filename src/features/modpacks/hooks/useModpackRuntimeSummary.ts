import type { ModpackMetadata } from '@shared/types/modpack';
import type { ModpackConfig, ModLoaderType } from '../../../contexts/instances/types';
import {
  buildRuntimeDependencyState,
  getModloaderDisplayLabel,
  type RuntimeDependencyState,
} from '../../../components/sidebar/modpackRuntimeDependencies';

export type ModpackRuntimeSummarySource = 'config' | 'metadata' | 'fallback' | 'unknown';
export type ModpackRuntimeSummaryStatus = 'healthy' | 'warning' | 'error';

export interface ModpackRuntimeSummaryInput {
  config?: ModpackConfig | null;
  metadata?: ModpackMetadata | null;
  fallback?: {
    minecraftVersion?: string;
    modLoader?: {
      type: ModLoaderType;
      version?: string;
    };
    useOptiFine?: boolean;
  };
  optiFineVersions?: string[];
}

export interface ModpackRuntimeSummary {
  source: ModpackRuntimeSummarySource;
  status: ModpackRuntimeSummaryStatus;
  minecraftVersion: string;
  modLoader?: RuntimeDependencyState['modLoader'];
  useOptiFine: boolean;
  warnings: RuntimeDependencyState['warnings'];
  runtime: RuntimeDependencyState;
}

function translateWithFallback(t: (key: string) => string, key: string, fallback: string) {
  const translated = t(key);
  return translated === key ? fallback : translated;
}

function trimOrEmpty(value?: string | null): string {
  return value?.trim() ?? '';
}

function normalizeModLoader(
  modLoader?:
    | {
        type: ModLoaderType;
        version?: string;
      }
    | null,
) {
  if (!modLoader) {
    return undefined;
  }

  return {
    type: modLoader.type,
    version: trimOrEmpty(modLoader.version) || undefined,
  };
}

export function buildModpackRuntimeSummary(input: ModpackRuntimeSummaryInput): ModpackRuntimeSummary {
  const configMinecraft = trimOrEmpty(input.config?.runtime.minecraft);
  const metadataMinecraft = trimOrEmpty(input.metadata?.minecraftVersion);
  const fallbackMinecraft = trimOrEmpty(input.fallback?.minecraftVersion);

  const configLoader = normalizeModLoader(input.config?.runtime.modLoader);
  const metadataLoader = normalizeModLoader(input.metadata?.modLoader);
  const fallbackLoader = normalizeModLoader(input.fallback?.modLoader);

  const minecraftVersion = configMinecraft || metadataMinecraft || fallbackMinecraft;
  const modLoader = configLoader ?? metadataLoader ?? fallbackLoader;
  const useOptiFine = Boolean(input.config?.game?.useOptiFine ?? input.fallback?.useOptiFine);
  const isOptiFineSupported =
    minecraftVersion && input.optiFineVersions
      ? input.optiFineVersions.includes(minecraftVersion)
      : true;

  const runtime = buildRuntimeDependencyState({
    minecraftVersion,
    modLoaderType: modLoader?.type ?? 'vanilla',
    modLoaderVersion: modLoader?.version,
    useOptiFine,
    isOptiFineSupported,
  });

  let source: ModpackRuntimeSummarySource = 'unknown';
  if (configMinecraft || configLoader) {
    source = 'config';
  } else if (metadataMinecraft || metadataLoader) {
    source = 'metadata';
  } else if (fallbackMinecraft || fallbackLoader) {
    source = 'fallback';
  }

  const status: ModpackRuntimeSummaryStatus = !minecraftVersion
    ? 'error'
    : runtime.warnings.length > 0
      ? 'warning'
      : 'healthy';

  return {
    source,
    status,
    minecraftVersion: runtime.minecraftVersion,
    modLoader: runtime.modLoader,
    useOptiFine: runtime.useOptiFine,
    warnings: runtime.warnings,
    runtime,
  };
}

export function getModpackRuntimeLoaderLabel(
  summary: Pick<ModpackRuntimeSummary, 'modLoader'>,
  t: (key: string) => string,
): string {
  const baseLabel = getModloaderDisplayLabel(summary.modLoader, t);
  if (!summary.modLoader?.version) {
    return baseLabel;
  }

  return `${baseLabel} ${summary.modLoader.version}`;
}

export function getModpackRuntimeStatusLabel(
  status: ModpackRuntimeSummaryStatus,
  t: (key: string) => string,
): string {
  switch (status) {
    case 'healthy':
      return translateWithFallback(t, 'modpacks.runtime_status_healthy', 'Ready');
    case 'warning':
      return translateWithFallback(t, 'modpacks.runtime_status_warning', 'Warning');
    case 'error':
      return translateWithFallback(t, 'modpacks.runtime_status_error', 'Broken');
    default:
      return status;
  }
}
