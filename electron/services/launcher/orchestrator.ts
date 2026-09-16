import { DefaultRangePolicy } from '@xmcl/file-transfer';
import type { DownloadProviderId } from '../mirrors/providers';
import type { AccountService } from '../account/accountService';
import type { MirrorsService } from '../mirrors/mirrorsService';
import type { StatisticsService } from '../stats/statisticsService';
import { JavaManager } from '../java/provisioning';
import { createDispatcher, resolveDownloadConcurrency } from '../runtime/http';
import { RuntimeDownloadService } from '../runtime/downloadService';
import { TaskRunner } from '../runtime/taskRunner';
import { VanillaService } from '../runtime/vanillaService';
import { logInstalledMods } from '../mods/logInstalledMods';
import { VersionListService } from '../versions/versionListService';
import { parseRequestedVersion } from '../versions/versionResolver';
import { patchUndiciThrowOnError } from '../../utils/undiciPatcher';
import { getRequiredJavaForMinecraftVersion } from './launchFlow/requiredJava';
import type { TaskProgressData, VersionEntry } from './types';
import type { LaunchGameOptions } from './orchestratorTypes';
import { prepareLaunchContext, ensureAuthInjector, createOfflineSession } from './preLaunchSetup';
import { installModLoaderIfNeeded } from './modLoaderInstaller';
import type { ChildProcess } from 'child_process';
import kill from 'tree-kill';
import { getFabricSupportedVersions, getForgeSupportedVersions, getNeoForgeSupportedVersions, getOptiFineSupportedVersions } from './versionResolver';
import { patchForgeVersionMetadata, prefetchLegacyForgeRuntimeDeps } from './legacyCompatibility';
import type { InstanceReadPort, LauncherRootResolver } from '../../domains/instances/ports';
import type { LaunchAdapters } from '../../infrastructure/instances/launchAdapters';
import type { LauncherSessionSnapshot } from '../../../shared/contracts/launcher';

type ActiveLaunch = {
  readonly id: number;
  readonly onClose: (code: number) => void;
  cancelled: boolean;
};

class LaunchPreparationCancelled extends Error {
  constructor() { super('Launch preparation cancelled'); }
}

// Orchestrates game launch flow: Java, modloaders, auth, and runtime options.
export class LauncherManager {
  private currentGameProcess: ChildProcess | null = null;
  private activeClose: Promise<void> | null = null;
  private javaManager: JavaManager;
  private readonly downloads: RuntimeDownloadService;
  private readonly versionLists: VersionListService;
  private readonly tasks: TaskRunner;
  private readonly vanilla: VanillaService;
  private readonly instances: InstanceReadPort;
  private readonly rootResolver: LauncherRootResolver;
  private readonly launchAdapters: LaunchAdapters;
  private readonly launcherRootPath: string;
  private readonly logInstalledMods: typeof logInstalledMods;

  private readonly authServerUrl: string;
  private readonly accountService?: AccountService;
  private readonly mirrorsService?: MirrorsService;
  private readonly statisticsService?: StatisticsService;
  private session: LauncherSessionSnapshot = { revision: 0, phase: 'idle' };
  private activeLaunch: ActiveLaunch | null = null;
  private preparationDrain: Promise<void> | null = null;
  private shuttingDown = false;
  private stateListener: ((snapshot: LauncherSessionSnapshot) => void) | null = null;
  private closeListener: ((code: number) => void) | null = null;
  private gameStartListener: (() => void) | null = null;
  private activeLaunchHidesWindow = false;

  constructor(deps: {
    javaManager?: JavaManager;
    downloads?: RuntimeDownloadService;
    versionLists?: VersionListService;
    tasks?: TaskRunner;
    vanilla?: VanillaService;
    instances: InstanceReadPort;
    rootResolver: LauncherRootResolver;
    launchAdapters: LaunchAdapters;
    launcherRootPath: string;
    logInstalledMods?: typeof logInstalledMods;

    authServerUrl?: string;
    accountService?: AccountService;
    mirrorsService?: MirrorsService;
    statisticsService?: StatisticsService;
  }) {
    patchUndiciThrowOnError();
    this.javaManager = deps?.javaManager ?? new JavaManager();

    this.mirrorsService = deps?.mirrorsService;
    this.downloads = deps?.downloads ?? new RuntimeDownloadService(this.mirrorsService);

    this.versionLists = deps?.versionLists ?? new VersionListService(this.downloads);
    this.tasks = deps?.tasks ?? new TaskRunner(this.downloads);
    this.vanilla = deps?.vanilla ?? new VanillaService(this.downloads, this.tasks);
    this.instances = deps.instances;
    this.rootResolver = deps.rootResolver;
    this.launchAdapters = deps.launchAdapters;
    this.launcherRootPath = deps.launcherRootPath;
    this.logInstalledMods = deps?.logInstalledMods ?? logInstalledMods;

    this.authServerUrl = deps?.authServerUrl ?? 'http://127.0.0.1:25530';
    this.accountService = deps?.accountService;
    this.statisticsService = deps?.statisticsService;
  }

  public async getVersionList(providerId?: DownloadProviderId) {
    return await this.versionLists.getVersionList(providerId);
  }

  public async getForgeSupportedVersions(providerId?: DownloadProviderId): Promise<string[]> {
    return await getForgeSupportedVersions({
      getVersionList: (id?: DownloadProviderId) => this.getVersionList(id) as unknown as Promise<{ versions: VersionEntry[] }>,
      providerId,
    });
  }

  public async getFabricSupportedVersions(): Promise<string[]> {
    return await getFabricSupportedVersions({
      getVersionList: () => this.getVersionList() as unknown as Promise<{ versions: VersionEntry[] }>,
    });
  }

  public async getOptiFineSupportedVersions(): Promise<string[]> {
    return await getOptiFineSupportedVersions({
      getVersionList: () => this.getVersionList() as unknown as Promise<{ versions: VersionEntry[] }>,
    });
  }

  public async getNeoForgeSupportedVersions(providerId?: DownloadProviderId): Promise<string[]> {
    return await getNeoForgeSupportedVersions({
      getVersionList: (id?: DownloadProviderId) => this.getVersionList(id) as unknown as Promise<{ versions: VersionEntry[] }>,
      providerId,
    });
  }

  public getSessionState(): LauncherSessionSnapshot {
    return this.session;
  }

  public setStateListener(listener: ((snapshot: LauncherSessionSnapshot) => void) | null): void {
    this.stateListener = listener;
  }

  public setGameLifecycleListeners(listeners: {
    onClose: ((code: number) => void) | null;
    onGameStart: (() => void) | null;
  }): void {
    this.closeListener = listeners.onClose;
    this.gameStartListener = listeners.onGameStart;
  }

  public shouldHideLauncherWindow(): boolean {
    return this.activeLaunchHidesWindow;
  }

  /** Stops admission and drains a launch that was already preparing. Running games stay alive. */
  public async beginShutdown(): Promise<void> {
    this.shuttingDown = true;
    try { await this.preparationDrain; }
    catch (error) { if (!(error instanceof LaunchPreparationCancelled)) throw error; }
  }

  public launchGame(
    options: LaunchGameOptions,
    onLog: (data: string) => void,
    onProgress: (data: TaskProgressData) => void,
    onClose: (code: number) => void,
    onGameStart?: () => void
  ): Promise<void> {
    let launch: ActiveLaunch;
    try { launch = this.admitLaunch(onClose); }
    catch (error) { return Promise.reject(error); }
    this.activeLaunchHidesWindow = Boolean(options.hideLauncher);
    const drain = this.runLaunch(launch, options, onLog, onProgress, onGameStart).finally(() => {
      if (this.preparationDrain !== drain) return;
      this.preparationDrain = null;
      if (!this.currentGameProcess && this.activeLaunch === launch) {
        this.activeLaunch = null;
        this.activeLaunchHidesWindow = false;
      }
    });
    this.preparationDrain = drain;
    return drain;
  }

  private checkPreparation(launch: ActiveLaunch): void {
    if (this.shuttingDown || launch.cancelled) throw new LaunchPreparationCancelled();
  }

  private async runLaunch(
    launch: ActiveLaunch,
    options: LaunchGameOptions,
    onLog: (data: string) => void,
    onProgress: (data: TaskProgressData) => void,
    onGameStart?: () => void,
  ): Promise<void> {
    try {
    const { rootPath, instanceId, instancePath, record, effective } = await prepareLaunchContext({
      instances: this.instances,
      rootResolver: this.rootResolver,
      native: this.launchAdapters,
      launcherRootPath: this.launcherRootPath,
      options,
    });
    this.checkPreparation(launch);

    const {
      requestedVersion,
      ramGb,
      effectiveJavaPath,
      effectiveVmOptions,
      effectiveMcArgs,
      effectiveResolution,
      effectiveServer,
      minRamGb,
    } = effective;

    const { isNeoForge, isForge, isFabric, isQuilt, mcVersion } = parseRequestedVersion(requestedVersion);

    onLog('═══════════════════════════════════════════════════════════');
    onLog(`[VERSION INFO] Launching version: ${requestedVersion}`);
    onLog(`[VERSION INFO] Minecraft version: ${mcVersion}`);
    onLog(`[VERSION INFO] Version type: ${isNeoForge ? 'NeoForge' : isForge ? 'Forge' : isFabric ? 'Fabric' : 'Vanilla'}`);
    if (instanceId) onLog(`[MODPACK] ${instanceId} @ ${instancePath}`);
    if (options.useOptiFine) {
      onLog(`[VERSION INFO] OptiFine: requested`);
    }
    onLog('═══════════════════════════════════════════════════════════');

    const downloadProvider = this.downloads.getDownloadProvider(options.downloadProvider);
    await this.downloads.warmupMirrors(downloadProvider);
    this.checkPreparation(launch);
    const maxSockets = options.maxSockets ?? 64;
    const dispatcher = createDispatcher(maxSockets);
    const rangePolicy = new DefaultRangePolicy(5 * 1024 * 1024, 4);
    const concurrency = resolveDownloadConcurrency(options.autoDownloadThreads ?? true, options.downloadThreads);

    const downloadOptions = this.downloads.buildInstallerOptions(downloadProvider, dispatcher, rangePolicy, concurrency);

    const requiredJava = getRequiredJavaForMinecraftVersion(mcVersion);
    if (requiredJava === 25) onLog(`Version ${mcVersion} requires Java 25.`);
    else if (requiredJava === 21) onLog(`Version ${mcVersion} requires Java 21.`);
    else if (requiredJava === 17) onLog(`Version ${mcVersion} requires Java 17.`);
    else onLog(`Version ${mcVersion} uses Legacy Java 8.`);

    const javaPath = await this.launchAdapters.resolveJavaPath({
      javaManager: this.javaManager,
      requiredJava,
      customJavaPath: effectiveJavaPath,
      onLog,
      onProgress,
    });
    this.checkPreparation(launch);

    onLog(`Ensuring Minecraft ${mcVersion} is installed...`);
    await this.vanilla.ensureVanillaInstalled(mcVersion, rootPath, onLog, onProgress, downloadProvider, downloadOptions);
    this.checkPreparation(launch);

    const launchVersion = await installModLoaderIfNeeded({
      rootPath,
      instancePath,
      mcVersion,
      javaPath,
      requestedVersion,
      isForge,
      isNeoForge,
      isFabric,
      isQuilt,
      useOptiFine: options.useOptiFine,
      downloadProvider,
      maxSockets,
      downloadOptions,
      tasks: this.tasks,
      onLog,
      onProgress,
    });
    this.checkPreparation(launch);

    if (isForge) {
      patchForgeVersionMetadata({ rootPath, launchVersion, mcVersion, onLog });
      await prefetchLegacyForgeRuntimeDeps({ instancePath, mcVersion, downloadProvider, onLog });
      this.checkPreparation(launch);
    }

    await this.logInstalledMods(rootPath, onLog, instancePath);
    this.checkPreparation(launch);

    const { destInjectorPath } = await ensureAuthInjector({
      rootPath,
      modpackPath: instancePath,
      downloadProvider,
      maxSockets,
      onLog,
    });
    this.checkPreparation(launch);

    let resolvedAuthServerUrl = this.authServerUrl;
    let accessToken: string;
    let gameProfile: { id: string; name: string };

    const activeAccount = await this.accountService?.ensureActiveAccountValid();

    if (activeAccount?.type === 'third-party' && activeAccount.authServerUrl) {
      resolvedAuthServerUrl = activeAccount.authServerUrl;
      accessToken = activeAccount.accessToken!;
      gameProfile = { id: activeAccount.id, name: activeAccount.name };
      onLog(`[AUTH] Using Third-Party Account: ${activeAccount.name} (${activeAccount.authServerUrl})`);
    } else {
      // Offline (either explicit account or fallback nickname)
      const nickname = activeAccount?.name ?? options.nickname;
      const offlineUser = createOfflineSession(nickname);
      accessToken = offlineUser.accessToken;
      gameProfile = offlineUser.selectedProfile;
      onLog(`[AUTH] Using Offline Account: ${nickname}`);
    }

    onLog(`[LAUNCH] Launching Minecraft ${launchVersion}...`);
    onLog(`[LAUNCH] Java: ${javaPath}`);
    onLog(`[LAUNCH] RAM: Max ${ramGb}GB${minRamGb ? `, Min ${minRamGb}GB` : ''}`);

    this.checkPreparation(launch);

    let closed: Promise<void> | null = null;
    let attachedProcess: ChildProcess | null = null;
    const attachProcess = (proc: ChildProcess) => {
      if (attachedProcess === proc) return;
      if (attachedProcess) throw new Error('Launch adapter returned more than one game process');
      attachedProcess = proc;

      // Record launch statistics only after a child process exists.
      if (this.statisticsService) {
        try { this.statisticsService.recordLaunch(instanceId, record.name); }
        catch (e) { console.error('Failed to record launch stats:', e); }
      }
      const startTime = Date.now();
      this.currentGameProcess = proc;
      closed = new Promise<void>((resolve) => {
        proc.once('close', (code) => {
          if (this.currentGameProcess === proc) this.currentGameProcess = null;
          if (this.statisticsService) {
            try { this.statisticsService.recordPlayTime(Date.now() - startTime, instanceId); }
            catch (e) { console.error('Failed to record play time stats:', e); }
          }
          const exitCode = typeof code === 'number' ? code : 0;
          onLog(`[EXIT] Game closed with code ${exitCode}`);
          this.completeLaunch(launch, exitCode);
          this.activeClose = null;
          resolve();
        });
      });
      this.activeClose = closed;
      this.publishState({ phase: 'starting' });
    };

    const proc = await this.launchAdapters.spawnMinecraft({
      requiredJava,
      effectiveVmOptions,
      onLog,
      onSpawn: attachProcess,
      onGameStart: () => {
        if (this.activeLaunch?.id === launch.id) this.publishState({ phase: 'running' });
        (this.gameStartListener ?? onGameStart)?.();
      },
      launchOptions: {
        gamePath: instancePath,
        resourcePath: rootPath,
        javaPath,
        version: launchVersion,
        gameProfile: gameProfile,
        accessToken: accessToken,
        userType: 'legacy',
        properties: {},
        resolution: effectiveResolution,
        server: effectiveServer,
        minMemory: minRamGb ? minRamGb * 1024 : 1024,
        maxMemory: ramGb * 1024,
        extraMCArgs: effectiveMcArgs,
        ignorePatchDiscrepancies: true,
        ignoreInvalidMinecraftCertificates: true,
        yggdrasilAgent: {
          jar: destInjectorPath,
          server: resolvedAuthServerUrl,
        },
        launcherName: 'Burrow',
        launcherBrand: 'Burrow',
      },
    });



    attachProcess(proc);

    if ((this.shuttingDown || launch.cancelled) && this.currentGameProcess === proc) {
      await this.killProcess(proc);
      await this.waitForClose(closed);
    }
    } catch (error) {
      if (!this.currentGameProcess) this.failPreparation(launch);
      throw error;
    }
  }

  private admitLaunch(onClose: (code: number) => void): ActiveLaunch {
    if (this.shuttingDown) throw new Error('Launcher is shutting down');
    if (this.activeLaunch || this.preparationDrain || this.currentGameProcess) throw new Error('A game launch is already in progress');
    const launch = { id: this.session.revision + 1, onClose, cancelled: false };
    this.activeLaunch = launch;
    this.publishState({ phase: 'preparing' });
    return launch;
  }

  private failPreparation(launch: ActiveLaunch): void {
    if (this.activeLaunch?.id !== launch.id) return;
    this.activeLaunchHidesWindow = false;
    this.publishState({ phase: 'failed' });
  }

  private completeLaunch(launch: ActiveLaunch, exitCode: number): void {
    if (this.activeLaunch?.id !== launch.id) return;
    this.publishState(exitCode === 0 ? { phase: 'idle' } : { phase: 'failed', exitCode });
    (this.closeListener ?? launch.onClose)(exitCode);
    if (!this.preparationDrain) {
      this.activeLaunch = null;
      this.activeLaunchHidesWindow = false;
    }
  }

  private publishState(next: Omit<LauncherSessionSnapshot, 'revision'>): void {
    this.session = { ...next, revision: this.session.revision + 1 };
    this.stateListener?.(this.session);
  }

  private async killProcess(proc: ChildProcess): Promise<void> {
    const pid = proc.pid;
    if (!pid) return;
    await new Promise<void>((resolve, reject) => {
      kill(pid, 'SIGKILL', (err) => {
        if (err) {
          try { proc.kill('SIGKILL'); }
          catch { reject(err); return; }
        }
        resolve();
      });
    });
  }

  private async waitForClose(closed: Promise<void> | null): Promise<void> {
    if (!closed) throw new Error('Minecraft process did not report a close listener');
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        closed,
        new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error('Timed out waiting for Minecraft to exit')), 5_000); }),
      ]);
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  /** Kills the running game process and its entire tree (Java + children). */
  public async killGameProcess(): Promise<void> {
    const preparation = this.preparationDrain;
    if (preparation && this.activeLaunch) this.activeLaunch.cancelled = true;
    const proc = this.currentGameProcess;
    const closed = this.activeClose;
    if (proc) {
      await this.killProcess(proc);
      await this.waitForClose(closed);
    }
    try { await preparation; }
    catch (error) { if (!(error instanceof LaunchPreparationCancelled)) throw error; }
  }
  /** Writes data to the game process stdin if available. */
  public writeToGameStdin(data: string): void {
    if (this.currentGameProcess && this.currentGameProcess.stdin) {
      this.currentGameProcess.stdin.write(data);
    }
  }
}
