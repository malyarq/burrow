# Phase 36 Research: Settings Predictability And Shared Control Contract

## What The Planner Needs To Know

Phase 36 is the direct closure pass for the remaining settings feedback in
`docs/ru/product-feedback-2026-04-20.md`. It is not a general “make settings prettier”
wave and it is not a broad redesign of the whole launcher chrome.

The remaining product complaints are specific and still visible in the current code:

1. settings still spend too much vertical space on chrome before the user reaches real controls;
2. the settings shell still repeats explanatory copy, especially through the shared summary strip and embedded tab heroes;
3. preset themes are technically stateful but not product-clear, because preset identity, light/dark mode, and bounded overrides can diverge without a strong visible contract;
4. accent chips, sliders, toggles, and tab buttons do not yet read as one control family;
5. some appearance controls still require too much interpretation to understand what they visibly change.

The phase boundary should stay narrow:

1. fix settings-specific IA, copy, and control geometry inside the existing modal shell;
2. make preset state and scoped appearance behavior predictable without reopening theme-system architecture;
3. use settings as the canonical shared-control contract seam for `DESIGN-01`, but do not reopen unrelated shell, catalog, details, or guided-content phases;
4. refresh proof and tests so later closeout evaluates the actual Phase 36 contract instead of stale settings-era assumptions.

The phase should explicitly avoid:

- reintroducing a standalone brand-system card or another settings hero layer;
- adding new appearance capabilities instead of stabilizing the ones already shipped;
- broad sidebar, titlebar, catalog, or details redesign work already owned by Phases 32-35;
- speculative theme intelligence or auto-magic preset inference beyond what the current stored state can truthfully support.

## Requirement Fit

### `SETTINGS-05`

This requirement is owned by the settings shell and embedded tab surfaces:

- `src/components/SettingsPage.tsx`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/settingsTabs.ts`
- `src/components/settings/tabs/DownloadsTab.tsx`
- `src/components/settings/tabs/LauncherTab.tsx`
- `src/components/settings/tabs/StorageTab.tsx`
- `src/features/settings/statistics/StatisticsTab.tsx`
- `src/components/__tests__/SettingsPage.navigation.test.tsx`
- `src/components/settings/__tests__/SecondarySettingsTabs.test.tsx`
- `src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx`

Current state:

- `SettingsPage.tsx` renders a large tab header, then a shared summary strip, then the tab panel.
- `settingsTabs.ts` duplicates `description` and `panelHint` for five of six tabs, so the shell often repeats the same guidance twice before the panel starts.
- `StatisticsTab.tsx` still repeats `stats.description` across the embedded shell and inner cards, which is exactly the kind of duplicated explanatory copy the feedback called out.
- The tab chooser is still built as a card grid with label plus description on every tab, which makes the settings modal feel taller and heavier than the actual task content.

Planning implication:

- Phase 36 must treat settings chrome density and repeated copy as a layout-contract problem, not only a wording tweak.
- The shell needs one authoritative settings header contract, not a tab-card grid plus another summary strip plus embedded tab heroes.
- Embedded surfaces must stop restating shell-level guidance unless they add new information.

Out of scope:

- changing non-settings feature copy unless it is directly embedded inside the settings shell.

### `SETTINGS-06`

This requirement is owned by appearance state, preset selection, and preset-adjacent overrides:

- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx`
- `src/contexts/settings/__tests__/themeRuntimeContract.test.ts`
- `src/contexts/settings/__tests__/themeDocument.test.ts`

Current state:

- The runtime state is coherent in code: `themePresetId`, `theme`, `customTheme`, and `accentColor` are normalized and resolved into one live config.
- The product contract is not coherent enough:
  - selecting a preset sets its default mode once, but the user can then switch light/dark independently while the preset dropdown still shows the same preset family;
  - bounded overrides keep preset ancestry visible only through a small `Customized` badge;
  - reset behavior clears overrides but does not clearly answer whether the user is returning to the untouched preset or only dropping some deltas;
  - legacy and import inference can sometimes restore preset ancestry and sometimes not.

Planning implication:

- Phase 36 must make preset ancestry, current mode, and customized state visibly legible on the surface.
- The phase should remove hidden “why did this preset change?” interpretations by defining one explicit preset-plus-mode contract.
- Tests need to assert preset reset semantics and mode behavior instead of only checking that state serializes.

Out of scope:

- inventing a new multi-layer theme editor or rewriting the underlying CSS variable engine.

### `SETTINGS-07`

This requirement is owned by the shared settings control system:

- `src/index.css`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/settings/tabs/DownloadsTab.tsx`
- `src/components/settings/tabs/LauncherTab.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx`
- `src/components/__tests__/SettingsPage.launcher.test.tsx`
- `src/components/__tests__/SettingsPage.downloads.test.tsx`

Current state:

- Tabs, toggles, segmented controls, accent chips, and sliders all look related, but they are not yet governed by one geometry contract.
- The accent swatches mix true buttons and an invisible color input overlay, so pressed/focus/selection behavior is not the same across all accent choices.
- Sliders rely mostly on browser-native range rendering, which is why the scale slider can feel disconnected from the rest of the controls.
- Toggle track/thumb styling exists centrally, but spacing and containment vary because not every surface uses the same row shell.
- The tab grid still spends too much height on descriptive cards and does not read like the same family as the smaller segmented controls inside the panels.

Planning implication:

- Phase 36 must define one visible control contract for tabs, toggles, sliders, and accent selection.
- The canonical seams should live in shared CSS plus the settings surfaces that already expose every major control family.
- Missing tests should be added for embedded launcher/downloads layout and for accent/sliders using the same state/focus contract.

Out of scope:

- rewriting every control across the whole app in one pass; the phase should establish the contract from settings outward.

### `SETTINGS-08`

This requirement is owned mainly by appearance and launcher surfaces:

- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/settings/tabs/LauncherTab.tsx`
- `src/components/settings/__tests__/AppearanceTab.branding.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx`
- `src/components/__tests__/SettingsPage.launcher.test.tsx`
- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`

Current state:

- The appearance tab already tries to explain scope: background controls only affect the backdrop layer, and launcher runtime controls now live in `Launcher`.
- The remaining issue is that the visible-effect contract is still too weak:
  - advanced appearance and background effects are hidden in collapsibles that can feel detached from the main settings narrative;
  - users still have to infer whether a control changes shell layout, preset colors, background media, or motion;
  - some sections feel like legacy power-user surfaces rather than product-scoped settings.

Planning implication:

- Phase 36 should either remove false generality from these controls or make their scope explicit on the surface.
- Appearance should only own visible shell mood, accent, and background scope; launcher should own layout density, zoom, animations, and runtime-shell behavior.
- Manual proof needs to check “visible effect or explicit scope explanation,” not only DOM presence.

Out of scope:

- deleting power-user capabilities if they can be made honest and bounded with a clear explanation.

### `DESIGN-01`

This phase only owns the settings-facing portion of the shared control contract, but it is the first phase where all key control families coexist in one place:

- tabs in `SettingsTabsHeader.tsx`
- toggles in `LauncherTab.tsx` and `DownloadsTab.tsx`
- segmented options in `AppearanceTab.tsx` and `LauncherTab.tsx`
- accent selection in `AppearanceTab.tsx`
- sliders in `AppearanceTab.tsx` and `LauncherTab.tsx`

Planning implication:

- The milestone-wide requirement is closed across Phases 32-35 plus this final settings pass, not by reopening shell, catalog, details, and content work inside Phase 36.
- Phase 36 should treat settings as the canonical proof surface for “one visible button, toggle, slider, tab, and copy contract.”
- The phase should finish with manual and automated seams that later phases can cite when touching shared controls elsewhere.

Out of scope:

- reopening catalog and details controls that were already stabilized in earlier phases unless their shared styles must be referenced for consistency.

## Historical Context

Phase 30 already removed the most obvious settings-era contradictions:

- launcher-wide controls moved out of `Appearance`;
- preset-adjacent customization became bounded instead of pretending to be a separate theme system;
- settings tabs were made more coherent than the older stacked shell.

That phase did not close the feedback file because it still optimized for internal truth more than for obvious product predictability. The current gaps are exactly the difference between “state is technically correct” and “the user can read what this setting does without reverse-engineering it.”

Phase 32 already removed the old sidebar/shell branding excess, but settings still retain their own leftover chrome density and copy duplication. Phase 36 should therefore be treated as the settings-specific cleanup pass that makes the earlier restraint work actually feel complete.

## Current Hotspots And Why They Matter

### The settings shell spends too much space on navigation chrome

The tab chooser is a descriptive card grid, and the shared summary strip repeats guidance before the panel starts. This means the modal often shows mostly navigation chrome above the fold instead of the actual controls the user came to change.

This matters because the feedback was not about missing features; it was about settings feeling heavy and visually overbuilt.

### Preset state is truthful in code but ambiguous on the surface

The state model is sophisticated enough to preserve preset ancestry, mode, and bounded overrides. The UI surface is not strong enough to explain that model clearly, so users experience “Navi/Forest changed somehow” instead of “this preset is still active, but you changed mode and layered bounded refinements on top.”

This matters because unpredictability in settings destroys trust faster than a missing option.

### The control family still looks assembled, not authored

Tabs are tall cards, toggles live in one geometry, sliders fall back to browser-native rendering, and the custom accent picker is structurally different from the preset accent chips.

This matters because the feedback explicitly called out buttons, toggles, sliders, and tab weight as feeling like unrelated component families.

### Appearance scope is more honest than before, but still not explicit enough

The code already moved runtime-layout settings out of `Appearance`, yet the remaining advanced/background controls still require too much interpretation to understand whether they change visible shell behavior, background media, motion, or preset colors.

This matters because users interpret ambiguous controls as broken controls.

### The proof harness still reflects older settings assumptions

Manual verification routes still describe Phase 30-era appearance proof, not the direct feedback contract around duplicate copy, predictable presets, control geometry, and visible-effect scope.

This matters because later closeout can otherwise pass while reviewers are still checking the wrong settings story.

## Validation Architecture

Phase 36 should stay inside the existing `vitest + eslint + tsc` loop, but it needs stronger settings-specific seams before execution is believable.

Existing strong seams:

- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.branding.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx`
- `src/components/__tests__/SettingsPage.navigation.test.tsx`
- `src/components/__tests__/SettingsPage.launcher.test.tsx`
- `src/components/__tests__/SettingsPage.downloads.test.tsx`
- `src/components/__tests__/SettingsPage.storage.test.tsx`
- `src/components/__tests__/SettingsPage.statistics.test.tsx`
- `src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx`
- `src/contexts/settings/__tests__/themeRuntimeContract.test.ts`
- `src/contexts/settings/__tests__/themeDocument.test.ts`

Missing or weak seams that should be planned before claims are trusted:

1. a settings-shell layout seam that rejects duplicate shell copy and over-tall tab chrome as the default contract;
2. explicit tests for preset mode-switch behavior, reset semantics, and visible preset ancestry after bounded overrides;
3. a control-geometry seam that covers custom accent selection, shared slider styling, and toggle containment under one contract;
4. dedicated embedded-layout tests for `DownloadsTab` and `LauncherTab`, which are currently mostly covered indirectly through page-route tests;
5. manual proof wording that tells reviewers to judge predictability, control-family cohesion, and visible-effect scope rather than only “settings appearance exists.”
