# Coding Conventions and Quality Patterns

## Scope

This note maps the conventions that are both documented and actually visible in the current FMCL codebase. It focuses on the React renderer in `src/`, the Electron main/preload layers in `electron/`, the shared contract layer in `shared/`, and the repo-level quality tooling in `package.json`, `tsconfig.json`, `eslint.config.js`, and the docs under `docs/`.

## Documented Rules

The strongest written conventions live in `docs/en/code-style.md`, `docs/en/architecture.md`, `docs/en/contracts.md`, `docs/en/development.md`, and the repo AGENTS instructions.

- TypeScript is expected to run in strict mode and avoid `any`; public APIs should be typed through `shared/contracts/*`, `src/vite-env.d.ts`, and `src/services/ipc/*`.
- Renderer code in `src/` is not supposed to import Electron or Node modules directly; `eslint.config.js` enforces this with `no-restricted-imports`.
- Renderer code is supposed to prefer typed wrappers in `src/services/ipc/*` rather than raw `window.*` or `window.ipcRenderer`.
- Electron IPC is meant to stay thin and centralized via `electron/ipc/ipcManager.ts`, handler files in `electron/ipc/handlers/*`, and preload bridges in `electron/preload.ts` plus `electron/preload/bridges/*`.
- User-facing strings are supposed to go through `t('...')` and exist in both `src/locales/en.json` and `src/locales/ru.json`.
- IPC and preload changes are expected to update `docs/en/contracts-map.md`, `docs/ru/contracts-map.md`, and `src/vite-env.d.ts`.

## Layering and Dependency Direction

Observed practice mostly matches the intended architecture.

- Main-process bootstrap and service construction live in `electron/app/bootstrap.ts`; this file wires `AccountService`, `ModpackService`, `NetworkService`, `MirrorsService`, `StatisticsService`, and `ShareService`.
- IPC registration is centralized in `electron/ipc/ipcManager.ts`, which delegates to domain handlers such as `electron/ipc/handlers/modpacksHandlers.ts` and `electron/ipc/handlers/accountHandlers.ts`.
- Preload exposure is centralized in `electron/preload.ts`, which publishes both legacy globals like `window.launcher` and the preferred namespaced API `window.api`.
- The renderer generally consumes domain actions through wrappers such as `src/services/ipc/appUpdaterIPC.ts`, `src/services/ipc/launcherIPC.ts`, and `src/services/ipc/modpacksIPC.ts`.
- Shared type contracts are concentrated under `shared/contracts/*` and `shared/types/*`, with `shared/contracts/windowApi.ts` defining the preferred `window.api` surface.

The main drift is naming history rather than broken architecture.

- The renderer and docs use “modpacks”, but several persistence/service files still live under `src/contexts/instances/*` and `electron/services/instances/*`.
- `electron/services/modpacks/modpackService.ts` extends `electron/services/instances/instanceService.ts`, so “instance” and “modpack” are still overlapping concepts in the implementation.

## Naming and File Layout

Naming is fairly consistent by file role.

- React components use PascalCase file names and exports, for example `src/components/ui/Button.tsx`, `src/components/AppLayout.tsx`, and `src/features/accounts/AccountsPage.tsx`.
- Hooks use `useX` names and usually live under `hooks/`, for example `src/features/launcher/hooks/useLauncher.ts`, `src/features/multiplayer/hooks/useMultiplayer.ts`, and `src/contexts/instances/hooks/useInstanceBootstrap.ts`.
- Electron services use PascalCase classes or camelCase helpers, for example `electron/services/account/accountService.ts`, `electron/services/stats/statisticsService.ts`, and `electron/services/sharing/shareService.ts`.
- Preload bridge files use `*Bridge.ts` suffixes, for example `electron/preload/bridges/LauncherBridge.ts` and `electron/preload/bridges/WindowControlsBridge.ts`.
- Thin utility modules tend to stay in `utils/` or `services/`, for example `src/utils/cn.ts`, `src/features/launch/services/launchValidation.ts`, and `src/contexts/settings/persistence.ts`.

Observed formatting is not fully normalized.

- There is no repo formatter config such as `.prettierrc` or `.editorconfig`.
- Files in `electron/` commonly use semicolon-free style and two-space indentation, for example `electron/preload.ts` and `electron/window/windowManager.ts`.
- Files in `src/` frequently use semicolons and four-space indentation, for example `src/contexts/SettingsContext.tsx` and `src/features/accounts/AccountsPage.tsx`.
- The practical rule is “follow nearby code”, not “apply one global style”.

## React and State Management Patterns

Renderer state is organized around providers plus domain hooks.

- Top-level composition happens in `src/app/providers.tsx`, which nests `SettingsProvider`, `ModpackProvider`, `ToastProvider`, and `ConfirmProvider`.
- `src/contexts/SettingsContext.tsx` owns persistent UI state using `useLocalStorageState` from `src/contexts/settings/persistence.ts`.
- `src/contexts/ModpackContext.tsx` is the main domain state container for selected modpack/config data and delegates side effects to hooks like `src/contexts/instances/hooks/useInstanceBootstrap.ts` and `src/contexts/instances/hooks/useInstanceConfigPersistence.ts`.
- Feature hooks are used as orchestration layers, for example `src/features/launcher/hooks/useLauncher.ts`, `src/features/launcher/hooks/useLauncherIPC.ts`, and `src/features/multiplayer/hooks/useMultiplayer.ts`.
- Small pure helpers are extracted when possible, for example `src/features/launcher/services/launcherService.ts`, `src/features/launch/services/launchValidation.ts`, and `src/utils/cn.ts`.

This gives the project a recognizable pattern:

- UI components assemble props and render Tailwind-heavy markup.
- Contexts own long-lived app/domain state.
- Hooks coordinate effects and subscriptions.
- IPC wrappers and Electron services handle side effects and OS/file/network work.

## TypeScript Expectations

Type discipline is strong at the compiler level.

- `tsconfig.json` enables `strict`, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`.
- The repo uses a single alias, `@shared/*`, mapped to `shared/*`.
- Public preload and IPC surfaces are typed via `shared/contracts/*`.
- Helper types stay close to domains, for example `src/contexts/settings/types.ts`, `src/contexts/instances/types.ts`, and `electron/services/launcher/types.ts`.

Documented and observed practice diverge in one important way.

- The docs say “no `any`”, but `eslint.config.js` only sets `@typescript-eslint/no-explicit-any` to `warn`.
- Because `package.json` uses `eslint . --max-warnings 0`, those warnings still fail lint, but the repo contains explicit escapes such as `src/services/ipc/modpacksIPC.ts`, `src/services/ipc/ipcError.ts`, and `electron/app/bootstrap.ts`.
- In practice, the codebase treats `any` as disallowed debt rather than as an impossible state.

## IPC and Renderer Access Patterns

The intended convention is clear and useful.

- Preload bridges are the only safe boundary for exposing Electron capabilities, as shown in `electron/preload.ts`.
- Renderer wrappers such as `src/services/ipc/appUpdaterIPC.ts` add capability checks, standardized error decoration through `src/services/ipc/ipcError.ts`, and backward-compatible fallback handling.
- `shared/contracts/ipcChannels.ts` is the source of truth for allowed raw channels, and `scripts/check-contracts.cjs` plus `scripts/check-ipc-handlers.cjs` validate that contract surface.

Observed renderer usage still mixes abstraction levels.

- Clean wrapper usage exists in files like `src/features/launcher/hooks/useLauncher.ts` and `src/features/multiplayer/services/multiplayerService.ts`.
- Direct `window.api.*` calls still exist in UI code such as `src/features/share/ShareModal.tsx`, `src/features/share/ImportShareModal.tsx`, `src/features/settings/mirrors/MirrorsSettings.tsx`, and `src/features/settings/statistics/StatisticsTab.tsx`.
- Legacy direct globals still appear in files like `src/features/accounts/AccountsPage.tsx`, `src/features/accounts/AddAccountDialog.tsx`, and `src/services/ipc/screenshotsIPC.ts`.
- Raw `window.api.ipcRenderer.invoke(...)` still appears in `src/features/console/ConsolePage.tsx`, `src/components/modpacks/InstallModpackPage.tsx`, and `src/components/modpacks/InstallModpackModal.tsx`.

The architecture guardrails exist, but the migration to wrapper-only renderer access is incomplete.

## Error Handling Conventions

There is a recurring pattern, but not a single global strategy.

- IPC wrappers catch unknown failures, convert them via `toIpcError`, log to `console.error`, and rethrow, as in `src/services/ipc/appUpdaterIPC.ts` and `src/services/ipc/modpacksIPC.ts`.
- Feature hooks usually map failures into local state and status text, for example `src/features/launcher/hooks/useLauncher.ts` and `src/features/multiplayer/hooks/useMultiplayer.ts`.
- UI components often log and render a local error banner or fallback state, for example `src/features/share/ShareModal.tsx` and `src/components/settings/tabs/StorageTab.tsx`.
- Main-process services frequently catch filesystem or persistence errors, log them, and return safe defaults instead of crashing, for example `electron/services/account/accountService.ts` and `electron/services/stats/statisticsService.ts`.
- A renderer-wide `ErrorBoundary` exists in `src/components/ErrorBoundary.tsx`, and it is mounted both in `src/main.tsx` and via `src/components/ErrorBoundaryWrapper.tsx`.

Observed gaps:

- Many errors are reduced to generic strings such as `'Launch Failed'` or `'Invalid or corrupted share code'`, which is good for UX but weak for diagnosis.
- Main-process services often rely on logging plus fallback return values rather than typed result objects.
- There is no shared error taxonomy across `src/services/ipc/*`, renderer hooks, and Electron services.

## Internationalization Expectations

The i18n baseline is solid.

- `src/contexts/settings/i18n.ts` implements a simple key/value translator with `{{param}}` interpolation.
- `src/locales/en.json` and `src/locales/ru.json` currently have matching key sets and identical counts.
- Many components consistently consume `t`, for example `src/App.tsx`, `src/components/SettingsPage.tsx`, and `src/components/modpacks/*`.

Observed practice still leaks non-localized strings.

- Hard-coded English statuses appear in `src/features/launcher/hooks/useLauncher.ts`.
- Hard-coded labels like `Third Party` and `Offline` appear in `src/features/accounts/AccountsPage.tsx`.
- Hard-coded error prefixes like `Error: ...` appear in `src/features/multiplayer/hooks/useMultiplayer.ts`.
- Fallback Russian strings appear in `src/features/share/ShareModal.tsx`.

The repo is clearly designed for full EN/RU localization, but enforcement is social rather than automatic.

## Typings and Contract Hygiene

Contract discipline is documented, but the ambient typings are slightly behind the exposed preload surface.

- `shared/contracts/windowApi.ts` includes `statistics` and `share` on `FriendLauncherApi`.
- `electron/preload.ts` exposes `window.share`, `window.screenshots`, and `window.api.statistics`.
- `src/vite-env.d.ts` types `window.api`, but it does not declare direct globals for `share`, `statistics`, or `screenshots`.
- `src/services/ipc/screenshotsIPC.ts` works around this with a local `declare global` block instead of relying on the central ambient declaration.

This is a good example of documented contract hygiene only being partially enforced in practice.

## Quality Hotspots to Keep in Mind

The biggest convention mismatches for future contributors are:

- Wrapper-first renderer access is the desired model, but legacy direct `window.*` calls are still common.
- “No `any`” is the policy, but the lint config currently models it as warning-level debt.
- File organization is domain-oriented, but “instances” and “modpacks” remain mixed in naming.
- Localization is expected everywhere, but hard-coded strings still appear in active feature code.
- Formatting consistency depends on local discipline because there is no auto-formatter config.
