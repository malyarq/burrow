import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  enabled: true,
  handlers: new Map<string, (...args: unknown[]) => unknown>(),
  checkForUpdates: vi.fn(),
  downloadUpdate: vi.fn(),
  quitAndInstall: vi.fn(),
}));

vi.mock('electron', () => ({
  ipcMain: {
    removeHandler: vi.fn(),
    handle: (channel: string, handler: (...args: unknown[]) => unknown) => mocked.handlers.set(channel, handler),
  },
}));

vi.mock('electron-updater', () => ({
  default: {
    autoUpdater: {
      checkForUpdates: mocked.checkForUpdates,
      downloadUpdate: mocked.downloadUpdate,
      quitAndInstall: mocked.quitAndInstall,
    },
  },
}));

vi.mock('../../../services/updater/appUpdater', () => ({
  areAppUpdatesEnabled: () => mocked.enabled,
}));

import { registerAppUpdaterHandlers } from '../appUpdaterHandlers';

describe('app updater handlers', () => {
  beforeEach(() => {
    mocked.enabled = true;
    mocked.handlers.clear();
    mocked.checkForUpdates.mockReset();
    mocked.downloadUpdate.mockReset();
    mocked.quitAndInstall.mockReset();
  });

  it('does not let the Next preview check, download, or install a stable release', async () => {
    mocked.enabled = false;
    registerAppUpdaterHandlers();

    await expect(mocked.handlers.get('app-updater:check')?.()).resolves.toBeNull();
    await expect(mocked.handlers.get('app-updater:download')?.()).resolves.toBeNull();
    expect(mocked.handlers.get('app-updater:quit-and-install')?.()).toBeUndefined();
    expect(mocked.checkForUpdates).not.toHaveBeenCalled();
    expect(mocked.downloadUpdate).not.toHaveBeenCalled();
    expect(mocked.quitAndInstall).not.toHaveBeenCalled();
  });
});
