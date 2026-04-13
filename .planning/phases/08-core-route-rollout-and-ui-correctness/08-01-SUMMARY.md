---
phase: 08-core-route-rollout-and-ui-correctness
plan: "01"
subsystem: ui-route
tags: [react, onboarding, dashboard, localization, vitest]
requires:
  - phase: 07-ui-system-foundations
    provides: shared launcher surfaces, shell language, and document theme contract
provides:
  - truthful classic-first onboarding and welcome guidance in EN and RU
  - a shared-system home/play dashboard with route-level quick actions
  - regression coverage for onboarding flow truth and App tour target stability
affects: [launcher-entry, onboarding, classic-play-route, tour-targets]
tech-stack:
  added: []
  patterns: [route-truth-over-legacy-copy, dashboard-as-shared-surface, tour-selector-regression-tests]
key-files:
  created: [src/components/__tests__/SimplePlayDashboard.route.test.tsx, src/components/onboarding/__tests__/WelcomePage.flow.test.tsx, src/components/onboarding/__tests__/OnboardingTour.targets.test.tsx]
  modified: [src/components/SimplePlayDashboard.tsx, src/components/onboarding/WelcomePage.tsx, src/locales/en.json, src/locales/ru.json]
key-decisions:
  - "Kept FMCL's state-driven route ownership and moved the classic/home dashboard onto the Phase 7 surface contract instead of introducing a new router abstraction."
  - "Changed onboarding to describe the real classic-first flow and guarded tour selectors with targeted tests rather than relying on manual spot checks."
patterns-established:
  - "Refreshed core routes should expose route-level quick actions inside shared surfaces instead of route-local banners or decorative hero blocks."
  - "When onboarding copy changes, EN and RU strings plus selector stability tests should land together so visual polish cannot drift away from real behavior."
requirements-completed: [DSYS-03, LOCL-01, UX-01]
duration: 10min
completed: 2026-04-13
---

# Phase 8 Plan 01: Core Route Rollout And UI Correctness Summary

**Classic play now opens on a shared-system dashboard with truthful onboarding and test-backed tour selectors instead of legacy mixed-route guidance**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-13T08:44:00+03:00
- **Completed:** 2026-04-13T08:53:48+03:00
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Rebuilt the simple play dashboard as a shared-system route with clearer quick actions for settings and modpacks.
- Reworked onboarding guidance so the first-run story matches FMCL's real classic-first flow in both English and Russian.
- Added focused regression coverage for the dashboard route, welcome flow, and `OnboardingTour` target selectors.

## Task Commits

1. **Task 1: Rebuild the launcher home/play route on the shared Phase 7 contract** - `544492e` (`fix(08-01): refresh simple play route`)
2. **Task 2: Make onboarding and welcome guidance truthful, localized, and regression-covered** - `ee968e4` (`test(08-01): cover onboarding route truth`)

## Files Created/Modified

- `src/components/SimplePlayDashboard.tsx` - shared-surface dashboard hierarchy with quick actions and token-safe info cards
- `src/components/onboarding/WelcomePage.tsx` - card-based welcome scene with lucide iconography and truthful quick-start guidance
- `src/locales/en.json` and `src/locales/ru.json` - classic-first onboarding copy aligned to the shipped launcher flow
- `src/components/__tests__/SimplePlayDashboard.route.test.tsx` - dashboard route quick-action regression seam
- `src/components/onboarding/__tests__/WelcomePage.flow.test.tsx` - first-run messaging truth coverage
- `src/components/onboarding/__tests__/OnboardingTour.targets.test.tsx` - App tour selector stability checks against the live sidebar shell

## Decisions Made

- Kept the work scoped to launcher entry, onboarding, and classic/home-play ownership instead of broadening into settings or modpack routes.
- Treated selector stability as part of onboarding truth so UI cleanup cannot silently break the guided tour.

## Deviations from Plan

None.

## Issues Encountered

None.

## User Setup Required

None.

## Next Phase Readiness

- `08-02` can roll settings/accounts onto the same shared route language without re-litigating the launcher entry flow.
- `08-03` can assume the launcher now presents a truthful starting point when linking into modpack-focused flows.

---
*Phase: 08-core-route-rollout-and-ui-correctness*
*Completed: 2026-04-13*
