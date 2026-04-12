# FriendLauncher Architecture

## System Shape

FriendLauncher is an Electron desktop application with a strict runtime split, but the implementation is transitional rather than perfectly clean:

- The Electron main process in `electron/` owns OS integration, filesystem access, networking, launcher execution, updater behavior, and persistent state under Electron `userData`.
- The preload layer in `electron/preload.ts` exposes typed APIs through `contextBridge`, both as the preferred namespaced `window.api` surface and as legacy globals like `window.launcher`, `window.modpacks`, and `window.account`.
- The renderer in `src/` is a React 19 + Vite app. It mostly talks to Electron through `src/services/ipc/*.ts`, but some newer and older UI paths still call `window.*` directly.
- Shared contracts and data types live in `shared/contracts/` and `shared/types/`, imported through the Vite alias `@shared` configured in `vite.config.ts`.

The dominant architectural style is "layered Electron app with domain service clusters", not a pure feature-sliced frontend and not a full hexagonal backend. The main process is the real application core; the renderer is mostly an orchestrating UI shell around those services.

## Entry Points And Boot Sequence

### Main process boot

The Electron executable enters through `electron/main.ts`, which immediately calls `bootstrapMain()` from `electron/app/bootstrap.ts`.

`electron/app/bootstrap.ts` performs the real startup sequence:

1. Sets application identity with `app.setName('.fmcl')` and `app.setAppUserModelId('com.friendlauncher.app')`.
2. Resolves runtime paths and build output layout through `configureAppRoot()` and `resolveRuntimePaths()`.
3. Configures multi-instance behavior in `configureMultiInstanceSupport()`.
4. Registers lifecycle hooks from `electron/app/lifecycle.ts`.
5. On `app.whenReady()`, optionally runs the embedded installation test harness from `electron/app/fullInstallationTest.ts`.
6. Starts the local permissive Yggdrasil mock in `electron/auth/server.ts`.
7. Creates the main browser window through `electron/window/windowManager.ts`.
8. Creates the tray integration through `electron/tray/trayManager.ts`.
9. Instantiates long-lived domain services such as `AccountService`, `MirrorsService`, `StatisticsService`, `ModpackService`, `NetworkService`, `ShareService`, and `LauncherManager`.
10. Registers IPC handlers through `electron/ipc/ipcManager.ts`.
11. Registers ad hoc console-window handlers for `window:openConsole` and `window:closeConsole`.

This is the composition root of the application. The dependency graph is assembled here rather than through a DI container.

### Renderer boot

The renderer enters through `src/main.tsx`, which mounts:

- `ErrorBoundary` from `src/components/ErrorBoundary.tsx`
- `AppProviders` from `src/app/providers.tsx`
- `App` from `src/App.tsx`

`src/app/providers.tsx` composes the global React context stack in this order:

1. `SettingsProvider` from `src/contexts/SettingsContext.tsx`
2. `ModpackProvider` from `src/contexts/ModpackContext.tsx`
3. `ToastProvider` from `src/contexts/ToastContext.tsx`
4. `ConfirmProvider` from `src/contexts/ConfirmContext.tsx`

`src/App.tsx` chooses between the main UI and the standalone console window by checking `window.location.hash === '#console'`. The real shell is `src/components/AppLayout.tsx`.

## Process Boundaries

### Main process boundary

The main process owns all privileged work:

- Launcher orchestration in `electron/services/launcher/orchestrator.ts`
- Java discovery/provisioning in `electron/services/java/*.ts`
- Runtime downloads and vanilla installation in `electron/services/runtime/*.ts`
- Modpack and instance filesystem management in `electron/services/instances/*.ts` and `electron/services/modpacks/*.ts`
- Multiplayer networking in `electron/services/network/*.ts`
- Mod and modpack platform integration in `electron/services/mods/platform/*.ts`
- Settings file dialogs and OS window controls through IPC handlers in `electron/ipc/handlers/*.ts`
- Account persistence in `electron/services/account/accountService.ts`
- Mirror persistence and speed selection in `electron/services/mirrors/mirrorsService.ts`
- Statistics persistence in `electron/services/stats/statisticsService.ts`
- Share-code generation/import in `electron/services/sharing/shareService.ts`

### Preload boundary

`electron/preload.ts` is the only intended bridge between the unprivileged renderer and the main process. It assembles domain-specific bridge modules from `electron/preload/bridges/*.ts` and exposes them as:

- `window.api.<domain>` for new code
- legacy global aliases such as `window.launcher`, `window.modpacks`, `window.networkAPI`, `window.windowControls`, `window.account`, and `window.share`

The preload surface is typed by `shared/contracts/windowApi.ts` and individual files under `shared/contracts/`.

### Renderer boundary

The renderer is mostly structured as:

- UI components in `src/components/`
- feature hooks and small service modules in `src/features/`
- global state and persistence in `src/contexts/`
- typed preload wrappers in `src/services/ipc/`

This boundary is mostly respected, but not uniformly. Examples of direct preload access still present in the renderer:

- `src/features/accounts/AccountsPage.tsx` calls `window.account.*`
- `src/features/share/ShareModal.tsx` calls `window.api.share.generateCode(...)`
- `src/contexts/SettingsContext.tsx` calls `window.windowControls?.openConsole()` and `window.windowControls?.closeConsole()`

So the repo is in the middle of a migration toward the wrapper-based `src/services/ipc/` access pattern, not fully there yet.

## IPC And Contract Flow

The IPC flow is consistent across most domains:

1. Shared API shape is defined in `shared/contracts/*.ts`.
2. Allowed channel names are enumerated in `shared/contracts/ipcChannels.ts`.
3. Preload bridges in `electron/preload/bridges/*.ts` turn typed API methods into `ipcRenderer.invoke(...)` and event subscriptions.
4. Renderer wrappers in `src/services/ipc/*.ts` provide convenience methods plus `toIpcError(...)` normalization.
5. Main-process handlers in `electron/ipc/handlers/*Handlers.ts` bind channel names to service methods.
6. `electron/ipc/ipcManager.ts` is the central registration hub that wires handlers into the app.

The main design intent is that handlers stay thin and domain logic lives in services. `electron/ipc/handlers/launcherHandlers.ts` is a good example of this: it only translates IPC events into calls on `LauncherManager`.

## Core Data Flows

### Launch flow

The launcher path is one of the clearest end-to-end flows:

- UI state is assembled by `src/features/launch/hooks/useLaunchState.ts` and `src/features/launcher/hooks/useLauncher.ts`.
- `useLauncher()` calls `launcherIPC.launch(...)` from `src/services/ipc/launcherIPC.ts`.
- `launcherIPC` resolves the namespaced or legacy preload API.
- `electron/preload/bridges/LauncherBridge.ts` forwards the call to IPC.
- `electron/ipc/handlers/launcherHandlers.ts` delegates to `LauncherManager.launchGame(...)`.
- `electron/services/launcher/orchestrator.ts` coordinates:
  - launch context preparation via `electron/services/launcher/preLaunchSetup.ts`
  - Java resolution via `electron/services/launcher/launchFlow/resolveJavaPath.ts`
  - vanilla installation via `electron/services/runtime/vanillaService.ts`
  - modloader installation via `electron/services/launcher/modLoaderInstaller.ts`
  - auth injector preparation via `ensureAuthInjector(...)`
  - process spawn via `electron/services/launcher/launchFlow/spawnMinecraft.ts`

Progress and logs travel back in the opposite direction:

- `LauncherManager` emits callbacks
- `launcherHandlers` forwards events with `window.webContents.send(...)`
- `LauncherBridge` subscribes to `launcher:log`, `launcher:progress`, and `launcher:close`
- `useLauncherIPC()` in `src/features/launcher/hooks/useLauncherIPC.ts` updates React state

### Modpack and instance flow

The renderer-facing concept is "modpacks", but the filesystem layer still carries older "instance" naming in several directories and APIs.

- Global modpack state lives in `src/contexts/ModpackContext.tsx`.
- That context is implemented from several instance-specific helper hooks under `src/contexts/instances/hooks/`.
- The context talks to Electron through `src/contexts/instances/services/instancesService.ts`, which itself delegates to `src/services/ipc/modpacksIPC.ts`.
- `modpacksIPC` calls preload methods from `electron/preload/bridges/ModpacksBridge.ts`.
- Main-side IPC is registered in `electron/ipc/handlers/modpacksHandlers.ts`.
- Basic filesystem layout and migration live in `electron/services/instances/instanceService.ts`, `configStore.ts`, `indexStore.ts`, and `paths.ts`.
- Richer modpack behavior such as metadata, import/export, manifest creation, and deduplicated content management lives in `electron/services/modpacks/modpackService.ts` and helpers under `electron/services/modpacks/`.

This is a real architectural seam: low-level storage is still under `electron/services/instances/`, while higher-level product behavior has moved into `electron/services/modpacks/`.

### Multiplayer flow

Multiplayer uses a similar IPC path, but its core logic is split between two networking models:

- Renderer UI logic lives in `src/features/multiplayer/hooks/useMultiplayer.ts`.
- Transport calls go through `src/services/ipc/networkIPC.ts`.
- Preload wiring lives in `electron/preload/bridges/NetworkBridge.ts`.
- Main-process binding lives in `electron/ipc/handlers/networkHandlers.ts`.
- `electron/services/network/networkService.ts` is the domain facade.

`NetworkService` wraps two capabilities:

- `NetworkManager` in `electron/services/network/networkManager.ts` for Hyperswarm-based room-code tunnels
- XMCL LAN discovery, ping, and optional UPnP mapped directly inside `NetworkService`

So the multiplayer architecture is not a single protocol stack. It is a facade over multiple connectivity strategies chosen by per-modpack `networkMode`.

### Account, share, and statistics flow

Several smaller domains follow the same pattern:

- `AccountService` in `electron/services/account/accountService.ts` persists `accounts.json` and refreshes third-party Yggdrasil tokens.
- `ShareService` in `electron/services/sharing/shareService.ts` compresses a minimized manifest into `fmcl://share/v1/...` codes and reconstructs import manifests.
- `StatisticsService` in `electron/services/stats/statisticsService.ts` persists `statistics.json` and is called from `LauncherManager` when sessions start and end.

These domains are small, stateful main-process services rather than reusable library modules.

## Persistence Model

The application uses two distinct persistence layers.

### Renderer-managed persistence

Pure UI preferences live in browser storage through `src/contexts/SettingsContext.tsx` and helpers in `src/contexts/settings/persistence.ts`.

Examples:

- language and theme
- accent and custom theme settings
- UI mode (`simple` vs `modpacks`)
- window console preference
- download thread controls
- local UI affordances such as compact mode and sidebar position

Some feature-specific renderer persistence also exists:

- `src/features/launch/services/launchPersistence.ts`
- `src/features/launch/services/lastGame.ts`
- `src/features/multiplayer/services/multiplayerPersistence.ts`

### Main-process persistence

User and game state lives under Electron `userData` and related game roots:

- accounts in `accounts.json` via `electron/services/account/accountService.ts`
- mirrors in `mirrors.json` via `electron/services/mirrors/mirrorsService.ts`
- statistics in `statistics.json` via `electron/services/stats/statisticsService.ts`
- modpack index/config files via `electron/services/instances/indexStore.ts` and `configStore.ts`
- per-instance mod manifests via `electron/services/instances/manifestManager.ts`
- shared content dedupe store via `electron/services/content/contentManager.ts`

This split matters architecturally: the renderer can rebuild UI preferences from `localStorage`, but modpack/account/runtime state is owned by the main process and survives independently of renderer state shape.

## Key Abstractions

The most important application-level abstractions are:

- `LauncherManager` in `electron/services/launcher/orchestrator.ts`: orchestrates the end-to-end launch lifecycle.
- `ModpackService` in `electron/services/modpacks/modpackService.ts`: product-level modpack operations, layered on top of the lower-level `electron/services/instances/instanceService.ts`.
- `NetworkService` in `electron/services/network/networkService.ts`: multiplayer/network facade over Hyperswarm and XMCL utilities.
- `IPCManager` in `electron/ipc/ipcManager.ts`: centralized registration of domain handlers.
- `AppProviders` in `src/app/providers.tsx`: renderer composition root for React contexts.
- `SettingsProvider` and `ModpackProvider` in `src/contexts/`: the two most important global state providers in the renderer.

## Build-Time Architecture

The build is configured in `vite.config.ts` using `vite-plugin-electron/simple`:

- `electron/main.ts` is built as the Electron main bundle
- `electron/preload.ts` is built as a CommonJS preload bundle
- `src/main.tsx` is built as the renderer bundle

`package.json` declares:

- `"main": "dist-electron/main.js"`
- `"build": "tsc && vite build && electron-builder"`

Static runtime assets are split between:

- `public/` for app icons used by the window layer
- `resources/authlib-injector.jar` for the auth-injector runtime dependency

## Architectural Characteristics And Caveats

Several traits are important when reasoning about future changes:

- The codebase is in a migration from "instances" terminology to "modpacks". Both names are still first-class in files like `electron/services/instances/instanceService.ts`, `src/contexts/instances/*`, and legacy aliases in `electron/preload/bridges/LauncherBridge.ts`.
- The renderer organization is mixed. Full pages still live in `src/components/` alongside reusable UI primitives, while `src/features/` mostly contains hooks and small service helpers.
- Shared contracts are centralized, but legacy globals are intentionally retained for backward compatibility.
- The main process is stateful. Service singletons created in `bootstrapMain()` are effectively application-scoped and hold live in-memory state in addition to persisted JSON files.
- `electron/ipc/handlers/modpacksHandlers.ts` is currently a large, mixed-responsibility handler module that combines CRUD, import/export, metadata, and remote marketplace operations.
- There is some type duplication across `shared/types/` and `src/shared/types/`, so "shared" in this repo is not exclusively one canonical module tree.

In practice, FriendLauncher behaves like an Electron monolith with a typed IPC facade, not like two independently deployable applications.
