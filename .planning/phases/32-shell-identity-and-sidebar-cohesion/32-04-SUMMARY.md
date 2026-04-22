---
phase: 32-shell-identity-and-sidebar-cohesion
plan: "04"
subsystem: verification
tags: [react, verification, manual-proof, shell, copy-boundary]
requires:
  - phase: 32-shell-identity-and-sidebar-cohesion
    provides: sidebar readability, native macOS shell restraint, and calm fallback surfaces from 32-01 through 32-03
provides:
  - manual proof wording aligned to the direct-feedback shell contract
  - regression tests that reject stale shell-brand readiness copy
affects: [SHELL-09, SHELL-10, BRAND-01, manual-proof-harness]
tech-stack:
  added: []
  patterns: [manual-proof-as-product-truth, copy-boundary regression]
key-files:
  created: [.planning/phases/32-shell-identity-and-sidebar-cohesion/32-04-SUMMARY.md]
  modified: [src/verification/manual/scenarios.tsx, src/verification/manual/__tests__/appearanceProof.test.tsx, src/verification/manual/__tests__/views.test.ts]
key-decisions:
  - "Manual proof wording is treated as a product seam because stale copy previously helped mask open shell regressions."
  - "Phase 32 proof routes now speak about sidebar readability, native macOS shell behavior, and calm fallback surfaces instead of older brand-reset language."
patterns-established:
  - "Future shell closeouts must update manual-proof copy when the live product contract changes."
requirements-completed: [SHELL-09, SHELL-10, BRAND-01]
duration: not recorded
completed: 2026-04-22
---

# Phase 32 Plan 04 Summary

**Manual proof routes now describe readable sidebar identity, native macOS shell behavior, and calm fallback surfaces instead of stale shell-brand wording.**

## Performance

- **Duration:** not recorded
- **Started:** 2026-04-22T11:09:00+0300
- **Completed:** 2026-04-22T13:07:36+0300
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Rewrote the Phase 32-relevant manual readiness and scenario copy around the direct feedback contract instead of old milestone-specific shell-brand language.
- Added copy-boundary assertions so proof routes now fail if the app drifts back to stale “brand reset” readiness text.
- Kept the manual verification harness lightweight by reusing existing routes and only changing the proof language that had become misleading.

## Task Commits

1. **Task 1: Rewrite Phase 32 manual view descriptions and readiness signals around the new shell contract** - not committed
2. **Task 2: Lock the refreshed proof harness with narrow regression tests** - not committed

**Commit status:** intentionally skipped because the worktree already contained unrelated local edits, so creating an atomic task commit would have bundled baseline changes outside this plan.

## Files Created/Modified

- `src/verification/manual/scenarios.tsx` - updated readiness and scenario text to the new sidebar, macOS shell, and fallback contract.
- `src/verification/manual/__tests__/appearanceProof.test.tsx` - locked the updated readiness language.
- `src/verification/manual/__tests__/views.test.ts` - added proof that manual routes reject stale launcher-brand fallback wording.

## Decisions Made

- Treated proof wording as product behavior because closeout criteria that describe the wrong thing are themselves a product risk.
- Kept route registration stable and limited the change to scenario copy plus regression seams instead of inventing another proof subsystem.

## Deviations from Plan

- `src/verification/manual/views.ts` was inspected but did not require changes; the existing route registry remained accurate once scenario copy and route tests were updated.

## Issues Encountered

- The misleading part of the old harness was not route structure but route language, so the real fix was tighter copy-boundary testing rather than another view-model rewrite.
- Manual proof hub walkthrough was not rerun interactively in this turn, so human confirmation of the refreshed copy remains signoff debt even though the harness tests are green.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Future verification work now starts from Phase 32’s direct-feedback shell criteria instead of stale brand-reset assumptions.
- No additional implementation work is needed for `32-04`; remaining signoff is a human walkthrough of the proof hub itself.

