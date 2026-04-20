import React from 'react';
import { Button } from '../../ui/Button';
import { cn } from '../../../utils/cn';

export interface ModpackDetailsActionsProps {
  onLaunch: () => void;
  hasUpdate: boolean;
  onShowUpdate: () => void;
  updateVersionSummary?: string | null;
  onRename: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  canDelete: boolean;
  onDelete: () => void;
  t: (key: string) => string;
  getAccentStyles: (type: 'bg' | 'text' | 'border' | 'ring' | 'hover' | 'accent' | 'title' | 'soft-bg' | 'soft-border') => {
    className?: string;
    style?: React.CSSProperties;
  };
}

export const ModpackDetailsActions: React.FC<ModpackDetailsActionsProps> = ({
  onLaunch,
  hasUpdate,
  onShowUpdate,
  updateVersionSummary,
  onRename,
  onDuplicate,
  onExport,
  canDelete,
  onDelete,
  t,
  getAccentStyles,
}) => {
  return (
    <section className="surface-card flex h-full flex-col gap-4 p-4" data-testid="modpack-details-actions">
      <div className="space-y-3">
        <div className="kicker-label">{t('general.play')}</div>
        <Button
          variant="primary"
          onClick={onLaunch}
          className="w-full"
          style={getAccentStyles('bg').style}
          data-primary-action="route"
          data-route-action="play"
        >
          {t('general.play')}
        </Button>
      </div>

      {hasUpdate && (
        <div
          data-testid="modpack-details-update-notice"
          data-update-scope="modpack-local"
          className="space-y-3 rounded-2xl border border-blue-200/60 bg-blue-50/55 p-4 text-blue-950 dark:border-blue-900/70 dark:bg-blue-950/20 dark:text-blue-100"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-800/90 dark:text-blue-200/90">
              {t('modpacks.update_available') || 'Update available'}
            </div>
            <p className="text-sm leading-6 text-blue-900/90 dark:text-blue-100/90">
              {t('modpacks.update_ready_desc') || 'Review the available pack update when you want. Launching stays available.'}
            </p>
            {updateVersionSummary && (
              <p className="text-xs font-medium text-blue-900/80 dark:text-blue-100/80">{updateVersionSummary}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowUpdate}
            className={cn('self-start px-0 text-blue-900 hover:border-transparent hover:bg-transparent hover:text-blue-950 dark:text-blue-100 dark:hover:border-transparent dark:hover:bg-transparent dark:hover:text-white')}
            data-route-action="update"
          >
            {t('modpacks.review_update') || 'Review update'}
          </Button>
        </div>
      )}

      <div className="border-t border-border/60 pt-4">
        <div className="kicker-label">{t('modpacks.actions_title')}</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          <Button variant="secondary" onClick={onRename} className="w-full">
            {t('modpacks.rename')}
          </Button>
          <Button variant="secondary" onClick={onDuplicate} className="w-full">
            {t('modpacks.duplicate')}
          </Button>
          <Button variant="secondary" onClick={onExport} className="w-full">
            {t('modpacks.export') || 'Экспорт'}
          </Button>
          {canDelete && (
            <Button variant="danger" onClick={onDelete} className="w-full">
              {t('modpacks.delete')}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
