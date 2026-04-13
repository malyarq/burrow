---
phase: 09-secondary-surface-alignment-and-ux-polish
plan: "02"
subsystem: ui
tags: [react, settings, localization, accessibility, vitest]
requires:
  - phase: 07-ui-system-foundations
    provides: shared card, panel, helper-text, and theme contracts
  - phase: 08-core-route-rollout-and-ui-correctness
    provides: truthful settings route ownership and refreshed accounts/settings seams
provides:
  - secondary settings utilities aligned on one shared settings-surface contract
  - clearer helper copy and localized destructive or long-running actions for launcher, downloads, storage, mirrors, and statistics
  - focused regression coverage for the lower-traffic settings seam
affects: [settings-route, mirrors, statistics, launcher-tab, downloads-tab, storage-tab]
tech-stack:
  added: []
  patterns: [secondary-settings-surface-contract, route-owned-settings-hints, focused-utility-regression-tests]
key-files:
  created: [src/components/settings/__tests__/SecondarySettingsTabs.test.tsx]
  modified: [src/components/SettingsPage.tsx, src/components/settings/tabs/DownloadsTab.tsx, src/components/settings/tabs/LauncherTab.tsx, src/components/settings/tabs/StorageTab.tsx, src/features/settings/mirrors/MirrorsSettings.tsx, src/features/settings/statistics/StatisticsTab.tsx, src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx, src/features/settings/statistics/__tests__/StatisticsTab.test.tsx, src/locales/en.json, src/locales/ru.json]
key-decisions:
  - "Kept the existing mirrors and statistics IPC seams untouched and limited this plan to surface alignment, route-owned helper copy, and accessibility semantics."
  - "Used the settings route footer as a truthful per-tab hint surface instead of leaving lower-traffic tabs with generic or stale messaging."
patterns-established:
  - "Lower-traffic settings tabs should still open with a clear card header, helper copy, and shared card grammar instead of route-local utility chrome."
  - "When a settings slice is refreshed, the route shell, locale strings, and focused seam tests should land together so placeholder copy and detached utility styling do not drift back in."
requirements-completed: [UX-04, A11Y-04]
duration: 20min
completed: 2026-04-13
---

# Phase 9 Plan 02: Secondary Surface Alignment And UX Polish Summary

**Mirrors, statistics, launcher utilities, downloads, and storage now behave like one owned settings product instead of a pile of leftover tools**

## Performance

- **Duration:** 20 min
- **Started:** 2026-04-13T11:35:08+03:00
- **Completed:** 2026-04-13T11:55:08+03:00
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Rebuilt the lower-traffic settings tabs on shared `surface-card`, `surface-panel`, and helper-text patterns so downloads, launcher, storage, mirrors, and statistics stop looking visually detached from the refreshed route.
- Added truthful per-tab route hints and localized copy for connection tuning, cache management, storage cleanup, mirror configuration, and statistics export.
- Extended focused regression coverage so the secondary settings route keeps accessible labels, tab switching, and representative utility content after the refresh.

## Task Commits

1. **Task 1: Align mirrors, statistics, and settings utility cards with the shared system** - pending commit
2. **Task 2: Prove the secondary settings seam with focused accessibility and route tests** - pending commit

## Files Created/Modified

- `src/components/SettingsPage.tsx` - route-owned tab hints now reflect the active utility panel instead of falling back to generic copy.
- `src/components/settings/tabs/DownloadsTab.tsx`, `src/components/settings/tabs/LauncherTab.tsx`, and `src/components/settings/tabs/StorageTab.tsx` - shared settings-card layout, clearer long-running or destructive action copy, and improved keyboard or loading semantics.
- `src/features/settings/mirrors/MirrorsSettings.tsx` and `src/features/settings/statistics/StatisticsTab.tsx` - refreshed headers, shared form controls or cards, and better localized supporting text.
- `src/locales/en.json` and `src/locales/ru.json` - completed the copy required for the refreshed secondary settings surfaces.
- `src/components/settings/__tests__/SecondarySettingsTabs.test.tsx`, `src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx`, and `src/features/settings/statistics/__tests__/StatisticsTab.test.tsx` - focused regression coverage for the lower-traffic settings seam.

## Decisions Made

- Kept the work at the route and component-surface layer instead of adding new settings backends, because the problem in this plan was product coherence and accessibility drift, not missing IPC capabilities.
- Treated storage loading and cleanup as first-class states in the refreshed settings surface so users do not have to infer whether the route is busy or whether a destructive action succeeded.

## Deviations from Plan

None.

## Issues Encountered

- The settings seam test needed route-local mocks for lower-traffic tabs to keep the assertions focused on shell behavior rather than turning into a broad integration suite.
- Several touched strings still relied on partial fallback behavior, so the locales had to be completed before the tab-level polish could be considered truthful.

## User Setup Required

None.

## Next Phase Readiness

- `09-03` can now align secondary content-management tabs on top of a stable settings route rather than inheriting visual drift from launcher utilities.
- The secondary settings tests now lock the refreshed shell semantics, making later accessibility or atmosphere work in `09-04` safer.

---
*Phase: 09-secondary-surface-alignment-and-ux-polish*
*Completed: 2026-04-13*
