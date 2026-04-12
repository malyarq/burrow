# 01-07 Summary

## Outcome

Plan `01-07` is implemented across the shared contracts, preload bridge, main-process URL classifier, and the modpack detail tabs.

- Renderer-triggered external links now use a typed `externalLinks` contract and `src/services/ipc/externalLinksIPC.ts` wrapper instead of raw anchors.
- A single external URL policy now decides trusted direct-open, unfamiliar-domain confirmation, and dangerous-scheme blocking for renderer requests, popups, and unexpected window navigation.
- The IPC allowlist and Russian contracts map were synced with the current Phase 1 surface, clearing the carried `ipc:check` and `contracts:check` failures.
- Main and console windows keep `sandbox: false` for Phase 1, but the compensating controls are explicit in code: `contextIsolation`, `nodeIntegration: false`, raw IPC allowlist enforcement, blocked drag/drop navigation, and guarded external-link handling.

## Files Changed

- `shared/contracts/externalLinks.ts`
- `shared/contracts/index.ts`
- `shared/contracts/ipcChannels.ts`
- `shared/contracts/windowApi.ts`
- `src/services/ipc/externalLinksIPC.ts`
- `src/vite-env.d.ts`
- `src/components/modpacks/details/ModsTab.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `electron/preload.ts`
- `electron/preload/bridges/ExternalLinksBridge.ts`
- `electron/ipc/handlers/externalLinksHandlers.ts`
- `electron/ipc/ipcManager.ts`
- `electron/security/externalUrls.ts`
- `electron/window/windowManager.ts`
- `docs/ru/contracts-map.md`

## Verification

- `npx eslint shared/contracts/externalLinks.ts shared/contracts/index.ts shared/contracts/windowApi.ts shared/contracts/ipcChannels.ts src/services/ipc/externalLinksIPC.ts src/vite-env.d.ts electron/preload.ts electron/preload/bridges/ExternalLinksBridge.ts electron/ipc/handlers/externalLinksHandlers.ts electron/ipc/ipcManager.ts electron/security/externalUrls.ts electron/window/windowManager.ts src/components/modpacks/details/ModsTab.tsx src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `npx tsc --noEmit`
- `npm run ipc:check`
- `npm run contracts:check`
- `npm run build -- --publish never`

## Notes

- `npm run build -- --publish never` needed an unrestricted rerun because `electron-builder` had to download the Electron runtime; the build completed successfully once network access was available.
- The build still reports non-blocking Vite chunk-size warnings and missing `description` / `author` metadata in `package.json`.
- Interactive manual smoke for trusted links, unfamiliar-domain confirmation, and blocked schemes was not run from this CLI session.

## Commit

- `d814888` — `fix(01-07): guard external link navigation`
