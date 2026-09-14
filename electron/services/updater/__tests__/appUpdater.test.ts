import { EventEmitter } from 'node:events';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const autoUpdater = Object.assign(new EventEmitter(), {
  autoDownload: true,
  autoInstallOnAppQuit: false,
  downloadUpdate: vi.fn(),
});

describe('SelfUpdater download policy', () => {
  beforeEach(() => {
    vi.resetModules();
    autoUpdater.removeAllListeners();
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.downloadUpdate.mockReset();
    vi.doMock('electron-updater', () => ({
      default: { autoUpdater },
    }));
  });

  it('announces an available update without downloading before user consent', async () => {
    const sendFirst = vi.fn();
    const sendSecond = vi.fn();
    const firstWindow = {
      on: vi.fn(),
      isDestroyed: () => false,
      webContents: { send: sendFirst },
    };
    const secondWindow = {
      on: vi.fn(),
      isDestroyed: () => false,
      webContents: { send: sendSecond },
    };
    const { SelfUpdater } = await import('../appUpdater');

    new SelfUpdater(firstWindow as never);
    new SelfUpdater(secondWindow as never);
    autoUpdater.emit('update-available', { version: '0.7.0' });

    expect(autoUpdater.autoDownload).toBe(false);
    expect(autoUpdater.autoInstallOnAppQuit).toBe(true);
    expect(autoUpdater.downloadUpdate).not.toHaveBeenCalled();
    expect(autoUpdater.listenerCount('update-available')).toBe(1);
    expect(sendFirst).toHaveBeenCalledWith('app-updater:available', { version: '0.7.0' });
    expect(sendSecond).toHaveBeenCalledWith('app-updater:available', { version: '0.7.0' });
  });

  it('keeps the Next preview outside the stable updater channel', async () => {
    const send = vi.fn();
    const window = {
      on: vi.fn(),
      isDestroyed: () => false,
      webContents: { send },
    };
    const { SelfUpdater, areAppUpdatesEnabled } = await import('../appUpdater');

    new SelfUpdater(window as never, { enabled: false });
    autoUpdater.emit('update-available', { version: '1.0.0' });

    expect(autoUpdater.autoDownload).toBe(false);
    expect(autoUpdater.autoInstallOnAppQuit).toBe(false);
    expect(autoUpdater.listenerCount('update-available')).toBe(0);
    expect(send).not.toHaveBeenCalled();
    expect(areAppUpdatesEnabled()).toBe(false);
  });
});
