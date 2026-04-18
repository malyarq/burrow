---
phase: 23-fallback-error-and-placeholder-productization
plan: "02"
subsystem: ui
tags: [react, typescript, degraded-states, modpacks, screenshots, statistics]
requires:
  - phase: 23-01
    provides: degraded-state view contract, display error sanitization, calm empty/error primitives
provides:
  - route-level failure, empty, and zero-result truth across representative content surfaces
  - calm contextual next-step actions for retry, clear-filters, browse, import, and open-folder flows
  - regression coverage for browser, installed list, screenshots, statistics, and secondary content tabs
affects: [phase-23-closeout, fallback-truth, route-productization]
tech-stack:
  added: []
  patterns: [route-owned degraded states, sanitized failure copy, contextual recovery actions]
key-files:
  created:
    - src/components/modpacks/__tests__/ModpackBrowser.degraded-state.test.tsx
    - src/components/modpacks/__tests__/ModpackList.degraded-state.test.tsx
    - src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx
    - src/components/modpacks/details/__tests__/WorldsTab.degraded-state.test.tsx
  modified:
    - src/components/modpacks/ModpackBrowser.tsx
    - src/components/modpacks/ModpackList.tsx
    - src/components/modpacks/details/ResourcePacksTab.tsx
    - src/components/modpacks/details/ShadersTab.tsx
    - src/components/modpacks/details/WorldDatapacksModal.tsx
    - src/components/modpacks/details/WorldsTab.tsx
    - src/features/screenshots/components/ScreenshotsTab.tsx
    - src/features/settings/statistics/StatisticsTab.tsx
    - src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx
    - src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx
    - src/features/settings/statistics/__tests__/StatisticsTab.test.tsx
key-decisions:
  - "Route-level load failures now render `DegradedStateView` instead of silently collapsing into the same empty cards used for successful but empty states."
  - "Summary metrics switch to explicit `error` or `unavailable` labels during failed loads so the surrounding shell does not contradict the main content state."
  - "Secondary content surfaces keep one contextual next step per state: retry for failed loads, clear filters for zero results, and browse or import actions for true emptiness."
patterns-established:
  - "Representative launcher routes distinguish `error`, `unavailable`, `zero-results`, and `empty` without relying on toast copy as the primary truth surface."
  - "Regression tests scope repeated CTA labels to the degraded-state card so future UI additions in headers do not invalidate route-truth coverage."
requirements-completed: [FALL-02]
duration: 20 min
completed: 2026-04-19
---

# Phase 23 Plan 02: Route Degraded-State Adoption

**Representative launcher routes now distinguish failed-load, empty, zero-result, and unavailable states with calm recovery actions and regression coverage**

## Performance

- **Duration:** 20 min
- **Started:** 2026-04-19T01:29:00+03:00
- **Completed:** 2026-04-19T01:49:45+03:00
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments
- Productized route-level degraded states for the remote browser, installed modpack list, screenshots, statistics, resource packs, shaders, worlds, and world datapacks search and installed tabs.
- Replaced ambiguous empty fallthroughs with explicit `error`, `unavailable`, `zero-results`, and `empty` variants plus contextual actions like retry, clear filters, browse, import, and open folder.
- Added focused regression coverage proving that failed loads no longer collapse into normal empty states and that secondary content tabs preserve truthful unavailable states.

## Task Commits

Each task was committed atomically:

1. **Task 1: Distinguish failed-load, empty, and zero-result states on milestone-owned content routes** - `d22415e` (feat)
2. **Task 2: Add route-level regression coverage for failed-load versus empty-state truth** - `a5c0fe1` (test)

## Files Created/Modified
- `src/components/modpacks/ModpackBrowser.tsx` - Added explicit remote-search error, zero-results, and neutral empty states.
- `src/components/modpacks/ModpackList.tsx` - Added installed-catalog error and empty-state truth with route-owned browse recovery.
- `src/components/modpacks/details/ResourcePacksTab.tsx` - Differentiated unavailable and empty resource-pack states.
- `src/components/modpacks/details/ShadersTab.tsx` - Added truthful unavailable and empty shader states.
- `src/components/modpacks/details/WorldDatapacksModal.tsx` - Split installed-load failure, search failure, zero-results, and empty search states.
- `src/components/modpacks/details/WorldsTab.tsx` - Added unavailable versus empty world-state handling.
- `src/features/screenshots/components/ScreenshotsTab.tsx` - Added a dedicated error state instead of falling through to the empty gallery card.
- `src/features/settings/statistics/StatisticsTab.tsx` - Broke the endless loading loop into loading versus explicit error truth.
- `src/components/modpacks/__tests__/ModpackBrowser.degraded-state.test.tsx` - Covers browser error and zero-results versus empty transitions.
- `src/components/modpacks/__tests__/ModpackList.degraded-state.test.tsx` - Covers installed-list error, zero-results, and true empty states.
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` - Covers resource-pack and datapack unavailable states.
- `src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx` - Covers shader unavailable-state truth.
- `src/components/modpacks/details/__tests__/WorldsTab.degraded-state.test.tsx` - Covers world unavailable-state truth.
- `src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx` - Covers screenshot load failures staying distinct from empty state.
- `src/features/settings/statistics/__tests__/StatisticsTab.test.tsx` - Covers statistics failure state instead of infinite loading.

## Decisions Made
- Reused the shared degraded-state seam from `23-01` everywhere instead of inventing bespoke inline fallback cards per route.
- Kept route-specific next steps small and contextual so the fallback surfaces stay calm instead of turning into branded hero states.
- Scoped repeated CTA assertions inside the degraded-state cards, because shell and header actions now legitimately reuse labels like `Clear filters`, `Refresh`, and `Import`.

## Deviations from Plan

- The original executor was interrupted mid-wave and left a partial diff with no summary; the remaining route adoption and regression coverage were finished locally without changing the planned scope.

## Issues Encountered

- Repeated CTA labels in headers and degraded-state cards caused ambiguous test selectors; coverage was adjusted to scope assertions to the route-owned state surface.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `23-04` can now focus on high-risk dependency, update, share, and closeout truth without reopening the shared degraded-state seam.
- Phase closeout already has focused coverage for the major route surfaces that previously collapsed failure into empty UI.

## Self-Check: PASSED

- Found `.planning/phases/23-fallback-error-and-placeholder-productization/23-02-SUMMARY.md`
- Found commit `d22415e`
- Found commit `a5c0fe1`

---
*Phase: 23-fallback-error-and-placeholder-productization*
*Completed: 2026-04-19*
