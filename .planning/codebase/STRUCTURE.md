# FriendLauncher Repository Structure

## Top-Level Layout

The repository is organized around the Electron runtime split, then further divided by domain. The top-level directories map to responsibilities like this:

- `electron/`: Electron main-process code, preload bridges, IPC registration, service implementations, tray/window setup, and embedded installation tests.
- `src/`: React renderer code, including app composition, contexts, page components, feature hooks, IPC wrappers, localization, and UI utilities.
- `shared/`: contracts and types shared between main, preload, and renderer bundles through the `@shared` alias.
- `docs/`: English and Russian project documentation, including architecture, contracts, coding conventions, and roadmap files.
- `scripts/`: project maintenance scripts for release, contract checking, IPC checking, serving, and full-install test execution.
- `public/`: renderer-visible static assets, currently app icons.
- `resources/`: packaged runtime artifacts needed by the launcher, notably `resources/authlib-injector.jar`.
- `.planning/codebase/`: generated codebase mapping output.

The structure is mostly layered by runtime and then by domain. The renderer side is not fully feature-sliced, and the main side is not split into strict adapters/core packages.

## `electron/` Main-Process Structure

### Boot and app wiring

- `electron/main.ts`: Electron entrypoint that calls `bootstrapMain()`.
- `electron/app/bootstrap.ts`: composition root that creates windows, tray, services, auth server, and IPC bindings.
- `electron/app/lifecycle.ts`: app-level lifecycle hooks for macOS activation and non-macOS shutdown.
- `electron/app/fullInstallationTest.ts`: production-like installation smoke-test runner.
- `electron/app/tests/`: helpers for the embedded full-install validation flow.

This subtree is where process-level startup and shutdown behavior lives.

### Windowing and shell integration

- `electron/window/windowManager.ts`: creates the frameless main window and the separate console window.
- `electron/tray/trayManager.ts`: tray icon and tray menu behavior.
- `electron/auth/server.ts`: local permissive Yggdrasil mock server used with `authlib-injector`.

These files are Electron-shell specific and should stay out of renderer code.

### IPC layer

- `electron/ipc/ipcManager.ts`: centralized registration of all domain handlers.
- `electron/ipc/logThrottler.ts`: throttles launcher log forwarding to the renderer.
- `electron/ipc/handlers/`: one handler module per major domain, such as:
  - `launcherHandlers.ts`
  - `modpacksHandlers.ts`
  - `networkHandlers.ts`
  - `settingsHandlers.ts`
  - `accountHandlers.ts`
  - `statisticsHandlers.ts`
  - `shareHandlers.ts`

This layer is intentionally thin. It binds channel names to services but should not contain long-lived business rules.

### Preload layer

- `electron/preload.ts`: aggregates bridge modules and exposes `window.api` plus legacy globals.
- `electron/preload/bridges/`: one bridge module per exposed domain, such as:
  - `LauncherBridge.ts`
  - `ModpacksBridge.ts`
  - `NetworkBridge.ts`
  - `SettingsBridge.ts`
  - `WindowControlsBridge.ts`
  - `AccountBridge.ts`
  - `ShareBridge.ts`

This directory is the only intended renderer-facing boundary for privileged code.

### Domain services

`electron/services/` contains the actual application logic. The subdirectories are meaningful and worth navigating by domain:

- `electron/services/launcher/`: launch orchestration, modloader installation, spawn logic, version selection, Forge compatibility fixes, and launch-flow helpers.
- `electron/services/runtime/`: lower-level runtime download/install helpers such as `downloadService.ts`, `taskRunner.ts`, and `vanillaService.ts`.
- `electron/services/java/`: Java discovery, validation, executable resolution, and provisioning.
- `electron/services/network/`: P2P networking, Hyperswarm integration, XMCL LAN discovery, and UPnP utilities.
- `electron/services/instances/`: low-level "instance" storage layout, config/index persistence, import/export support, and manifest tracking.
- `electron/services/modpacks/`: higher-level modpack CRUD, metadata, search/install/export/import flows, and marketplace integration.
- `electron/services/mods/`: installed-mod scanning and marketplace operations.
- `electron/services/mods/platform/`: CurseForge/Modrinth-specific helpers and loader mapping.
- `electron/services/download/`: reusable download manager, ETag cache, progress monitoring, HTML challenge detection, and ZIP validation.
- `electron/services/content/`: deduplicated content-store management for modpack assets.
- `electron/services/account/`: account persistence plus Yggdrasil authentication/refresh behavior.
- `electron/services/mirrors/`: mirror selection, persistence, latency testing, and scoring.
- `electron/services/stats/`: launch/play-time statistics persistence.
- `electron/services/sharing/`: modpack share-code generation and import resolution.
- `electron/services/resourcePacks/`, `shaders/`, `worlds/`, `screenshots/`, `updater/`, `versions/`: smaller domain services exposed to the UI.

This is the real "backend" of the application.

### Other Electron support code

- `electron/utils/`: low-level utilities such as `undiciPatcher.ts`.
- `electron/shared/types.ts`: convenience re-export layer around `@shared/types`.
- `electron/declarations/` and `electron/declarations.d.ts`: ambient typings for third-party modules used in the main process.
- `electron/electron-env.d.ts`: Electron-specific type declarations.

## `src/` Renderer Structure

### App shell

- `src/main.tsx`: renderer entrypoint.
- `src/App.tsx`: root app switch between the main app and the console window route.
- `src/app/providers.tsx`: context composition root.
- `src/app/hooks/`: app-level hooks such as `useAppOverlays.ts`, `useLaunchHandler.ts`, `useOnboarding.ts`, and `useAppIcon.ts`.

This is the renderer boot chain.

### Context and global state

- `src/contexts/SettingsContext.tsx`: global UI preferences, theme, language, download controls, and launcher console visibility.
- `src/contexts/ModpackContext.tsx`: selected modpack state, config patching, CRUD, and bootstrap logic.
- `src/contexts/ToastContext.tsx` and `ConfirmContext.tsx`: global UI helpers.
- `src/contexts/settings/`: settings persistence and theming helpers.
- `src/contexts/instances/`: support modules used by `ModpackContext`, including hooks, services, types, and config-patching helpers.

Important nuance: the folder name `instances` remains even though the product-facing concept is now `modpacks`.

### Components and pages

`src/components/` mixes reusable UI and full application screens. It is not a purely presentational directory.

Examples of top-level pages and layout shells:

- `src/components/AppLayout.tsx`
- `src/components/Sidebar.tsx`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/SettingsPage.tsx`
- `src/components/MultiplayerPage.tsx`
- `src/components/ConsoleWindow.tsx`

Subdirectories add some organization:

- `src/components/layout/`: layout building blocks like `BackgroundLayer.tsx` and `ConsoleView.tsx`
- `src/components/sidebar/`: sidebar-specific sections such as nickname, version, modloader, and launch controls
- `src/components/settings/`: settings tabs and utilities
- `src/components/modpacks/`: modpack browser, install/export/import flows, creation wizard, and detail tabs
- `src/components/onboarding/`: welcome and guided-tour UI
- `src/components/ui/`: reusable primitives like `Button.tsx`, `Modal.tsx`, `Input.tsx`, and `Toast.tsx`

In practice, `src/components/` is both the page layer and the shared-component layer.

### Feature directories

`src/features/` is used for domain-specific hooks, small service helpers, and feature-local components:

- `src/features/launcher/`: launcher hooks, launcher-state helpers, and launch progress wiring
- `src/features/launch/`: launch-state derivation, persistence, validation, and network/offline awareness
- `src/features/modpacks/`: modpack-specific hooks such as navigation and update detection
- `src/features/multiplayer/`: multiplayer hook and persistence helpers
- `src/features/accounts/`: account management UI
- `src/features/settings/`: settings subfeatures like mirrors and statistics tabs
- `src/features/share/`: share/import modal flows
- `src/features/screenshots/`: screenshots UI
- `src/features/updater/`: launcher-update hooks
- `src/features/console/`: console page entry

The repo uses `features/` mainly for domain hooks and targeted UI, while many high-level pages still remain in `components/`.

### Renderer service layer

- `src/services/ipc/`: typed wrappers around preload APIs, with availability checks and normalized error handling.
- `src/services/versions/`: pure renderer-side version helpers and cache logic.

`src/services/ipc/` is the preferred call path from UI to Electron, but not every feature uses it consistently yet.

### Supporting renderer modules

- `src/hooks/`: generic hooks not tied to one feature.
- `src/utils/`: formatting, class-name, version-hint, and list helpers.
- `src/locales/en.json` and `src/locales/ru.json`: user-facing string catalogs.
- `src/shared/types/`: renderer-local shared types, including duplicated account type definitions.
- `src/index.css` and `src/App.css`: global styling.

## `shared/` Cross-Process Contracts

This directory is the canonical shared API surface between runtime layers.

### Contracts

- `shared/contracts/windowApi.ts`: typed shape of the namespaced preload surface.
- `shared/contracts/ipcChannels.ts`: channel allowlist and channel-name source of truth.
- `shared/contracts/*.ts`: per-domain interfaces for launcher, modpacks, network, settings, updater, account, mirrors, statistics, and share functionality.

### Shared types

- `shared/types/modpack.ts`: modpack manifests and metadata
- `shared/types/mods.ts`: mod records
- `shared/types/minecraft.ts`: launcher/version metadata
- `shared/types/account.ts`: account data model
- `shared/types/statistics.ts`: statistics model
- `shared/types/download.ts`, `resourcePack.ts`, `mirrors.ts`, `task.ts`: domain support types

### Shared constants

- `shared/constants.ts`: cross-process constants like `CLASSIC_MODPACK_ID`, HTTP defaults, and download tuning values.

## `docs/` Documentation Layout

The documentation tree is bilingual:

- `docs/en/`: English docs
- `docs/ru/`: Russian docs

Both language trees contain parallel topics such as:

- `architecture.md`
- `contracts.md`
- `contracts-map.md`
- `development.md`
- `testing.md`
- `design-system.md`
- `roadmap.md`

There is also a repo-wide `docs/KNOWN_ISSUES.md`.

## `scripts/`, `public/`, and `resources/`

### Scripts

The `scripts/` directory contains operational tooling rather than runtime code:

- `scripts/check-contracts.cjs`: validates contract consistency
- `scripts/check-ipc-handlers.cjs`: validates IPC handler coverage
- `scripts/test-full.js`: runs the installation smoke-test flow
- `scripts/release.js`: release automation
- `scripts/postinstall-fix-xmcl-bytebuffer.cjs`: dependency patching after install
- `scripts/builder.js` and `scripts/serve.js`: build/serve support

### Public assets

- `public/icon.png`
- `public/icon.ico`

These are consumed by `electron/window/windowManager.ts` for window and taskbar icons.

### Packaged runtime resources

- `resources/authlib-injector.jar`

This JAR is part of the actual launcher runtime and is used when building auth-injected Minecraft launches.

## Real Organizational Patterns To Keep In Mind

The directory names alone can be misleading unless you account for the project history:

- `instances` and `modpacks` coexist. Storage/layout helpers are still under `electron/services/instances/` and `src/contexts/instances/`, while richer product workflows live under `electron/services/modpacks/` and `src/components/modpacks/`.
- `components` contains page-level code, not just reusable UI.
- `features` is additive rather than exclusive; it does not own every screen end to end.
- `shared/` is the main canonical cross-process shared tree, but `src/shared/types/` still exists for renderer-local duplication.
- New code is expected to prefer `window.api.*` and `src/services/ipc/*`, but legacy direct globals are still present in active renderer code.

## Practical Navigation Guide

If you need to change a specific product area, these are the most useful entry directories:

- Launching Minecraft: `src/features/launcher/`, `src/features/launch/`, `electron/services/launcher/`, `electron/services/runtime/`, `electron/services/java/`
- Modpack CRUD and metadata: `src/contexts/ModpackContext.tsx`, `src/components/modpacks/`, `electron/services/modpacks/`, `electron/services/instances/`
- Multiplayer and LAN/P2P: `src/features/multiplayer/`, `src/components/MultiplayerPage.tsx`, `electron/services/network/`
- Accounts and authentication: `src/features/accounts/`, `electron/services/account/`, `electron/auth/`
- Updates and mirrors: `src/features/updater/`, `src/features/settings/mirrors/`, `electron/services/updater/`, `electron/services/mirrors/`
- Shared API changes: `shared/contracts/`, `electron/preload/bridges/`, `electron/ipc/handlers/`, `src/services/ipc/`, plus `docs/en/contracts-map.md` and `docs/ru/contracts-map.md`

The safest mental model is: start from the renderer entrypoint that triggers a behavior, then follow the corresponding IPC wrapper, preload bridge, handler, and main-process service.
