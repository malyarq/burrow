import { useState } from 'react';
import { Library, Play, Settings2, Users } from 'lucide-react';
import type { AppLayoutProps } from '../components/AppLayout';
import TitleBar from '../components/TitleBar';
import { UpdateNotification } from '../components/UpdateNotification';
import { BackgroundLayer } from '../components/layout/BackgroundLayer';
import { ModpackRouter } from '../components/modpacks/ModpackRouter';
import { useModpackPrimaryActionOwnership } from '../components/modpacks/primaryActionOwnership';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useSettings, useUIMode } from '../contexts/SettingsContext';
import { useInstanceList, useSelectedInstanceId, useSelectedInstance } from '../features/instances/hooks/useInstanceSelectors';
import { getLaunchActionLabel } from '../features/launcher/services/launcherService';
import { windowControlsIPC } from '../services/ipc/windowControlsIPC';
import { BurrowEasterEgg } from './BurrowEasterEgg';
import { PlayWorkspace } from './PlayWorkspace';
import { SettingsWorkspace } from './SettingsWorkspace';
import { FriendsWorkspace } from './FriendsWorkspace';
import './product.css';

type Page = 'play' | 'library' | 'friends' | 'settings';

function LibraryLaunchDock({ launch, runtime, modpackOnLaunch }: Pick<AppLayoutProps, 'launch' | 'runtime' | 'modpackOnLaunch'>) {
  const { t } = useSettings();
  const catalog = useInstanceList();
  const selected = useSelectedInstanceId();
  const snapshot = useSelectedInstance();
  const ownership = useModpackPrimaryActionOwnership();
  const instance = catalog.status === 'ready' && selected.status === 'ready'
    ? catalog.data.find((item) => item.id === selected.data) : null;
  if (ownership === 'route') return null;
  return (
    <div className="next-launch-dock" data-testid="library-launch-dock">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{instance?.name ?? t('next.library.choose')}</p>
        {instance && <p className="mt-1 text-xs text-secondary">Minecraft {instance.summary.minecraftVersion} · {instance.summary.modLoader?.type ?? 'Vanilla'}</p>}
      </div>
      <Input label={t('general.nickname')} value={launch.nickname} onChange={(event) => launch.setNickname(event.target.value)} disabled={runtime.isLaunching} containerClassName="next-dock-nickname" />
      <Button size="lg" disabled={!instance || snapshot.status !== 'ready' || snapshot.data.id !== instance.id || runtime.isLaunching} onClick={modpackOnLaunch ?? runtime.onLaunch}>
        <Play className="h-4 w-4" />{getLaunchActionLabel(runtime.launchStage, t)}
      </Button>
    </div>
  );
}

export function ProductShell(props: AppLayoutProps) {
  const { t, disableAnimations } = useSettings();
  const { uiMode, setMode } = useUIMode();
  const { overlays, actions, runtime, updates } = props;
  const page: Page = overlays.showSettings ? 'settings' : overlays.showMultiplayer ? 'friends' : uiMode === 'modpacks' ? 'library' : 'play';
  const [settingsVisited, setSettingsVisited] = useState(page === 'settings');
  if (page === 'settings' && !settingsVisited) setSettingsVisited(true);
  const shellContract = windowControlsIPC.shellContract();
  const navigate = (target: Page) => {
    if (target === 'settings') { actions.onShowSettings(); return; }
    if (target === 'friends') { actions.onShowMultiplayer(); return; }
    if (runtime.isLaunching && (target === 'play') !== (uiMode === 'simple')) return;
    overlays.onCloseSettings();
    overlays.onBackFromMultiplayer();
    setMode(target === 'play' ? 'simple' : 'modpacks');
  };
  const pages = [
    { id: 'play', icon: Play, tour: 'classic' },
    { id: 'library', icon: Library, tour: 'modpacks' },
    { id: 'friends', icon: Users, tour: 'multiplayer' },
    { id: 'settings', icon: Settings2, tour: 'settings' },
  ] as const;
  return (
    <div className={`${props.theme === 'dark' ? 'dark ' : ''}next-product`}>
      <BackgroundLayer />
      <div className="next-window" data-testid="app-shell-frame">
        <TitleBar />
        <div data-testid="app-layout-notifications" data-shell-platform={shellContract} className="relative z-[90] shrink-0">
          <UpdateNotification status={updates.status} updateInfo={updates.info} onInstall={updates.onInstall} onDownload={updates.onDownload} />
        </div>
        <div className="next-safe-area" data-testid="app-layout-safe-area" data-shell-safe-area="shell-chrome" data-shell-platform={shellContract}>
          <header className="next-navigation">
            <button type="button" className="next-wordmark" onClick={() => navigate('play')} aria-label={t('next.brand.home')}>
              <BurrowEasterEgg className="h-8 w-8" disableAnimations={disableAnimations} /><span>burrow<span className="next-channel">next</span></span>
            </button>
            <nav aria-label={t('next.nav.label')}>
              {pages.map(({ id, icon: Icon, tour }) => (
                <button key={id} type="button" data-tour={tour} data-testid={`next-nav-${id}`} aria-current={page === id ? 'page' : undefined}
                  disabled={runtime.isLaunching && (id === 'play' || id === 'library') && (id === 'play') !== (uiMode === 'simple')}
                  onClick={() => navigate(id)}>
                  <Icon className="h-4 w-4" /><span>{t(`next.nav.${id}`)}</span>
                </button>
              ))}
            </nav>
          </header>
          {runtime.isLaunching && <div className="next-runtime-strip" role="status"><span className="next-status-dot" />{runtime.statusText}<span className="truncate text-secondary">{runtime.statusDetail}</span></div>}
          <div className="next-content" data-testid="app-layout-main">
            {page === 'play' && <PlayWorkspace launch={props.launch} runtime={runtime} actions={actions} />}
            {page === 'library' && <div className="next-library-workspace"><ModpackRouter onLaunch={props.modpackOnLaunch ?? runtime.onLaunch} /><LibraryLaunchDock {...props} /></div>}
            {page === 'friends' && <div className="next-page-scroll"><FriendsWorkspace /></div>}
            {(settingsVisited || page === 'settings') && <div hidden={page !== 'settings'} className="next-page-scroll"><SettingsWorkspace /></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
