---
phase: 11-adaptive-layout-and-interaction-foundations
plan: "02"
subsystem: ui
tags: [react, overlays, menus, popovers, viewport]
requires:
  - phase: 11-adaptive-layout-and-interaction-foundations
    plan: "01"
    provides: responsive shell geometry and stable surface dimensions
provides:
  - reusable anchored overlay seam with viewport clamping
  - migrated tooltip and onboarding overlay consumers
  - installed-modpack action menu that stays attached to the trigger at viewport edges
affects: [phase-11, overlays, modpack-actions, onboarding]
tech-stack:
  added: []
  patterns: [anchored-overlay, overlay-layout-resolver, viewport-safe-menu]
key-files:
  created:
    - src/components/ui/AnchoredOverlay.tsx
    - src/components/ui/anchoredOverlayLayout.ts
  modified:
    - src/components/ui/Tooltip.tsx
    - src/components/onboarding/OnboardingTour.tsx
    - src/components/modpacks/ModpackList.tsx
    - src/components/ui/__tests__/AnchoredOverlay.test.tsx
    - src/components/modpacks/__tests__/ModpackList.actions.test.tsx
key-decisions:
  - "Centralized overlay positioning in a pure layout resolver instead of hardcoding improved offsets into one menu."
  - "Migrated both foundational overlays and the user-reported installed-modpack actions menu so the seam is proven reusable immediately."
patterns-established:
  - "Overflow fixes in FMCL should anchor to a trigger rect and clamp into the viewport instead of storing raw page coordinates."
requirements-completed: [ADPT-03]
duration: 11min
completed: 2026-04-13
---

# Phase 11 Plan 02: Adaptive Layout And Interaction Foundations Summary

**Viewport-safe anchored overlays now drive tooltips, onboarding spotlights, and installed-modpack action menus instead of brittle raw-coordinate math**

## Performance

- **Duration:** 11 min
- **Started:** 2026-04-13T15:47:00+03:00
- **Completed:** 2026-04-13T15:58:11+03:00
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Added a reusable `AnchoredOverlay` seam with pure layout resolution and viewport clamping.
- Migrated tooltip and onboarding target overlays to the new seam so foundational overlay behavior is consistent.
- Moved the installed-modpack card actions menu off raw pointer math and onto the anchored overlay contract, closing the user-reported overflow class at the interaction seam.

## Task Commits

1. **Task 1: Build a reusable anchored overlay seam and migrate foundational overlay consumers** - `3f5b4ec` (`fix(11-02): anchor overlay surfaces safely`)
2. **Task 2: Migrate installed-modpack actions and lock the overflow behavior with tests** - `7a20d1e` (`test(11-02): cover anchored overlay seams`)

## Files Created/Modified

- `src/components/ui/AnchoredOverlay.tsx` - shared portal-based overlay renderer tied to a trigger rect.
- `src/components/ui/anchoredOverlayLayout.ts` - pure layout resolver used by both product code and tests.
- `src/components/ui/Tooltip.tsx` - migrated to anchored overlay behavior.
- `src/components/onboarding/OnboardingTour.tsx` - now measures target rects and repositions on resize/scroll.
- `src/components/modpacks/ModpackList.tsx` - installed-modpack actions use anchored placement instead of brittle coordinates.
- `src/components/ui/__tests__/AnchoredOverlay.test.tsx` - covers preferred placement, flipping, and viewport clamping.
- `src/components/modpacks/__tests__/ModpackList.actions.test.tsx` - covers keyboard-open and action-menu focus behavior on the new seam.

## Decisions Made

- Split pure geometry (`anchoredOverlayLayout.ts`) from the React shell to avoid React Fast Refresh lint friction and keep placement logic directly testable.
- Kept the overlay fix intentionally brownfield-friendly: the seam accepts measured rects and does not require a global overlay manager or router rewrite.

## Deviations from Plan

None.

## Issues Encountered

- Initial implementation hit ESLint friction (`react-refresh/only-export-components` and effect-state noise), which was resolved by extracting the pure layout resolver into its own module before the final commit.

## User Setup Required

None.

## Next Phase Readiness

- Plan `11-04` can verify edge-position behavior live because the installed-modpack action menu now exposes one deterministic overlay seam to observe.
- Later phases can adopt `AnchoredOverlay` instead of adding more raw coordinate menus.

---
*Phase: 11-adaptive-layout-and-interaction-foundations*
*Completed: 2026-04-13*
