import React from 'react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

// Secondary modpack tabs and add-content routes deliberately share these seams.
// Keeping the layout tokens here prevents each route from inventing a slightly
// different content width or search/filter arrangement.
export const MODPACK_SECONDARY_CONTENT_WORKSPACE = {
  host: 'mx-auto w-full max-w-6xl space-y-4',
  controls: 'surface-card space-y-4 p-4',
  searchRow: 'w-full',
  filterRow: 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3',
  counter: 'surface-inline flex min-h-[5.75rem] flex-col items-center justify-center rounded-2xl px-3 py-3 text-center',
  action: 'min-h-10 min-w-[8.5rem] justify-center',
} as const;

export interface ModpackCatalogControlItem {
  key: string;
  label: string;
  control: React.ReactNode;
}

interface ModpackCatalogControlsProps {
  header?: React.ReactNode;
  searchLabel: string;
  searchControl: React.ReactNode;
  controls: ModpackCatalogControlItem[];
  activeFilterTokens?: string[];
  onReset?: () => void;
  resetLabel: string;
  status?: React.ReactNode;
  footer?: React.ReactNode;
  rootTestId?: string;
  headerTestId?: string;
  controlsTestId?: string;
  className?: string;
}

export const ModpackCatalogControls: React.FC<ModpackCatalogControlsProps> = ({
  header,
  searchLabel,
  searchControl,
  controls,
  activeFilterTokens = [],
  onReset,
  resetLabel,
  status,
  footer,
  rootTestId,
  headerTestId,
  controlsTestId,
  className,
}) => {
  return (
    <div
      className={cn('mb-7 space-y-4 border-b border-border/65 pb-6', className)}
      role="search"
      aria-label={searchLabel}
      data-testid={rootTestId}
      data-catalog-controls="shared"
    >
      {header && <div data-testid={headerTestId}>{header}</div>}

      <div
        className="grid gap-3 md:grid-cols-[minmax(0,1.45fr)_minmax(28rem,1fr)] md:items-end"
        data-testid={controlsTestId}
        data-catalog-controls-layout="library-toolbar"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-xs font-medium text-secondary">{searchLabel}</div>
          {searchControl}
        </div>
        {controls.length > 0 && (
          <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
            {controls.map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="text-xs font-medium text-secondary">{item.label}</div>
                {item.control}
              </div>
            ))}
          </div>
        )}
        {onReset && activeFilterTokens.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="justify-self-start md:col-start-2">
            {resetLabel}
          </Button>
        )}
      </div>

      {status && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary">
          {status}
        </div>
      )}

      {activeFilterTokens.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-secondary" data-testid="catalog-active-filters">
          {activeFilterTokens.map((token) => (
            <span key={token} className="rounded-full border border-border/70 bg-background/72 px-2.5 py-1">
              {token}
            </span>
          ))}
        </div>
      )}

      {footer}
    </div>
  );
};
