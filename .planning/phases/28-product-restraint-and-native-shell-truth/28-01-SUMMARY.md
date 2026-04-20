---
phase: 28-product-restraint-and-native-shell-truth
plan: 01
subsystem: ui
tags: [electron, react, macos, shell, titlebar, ipc]
requires:
  - phase: 19-shell-safe-area
    provides: shared shell-safe-area ordering for title-bar chrome and route content
provides:
  - native-first macOS main window chrome via a framed hiddenInset BrowserWindow
  - renderer title-bar gating that removes competing custom controls on macOS
  - shell-owned notification ordering directly below the title-bar seam
affects: [phase-28-02-shell-restraint, phase-28-03-update-locality]
tech-stack:
  added: []
  patterns: [native-first macOS BrowserWindow chrome, IPC-owned shell capability gating]
key-files:
  created: [electron/window/__tests__/windowManager.macos.test.ts, src/components/__tests__/UpdateNotification.layout.test.tsx]
  modified: [electron/window/windowManager.ts, src/components/AppLayout.tsx, src/components/TitleBar.tsx, src/components/__tests__/TitleBar.branding.test.tsx, src/services/ipc/windowControlsIPC.ts]
key-decisions:
  - "macOS main windows now use a framed hiddenInset BrowserWindow instead of a frameless hiddenInset hybrid."
  - "Renderer title-bar chrome now follows the window-controls IPC seam instead of a component-local platform check."
  - "Update notifications remain ordered between the title bar and the shared shell-safe content seam."
patterns-established:
  - "Native-first macOS shell: Electron owns traffic lights, renderer owns only the drag/clearance strip below them."
  - "Shell capability checks belong in the IPC wrapper so components consume one shared chrome contract."
requirements-completed: [SHELL-05]
duration: 9 min
completed: 2026-04-20
---

# Phase 28 Plan 01: Native macOS Shell Contract Summary

**Framed macOS hiddenInset window chrome with renderer-owned shell clearance and no competing custom control group**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-20T10:41:00Z
- **Completed:** 2026-04-20T10:50:29Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Switched the real macOS `BrowserWindow` branch to a native-first framed `hiddenInset` contract and locked it with a focused main-process test.
- Moved renderer custom-control gating behind `windowControlsIPC` so the macOS title bar follows one shared shell capability contract.
- Kept the app update banner anchored below the title-bar seam and above the shell-safe content area with regression coverage around layout ordering.

## Task Commits

Each task was committed atomically:

1. **Task 1: Establish the Wave 0 main-process macOS shell seam** - `bbaed0a` (fix)
2. **Task 2: Finish the native-first renderer shell contract and lock its regressions** - `1cea517` (fix)

**Plan metadata:** pending final docs commit at summary creation time

## Files Created/Modified
- `electron/window/windowManager.ts` - Encodes native-first main-window chrome options for macOS versus other platforms.
- `electron/window/__tests__/windowManager.macos.test.ts` - Verifies the real Electron macOS `BrowserWindow` branch uses framed `hiddenInset` chrome.
- `src/components/TitleBar.tsx` - Renders only the shared drag/clearance strip when native macOS controls own the window chrome.
- `src/services/ipc/windowControlsIPC.ts` - Centralizes the renderer shell capability check for native versus custom controls.
- `src/components/AppLayout.tsx` - Keeps notifications between the title bar and the shared shell-safe content seam.
- `src/components/__tests__/TitleBar.branding.test.tsx` - Confirms the macOS title bar clears custom controls and shell branding.
- `src/components/__tests__/UpdateNotification.layout.test.tsx` - Confirms the update banner stays inline beneath the title-bar seam in the full app shell layout.

## Decisions Made

- Used `frame: true` with `titleBarStyle: 'hiddenInset'` on macOS so native traffic lights are owned by Electron instead of a frameless hybrid window contract.
- Kept Windows and Linux on the existing frameless renderer-driven shell path to avoid widening this plan into a cross-platform chrome redesign.
- Preserved one shell-owned ordering seam: `TitleBar` first, notification container second, safe-area content third.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Real-app macOS visual verification was not run from this terminal-only execution context. Automated proof is green, but the release checklist still needs the manual traffic-light/drag/banner pass from `28-VALIDATION.md`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The shared shell contract is now explicit enough for Phase 28-02 and 28-03 to build on without reopening title-bar ordering.
- Before release sign-off, run the manual macOS checklist to confirm traffic lights are visible, unobstructed, and the window still drags correctly in the real app.

---
*Phase: 28-product-restraint-and-native-shell-truth*
*Completed: 2026-04-20*

## Self-Check: PASSED

- Found `.planning/phases/28-product-restraint-and-native-shell-truth/28-01-SUMMARY.md`
- Found `electron/window/__tests__/windowManager.macos.test.ts`
- Found `src/components/__tests__/UpdateNotification.layout.test.tsx`
- Verified commits `bbaed0a` and `1cea517` in `git log`
