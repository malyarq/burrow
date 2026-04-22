---
phase: 36-settings-predictability-and-shared-control-contract
plan: "01"
subsystem: ui
tags: [react, settings, accessibility, tabs, statistics]
requires: []
provides:
  - shell-owned settings summary copy above embedded panels
  - compact segmented settings tab rail with preserved tab semantics
  - embedded statistics surface that no longer repeats shell-level guidance
affects: [appearance, launcher, storage, accounts, statistics, manual-verification]
tech-stack:
  added: []
  patterns:
    - shell-owned tab summary contract
    - segmented control geometry for settings navigation
key-files:
  created:
    - src/components/__tests__/SettingsPage.layout.test.tsx
  modified:
    - src/components/SettingsPage.tsx
    - src/components/settings/SettingsTabsHeader.tsx
    - src/components/settings/settingsTabs.ts
    - src/features/settings/statistics/StatisticsTab.tsx
    - src/components/__tests__/SettingsPage.navigation.test.tsx
    - src/components/settings/__tests__/SecondarySettingsTabs.test.tsx
    - src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx
    - src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx
key-decisions:
  - "The settings shell now owns first-read summary copy; the tab rail only exposes compact labels and tab semantics."
  - "Embedded statistics keeps headings and data only, leaving repeated summary language to the shell."
patterns-established:
  - "Settings shell pattern: one summary surface before the tabpanel, not stacked tab cards plus a second summary strip."
  - "Secondary settings proof pattern: assert shared summary copy appears once across shell and embedded panels."
requirements-completed: [SETTINGS-05]
duration: 15min
completed: 2026-04-22
---

# Phase 36 Plan 01: Settings Shell Density Summary

**One shell-owned settings summary, a compact segmented tab rail, and embedded statistics that stops repeating shell guidance**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-22T17:23:00Z
- **Completed:** 2026-04-22T17:37:36Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Replaced the stacked settings tab cards plus summary strip with one shell-owned header above the real panel.
- Converted the settings tab chooser into a compact segmented control while keeping `role="tab"` keyboard navigation intact.
- Removed repeated statistics summary copy from the embedded panel and locked the one-copy contract into focused tests.

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace stacked settings chrome with one lighter shell contract and land the shell-layout seam** - `9e72e99` (feat)
2. **Task 2: Remove shell-level copy duplication from tabs and embedded statistics without weakening context** - `069e9d0` (fix)

**Plan metadata:** pending at summary creation time

## Files Created/Modified
- `src/components/SettingsPage.tsx` - collapsed the summary strip into one shell header above the shared tabpanel.
- `src/components/settings/SettingsTabsHeader.tsx` - switched the tab selector to a compact segmented rail with preserved tab semantics.
- `src/components/settings/settingsTabs.ts` - simplified the shell summary contract by removing duplicate `panelHint` config.
- `src/features/settings/statistics/StatisticsTab.tsx` - removed repeated shell-level statistics copy from the embedded surface.
- `src/components/__tests__/SettingsPage.layout.test.tsx` - added the missing shell-level seam for duplicate-copy and stacked-chrome regressions.
- `src/components/__tests__/SettingsPage.navigation.test.tsx` - updated navigation coverage to assert shell-owned summaries as tabs change.
- `src/components/settings/__tests__/SecondarySettingsTabs.test.tsx` - enforces one-copy summaries across secondary tabs.
- `src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx` - updated state assertions for the segmented rail contract.
- `src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx` - proves the embedded statistics surface no longer reintroduces summary copy.

## Decisions Made

- Moved first-read settings guidance into the shell header instead of keeping visible descriptions on each tab button.
- Kept the compact tab rail on the same segmented-control geometry used elsewhere in settings to reinforce the shared control contract ahead of later Phase 36 work.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Attempted a live manual review via `http://127.0.0.1:4173/manual-verification.html?view=settings-appearance`, but browser automation was blocked in this environment.
  - `npx playwright install chromium` failed through the proxy with HTTP 403.
  - System Chromium headless launch failed on crashpad permission errors.
  - Automated verification completed successfully; live visual signoff still needs an unrestricted local desktop session.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase `36-02` can build on a stable shell-owned summary contract and compact settings navigation surface.
- A local live settings walkthrough is still recommended to retire the remaining manual-only signoff debt around perceived shell density.

## Self-Check: PASSED

- Found summary file: `.planning/phases/36-settings-predictability-and-shared-control-contract/36-01-SUMMARY.md`
- Found task commit: `9e72e99`
- Found task commit: `069e9d0`

---
*Phase: 36-settings-predictability-and-shared-control-contract*
*Completed: 2026-04-22*
