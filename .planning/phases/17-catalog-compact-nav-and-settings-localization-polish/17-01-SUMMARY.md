---
phase: 17-catalog-compact-nav-and-settings-localization-polish
plan: "01"
subsystem: ui
tags: [react, vitest, catalog, lazyimage, responsive-layout]
requires:
  - phase: 16-modpack-detail-integrity-and-discoverable-dense-navigation
    provides: truthful modpack surfaces and the current verification seam reused by Phase 17 catalog polish
provides:
  - wrap-friendly installed and remote catalog filter layouts
  - shared launcher-mark fallback behavior for no-art modpack cards
  - focused ergonomics regression coverage for catalog layout and fallback states
affects: [phase-17, catalog, modpacks, verification]
tech-stack:
  added: []
  patterns: [reuse LazyImage fallback defaults, protect layout classes with focused ergonomics tests]
key-files:
  created: [src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx]
  modified: [src/components/modpacks/ModpackList.tsx, src/components/modpacks/ModpackBrowser.tsx, src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx]
key-decisions:
  - "Let catalog cards inherit the shared LazyImage launcher-mark fallback instead of passing '/icon.png' per surface."
  - "Lock the sidebar-width catalog fix with surface-owned ergonomics assertions on the installed and remote filter shells."
patterns-established:
  - "No-art catalog cards use the shared LazyImage fallback contract instead of hardcoded bundled icon paths."
  - "Catalog responsiveness is guarded with focused DOM-class ergonomics tests on shipped surfaces."
requirements-completed: [CATALOG-01, CATALOG-02]
duration: 8min
completed: 2026-04-17
---

# Phase 17 Plan 01: Catalog layout resilience and launcher-mark fallback Summary

**Responsive installed and remote catalog controls with shared launcher-mark fallback states for modpacks missing artwork**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-17T13:50:30Z
- **Completed:** 2026-04-17T13:58:39Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Reworked the installed modpack filter bar so the search and select controls wrap cleanly instead of depending on one cramped fixed-width row.
- Kept the remote browser on the same responsive filter contract, including the current sidebar-width sizing refinements already present in the branch.
- Routed installed and remote modpack cards through the shared `LazyImage` launcher-mark fallback and added focused ergonomics coverage for both layout and no-art states.

## Task Commits

Each task was committed atomically:

1. **Task 1: Make the installed and remote catalog controls stay readable at the shipped sidebar-constrained width** - `e0c13e7` and `bb54b95` (fix)
2. **Task 2: Route missing-art cards through one branded fallback contract and lock it with focused catalog tests** - `f9c14d1` (fix)

**Plan metadata:** pending

## Files Created/Modified

- `src/components/modpacks/ModpackList.tsx` - made the installed catalog filters wrap cleanly and removed the hardcoded generic icon fallback from cards.
- `src/components/modpacks/ModpackBrowser.tsx` - kept the remote browser filters responsive and routed card artwork through the shared fallback contract.
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` - added remote catalog assertions for filter-shell responsiveness and launcher-mark fallback behavior.
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` - added installed catalog coverage for sidebar-width filter readability and no-art fallback behavior.

## Decisions Made

- Reused `LazyImage`'s existing launcher-mark default instead of inventing a second catalog-specific fallback helper.
- Verified the layout fix with focused class-level ergonomics assertions on the live catalog filter shells so the audited sidebar-width regression stays covered.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Concurrent plan-owned edits landed in `ModpackList.tsx` and `ModpackBrowser.tsx` while execution was in progress. The final Task 2 changes were reapplied on top of the current file versions and re-verified before commit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Catalog responsiveness and branded fallback behavior are ready for Phase 18 verification.
- Remaining Phase 17 work is limited to compact navigation coherence and settings/localization polish.

## Self-Check

PASSED
