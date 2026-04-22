---
status: diagnosed
trigger: "Diagnose one UAT gap for Phase 36. Gap truth: Controls should not sit inside excessive card-in-card nesting with repeated borders and radii that make settings feel like a layered object stack."
created: 2026-04-22T19:12:32Z
updated: 2026-04-22T19:17:55Z
---

## Current Focus

hypothesis: Confirmed. Phase 36 standardized settings around multiple card-like shell primitives, and embedded tabs kept their own shells inside the modal shell instead of flattening content.
test: Read the settings host, shared surface CSS, embedded tabs, and Phase 36 summaries/tests that describe the intended wrapper contract.
expecting: The host adds one framed shell, each tab adds more framed section shells, and inner controls also render framed containers.
next_action: report the root cause for the UAT gap

## Symptoms

expected: Controls should not sit inside excessive card-in-card nesting with repeated borders and radii that make settings feel like a layered object stack.
actual: "Вижу почти бесконечное количество вложенностей объект в объект, куча рамок и скруглений, выглядит как многослойный торт."
errors: none
reproduction: Open Settings and inspect shared controls, especially Appearance and embedded utility tabs, where repeated borders/radii are visible.
started: Reported in Phase 36 UAT on 2026-04-22 after the settings shared-control contract changes shipped.

## Eliminated

## Evidence

- timestamp: 2026-04-22T19:14:20Z
  checked: src/components/SettingsPage.tsx
  found: The settings route always renders a `surface-inline` shell header and a `surface-panel` tabpanel before any tab content.
  implication: Every settings tab starts inside at least one bordered, rounded container already.

- timestamp: 2026-04-22T19:15:10Z
  checked: src/index.css
  found: `surface-panel`, `surface-card`, `surface-muted`, `settings-section-shell`, `settings-control-card`, `settings-toggle-row`, and `settings-segmented-row` all define their own borders and rounded radii.
  implication: Stacking these shared primitives compounds visible frames instead of producing one calm surface.

- timestamp: 2026-04-22T19:16:05Z
  checked: src/components/settings/tabs/AppearanceTab.tsx
  found: Appearance nests `surface-card` blocks that contain `surface-muted` blocks, which then contain `settings-control-card` blocks and `settings-segmented-row` controls.
  implication: The main settings tab with the most visible controls explicitly renders card-inside-card-inside-card geometry.

- timestamp: 2026-04-22T19:16:42Z
  checked: src/features/settings/mirrors/MirrorsSettings.tsx and src/features/settings/statistics/StatisticsTab.tsx
  found: Embedded utility tabs still render their own `settings-section-shell` and `surface-card` sections inside the shared settings panel.
  implication: The embedded-mode contract removed duplicate copy but did not flatten standalone utility surfaces, so nested framing persists across non-appearance tabs too.

- timestamp: 2026-04-22T19:17:20Z
  checked: .planning/phases/36-settings-predictability-and-shared-control-contract/36-03-SUMMARY.md and 36-04-SUMMARY.md
  found: Phase 36 explicitly introduced shared control geometry and wrapped downloads, launcher, storage, and statistics in the shared shell contract, with tests asserting `.settings-section-shell` placement.
  implication: The layered framing is not accidental drift; it is the current implementation strategy that Phase 36 codified.

## Resolution

root_cause:
  Phase 36 solved consistency by introducing many reusable surface wrappers, but those wrappers are all card-like and are composed on top of one another. `SettingsPage` already provides a framed settings shell, while tabs such as Appearance, Mirrors/Downloads, Storage, and Statistics add their own `surface-card` or `settings-section-shell` containers and then place `surface-muted`, `settings-control-card`, `settings-toggle-row`, and `settings-segmented-row` controls inside them. Because the shared primitives all carry borders and rounded corners, embedded tabs never flatten into the parent shell and the UI reads as a repeated layered object stack.
fix:
verification:
files_changed: []
