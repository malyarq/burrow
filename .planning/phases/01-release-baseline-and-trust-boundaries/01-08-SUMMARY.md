---
phase: 01-release-baseline-and-trust-boundaries
plan: "08"
subsystem: boundary
tags: [electron, preload, contracts, renderer, ipc]
requires: []
provides:
  - one typed renderer wrapper path for account, mirrors, and share flows
  - aligned preload exposure, shared contracts, and ambient window typing for the touched boundary
affects: [phase-1, security, preload, renderer, accounts, mirrors, share]
tech-stack:
  added: []
  patterns:
    - renderer IPC helpers wrapping namespaced preload APIs
    - listener bookkeeping for wrapped raw ipcRenderer callbacks
key-files:
  created:
    - src/services/ipc/accountIPC.ts
    - src/services/ipc/mirrorsIPC.ts
    - src/services/ipc/shareIPC.ts
  modified:
    - electron/preload.ts
    - electron/preload/bridges/IpcRendererBridge.ts
    - electron/preload/bridges/AccountBridge.ts
    - electron/preload/bridges/MirrorsBridge.ts
    - electron/preload/bridges/ShareBridge.ts
    - shared/contracts/windowApi.ts
    - shared/contracts/account.ts
    - shared/contracts/mirrors.ts
    - shared/contracts/share.ts
    - src/features/accounts/AccountsPage.tsx
    - src/features/accounts/AddAccountDialog.tsx
    - src/features/share/ShareModal.tsx
    - src/features/share/ImportShareModal.tsx
    - src/features/settings/mirrors/MirrorsSettings.tsx
    - src/vite-env.d.ts
key-decisions:
  - "Kept legacy top-level preload globals as compatibility aliases, but moved the touched renderer flows behind wrappers that prefer `window.api.*`."
  - "Fixed raw ipcRenderer listener removal by storing the wrapped Electron listeners instead of casting callbacks through `any`."
patterns-established:
  - "Touched renderer code reaches privileged Electron APIs through `src/services/ipc/*` wrappers rather than raw `window.*` globals."
  - "Preload exposure, contracts, and ambient typing now move together for the account/mirror/share boundary."
requirements-completed: [SEC-01, SEC-03]
duration: unknown
completed: 2026-04-12
---

# Phase 1 Plan 08 Summary

**The touched preload and renderer boundary now routes account, mirror, and share flows through one typed wrapper surface**

## Performance

- **Duration:** unknown
- **Started:** 2026-04-12
- **Completed:** 2026-04-12
- **Tasks:** 2
- **Files modified:** 18

## Accomplishments

- Added typed renderer IPC wrappers for accounts, mirrors, and share flows, and moved the touched UI callers off direct `window.account` / `window.api.*` usage.
- Aligned preload exposure and ambient typing around the supported `window.api.*` surface while keeping legacy aliases available for compatibility.
- Fixed the reviewed raw `ipcRenderer` bridge so wrapped listeners can be removed correctly without `any` casts.

## Task Commits

1. **Tasks 1-2: Preload/contracts alignment and typed renderer wrapper migration** - `4c04670` (`fix(01-08): align typed preload boundaries`)

## Files Created/Modified

- `electron/preload.ts` - exposed the reviewed mirrors alias and clarified the supported namespaced boundary
- `electron/preload/bridges/IpcRendererBridge.ts` - wrapped-listener bookkeeping and typed raw IPC forwarding
- `electron/preload/bridges/AccountBridge.ts` - formatting-only bridge alignment
- `electron/preload/bridges/MirrorsBridge.ts` - formatting-only bridge alignment
- `electron/preload/bridges/ShareBridge.ts` - formatting-only bridge alignment
- `shared/contracts/windowApi.ts` - documented `window.api.*` as the supported boundary
- `shared/contracts/account.ts` - contract alignment for typed account bridge usage
- `shared/contracts/mirrors.ts` - contract alignment for typed mirrors bridge usage
- `shared/contracts/share.ts` - contract alignment for typed share bridge usage
- `src/services/ipc/accountIPC.ts` - typed account wrapper with consistent IPC error shaping
- `src/services/ipc/mirrorsIPC.ts` - typed mirrors wrapper with consistent IPC error shaping
- `src/services/ipc/shareIPC.ts` - typed share wrapper with consistent IPC error shaping
- `src/features/accounts/AccountsPage.tsx` - moved account calls to `accountIPC`
- `src/features/accounts/AddAccountDialog.tsx` - moved account creation calls to `accountIPC`
- `src/features/share/ShareModal.tsx` - moved share-code generation to `shareIPC`
- `src/features/share/ImportShareModal.tsx` - moved share-code import to `shareIPC`
- `src/features/settings/mirrors/MirrorsSettings.tsx` - moved mirror actions to `mirrorsIPC` and replaced the touched browser confirm with the shared confirm dialog
- `src/vite-env.d.ts` - ambient typing aligned to the reviewed preload surface

## Decisions Made

- Preserved compatibility aliases in preload instead of deleting them mid-phase, but confined the touched renderer code to wrapper usage.
- Left the repo-wide allowlist/docs drift for later Phase 1 work instead of expanding the raw IPC allowlist in this boundary cleanup slice.

## Deviations from Plan

### Auto-fixed Issues

**1. Repo-wide IPC/doc validators still fail outside the `01-08` write set**
- **Found during:** Plan verification
- **Issue:** `npm run ipc:check` and `npm run contracts:check` still report broader allowlist/docs drift, including existing Phase 1 channels that are intentionally deferred to later phase work.
- **Fix:** Verified the touched preload/contracts/wrapper/UI boundary with local lint and `npx tsc --noEmit`, and carried the repo-wide validator failures forward in phase state instead of broadening the allowlist here.
- **Files modified:** none beyond the planned boundary files
- **Verification:** `npx eslint electron/preload.ts electron/preload/bridges/IpcRendererBridge.ts electron/preload/bridges/AccountBridge.ts electron/preload/bridges/MirrorsBridge.ts electron/preload/bridges/ShareBridge.ts shared/contracts/windowApi.ts shared/contracts/account.ts shared/contracts/mirrors.ts shared/contracts/share.ts src/services/ipc/accountIPC.ts src/services/ipc/mirrorsIPC.ts src/services/ipc/shareIPC.ts src/vite-env.d.ts src/features/accounts/AccountsPage.tsx src/features/accounts/AddAccountDialog.tsx src/features/share/ShareModal.tsx src/features/share/ImportShareModal.tsx src/features/settings/mirrors/MirrorsSettings.tsx && npx tsc --noEmit`
- **Committed in:** `4c04670`

---

**Total deviations:** 1 auto-fixed
**Impact on plan:** The boundary cleanup is complete and locally verified, but the phase still carries repo-wide allowlist/docs follow-up before the global validators can pass.

## Issues Encountered

- `npm run ipc:check` still reports unallowlisted channels including account, mirrors, share, screenshots, and existing launcher/statistics seams.
- `npm run contracts:check` still reports contracts-map drift outside this write set.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Later security work can harden account, mirrors, and share flows through one wrapper surface instead of chasing direct `window.*` calls in the touched renderer code.
- External-link and persisted-config work can build on a cleaner preload/contracts boundary without reintroducing raw renderer globals in these flows.

---
*Phase: 01-release-baseline-and-trust-boundaries*
*Completed: 2026-04-12*
