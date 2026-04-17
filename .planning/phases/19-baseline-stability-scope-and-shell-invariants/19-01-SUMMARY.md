---
phase: 19-baseline-stability-scope-and-shell-invariants
plan: "01"
subsystem: ui
tags: [react, typescript, shell-layout, vitest]
requires:
  - phase: 11-adaptive-layout-and-interaction-foundations
    provides: shared-shell layout ownership for route-agnostic geometry fixes
provides:
  - explicit AppLayout safe-area seam below the custom title bar
  - header-owned sidebar collapse controls without local top-padding compensation
  - focused AppLayout regression coverage for the shared shell contract
affects: [19-02, 19-03, verification]
tech-stack:
  added: []
  patterns: [shell-owned safe-area wrapper, header-owned sidebar controls]
key-files:
  created: []
  modified:
    - src/components/AppLayout.tsx
    - src/components/TitleBar.tsx
    - src/components/Sidebar.tsx
    - src/components/sidebar/SidebarHeader.tsx
    - src/components/__tests__/AppLayout.responsive.test.tsx
    - src/components/__tests__/Sidebar.keyboard.test.tsx
key-decisions:
  - "AppLayout now owns the post-title-bar safe area so overlays, routes, and the split inherit one shared shell contract."
  - "Sidebar collapse moved into SidebarHeader so the sidebar no longer needs an absolute top strip with local pt-6 compensation."
patterns-established:
  - "Shell title-bar clearance lives in AppLayout, not in route padding or sidebar-only offsets."
  - "Sidebar top controls live in SidebarHeader so the shell has one top-edge control cluster."
requirements-completed: [SHELL-01]
duration: 5min
completed: 2026-04-17
---

# Phase 19 Plan 01: Shared Shell Top-Safe Contract Summary

**AppLayout-owned title-bar safe seam with header-owned sidebar collapse controls and structural shell regression coverage**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-17T19:08:43Z
- **Completed:** 2026-04-17T19:13:40Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Added an explicit `AppLayout` safe-area wrapper immediately below `TitleBar` so the shell, overlays, and routed content all inherit one top-safe contract.
- Removed the sidebar's `absolute top-0` collapse strip and moved collapse ownership into `SidebarHeader`, eliminating the local `pt-6` workaround.
- Expanded the shared `AppLayout` seam test so it proves the safe-area contract persists across route and overlay state changes.

## Task Commits

Each task was committed atomically:

1. **Task 1: Introduce one shell-owned safe-area seam below the custom title bar** - `d1d570e` (fix)
2. **Task 2: Lock the shell-safe contract with focused structural regression coverage** - `098647c` (test)

## Files Created/Modified

- `src/components/AppLayout.tsx` - added the shell-owned safe-area wrapper that sits directly below the custom title bar.
- `src/components/TitleBar.tsx` - simplified title-bar positioning and marked the chrome seam explicitly for structural tests.
- `src/components/Sidebar.tsx` - removed the old local top strip and delegated collapse control ownership to the header.
- `src/components/sidebar/SidebarHeader.tsx` - made the header own expand/collapse controls and preserve `aria-controls` / `aria-expanded` wiring.
- `src/components/__tests__/AppLayout.responsive.test.tsx` - asserted the shared safe-area seam and route-agnostic shell contract.
- `src/components/__tests__/Sidebar.keyboard.test.tsx` - updated the accessibility seam to follow the header-owned collapse control.

## Decisions Made

- `AppLayout` owns title-bar clearance for every major launcher surface, including overlays, instead of relying on natural flow or route padding.
- Sidebar collapse belongs in `SidebarHeader` so the shell has one top-edge control cluster instead of a second geometry system inside `Sidebar`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated the sidebar accessibility seam for the header-owned collapse control**
- **Found during:** Task 1 (Introduce one shell-owned safe-area seam below the custom title bar)
- **Issue:** `Sidebar.keyboard.test.tsx` assumed the removed sidebar-local collapse strip, so the existing accessibility seam no longer matched the refactor.
- **Fix:** Updated the mock header control to keep asserting `aria-controls` and `aria-expanded` ownership through `SidebarHeader`.
- **Files modified:** `src/components/__tests__/Sidebar.keyboard.test.tsx`
- **Verification:** `npx vitest run src/components/__tests__/Sidebar.keyboard.test.tsx src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx`
- **Committed in:** `d1d570e`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix kept existing accessibility coverage aligned with the refactor. No scope creep.

## Issues Encountered

- Parallel `git add` commands created `.git/index.lock`; the stale lock was removed and staging was retried sequentially before the Task 1 commit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `19-02` can now hang CTA ownership off a stable shell seam instead of compensating for sidebar-local top spacing.
- No blockers remain for the shared shell baseline; the safe-area contract and regression seam are in place.

## Self-Check: PASSED

- Confirmed `.planning/phases/19-baseline-stability-scope-and-shell-invariants/19-01-SUMMARY.md` exists.
- Confirmed task commits `d1d570e` and `098647c` exist in repository history.

---
*Phase: 19-baseline-stability-scope-and-shell-invariants*
*Completed: 2026-04-17*
