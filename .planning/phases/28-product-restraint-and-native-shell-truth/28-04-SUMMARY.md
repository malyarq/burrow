---
phase: 28-product-restraint-and-native-shell-truth
plan: 04
subsystem: ui
tags: [react, electron, startup-truth, instances, vitest]
requires:
  - phase: 28-01
    provides: native shell-safe startup framing without competing chrome
  - phase: 28-02
    provides: restrained classic shell surfaces that can safely stay pending until truth hydrates
  - phase: 28-03
    provides: launcher-home and update-locality regressions that remain part of the phase closeout suite
provides:
  - startup shell hydration that stays pending until selected or classic runtime truth is loaded
  - persistence recovery that reuses stored config or metadata truth before any hardcoded runtime fallback
  - focused shell-truth coverage for startup reload, missing config recovery, and legacy migration
affects: [phase-29-modpack-workflow-simplification-and-runtime-truth, startup-hydration, instances-persistence]
tech-stack:
  added: []
  patterns: [startup-truth gating, root-path-keyed classic config state, metadata-backed config recovery, non-destructive index rebuild]
key-files:
  created:
    - src/contexts/__tests__/ModpackContext.startup-truth.test.ts
    - electron/services/instances/__tests__/legacySeed.startupTruth.test.ts
  modified:
    - src/App.tsx
    - src/contexts/ModpackContext.tsx
    - src/contexts/instances/hooks/useInstanceBootstrap.ts
    - src/features/launch/hooks/useLaunchState.ts
    - src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx
    - src/contexts/instances/services/legacySeed.ts
    - electron/services/instances/indexStore.ts
    - electron/services/instances/configStore.ts
    - electron/services/instances/__tests__/instanceMetadataCrud.test.ts
key-decisions:
  - "Startup shell surfaces stay pending until selected/classic runtime truth is hydrated instead of rendering hardcoded defaults."
  - "Missing index or config files now reuse persisted config or metadata truth before any `1.12.2`/`vanilla` fallback is allowed."
patterns-established:
  - "Classic startup truth is keyed by `rootPath`, so path changes invalidate stale runtime labels without synchronous effect clears."
  - "Legacy migration seeds only values that actually existed in localStorage; runtime truth must come from persisted config or metadata."
requirements-completed: [SHELL-08]
duration: 5min
completed: 2026-04-20
---

# Phase 28 Plan 04: Startup Shell Truth Summary

**Startup shell labels now wait for persisted selected-pack and classic runtime truth, while missing index or config files recover from stored truth instead of reintroducing `1.12.2` or `vanilla`**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-20T11:25:33Z
- **Completed:** 2026-04-20T11:30:48Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Stopped the renderer shell from showing stale selected-pack or classic runtime labels while startup truth is still hydrating.
- Removed the legacy migration path that invented a runtime from localStorage values that never stored one.
- Hardened missing-index and missing-config recovery so persisted config or metadata truth wins before any hardcoded fallback.

## Task Commits

Each task was committed atomically:

1. **Task 1: Establish the Wave 0 startup-truth seam for visible shell hydration** - `4a2bc6a` (fix)
2. **Task 2: Lock persisted reload and legacy migration truth behind focused storage seams** - `5380fc0` (fix)
3. **Blocking verification fix: keep classic startup truth lint-clean** - `0995623` (fix)

**Plan metadata:** pending at summary creation time; added in the final docs commit

## Files Created/Modified

- `src/App.tsx` - Keeps the app pending until modpack truth is ready and stops building version hints from a hardcoded default.
- `src/contexts/ModpackContext.tsx` - Keys classic config state by `rootPath`, clears stale selection defaults, and exposes truthful readiness.
- `src/contexts/instances/hooks/useInstanceBootstrap.ts` - Resets selected/config state before bootstrap reload so stale labels do not leak.
- `src/features/launch/hooks/useLaunchState.ts` - Derives launch labels from hydrated truth instead of defaulting to `1.12.2`.
- `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx` - Locks the classic dashboard away from visible fallback runtime labels.
- `src/contexts/__tests__/ModpackContext.startup-truth.test.ts` - Proves startup remains pending until classic or selected-pack truth resolves, including root-path reloads.
- `src/contexts/instances/services/legacySeed.ts` - Stops seeding invented runtime values from legacy localStorage.
- `electron/services/instances/indexStore.ts` - Rebuilds a missing modpacks index without overwriting an existing default config.
- `electron/services/instances/configStore.ts` - Recovers a missing modpack config from persisted metadata truth before falling back.
- `electron/services/instances/__tests__/instanceMetadataCrud.test.ts` - Covers metadata-backed config recovery and non-destructive index recreation.
- `electron/services/instances/__tests__/legacySeed.startupTruth.test.ts` - Verifies legacy migration carries only real stored settings, not synthetic runtime defaults.

## Decisions Made

- Used the existing startup pending seam instead of introducing another settings/runtime store; the shell now waits for the persisted truth it already owns.
- Kept Phase 28 bounded to startup truth by using metadata only as missing-config recovery input, not as a broader runtime authority source across the UI.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reworked classic startup invalidation to satisfy React Compiler lint**
- **Found during:** Full phase verification after Task 2
- **Issue:** Clearing classic config synchronously inside an effect introduced `react-hooks/set-state-in-effect` and memoization warnings, which blocked the required zero-warning closeout.
- **Fix:** Replaced the synchronous clear with root-path-keyed classic config state and updated the dependent callbacks to include the new setter dependency.
- **Files modified:** `src/contexts/ModpackContext.tsx`
- **Verification:** `npx vitest run electron/window/__tests__/windowManager.macos.test.ts src/components/__tests__/TitleBar.branding.test.tsx src/components/__tests__/UpdateNotification.layout.test.tsx src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/SimplePlayHome.visualTruth.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/contexts/__tests__/ModpackContext.startup-truth.test.ts electron/services/instances/__tests__/instanceMetadataCrud.test.ts electron/services/instances/__tests__/legacySeed.startupTruth.test.ts && npx tsc --noEmit && npx eslint src/ electron/`
- **Committed in:** `0995623` (blocking verification fix)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix stayed inside the planned startup-truth seam and was required to close the repo-wide lint gate cleanly.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `SHELL-08` is now covered by startup hydration, persistence recovery, and legacy migration regression tests.
- The Phase 28 automated closeout matrix is green.
- Manual shell-restraint, native macOS shell, update-locality, and quit-and-relaunch walkthroughs were auto-approved because `workflow.auto_advance=true`; no interactive app walkthrough was executed in this run.

## Self-Check: PASSED

- Found `.planning/phases/28-product-restraint-and-native-shell-truth/28-04-SUMMARY.md`.
- Found task commits `4a2bc6a`, `5380fc0`, and blocking-fix commit `0995623` in git history.
