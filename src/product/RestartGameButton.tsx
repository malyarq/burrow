import { RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useSettings } from '../contexts/SettingsContext';
import { launcherIPC } from '../services/ipc/launcherIPC';

export function RestartGameButton() {
  const { t } = useSettings();
  if (!launcherIPC.has('killAndRestart')) return null;
  return (
    <Button variant="ghost" size="sm" onClick={() => { void launcherIPC.killAndRestart(); }}>
      <RotateCcw className="h-4 w-4" />
      {t('status.force_restart')}
    </Button>
  );
}
