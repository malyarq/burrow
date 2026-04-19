---
phase: 24-verification-locale-and-release-truth
plan: "02"
subsystem: manual-verification
tags: [react, typescript, degraded-state, theme, locale, closeout]
requires:
  - phase: 24-01
    provides: v0.5.0 closeout registry and deterministic manual verification foundation
provides:
  - representative shell-integrated degraded-state closeout proof
  - explicit Phase 24 dark/light and EN/RU review targets on stable fixture data
  - final closeout matrix that points reviewers at `phase-24-*` ids instead of earlier phase-local views
affects: [phase-24-closeout-proof, degraded-state-review, locale-theme-evidence]
tech-stack:
  added: []
  patterns: [representative degraded closeout view, closeout-owned comparison pairs, view-specific manual-environment failures]
key-files:
  created:
    - .planning/phases/24-verification-locale-and-release-truth/24-02-SUMMARY.md
  modified:
    - src/verification/manual/views.ts
    - src/verification/manual/scenarios.tsx
    - src/verification/manual/mockEnvironment.ts
key-decisions:
  - "Used one representative shell-integrated degraded closeout view that combines route and secondary-content failures instead of a synthetic error gallery."
  - "Kept dark/light and EN/RU proof under new `phase-24-*` ids so the final milestone story does not route reviewers back through Phase 22 naming."
  - "Triggered degraded proof through manual-environment API failures, preserving real shipped surfaces while keeping fixture behavior deterministic."
patterns-established:
  - "Closeout comparison pairs now isolate theme or locale changes from fixture churn by reusing the same seeded browser and overlay content."
  - "Representative degraded closeout proof reuses Phase 23 productized states instead of inventing separate closeout-only error treatments."
requirements-completed: [VER-01, VER-03]
duration: 18 min
completed: 2026-04-19
---

# Phase 24 Plan 02: Representative Degraded Proof And Explicit Closeout Pairs

**Replaced the degraded placeholder with real shell-integrated failure proof and made the final closeout matrix point directly at `phase-24-*` comparison views.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-04-19T21:26:00+03:00
- **Completed:** 2026-04-19T21:44:00+03:00
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Replaced the Wave 1 degraded placeholder with a representative real-shell closeout view that shows route-level add-mod search failure plus secondary screenshots load failure.
- Promoted Phase 24 theme and locale pairs into the obvious review surface by keeping the final closeout matrix anchored on `phase-24-theme-*` and `phase-24-locale-*`.
- Added view-specific mock failures so degraded closeout proof exercises the same productized Phase 23 states reviewers will actually ship.

## Task Commits

Each task was committed atomically:

1. **Task 1-2: Expand the closeout proof matrix with degraded-state and comparison-pair evidence** - `c82a6cd` (feat)

## Files Created/Modified

- `src/verification/manual/views.ts` - updated degraded closeout metadata so the view advertises representative failure proof rather than a reserved slot.
- `src/verification/manual/scenarios.tsx` - replaced the placeholder degraded closeout card with real shell-integrated `AddModPage` and `ScreenshotsTab` degraded states.
- `src/verification/manual/mockEnvironment.ts` - added view-specific API failures for mods, screenshots, share, and statistics so the degraded closeout lane stays deterministic while exercising shipped Phase 23 seams.

## Decisions Made

- Used the add-mod route and screenshots secondary surface as the representative degraded pair because together they prove both route-level and nested secondary-content fallback behavior without inventing new harness components.
- Left the final closeout pair content on the same seeded route fixtures from Wave 1 so only theme or locale differs between paired views.
- Kept extra degraded mock branches for share and statistics ready in the environment even though the primary closeout proof currently renders add-mod plus screenshots, reducing rework if Wave 3 snapshots need a broader degraded matrix.

## Deviations from Plan

- None.

## Issues Encountered

- The first degraded callout copy still referred to a `slot` after the placeholder was replaced; the wording was corrected before the final Wave 2 gate so the closeout matrix reads as shipped evidence, not pending work.

## User Setup Required

None.

## Next Phase Readiness

- Wave 3 can bind Chromium screenshots directly to the named Phase 24 closeout ids, including degraded-state proof, without further hub restructuring.
- Release proof now has explicit dark/light, EN/RU, and degraded review targets to cite in validation and docs.

## Self-Check: PASSED

- Found `.planning/phases/24-verification-locale-and-release-truth/24-02-SUMMARY.md`
- Found commit `c82a6cd`
- `git diff --check -- src/verification/manual/views.ts src/verification/manual/scenarios.tsx src/verification/manual/mockEnvironment.ts`
- `npx eslint src/verification/manual/views.ts src/verification/manual/scenarios.tsx src/verification/manual/mockEnvironment.ts`
- `npx vitest run src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/share/__tests__/ShareFlows.test.tsx src/components/__tests__/ErrorBoundary.recovery.test.tsx`
- `npx vitest run src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/utils/__tests__/format.test.ts src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `npx tsc --noEmit`

---
*Phase: 24-verification-locale-and-release-truth*
*Completed: 2026-04-19*
