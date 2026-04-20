---
phase: 28-product-restraint-and-native-shell-truth
plan: 03
subsystem: ui
tags: [react, vitest, locales, modpacks, updater]
requires:
  - phase: 28-01
    provides: native-first shell notification placement below the title-bar seam
  - phase: 28-02
    provides: restrained launcher-home surfaces that stay free of extra update urgency
provides:
  - local-only modpack update affordances on list cards, details actions, and the review modal
  - launcher-banner copy that clearly describes app updates instead of generic update urgency
  - regression coverage for positive local update signals and negative shell/home assertions
affects: [phase-29-modpack-workflow-simplification-and-runtime-truth, launcher-home, shell-surfaces]
tech-stack:
  added: []
  patterns: [data-update-scope ownership markers, launcher-specific updater copy, play-first details actions]
key-files:
  created: []
  modified:
    - src/components/UpdateNotification.tsx
    - src/components/modpacks/ModpackList.tsx
    - src/components/modpacks/details/ModpackDetailsActions.tsx
    - src/components/modpacks/ModpackUpdateModal.tsx
    - src/components/__tests__/UpdateNotification.layout.test.tsx
    - src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx
    - src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx
    - src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx
    - src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx
    - src/locales/en.json
    - src/locales/ru.json
key-decisions:
  - "The shell banner now names launcher updates explicitly so modpack updates stay scoped to pack surfaces."
  - "Play remains the only route-primary details CTA; update review is a local secondary affordance."
patterns-established:
  - "App-shell vs modpack-local update ownership is encoded through `data-update-scope` markers for regression tests."
  - "Local update review uses calm copy and demoted actions rather than competing with launch."
requirements-completed: [SHELL-07]
duration: 5min
completed: 2026-04-20
---

# Phase 28 Plan 03: Modpack Update Locality Summary

**Local modpack update badges and review flows now stay on pack surfaces while the shell banner clearly refers only to launcher updates**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-20T11:11:23Z
- **Completed:** 2026-04-20T11:16:23Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Kept pack update signals on modpack list cards, details actions, and the local review modal instead of shell-level surfaces.
- Demoted the details review affordance so Play remains the only route-primary action when a pack update exists.
- Locked negative shell/home assertions and positive local-update assertions with focused vitest coverage.

## Task Commits

Each task was committed atomically:

1. **Task 1: Harden list and detail update surfacing so launch stays primary** - `17cec56` (fix)
2. **Task 2: Add positive and negative regression coverage for update locality** - `76235b4` (test)

**Plan metadata:** pending at summary creation time; added in the final docs commit

## Files Created/Modified
- `src/components/UpdateNotification.tsx` - Marks the shell banner as `app-shell` scoped and uses launcher-specific update copy.
- `src/components/modpacks/ModpackList.tsx` - Keeps per-pack update badges local and visually calmer.
- `src/components/modpacks/details/ModpackDetailsActions.tsx` - Preserves Play as the primary CTA and demotes update review to a local secondary action.
- `src/components/modpacks/ModpackUpdateModal.tsx` - Names the modal as a review flow and tags it as `modpack-local`.
- `src/components/__tests__/UpdateNotification.layout.test.tsx` - Asserts the global banner stays launcher-scoped and inline below shell chrome.
- `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx` - Asserts launcher-home stays free of modpack update urgency.
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` - Asserts update badges stay on modpack cards with calm styling.
- `src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx` - Asserts Play remains the only route-primary action and update review stays demoted.
- `src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx` - Asserts the local review modal stays pack-scoped even when updates load successfully.
- `src/locales/en.json` - Clarifies launcher-update copy and adds a review-oriented modal title.
- `src/locales/ru.json` - Mirrors the launcher-update copy and review-oriented modal title in Russian.

## Decisions Made

- Used explicit launcher-update copy in the shell banner so the global notification area cannot read like a second modpack urgency channel.
- Added `data-update-scope` ownership markers to strengthen negative shell assertions and positive modpack-surface assertions without introducing a new store.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `SHELL-07` is now locked with both product-surface and regression-test coverage.
- Phase `28-04` can focus on reopen/restart truth without revisiting update-locality behavior.

## Self-Check: PASSED

- Found `.planning/phases/28-product-restraint-and-native-shell-truth/28-03-SUMMARY.md`.
- Found task commits `17cec56` and `76235b4` in git history.
