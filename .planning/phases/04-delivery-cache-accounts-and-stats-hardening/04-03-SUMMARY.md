---
phase: 04-delivery-cache-accounts-and-stats-hardening
plan: "03"
subsystem: mirrors
tags: [mirrors, fallback, downloader, launcher-settings, vitest]
requires:
  - phase: 01-release-baseline-and-trust-boundaries
    provides: trusted custom mirror validation and typed mirror IPC
provides:
  - persisted mirror priority ordering instead of selected-only mirror state
  - launcher settings controls for manual fallback order and auto-priority refresh
  - runtime candidate generation that honors persisted mirror order and skips blacklisted origins
affects: [mirrors, downloads, launcher-runtime, settings]
tech-stack:
  added: []
  patterns: [priority-ordered mirror provider chain, downloader candidate fallback with corruption rejection]
key-files:
  created: [electron/services/mirrors/__tests__/mirrorPriority.test.ts, electron/services/download/__tests__/downloadFallback.test.ts]
  modified: [shared/types/mirrors.ts, shared/contracts/mirrors.ts, shared/contracts/ipcChannels.ts, electron/services/mirrors/mirrorsService.ts, electron/ipc/handlers/mirrorsHandlers.ts, electron/preload/bridges/MirrorsBridge.ts, src/services/ipc/mirrorsIPC.ts, src/features/settings/mirrors/MirrorsSettings.tsx, electron/services/mirrors/providers.ts, electron/services/runtime/downloadService.ts, electron/services/download/downloadManager.ts, src/locales/en.json, src/locales/ru.json]
key-decisions:
  - "Made persisted mirror array order the source of truth for fallback priority instead of introducing a parallel selected-mirror model."
  - "Kept the downloader fallback loop in DownloadManager and changed only candidate ordering so corruption rejection stays centralized."
patterns-established:
  - "User-visible priority controls must feed the exact runtime candidate order used by launcher downloads."
  - "Mirror auto-selection may reorder priorities, but runtime fallback still executes through the same ordered-candidate seam."
requirements-completed: [DLVR-01, DLVR-02, DLVR-03]
duration: 20min
completed: 2026-04-12
---

# Phase 4: Delivery, Cache, Accounts, And Stats Hardening Summary

**Mirror priority is now persisted, configurable, and respected by runtime download fallback**

## Performance

- **Duration:** 20 min
- **Started:** 2026-04-12T21:13:00Z
- **Completed:** 2026-04-12T21:24:10Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Replaced the old selected-only mirror state with a real persisted priority order, including move-up and move-down controls from the existing Downloads settings screen.
- Extended typed mirror IPC with reorder support and kept auto-select as an order-refresh mechanism rather than a separate runtime path.
- Built runtime auto-provider candidates from the persisted mirror order so launcher downloads now try the user’s preferred mirrors first, then healthy fallbacks, while still honoring bad-host filtering and corruption rejection.

## Task Commits

1. **Task 1:** `dbb7a93` (`feat(04-03): persist mirror priority order`)
2. **Task 2:** `4863a99` (`feat(04-03): honor mirror fallback priority`)

## Files Created/Modified
- `shared/types/mirrors.ts`, `shared/contracts/mirrors.ts`, and `shared/contracts/ipcChannels.ts` - mirror priority types and reorder IPC contract
- `electron/services/mirrors/mirrorsService.ts` - persisted priority ordering, selection-as-promote, auto-priority refresh, and preferred-mirror runtime seam
- `electron/ipc/handlers/mirrorsHandlers.ts`, `electron/preload/bridges/MirrorsBridge.ts`, and `src/services/ipc/mirrorsIPC.ts` - typed mirror reorder plumbing
- `src/features/settings/mirrors/MirrorsSettings.tsx` - explicit priority badges plus up/down controls in the existing Downloads settings surface
- `electron/services/mirrors/providers.ts` and `electron/services/runtime/downloadService.ts` - ordered provider chain for runtime candidate generation
- `electron/services/download/downloadManager.ts` - clearer corrupted-candidate rejection annotation during fallback
- `electron/services/mirrors/__tests__/mirrorPriority.test.ts` and `electron/services/download/__tests__/downloadFallback.test.ts` - focused regression coverage for persisted order, bad-host filtering, and corrupted primary candidates

## Decisions Made
- Preserved the current `auto` provider entry point and changed what it means internally: it now reflects persisted mirror priority rather than a hardcoded BMCL-before-official order.
- Left the existing downloader fallback executor intact and pushed priority behavior into provider and runtime option generation.

## Deviations from Plan

None.

## Issues Encountered

None.

## User Setup Required

None - existing mirror settings migrate automatically into the new priority model.

## Next Phase Readiness

- `04-04` can reuse the same typed-settings and typed-IPC pattern for richer statistics without introducing new top-level surfaces.
- `04-05` can now validate real mirror priority behavior through the repo-wide gate instead of only checking a cosmetic settings screen.

---
*Phase: 04-delivery-cache-accounts-and-stats-hardening*
*Completed: 2026-04-12*
