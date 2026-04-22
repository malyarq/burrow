---
status: diagnosed
trigger: "Diagnose one UAT gap for Phase 36.

Gap truth: Settings should open with one compact navigation shell and no redundant shell copy or card-in-card nesting before the real controls begin.
Severity: major
Test: 1
User report: Эти надписи не нужны. Достаточно свитча вкладок. Свитчер вложен во вложенность. Настройки тоже как вложенность вложены во вложенность, например цвет акцента и язык.
Debug slug: settings-shell-nesting
Goal: find_root_cause_only"
created: 2026-04-22T19:02:35Z
updated: 2026-04-22T19:04:19Z
---

## Current Focus

hypothesis: Confirmed: SettingsPage already owns the shell-level summary, but AppearanceTab does not support embedded mode and always renders its own standalone hero/runtime surfaces plus nested control cards inside the shared panel.
test: Correlate the route shell, appearance tab markup, shared surface CSS, and neighboring embedded-tab patterns/tests.
expecting: The appearance path should be the outlier that still emits duplicate summary copy and multiple bordered surface layers inside the panel host.
next_action: return root-cause diagnosis for Phase 36 UAT gap 1

## Symptoms

expected: Settings opens with one compact navigation shell, only a tab switcher before the real controls, and no redundant shell copy or card-in-card nesting around controls like accent color and language.
actual: The page shows extra shell copy, the tab switcher appears nested inside another container, and settings controls such as accent color and language appear wrapped in layered nested surfaces.
errors: none reported
reproduction: Open Settings on a laptop-width window and inspect the initial shell plus controls such as accent color and language.
started: Reported during Phase 36 UAT on 2026-04-22; exact regression point unknown

## Eliminated

## Evidence

- timestamp: 2026-04-22T19:04:19Z
  checked: src/components/SettingsPage.tsx and src/components/settings/settingsTabs.ts
  found: SettingsPage always renders a shell header with the active tab label plus description, and the appearance tab description is wired to settings.theme_presets_desc, the exact preset/import-export helper copy quoted in the UAT report.
  implication: The route already owns the top-level shell copy before any tab content renders.

- timestamp: 2026-04-22T19:04:19Z
  checked: src/components/settings/tabs/AppearanceTab.tsx
  found: AppearanceTab has no embedded prop and unconditionally starts with a surface-card hero that repeats an appearance kicker/title/summary, then nests surface-muted groups and settings-control-card wrappers around controls such as accent color and language.
  implication: When rendered inside SettingsPage, AppearanceTab cannot collapse into the shared shell contract and instead adds a second standalone shell plus extra card layers before the real controls.

- timestamp: 2026-04-22T19:04:19Z
  checked: src/index.css, src/components/settings/tabs/StorageTab.tsx, and src/components/settings/__tests__/StorageTab.layout.test.tsx
  found: surface-panel, surface-card, surface-muted, and settings-control-card each add their own rounded bordered surface styling; sibling tabs like Storage implement embedded mode and have tests asserting their standalone hero is removed inside SettingsPage, while AppearanceTab has no equivalent embedded seam or density test.
  implication: The redundant DOM layers become visibly “nested cards,” and the appearance regression survived Phase 36 because other tabs were normalized/tested but AppearanceTab was not.

## Resolution

root_cause: SettingsPage already provides the compact shell header and segmented navigation, but AppearanceTab was left as a standalone page component. It has no embedded mode, so inside the shared surface-panel it still renders its own hero copy, preset/runtime summary surfaces, and surface-muted/settings-control-card wrappers. Because the shared settings CSS gives each layer visible borders/radii/backgrounds, the result is the exact duplicate copy and card-in-card nesting reported in UAT.
fix:
verification:
files_changed: []
