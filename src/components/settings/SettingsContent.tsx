import { useEffect, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useAppUpdater } from '../../features/updater/hooks/useAppUpdater';
import { PrivacyFeedbackCard } from '../../features/feedback/PrivacyFeedbackCard';
import { AccountsPage } from '../../features/accounts/AccountsPage';
import { StatisticsTab } from '../../features/settings/statistics/StatisticsTab';
import { storageMaintenanceIPC } from '../../services/ipc/storageMaintenanceIPC';
import { UpdateModal } from '../UpdateModal';
import { SettingsTabsHeader } from './SettingsTabsHeader';
import { getSettingsPanelId, getSettingsTabLabelId, SETTINGS_TABS, type SettingsTabId } from './settingsTabs';
import { AppearanceTab } from './tabs/AppearanceTab';
import { DownloadsTab } from './tabs/DownloadsTab';
import { LauncherTab } from './tabs/LauncherTab';
import { StorageSettings } from './tabs/StorageTab';

interface SettingsContentProps {
  initialTab?: SettingsTabId;
  presentation?: 'modal' | 'page';
}

export function SettingsContent({ initialTab = 'appearance', presentation = 'modal' }: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const {
    hideLauncher, setHideLauncher, showConsole, setShowConsole, t,
    minecraftPath, setMinecraftPath, autoDownloadThreads, setAutoDownloadThreads,
    downloadThreads, setDownloadThreads, maxSockets, setMaxSockets, uiScale, setUiScale,
    disableAnimations, setDisableAnimations,
    compactMode, setCompactMode, getAccentStyles,
  } = useSettings();
  const { status, updateInfo, progress, checkForUpdates, downloadUpdate, installUpdate } = useAppUpdater(false);

  useEffect(() => {
    if (status !== 'available' && status !== 'downloading' && status !== 'downloaded') return;
    const timer = setTimeout(() => setShowUpdateModal(true), 0);
    return () => clearTimeout(timer);
  }, [status]);

  const renderTab = (tab: SettingsTabId) => {
    if (tab === 'appearance') return <AppearanceTab embedded />;
    if (tab === 'downloads') return <DownloadsTab autoDownloadThreads={autoDownloadThreads} setAutoDownloadThreads={setAutoDownloadThreads} downloadThreads={downloadThreads} setDownloadThreads={setDownloadThreads} maxSockets={maxSockets} setMaxSockets={setMaxSockets} t={t} embedded />;
    if (tab === 'launcher') return <LauncherTab hideLauncher={hideLauncher} setHideLauncher={setHideLauncher} showConsole={showConsole} setShowConsole={setShowConsole} minecraftPath={minecraftPath} setMinecraftPath={setMinecraftPath} t={t} status={status} updateInfo={updateInfo} uiScale={uiScale} setUiScale={setUiScale} disableAnimations={disableAnimations} setDisableAnimations={setDisableAnimations} compactMode={compactMode} setCompactMode={setCompactMode} privacyFeedback={<PrivacyFeedbackCard />} onCheckForUpdates={checkForUpdates} onBeforeCheckForUpdates={() => setShowUpdateModal(false)} embedded />;
    if (tab === 'storage') return <StorageSettings t={t} getAccentStyles={getAccentStyles} storageMaintenanceIPC={storageMaintenanceIPC} embedded />;
    if (tab === 'accounts') return <AccountsPage embedded />;
    return <StatisticsTab embedded />;
  };

  return (
    <>
      <div className={presentation === 'page' ? 'grid min-h-0 gap-8 lg:grid-cols-[13rem_minmax(0,44rem)] lg:items-start' : 'min-h-0 space-y-6'}>
        <nav data-testid={presentation === 'modal' ? 'settings-shell-header' : undefined} className={presentation === 'page' ? 'min-w-0 lg:sticky lg:top-6' : 'border-b border-border/70 pb-4'} aria-label={t('settings.title')}>
          <SettingsTabsHeader activeTab={activeTab} onTabChange={setActiveTab} t={t} getAccentStyles={(type) => getAccentStyles(type)} layout={presentation === 'page' ? 'sidebar' : 'row'} />
        </nav>
        <div className="min-w-0">
          {SETTINGS_TABS.map(({ id }) => (
            <section key={id} id={getSettingsPanelId(id)} role="tabpanel" aria-labelledby={getSettingsTabLabelId(id)} hidden={id !== activeTab} tabIndex={0} className="settings-route-panel min-h-[22rem] outline-none">
              {renderTab(id)}
            </section>
          ))}
        </div>
      </div>
      {showUpdateModal && <UpdateModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} updateInfo={updateInfo} progress={progress} status={status as 'available' | 'downloading' | 'downloaded'} onInstall={installUpdate} onDownload={downloadUpdate} />}
    </>
  );
}
