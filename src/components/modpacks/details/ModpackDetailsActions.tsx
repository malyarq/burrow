import React from 'react';
import { Button } from '../../ui/Button';
import { cn } from '../../../utils/cn';

export interface ModpackDetailsActionsProps {
  onLaunch: () => void;
  hasUpdate: boolean;
  onShowUpdate: () => void;
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
  onRename,
  onDuplicate,
  onExport,
  canDelete,
  onDelete,
  t,
  getAccentStyles,
}) => {
  const primaryAction = hasUpdate ? 'update' : 'play';

  return (
    <section className="surface-card flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {primaryAction === 'play' ? (
          <Button
            variant="primary"
            onClick={onLaunch}
            className="w-full sm:min-w-[14rem] sm:flex-1"
            style={getAccentStyles('bg').style}
            data-primary-action="route"
            data-route-action="play"
          >
            {t('general.play')}
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={onShowUpdate}
              className={cn('w-full sm:min-w-[14rem] sm:flex-1', getAccentStyles('bg').className)}
              style={getAccentStyles('bg').style}
              data-primary-action="route"
              data-route-action="update"
            >
              {t('modpacks.update_available') || 'Обновление доступно'}
            </Button>
            <Button variant="secondary" onClick={onLaunch} className="w-full sm:w-auto" data-route-action="play">
              {t('general.play')}
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onRename} className="w-full sm:w-auto">
          {t('modpacks.rename')}
        </Button>
        <Button variant="secondary" onClick={onDuplicate} className="w-full sm:w-auto">
          {t('modpacks.duplicate')}
        </Button>
        <Button variant="secondary" onClick={onExport} className="w-full sm:w-auto">
          {t('modpacks.export') || 'Экспорт'}
        </Button>
        {canDelete && (
          <Button variant="danger" onClick={onDelete} className="w-full sm:w-auto">
            {t('modpacks.delete')}
          </Button>
        )}
      </div>
    </section>
  );
};
