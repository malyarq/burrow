import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const mocked = vi.hoisted(() => ({
  handlers: new Map<string, (...args: unknown[]) => unknown>(),
  showSaveDialog: vi.fn(),
  showOpenDialog: vi.fn(),
  openPath: vi.fn(),
  userDataPath: '/tmp',
}));

vi.mock('electron', () => ({
  app: { getPath: vi.fn((name: string) => name === 'userData' ? mocked.userDataPath : '/tmp') },
  dialog: { showSaveDialog: mocked.showSaveDialog, showOpenDialog: mocked.showOpenDialog },
  ipcMain: {
    removeHandler: (channel: string) => mocked.handlers.delete(channel),
    handle: (channel: string, handler: (...args: unknown[]) => unknown) => mocked.handlers.set(channel, handler),
  },
  shell: { openPath: mocked.openPath },
}));

import { registerSettingsHandlers } from '../settingsHandlers';
import {
  clearSavePathAuthorizationsForTests,
  consumeAuthorizedSavePath,
} from '../../../security/savePathAuthorizations';

describe('settings native save dialog authorization', () => {
  const temporaryDirectories: string[] = [];

  afterEach(() => {
    mocked.handlers.clear();
    mocked.openPath.mockReset();
    mocked.userDataPath = '/tmp';
    clearSavePathAuthorizationsForTests();
    vi.restoreAllMocks();
    for (const directory of temporaryDirectories.splice(0)) fs.rmSync(directory, { recursive: true, force: true });
  });

  it('opens only the persisted native-selected directory, ignoring renderer arguments', async () => {
    const userDataPath = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-settings-directory-'));
    const nativeDirectory = path.join(userDataPath, 'native-directory');
    const rendererDirectory = path.join(userDataPath, 'renderer-directory');
    temporaryDirectories.push(userDataPath);
    fs.mkdirSync(nativeDirectory);
    fs.mkdirSync(rendererDirectory);
    mocked.userDataPath = userDataPath;
    mocked.showOpenDialog.mockResolvedValue({ canceled: false, filePaths: [nativeDirectory] });
    mocked.openPath.mockResolvedValue('');
    registerSettingsHandlers({ window: {} as never });

    const select = mocked.handlers.get('settings:selectMinecraftPath');
    const open = mocked.handlers.get('settings:openMinecraftPath');
    const getDefault = mocked.handlers.get('settings:getDefaultMinecraftPath');
    await expect(select?.({})).resolves.toEqual({ success: true, path: nativeDirectory });
    await expect(getDefault?.({})).resolves.toBe(nativeDirectory);
    await expect(open?.({}, rendererDirectory)).resolves.toEqual({ success: true });

    expect(mocked.openPath).toHaveBeenCalledWith(nativeDirectory);
    expect(JSON.parse(fs.readFileSync(path.join(userDataPath, 'minecraft-directory.json'), 'utf8'))).toEqual({ directory: nativeDirectory });
  });

  it('rejects unsafe native directory selections before they can be opened or persisted', async () => {
    const userDataPath = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-settings-directory-'));
    temporaryDirectories.push(userDataPath);
    mocked.userDataPath = userDataPath;
    mocked.showOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['\\\\server\\share'] });
    registerSettingsHandlers({ window: {} as never });

    const select = mocked.handlers.get('settings:selectMinecraftPath');
    await expect(select?.({})).resolves.toMatchObject({ success: false, path: null, error: expect.stringMatching(/local absolute path/i) });

    expect(mocked.openPath).not.toHaveBeenCalled();
    expect(fs.existsSync(path.join(userDataPath, 'minecraft-directory.json'))).toBe(false);
  });

  it('returns and authorizes the exact native path for the originating renderer', async () => {
    mocked.showSaveDialog.mockResolvedValue({ canceled: false, filePath: '/tmp/burrow-authorized-export.zip' });
    registerSettingsHandlers({ window: {} as never });
    const showSaveDialog = mocked.handlers.get('dialog:showSaveDialog');

    await expect(showSaveDialog?.({ sender: { id: 7 } }, {})).resolves.toEqual({ canceled: false, filePath: '/tmp/burrow-authorized-export.zip' });
    expect(consumeAuthorizedSavePath(7, '/tmp/burrow-authorized-export.zip')).toBe(path.resolve('/tmp/burrow-authorized-export.zip'));
  });

  it('does not create an authorization when the native save dialog is cancelled', async () => {
    mocked.showSaveDialog.mockResolvedValue({ canceled: true, filePath: undefined });
    registerSettingsHandlers({ window: {} as never });
    const showSaveDialog = mocked.handlers.get('dialog:showSaveDialog');

    await expect(showSaveDialog?.({ sender: { id: 7 } }, {})).resolves.toEqual({ canceled: true, filePath: undefined });
    expect(() => consumeAuthorizedSavePath(7, '/tmp/burrow-cancelled-export.zip')).toThrow('not authorized');
  });

  it('exports only allowlisted settings in a versioned backup', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-settings-backup-'));
    temporaryDirectories.push(directory);
    const filePath = path.join(directory, 'settings.json');
    mocked.showSaveDialog.mockResolvedValue({ canceled: false, filePath });
    registerSettingsHandlers({ window: {} as never });
    const exportBackup = mocked.handlers.get('settings:exportBackup');

    await expect(exportBackup?.({}, { settings_language: 'ru', nickname: 'Alex' })).resolves.toEqual({
      canceled: false,
      fileName: 'settings.json',
    });
    expect(JSON.parse(fs.readFileSync(filePath, 'utf8'))).toMatchObject({
      schemaVersion: 1,
      product: 'Burrow',
      values: { settings_language: 'ru', nickname: 'Alex' },
    });
    await expect(exportBackup?.({}, { mp_join_code: 'secret' })).rejects.toThrow(/unsupported key/i);
  });

  it('imports a valid backup and rejects unsupported keys', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-settings-backup-'));
    temporaryDirectories.push(directory);
    const filePath = path.join(directory, 'settings.json');
    fs.writeFileSync(filePath, JSON.stringify({
      schemaVersion: 1,
      product: 'Burrow',
      createdAt: '2026-08-06T00:00:00.000Z',
      values: { settings_language: 'en' },
    }));
    mocked.showOpenDialog.mockResolvedValue({ canceled: false, filePaths: [filePath] });
    registerSettingsHandlers({ window: {} as never });
    const importBackup = mocked.handlers.get('settings:importBackup');

    await expect(importBackup?.({})).resolves.toEqual({
      canceled: false,
      fileName: 'settings.json',
      values: { settings_language: 'en' },
    });

    fs.writeFileSync(filePath, JSON.stringify({
      schemaVersion: 1,
      product: 'OtherLauncher',
      createdAt: '2026-08-06T00:00:00.000Z',
      values: { settings_language: 'ru' },
    }));
    await expect(importBackup?.({})).rejects.toThrow('Unsupported Burrow settings backup');

    fs.writeFileSync(filePath, JSON.stringify({
      schemaVersion: 1,
      product: 'Burrow',
      createdAt: '2026-08-06T00:00:00.000Z',
      values: { burrow_analytics_install_id: 'secret' },
    }));
    await expect(importBackup?.({})).rejects.toThrow(/unsupported key/i);

    fs.writeFileSync(filePath, '{"accountToken":"must-not-appear-in-ui"');
    await expect(importBackup?.({})).rejects.toThrow('Settings backup is not valid JSON');

    fs.writeFileSync(filePath, JSON.stringify({
      schemaVersion: 1,
      product: 'Burrow',
      createdAt: 'not-a-date',
      values: { settings_language: 'en' },
    }));
    await expect(importBackup?.({})).rejects.toThrow('Unsupported Burrow settings backup');

    fs.writeFileSync(filePath, JSON.stringify({
      schemaVersion: 1,
      product: 'Burrow',
      createdAt: '2026-08-06',
      values: {},
    }));
    await expect(importBackup?.({})).rejects.toThrow('Unsupported Burrow settings backup');

    fs.writeFileSync(filePath, JSON.stringify({
      schemaVersion: 1,
      product: 'Burrow',
      createdAt: '2026-08-06T00:00:00.000Z',
      values: {},
      unexpected: true,
    }));
    await expect(importBackup?.({})).rejects.toThrow('Unsupported Burrow settings backup');
  });
});
