import { afterEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  handlers: new Map<string, (...args: unknown[]) => unknown>(),
  removeHandler: vi.fn((channel: string) => { mocked.handlers.delete(channel); }),
}));

vi.mock('electron', () => ({
  ipcMain: {
    removeHandler: mocked.removeHandler,
    handle: (channel: string, handler: (...args: unknown[]) => unknown) => mocked.handlers.set(channel, handler),
  },
  BrowserWindow: class {},
}));

vi.mock('../../window/windowManager', () => ({ createConsoleWindow: vi.fn() }));

import { registerConsoleWindowHandlers } from '../consoleWindowHandlers';

describe('console window IPC registration', () => {
  afterEach(() => {
    mocked.handlers.clear();
    mocked.removeHandler.mockClear();
  });

  it('replaces both console handlers when the main window is recreated', () => {
    const paths = { preloadPath: '/preload.cjs', rendererDist: '/renderer', vitePublicPath: '/public' };

    registerConsoleWindowHandlers(paths);
    const firstOpen = mocked.handlers.get('window:openConsole');
    registerConsoleWindowHandlers(paths);

    expect(mocked.removeHandler).toHaveBeenCalledWith('window:openConsole');
    expect(mocked.removeHandler).toHaveBeenCalledWith('window:closeConsole');
    expect(mocked.handlers.get('window:openConsole')).not.toBe(firstOpen);
    expect(mocked.handlers).toHaveLength(2);
  });
});
