---
phase: 19-baseline-stability-scope-and-shell-invariants
plan: "02"
subsystem: ui
tags: [react, typescript, modpacks, cta-ownership, vitest]
requires:
  - phase: 19-01
    provides: shared shell-safe sidebar baseline for route-aware CTA ownership
provides:
  - shared shell-versus-route CTA ownership seam for modpack navigation
  - demoted sidebar launch emphasis on route-owned modpack flows
  - single route-primary action on modpack details, including update states
  - focused regression tests for sidebar ownership and modpack-details action truth
affects: [19-03, 20, 21, verification]
tech-stack:
  added: []
  patterns: [navigation-owned CTA store, single-primary route action row]
key-files:
  created:
    - src/components/modpacks/primaryActionOwnership.ts
    - src/components/__tests__/Sidebar.primary-action.test.tsx
    - src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx
  modified:
    - src/components/modpacks/ModpackRouter.tsx
    - src/components/Sidebar.tsx
    - src/components/sidebar/LaunchControls.tsx
    - src/components/modpacks/details/ModpackDetailsActions.tsx
    - src/components/sidebar/__tests__/LaunchControls.status.test.tsx
key-decisions:
  - "ModpackRouter classifies views as shell-owned or route-owned and publishes that ownership through a shared store instead of teaching LaunchControls about routes."
  - "When a modpack update exists, ModpackDetails promotes update to the sole route-primary CTA and demotes Play to a secondary action."
patterns-established:
  - "Sidebar launch emphasis follows shared ownership state, while LaunchControls stays focused on launch wording and state."
  - "Route action groups expose one dominant CTA at a time and mark the dominant slot explicitly for focused tests."
requirements-completed: [SHELL-03]
duration: 12min
completed: 2026-04-17
---

# Phase 19 Plan 02: Shared CTA Ownership Policy Summary

**Shared modpack CTA ownership seam with route-owned sidebar demotion and one dominant modpack-details primary action**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-17T19:16:00Z
- **Completed:** 2026-04-17T19:27:51Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Added a shared ownership seam that classifies modpack navigation contexts as shell-owned or route-owned and lets the sidebar demote launch emphasis without adding route logic to `LaunchControls`.
- Kept shell launch primary on launcher-home, modpack list, and modpack browser while demoting it across `details`, `create`, `add*`, `export`, `install`, and `importPreview`.
- Collapsed modpack-details to one dominant route-primary action at a time and locked the policy with focused sidebar and details regression tests.

## Task Commits

Each task was committed atomically:

1. **Task 1: Introduce a shared shell-versus-route CTA ownership seam** - `1c1c65e` (feat)
2. **Task 2: Collapse modpack-details to one route-primary action and lock the rule with focused tests** - `c178fd7` (test)

## Files Created/Modified

- `src/components/modpacks/primaryActionOwnership.ts` - owns the shared shell-versus-route CTA classifier and subscription seam.
- `src/components/modpacks/ModpackRouter.tsx` - publishes primary-action ownership for every modpack route family.
- `src/components/Sidebar.tsx` - consumes the shared ownership seam to choose primary versus secondary shell launch emphasis.
- `src/components/sidebar/LaunchControls.tsx` - interprets launch priority without learning route-specific branching.
- `src/components/modpacks/details/ModpackDetailsActions.tsx` - exposes exactly one dominant route-primary action, even when an update exists.
- `src/components/__tests__/Sidebar.primary-action.test.tsx` - proves the ownership matrix for shell-owned and route-owned contexts.
- `src/components/sidebar/__tests__/LaunchControls.status.test.tsx` - preserves launch-state copy while the shell demotes launch emphasis.
- `src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx` - proves modpack-details exposes only one route-primary action at a time.

## Decisions Made

- `ModpackRouter` owns the route matrix and publishes it through a shared store so `Sidebar` can respond without duplicating route checks in button code.
- Route-owned modpack details prefer the update action as the dominant primary CTA when applicable, with play kept visible only as a secondary fallback.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Extracted the ownership seam into a dedicated module to satisfy fast-refresh lint rules**
- **Found during:** Task 1 (Introduce a shared shell-versus-route CTA ownership seam)
- **Issue:** Exporting the shared ownership classifier directly from `ModpackRouter.tsx` triggered `react-refresh/only-export-components` warnings, blocking the no-warning verification target.
- **Fix:** Moved the classifier and subscription store into `src/components/modpacks/primaryActionOwnership.ts` and kept `ModpackRouter.tsx` component-only.
- **Files modified:** `src/components/modpacks/ModpackRouter.tsx`, `src/components/modpacks/primaryActionOwnership.ts`, `src/components/Sidebar.tsx`
- **Verification:** `npx eslint src/components/modpacks/ModpackRouter.tsx src/components/modpacks/primaryActionOwnership.ts src/components/Sidebar.tsx src/components/sidebar/LaunchControls.tsx && npx tsc --noEmit`
- **Committed in:** `1c1c65e`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The extraction kept the ownership seam lint-clean without changing behavior or widening scope.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `19-03` can simplify dense-route layout on top of a stable CTA ownership rule instead of fighting shell-versus-route priority ambiguity.
- The shell now has a reusable ownership seam that later redesign phases can consume without reopening `LaunchControls`.

## Self-Check: PASSED

- Confirmed `.planning/phases/19-baseline-stability-scope-and-shell-invariants/19-02-SUMMARY.md` exists.
- Confirmed task commits `1c1c65e` and `c178fd7` exist in repository history.

---
*Phase: 19-baseline-stability-scope-and-shell-invariants*
*Completed: 2026-04-17*
