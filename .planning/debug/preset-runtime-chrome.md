---
status: investigating
trigger: "Diagnose one UAT gap for Phase 36. Gap truth: Appearance should not add redundant runtime chrome that competes with the actual controls when preset context is already obvious. Severity: major. Test: 1. User report: Рантайм пресета вообще лишнее."
created: 2026-04-22T19:02:36Z
updated: 2026-04-22T19:07:58Z
---

## Current Focus

hypothesis: Phase 36 codified preset runtime state as always-visible product copy, so Appearance renders a dedicated runtime column even when the preset heading, mode switch, and preset selector already provide that context.
test: Confirm whether AppearanceTab always renders the runtime card and whether tests/locales explicitly require that visibility.
expecting: The runtime chrome will be unconditional in the component and supported by test assertions and copy that describe it as permanently visible.
next_action: Record the confirmed root cause from AppearanceTab, locale strings, and preset-contract tests.

## Symptoms

expected: Appearance should not add redundant runtime chrome that competes with the actual controls when preset context is already obvious.
actual: The user sees preset runtime chrome and reports "Рантайм пресета вообще лишнее."
errors: None reported.
reproduction: Open Settings, navigate to Appearance, observe the preset runtime section alongside already-obvious preset controls.
started: Reported during Phase 36 UAT on 2026-04-22.

## Eliminated

## Evidence

- timestamp: 2026-04-22T19:05:24Z
  checked: src/components/settings/tabs/AppearanceTab.tsx
  found: The main appearance column already shows the selected preset summary as the section heading, the light/dark segmented control, and the preset selector, while a second `surface-card` column unconditionally renders "Preset Runtime" with duplicate preset family, mode, and runtime-state rows.
  implication: The redundant chrome is caused by layout structure in the component itself, not by missing state or a rendering bug.

- timestamp: 2026-04-22T19:06:11Z
  checked: src/locales/en.json and src/locales/ru.json
  found: The copy explicitly says the preset family, mode, and reset behavior should "stay visible here" / "Здесь всегда видны...", and names the card `Preset Runtime` / `Runtime пресета`.
  implication: The redundancy is intentional product copy baked into the shipped UI contract.

- timestamp: 2026-04-22T19:06:54Z
  checked: src/components/settings/__tests__/AppearanceTab.presets.test.tsx, src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx, src/components/settings/__tests__/AppearanceTab.i18n.test.tsx
  found: Tests assert the runtime labels and state copy (`Preset Runtime`, `Untouched preset`, `Customized preset`) are present, so the suite protects the extra chrome instead of allowing it to disappear when context is obvious.
  implication: The redundant runtime chrome is reinforced by automated expectations, which is why it survived Phase 36 as deliberate behavior.

## Resolution

root_cause: `AppearanceTab` was deliberately designed in Phase 36 to render a permanent preset-runtime side card that repeats preset family, mode, and reset-state information already shown in the main appearance controls. The component never gates that chrome on whether the preset context is already obvious, and the locale/test seams encode that always-visible runtime contract as expected behavior.
fix:
verification:
files_changed: []
