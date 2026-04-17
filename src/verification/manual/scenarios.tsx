import type { ModpackSearchResultItem, ModpackVersionDescriptor } from '@shared/contracts';
import React, { useEffect, useMemo, useState } from 'react';
import { SettingsProvider, useSettings } from '../../contexts/SettingsContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { ConfirmProvider } from '../../contexts/ConfirmContext';
import { ModpackProvider } from '../../contexts/ModpackContext';
import { createTranslator } from '../../contexts/settings/i18n';
import type { UIMode } from '../../contexts/settings/types';
import { LAUNCHER_MARK_PATH } from '../../app/assets/branding';
import TitleBar from '../../components/TitleBar';
import Sidebar, { type SidebarLaunchModel, type SidebarRuntimeModel } from '../../components/Sidebar';
import SettingsPage from '../../components/SettingsPage';
import { WelcomePage } from '../../components/onboarding/WelcomePage';
import { OnboardingTour, type TourStep } from '../../components/onboarding/OnboardingTour';
import { SimplePlayDashboard } from '../../components/SimplePlayDashboard';
import { ModpackList } from '../../components/modpacks/ModpackList';
import { ModpackBrowser } from '../../components/modpacks/ModpackBrowser';
import { ModpackDetails } from '../../components/modpacks/ModpackDetails';
import { ModpackCreationWizard } from '../../components/modpacks/ModpackCreationWizard';
import { AddModPage } from '../../components/modpacks/AddModPage';
import { ExportModpackPage } from '../../components/modpacks/ExportModpackPage';
import { InstallModpackPage } from '../../components/modpacks/InstallModpackPage';
import { ImportModpackPreviewPage } from '../../components/modpacks/ImportModpackPreviewPage';
import { AddModModal } from '../../components/modpacks/AddModModal';
import {
  setModpackPrimaryActionOwnership,
  type ModpackPrimaryActionOwnership,
} from '../../components/modpacks/primaryActionOwnership';
import { SidebarHeader } from '../../components/sidebar/SidebarHeader';
import { DEFAULT_MODPACK_BROWSER_STATE } from '../../features/modpacks/hooks/useModpackNavigation';
import { AccountsPage } from '../../features/accounts/AccountsPage';
import { ShareModal } from '../../features/share/ShareModal';
import { ScreenshotsTab } from '../../features/screenshots/components/ScreenshotsTab';
import { MirrorsSettings } from '../../features/settings/mirrors/MirrorsSettings';
import { StatisticsTab } from '../../features/settings/statistics/StatisticsTab';
import { WorldDatapacksModal } from '../../components/modpacks/details/WorldDatapacksModal';
import { cn } from '../../utils/cn';
import { CORE_VIEWS, type ManualVerificationView } from './views';
import { getManualVerificationModEntries, getManualVerificationModpackMetadata } from './mockEnvironment';

interface ManualVerificationScenarioProps {
  onReady: (message: string) => void;
}

function SettingsProviders(props: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <ToastProvider>
        <ConfirmProvider>{props.children}</ConfirmProvider>
      </ToastProvider>
    </SettingsProvider>
  );
}

function ModpackProviders(props: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <ModpackProvider>
        <ToastProvider>
          <ConfirmProvider>{props.children}</ConfirmProvider>
        </ToastProvider>
      </ModpackProvider>
    </SettingsProvider>
  );
}

function ManualShellProviders(props: { mode: UIMode; language?: 'en' | 'ru'; children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('settings_uiMode', props.mode);
    localStorage.setItem('settings_language', props.language ?? 'en');
    localStorage.setItem('simple_play_welcome_dismissed', 'true');
    localStorage.setItem('sidebar_collapsed', 'false');
  }

  return <ModpackProviders>{props.children}</ModpackProviders>;
}

const MANUAL_SHELL_ACTIONS = {
  onShowMultiplayer: () => undefined,
  onShowSettings: () => undefined,
};

const MANUAL_MC_VERSIONS = [
  {
    id: '1.20.1',
    type: 'release',
    url: 'https://example.invalid/versions/1.20.1.json',
    time: '2026-04-13T00:00:00.000Z',
    releaseTime: '2026-04-13T00:00:00.000Z',
  },
];

const MANUAL_SIDEBAR_LAUNCH: SidebarLaunchModel = {
  nickname: 'Steve',
  setNickname: () => undefined,
  version: '1.20.1',
  setVersion: () => undefined,
  versions: MANUAL_MC_VERSIONS,
  useForge: false,
  setUseForge: () => undefined,
  useFabric: false,
  setUseFabric: () => undefined,
  useOptiFine: false,
  setUseOptiFine: () => undefined,
  useNeoForge: false,
  setUseNeoForge: () => undefined,
  setLoader: () => undefined,
  isOffline: true,
  currentHint: null,
  supportedVersions: {
    forge: ['1.20.1'],
    fabric: ['1.20.1'],
    optiFine: ['1.20.1'],
    neoForge: ['1.20.1'],
  },
  isModloadersLoading: false,
};

const MANUAL_SHELL_RUNTIME: SidebarRuntimeModel = {
  isLaunching: false,
  progress: 0,
  launchStage: 'idle',
  statusText: '',
  statusDetail: '',
  canForceRestart: false,
  onLaunch: () => undefined,
};

const MANUAL_DASHBOARD_LAUNCH = {
  version: '1.20.1',
  nickname: 'Steve',
  loaderType: 'vanilla' as const,
  ram: 6,
  isOffline: true,
};

const MANUAL_BROWSER_RESULT: ModpackSearchResultItem = {
  platform: 'modrinth',
  projectId: 'alpha-pack',
  slug: 'alpha-pack',
  title: 'Alpha Pack',
  description: 'Route-owned install proof fixture for the Phase 19 shell-integrated harness.',
  iconUrl: '/icon.png',
  downloads: 1337,
  dateCreated: '2026-04-01T10:00:00.000Z',
  dateModified: '2026-04-13T08:30:00.000Z',
};

const MANUAL_BROWSER_VERSIONS: ModpackVersionDescriptor[] = [
  {
    platform: 'modrinth',
    versionId: 'alpha-pack-1.4.2',
    name: 'Alpha Pack 1.4.2',
    versionNumber: '1.4.2',
    mcVersions: ['1.20.1'],
    loaders: ['fabric'],
    changelog: 'Phase 19 shell-integrated proof fixture.',
    files: [
      {
        url: 'https://example.invalid/alpha-pack-1.4.2.mrpack',
        filename: 'alpha-pack-1.4.2.mrpack',
      },
    ],
  },
];

const MANUAL_IMPORT_FILE_PATH = '/mock/Desktop/alpha-pack-1.4.2.mrpack';

function useReadyByText(onReady: (message: string) => void, needles: string[], message: string) {
  const readyKey = needles.join('|');

  useEffect(() => {
    let cancelled = false;
    const deadline = Date.now() + 4_000;

    const tick = () => {
      if (cancelled) {
        return;
      }

      const text = document.body.textContent ?? '';
      const hasAllNeedles = needles.every((needle) => text.includes(needle));

      if (hasAllNeedles) {
        onReady(message);
        return;
      }

      if (Date.now() < deadline) {
        window.setTimeout(tick, 50);
      }
    };

    tick();

    return () => {
      cancelled = true;
    };
  }, [message, needles, onReady, readyKey]);
}

function useManualPrimaryActionOwnership(ownership: ModpackPrimaryActionOwnership) {
  useEffect(() => {
    setModpackPrimaryActionOwnership(ownership);

    return () => {
      setModpackPrimaryActionOwnership('shell');
    };
  }, [ownership]);
}

function Phase19ShellChrome(props: {
  ownership: ModpackPrimaryActionOwnership;
  launch?: SidebarLaunchModel;
  runtime?: SidebarRuntimeModel;
  children: React.ReactNode;
}) {
  const { theme, sidebarPosition } = useSettings();

  useManualPrimaryActionOwnership(props.ownership);

  return (
    <div className={theme === 'dark' ? 'dark h-full w-full' : 'h-full w-full'}>
      <div className="relative h-full w-full overflow-hidden text-foreground">
        <div className="flex h-full w-full bg-background text-foreground sm:p-2">
          <div className="relative flex h-full w-full min-w-0 flex-col overflow-hidden border border-border shadow-2xl transition-colors duration-300 sm:rounded-[28px]">
            <TitleBar />

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden pt-2">
              <div
                className={cn(
                  'relative flex min-h-0 flex-1 overflow-hidden',
                  sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <Sidebar
                  launch={props.launch ?? MANUAL_SIDEBAR_LAUNCH}
                  runtime={props.runtime ?? MANUAL_SHELL_RUNTIME}
                  actions={MANUAL_SHELL_ACTIONS}
                />

                <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background transition-all duration-300">
                  <div className="mode-switch-enter flex min-h-0 flex-1 flex-col">{props.children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Phase19ShellFrame(props: {
  mode: UIMode;
  ownership: ModpackPrimaryActionOwnership;
  language?: 'en' | 'ru';
  launch?: SidebarLaunchModel;
  runtime?: SidebarRuntimeModel;
  children: React.ReactNode;
}) {
  return (
    <ManualShellProviders mode={props.mode} language={props.language}>
      <Phase19ShellChrome ownership={props.ownership} launch={props.launch} runtime={props.runtime}>
        {props.children}
      </Phase19ShellChrome>
    </ManualShellProviders>
  );
}

function OverviewScenario() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {CORE_VIEWS.filter((view) => view.id !== 'overview').map((view) => (
        <a
          key={view.id}
          href={`?view=${view.id}`}
          className="surface-card rounded-3xl p-5 transition-transform hover:-translate-y-0.5"
        >
          <div className="kicker-label mb-3">Core route</div>
          <h2 className="text-xl font-semibold text-foreground">{view.label}</h2>
          <p className="mt-2 text-sm leading-6 text-secondary">{view.description}</p>
        </a>
      ))}
    </div>
  );
}

function WelcomeScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(onReady, ['FriendLauncher', 'Launcher setup', 'Get Started'], 'Welcome overlay rendered.');

  return (
    <SettingsProviders>
      <WelcomePage onComplete={() => undefined} onSkip={() => undefined} onShowSettings={() => undefined} />
    </SettingsProviders>
  );
}

function TourScenario({ onReady }: ManualVerificationScenarioProps) {
  const steps: TourStep[] = [
    {
      id: 'classic',
      target: '[data-manual-tour="classic"]',
      title: 'Classic flow',
      content: 'Quick launch controls stay anchored in the launcher shell.',
      position: 'bottom',
    },
    {
      id: 'modpacks',
      target: '[data-manual-tour="modpacks"]',
      title: 'Modpacks',
      content: 'Browse, inspect, and manage modpacks from the main route.',
      position: 'bottom',
    },
    {
      id: 'settings',
      target: '[data-manual-tour="settings"]',
      title: 'Settings',
      content: 'Theme, mirrors, storage, and accounts stay under one shell.',
      position: 'bottom',
    },
  ];

  useReadyByText(onReady, ['Classic flow', 'Skip'], 'Onboarding spotlight rendered with stable manual targets.');

  return (
    <SettingsProviders>
      <div className="relative min-h-[32rem] rounded-3xl border border-border/70 bg-card/80 p-8">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.id}
              data-manual-tour={step.id}
              className="surface-card rounded-2xl p-4"
            >
              <div className="kicker-label mb-2">Tour target</div>
              <h2 className="text-lg font-semibold text-foreground">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-secondary">{step.content}</p>
            </div>
          ))}
        </div>
        <OnboardingTour
          steps={steps}
          isOpen={true}
          onComplete={() => undefined}
          onSkip={() => undefined}
        />
      </div>
    </SettingsProviders>
  );
}

function DashboardScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['FriendLauncher', 'Vanilla', 'Play'],
    'Phase 19 launcher-home proof rendered inside the real shell with title-bar clearance and one shell-owned primary Play action.',
  );

  return (
    <Phase19ShellFrame mode="simple" ownership="shell">
      <SimplePlayDashboard
        launch={MANUAL_DASHBOARD_LAUNCH}
        runtime={MANUAL_SHELL_RUNTIME}
        actions={MANUAL_SHELL_ACTIONS}
      />
    </Phase19ShellFrame>
  );
}

function SettingsAccountsScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['Launcher Settings', 'Accounts', 'Skin Management'],
    'Settings modal rendered directly on the accounts tab.',
  );

  return (
    <SettingsProviders>
      <SettingsPage onClose={() => undefined} initialTab="accounts" />
    </SettingsProviders>
  );
}

function Phase17PolishScenario({ onReady }: ManualVerificationScenarioProps) {
  const [collapsedMode, setCollapsedMode] = useState<UIMode>('modpacks');
  const sidebarTranslator = useMemo(() => createTranslator('en'), []);

  useEffect(() => {
    let cancelled = false;
    const deadline = Date.now() + 4_000;

    const tick = () => {
      if (cancelled) {
        return;
      }

      const text = document.body.textContent ?? '';
      const hasCollapsedActiveState = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).some(
        (button) => button.getAttribute('title') === 'Modpacks' && button.getAttribute('aria-pressed') === 'true',
      );
      const brandedFallbackImages = Array.from(document.querySelectorAll<HTMLImageElement>('img')).filter((image) => {
        const source = image.getAttribute('src');
        return typeof source === 'string' && (source === LAUNCHER_MARK_PATH || source.endsWith(LAUNCHER_MARK_PATH));
      });

      if (
        text.includes('Alpha Pack') &&
        text.includes('История') &&
        text.includes('Лес · Темная') &&
        text.includes('Положение сайдбара') &&
        hasCollapsedActiveState &&
        brandedFallbackImages.length >= 2
      ) {
        onReady(
          'Phase 17 proof rendered with constrained catalog cards, launcher-mark fallback art, coherent collapsed nav state, and Russian preset naming.',
        );
        return;
      }

      if (Date.now() < deadline) {
        window.setTimeout(tick, 50);
      }
    };

    tick();

    return () => {
      cancelled = true;
    };
  }, [collapsedMode, onReady]);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div>
          <div className="kicker-label mb-2">Compact navigation proof</div>
          <h2 className="text-xl font-semibold text-foreground">Collapsed sidebar mode keeps its active state readable</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-[5.5rem,1fr]">
          <div className="surface-panel w-[5.5rem] rounded-[2rem] p-2">
            <SidebarHeader
              appVersion="0.4.0"
              onShowMultiplayer={() => undefined}
              onShowSettings={() => undefined}
              getAccentStyles={() => ({ className: '', style: undefined })}
              getAccentHex={() => '#10b981'}
              isCollapsed={true}
              onToggleCollapse={() => undefined}
              t={sidebarTranslator}
              uiMode={collapsedMode}
              onChangeMode={setCollapsedMode}
            />
          </div>
          <div className="surface-inline space-y-2 rounded-3xl p-5">
            <div className="kicker-label">Sidebar target</div>
            <p className="text-sm leading-6 text-secondary">
              The compact switcher stays icon-led, keeps explicit labels on hover, and preserves the active mode state
              instead of collapsing into ambiguous one-letter affordances.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-3">
          <div>
            <div className="kicker-label mb-2">Installed catalog</div>
            <h2 className="text-xl font-semibold text-foreground">Sidebar-width cards remain readable without pack art</h2>
          </div>
          <ModpackProviders>
            <div className="surface-panel max-w-[30rem] rounded-3xl p-4">
              <ModpackList onNavigate={() => undefined} onCreateWizard={() => undefined} />
            </div>
          </ModpackProviders>
        </section>

        <section className="space-y-3">
          <div>
            <div className="kicker-label mb-2">Remote browser</div>
            <h2 className="text-xl font-semibold text-foreground">Search controls wrap cleanly while no-art cards fall back to launcher branding</h2>
          </div>
          <SettingsProviders>
            <div className="surface-panel max-w-[30rem] rounded-3xl p-4">
              <ModpackBrowser
                initialState={{ ...DEFAULT_MODPACK_BROWSER_STATE, platform: 'modrinth', query: 'alpha' }}
                onBack={() => undefined}
                onNavigate={() => undefined}
                onStateChange={() => undefined}
              />
            </div>
          </SettingsProviders>
        </section>
      </div>

      <section className="space-y-3">
        <div>
          <div className="kicker-label mb-2">Russian settings shell</div>
          <h2 className="text-xl font-semibold text-foreground">Appearance copy stays localized and preset naming remains policy-aligned</h2>
        </div>
        <SettingsProviders>
          <SettingsPage onClose={() => undefined} initialTab="appearance" />
        </SettingsProviders>
      </section>
    </div>
  );
}

function AccountsScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['Accounts', 'Skin Management', 'Open Skin Site'],
    'Standalone accounts page rendered with provider-aware skin actions.',
  );

  return (
    <SettingsProviders>
      <AccountsPage />
    </SettingsProviders>
  );
}

function ModpackListScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['Modpacks', 'Alpha Pack', 'Modpack Browser'],
    'Installed modpack list rendered with the refreshed card language.',
  );

  return (
    <ModpackProviders>
      <div className="mx-auto max-w-6xl p-6">
        <ModpackList onNavigate={() => undefined} onCreateWizard={() => undefined} />
      </div>
    </ModpackProviders>
  );
}

function ModpackCreateScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['FriendLauncher', 'Create New Modpack', 'Next'],
    'Phase 19 create-wizard proof rendered inside the real shell with title-bar clearance and one route-owned primary step action.',
  );

  return (
    <Phase19ShellFrame mode="modpacks" ownership="route">
      <ModpackCreationWizard onBack={() => undefined} />
    </Phase19ShellFrame>
  );
}

function ModpackBrowserScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['Modpack Browser', 'History', 'Alpha Pack'],
    'Modpack browser rendered with live results and preserved browser controls.',
  );

  return (
    <SettingsProviders>
      <div className="mx-auto max-w-6xl p-6">
        <ModpackBrowser
          initialState={{ ...DEFAULT_MODPACK_BROWSER_STATE, platform: 'modrinth', query: 'alpha' }}
          onBack={() => undefined}
          onNavigate={() => undefined}
          onStateChange={() => undefined}
        />
      </div>
    </SettingsProviders>
  );
}

function ModpackDetailsScenario({ onReady }: ManualVerificationScenarioProps) {
  const fixtureMetadata = useMemo(() => getManualVerificationModpackMetadata('modpack-details'), []);
  const fixtureMods = useMemo(() => getManualVerificationModEntries(), []);

  useReadyByText(
    onReady,
    ['FriendLauncher', 'Gamma Runtime', 'Update Available'],
    'Phase 19 modpack-details proof rendered inside the real shell with title-bar clearance, demoted shell launch, and one route-owned primary action.',
  );

  return (
    <Phase19ShellFrame mode="modpacks" ownership="route">
      <ModpackDetails
        modpackId="alpha"
        initialTab="mods"
        initialExpandedModId="gamma"
        initialMetadata={fixtureMetadata}
        initialMods={fixtureMods}
        hydrateFromIpc={false}
        onBack={() => undefined}
        onNavigate={() => undefined}
        onLaunch={() => undefined}
      />
    </Phase19ShellFrame>
  );
}

function ExportScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['FriendLauncher', 'Export Modpack', 'Format'],
    'Phase 19 export-route proof rendered inside the real shell with title-bar clearance, demoted shell launch, and visible final action edges.',
  );

  return (
    <Phase19ShellFrame mode="modpacks" ownership="route">
      <ExportModpackPage modpackId="alpha" onBack={() => undefined} />
    </Phase19ShellFrame>
  );
}

function AddModScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['FriendLauncher', 'Modrinth', 'Sodium'],
    'Phase 19 add-content proof rendered inside the real shell with title-bar clearance, demoted shell launch, and one route-owned add action.',
  );

  return (
    <Phase19ShellFrame mode="modpacks" ownership="route">
      <AddModPage modpackId="alpha" onBack={() => undefined} />
    </Phase19ShellFrame>
  );
}

function InstallScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['FriendLauncher', 'Alpha Pack', 'Install modpack'],
    'Phase 19 install-route proof rendered inside the real shell with title-bar clearance, demoted shell launch, and one route-owned install action.',
  );

  return (
    <Phase19ShellFrame mode="modpacks" ownership="route">
      <InstallModpackPage
        modpack={MANUAL_BROWSER_RESULT}
        versions={MANUAL_BROWSER_VERSIONS}
        platform="modrinth"
        onBack={() => undefined}
      />
    </Phase19ShellFrame>
  );
}

function ImportPreviewScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['FriendLauncher', 'Alpha Pack', 'Import'],
    'Phase 19 import-preview proof rendered inside the real shell with title-bar clearance, demoted shell launch, and visible final import controls.',
  );

  return (
    <Phase19ShellFrame mode="modpacks" ownership="route">
      <ImportModpackPreviewPage filePath={MANUAL_IMPORT_FILE_PATH} onBack={() => undefined} />
    </Phase19ShellFrame>
  );
}

function AddModModalScenario({ onReady }: ManualVerificationScenarioProps) {
  const fixtureMetadata = useMemo(() => getManualVerificationModpackMetadata('modpack-details'), []);
  const fixtureMods = useMemo(() => getManualVerificationModEntries(), []);

  useReadyByText(
    onReady,
    ['FriendLauncher', 'Gamma Runtime', 'Add mods', 'Sodium'],
    'Phase 19 add-mod modal proof rendered over the real shell with title-bar clearance, demoted shell launch, and visible final helper and action edges.',
  );

  return (
    <Phase19ShellFrame mode="modpacks" ownership="route">
      <>
        <ModpackDetails
          modpackId="alpha"
          initialTab="mods"
          initialExpandedModId="gamma"
          initialMetadata={fixtureMetadata}
          initialMods={fixtureMods}
          hydrateFromIpc={false}
          onBack={() => undefined}
          onNavigate={() => undefined}
          onLaunch={() => undefined}
        />
        <AddModModal
          modpackId="alpha"
          isOpen={true}
          onClose={() => undefined}
          onAdded={() => undefined}
          defaultMCVersion="1.20.1"
          defaultLoader="fabric"
        />
      </>
    </Phase19ShellFrame>
  );
}

function ShareScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['Share Modpack', 'Share code', 'Copy Code'],
    'Share modal rendered with generated share code and copy controls.',
  );

  return (
    <SettingsProviders>
      <ShareModal isOpen={true} onClose={() => undefined} modpackId="alpha" />
    </SettingsProviders>
  );
}

function ScreenshotsScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['Screenshots', 'Open Folder', 'mountain-sunrise.png'],
    'Screenshots gallery rendered with live fixture images.',
  );

  return (
    <SettingsProviders>
      <div className="mx-auto max-w-6xl p-6">
        <ScreenshotsTab instancePath="/mock/.minecraft/instances/alpha" />
      </div>
    </SettingsProviders>
  );
}

function UtilitiesScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['Download mirrors', 'Popular Modpacks', 'Alpha Pack'],
    'Utilities surface rendered with mirrors priority and local statistics.',
  );

  return (
    <SettingsProviders>
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <MirrorsSettings />
        <StatisticsTab />
      </div>
    </SettingsProviders>
  );
}

function ContentScenario({ onReady }: ManualVerificationScenarioProps) {
  useReadyByText(
    onReady,
    ['Datapacks for Alpha World', 'Installed', 'Logic Tweaks'],
    'Content-management modal rendered with installed world datapacks.',
  );

  return (
    <SettingsProviders>
      <WorldDatapacksModal
        isOpen={true}
        onClose={() => undefined}
        instancePath="/mock/.minecraft/instances/alpha"
        worldFolder="AlphaWorld"
        worldName="Alpha World"
      />
    </SettingsProviders>
  );
}

export function ManualVerificationScenarios(props: { view: ManualVerificationView; onReady: (message: string) => void }) {
  const scenarioProps = { onReady: props.onReady };

  if (props.view === 'welcome') {
    return <WelcomeScenario {...scenarioProps} />;
  }

  if (props.view === 'tour') {
    return <TourScenario {...scenarioProps} />;
  }

  if (props.view === 'dashboard') {
    return <DashboardScenario {...scenarioProps} />;
  }

  if (props.view === 'settings-accounts') {
    return <SettingsAccountsScenario {...scenarioProps} />;
  }

  if (props.view === 'phase-17-polish') {
    return <Phase17PolishScenario {...scenarioProps} />;
  }

  if (props.view === 'accounts') {
    return <AccountsScenario {...scenarioProps} />;
  }

  if (props.view === 'modpack-list') {
    return <ModpackListScenario {...scenarioProps} />;
  }

  if (props.view === 'modpack-create') {
    return <ModpackCreateScenario {...scenarioProps} />;
  }

  if (props.view === 'modpack-browser') {
    return <ModpackBrowserScenario {...scenarioProps} />;
  }

  if (props.view === 'modpack-details') {
    return <ModpackDetailsScenario {...scenarioProps} />;
  }

  if (props.view === 'modpack-export') {
    return <ExportScenario {...scenarioProps} />;
  }

  if (props.view === 'modpack-add') {
    return <AddModScenario {...scenarioProps} />;
  }

  if (props.view === 'modpack-install') {
    return <InstallScenario {...scenarioProps} />;
  }

  if (props.view === 'modpack-import-preview') {
    return <ImportPreviewScenario {...scenarioProps} />;
  }

  if (props.view === 'modpack-add-modal') {
    return <AddModModalScenario {...scenarioProps} />;
  }

  if (props.view === 'share') {
    return <ShareScenario {...scenarioProps} />;
  }

  if (props.view === 'screenshots') {
    return <ScreenshotsScenario {...scenarioProps} />;
  }

  if (props.view === 'utilities') {
    return <UtilitiesScenario {...scenarioProps} />;
  }

  if (props.view === 'content') {
    return <ContentScenario {...scenarioProps} />;
  }

  return <OverviewScenario />;
}

export function ManualVerificationNavigation(props: { activeView: ManualVerificationView }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {CORE_VIEWS.map((view) => {
        const isActive = props.activeView === view.id;
        return (
          <a
            key={view.id}
            href={`?view=${view.id}`}
            className={[
              'rounded-full border px-3 py-1.5 text-sm transition-colors',
              isActive
                ? 'border-border-active bg-card text-foreground'
                : 'border-border/70 text-secondary hover:border-border-active hover:text-foreground',
            ].join(' ')}
          >
            {view.label}
          </a>
        );
      })}
    </nav>
  );
}
