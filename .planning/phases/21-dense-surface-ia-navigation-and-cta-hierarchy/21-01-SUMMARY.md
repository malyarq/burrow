---
phase: 21-dense-surface-ia-navigation-and-cta-hierarchy
plan: "01"
subsystem: ui
tags: [react, typescript, modpacks, vitest, density, ergonomics]
requires:
  - phase: 19-launch-truth-and-shared-surface-contracts
    provides: shell-safe geometry and route-owned CTA hierarchy for dense modpack surfaces
  - phase: 20-brand-system-shared-tokens-and-surface-migration
    provides: shared brand primitives and neutral artwork fallback policy for catalog cards
provides:
  - grouped filter rails and labeled summary metrics for remote and installed modpack catalogs
  - explicit metadata blocks and stable primary action placement for crowded catalog cards
  - constrained-width density regression coverage for browser and installed list surfaces
affects: [21, modpacks, catalog, density, verification]
tech-stack:
  added: []
  patterns: [grouped filter grids for dense desktop rails, labeled metadata tiles with one visible primary card action]
key-files:
  created: [src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx]
  modified: [src/components/modpacks/ModpackBrowser.tsx, src/components/modpacks/ModpackList.tsx, src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx, src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx, src/components/modpacks/__tests__/ModpackList.actions.test.tsx, src/components/modpacks/__tests__/ModpackList.quick-actions.test.tsx]
key-decisions:
  - "Replaced wrap-prone filter rows with grouped filter grids so dense desktop widths keep one readable control structure instead of orphaned selects."
  - "Kept Phase 19 card ownership intact by preserving card activation while adding one explicit primary CTA and labeled metadata blocks per catalog card."
  - "Used crowded long-title fixtures in browser and installed tests rather than broad visual rewrites, keeping the phase scoped to density truth."
patterns-established:
  - "Dense catalog summaries should expose labeled metrics and active-filter tokens instead of unlabeled badge piles."
  - "Catalog cards should present one visible primary action and secondary controls in a stable footer grid under metadata pressure."
requirements-completed: [SHELL-04, DENSE-01, DENSE-04]
duration: 7 min
completed: 2026-04-18
---

# Phase 21 Plan 01: Catalog Density And CTA Hierarchy Summary

**Grouped browser and installed catalog rails with labeled metadata tiles, explicit primary card actions, and crowded-width regression coverage for dense desktop modpack browsing**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-17T22:40:00Z
- **Completed:** 2026-04-17T22:47:23Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Reworked `ModpackBrowser` and `ModpackList` so dense desktop filter rails use grouped layouts with visible field context, summary metrics, and reset behavior instead of ambiguous wrapped rows.
- Converted remote and installed catalog cards to explicit metadata blocks with one visible primary action and stable secondary controls, while preserving existing Phase 19 CTA ownership and Phase 20 fallback seams.
- Added a dedicated catalog density seam plus updated ergonomics and action tests that use long titles, crowded metadata, and filter pressure to prevent regressions.

## Task Commits

Each task was committed atomically:

1. **Task 1: Rebuild catalog filter, summary, and card hierarchy around shipped desktop width limits** - `381d8df` (feat)
2. **Task 2: Add crowded catalog density tests for long labels, stacked metadata, and action-wrap pressure** - `64eee34` (test)

**Plan metadata:** Pending final docs commit

## Files Created/Modified
- `src/components/modpacks/ModpackBrowser.tsx` - Rebuilds remote catalog summary, grouped filter controls, and dense card metadata/action structure.
- `src/components/modpacks/ModpackList.tsx` - Rebalances installed catalog summary, grouped filters, metadata tiles, and stable action footer ownership.
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` - Updates browser ergonomics expectations for grouped controls and labeled dense-card metadata.
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` - Updates installed-list ergonomics coverage for grouped rails and metadata tiles.
- `src/components/modpacks/__tests__/ModpackList.actions.test.tsx` - Keeps action-menu ownership tested with denser title pressure.
- `src/components/modpacks/__tests__/ModpackList.quick-actions.test.tsx` - Keeps quick-action ownership tested with denser footer copy and active-state pressure.
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx` - Adds dedicated crowded-width regression coverage for browser and installed catalog density.

## Decisions Made
- Used grouped filter grids instead of wider flex-wrap rows so the shipped desktop widths keep filter categories aligned and readable.
- Preserved whole-card activation but attached one visible primary button to each card, which keeps CTA hierarchy explicit without reopening Phase 19 ownership rules.
- Limited regression expansion to the catalog seams already owned by the phase and used long-label fixtures there instead of pulling in unrelated detail-route or error-state work.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 21 plan 02 can build detail-route hierarchy on top of catalog surfaces that now expose stable dense-layout patterns and explicit CTA ownership.
- Phase 21 plan 03 can reuse the labeled-summary expectation from catalog surfaces when unifying create and edit runtime truth.

## Self-Check
PASSED

- Found `.planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-01-SUMMARY.md`
- Found task commit `381d8df`
- Found task commit `64eee34`

---
*Phase: 21-dense-surface-ia-navigation-and-cta-hierarchy*
*Completed: 2026-04-18*
