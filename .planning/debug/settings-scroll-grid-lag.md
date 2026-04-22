---
status: diagnosed
trigger: "Gap truth: Settings scrolling and grid layout should stay smooth and aligned, including interface scale and sidebar position controls. Severity: major. Test: 1. User report: Все настройки дико лагают при скролле. Масштаб интерфейса и положение сайдбара смещены: видно 4 элемента в гриде и 2 будто выехали."
created: 2026-04-22T19:05:02Z
updated: 2026-04-22T19:05:02Z
---

## Current Focus

hypothesis: Confirmed. Phase 36's settings geometry refactor made the scrollable settings modal a stack of nested blur-heavy surfaces and split launcher runtime controls into two separate grids, so scroll repaints get expensive and the last two controls look detached from the main grid.
test: Verified the active-tab rendering path, the modal scroll container, the blur-bearing settings surface classes, and the launcher runtime JSX structure.
expecting: The active tab alone should account for the lag, and the launcher runtime JSX should show four controls in one grid plus scale/sidebar in a second grid.
next_action: Return the diagnosis for the UAT gap and point to the launcher/runtime geometry seam plus blur-heavy settings surfaces.

## Symptoms

expected: Settings scrolling stays smooth, and interface scale plus sidebar position controls stay aligned within one grid.
actual: Settings scroll feels extremely laggy, and the interface scale/sidebar position controls show four cards aligned with two additional cards visually shifted out of the grid.
errors: none reported
reproduction: Open Settings, go to appearance-related controls, scroll through the page, inspect the interface scale and sidebar position control groups.
started: Reported during Phase 36 UAT on 2026-04-22 after the settings predictability/control-contract changes.

## Eliminated

- hypothesis: Hidden settings tabs are all mounted at once and causing the scroll lag.
  evidence: `SettingsPage.renderActiveTab()` returns only the currently selected tab, so the lag is coming from the active tab's own surface stack rather than inactive tabs rendering off-screen.
  timestamp: 2026-04-22T19:05:02Z

## Evidence

- timestamp: 2026-04-22T19:05:02Z
  checked: `src/components/ui/Modal.tsx` and `src/components/SettingsPage.tsx`
  found: The settings content scrolls inside `data-modal-body` with `overflow-y-auto`, while the panel itself is a `surface-panel`.
  implication: Any expensive visual treatment applied to nested settings surfaces is repainted during scroll inside the modal body.

- timestamp: 2026-04-22T19:05:02Z
  checked: `src/index.css`
  found: `surface-panel`, `surface-card`, `surface-muted`, `settings-section-shell`, `settings-control-card`, `settings-segmented-row`, and `settings-toggle-row` all apply `backdrop-blur-*`; Phase 36 also upgraded sliders and controls to heavier custom-painted styles.
  implication: The active settings tab renders many blur layers inside the scrolling modal, which directly explains the UAT report that scrolling became "дико лагает".

- timestamp: 2026-04-22T19:05:02Z
  checked: `src/components/settings/tabs/AppearanceTab.tsx`, `src/components/settings/tabs/LauncherTab.tsx`, and local class counts
  found: `SettingsPage` contributes 2 shared surface wrappers, `AppearanceTab` adds 14 more surface/control wrappers, and `LauncherTab` adds 10 more surface/control wrappers.
  implication: The refactor multiplied layered blurred cards specifically in the settings path, making the performance regression local to settings instead of app-wide.

- timestamp: 2026-04-22T19:05:02Z
  checked: `src/components/settings/tabs/LauncherTab.tsx`
  found: Launcher runtime renders four toggles inside one `lg:grid-cols-2` grid, then renders interface zoom and sidebar position in a second separate `lg:grid-cols-[1.05fr_0.95fr]` grid below it.
  implication: The code literally produces "4 elements in the grid and 2 outside it", matching the user's report that interface scale and sidebar position look like they have slid out of the grid.

- timestamp: 2026-04-22T19:05:02Z
  checked: `git log` / `git diff` for `src/index.css`, `AppearanceTab.tsx`, and `LauncherTab.tsx`
  found: The regression window matches `11fc043 feat(36-03): unify settings control geometry`, which increased the blur-heavy control styling and touched the same launcher/appearance settings files.
  implication: The UAT gap is a Phase 36 regression introduced by the geometry refactor rather than an unrelated older settings bug.

## Resolution

root_cause: Phase 36's shared-control refactor overbuilt the settings surface with nested `backdrop-blur-*` cards inside the modal's scrolling container and kept launcher runtime as two separate grids instead of one unified six-control grid. That combination causes the scroll jank and makes interface scale/sidebar position appear visually displaced from the main launcher settings grid.
fix:
verification:
files_changed: []
