// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayWorkspace, type PlayWorkspaceProps } from '../PlayWorkspace';

const setVersion = vi.fn();
const setNickname = vi.fn();
const setLoader = vi.fn();
const setRuntimeMinecraft = vi.fn();
const setRuntimeLoader = vi.fn();
const invalidateInstance = vi.fn();
const navigate = vi.fn();
const setMode = vi.fn();
let instanceState: unknown;

vi.mock('../../contexts/SettingsContext', () => ({
  useSettings: () => ({
    t: (key: string) => key,
    getAccentStyles: () => ({ className: '', style: undefined }),
  }),
  useUIMode: () => ({ setMode }),
}));

vi.mock('../../features/instances/hooks/useEffectiveInstance', () => ({
  useEffectiveInstance: () => instanceState,
}));

vi.mock('../../features/instances/hooks/useInstanceConfigCommands', () => ({
  dispatchInstanceConfigCommand: (command: Promise<void>) => { void command; },
  useInstanceConfigCommands: () => ({
    setMemoryGb: vi.fn(), setMinMemoryGb: vi.fn(), setVmOptions: vi.fn(), setGameExtraArgs: vi.fn(),
    setGameResolution: vi.fn(), setAutoConnectServer: vi.fn(), setRuntimeMinecraft, setRuntimeLoader,
  }),
}));

vi.mock('../../features/instances/hooks/useInstanceInvalidation', () => ({
  useInstanceInvalidation: () => ({ invalidateInstance }),
}));

vi.mock('../../features/launcher/hooks/useModSupportedVersions', () => ({
  useModSupportedVersions: () => ({ forgeVersions: ['1.20.1'], fabricVersions: ['1.20.1'], neoForgeVersions: ['1.20.1'], optiFineVersions: [], isLoading: false }),
}));

vi.mock('../../features/modpacks/navigation/ModpackNavigationContext', () => ({
  usePersistentModpackNavigation: () => ({ navigate }),
}));

vi.mock('../../components/settings/tabs/GameTab', () => ({ GameTab: () => <div>Advanced game settings</div> }));
vi.mock('../../components/simple-play/ClassicContentTabs', () => ({
  ClassicContentTabs: ({ onOpenGuidedContent }: { onOpenGuidedContent: (type: 'resourcepack' | 'shader') => void }) => (
    <button type="button" onClick={() => onOpenGuidedContent('resourcepack')}>Pack content</button>
  ),
}));

type WorkspaceOverrides = {
  launch?: Partial<PlayWorkspaceProps['launch']>;
  runtime?: Partial<PlayWorkspaceProps['runtime']>;
  actions?: Partial<PlayWorkspaceProps['actions']>;
};

function renderWorkspace(overrides: WorkspaceOverrides = {}) {
  return render(<PlayWorkspace
    launch={{
      nickname: 'Steve', setNickname, version: '1.20.1', setVersion,
      versions: [{ id: '1.20.1', type: 'release', url: '', time: '', releaseTime: '' }],
      useForge: false, setUseForge: vi.fn(), useFabric: true, setUseFabric: vi.fn(),
      useNeoForge: false, setUseNeoForge: vi.fn(), setLoader,
      useOptiFine: false, setUseOptiFine: vi.fn(), isOffline: true, currentHint: null,
      loaderType: 'fabric', ram: 6,
      supportedVersions: { forge: ['1.20.1'], fabric: ['1.20.1'], optiFine: [], neoForge: ['1.20.1'] },
      ...overrides.launch,
    }}
    runtime={{
      isLaunching: false, progress: 0, launchStage: 'idle', statusText: '', statusDetail: '',
      canForceRestart: false, onLaunch: vi.fn(), showConsole: false, logs: [], logEndRef: { current: document.createElement('div') },
      onCopyLogs: vi.fn(), iconPath: '', ...overrides.runtime,
    }}
    actions={{ onShowMultiplayer: vi.fn(), onShowSettings: vi.fn(), ...overrides.actions }}
  />);
}

describe('PlayWorkspace', () => {
  beforeEach(() => {
    setVersion.mockReset(); setNickname.mockReset(); setLoader.mockReset();
    setRuntimeMinecraft.mockReset(); setRuntimeLoader.mockReset(); invalidateInstance.mockReset();
    navigate.mockReset(); setMode.mockReset();
    setRuntimeMinecraft.mockResolvedValue(undefined); setRuntimeLoader.mockResolvedValue(undefined);
    instanceState = {
      status: 'ready',
      data: { id: 'classic', snapshot: { id: 'classic', name: 'Classic', runtime: { minecraft: '1.20.1', modLoader: { type: 'fabric' } } } },
    };
  });

  it('keeps a selected version visible while the version manifest is loading', () => {
    renderWorkspace({ launch: { versions: [] } });
    expect((screen.getByTestId('play-workspace-version') as HTMLSelectElement).value).toBe('1.20.1');
  });

  it('preserves the OptiFine setting and dispatches its existing launcher action', () => {
    const setUseOptiFine = vi.fn();
    renderWorkspace({ launch: { useOptiFine: true, setUseOptiFine } });
    const toggle = screen.getByRole('button', { name: 'optifine.enable', hidden: true });
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(toggle);
    expect(setUseOptiFine).toHaveBeenCalledWith(false);
  });

  it('keeps launch controls, canonical runtime commands, and lower settings on one page', () => {
    renderWorkspace();

    expect(screen.getByRole('heading', { name: 'Играть' })).toBeTruthy();
    expect(screen.getByTestId('play-workspace-launch')).toBeTruthy();
    expect(screen.getByText('Advanced game settings')).toBeTruthy();
    expect(screen.getByText('Pack content')).toBeTruthy();
    fireEvent.change(screen.getByTestId('play-workspace-version'), { target: { value: '1.20.1' } });
    fireEvent.change(screen.getByTestId('play-workspace-loader'), { target: { value: 'forge' } });
    fireEvent.change(screen.getByTestId('play-workspace-nickname'), { target: { value: 'Alex_42' } });

    expect(setVersion).toHaveBeenCalledWith('1.20.1');
    expect(setRuntimeMinecraft).not.toHaveBeenCalled();
    expect(setLoader).toHaveBeenCalledWith('forge');
    expect(setRuntimeLoader).not.toHaveBeenCalled();
    expect(setNickname).toHaveBeenCalledWith('Alex_42');
  });

  it('opens guided resource-pack acquisition in the library route', () => {
    renderWorkspace();

    fireEvent.click(screen.getByRole('button', { name: 'Pack content' }));

    expect(navigate).toHaveBeenCalledWith({ type: 'addResourcePack', modpackId: 'classic' });
    expect(setMode).toHaveBeenCalledWith('modpacks');
  });

  it('does not block the launch action just because the offline nickname is malformed', () => {
    renderWorkspace({ launch: { nickname: '!' } });

    expect(screen.getByTestId('play-workspace-launch')).toHaveProperty('disabled', false);
  });

  it('blocks an unsupported loader without hiding the launch surface', () => {
    renderWorkspace({ launch: { loaderType: 'fabric', version: '1.12.2', supportedVersions: { forge: [], fabric: [], optiFine: [], neoForge: [] } } });

    expect(screen.getByRole('status').textContent).toContain('Выбранный загрузчик');
    expect(screen.getByTestId('play-workspace-launch')).toHaveProperty('disabled', true);
  });

  it('keeps canonical failure visible and retries the classic instance in place', async () => {
    instanceState = { status: 'error', error: { message: 'Classic unavailable' } };
    renderWorkspace();

    expect(screen.getByTestId('play-workspace-error').textContent).toContain('Classic unavailable');
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));
    await waitFor(() => expect(invalidateInstance).toHaveBeenCalledWith('classic'));
  });
});
