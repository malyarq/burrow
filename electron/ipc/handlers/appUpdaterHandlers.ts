import pkg from 'electron-updater'
const { autoUpdater } = pkg
import { ipcMain } from 'electron'
import { areAppUpdatesEnabled } from '../../services/updater/appUpdater'

export function registerAppUpdaterHandlers() {
  ipcMain.removeHandler('app-updater:check')
  ipcMain.handle('app-updater:check', async () => {
    if (!areAppUpdatesEnabled()) return null
    return await autoUpdater.checkForUpdates()
  })

  ipcMain.removeHandler('app-updater:download')
  ipcMain.handle('app-updater:download', async () => {
    if (!areAppUpdatesEnabled()) return null
    return await autoUpdater.downloadUpdate()
  })

  ipcMain.removeHandler('app-updater:quit-and-install')
  ipcMain.handle('app-updater:quit-and-install', () => {
    if (!areAppUpdatesEnabled()) return
    autoUpdater.quitAndInstall()
  })
}
