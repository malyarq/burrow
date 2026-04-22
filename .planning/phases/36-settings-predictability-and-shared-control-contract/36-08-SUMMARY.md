---
phase: 36-settings-predictability-and-shared-control-contract
plan: "08"
subsystem: settings
tags: [react, settings, appearance, modal, statistics, storage]
requires: [36-05, 36-06]
provides:
  - flatter embedded utility tabs for downloads, mirrors, storage, and statistics
  - visible background/application seam through a lighter shell and modal stack
  - scoped appearance wording that only promises effects visible during settings review
affects: [36-09, settings, appearance, launcher, statistics, storage]
tech-stack:
  added: []
  patterns:
    - embedded utility surfaces use muted shells instead of nested dashboard cards
    - settings background tuning relies on live shell visibility, not hidden state
    - visible-effect copy stays colocated with the controls it describes
key-files:
  created: []
  modified:
    - src/components/settings/tabs/DownloadsTab.tsx
    - src/features/settings/mirrors/MirrorsSettings.tsx
    - src/components/settings/tabs/StorageTab.tsx
    - src/features/settings/statistics/StatisticsTab.tsx
    - src/components/layout/BackgroundLayer.tsx
    - src/components/AppLayout.tsx
    - src/components/ui/Modal.tsx
    - src/components/settings/tabs/AppearanceTab.tsx
    - src/components/__tests__/SettingsPage.storage.test.tsx
    - src/components/__tests__/SettingsPage.statistics.test.tsx
    - src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx
    - src/features/settings/statistics/__tests__/StatisticsTab.test.tsx
    - src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx
    - src/components/settings/__tests__/AppearanceTab.branding.test.tsx
    - src/locales/en.json
    - src/locales/ru.json
key-decisions:
  - "Embedded utility tabs now use muted/inline surfaces so the settings route panel stays the dominant container."
  - "Background feedback is made observable by opening a shell/modal peek seam rather than adding a separate preview mini-app."
  - "Appearance copy now names only the shell frame and backdrop users can actually inspect while the modal is open."
patterns-established:
  - "When a feature is embedded in SettingsPage, inner groups should demote from shell cards to muted sections."
  - "Visible-effect controls must ship with both a rendering seam and wording that matches what the user can see immediately."
requirements-completed: [SETTINGS-05, SETTINGS-08, DESIGN-01]
duration: 31min
completed: 2026-04-22
---

# Phase 36-08 Summary

**Utility tabs now feel embedded instead of dashboard-within-dashboard, and appearance background controls finally have a visible live seam around the settings modal**

## Performance

- **Duration:** 31 min
- **Started:** 2026-04-22T20:53:00Z
- **Completed:** 2026-04-22T21:24:00Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments

- Flattened the embedded Downloads, Mirrors, Storage, and Statistics surfaces so the settings route panel remains the primary shell and inner groups read as sections instead of mini dashboards.
- Opened a real background/application seam by making the app shell, modal overlay, and modal frame less opaque, so backdrop and advanced color changes show through while the settings dialog stays readable.
- Added scoped appearance copy that explicitly points users to the shell frame/backdrop around the modal, then updated tests to prove the new embedded and visible-effect contract.

## Task Commits

Pending. The atomic task commit is created after this summary.

## Files Created/Modified

- `src/components/settings/tabs/DownloadsTab.tsx` - demoted the downloads tuning block to an embedded muted section when rendered inside SettingsPage.
- `src/features/settings/mirrors/MirrorsSettings.tsx` - flattened mirrors controls and list framing away from `surface-card` dashboard treatment into calmer embedded sections.
- `src/components/settings/tabs/StorageTab.tsx` - moved embedded cleanup/stats groups onto muted shells and lighter stat cards.
- `src/features/settings/statistics/StatisticsTab.tsx` - reduced nested settings shells, using muted section frames and inline list cards for embedded statistics.
- `src/components/layout/BackgroundLayer.tsx` - lowered backdrop masking so image/video/particle layers remain visible through the launcher shell.
- `src/components/AppLayout.tsx` - introduced a lighter shell/main background stack so backdrop and advanced color changes can be observed around live surfaces.
- `src/components/ui/Modal.tsx` - reduced overlay and dialog opacity to reveal the backdrop while keeping the settings modal legible.
- `src/components/settings/tabs/AppearanceTab.tsx` - added scoped copy for advanced appearance and a visible-background-scope callout inside Background Effects.
- `src/components/__tests__/SettingsPage.storage.test.tsx` - updated the storage route expectation to the new embedded-muted contract.
- `src/components/__tests__/SettingsPage.statistics.test.tsx` - removed stale hero-copy expectations from embedded statistics.
- `src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx` - locked the new muted embedded layout instead of nested shell counts.
- `src/features/settings/statistics/__tests__/StatisticsTab.test.tsx` - relaxed summary-shell lookup to the shared muted-or-shell contract.
- `src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx` - asserted the visible background scope copy inside Background Effects.
- `src/components/settings/__tests__/AppearanceTab.branding.test.tsx` - updated the appearance guidance contract away from the old heading assumption and toward honest visible-effect wording.
- `src/locales/en.json` - added scoped advanced/background visibility strings.
- `src/locales/ru.json` - mirrored the new scoped advanced/background visibility strings in Russian.

## Decisions Made

- The correct fix for “saved but invisible” background controls was to expose the real shell/backdrop underneath the modal, not to add another preview card or detached runtime explainer.
- Embedded utility tabs now prefer muted containers and inline rows because the settings route panel already owns the major shell framing.
- Appearance copy was narrowed to the shell frame and backdrop around the modal so the UI no longer promises broad visual changes that are still hidden during review.

## Deviations from Plan

None - the plan executed as intended. One extra safety check was added on `AppLayout.responsive.test.tsx` because the new visibility seam touched shell background classes in addition to the planned files.

## Issues Encountered

- `AppearanceTab.branding.test.tsx` had a stale assumption that “Theme Presets” was rendered as a heading. The test was updated to the current labeled-control contract before verifying the new background-scope wording.
- `eslint` still ignores JSON locale files in this repo configuration, so locale validation was completed via direct JSON parsing after TypeScript/TSX lint passed.

## User Setup Required

None - no external configuration required.

## Next Phase Readiness

- `36-09` is the last settings-owned gap: the proof harness now needs to describe the recovered shell, preset, control, and visible-effect contract instead of the pre-UAT story.
- After `36-09`, Phase 36 should be ready for a fresh UAT loop instead of another internal-only closeout.

---
*Phase: 36-settings-predictability-and-shared-control-contract*
*Completed: 2026-04-22*
