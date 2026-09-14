// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_ICON_PATH } from '../../app/assets/branding';
import {
  APP_LAYOUT_NOTIFICATIONS_TEST_ID,
  APP_LAYOUT_SAFE_AREA_TEST_ID,
  AppLayout,
  type AppLayoutProps,
} from '../AppLayout';

let uiMode: 'simple' | 'modpacks' = 'simple';
let primaryActionOwnership: 'route' | 'shell' = 'shell';
let shellContract: 'renderer-controls' | 'native-macos' = 'renderer-controls';
let snapshotReady = true;

vi.mock('../../contexts/SettingsContext', () => ({
  useSettings: () => ({
    t: (key: string) => ({
      'next.brand.home': 'Burrow home',
      'next.nav.label': 'Product navigation',
      'next.nav.play': 'Play',
      'next.nav.library': 'Library',
      'next.nav.friends': 'Together',
      'next.nav.settings': 'Settings',
      'next.library.choose': 'Choose an instance',
      'general.nickname': 'Nickname',
    })[key] ?? key,
  }),
  useUIMode: () => ({
    uiMode,
    setMode: (mode: 'simple' | 'modpacks') => {
      uiMode = mode;
      window.dispatchEvent(new Event('product-shell-ui-mode-change'));
    },
  }),
}));

vi.mock('../../services/ipc/windowControlsIPC', () => ({
  windowControlsIPC: { shellContract: () => shellContract },
}));

vi.mock('../layout/BackgroundLayer', () => ({
  BackgroundLayer: () => <div>Background layer</div>,
}));

vi.mock('../TitleBar', () => ({
  default: () => <div data-testid="app-title-bar">Title bar</div>,
}));

vi.mock('../UpdateNotification', () => ({
  UpdateNotification: () => <div>Update notification</div>,
}));

vi.mock('../../product/PlayWorkspace', () => ({
  PlayWorkspace: () => <div>Play workspace</div>,
}));

vi.mock('../../product/FriendsWorkspace', () => ({
  FriendsWorkspace: () => <div>Together workspace</div>,
}));

vi.mock('../../product/SettingsWorkspace', () => ({
  SettingsWorkspace: () => <label>Settings workspace<input aria-label="Settings workspace" defaultValue="kept" /></label>,
}));

vi.mock('../modpacks/ModpackRouter', () => ({
  ModpackRouter: () => <div>Library workspace</div>,
}));

vi.mock('../modpacks/primaryActionOwnership', () => ({
  useModpackPrimaryActionOwnership: () => primaryActionOwnership,
}));

vi.mock('../../features/instances/hooks/useInstanceSelectors', () => ({
  useInstanceList: () => ({
    status: 'ready',
    data: [{ id: 'pack-1', name: 'Pack one', summary: { minecraftVersion: '1.20.1', modLoader: { type: 'fabric' } } }],
  }),
  useSelectedInstanceId: () => ({ status: 'ready', data: 'pack-1' }),
  useSelectedInstance: () => snapshotReady ? { status: 'ready', data: { id: 'pack-1' } } : { status: 'loading' },
}));

vi.mock('../../features/launcher/services/launcherService', () => ({
  getLaunchActionLabel: () => 'Play',
}));

function createProps(): AppLayoutProps {
  return {
    theme: 'light',
    updates: { status: 'idle', info: null, onInstall: vi.fn(), onDownload: vi.fn() },
    overlays: { showSettings: false, onCloseSettings: vi.fn(), showMultiplayer: false, onBackFromMultiplayer: vi.fn() },
    actions: { onShowMultiplayer: vi.fn(), onShowSettings: vi.fn() },
    launch: {
      nickname: 'Steve', setNickname: vi.fn(), version: '1.20.1', setVersion: vi.fn(), versions: [],
      useForge: false, setUseForge: vi.fn(), useFabric: false, setUseFabric: vi.fn(), useNeoForge: false, setUseNeoForge: vi.fn(),
      setLoader: vi.fn(), useOptiFine: false, setUseOptiFine: vi.fn(), isOffline: true, currentHint: null,
      loaderType: 'vanilla', ram: 4, supportedVersions: { forge: [], fabric: [], optiFine: [], neoForge: [] },
    },
    runtime: {
      isLaunching: false, launchStage: 'idle', statusText: '', statusDetail: '', canForceRestart: false,
      onLaunch: vi.fn(), showConsole: false, logs: [], logEndRef: { current: document.createElement('div') },
      onCopyLogs: vi.fn(), iconPath: APP_ICON_PATH,
    },
  };
}

function ShellHarness() {
  const [, rerender] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  useEffect(() => {
    const onModeChange = () => rerender((revision) => revision + 1);
    window.addEventListener('product-shell-ui-mode-change', onModeChange);
    return () => window.removeEventListener('product-shell-ui-mode-change', onModeChange);
  }, []);
  const props = createProps();
  props.overlays = {
    showSettings,
    onCloseSettings: () => setShowSettings(false),
    showMultiplayer,
    onBackFromMultiplayer: () => setShowMultiplayer(false),
  };
  props.actions = {
    onShowSettings: () => setShowSettings(true),
    onShowMultiplayer: () => setShowMultiplayer(true),
  };
  return <AppLayout {...props} />;
}

describe('AppLayout product shell', () => {
  beforeEach(() => {
    uiMode = 'simple';
    primaryActionOwnership = 'shell';
    shellContract = 'renderer-controls';
    snapshotReady = true;
  });

  it('does not enable library launch before the selected snapshot is ready', () => {
    snapshotReady = false;
    render(<ShellHarness />);
    fireEvent.click(screen.getByTestId('next-nav-library'));
    expect(screen.getByTestId('library-launch-dock').querySelector('button')?.disabled).toBe(true);
  });

  it('keeps title-bar, notifications and the safe area in their platform seam', () => {
    shellContract = 'native-macos';
    render(<ShellHarness />);

    const titleBar = screen.getByTestId('app-title-bar');
    const notifications = screen.getByTestId(APP_LAYOUT_NOTIFICATIONS_TEST_ID);
    const safeArea = screen.getByTestId(APP_LAYOUT_SAFE_AREA_TEST_ID);
    expect(titleBar.nextElementSibling).toBe(notifications);
    expect(notifications.nextElementSibling).toBe(safeArea);
    expect(safeArea.getAttribute('data-shell-safe-area')).toBe('shell-chrome');
    expect(notifications.getAttribute('data-shell-platform')).toBe('native-macos');
    expect(safeArea.getAttribute('data-shell-platform')).toBe('native-macos');
    expect(screen.getByText('Play workspace')).toBeTruthy();
  });

  it('switches every product page and preserves settings when returning', () => {
    render(<ShellHarness />);

    fireEvent.click(screen.getByTestId('next-nav-library'));
    expect(screen.getByText('Library workspace')).toBeTruthy();
    expect(screen.getByTestId('library-launch-dock')).toBeTruthy();

    fireEvent.click(screen.getByTestId('next-nav-friends'));
    expect(screen.getByText('Together workspace')).toBeTruthy();

    fireEvent.click(screen.getByTestId('next-nav-settings'));
    const settingsInput = screen.getByRole('textbox', { name: 'Settings workspace' });
    fireEvent.change(settingsInput, { target: { value: 'persisted choice' } });

    fireEvent.click(screen.getByTestId('next-nav-play'));
    expect(screen.getByText('Play workspace')).toBeTruthy();
    fireEvent.click(screen.getByTestId('next-nav-settings'));
    expect((screen.getByRole('textbox', { name: 'Settings workspace' }) as HTMLInputElement).value).toBe('persisted choice');
  });

  it('removes the shell launch dock when the library route owns the primary action', () => {
    primaryActionOwnership = 'route';
    render(<ShellHarness />);

    fireEvent.click(screen.getByTestId('next-nav-library'));
    expect(screen.getByText('Library workspace')).toBeTruthy();
    expect(screen.queryByTestId('library-launch-dock')).toBeNull();
  });
});
