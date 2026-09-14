import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import { BrowserWindow } from "electron";

let appUpdatesEnabled = true;

export function setAppUpdatesEnabled(enabled: boolean) {
    appUpdatesEnabled = enabled;
}

export function areAppUpdatesEnabled() {
    return appUpdatesEnabled;
}

export class SelfUpdater {
    private static initialized = false;
    private static windows = new Set<BrowserWindow>();

    constructor(win: BrowserWindow, options: { enabled?: boolean } = {}) {
        SelfUpdater.windows.add(win);
        win.on('closed', () => {
            SelfUpdater.windows.delete(win);
        });
        this.initOnce(options.enabled ?? true);
    }

    private initOnce(enabled: boolean) {
        if (SelfUpdater.initialized) return;
        SelfUpdater.initialized = true;

        setAppUpdatesEnabled(enabled);
        if (!enabled) {
            autoUpdater.autoDownload = false;
            autoUpdater.autoInstallOnAppQuit = false;
            return;
        }

        // Keep downloads explicit to avoid unexpected bandwidth usage.
        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = true;

        // App update events forwarded to the renderer.
        autoUpdater.on('checking-for-update', () => {
            SelfUpdater.sendAll('app-updater:status', 'checking');
        });

        autoUpdater.on('update-available', (info) => {
            SelfUpdater.sendAll('app-updater:available', info);
        });

        autoUpdater.on('update-not-available', (info) => {
            SelfUpdater.sendAll('app-updater:not-available', info);
        });

        autoUpdater.on('error', (err) => {
            SelfUpdater.sendAll('app-updater:error', err.message);
        });

        autoUpdater.on('download-progress', (progressObj) => {
            SelfUpdater.sendAll('app-updater:progress', progressObj);
        });

        autoUpdater.on('update-downloaded', (info) => {
            SelfUpdater.sendAll('app-updater:downloaded', info);
        });
    }

    private static sendAll(channel: string, ...args: unknown[]) {
        for (const win of SelfUpdater.windows) {
            if (!win.isDestroyed()) {
                win.webContents.send(channel, ...args);
            }
        }
    }
}
