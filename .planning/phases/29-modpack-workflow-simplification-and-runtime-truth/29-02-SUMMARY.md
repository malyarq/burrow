---
phase: 29-modpack-workflow-simplification-and-runtime-truth
plan: "02"
subsystem: ui
tags: [react, typescript, tailwind, vitest, modpacks]
requires:
  - phase: 29-01
    provides: compact modpack surface restraint and shared catalog density rules
provides:
  - compact modpack details hero container that keeps play, metadata, and tabs above the fold
  - calmer secondary action rail that stops competing with tab discovery
  - focused regression coverage for detail tab reachability and compact route-top density
affects: [29-03, modpack-details, runtime-summary, regression-tests]
tech-stack:
  added: []
  patterns:
    - shared route-top hero container for dense modpack detail surfaces
    - focused reachability regressions for route-primary and secondary detail actions
key-files:
  created: []
  modified:
    - src/components/modpacks/ModpackDetails.tsx
    - src/components/modpacks/details/ModpackDetailsHeader.tsx
    - src/components/modpacks/details/ModpackDetailsActions.tsx
    - src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx
    - src/components/modpacks/__tests__/ModpackDetails.density.test.tsx
    - src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx
key-decisions:
  - "Tabs, header metadata, and the play action now live in one shared hero seam instead of separate competing cards."
  - "Secondary actions stay in a lighter support rail so play remains the only route-primary CTA."
patterns-established:
  - "Modpack details top seams should prefer one outer container with lighter internal support surfaces over stacked cards."
  - "Detail regressions should assert that tabs and the route-primary action remain co-located in the same hero seam."
requirements-completed: [MODPACK-03]
duration: 7min
completed: 2026-04-20
---

# Phase 29 Plan 02: Modpack Workflow Simplification And Runtime Truth Summary

**Compact modpack details hero seam that keeps play primary while making tabs and tab content reachable without header scroll debt**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-20T14:55:30Z
- **Completed:** 2026-04-20T15:02:09Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Reworked the details route so the header, play action, and tabs share one compact hero container instead of reading like separate top-of-route blocks.
- Reduced the visual weight of metadata and secondary actions so tab discovery happens near the content seam without sacrificing route-primary play behavior.
- Added focused regressions that lock the compact hero contract and keep secondary actions from silently re-expanding.

## Task Commits

Each task was committed atomically:

1. **Task 1: Compact the details header and above-the-fold action seam** - `dc92c1d` (feat)
2. **Task 2: Lock details density and tab reachability with focused regressions** - `3bc9972` (test)

**Plan metadata:** pending docs closeout commit created after summary/state updates

## Files Created/Modified
- `src/components/modpacks/ModpackDetails.tsx` - wraps the details header and action rail into a single compact hero seam.
- `src/components/modpacks/details/ModpackDetailsHeader.tsx` - lightens metadata density while keeping the tab surface close to the title seam.
- `src/components/modpacks/details/ModpackDetailsActions.tsx` - turns the action area into a calmer support rail with play still clearly primary.
- `src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx` - verifies the action area stays a compact support rail.
- `src/components/modpacks/__tests__/ModpackDetails.density.test.tsx` - verifies play and tabs remain co-located inside one hero container.
- `src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx` - verifies secondary controls stay small and non-primary.

## Decisions Made
- Kept the existing tab system and route action model, but moved them under one shared hero container instead of introducing new detail navigation.
- Preserved play as the only route-primary action while demoting update review and utility actions into a lighter support rail.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `node "$HOME/.codex/get-shit-done/bin/gsd-tools.cjs" state advance-plan` could not parse the current `STATE.md` shape during closeout, so the state, roadmap, and requirement updates were applied manually to keep plan metadata correct.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The details route now has the compact top seam needed for Phase 29 runtime-summary truth work without further layout churn.
- Runtime and dependency summary unification can build on the calmer header without reopening primary-action ownership.

## Self-Check

PASSED

- FOUND: `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-02-SUMMARY.md`
- FOUND: `dc92c1d`
- FOUND: `3bc9972`

---
*Phase: 29-modpack-workflow-simplification-and-runtime-truth*
*Completed: 2026-04-20*
