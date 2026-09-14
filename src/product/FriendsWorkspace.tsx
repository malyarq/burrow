import { Cable, Globe2, Radio } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useMultiplayer } from '../features/multiplayer/hooks/useMultiplayer';
import { MultiplayerConnectionControls } from '../components/MultiplayerConnectionControls';

export function FriendsWorkspace() {
  const { t } = useSettings();
  const multiplayer = useMultiplayer();
  const modes = [
    { id: 'hyperswarm', icon: Globe2, label: 'settings.network_mode_hyperswarm', description: 'next.friends.invite' },
    { id: 'xmcl_lan', icon: Radio, label: 'settings.network_mode_xmcl_lan', description: 'next.friends.lan' },
    { id: 'xmcl_upnp_host', icon: Cable, label: 'settings.network_mode_xmcl_upnp_host', description: 'next.friends.router' },
  ] as const;
  const active = multiplayer.tunnel.state === 'active' || multiplayer.lan.state === 'active' || multiplayer.upnp.state === 'active';
  return (
    <div className="next-page" data-testid="friends-workspace">
      <header className="next-page-heading">
        <p className="next-eyebrow">Burrow Link</p>
        <h1>{t('next.nav.friends')}</h1>
        <p>{t('next.friends.description')}</p>
      </header>
      <div className="next-friends-grid">
        <section aria-label={t('settings.network_mode')} className="space-y-2">
          {modes.map(({ id, icon: Icon, label, description }) => (
            <button key={id} type="button" className="next-mode-choice" aria-pressed={multiplayer.networkMode === id}
              disabled={active || multiplayer.isLoading}
              onClick={() => multiplayer.setNetworkMode(id)}>
              <Icon className="h-5 w-5 shrink-0" />
              <span><strong>{t(label)}</strong><span>{t(description)}</span></span>
            </button>
          ))}
          <p className="px-3 pt-3 text-sm leading-6 text-secondary">{t('next.friends.world_help')}</p>
        </section>
        <section className="next-panel p-5 sm:p-7" aria-label={t('multiplayer.title')}>
          <MultiplayerConnectionControls multiplayer={multiplayer} />
        </section>
      </div>
    </div>
  );
}
