---
phase: 28-product-restraint-and-native-shell-truth
plan: 02
subsystem: ui
tags: [react, shell, branding, settings, sidebar, dashboard]
requires:
  - phase: 28-product-restraint-and-native-shell-truth
    provides: native-first macOS shell ordering from 28-01 for top-level renderer surfaces
provides:
  - restrained sidebar, classic dashboard, and classic home identity seams anchored by app context instead of logo-forward heroes
  - appearance settings guidance tied to presets and accent behavior instead of a dedicated brand explainer card
  - regression coverage for restrained shell orientation across sidebar, launcher-home, dashboard, and appearance surfaces
affects: [phase-28-03-update-locality, phase-30-settings-geometry-cleanup]
tech-stack:
  added: []
  patterns: [restrained shell identity, task-first classic surface orientation]
key-files:
  created: []
  modified: [src/components/sidebar/SidebarHeader.tsx, src/components/SimplePlayDashboard.tsx, src/components/SimplePlayHome.tsx, src/components/settings/tabs/AppearanceTab.tsx, src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx, src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx, src/components/__tests__/SimplePlayHome.visualTruth.test.tsx, src/components/settings/__tests__/AppearanceTab.branding.test.tsx, src/locales/en.json, src/locales/ru.json]
key-decisions:
  - "Critical shell surfaces now use the small app icon as a restrained identity seam while pack/runtime text carries orientation."
  - "Classic home and dashboard no longer render centered brand-wordmark hero blocks; launch context stays primary."
  - "Appearance guidance now lives in theme/accent copy instead of a separate launcher-brand explainer card."
patterns-established:
  - "Shell restraint: brand identity is allowed as a compact anchor, not as the main content block on task surfaces."
  - "Appearance education belongs next to the controls it explains, not in a standalone promo panel."
requirements-completed: [SHELL-06]
duration: 6 min
completed: 2026-04-20
---

# Phase 28 Plan 02: Shell Restraint Summary

**Classic launcher surfaces now orient around pack/runtime context with only a compact app-identity seam, and appearance settings no longer spend a card on brand explanation**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-20T10:59:00Z
- **Completed:** 2026-04-20T11:04:36Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Demoted the sidebar header from a lockup-plus-build block into a compact app-icon row that keeps the current mode and version readable without acting like a promo surface.
- Replaced the centered classic home and dashboard brand hero with calmer launch-context cards that foreground the selected pack, runtime, and launch flow.
- Removed the dedicated appearance-tab brand explainer card and moved the guidance into theme/accent copy, then locked the new restraint rules with focused component tests.

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove shell-level brand noise from sidebar, launcher-home, and appearance surfaces** - `877231d` (feat)
2. **Task 2: Lock restrained shell identity with focused top-surface regression tests** - `3b94ebd` (test)

**Plan metadata:** pending final docs commit at summary creation time

## Files Created/Modified
- `src/components/sidebar/SidebarHeader.tsx` - Replaces the large sidebar lockup/build block with a compact icon, wordmark, and mode/version row.
- `src/components/SimplePlayDashboard.tsx` - Turns the classic dashboard hero into a task-first context card with a subdued app-icon seam and selected pack/runtime summary.
- `src/components/SimplePlayHome.tsx` - Reworks the legacy classic home view from a centered wordmark hero into a restrained launch-orientation panel.
- `src/components/settings/tabs/AppearanceTab.tsx` - Removes the dedicated brand explainer card so appearance guidance stays attached to presets and accent controls.
- `src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx` - Adds coverage for the calmer expanded header contract alongside compact mode.
- `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx` - Verifies the classic dashboard stays oriented around pack context without a shared wordmark hero.
- `src/components/__tests__/SimplePlayHome.visualTruth.test.tsx` - Verifies the restrained home surface still uses the shipped app icon and easter-egg particle seam.
- `src/components/settings/__tests__/AppearanceTab.branding.test.tsx` - Verifies the appearance tab no longer depends on a dedicated brand card.
- `src/locales/en.json` - Adds restrained shell copy for the classic surface and updates appearance guidance text.
- `src/locales/ru.json` - Mirrors the new restrained shell copy and appearance guidance in Russian.

## Decisions Made

- Kept the shipped `app-icon` as the only identity element on the classic top surfaces and removed the centered brand-wordmark hero treatment.
- Let the current pack name and runtime subtitle act as the primary dashboard heading so users orient around real launch state instead of launcher branding.
- Reused the existing appearance controls and copy seams instead of inventing a new settings card just to talk about branding.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Manual shell review for sidebar/header, launcher-home/dashboard, and appearance surfaces was not run from this terminal-only execution context. Automated proof is green, but the release checklist still needs the visual restraint pass from `28-VALIDATION.md`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The top-level shell now has a calmer identity contract, so Phase 28-03 can evaluate update locality without competing hero-brand noise on the same surfaces.
- Phase 30 can keep cleaning settings geometry without first removing a redundant launcher-brand explainer from the appearance tab.

---
*Phase: 28-product-restraint-and-native-shell-truth*
*Completed: 2026-04-20*

## Self-Check: PASSED

- Found `.planning/phases/28-product-restraint-and-native-shell-truth/28-02-SUMMARY.md`
- Found `src/components/sidebar/SidebarHeader.tsx`
- Found `src/components/SimplePlayDashboard.tsx`
- Found `src/components/SimplePlayHome.tsx`
- Found `src/components/settings/tabs/AppearanceTab.tsx`
- Verified commits `877231d` and `3b94ebd` in `git log`
