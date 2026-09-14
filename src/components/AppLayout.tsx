import type { RefObject } from 'react';
import type { UpdateInfo, UpdateStatus } from '../features/updater/hooks/useAppUpdater';
import type { MCVersion } from '../services/versions/types';
import type { VersionHint } from '../utils/minecraftVersions';
import type { LaunchStage } from '../features/launcher/services/launcherService';
import { ProductShell } from '../product/ProductShell';

export type AppLayoutProps = {
  theme: 'light' | 'dark';
  updates: {
    status: UpdateStatus;
    info: UpdateInfo | null;
    onInstall: () => void;
    onDownload: () => void;
  };
  modpackOnLaunch?: () => void | Promise<void>;
  overlays: {
    showSettings: boolean;
    onCloseSettings: () => void;
    showMultiplayer: boolean;
    onBackFromMultiplayer: () => void;
  };
  actions: {
    onShowMultiplayer: () => void;
    onShowSettings: () => void;
    onStartTour?: () => void;
  };
  launch: {
    nickname: string;
    setNickname: (v: string) => void;
    version: string;
    setVersion: (v: string) => void;
    versions: MCVersion[];
    useForge: boolean;
    setUseForge: (v: boolean) => void;
    useFabric: boolean;
    setUseFabric: (v: boolean) => void;
    useNeoForge: boolean;
    setUseNeoForge: (v: boolean) => void;
    setLoader: (loader: 'vanilla' | 'forge' | 'fabric' | 'neoforge') => void;
    useOptiFine: boolean;
    setUseOptiFine: (v: boolean) => void;
    isOffline: boolean;
    currentHint: VersionHint | null;
    loaderType: 'vanilla' | 'forge' | 'fabric' | 'neoforge';
    ram: number;
    supportedVersions: {
      forge: string[];
      fabric: string[];
      optiFine: string[];
      neoForge: string[];
    };
    isModloadersLoading?: boolean;
  };
  runtime: {
    isLaunching: boolean;
    progress?: number;
    launchStage: LaunchStage;
    statusText: string;
    statusDetail: string;
    canForceRestart: boolean;
    onLaunch: () => void;
    showConsole: boolean;
    logs: string[];
    logEndRef: RefObject<HTMLDivElement>;
    onCopyLogs: () => void;
    iconPath: string;
  };
};


export const APP_LAYOUT_SAFE_AREA_TEST_ID = 'app-layout-safe-area';
export const APP_LAYOUT_NOTIFICATIONS_TEST_ID = 'app-layout-notifications';

export function AppLayout(props: AppLayoutProps) {
  return <ProductShell {...props} />;
}
