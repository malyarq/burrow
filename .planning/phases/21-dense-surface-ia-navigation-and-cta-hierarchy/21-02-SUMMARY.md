---
phase: 21-dense-surface-ia-navigation-and-cta-hierarchy
plan: "02"
subsystem: ui
tags: [react, modpacks, dense-layout, vitest]
requires:
  - phase: 19
    provides: route-primary action ownership and shared modal scroll ownership
  - phase: 21-01
    provides: label-first dense-surface hierarchy patterns carried from catalog into details
provides:
  - details-route top hierarchy that groups metadata, tabs, and route actions without competing CTA clusters
  - labeled dense secondary-content summaries for mods, resource packs, and world datapacks
  - constrained-width regression coverage for details density and modal scroll ownership
affects: [21-03, 21-04, 22-theme-truth-and-interaction-state-fidelity]
tech-stack:
  added: []
  patterns:
    - labeled metadata cards and grid tab navigation for dense detail headers
    - modal-body scroll ownership with no nested internal scrollers on dense secondary content
key-files:
  created:
    - src/components/modpacks/__tests__/ModpackDetails.density.test.tsx
  modified:
    - src/components/modpacks/ModpackDetails.tsx
    - src/components/modpacks/details/ModpackDetailsHeader.tsx
    - src/components/modpacks/details/ModpackDetailsActions.tsx
    - src/components/modpacks/details/ModpackDetailsModsTab.tsx
    - src/components/modpacks/details/ResourcePacksTab.tsx
    - src/components/modpacks/details/WorldDatapacksModal.tsx
    - src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx
key-decisions:
  - "Keep details-route primary action ownership from Phase 19 and move route actions into the top hierarchy instead of a footer-like trailing strip."
  - "Let the shared Modal body own datapack scrolling and replace raw count ratios with labeled summary cards on dense secondary tabs."
patterns-established:
  - "Dense details surfaces separate primary route actions from secondary management actions inside one top-level hierarchy."
  - "Dense secondary tabs expose hint copy plus labeled count cards instead of inline unlabeled ratios."
requirements-completed: [SHELL-04, DENSE-02, DENSE-04]
duration: 5min
completed: 2026-04-18
---

# Phase 21 Plan 02: Details IA, Tab Hierarchy, And Dense Secondary Content Summary

**Modpack details now render as one top-level hierarchy with labeled metadata cards, grid-based tab navigation, separated route actions, and dense-secondary summaries that stay readable without nested modal scrollers.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-17T23:01:09Z
- **Completed:** 2026-04-17T23:06:22Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Reworked the details route so metadata, tab navigation, and route actions live in one readable top hierarchy instead of a stacked header plus footer-action strip.
- Split route-primary and secondary management actions while keeping Phase 19’s single-primary-action contract intact.
- Normalized dense secondary-content summaries for mods, resource packs, and datapacks, and added constrained-width regression coverage for the details route plus datapacks modal scroll ownership.

## Task Commits

Each task was committed atomically:

1. **Task 1: Recompose the details route so metadata, tabs, and actions read as one hierarchy** - `c3b5777` (feat)
2. **Task 2: Normalize representative dense-secondary seams and lock constrained-width details coverage** - `1806d3e` (test)

## Files Created/Modified

- `src/components/modpacks/ModpackDetails.tsx` - moved route actions into the top hierarchy and removed the old footer-like action strip.
- `src/components/modpacks/details/ModpackDetailsHeader.tsx` - replaced paragraph metadata with labeled cards and converted the tab rail into a grid-based hierarchy.
- `src/components/modpacks/details/ModpackDetailsActions.tsx` - separated route-primary actions from secondary management actions inside a labeled action card.
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx` - labeled dense mod counts and reduced wrap pressure for long file and mod names.
- `src/components/modpacks/details/ResourcePacksTab.tsx` - replaced raw ratios with labeled resource-pack summary cards and improved dense row text handling.
- `src/components/modpacks/details/WorldDatapacksModal.tsx` - removed nested internal scrollers, added labeled installed and search summaries, and kept dense rows readable.
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` - covered labeled dense secondary summaries and the shared modal scroll contract.
- `src/components/modpacks/__tests__/ModpackDetails.density.test.tsx` - added constrained-width details hierarchy coverage with long metadata and long tab labels.

## Decisions Made

- Kept details-route CTA ownership on the Phase 19 seam and changed hierarchy around it instead of re-deciding the primary action.
- Treated labeled counts and shared-scroll ownership as the density rule for representative secondary tabs, rather than redesigning every secondary surface in this plan.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The first `git commit` attempt collided with a stale `.git/index.lock` created by an overlapping add and commit command; removing the lock and retrying sequentially resolved it.
- The repository already had `21-01` planning docs staged in the index, so Task 1’s commit also captured that pre-staged planning work. I left history intact and isolated the remaining task with cached-file verification before committing.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for `21-03` to unify create and edit runtime-summary truth on top of the new details-route hierarchy.
- Ready for `21-04` manual proof because constrained-width details density and dense secondary-count seams are now regression-protected.

## Self-Check: PASSED

- Found summary file at `.planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-02-SUMMARY.md`.
- Verified task commits `c3b5777` and `1806d3e` exist in `git log --oneline --all`.
