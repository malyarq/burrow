---
phase: 06-milestone-auditability-recovery
plan: 01
subsystem: launcher
tags: [electron, react, mirrors, image-cache, roadmap]
requires:
  - phase: 03-modpack-workflow-completion
    provides: modpack browser history and configurable page sizing
  - phase: 04-delivery-cache-accounts-and-stats-hardening
    provides: persisted mirror priority plus the shared LazyImage cache seam
  - phase: 05-accessibility-and-release-truthfulness
    provides: release-truth ownership for roadmap and shipped UI claims
provides:
  - launcher runtime and version discovery no longer override mirror priority with legacy provider state
  - remaining shipped modpack and mod icons render through the shared cached LazyImage seam
  - EN and RU roadmap files match the shipped modpack history and pagination behavior
affects: [06-02, 06-03, v1.0-milestone-audit]
tech-stack:
  added: []
  patterns:
    - mirror selection comes from persisted mirror order only
    - remote modpack imagery uses LazyImage with bundled fallback art
key-files:
  created:
    - .planning/phases/06-milestone-auditability-recovery/06-01-SUMMARY.md
  modified:
    - electron/services/download/__tests__/downloadFallback.test.ts
    - src/contexts/SettingsContext.tsx
    - src/features/launcher/hooks/useLauncher.ts
    - src/features/launcher/hooks/useVersions.ts
    - src/features/launcher/hooks/useModSupportedVersions.ts
    - src/components/modpacks/InstallModpackPage.tsx
    - src/components/modpacks/AddModModal.tsx
    - src/components/modpacks/details/ModpackDetailsHeader.tsx
    - src/components/ui/__tests__/LazyImage.cache.test.tsx
    - docs/en/roadmap.md
    - docs/ru/roadmap.md
key-decisions:
  - "Normalize legacy downloadProvider persistence to compatibility-only state and remove it from live launcher/version flows."
  - "Reuse the existing LazyImage cache seam with bundled /icon.png fallback on the remaining shipped modpack surfaces."
patterns-established:
  - "Mirror source of truth: renderer launcher/version flows must not pass legacy provider overrides when persisted mirror ordering exists."
  - "Remote modpack and mod artwork should render through LazyImage so disk caching and fallback art stay consistent."
requirements-completed: [FLOW-05, DLVR-01, DLVR-02, DOC-01]
duration: 5min
completed: 2026-04-12
---

# Phase 6 Plan 01: Auditability Recovery Summary

**Mirror-priority runtime recovery plus final modpack-image cache rollout and truthful roadmap status for shipped browser history/pagination**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-12T20:12:00Z
- **Completed:** 2026-04-12T20:16:53Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Removed the live launcher and version-discovery dependency on the legacy `downloadProvider` override so persisted mirror priority is the only runtime selector again.
- Extended download-service coverage to prove ordered version-manifest fallback through the persisted mirror model.
- Routed the remaining shipped modpack/mod icon surfaces through `LazyImage` and corrected both roadmap files where shipped browser history and configurable pagination were still marked incomplete.

## Task Commits

Each task was committed atomically:

1. **Task 1: Collapse launcher downloads onto the persisted mirror-priority model** - `5fd1f4e` (fix)
2. **Task 2: Route the remaining live imagery through cache and fix stale roadmap claims** - `d847035` (fix)

**Plan metadata:** Recorded in the follow-up docs commit after summary/state updates.

## Files Created/Modified

- `src/contexts/SettingsContext.tsx` - Keeps legacy `settings_downloadProvider` persistence readable while normalizing live consumers back to `auto`.
- `src/features/launcher/hooks/useLauncher.ts` - Stops launch IPC calls from passing the stale legacy provider override.
- `src/features/launcher/hooks/useVersions.ts` - Refreshes version discovery without the legacy provider dependency.
- `src/features/launcher/hooks/useModSupportedVersions.ts` - Refreshes Forge/NeoForge discovery through the mirror-priority default path.
- `electron/services/download/__tests__/downloadFallback.test.ts` - Proves ordered version-manifest fallback through persisted mirror candidates.
- `src/components/modpacks/InstallModpackPage.tsx` - Uses cached `LazyImage` for install-page artwork.
- `src/components/modpacks/AddModModal.tsx` - Uses cached `LazyImage` for add-mod search results.
- `src/components/modpacks/details/ModpackDetailsHeader.tsx` - Uses cached `LazyImage` for modpack detail artwork with bundled fallback handling.
- `src/components/ui/__tests__/LazyImage.cache.test.tsx` - Covers explicit fallback behavior for cached remote artwork.
- `docs/en/roadmap.md` - Marks shipped modpack history and configurable pagination behavior as complete.
- `docs/ru/roadmap.md` - Marks shipped modpack history and configurable pagination behavior as complete.

## Decisions Made

- Treat saved `downloadProvider` values as compatibility data only so legacy localStorage does not outrank persisted mirror order in live flows.
- Reuse `LazyImage` rather than adding a second cache/rendering path, keeping image-cache behavior and fallback art consistent across modpack surfaces.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- A concurrent local commit for `06-02` landed on `HEAD` during execution and touched `.planning/ROADMAP.md` plus `.planning/REQUIREMENTS.md`; its scope was verified as non-overlapping before `06-01` bookkeeping continued.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The runtime mirror split, remaining raw modpack imagery, and stale roadmap bullets are closed.
- Phase 6 can continue with the remaining auditability recovery work on requirement wording, verification reconstruction, and milestone rerun evidence.

## Self-Check: PASSED

- Found `.planning/phases/06-milestone-auditability-recovery/06-01-SUMMARY.md`
- Found task commit `5fd1f4e`
- Found task commit `d847035`

---
*Phase: 06-milestone-auditability-recovery*
*Completed: 2026-04-12*
