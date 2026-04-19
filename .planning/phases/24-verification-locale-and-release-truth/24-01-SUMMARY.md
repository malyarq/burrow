---
phase: 24-verification-locale-and-release-truth
plan: "01"
subsystem: manual-verification
tags: [react, typescript, manual-verification, closeout, deterministic-fixtures]
requires: []
provides:
  - v0.5.0 closeout registry on the existing manual verification seam
  - grouped hub and navigation metadata for closeout, shared, and legacy views
  - deterministic proof seeding for time, theme, locale, and animation-sensitive closeout views
affects: [phase-24-closeout-proof, manual-verification-hub, screenshot-readiness]
tech-stack:
  added: []
  patterns: [grouped manual-view registry, closeout-owned proof slots, deterministic local-storage seeding]
key-files:
  created:
    - .planning/phases/24-verification-locale-and-release-truth/24-01-SUMMARY.md
  modified:
    - src/verification/manual/ManualVerificationApp.tsx
    - src/verification/manual/views.ts
    - src/verification/manual/scenarios.tsx
    - src/verification/manual/mockEnvironment.ts
key-decisions:
  - "Kept Phase 24 on the existing `manual-verification.html` seam and upgraded it into a named v0.5.0 closeout registry instead of adding a second harness."
  - "Introduced the full Phase 24 closeout view family early, but kept degraded-state expansion bounded to a shell-integrated placeholder until Wave 2 lands representative degraded proof."
  - "Removed visible fixture nondeterminism at the manual-environment layer through fixed timestamps and explicit closeout seeding instead of mutating product components for testability."
patterns-established:
  - "Closeout-owned views now carry structured metadata suitable for later screenshot ownership without breaking historical manual routes."
  - "Phase 24 closeout views seed theme, locale, UI mode, and `settings_disableAnimations` deliberately so screenshot review is not hostage to ambient local storage."
requirements-completed: [VER-01]
duration: 24 min
completed: 2026-04-19
---

# Phase 24 Plan 01: Closeout Registry Foundation And Deterministic Fixtures

**Turned the existing manual seam into a `v0.5.0` closeout hub and removed visible fixture nondeterminism needed for later screenshot work.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-04-19T21:01:00+03:00
- **Completed:** 2026-04-19T21:25:00+03:00
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added a named Phase 24 closeout registry with explicit `phase-24-*` ownership slots for home, modpacks, degraded state, dark/light theme, and EN/RU locale proof.
- Reworked the manual hub and nav into grouped closeout, shared, and legacy sections so the closeout story is obvious instead of buried in a flat mixed list.
- Updated manual-verification copy from stale `v0.4.0` wording to `v0.5.0` closeout messaging.
- Removed visible `Date.now()` fixture drift and added explicit closeout storage seeding for theme, locale, UI mode, and animation-off behavior.

## Task Commits

Each task was committed atomically:

1. **Task 1-2: Establish the closeout registry and deterministic proof foundation** - `71188a5` (feat)

## Files Created/Modified

- `src/verification/manual/views.ts` - introduced structured manual-view metadata, closeout-owned Phase 24 views, and grouped closeout/shared/legacy registries.
- `src/verification/manual/ManualVerificationApp.tsx` - updated the hub framing and readiness copy to advertise `v0.5.0` closeout ownership.
- `src/verification/manual/scenarios.tsx` - added grouped overview/navigation rendering plus the initial Phase 24 closeout scenario slots on the real shell.
- `src/verification/manual/mockEnvironment.ts` - fixed visible timestamps, added Phase 24 closeout view constants, and seeded closeout-specific theme/locale/motion state deterministically.

## Decisions Made

- Kept Wave 1 strictly on registry and deterministic-fixture groundwork, leaving representative degraded-state proof to Wave 2 even though the closeout slot now exists.
- Reused existing Phase 19/22 shell-integrated composition for new Phase 24 view IDs so the closeout lane inherits shipped chrome instead of a synthetic harness.
- Solved screenshot flake risk at the mock-environment seam rather than suppressing real product behavior inside launcher components.

## Deviations from Plan

- None.

## Issues Encountered

- `views.ts` briefly lost `ManualVerificationView` literal narrowing when grouped arrays were assembled via `.map(...)`; the registry was rewritten with explicit `group` fields to keep type safety intact.

## User Setup Required

None.

## Next Phase Readiness

- Wave 2 can replace the degraded placeholder slot with representative Phase 23 degraded-state proof without reopening the hub contract.
- Wave 3 can bind Playwright snapshot ownership directly to the new closeout registry metadata and deterministic seeding.

## Self-Check: PASSED

- Found `.planning/phases/24-verification-locale-and-release-truth/24-01-SUMMARY.md`
- Found commit `71188a5`
- `git diff --check -- src/verification/manual/ManualVerificationApp.tsx src/verification/manual/views.ts src/verification/manual/scenarios.tsx src/verification/manual/mockEnvironment.ts`
- `npx eslint src/verification/manual/ManualVerificationApp.tsx src/verification/manual/views.ts src/verification/manual/scenarios.tsx src/verification/manual/mockEnvironment.ts`
- `npx vitest run src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/utils/__tests__/format.test.ts src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx`
- `npx tsc --noEmit`

---
*Phase: 24-verification-locale-and-release-truth*
*Completed: 2026-04-19*
