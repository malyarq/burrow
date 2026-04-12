/// <reference types="vite/client" />

import type {
  AppUpdaterAPI,
  AssetsAPI,
  CacheAPI,
  InstanceUpdaterAPI,
  IpcRendererAPI,
  ModpacksAPI,
  MirrorsAPI,
  LauncherAPI,
  ModsAPI,
  NetworkAPI,
  SettingsAPI,
  WindowControlsAPI,
  FriendLauncherApi,
  AccountAPI,
} from '@shared/contracts';

declare global {
  interface Window {
    launcher: LauncherAPI;
    modpacks: ModpacksAPI;
    mirrors: MirrorsAPI;
    mods: ModsAPI;
    updater: InstanceUpdaterAPI;
    windowControls: WindowControlsAPI;
    networkAPI: NetworkAPI;
    cache: CacheAPI;
    settings: SettingsAPI;
    assets: AssetsAPI;
    appUpdater: AppUpdaterAPI;
    ipcRenderer: IpcRendererAPI;
    account: AccountAPI;
    mirrors: MirrorsAPI;

    // Preferred surface for new code (namespaced).
    api: FriendLauncherApi;
  }
}

export { };
