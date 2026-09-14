import type {
  ProviderCatalogSearchResultItem,
  ProviderCatalogVersionDescriptor,
} from '@shared/contracts';
import { ArrowLeft, Compass } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import type { ModpackBrowserState } from '../../features/modpacks/hooks/useModpackNavigation';
import { Button } from '../ui/Button';
import { ModpackBrowserFilters } from './browser/ModpackBrowserFilters';
import { ModpackBrowserResults } from './browser/ModpackBrowserResults';
import { useModpackBrowserCatalog } from './browser/useModpackBrowserCatalog';

export interface ModpackBrowserProps {
  initialState: ModpackBrowserState;
  onBack: () => void;
  onNavigate: (view: {
    type: 'install';
    modpack: ProviderCatalogSearchResultItem;
    versions: ProviderCatalogVersionDescriptor[];
    platform: 'curseforge' | 'modrinth';
  }) => void;
  onStateChange: (state: ModpackBrowserState) => void;
}

function translateWithFallback(t: (key: string) => string, key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}

export function ModpackBrowser({ initialState, onBack, onNavigate, onStateChange }: ModpackBrowserProps) {
  const { t } = useSettings();
  const catalog = useModpackBrowserCatalog({ initialState, onNavigate, onStateChange });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border/70 bg-card/78 px-4 py-4 backdrop-blur-md sm:px-7">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="shrink-0 px-2" aria-label={translateWithFallback(t, 'general.back', 'Back')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <p className="kicker-label">{translateWithFallback(t, 'library.title', 'Library')}</p>
              <h1 className="truncate text-xl font-semibold tracking-[-0.03em] text-foreground">{translateWithFallback(t, 'library.discover_title', 'Discover modpacks')}</h1>
            </div>
          </div>
          <Compass className="h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
        </div>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-7 sm:py-8">
        <div className="mx-auto w-full max-w-7xl">
        {!catalog.showHistory && (
          <ModpackBrowserFilters
            query={catalog.query}
            onQueryChange={catalog.setQuery}
            sortBy={catalog.sortBy}
            onSortByChange={catalog.setSortBy}
            filterMCVersion={catalog.filterMCVersion}
            onFilterMCVersionChange={catalog.setFilterMCVersion}
            filterLoader={catalog.filterLoader}
            onFilterLoaderChange={catalog.setFilterLoader}
            itemsPerPage={catalog.itemsPerPage}
            onItemsPerPageChange={catalog.setItemsPerPage}
            hasActiveFilters={catalog.hasActiveFilters}
            onResetFilters={catalog.resetFilters}
            recentHistory={catalog.recentHistory}
            onOpenHistory={() => catalog.setShowHistory(true)}
            onOpenModpack={(modpack) => void catalog.openModpack(modpack)}
          />
        )}

        <ModpackBrowserResults
          showHistory={catalog.showHistory}
          onShowBrowser={() => catalog.setShowHistory(false)}
          history={catalog.history}
          onClearHistory={catalog.clearHistory}
          results={catalog.results}
          loading={catalog.loading}
          searchError={catalog.searchError}
          hasSearchFilters={catalog.hasSearchFilters}
          onResetFilters={catalog.resetFilters}
          onRetrySearch={() => void catalog.retrySearch()}
          filterMCVersion={catalog.filterMCVersion}
          isFavorite={catalog.isFavorite}
          onToggleFavorite={catalog.toggleFavorite}
          onOpenModpack={(modpack) => void catalog.openModpack(modpack)}
          openingIdentity={catalog.openingIdentity}
          currentPage={catalog.currentPage}
          totalPages={catalog.totalPages}
          totalResults={catalog.totalResults}
          onPageChange={catalog.setCurrentPage}
        />
        </div>
      </div>
    </div>
  );
}
