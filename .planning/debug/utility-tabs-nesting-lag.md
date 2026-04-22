---
status: diagnosed
trigger: "Diagnose one UAT gap for Phase 36. Gap truth: Embedded utility tabs should inherit the same calm settings surface without repeating the heavy nested-card framing or introducing severe scroll lag. Severity: major. Test: 4. User report: Уже все описал, не нравится такая большая вложенность визуальная, и то как дико лагает."
created: 2026-04-22T19:19:34Z
updated: 2026-04-22T19:19:34Z
---

## Current Focus

hypothesis: Confirmed. Phase 36 made utility tabs "consistent" by wrapping them in the shared settings shell primitives, but those primitives are themselves blur-heavy card surfaces, so embedded tabs now stack shell-on-shell-on-control-card inside the modal scroll container.
test: Read the settings host, modal scroll container, shared surface CSS, embedded utility tab components, and the Phase 36 tests/summaries that codified the utility-shell contract.
expecting: The settings modal should already provide a framed shell, utility tabs should add more framed shells/cards in embedded mode, and the shared surface classes should all carry their own border/radius/blur treatment.
next_action: return the root cause for the UAT gap

## Symptoms

expected: Embedded utility tabs should feel like part of the same calm settings surface without repeated nested-card framing or severe scroll lag.
actual: "Уже все описал, не нравится такая большая вложенность визуальная, и то как дико лагает."
errors: none
reproduction: Open Settings and inspect Downloads, Launcher, Storage, or Statistics in the modal; scroll the active tab and observe the stacked framed sections/cards inside the utility tab.
started: Reported in Phase 36 UAT on 2026-04-22 after the shared utility-shell closeout shipped.

## Eliminated

- hypothesis: Scroll lag comes from inactive settings tabs all rendering at once behind the active tab.
  evidence: `src/components/SettingsPage.tsx` renders only `renderActiveTab()` inside the tabpanel, so the active utility tab itself is responsible for the visible nesting and scroll cost.
  timestamp: 2026-04-22T19:19:34Z

## Evidence

- timestamp: 2026-04-22T19:19:34Z
  checked: `src/components/SettingsPage.tsx` and `src/components/ui/Modal.tsx`
  found: Settings already wraps every tab in a `surface-panel`, and the modal body scrolls inside `data-modal-body` with `overflow-y-auto`.
  implication: Any extra shells/cards inside embedded utility tabs are repainted during modal scrolling instead of being flattened into the parent surface.

- timestamp: 2026-04-22T19:19:34Z
  checked: `src/index.css`
  found: `surface-panel`, `surface-card`, `surface-muted`, `surface-inline`, `settings-section-shell`, `settings-control-card`, `settings-toggle-row`, and `settings-stat-card` all define their own rounded borders plus `backdrop-blur-*`.
  implication: Reusing these primitives on multiple nested levels compounds both the layered look and the scroll-time rendering cost.

- timestamp: 2026-04-22T19:19:34Z
  checked: `src/components/settings/tabs/DownloadsTab.tsx` and `src/features/settings/mirrors/MirrorsSettings.tsx`
  found: Embedded Downloads removes the standalone heading but still renders a `settings-section-shell` for tuning, while `MirrorsSettings` adds another `settings-section-shell`, a `settings-toggle-row`, a `settings-control-card`, and a `surface-card` mirror list.
  implication: The embedded utility surface inherits the settings shell by adding more card primitives rather than by flattening into the existing tabpanel shell.

- timestamp: 2026-04-22T19:19:34Z
  checked: `src/components/settings/tabs/LauncherTab.tsx`, `src/components/settings/tabs/StorageTab.tsx`, and `src/features/settings/statistics/StatisticsTab.tsx`
  found: Launcher adds multiple `settings-section-shell` blocks plus two `surface-card` sections, Storage adds two embedded `settings-section-shell` blocks plus four `settings-stat-card`s, and embedded Statistics renders four `.settings-section-shell` containers with `settings-stat-card` and `surface-muted` rows inside them.
  implication: All major utility tabs keep their own mini-dashboard shells inside the shared settings tabpanel, so the heavy nesting is systemic across the utility area.

- timestamp: 2026-04-22T19:19:34Z
  checked: `src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx`, `src/components/__tests__/SettingsPage.storage.test.tsx`, and `.planning/phases/36-settings-predictability-and-shared-control-contract/36-04-SUMMARY.md`
  found: Phase 36 explicitly introduced "settings-section-shell wrappers for embedded utility tabs", and tests assert shell presence/counts in embedded storage/statistics instead of flattening.
  implication: The nested utility framing is not accidental drift; it is the implementation strategy Phase 36 intentionally shipped.

## Resolution

root_cause:
  Phase 36 closed the utility-tab consistency gap by wrapping embedded Downloads, Launcher, Storage, and Statistics in the same reusable surface primitives used elsewhere, but those primitives are all card-like and blur-heavy. Because `SettingsPage` already provides a `surface-panel` inside a scrollable modal body, each embedded utility tab now adds more `settings-section-shell` or `surface-card` containers and then nests `settings-toggle-row`, `settings-control-card`, `settings-stat-card`, and `surface-muted` items inside them. The result is a shell-inside-shell visual stack that still reads like mini-dashboards, and the accumulated `backdrop-blur`/border/shadow layers make scrolling the modal feel severely laggy.
fix:
verification:
files_changed: []
