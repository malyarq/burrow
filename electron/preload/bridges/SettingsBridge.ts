import { ipcRenderer } from 'electron'
import type { SettingsAPI } from '@shared/contracts'

// Settings management
export const settings: SettingsAPI = {
  selectMinecraftPath: () => ipcRenderer.invoke('settings:selectMinecraftPath'),
  openMinecraftPath: () => ipcRenderer.invoke('settings:openMinecraftPath'),
  getDefaultMinecraftPath: () => ipcRenderer.invoke('settings:getDefaultMinecraftPath'),
  exportBackup: (values) => ipcRenderer.invoke('settings:exportBackup', values),
  importBackup: () => ipcRenderer.invoke('settings:importBackup'),
}
