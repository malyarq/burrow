import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../ui/Button';
import { LazyImage } from '../ui/LazyImage';
import { Select } from '../ui/Select';
import { cn } from '../../utils/cn';
import type { ProviderCatalogContentEntry, ProviderCatalogSearchResultItem, ProviderCatalogVersionDescriptor } from '@shared/contracts';
import { instancesIPC } from '../../services/ipc/instancesIPC';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useInstanceInvalidation } from '../../features/instances/hooks/useInstanceInvalidation';
import { useOperationSession } from '../../features/operations/hooks/useOperationSession';
import { OperationStatusView } from '../../features/operations/components/OperationStatusView';
import { externalLinksIPC } from '../../services/ipc/externalLinksIPC';
import { providerCatalogIPC } from '../../services/ipc/providerCatalogIPC';

interface InstallModpackPageProps {
  modpack: ProviderCatalogSearchResultItem;
  versions: ProviderCatalogVersionDescriptor[];
  platform: 'curseforge' | 'modrinth';
  onBack: () => void;
}

export const InstallModpackPage: React.FC<InstallModpackPageProps> = ({
  modpack,
  versions,
  platform,
  onBack,
}) => {
  const { t, getAccentStyles } = useSettings();
  const toast = useToast();
  const [selectedVersion, setSelectedVersion] = useState<ProviderCatalogVersionDescriptor | null>(
    versions[0] || null
  );
  const [contents, setContents] = useState<readonly ProviderCatalogContentEntry[]>([]);
  const [contentsLoading, setContentsLoading] = useState(false);
  const [contentsError, setContentsError] = useState(false);
  const [contentsTruncated, setContentsTruncated] = useState(false);
  const { invalidateInstances } = useInstanceInvalidation();
  const closeTimerRef = useRef<number | null>(null);
  const operation = useOperationSession({
    onCommitted: async ({ classification }) => {
      if (classification.selectableInstanceId) {
        const selection = await instancesIPC.select({ id: classification.selectableInstanceId });
        if (!selection.ok) throw new Error(selection.error.message);
      }
      if (classification.shouldInvalidateInstances) await invalidateInstances();
    },
    onTerminal: ({ classification }) => {
      if (!classification.isPresentationSuccess) return;
      toast.success(t('modpacks.install_success'));
      closeTimerRef.current = window.setTimeout(onBack, 1200);
    },
  });
  const isActive = operation.isStarting || operation.isActive;
  const terminalStatus = operation.snapshot?.status;
  const mayRetry = terminalStatus === 'failed' || terminalStatus === 'cancelled';
  const startBlocked = Boolean(operation.classification?.isTerminal && !mayRetry);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!selectedVersion) return;
    let active = true;
    void (async () => {
      if (active) {
        setContentsLoading(true);
        setContentsError(false);
      }
      try {
        const result = await providerCatalogIPC.contents({ platform, projectId: modpack.projectId, versionId: selectedVersion.versionId });
        if (active) {
          setContents(result.entries);
          setContentsTruncated(result.truncated);
        }
      } catch (error) {
        console.error('Error loading remote modpack contents:', error);
        if (active) setContentsError(true);
      } finally {
        if (active) setContentsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [modpack.projectId, platform, selectedVersion]);

  const contentGroups = useMemo(() => ({
    mod: contents.filter((entry) => entry.kind === 'mod'),
    resourcepack: contents.filter((entry) => entry.kind === 'resourcepack'),
    shader: contents.filter((entry) => entry.kind === 'shader'),
    other: contents.filter((entry) => entry.kind === 'other'),
  }), [contents]);

  const projectUrl = modpack.projectUrl ?? (platform === 'modrinth' && modpack.slug
    ? `https://modrinth.com/modpack/${encodeURIComponent(modpack.slug)}`
    : undefined);

  const handleInstall = async () => {
    if (!selectedVersion) return;

    if (platform === 'curseforge') {
      await operation.start({
        kind: 'install-curseforge',
        projectId: Number(modpack.projectId),
        fileId: Number(selectedVersion.versionId),
      });
      return;
    }

    await operation.start({ kind: 'install-modrinth', projectId: modpack.projectId, versionId: selectedVersion.versionId });
  };

  const handleCancelOrBack = () => {
    if (isActive) {
      void operation.cancel();
      return;
    }
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border/70 bg-card/78 px-6 py-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancelOrBack}
            className="flex items-center gap-2"
            disabled={operation.snapshot?.status === 'cancelling'}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('general.back') || 'Назад'}
          </Button>
          <div className="min-w-0 flex-1">
            <div className="kicker-label">{t('modpacks.browser')}</div>
            <h2 className="text-xl font-bold text-foreground">
              {t('modpacks.install') || 'Установить модпак'}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Modpack Info */}
          <div className="surface-card flex gap-4 p-5">
            <LazyImage
              src={modpack.iconUrl}
              alt={modpack.title}
              className="h-20 w-20 rounded-2xl border border-border/70 object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">{modpack.title}</h3>
              {modpack.description && (
                <p className="mt-1 line-clamp-2 text-sm text-secondary">
                  {modpack.description}
                </p>
              )}
              {projectUrl && <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => void externalLinksIPC.open({ url: projectUrl, context: `${modpack.title} on ${platform}` }).catch((error) => console.error('Failed to open modpack project:', error))}
              >
                <ExternalLink className="h-4 w-4" />
                {t('modpacks.open_project') === 'modpacks.open_project' ? 'Open official project page' : t('modpacks.open_project')}
              </Button>}
            </div>
          </div>

          {/* Version Selection */}
          {versions.length > 0 && (
            <Select
              label={t('modpacks.select_version')}
              value={selectedVersion?.versionId || ''}
              onChange={(e) => {
                const version = versions.find((v) => v.versionId === e.target.value);
                setSelectedVersion(version || null);
              }}
              disabled={isActive}
            >
              {versions.map((version) => (
                <option key={version.versionId} value={version.versionId}>
                  {version.name} {version.mcVersions.length > 0 && `(${version.mcVersions[0]})`}
                </option>
              ))}
            </Select>
          )}

          {(selectedVersion ? (
            <div className="surface-muted grid grid-cols-2 gap-4 p-4">
              <div>
                <p className="mb-1 text-xs text-secondary">
                  {String(t('modpacks.minecraft_version'))}
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {selectedVersion.mcVersions[0] || '—'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-secondary">
                  {String(t('modpacks.loader'))}
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {selectedVersion.loaders.join(', ') || '—'}
                </p>
              </div>
            </div>
          ) : null) as React.ReactNode}

          <section className="surface-card space-y-3 p-4" aria-live="polite" data-testid="remote-modpack-contents">
            <div>
              <h3 className="text-base font-semibold text-foreground">{t('modpacks.included_contents') === 'modpacks.included_contents' ? 'Included contents' : t('modpacks.included_contents')}</h3>
              <p className="mt-1 text-sm text-secondary">
                {t('modpacks.contents_manifest_hint') === 'modpacks.contents_manifest_hint' ? 'Read from this version’s archive manifest; no modpack is installed.' : t('modpacks.contents_manifest_hint')}
              </p>
            </div>
            {contentsLoading ? <p className="text-sm text-secondary">{t('modpacks.loading')}</p> : contentsError ? (
              <p className="text-sm text-secondary">{t('modpacks.contents_unavailable') === 'modpacks.contents_unavailable' ? 'The provider did not make this version’s manifest available.' : t('modpacks.contents_unavailable')}</p>
            ) : (
              <div className="space-y-3">
                {([['mod', 'Mods'], ['resourcepack', 'Resource packs'], ['shader', 'Shaders'], ['other', 'Other included files']] as const).map(([kind, fallback]) => contentGroups[kind].length > 0 && (
                  <div key={kind}>
                    <p className="helper-text mb-1">{t(`modpacks.contents_${kind}`) === `modpacks.contents_${kind}` ? fallback : t(`modpacks.contents_${kind}`)} ({contentGroups[kind].length})</p>
                    <ul className="max-h-40 space-y-1 overflow-y-auto text-sm text-foreground" aria-label={t(`modpacks.contents_${kind}`) === `modpacks.contents_${kind}` ? fallback : t(`modpacks.contents_${kind}`)}>
                      {contentGroups[kind].map((entry, index) => <li key={`${entry.label}-${index}`} className="truncate" title={entry.label}>{entry.label}</li>)}
                    </ul>
                  </div>
                ))}
                {contents.length === 0 && <p className="text-sm text-secondary">{t('modpacks.contents_empty') === 'modpacks.contents_empty' ? 'This version’s manifest does not list included files.' : t('modpacks.contents_empty')}</p>}
                {contentsTruncated && <p className="text-sm text-secondary">{t('modpacks.contents_truncated') === 'modpacks.contents_truncated' ? 'Only the first 500 included files are shown.' : t('modpacks.contents_truncated')}</p>}
              </div>
            )}
          </section>

          <OperationStatusView
            snapshot={operation.snapshot}
            classification={operation.classification}
            error={operation.error}
            errorFallback={t('modpacks.install_error')}
            onCancel={operation.cancel}
            onRetry={mayRetry ? operation.retry : undefined}
            t={t}
            testId="provider-install-operation"
          />

          {/* Action Buttons */}
          <div className="surface-inline flex gap-3 pt-2">
            <Button
              onClick={handleCancelOrBack}
              variant="secondary"
              disabled={operation.snapshot?.status === 'cancelling'}
              className="flex-1"
            >
              {t('general.cancel')}
            </Button>
            <Button
              onClick={isActive ? handleCancelOrBack : handleInstall}
              disabled={!selectedVersion || operation.snapshot?.status === 'cancelling' || startBlocked}
              className={cn("flex-1 text-white", getAccentStyles('bg').className)}
              style={getAccentStyles('bg').style}
            >
              {isActive ? t('general.cancel') : t('modpacks.install')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
