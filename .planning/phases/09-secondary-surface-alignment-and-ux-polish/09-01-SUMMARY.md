---
phase: 09-secondary-surface-alignment-and-ux-polish
plan: "01"
subsystem: ui
tags: [react, localization, screenshots, sharing, vitest, accessibility]
requires:
  - phase: 07-ui-system-foundations
    provides: shared modal, button, input, and surface contracts
  - phase: 08-core-route-rollout-and-ui-correctness
    provides: truthful modpack route language and localized route seams
provides:
  - share and import-share dialogs aligned with the shared launcher form and feedback system
  - screenshot gallery and lightbox flows that use explicit dialogs, localized actions, and keyboard-aware controls
  - focused regression coverage for share states plus screenshot gallery and lightbox seams
affects: [modpack-list, share-flow, screenshots, secondary-surfaces]
tech-stack:
  added: []
  patterns: [secondary-surface-dialog-contract, localized-destructive-actions, route-owned-secondary-flow-tests]
key-files:
  created: [src/features/share/__tests__/ShareFlows.test.tsx, src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx]
  modified: [src/components/modpacks/ModpackList.tsx, src/features/share/ShareModal.tsx, src/features/share/ImportShareModal.tsx, src/features/screenshots/components/ScreenshotsTab.tsx, src/features/screenshots/components/ScreenshotLightbox.tsx, src/locales/en.json, src/locales/ru.json]
key-decisions:
  - "Kept the existing share and screenshots IPC wrappers intact and treated this plan as a surface-alignment slice instead of inventing a new data flow."
  - "Moved screenshot destructive and rename actions onto explicit confirm or prompt plus toast feedback, while using the shared modal for lightbox semantics instead of preserving the custom overlay."
patterns-established:
  - "Secondary FMCL surfaces should reuse the shared modal, button, and helper-text grammar instead of browser dialogs, emoji affordances, or route-local chrome."
  - "When a secondary surface gets refreshed, the visible EN or RU copy and the route-owned tests should land together so placeholder or fallback strings cannot leak back in."
requirements-completed: [UX-04, A11Y-04]
duration: 19min
completed: 2026-04-13
---

# Phase 9 Plan 01: Secondary Surface Alignment And UX Polish Summary

**Share, import-share, and screenshot management now read like owned FMCL product surfaces instead of legacy overlays**

## Performance

- **Duration:** 19 min
- **Started:** 2026-04-13T11:05:00+03:00
- **Completed:** 2026-04-13T11:23:50+03:00
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Aligned share and import-share onto the shared dialog, form, and loading contract, including better action copy and removal of route-local spinner or field styling.
- Rebuilt screenshot gallery and lightbox behavior around explicit destructive actions, shared modal semantics, keyboard navigation, and localized toolbar language.
- Added focused tests that lock share generation or import states and the screenshot gallery or lightbox interaction seam.

## Task Commits

1. **Task 1: Rebuild share and import-share surfaces on the shared dialog and form contract** - `d0c70d0` (`fix(09-01): align share and screenshot surfaces`)
2. **Task 2: Rebuild screenshots gallery and lightbox behavior with explicit accessibility and regression coverage** - `a40aa90` (`test(09-01): cover share and screenshot flows`)

## Files Created/Modified

- `src/features/share/ShareModal.tsx` and `src/features/share/ImportShareModal.tsx` - shared-system dialog layout, loading or error presentation, and truthful modpack-share copy.
- `src/features/screenshots/components/ScreenshotsTab.tsx` and `src/features/screenshots/components/ScreenshotLightbox.tsx` - localized gallery actions, shared modal lightbox, explicit confirm or prompt flow, and keyboard-aware image navigation.
- `src/components/modpacks/ModpackList.tsx` - cleaned share entry labels and removed the touched share-surface fallback copy.
- `src/locales/en.json` and `src/locales/ru.json` - completed touched share and screenshot copy so the refreshed secondary surfaces stop leaking raw strings.
- `src/features/share/__tests__/ShareFlows.test.tsx` and `src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx` - route-owned regression coverage for the refreshed secondary flows.

## Decisions Made

- Used the shared `Modal` component for screenshot lightbox semantics instead of preserving the custom full-screen overlay, because dialog semantics and focus handling matter more than keeping legacy chrome.
- Scoped the work to share and screenshots only, leaving mirrors, statistics, launcher utilities, and broader content-management polish to the remaining Phase 9 plans.

## Deviations from Plan

None.

## Issues Encountered

- The share-flow tests initially used `toBeDisabled`, but this repo does not ship `jest-dom`; the test was rewritten to assert the actual `disabled` attribute instead of adding a new matcher dependency.
- The screenshot deletion test was more reliable when it asserted the confirm plus IPC plus toast contract rather than a timing-sensitive disappearance of the card in `jsdom`.

## User Setup Required

None.

## Next Phase Readiness

- `09-02` can now align lower-traffic settings utilities without inheriting legacy dialog or helper-text drift from share and screenshot surfaces.
- The screenshot and share regressions are now locked, so later visual alignment work in Phase 9 can rely on these flows staying truthful and accessible.

---
*Phase: 09-secondary-surface-alignment-and-ux-polish*
*Completed: 2026-04-13*
