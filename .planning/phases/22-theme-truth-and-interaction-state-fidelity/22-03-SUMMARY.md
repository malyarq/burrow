---
phase: 22-theme-truth-and-interaction-state-fidelity
plan: "03"
subsystem: ui
tags: [react, typescript, modpacks, settings, screenshots, locale, vitest]
requires:
  - phase: 22-theme-truth-and-interaction-state-fidelity
    provides: runtime locale helpers and shared control state contract from 22-01 and 22-02
  - phase: 21-dense-surface-ia-navigation-and-cta-hierarchy
    provides: dense route geometry and CTA ownership that this plan preserves
provides:
  - milestone-owned modpack and secondary-content routes that reuse the shared accent-backed active or inactive state contract
  - locale-aware route metadata for dates, counts, and duration summaries on statistics, screenshots, worlds, and modpack catalog surfaces
  - focused regression seams for modpack route state truth and screenshots locale formatting
affects: [22, modpacks, screenshots, statistics, locale, verification]
tech-stack:
  added: []
  patterns: [route-level accent state adoption, locale-bound route metadata, focused UI regression seams]
key-files:
  created: [src/components/modpacks/__tests__/ModpackThemeState.test.tsx, src/features/screenshots/components/__tests__/ScreenshotsTab.test.tsx]
  modified: [src/components/modpacks/ModpackList.tsx, src/components/modpacks/ModpackBrowser.tsx, src/components/modpacks/details/ModpackDetailsHeader.tsx, src/components/modpacks/AddModModal.tsx, src/components/modpacks/details/ModpackDetailsModsTab.tsx, src/components/modpacks/details/WorldDatapacksModal.tsx, src/components/modpacks/details/WorldsTab.tsx, src/components/modpacks/ImportModpackPreviewPage.tsx, src/features/settings/statistics/StatisticsTab.tsx, src/features/screenshots/components/ScreenshotsTab.tsx, src/locales/en.json, src/locales/ru.json]
key-decisions:
  - "Route-owned state seams now reuse the same accent-backed `soft-bg` and `soft-border` contract as settings instead of bespoke selected, favorite, and tab styling."
  - "Locale-sensitive route metadata now flows through `useSettings().formatDate` and `formatNumber` instead of ambient `toLocaleDateString(undefined)` or raw numeric interpolation."
  - "Statistics duration copy stayed local to the route, but the time-unit labels moved into translation files so EN and RU can render truthful short-unit summaries."
patterns-established:
  - "Milestone-owned content routes should consume shared accent state tokens before inventing route-local active or disabled treatments."
  - "Any redesigned route that surfaces counts or dates should pass formatted strings into translation params rather than interpolating raw numbers."
requirements-completed: [THEME-01, THEME-02, THEME-04]
duration: 24 min
completed: 2026-04-18
---

# Phase 22 Plan 03: Route Adoption On Milestone-Owned Content Surfaces Summary

**Milestone-owned modpack and secondary-content routes now speak the same interaction-state and locale truth as the settings shell**

## Performance

- **Duration:** 24 min
- **Started:** 2026-04-18T12:10:00+03:00
- **Completed:** 2026-04-18T12:33:42+03:00
- **Tasks:** 2
- **Files modified:** 29

## Accomplishments
- Moved installed and remote modpack routes onto the shared accent-backed state contract by fixing selected cards, favorite toggles, history toggles, active badges, and representative secondary tabs.
- Replaced ambient date and number formatting on route-owned metadata with `useSettings().formatDate` and `formatNumber`, including results summaries, screenshots, worlds, statistics, and representative modpack summaries.
- Added and extended regression coverage so route-level state markers and locale-bound metadata are now locked by focused tests instead of relying on visual inspection only.

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate milestone-owned content routes onto the shared state and locale contract** - `9cc1fb3` (feat)
2. **Task 2: Add route-level regression coverage for state fidelity and locale-sensitive presentation** - `1bd6a3b` (test)

**Plan metadata:** Pending final docs commit

## Files Created/Modified
- `src/components/modpacks/ModpackList.tsx` - Moves selected installed cards, summary counts, and updated metadata onto shared accent and locale helpers.
- `src/components/modpacks/ModpackBrowser.tsx` - Aligns favorite and history toggles with the shared active-state contract and localizes result, history, pagination, and metadata formatting.
- `src/components/modpacks/details/ModpackDetailsHeader.tsx` - Adds explicit tab state markers and stronger inactive/focus treatment without reopening layout geometry.
- `src/components/modpacks/AddModModal.tsx` - Replaces one-off selected rows and raw download counts with accent-backed state styling and locale-aware numbers.
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx` - Replaces opacity-only disabled rows with explicit inactive surface treatment.
- `src/components/modpacks/details/WorldDatapacksModal.tsx` - Reuses shared tab state tokens, labels summary counts, and keeps inactive datapack rows readable without opacity suppression.
- `src/components/modpacks/details/WorldsTab.tsx` - Uses settings-owned date and number formatters for world counts and last-played metadata.
- `src/components/modpacks/ImportModpackPreviewPage.tsx` - Formats manifest file counts through the active locale helper.
- `src/features/settings/statistics/StatisticsTab.tsx` - Localizes numbers, dates, and time-unit summaries while moving trend bars onto accent-derived colors instead of hard-coded emerald and blue.
- `src/features/screenshots/components/ScreenshotsTab.tsx` - Formats screenshot counts and created dates through the active locale helper.
- `src/locales/en.json`, `src/locales/ru.json` - Add short statistics time-unit labels so duration summaries can stay localized.
- `src/components/modpacks/__tests__/ModpackThemeState.test.tsx` - Covers accent-backed favorite, history, and installed-card state markers on route-owned modpack surfaces.
- `src/features/screenshots/components/__tests__/ScreenshotsTab.test.tsx` - Covers locale-aware screenshot count and date rendering.
- Existing route regression files - Updated mocks and assertions so changed seams stay type-safe and verify state/locale truth directly.

## Decisions Made
- Route-level active state now uses the shared `soft-bg` and `soft-border` contract even on content surfaces, keeping Phase 22 consistent with settings instead of inventing another visual dialect.
- Statistics durations stayed route-local for now, but the `h/m/s` labels are no longer hard-coded English and instead flow from locale files.
- The plan stayed inside route adoption and regression coverage only; no degraded-state, placeholder, or shell-geometry work was pulled forward from Phase 23 or Phase 19.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- A first wide `apply_patch` attempt for `22-03` failed on stale `ModpackBrowser` context. I switched to smaller file-by-file patches to keep the write set bounded and avoid hidden partial edits.
- A few pre-existing tests asserted legacy route structure too literally (`flex-wrap` tablist expectation and single-node `Active`/`stats.launches` matches). I rewired those checks toward explicit state markers and locale seams so the regression layer matches the current product contract.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `22-04` can now verify the live shell proof against route surfaces that already share the Phase 22 state and locale contract.
- Phase 23 can focus on degraded states, placeholders, and fatal-error productization without first cleaning up route-level formatting drift.

## Self-Check
PASSED

- Found `.planning/phases/22-theme-truth-and-interaction-state-fidelity/22-03-SUMMARY.md`
- Found task commit `9cc1fb3`
- Found task commit `1bd6a3b`

---
*Phase: 22-theme-truth-and-interaction-state-fidelity*
*Completed: 2026-04-18*
