---
phase: 36-settings-predictability-and-shared-control-contract
plan: "07"
subsystem: ui
tags: [react, settings, sidebar, buttons, layout]
requires: [36-05]
provides:
  - shared compact-control geometry across collapsed sidebar actions
  - utility button geometry that keeps long localized labels readable
  - tests that lock the centered compact rail and label-safe launcher actions
affects: [36-08, 36-09, settings, sidebar, launcher]
tech-stack:
  added: []
  patterns:
    - compact rail geometry seam
    - utility button geometry seam
    - label-safe shared control contract
key-files:
  created: []
  modified:
    - src/components/ui/Button.tsx
    - src/components/sidebar/SidebarHeader.tsx
    - src/components/Sidebar.tsx
    - src/components/settings/tabs/LauncherTab.tsx
    - src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx
    - src/components/settings/__tests__/LauncherTab.layout.test.tsx
key-decisions:
  - "Collapsed sidebar controls now use one explicit compact-control button geometry instead of one-off sizing."
  - "Long utility actions use a dedicated geometry seam rather than weakening every button in the app."
  - "Launcher utility rows now prefer readable wrapped labels over clipped single-line buttons."
patterns-established:
  - "Shared control polish should land through named geometry seams, not duplicated class stacks."
  - "Localized utility actions must be proven against long-label fixtures, not only English-width copy."
requirements-completed: [SETTINGS-07, DESIGN-01]
duration: 12min
completed: 2026-04-22
---

# Phase 36-07 Summary

**Collapsed sidebar controls now share one centered compact rail contract, and long launcher utility labels no longer clip inside generic buttons**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-22T20:41:00Z
- **Completed:** 2026-04-22T20:53:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Put the collapsed sidebar burger onto the same compact geometry seam as the neighboring collapsed actions so the header control no longer drifts visually off the rail.
- Added a `utility` button geometry seam for launcher/settings actions with long localized labels, allowing them to wrap and stay centered instead of clipping.
- Locked both seams with targeted tests on the collapsed sidebar rail and launcher utility layout.

## Task Commits

Pending. The atomic task commit is created after this summary.

## Files Created/Modified

- `src/components/ui/Button.tsx` - added explicit `compact-control` and `utility` geometry seams to the shared button contract.
- `src/components/sidebar/SidebarHeader.tsx` - moved the collapsed expand button onto `compact-control` and exported the rail class seam for reuse.
- `src/components/Sidebar.tsx` - reused the same compact rail seam for collapsed multiplayer/settings actions so the full rail stays visually aligned.
- `src/components/settings/tabs/LauncherTab.tsx` - applied `utility` geometry to long launcher actions that previously relied on fragile width assumptions.
- `src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx` - asserted that the collapsed header button uses the compact geometry seam.
- `src/components/settings/__tests__/LauncherTab.layout.test.tsx` - added long-label fixtures and assertions for utility-button wrapping and centering.

## Decisions Made

- Shared control alignment now lives in named button geometries because duplicated one-off classes were exactly what allowed the collapsed burger to drift.
- Utility actions got a dedicated seam instead of changing the global default button geometry, because the clipping issue was specific to settings-style action rows.
- The launcher uses wrapped, centered labels for long actions because localization safety is more important here than preserving a single-line silhouette.

## Deviations from Plan

None - the worker pass landed exactly on the planned ownership seams and was re-verified on the integrated baseline before closeout.

## Issues Encountered

- No code issues surfaced during integration. The main remaining debt is manual-only: live visual confirmation of the compact rail centering and label wrapping was not rerun in a shell session.

## User Setup Required

None - no external configuration required.

## Next Phase Readiness

- `36-08` can now focus on visible-effect truth for advanced appearance controls instead of control clipping and compact-rail geometry drift.
- `36-09` remains the final proof-harness pass after the remaining visible-effect work is in place.

---
*Phase: 36-settings-predictability-and-shared-control-contract*
*Completed: 2026-04-22*
