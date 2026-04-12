# Technology Stack

## Runtime Shape

- Desktop application built as an Electron app with a React renderer and a preload bridge.
- `package.json` sets `"type": "module"` and `"main": "dist-electron/main.js"`, so the repo is ESM-first for app code.
- The runtime is explicitly split into:
  - Electron main process in `electron/`
  - preload bridge in `electron/preload.ts` and `electron/preload/bridges/*`
  - renderer in `src/`
  - shared contracts/types in `shared/`

## Languages And Module Layout

- Primary language is TypeScript across `src/`, `electron/`, and `shared/`.
- UI code uses TSX in files like `src/App.tsx`, `src/components/**/*.tsx`, and `src/features/**/*.tsx`.
- Node/Electron code stays in `.ts` files such as `electron/app/bootstrap.ts`, `electron/services/**/*`, and `electron/ipc/**/*`.
- Shared type/contracts layer lives in `shared/contracts/*` and `shared/types/*`.
- Path alias `@shared/*` is configured in `tsconfig.json` and `vite.config.ts`.

## TypeScript Configuration

- `tsconfig.json` runs in strict mode with:
  - `"strict": true`
  - `"noUnusedLocals": true`
  - `"noUnusedParameters": true`
  - `"noFallthroughCasesInSwitch": true`
  - `"jsx": "react-jsx"`
  - `"moduleResolution": "bundler"`
  - `"noEmit": true`
- `tsconfig.node.json` is used for Vite/node-side config typing and enables `"composite": true`.
- The repo is written to compile without emitting JS from `tsc`; bundling is delegated to Vite and Electron build tooling.

## Renderer Stack

- React 19 is used in `src/main.tsx` and `src/App.tsx`.
- Rendering uses `ReactDOM.createRoot(...)` with `React.StrictMode` in `src/main.tsx`.
- There is no routing library in `package.json`.
  - View switching is handled by app state and a simple hash check in `src/App.tsx` (`#console` opens the console window UI).
- State management is mostly React Context plus hooks:
  - `src/app/providers.tsx`
  - `src/contexts/SettingsContext.tsx`
  - `src/contexts/ModpackContext.tsx`
  - `src/contexts/ToastContext.tsx`
  - `src/contexts/ConfirmContext.tsx`
- Renderer code is intentionally isolated from Node/Electron internals.
  - `eslint.config.js` forbids `src/**/*` from importing `electron`, `fs`, `path`, `child_process`, `net`, etc.
  - UI is expected to call `src/services/ipc/*` wrappers instead of touching `window.ipcRenderer` directly.

## UI, Styling, And Frontend Libraries

- Styling uses Tailwind CSS v4 via:
  - `tailwind.config.js`
  - `postcss.config.js`
  - `src/index.css`
- `src/index.css` uses the new Tailwind v4 style:
  - `@import "tailwindcss";`
  - `@config "../tailwind.config.js";`
- Themeing is CSS-variable driven, with light/dark theme tokens defined in `src/index.css`.
- Tailwind config safelists preset accent classes and maps semantic colors to CSS variables in `tailwind.config.js`.
- Frontend/UI packages in `package.json` include:
  - `react`
  - `react-dom`
  - `lucide-react`
  - `react-virtuoso`
  - `@tsparticles/react`
  - `@tsparticles/slim`
  - `clsx`
  - `tailwind-merge`

## Localization

- Localization is in-repo and JSON-based, not handled by an external i18n framework.
- Translation sources live in:
  - `src/locales/en.json`
  - `src/locales/ru.json`
- Translation lookup is implemented by `src/contexts/settings/i18n.ts`.
- `src/contexts/SettingsContext.tsx` creates the translator and exposes `t(...)` via context.

## Electron/Main-Process Stack

- Main process bootstrap starts in `electron/main.ts` and delegates to `electron/app/bootstrap.ts`.
- `electron/app/bootstrap.ts` wires:
  - app lifecycle
  - BrowserWindow creation
  - tray integration
  - local auth server
  - updater
  - IPC registration
  - launcher/modpack/network/account/mirror/statistics/share services
- Browser windows are configured in `electron/window/windowManager.ts`.
  - `contextIsolation: true`
  - `nodeIntegration: false`
  - `webSecurity: true`
  - popups and unexpected navigation are redirected to the OS browser with `shell.openExternal(...)`
- System tray integration is implemented in `electron/tray/trayManager.ts`.

## Preload And IPC Architecture

- Preload aggregation happens in `electron/preload.ts`.
- Domain-specific preload bridges live in `electron/preload/bridges/*Bridge.ts`.
- The preferred renderer API surface is `window.api`, typed by `shared/contracts/windowApi.ts`.
- Legacy global aliases are still exposed for compatibility in `electron/preload.ts`.
- Central IPC registration is in `electron/ipc/ipcManager.ts`.
- Typed IPC channel contracts live in `shared/contracts/*` and `shared/contracts/ipcChannels.ts`.
- Renderer-side IPC wrappers live in `src/services/ipc/*`.

## Minecraft Runtime And Launcher Libraries

- Minecraft install/launch logic relies heavily on the XMCL ecosystem:
  - `@xmcl/core`
  - `@xmcl/client`
  - `@xmcl/installer`
  - `@xmcl/file-transfer`
  - `@xmcl/task`
  - `@xmcl/user`
  - `@xmcl/modrinth`
  - `@xmcl/curseforge`
  - `@xmcl/mod-parser`
  - `@xmcl/nat-api`
- The launch orchestrator is `electron/services/launcher/orchestrator.ts`.
- Game process spawning uses `@xmcl/core` in `electron/services/launcher/launchFlow/spawnMinecraft.ts`.
- Java detection and provisioning are handled by:
  - `electron/services/java/discovery.ts`
  - `electron/services/java/provisioning.ts`
  - `electron/services/java/validation.ts`
- Required Java major versions are resolved from Minecraft version rules in `electron/services/launcher/launchFlow/requiredJava.ts`.

## Downloading, Mirrors, And Content Storage

- HTTP and download orchestration is custom and lives in:
  - `electron/services/runtime/http.ts`
  - `electron/services/runtime/downloadService.ts`
  - `electron/services/download/downloadManager.ts`
  - `electron/services/download/*`
- `undici` is the HTTP client foundation for custom dispatchers and retry/redirect interceptors.
- `@xmcl/file-transfer` is used for ranged downloads and checksum-aware installers.
- The download layer includes:
  - mirror candidate injection
  - mirror scoring/blacklisting
  - ETag caching
  - stalled-download detection
  - HTML challenge detection
  - ZIP integrity validation
- Shared asset/content deduplication is implemented by `electron/services/content/contentManager.ts`.
  - Files are stored under a sharded `content-store`
  - hard links are used when possible
  - copy fallback is used if hard linking fails

## Multiplayer / Networking Stack

- FriendTunnel/P2P networking is built on:
  - `hyperswarm`
  - `b4a`
  - `pump`
  - Node `net`
- Core P2P orchestration is in:
  - `electron/services/network/networkManager.ts`
  - `electron/services/network/hostPeer.ts`
  - `electron/services/network/joinPeer.ts`
  - `electron/services/network/muxer.ts`
- `electron/services/network/networkService.ts` also layers XMCL features on top:
  - LAN discovery via `MinecraftLanDiscover` from `@xmcl/client`
  - ping/status checks via `queryStatus` from `@xmcl/client`
  - UPnP port mapping via `@xmcl/nat-api`

## Persistence Model

- Electron-side persistent state is filesystem-based under `app.getPath('userData')`.
- Notable stored files/directories:
  - `minecraft_data` root from `electron/services/instances/paths.ts`
  - `runtime` for provisioned Java from `electron/services/java/provisioning.ts`
  - `content-store` from `electron/services/content/contentManager.ts`
  - `accounts.json` from `electron/services/account/accountService.ts`
  - `mirrors.json` from `electron/services/mirrors/mirrorsService.ts`
- Renderer settings persistence is browser storage based, implemented by `src/contexts/settings/persistence.ts` and used in `src/contexts/SettingsContext.tsx`.

## Build And Packaging Tooling

- Vite is the frontend and Electron bundler entry point in `vite.config.ts`.
- Plugins in use:
  - `@vitejs/plugin-react`
  - `vite-plugin-electron`
  - `vite-plugin-electron-renderer`
- `vite.config.ts` externalizes Electron and package dependencies from the main/preload bundles.
- Preload is emitted as CommonJS (`preload.cjs`) from the Vite build config.
- Production packaging is handled by `electron-builder` with config in `electron-builder.json5`.
- Packaging targets configured:
  - macOS `dmg`
  - Windows `nsis` (`x64`)
  - Linux `AppImage`
- Extra packaged resources include:
  - `resources/authlib-injector.jar`
  - `public/icon.png`

## Quality Gates And Repository Tooling

- ESLint uses flat config in `eslint.config.js`.
- The lint setup includes:
  - `@eslint/js`
  - `@typescript-eslint/*`
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-react-refresh`
- Repo-specific architecture guardrails are encoded in ESLint:
  - renderer cannot import Node/Electron runtime modules
  - `electron/services/*` cannot depend on IPC/preload wiring
- Additional custom checks:
  - `scripts/check-contracts.cjs`
  - `scripts/check-ipc-handlers.cjs`
- CI is GitHub Actions based:
  - `.github/workflows/ci.yml`
  - `.github/workflows/release.yml`

## Testing State

- There is a custom full-install smoke harness in:
  - `scripts/test-full.js`
  - `electron/app/fullInstallationTest.ts`
  - `electron/app/tests/*`
- This harness validates installation flows for vanilla, Forge, Fabric, and NeoForge.
- There is no test runner dependency such as Vitest or Jest in `package.json` at the moment.
- CI currently runs lint, typecheck, contracts checks, IPC checks, and a production build in `.github/workflows/ci.yml`.

## Notable Omissions

- No backend service, database, or cloud API owned by this repo was found.
- No React Router, Redux, Zustand, or TanStack Query dependency is present in `package.json`.
- No unit/integration browser test framework is currently wired in `package.json`.
