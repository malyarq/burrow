import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useMultiplayer } from '../features/multiplayer/hooks/useMultiplayer';
import { MultiplayerConnectionControls } from './MultiplayerConnectionControls';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';

export interface MultiplayerPageProps { onBack: () => void; }

const MultiplayerPage: React.FC<MultiplayerPageProps> = ({ onBack }) => {
  const { t } = useSettings();
  const multiplayer = useMultiplayer();

  return (
    <Modal isOpen onClose={onBack} closeLabel={t('general.close_dialog')} title={t('multiplayer.title')} className="max-w-3xl">
      <div className="flex flex-col gap-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.28fr)] lg:items-start">
          <div className="min-w-0 space-y-4">
            <Select
              label={t('settings.network_mode')}
              description={t('settings.network_mode_desc')}
              value={multiplayer.networkMode}
              onChange={(event) => multiplayer.setNetworkMode(event.target.value as typeof multiplayer.networkMode)}
            >
              <option value="hyperswarm">{t('settings.network_mode_hyperswarm')}</option>
              <option value="xmcl_lan">{t('settings.network_mode_xmcl_lan')}</option>
              <option value="xmcl_upnp_host">{t('settings.network_mode_xmcl_upnp_host')}</option>
            </Select>
          </div>
          <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <MultiplayerConnectionControls multiplayer={multiplayer} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MultiplayerPage;
