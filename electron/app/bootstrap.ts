import { app, nativeImage, type Tray } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { AuthServer } from '../auth/server';
import { SelfUpdater, setAppUpdatesEnabled } from '../services/updater/appUpdater';
import { IPCManager } from '../ipc/ipcManager';
import { createMainWindow, getNativeWindowIconCandidates } from '../window/windowManager';
import { createTray } from '../tray/trayManager';
import { registerLifecycleHandlers } from './lifecycle';
import { loadFullTestConfig } from './fullTestConfig';
import { createCompositionRoot } from './compositionRoot';
import { ApplicationLifecycle } from './applicationLifecycle';
import { acquireApplicationInstance, registerApplicationInstanceHandoff } from './singleInstance';
import { registerConsoleWindowHandlers } from './consoleWindowHandlers';
import { runConfiguredFullTest } from './runConfiguredFullTest';
import { BURROW_NEXT_APP_ID, BURROW_NEXT_APP_NAME, getBurrowNextUserDataPath } from './identity';

function configureAppRoot() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Important: in build output, `__dirname` resolves to `dist-electron/`.
  // App root must be `dist-electron/..` (same as the previous `electron/main.ts` behavior),
  // otherwise preload/renderer paths will point to non-existent locations.
  process.env.APP_ROOT = path.join(__dirname, '..');
}

function configureIsolatedTestUserData(): boolean {
  const testUserDataPath = process.env['BURROW_TEST_USER_DATA'];
  if (!testUserDataPath) return false;

  if (process.env['NODE_ENV'] !== 'test' || !path.isAbsolute(testUserDataPath)) {
    throw new Error('BURROW_TEST_USER_DATA requires NODE_ENV=test and an absolute path');
  }

  fs.mkdirSync(testUserDataPath, { recursive: true });
  app.setPath('appData', path.join(testUserDataPath, 'app-data'));
  fs.mkdirSync(app.getPath('appData'), { recursive: true });
  app.setPath('userData', testUserDataPath);
  return true;
}

function configureBurrowNextIdentity() {
  app.setName(BURROW_NEXT_APP_NAME);
  app.setAppUserModelId(BURROW_NEXT_APP_ID);
  app.setPath('userData', getBurrowNextUserDataPath(app.getPath('appData')));
}

function resolveRuntimePaths() {
  // 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
  const rendererDevUrl = process.env['VITE_DEV_SERVER_URL'];
  const appRoot = process.env.APP_ROOT!;
  const mainDist = path.join(appRoot, 'dist-electron');
  const rendererDist = path.join(appRoot, 'dist');

  process.env.VITE_PUBLIC = rendererDevUrl ? path.join(appRoot, 'public') : rendererDist;

  return {
    rendererDevUrl,
    mainDist,
    rendererDist,
    vitePublicPath: process.env.VITE_PUBLIC!,
  };
}

function createAuthServer(): AuthServer {
  // Each Next process owns its server and remains independent of stable Burrow.
  return new AuthServer(0);
}

function resolveNativeIconPath(vitePublicPath: string): string {
  for (const iconFileName of getNativeWindowIconCandidates(process.platform)) {
    const iconPath = path.join(vitePublicPath, iconFileName);
    if (fs.existsSync(iconPath)) {
      return iconPath;
    }
  }

  return path.join(vitePublicPath, 'icon.png');
}

function applyNativeAppIcon(vitePublicPath: string): string {
  const iconPath = resolveNativeIconPath(vitePublicPath);
  const appIcon = nativeImage.createFromPath(iconPath);

  if (process.platform === 'darwin' && !appIcon.isEmpty()) {
    app.dock?.setIcon(appIcon);
  }

  return iconPath;
}

export function bootstrapMain() {
  configureBurrowNextIdentity();
  configureIsolatedTestUserData();
  setAppUpdatesEnabled(false);

  configureAppRoot();
  const paths = resolveRuntimePaths();
  if (!acquireApplicationInstance(paths.rendererDevUrl)) {
    app.quit();
    return;
  }

  let winRef: ReturnType<typeof createMainWindow> | null = null;
  let composition: ReturnType<typeof createCompositionRoot> | undefined;

  registerApplicationInstanceHandoff(() => winRef);

  const createWindow = () => {
    const win = createMainWindow({
      preloadPath: path.join(paths.mainDist, 'preload.cjs'),
      rendererDevUrl: paths.rendererDevUrl,
      rendererDist: paths.rendererDist,
      vitePublicPath: paths.vitePublicPath,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    winRef = win;
    if (composition) {
      IPCManager.unregisterAllHandlers();
      IPCManager.registerAllHandlers({ window: win, composition: composition.handlerDependencies });
      registerConsoleWindowHandlers({
        preloadPath: path.join(paths.mainDist, 'preload.cjs'),
        rendererDevUrl: paths.rendererDevUrl,
        rendererDist: paths.rendererDist,
        vitePublicPath: paths.vitePublicPath,
      });
    }
    // Initialize auto-updater once the window exists.
    new SelfUpdater(win, { enabled: false });
    return win;
  };

  let applicationLifecycle: ApplicationLifecycle | undefined;
  registerLifecycleHandlers({
    createWindow,
    shutdown: async () => { await applicationLifecycle?.shutdown(); },
  });

  app.whenReady().then(async () => {
    // Check for test configuration file
    const testConfig = loadFullTestConfig();
    if (testConfig?.enabled) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { enabled, ...testParams } = testConfig;
      app.exit(await runConfiguredFullTest(testParams));
      return;
    }

    const nativeIconPath = applyNativeAppIcon(paths.vitePublicPath);
    const authServer = createAuthServer();
    let tray: Tray | undefined;
    try {
      const { url: authServerUrl } = await authServer.start();
      composition = createCompositionRoot({
        paths: { userDataPath: app.getPath('userData'), appDataPath: app.getPath('appData') },
        authServerUrl,
      });

      // Recovery is part of startup and finishes before any window can submit
      // a mutation or observe an incomplete canonical state.
      await composition.recoverOperations();
      createWindow();

      tray = createTray({
        iconPath: nativeIconPath,
        onShowWindow: () => winRef?.show(),
        onQuit: () => app.quit(),
        onToggleWindowVisibility: () => {
          if (winRef?.isVisible()) winRef.hide();
          else {
            winRef?.show();
            winRef?.focus();
          }
        },
      });

      applicationLifecycle = new ApplicationLifecycle({
        unregisterIpc: () => IPCManager.unregisterAllHandlers(),
        shutdownComposition: () => composition!.shutdown(),
        stopAuthServer: () => authServer.stop(),
        destroyTray: () => tray?.destroy(),
      });

    } catch (error) {
      const partialLifecycle = applicationLifecycle ?? new ApplicationLifecycle({
        unregisterIpc: () => IPCManager.unregisterAllHandlers(),
        shutdownComposition: async () => composition ? await composition.shutdown() : { failures: [] },
        stopAuthServer: () => authServer.stop(),
        destroyTray: () => tray?.destroy(),
      });
      await partialLifecycle.shutdown();
      console.error('[Bootstrap] Startup failed:', error);
      app.exit(1);
    }
  });
}
