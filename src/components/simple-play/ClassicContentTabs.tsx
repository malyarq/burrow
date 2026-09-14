import { useId, useMemo, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import type { ModpackRuntimeSummary } from '../../features/modpacks/hooks/useModpackRuntimeSummary';
import { cn } from '../../utils/cn';
import { ModsTab } from '../modpacks/details/ModsTab';
import { ResourcePacksTab } from '../modpacks/details/ResourcePacksTab';
import { ShadersTab } from '../modpacks/details/ShadersTab';
import { WorldsTab } from '../modpacks/details/WorldsTab';
import { CollapsibleSection } from '../ui/CollapsibleSection';

type ContentTab = 'mods' | 'resourcepacks' | 'shaders' | 'worlds';

export interface ClassicContentTabsProps {
  instanceId: string;
  showMods: boolean;
  runtimeSummary: ModpackRuntimeSummary;
  onOpenGuidedContent: (contentType: 'resourcepack' | 'shader') => void;
  presentation?: 'disclosure' | 'inline';
}

export function ClassicContentTabs({
  instanceId,
  showMods,
  runtimeSummary,
  onOpenGuidedContent,
  presentation = 'disclosure',
}: ClassicContentTabsProps) {
  const { t } = useSettings();
  const [activeTab, setActiveTab] = useState<ContentTab>('mods');
  const idPrefix = `classic-content-${useId().replace(/:/g, '')}`;
  const title = t('dashboard.content') || 'Content';
  const tabs = useMemo<Array<{ key: ContentTab; label: string }>>(() => [
    { key: 'mods' as const, label: t('modpacks.tab_mods') || 'Mods' },
    { key: 'resourcepacks', label: t('modpacks.tab_resourcepacks') || 'Resource Packs' },
    { key: 'shaders', label: t('modpacks.tab_shaders') || 'Shaders' },
    { key: 'worlds', label: t('modpacks.tab_worlds') || 'Worlds' },
  ], [t]);
  const visibleActiveTab = activeTab;
  const vanillaModsHintKey = 'play_workspace.vanilla_mods_hint';
  const translatedVanillaModsHint = t(vanillaModsHintKey);
  const vanillaModsHint = translatedVanillaModsHint === vanillaModsHintKey
    ? 'Vanilla не подключает моды; выберите загрузчик для них.'
    : translatedVanillaModsHint;

  const activateRelativeTab = (currentIndex: number, offset: number) => {
    const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
    const next = tabs[nextIndex];
    setActiveTab(next.key);
    window.requestAnimationFrame(() => document.getElementById(`${idPrefix}-tab-${next.key}`)?.focus());
  };

  const content = (
      <div className="min-w-0 space-y-4">
        <div
          className="flex min-w-0 gap-2 overflow-x-auto overflow-y-hidden border-b border-border [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label={title}
          style={{ scrollbarWidth: 'none' }}
          onWheel={(event) => {
            if (event.deltaY === 0) return;
            event.currentTarget.scrollLeft += event.deltaY;
            event.preventDefault();
          }}
        >
          {tabs.map((tab, index) => {
            const isActive = visibleActiveTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                id={`${idPrefix}-tab-${tab.key}`}
                aria-selected={isActive}
                aria-controls={`${idPrefix}-panel-${tab.key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.key)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    activateRelativeTab(index, 1);
                  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    activateRelativeTab(index, -1);
                  } else if (event.key === 'Home') {
                    event.preventDefault();
                    activateRelativeTab(0, 0);
                  } else if (event.key === 'End') {
                    event.preventDefault();
                    activateRelativeTab(tabs.length - 1, 0);
                  }
                }}
                className={cn(
                  'shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium transition-colors',
                  !isActive && 'text-secondary hover:bg-card/72 hover:text-foreground',
                )}
                style={isActive ? { borderColor: 'rgb(var(--accent-main))', color: 'rgb(var(--text-main))' } : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          className="min-w-0 w-full"
          role="tabpanel"
          id={`${idPrefix}-panel-${visibleActiveTab}`}
          aria-labelledby={`${idPrefix}-tab-${visibleActiveTab}`}
        >
          {visibleActiveTab === 'mods' ? (
            <>
              {!showMods ? (
                <p className="border-l-2 border-border px-3 text-sm leading-6 text-secondary" role="status" data-testid="classic-mods-loader-hint">
                  {vanillaModsHint}
                </p>
              ) : null}
              <ModsTab
                instanceId={instanceId}
                showAddButton
                addDisabled={!showMods}
                defaultMCVersion={runtimeSummary.minecraftVersion}
                defaultLoader={runtimeSummary.modLoader?.type ?? 'vanilla'}
              />
            </>
          ) : null}
          {visibleActiveTab === 'resourcepacks' ? (
            <ResourcePacksTab instanceId={instanceId} onAddResourcePack={() => onOpenGuidedContent('resourcepack')} />
          ) : null}
          {visibleActiveTab === 'shaders' ? (
            <ShadersTab
              instanceId={instanceId}
              runtimeSummary={runtimeSummary}
              onAddShader={() => onOpenGuidedContent('shader')}
            />
          ) : null}
          {visibleActiveTab === 'worlds' ? (
            <WorldsTab instanceId={instanceId} mcVersion={runtimeSummary.minecraftVersion} />
          ) : null}
        </div>
      </div>
  );
  return presentation === 'inline' ? content : (
    <CollapsibleSection title={title} defaultExpanded={false} storageKey="classic_content_expanded" className="mt-4 min-w-0 w-full">
      {content}
    </CollapsibleSection>
  );
}
