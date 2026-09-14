import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useAppUpdater } from '../features/updater/hooks/useAppUpdater';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { SettingsTabsHeader } from './settings/SettingsTabsHeader';
import {
    SETTINGS_TABS,
    getSettingsPanelId,
    getSettingsTabLabelId,
    type SettingsTabId,
} from './settings/settingsTabs';

import { AppearanceTab } from './settings/tabs/AppearanceTab';
import { DownloadsTab } from './settings/tabs/DownloadsTab';
import { StorageSettings } from './settings/tabs/StorageTab';
import { UpdateModal } from './UpdateModal';
import { storageMaintenanceIPC } from '../services/ipc/storageMaintenanceIPC';

import { LauncherTab } from './settings/tabs/LauncherTab';
import { PrivacyFeedbackCard } from '../features/feedback/PrivacyFeedbackCard';
import { AccountsPage } from '../features/accounts/AccountsPage';
import { StatisticsTab } from '../features/settings/statistics/StatisticsTab';

interface SettingsPageProps {
    onClose: () => void;
    initialTab?: SettingsTabId;
}

// Settings modal for appearance and launcher preferences.
const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, initialTab = 'appearance' }) => {
    const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const {
        hideLauncher, setHideLauncher,
        showConsole, setShowConsole,
        t,
        minecraftPath, setMinecraftPath,
        autoDownloadThreads, setAutoDownloadThreads,
        downloadThreads, setDownloadThreads,
        maxSockets, setMaxSockets,
        uiScale, setUiScale,
        disableAnimations, setDisableAnimations,
        sidebarPosition, setSidebarPosition,
        compactMode, setCompactMode,
        getAccentStyles
    } = useSettings();

    // App updater hook (without auto-check)
    const { status, updateInfo, progress, checkForUpdates, downloadUpdate, installUpdate } = useAppUpdater(false);

    // Show update modal when update becomes available
    React.useEffect(() => {
        if (status === 'available' || status === 'downloading' || status === 'downloaded') {
            // Avoid synchronous setState in effect body (lint rule).
            const timer = setTimeout(() => setShowUpdateModal(true), 0);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const renderTab = (tab: SettingsTabId) => {
        if (tab === 'appearance') {
            return <AppearanceTab embedded />;
        }

        if (tab === 'downloads') {
            return (
                <DownloadsTab
                    autoDownloadThreads={autoDownloadThreads}
                    setAutoDownloadThreads={setAutoDownloadThreads}
                    downloadThreads={downloadThreads}
                    setDownloadThreads={setDownloadThreads}
                    maxSockets={maxSockets}
                    setMaxSockets={setMaxSockets}
                    t={t}
                    embedded
                />
            );
        }

        if (tab === 'launcher') {
            return (
                <LauncherTab
                    hideLauncher={hideLauncher}
                    setHideLauncher={setHideLauncher}
                    showConsole={showConsole}
                    setShowConsole={setShowConsole}
                    minecraftPath={minecraftPath}
                    setMinecraftPath={setMinecraftPath}
                    t={t}
                    status={status}
                    updateInfo={updateInfo}
                    uiScale={uiScale}
                    setUiScale={setUiScale}
                    disableAnimations={disableAnimations}
                    setDisableAnimations={setDisableAnimations}
                    sidebarPosition={sidebarPosition}
                    setSidebarPosition={setSidebarPosition}
                    compactMode={compactMode}
                    setCompactMode={setCompactMode}
                    privacyFeedback={<PrivacyFeedbackCard />}
                    onCheckForUpdates={checkForUpdates}
                    onBeforeCheckForUpdates={() => setShowUpdateModal(false)}
                    embedded
                />
            );
        }

        if (tab === 'storage') {
            return (
                <StorageSettings
                    t={t}
                    getAccentStyles={getAccentStyles}
                    storageMaintenanceIPC={storageMaintenanceIPC}
                    embedded
                />
            );
        }

        if (tab === 'accounts') {
            return <AccountsPage embedded />;
        }

        return <StatisticsTab embedded />;
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            closeLabel={t('general.close_dialog')}
            title={t('settings.title')}
            className="h-[min(54rem,calc(100dvh-2rem))] max-w-[min(64rem,calc(100vw-1rem))]"
            headerActions={<Button variant="secondary" size="sm" onClick={onClose}>{t('settings.done')}</Button>}
        >
            <div className="min-h-0 space-y-6">
                <div
                    data-testid="settings-shell-header"
                    className="sticky top-0 z-10 border-b border-border bg-card pb-3"
                >
                    <div className="min-w-0 flex-1">
                        <SettingsTabsHeader
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            t={t}
                            getAccentStyles={(type) => getAccentStyles(type)}
                        />
                    </div>

                </div>

                {SETTINGS_TABS.map(({ id }) => (
                    <div
                        key={id}
                        id={getSettingsPanelId(id)}
                        role="tabpanel"
                        aria-labelledby={getSettingsTabLabelId(id)}
                        hidden={id !== activeTab}
                        tabIndex={0}
                        className="settings-route-panel min-h-[22rem] outline-none"
                    >
                        {renderTab(id)}
                    </div>
                ))}
            </div>

            {showUpdateModal && (
                <UpdateModal
                    isOpen={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    updateInfo={updateInfo}
                    progress={progress}
                    status={status as 'available' | 'downloading' | 'downloaded'}
                    onInstall={installUpdate}
                    onDownload={downloadUpdate}
                />
            )}
        </Modal>
    );
};

export default SettingsPage;
