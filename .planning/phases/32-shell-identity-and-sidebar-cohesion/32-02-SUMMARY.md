---
phase: 32-shell-identity-and-sidebar-cohesion
plan: "02"
subsystem: ui
tags: [electron, react, macos, window, titlebar, native-shell]
requires: []
provides:
  - one shared native icon-candidate policy for macOS shell surfaces
  - explicit renderer safe-area metadata for native macOS top-edge behavior
affects: [SHELL-10, macos-shell, titlebar, app-layout]
tech-stack:
  added: []
  patterns: [native-first macOS shell contract, centralized window icon candidate order]
key-files:
  created: [.planning/phases/32-shell-identity-and-sidebar-cohesion/32-02-SUMMARY.md]
  modified: [electron/window/windowManager.ts, electron/app/bootstrap.ts, electron/window/__tests__/windowManager.macos.test.ts, src/components/TitleBar.tsx, src/components/AppLayout.tsx, src/services/ipc/windowControlsIPC.ts, src/components/__tests__/TitleBar.branding.test.tsx, src/components/__tests__/UpdateNotification.layout.test.tsx, src/components/__tests__/AppLayout.responsive.test.tsx]
key-decisions:
  - "Native desktop icon resolution is now centralized so bootstrap and BrowserWindow creation cannot drift."
  - "Renderer shell spacing now declares whether it is running under native macOS controls instead of relying on implicit top-edge assumptions."
patterns-established:
  - "macOS keeps a minimal drag strip plus safe-area metadata; renderer chrome must not compete with native controls."
requirements-completed: [SHELL-10]
duration: not recorded
completed: 2026-04-22
---

# Phase 32 Plan 02 Summary

**macOS shell behavior now uses one native icon policy and an explicit safe-area contract instead of mixed icon drift and implicit top-edge spacing.**

## Performance

- **Duration:** not recorded
- **Started:** 2026-04-22T11:09:00+0300
- **Completed:** 2026-04-22T13:07:36+0300
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Kept the macOS title bar restrained and native-first while preserving one shell-owned drag seam instead of restoring custom controls.
- Centralized native icon-candidate ordering so `bootstrap.ts` and `windowManager.ts` resolve the same app identity path on macOS.
- Added explicit `native-macos` versus `renderer-controls` shell metadata in `AppLayout` and locked it with update-banner and responsive shell tests.

## Task Commits

1. **Task 1: Tighten the main-process macOS window and native icon contract** - not committed
2. **Task 2: Align the renderer top-edge seam with the native-first shell contract** - not committed

**Commit status:** intentionally skipped because the worktree already contained unrelated local edits, so creating an atomic task commit would have bundled baseline changes outside this plan.

## Files Created/Modified

- `electron/window/windowManager.ts` - exported one native window icon-candidate policy and kept macOS PNG-first resolution explicit.
- `electron/app/bootstrap.ts` - re-used the shared native icon policy instead of keeping a duplicated candidate list.
- `electron/window/__tests__/windowManager.macos.test.ts` - added macOS icon-order proof alongside the native `hiddenInset` window contract.
- `src/components/TitleBar.tsx` - kept the renderer title bar as a minimal drag strip on macOS and the canonical app-icon fallback elsewhere.
- `src/services/ipc/windowControlsIPC.ts` - added a semantic shell contract helper for renderer layout decisions.
- `src/components/AppLayout.tsx` - made notifications and safe-area layout explicitly aware of native macOS shell mode.
- `src/components/__tests__/UpdateNotification.layout.test.tsx` - locked the inline update banner under both renderer and native shell contracts.
- `src/components/__tests__/AppLayout.responsive.test.tsx` - extended the safe-area proof to responsive and route-switching shell states.
- `src/components/__tests__/TitleBar.branding.test.tsx` - kept the macOS strip restraint and app-icon fallback contract under test.

## Decisions Made

- Preserved PNG-first native macOS icon resolution and documented `.ico` as a last fallback instead of forcing the renderer’s web icon path into native shell code.
- Represented shell mode through explicit metadata in layout tests so top-edge spacing and notification placement cannot silently drift.

## Deviations from Plan

- Added `src/components/__tests__/AppLayout.responsive.test.tsx` to the proof set even though it was not listed in plan frontmatter, because the safe-area contract needed one more shell-level regression seam beyond the update banner test.
- `src/components/__tests__/UpdateNotification.layout.test.tsx` remained the primary renderer verification seam; no change was needed in `src/services/ipc/windowControlsIPC.ts` beyond the new semantic helper.

## Issues Encountered

- The plan’s icon-alignment requirement conflicted with native macOS packaging expectations. The fix was to centralize and document the existing PNG-first desktop policy instead of forcing `.ico` preference into native window code.
- Manual real-window macOS walkthrough was not rerun in this noninteractive turn, so traffic-light clearance, drag feel, and dock icon still remain human signoff debt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Later shell or update work can now depend on an explicit macOS shell contract instead of inferring native mode from title-bar implementation details.
- No additional implementation work is needed for `32-02`; remaining signoff is manual-only macOS window sampling.

