import { useEffect } from 'react';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { useToast } from '../../../../contexts/ToastContext';
import { settingsIPC } from '../../../../services/ipc/settingsIPC';

export function MinecraftPathSection(props: {
  minecraftPath: string;
  setMinecraftPath: (val: string) => void;
  t: (key: string) => string;
}) {
  const { minecraftPath, setMinecraftPath, t } = props;
  const toast = useToast();

  useEffect(() => {
    void settingsIPC.getDefaultMinecraftPath()
      .then(setMinecraftPath)
      .catch(() => undefined);
  }, [setMinecraftPath]);

  return (
    <div className="space-y-2">
      <label htmlFor="minecraft-directory" className="control-label block">
        {t('settings.minecraft_path')}
      </label>
      <div className="flex gap-2 items-center">
        <div className="flex-1 min-w-0">
          <Input
            id="minecraft-directory"
            value={minecraftPath}
            readOnly
            placeholder={t('settings.minecraft_path_placeholder')}
            containerClassName="mb-0 gap-0"
          />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={async () => {
              try {
                const result = await settingsIPC.selectMinecraftPath();
                if (!result.success && result.error) throw new Error(result.error);
                if (result.success && result.path) {
                  setMinecraftPath(result.path);
                }
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                toast.error(t('error.selecting_folder') + ': ' + errorMessage);
              }
            }}
            className="h-[42px]"
          >
            {t('settings.browse')}
          </Button>
          <Button
            onClick={async () => {
              try {
                const result = await settingsIPC.openMinecraftPath();
                if (!result.success) throw new Error(result.error || t('error.opening_folder'));
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                toast.error(t('error.opening_folder') + ': ' + errorMessage);
              }
            }}
            variant="secondary"
            className="h-[42px]"
          >
            {t('settings.open_folder')}
          </Button>
        </div>
      </div>
    </div>
  );
}
