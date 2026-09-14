import { SettingsContent } from '../components/settings/SettingsContent';
import { useSettings } from '../contexts/SettingsContext';

function translated(t: (key: string) => string, key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}

export function SettingsWorkspace() {
  const { t } = useSettings();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-7 sm:py-8 lg:px-10" data-testid="settings-workspace">
      <header className="mb-8 max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{translated(t, 'settings.workspace_title', 'Settings')}</h1>
        <p className="text-sm leading-6 text-secondary">{translated(t, 'settings.workspace_description', 'Personalize the launcher and manage its local data.')}</p>
      </header>
      <SettingsContent presentation="page" />
    </main>
  );
}

export default SettingsWorkspace;
