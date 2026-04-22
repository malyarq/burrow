---
status: resolved
trigger: "Diagnose one UAT gap for Phase 36: Switching appearance presets and light/dark variants should produce visible, reliable visual changes instead of leaving most preset selections looking unchanged."
created: 2026-04-22T19:06:55Z
updated: 2026-04-22T19:25:10Z
---

## Current Focus

hypothesis: Confirmed. Preset selection updates document tokens, but major shell surfaces still bypass those tokens with fixed `dark:*` zinc/slate classes while preset families also leave accent/background defaults untouched.
test: Verified the preset/document tests pass, then inspected the primary launcher surfaces that still use hard-coded dark-mode utility classes.
expecting: N/A
next_action: Return the root-cause diagnosis for Phase 36 Test 2.

## Symptoms

expected: Switching appearance presets and light/dark variants should visibly change the launcher UI.
actual: User reports that selecting "Midnight" and other presets appears to do nothing, while the light preset changes correctly.
errors: none reported
reproduction: Open Settings -> Appearance, switch presets in dark mode, observe that most choices look unchanged; switch to light preset and observe visible change.
started: Reported during Phase 36 UAT on 2026-04-22.

## Eliminated

## Evidence

- timestamp: 2026-04-22T19:14:00Z
  checked: src/contexts/SettingsContext.tsx and src/contexts/settings/theme.ts
  found: `applyThemePreset()` stores the selected preset ID, clears overrides, resolves `activeThemeConfig`, and `applyThemeToDocument()` rewrites document CSS variables like `--bg-app`, `--bg-card`, `--text-main`, and brand tokens on every appearance change.
  implication: Preset selection is not failing at the persistence or document-token layer.

- timestamp: 2026-04-22T19:17:00Z
  checked: src/contexts/settings/theme-presets.ts and src/contexts/settings/types.ts
  found: Theme presets only define `colors` and `brand` overrides. `accentColor` remains a separate global setting, and no preset ships background-layer defaults.
  implication: Switching preset families cannot change the dominant accent or activate backdrop effects, so the visual delta is limited even when the preset changes successfully.

- timestamp: 2026-04-22T19:22:00Z
  checked: src/components/sidebar/ModloaderSection.tsx, src/components/sidebar/ModpackSection.tsx, and src/components/SimplePlayDashboard.tsx
  found: High-visibility launcher sections still use hard-coded zinc/dark classes such as `text-zinc-600 dark:text-zinc-400`, `bg-zinc-100/80 dark:bg-zinc-900/50`, `dark:bg-zinc-700/90`, and `text-zinc-500 dark:text-zinc-400` instead of the preset-driven theme tokens.
  implication: Changing from one dark preset to another leaves much of the shell on the same fixed dark palette, while a light/dark mode toggle still produces a clear change because those hard-coded `dark:*` branches do switch.

- timestamp: 2026-04-22T19:24:00Z
  checked: `npx vitest run src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/contexts/settings/__tests__/themeDocument.test.ts`
  found: All 11 targeted tests passed, including immediate preset repaint and document-variable assertions.
  implication: The preset persistence and document-token rewrite path is working as designed; the visible no-op comes from how the shell consumes styling, not from the preset selection logic failing to run.

## Resolution

root_cause: Appearance presets only update a limited token set (`colors` and `brand`) while leaving accent and background defaults outside preset ownership, and the live shell still contains many hard-coded zinc/dark utility classes. As a result, switching among dark preset families changes the stored CSS variables but much of the visible launcher remains on the same fixed dark palette, so users mostly notice only the light/dark mode toggle.
fix:
verification:
files_changed: []
