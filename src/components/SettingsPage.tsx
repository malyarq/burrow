import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { SettingsContent } from './settings/SettingsContent';
import type { SettingsTabId } from './settings/settingsTabs';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface SettingsPageProps {
  onClose: () => void;
  initialTab?: SettingsTabId;
}

// Compatibility adapter for callers that still need settings in an overlay.
const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, initialTab = 'appearance' }) => {
  const { t } = useSettings();

  return (
    <Modal isOpen onClose={onClose} closeLabel={t('general.close_dialog')} title={t('settings.title')} className="h-[min(54rem,calc(100dvh-2rem))] max-w-[min(64rem,calc(100vw-1rem))]" headerActions={<Button variant="secondary" size="sm" onClick={onClose}>{t('settings.done')}</Button>}>
      <SettingsContent initialTab={initialTab} />
    </Modal>
  );
};

export { SettingsContent };
export default SettingsPage;
