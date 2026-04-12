# FriendLauncher Concerns

## Scope

This note captures technical debt, known issues, and operational risks observed in the FMCL codebase. It separates directly observed evidence from forward-looking inference so later planning can distinguish “already true in code/docs” from “likely failure mode if left as-is”.

## Current Evidence

## 1. The static-quality baseline is not green

The repo already carries an explicit debt ledger in `docs/KNOWN_ISSUES.md`, and several listed issues are still visible in source.

- `src/components/layout/BackgroundLayer.tsx` still calls `useMemo` only inside the `config.type === 'particles' && init` branch, after an earlier `if (!config) return null;`. That matches the documented hook-order concern.
- `src/features/accounts/AccountsPage.tsx` still defines `loadAccounts` after a `useEffect` that calls it, which is the exact pattern called out in `docs/KNOWN_ISSUES.md`.
- `src/features/share/ShareModal.tsx` still performs synchronous state transitions inside `useEffect`.
- `src/components/settings/tabs/StorageTab.tsx` still loads data in an effect without stabilizing `loadStats`.
- `docs/KNOWN_ISSUES.md` also documents unresolved `no-explicit-any` usage across `src/` and `electron/`, and the source still contains many explicit escape hatches in files like `src/services/ipc/modpacksIPC.ts`, `electron/ipc/handlers/modpacksHandlers.ts`, and `electron/services/launcher/modLoaderInstaller.ts`.

This means the repository is not at a fully clean lint baseline even before new work starts.

## 2. Archive import and extraction hardening is inconsistent

There are multiple places where untrusted archive paths are written to disk without consistent containment checks.

- `electron/services/modpacks/importers/localInstaller.ts` uses `zip.extractAllTo(targetDir, true)` for generic ZIP imports.
- The same file writes `file.path` from manifest entries directly via `path.join(targetDir, file.path)` during Modrinth import.
- `electron/services/modpacks/importers/localInstaller.ts` also writes override entries based on `entry.entryName` in `extractOverrides(...)` without normalizing or proving they stay inside `targetDir`.
- `electron/services/instances/importer/InstanceImporterService.ts` copies MultiMC entries by deriving `relPath` from archive entry names and writing them under `instanceDir` with no `path.normalize(...)` + “must remain within base dir” check.
- By contrast, `electron/services/modpacks/modpackService.ts` does implement an explicit traversal guard in `updateModpackOverrides(...)`.

The codebase already “knows” path traversal is a risk in at least one write path, but the same defense is not applied consistently across import flows.

## 3. IPC handlers trust renderer-supplied paths too broadly

The main process accepts many raw filesystem-related arguments from the renderer and often uses them directly.

- `electron/ipc/handlers/modpacksHandlers.ts` accepts optional `rootPath` on a large set of handlers.
- `electron/services/instances/paths.ts` turns `rootPath` and `modpackId` into real paths with plain `path.join(...)`.
- `electron/services/instances/instanceService.ts` and `electron/services/modpacks/modpackService.ts` then perform `rmSync`, `unlinkSync`, `renameSync`, recursive copies, and manifest writes on those joined paths.
- `electron/services/worlds/worldService.ts` joins `folderName` into the saves directory and deletes, duplicates, backs up, or opens it without normalizing the name.
- `electron/services/resourcePacks/resourcePackService.ts` and `electron/services/shaders/shaderService.ts` similarly join renderer-provided filenames into instance directories.
- `electron/ipc/handlers/settingsHandlers.ts` passes renderer-provided `targetPath` directly to `shell.openPath(...)`.

Only some write paths are validated. The broader Electron trust boundary is therefore inconsistent.

## 4. The Electron security posture is only partially hardened

The window configuration is better than legacy Electron defaults, but it still leaves meaningful attack surface.

- `electron/window/windowManager.ts` enables `contextIsolation: true` and disables `nodeIntegration`, which is good.
- The same file also sets `sandbox: false` for both the main window and console window.
- `electron/preload.ts` exposes both the namespaced `window.api.*` surface and many legacy globals like `window.launcher`, `window.modpacks`, `window.account`, and `window.ipcRenderer`.
- `electron/preload/bridges/IpcRendererBridge.ts` exposes a generic `invoke/send/on/off` bridge to all allowlisted channels.

This is not an immediate exploit by itself, but it means renderer bugs are buffered by convention rather than by the narrowest possible API surface.

## 5. IPC wiring has duplication and contract drift

The modpack IPC layer is carrying visible copy-paste debt.

- `electron/ipc/handlers/modpacksHandlers.ts` registers `modpacks:export` three times.
- The same file registers `modpacks:getModpackInfoFromFile` twice.
- The same file registers `modpacks:import` twice.
- Those duplicates are not identical. Later `removeHandler(...)` calls override earlier registrations, so behavior depends on definition order in one large file.
- `shared/contracts/worlds.ts` says `getWorldPath(folderName, instancePath)` returns a `string`.
- `src/services/ipc/worldsIPC.ts` does not return a path. It invokes `worlds:openFolder` and returns `''`.

The contract layer therefore has both duplicated handler wiring and at least one observable API-shape mismatch.

## 6. Renderer architecture drift is real, not just historical

The docs describe `src/services/ipc/*` as the preferred boundary and recommend `window.api.*` over direct globals, but the renderer is still transitional.

- `docs/en/architecture.md` says renderer code should prefer `src/services/ipc/*` and avoid direct IPC calls.
- `src/features/accounts/AccountsPage.tsx` and `src/features/accounts/AddAccountDialog.tsx` call `window.account.*` directly.
- `src/features/settings/mirrors/MirrorsSettings.tsx` calls `window.api.mirrors.*` directly instead of going through a renderer-side wrapper.
- `src/contexts/SettingsContext.tsx` calls `window.windowControls?.openConsole()` and `window.windowControls?.closeConsole()` directly.
- Several “wrappers” still send raw channel strings through `window.api.ipcRenderer`, for example `src/services/ipc/worldsIPC.ts`, `src/services/ipc/resourcePacksIPC.ts`, `src/services/ipc/exportImportIPC.ts`, `src/services/ipc/datapacksIPC.ts`, and `src/services/ipc/shadersIPC.ts`.
- `src/services/ipc/modpacksIPC.ts` still contains legacy fallbacks to `window.launcher` and even a raw `(window as any).ipcRenderer` helper.

The renderer boundary is therefore only partially migrated, which raises maintenance cost for every preload or contract change.

## 7. UI state synchronization still falls back to hard reloads

There are multiple places where successful actions recover UI state by reloading the entire renderer instead of updating local or shared state.

- `src/components/modpacks/InstallModpackModal.tsx` calls `window.location.reload()` after installation.
- `src/components/modpacks/InstallModpackPage.tsx` does the same.
- `src/components/modpacks/ImportModpackPreviewPage.tsx` reloads after import.
- `src/components/sidebar/LaunchControls.tsx` reloads in one of the failure/recovery paths.
- `src/components/ErrorBoundary.tsx` exposes reload as the main recovery action.

This is a concrete sign that some state flows are still too coupled or incomplete to recover incrementally.

## 8. Build and dependency management are brittle

The install/build path depends on behavior outside the declared dependency graph.

- `scripts/postinstall-fix-xmcl-bytebuffer.cjs` mutates `node_modules/@xmcl/bytebuffer/package.json` after install to repair an upstream exports map.
- `package.json` wires that patch into `postinstall`, so a fresh install depends on a local script patching a third-party package in place.
- `electron/services/resourcePacks/resourcePackService.ts` imports `fs-extra`.
- `package.json` does not declare `fs-extra` directly, so the code currently relies on it being hoisted transitively from some other dependency set.

That combination makes fresh installs and dependency upgrades more fragile than the manifest suggests.

## 9. Automated coverage is narrow, and CI skips the most realistic runtime test

The repo has some quality gates, but coverage is thin in the layers that usually regress during refactors.

- `docs/en/testing.md` and `docs/ru/testing.md` explicitly say the only runtime tests are “full installation” tests.
- The same docs say those full-installation tests are not run in CI.
- `.github/workflows/ci.yml` runs lint, typecheck, contract checks, IPC allowlist checks, and build, but not the full-installation suite.
- `package.json` contains full-installation commands (`test:full`, `test:full:vanilla`, `test:full:forge`, `test:full:fabric`, `test:full:neoforge`) but does not declare `vitest`.
- The tree under `src/`, `electron/services/`, and `shared/` contains effectively no unit/component test suites; the “tests” that do exist live under `electron/app/tests/` and support the installation harness rather than isolated behavior checks.

The result is strong packaging/install smoke coverage, but weak fast feedback for renderer logic, IPC behavior, and service-level error handling.

## 10. Main-process performance is sensitive to synchronous filesystem and ZIP work

Many Electron main-process code paths do large synchronous work in direct response to UI actions.

- `electron/services/modpacks/modpackService.ts` does synchronous JSON, ZIP export, manifest, and file writes.
- `electron/services/instances/instanceService.ts` performs recursive filesystem copies and deletes with sync APIs.
- `electron/services/content/contentManager.ts` uses many `fs.*Sync` calls while traversing or deduplicating content.
- `electron/services/download/downloadManager.ts` mixes downloads with sync file inspection and cleanup on the main side.
- `electron/services/instances/exporter/InstanceExporterService.ts` recursively reads directories and packs ZIPs synchronously.
- `electron/services/modpacks/importers/localInstaller.ts` and `electron/services/instances/importer/InstanceImporterService.ts` use `AdmZip` and sync writes during import.

Electron’s main process is also the UI process for window lifecycle and IPC dispatch, so these choices directly increase the risk of frozen windows during large modpack operations.

## 11. Sensitive data and custom endpoints are stored and used with minimal safeguards

The account/mirror features add useful flexibility, but they are not strongly hardened.

- `electron/services/account/accountService.ts` persists `authServerUrl`, `accessToken`, and `clientToken` in plaintext `accounts.json` under `userData`.
- `electron/services/account/yggdrasil.ts` authenticates against an arbitrary user-provided `authServerUrl`.
- `src/features/accounts/AddAccountDialog.tsx` only checks for non-empty input before sending that URL and user credentials to the main process.
- `electron/services/mirrors/mirrorsService.ts` accepts arbitrary custom mirror URLs, persists them, and probes them with `electronNet.fetch(...)`.
- `src/features/settings/mirrors/MirrorsSettings.tsx` exposes that custom mirror capability directly in the UI with no structural validation beyond non-empty strings.

This is a real flexibility feature, but it also means typoed or hostile endpoints can become part of the launcher’s normal network path.

## 12. Localization and documentation discipline are visibly drifting

The repo’s own rules say user-facing strings belong in locale files and EN/RU docs should stay in sync, but the codebase still shows drift.

- `src/features/accounts/AccountsPage.tsx` still hardcodes user-facing labels like `Third Party` and `Offline`.
- `src/features/settings/mirrors/MirrorsSettings.tsx` hardcodes strings like `Official`, `Failed`, `Testing...`, `Test Speed`, `My Custom Mirror`, and `Must be a BMCLAPI-compatible mirror URL.`.
- `src/components/modpacks/InstallModpackPage.tsx` and `src/components/modpacks/ImportModpackPreviewPage.tsx` contain Russian fallback strings in component code.
- `docs/KNOWN_ISSUES.md` explicitly documents that `docs/en/roadmap.md` lags `docs/ru/roadmap.md`.
- The same known-issues document calls out `update_share_locales.cjs` still living in the repository root as leftover utility debt.

This is lower-risk than the archive and IPC concerns, but it creates steady churn and review overhead.

## Inference and Watchpoints

## 1. Renderer compromise would have a larger blast radius than necessary

Because `electron/window/windowManager.ts` keeps `sandbox: false`, `electron/preload.ts` exposes a broad bridge surface, and many handlers trust renderer-supplied paths, a renderer-side bug would likely become a filesystem-impacting bug faster than it should.

## 2. Malicious or just malformed user input can become a resource-exhaustion problem

The share/import paths in `electron/services/sharing/shareService.ts` and the ZIP import paths in `electron/services/modpacks/importers/localInstaller.ts` and `electron/services/instances/importer/InstanceImporterService.ts` do not show clear size ceilings or bounded extraction logic. Large crafted inputs could plausibly turn into memory spikes, long main-thread stalls, or excessive disk writes.

## 3. The modpacks domain is the most likely place for refactor regressions

The combination of legacy `instances` naming, a large `electron/services/modpacks/modpackService.ts`, duplicated handler definitions in `electron/ipc/handlers/modpacksHandlers.ts`, and renderer hard reloads strongly suggests this domain is already hard to change safely.

## 4. Dependency upgrades are likely to be noisy

The direct patching in `scripts/postinstall-fix-xmcl-bytebuffer.cjs` and the undeclared use of `fs-extra` suggest that future dependency updates may fail in non-obvious ways, especially on clean machines or after lockfile churn.

## 5. CI can report green while realistic desktop workflows are still broken

Since `.github/workflows/ci.yml` skips the full-installation suite and there is almost no unit/component coverage, regressions in launcher flows, filesystem services, or preload contract behavior can plausibly survive until manual testing.
