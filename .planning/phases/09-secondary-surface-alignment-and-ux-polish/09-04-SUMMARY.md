---
phase: 09-secondary-surface-alignment-and-ux-polish
plan: "04"
subsystem: ui
tags: [react, accessibility, reduced-motion, screenshots, mirrors, statistics, vitest]
requires:
  - phase: 09-secondary-surface-alignment-and-ux-polish
    plan: "03"
    provides: aligned secondary content-management surfaces and typed datapack interactions
provides:
  - stronger contrast and atmospheric fallback behavior for secondary surfaces under active backgrounds
  - clearer focus visibility on screenshots, mirrors, and secondary content tab controls
  - regression coverage for reduced-motion background fallback plus secondary tab semantics
affects: [background-layer, screenshots, mirrors, statistics, content-tabs, settings-tabs]
tech-stack:
  added: [src/components/layout/__tests__/BackgroundLayer.motion.test.tsx]
  patterns: [static-atmospheric-background-fallback, explicit-focus-visible-secondary-surfaces, reduced-motion-regression-seam]
key-files:
  created: [src/components/layout/__tests__/BackgroundLayer.motion.test.tsx]
  modified: [src/index.css, src/components/layout/BackgroundLayer.tsx, src/features/screenshots/components/ScreenshotLightbox.tsx, src/features/screenshots/components/ScreenshotsTab.tsx, src/features/settings/mirrors/MirrorsSettings.tsx, src/features/settings/statistics/StatisticsTab.tsx, src/components/modpacks/details/ModpackDetailsModsTab.tsx, src/components/modpacks/details/WorldDatapacksModal.tsx, src/components/settings/__tests__/SecondarySettingsTabs.test.tsx, src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx]
key-decisions:
  - "Kept reduced-motion handling on the existing document and background seam instead of introducing a second animation settings layer for secondary surfaces."
  - "Used slightly stronger surface opacity and static atmospheric overlays to improve readability without flattening the launcher into a plain monochrome backdrop."
patterns-established:
  - "When a motion-heavy background is disabled or reduced, FMCL should fall back to a static atmospheric layer rather than a dead flat fill."
  - "Secondary-surface icon buttons and custom tab buttons must expose visible focus affordances even when they only appear on hover in pointer flows."
requirements-completed: [A11Y-04, UX-04]
duration: 17min
completed: 2026-04-13
---

# Phase 9 Plan 04: Secondary Surface Alignment And UX Polish Summary

**Phase 9 secondary surfaces now stay readable and keyboard-legible under active backgrounds and reduced motion**

## Performance

- **Duration:** 17 min
- **Started:** 2026-04-13T12:12:00+03:00
- **Completed:** 2026-04-13T12:28:43+03:00
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Added a static atmospheric fallback for motion-heavy backgrounds so video and particle themes remain readable when reduced motion is active.
- Tightened focus visibility for screenshots, mirrors, content-tab expanders, and custom tab buttons across the refreshed secondary surfaces.
- Extended regression coverage with a focused reduced-motion background test and explicit tab-state assertions for secondary settings and content seams.

## Task Commits

1. **Task 1: Sweep the updated secondary surfaces for focus, keyboard, contrast, and destructive-action semantics** - pending commit
2. **Task 2: Tune backdrop, contrast, and reduced-motion behavior without losing launcher atmosphere** - pending commit

## Files Created/Modified

- `src/components/layout/BackgroundLayer.tsx` and `src/index.css` - static atmospheric fallbacks, stronger surface opacity, and better contrast under active backgrounds.
- `src/features/screenshots/components/ScreenshotLightbox.tsx` and `ScreenshotsTab.tsx` - clearer focus visibility for navigation and delete affordances.
- `src/features/settings/mirrors/MirrorsSettings.tsx` and `src/features/settings/statistics/StatisticsTab.tsx` - better keyboard reachability for speed tests and clearer loading semantics.
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx` and `WorldDatapacksModal.tsx` - focus-visible treatment for custom buttons inside the refreshed content-management seams.
- `src/components/layout/__tests__/BackgroundLayer.motion.test.tsx`, `src/components/settings/__tests__/SecondarySettingsTabs.test.tsx`, and `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` - focused regression coverage for reduced motion and explicit tab selection state.

## Decisions Made

- Preserved the existing animated atmosphere when motion is allowed, but made the fallback intentionally styled instead of dropping to a flat opaque background.
- Limited the accessibility sweep to the surfaces refreshed in Phase 9 so the phase closes honest secondary-surface debt without expanding into a whole-app audit.

## Deviations from Plan

None.

## Issues Encountered

- The first reduced-motion background implementation used a synchronous `setState` in an effect; it was removed to keep the React hook gate clean and warning-free.
- The background fallback test needed a wider mock theme type because the suite switches between video and particles modes in one file.

## User Setup Required

None.

## Next Phase Readiness

- `09-05` can now close the integrated gate with a stable accessibility and backdrop baseline across the secondary surfaces touched in this phase.
- The reduced-motion and tab-state tests make the final browser sanity pass less dependent on purely visual inspection.

---
*Phase: 09-secondary-surface-alignment-and-ux-polish*
*Completed: 2026-04-13*
