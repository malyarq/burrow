# Phase 30 Research: Settings Truth And Honest Personalization

## What The Planner Needs To Know

Phase 30 should treat settings trust as a runtime-contract problem first and a visual-cleanup problem second. The current settings surface is not failing because FMCL lacks customization features. It is failing because the existing controls describe one mental model while the code applies another:

1. preset appearance is controlled by `theme`, `themePresetId`, `accentColor`, and `customTheme`, but the UI does not explain that relationship;
2. custom appearance edits silently clear preset identity and can collapse the user back onto base dark or light defaults;
3. the settings shell repeats the same descriptive copy and wraps tabs in heavy card geometry, so the modal feels larger and noisier than the tasks inside it;
4. several "appearance" controls either have weak visible effect, only affect a narrow seam, or are actually layout or behavior toggles.

The phase boundary should therefore be:

1. make preset, theme-mode, accent, and custom overrides behave as one truthful runtime seam;
2. normalize settings shell geometry and shared control affordances across the settings modal;
3. keep, reword, move, or remove appearance controls based on real visible impact and explicit scope;
4. only consider bounded `CUSTOM-01` after `SETTINGS-01` through `SETTINGS-03` are proven green.

The planner should explicitly avoid:

- another broad shell cleanup wave already owned by Phase 28;
- modpack workflow work already owned by Phase 29;
- a new theming library, form system, or settings router;
- decorative personalization expansion before the existing controls become truthful.

## Requirement Fit

- `SETTINGS-01`: directly owned. Current preset behavior is technically deterministic but not honest. Hidden `defaultTheme` switching, accent independence, preset loss on custom edits, and import/export inference all undermine user trust.
- `SETTINGS-02`: directly owned. Settings navigation, shell headers, toggles, sliders, segmented controls, checkboxes, collapsibles, and inner utility headers currently follow multiple geometry rules.
- `SETTINGS-03`: directly owned. Several appearance controls either do too little, do something narrower than their label suggests, or sit in the wrong conceptual group.
- `SETTINGS-04`: must be gated. The current codebase is not ready for deeper personalization because preset identity and custom override ownership are still split and fragile, so Phase 30 should satisfy this requirement only by making the gate explicit and then either shipping the smallest preset-adjacent slice or locking an explicit no-ship defer.

## Historical Context

Phase 12 and Phase 22 already spent milestone scope on theme truth and settings simplification:

- `.planning/phases/12-theme-truth-and-settings-ia-simplification/12-RESEARCH.md`
- `.planning/phases/22-theme-truth-and-interaction-state-fidelity/22-RESEARCH.md`

Those phases established the right direction:

- theme truth should live in one runtime seam;
- settings should be flatter and more task-oriented;
- shared controls should follow one interaction-state contract;
- manual proof should happen inside the real shell.

Phase 30 should build on those decisions, not start over. The current problem is that later settings work reintroduced ambiguity and geometry drift on top of that foundation.

## Current Baseline

### Preset truth is split across multiple state owners

The main ownership seam is:

- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/settings/types.ts`
- `src/components/settings/tabs/AppearanceTab.tsx`

Important current behavior:

- `applyThemePreset()` stores `themePresetId`, forces `theme` to `preset.defaultTheme`, and clears `customTheme`.
- `activeThemeConfig` is resolved from `theme + themePresetId + customTheme`.
- `applyThemeToDocument()` uses `activeThemeConfig` for document tokens.
- `BackgroundLayer` does not use `activeThemeConfig`; it reads `customTheme.background` directly.

That split produces several planning-critical problems:

- Preset selection has hidden dark/light coupling because every preset carries a `defaultTheme`, and choosing a preset can flip the base mode without warning.
- Presets do not include accent state. The visible result is really "preset surface colors + separate accent choice", but the UI reads like presets are whole themes.
- Any call to `setCustomTheme()` clears `themePresetId`. A user who starts from a preset and tweaks one custom field silently loses preset identity.
- Because `setCustomTheme()` clears preset identity instead of layering overrides on top of it, even a small custom change can drop the rest of the preset family and fall back to base dark/light defaults.
- `BackgroundLayer` reads raw `customTheme.background`, so background behavior is outside the main resolved theme contract.

This is the main reason bounded `CUSTOM-01` is not yet safe. The app does not have a robust "preset plus bounded override" model yet.

### Import and export are stable enough for tests, but not an honest contract

`AppearanceTab` exports:

- `presetId`
- `theme`
- `config: activeThemeConfig`

Import currently:

- reads `config`;
- sets `customTheme(parsed.config)`;
- sets `theme(parsed.theme)`;
- ignores `presetId`.

Recovery depends on inference in `SettingsContext`:

- `inferThemePresetId(theme, customTheme)` only works when the imported config looks like preset colors and has no background section;
- background-bearing imports cannot regain preset identity through inference;
- the current "restores preset identity" test passes because exported preset payloads happen to be inferable, not because import preserves preset identity intentionally.

This means Phase 30 planning should assume import/export semantics may need a migration-safe rewrite if preset/custom honesty changes.

### The current settings shell explicitly duplicates hierarchy and copy

The main shell seam is:

- `src/components/SettingsPage.tsx`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/settingsTabs.ts`

Current geometry issues are structural, not accidental:

- `SettingsTabsHeader` renders six large tab cards with `min-h-[5.75rem]`, two text rows, and card-like shadows.
- `SettingsPage` renders a second shell summary block under the tabs, with left description plus right `panelHint`.
- `SettingsPage` then repeats `panelHint` again in the footer next to the `Done` button.
- For most tabs, `settingsTabs.ts` sets `descriptionKey` and `panelHintKey` to the same copy source, so duplication is built into the config.

This maps directly to the product feedback about oversized tabs and repeated utility text.

### Inner tab content reintroduces hero cards and inconsistent control geometry

The problem is broader than `AppearanceTab`.

Important seams:

- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/settings/tabs/DownloadsTab.tsx`
- `src/components/settings/tabs/LauncherTab.tsx`
- `src/components/settings/tabs/StorageTab.tsx`
- `src/features/settings/statistics/StatisticsTab.tsx`
- `src/features/accounts/AccountsPage.tsx`
- `src/features/settings/mirrors/MirrorsSettings.tsx`
- `src/components/ui/CollapsibleSection.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Select.tsx`
- `src/index.css`

Observed geometry drift:

- `Input` and `Select` use shared `control-frame` and `control-label`.
- `Button` has a shared size and variant system.
- `AppearanceTab` uses hand-built segmented rows, a hand-built toggle switch, raw range inputs, raw color inputs, and collapsible sections.
- `DownloadsTab`, `LauncherTab`, and `MirrorsSettings` use native checkboxes with different sizes and different alignment.
- `CollapsibleSection` has its own accent-backed title bar geometry, separate from tab cards and from shared controls.
- Accounts, statistics, downloads, launcher, and mirrors all render their own top summary cards inside a shell that already provides summary framing.

As a result, the settings modal currently contains at least four separate geometry dialects:

1. shell tab cards;
2. shell summary and footer cards;
3. shared form primitives;
4. local custom control layouts inside individual tabs.

### Several "appearance" controls are misleading or low-feedback

#### 1. Theme presets overclaim relative to the actual runtime

Current UI copy suggests a preset is a ready-made visual profile. In practice, a user's visible appearance is a composition of:

- base theme mode;
- preset surface colors;
- separate accent color;
- optional custom theme overrides;
- optional background settings.

That is too much hidden composition for the current labeling.

#### 2. Custom edits silently destroy preset context

The user is never told that editing a custom color or background setting clears preset identity. There is also no explicit "Custom Theme" state in the select UI once that happens; the control falls back to a placeholder-like empty state.

#### 3. `Advanced Appearance` is real, but weakly explained

The color pickers do change document tokens, but they do not explain scope clearly and they currently sit on top of a preset model that they can silently invalidate.

#### 4. `Background Effects` often has little or no visible result

`BackgroundLayer.tsx` shows why:

- background media sits behind a mostly opaque shell frame;
- `background_type=image` with no `image` URL does not visibly change anything;
- `background_type=video` with no `video.url` falls back to the same static backdrop;
- `blur`, `opacity`, and `position` controls can remain visible even when there is no actual media asset to affect;
- reduced-motion mode intentionally collapses video and particle backgrounds back to a static fallback.

The controls are not necessarily dead, but they are much narrower than their labels suggest.

#### 5. `Compact Mode` is not general "appearance"

Search results show `compactMode` only affects sidebar width in `src/components/Sidebar.tsx`. It does not make the overall settings UI or the wider app broadly compact.

#### 6. `Enable Animations` is broader than the appearance tab implies

`disableAnimations`:

- adds the `disable-animations` class on `body`;
- disables broad CSS transitions in `src/index.css`;
- changes reduced-motion behavior in `BackgroundLayer`;
- is also observed by `Modal` reduced-motion logic and `SimplePlayDashboard`.

That makes it more like a global motion/accessibility behavior toggle than a simple appearance flourish.

#### 7. Legacy branding proof still exists in docs and manual harnesses

Phase 28 removed the dedicated appearance brand explainer card, but stale artifacts remain:

- `settings.brand_system_title` and `settings.brand_system_desc` still exist in both locale files;
- manual verification scenarios still wait for `Shared launcher brand`, which no longer appears on the live appearance tab.

That means the manual proof seam is stale right where Phase 30 most needs honest verification.

## Localization Surfaces

Phase 30 is not a locale-formatting phase, but it will touch localized settings copy heavily.

Relevant seams:

- `src/contexts/settings/i18n.ts`
- `src/locales/en.json`
- `src/locales/ru.json`
- `src/components/settings/settingsTabs.ts`
- `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`

Important notes:

- `SettingsContext` already exposes `t`, `locale`, `formatDate`, and `formatNumber`; Phase 30 should reuse that instead of inventing any new locale layer.
- Tab descriptions and panel hints are localized through `settingsTabs.ts`, so shell-copy cleanup is mostly a locale-key audit, not an architecture change.
- Product feedback explicitly called out preset naming clarity. Current labels are localized, but not explanatory about mode coupling or preset scope.
- Unused or stale brand-copy keys should be treated as debt when updating the appearance copy contract.

## Standard Stack

Use the existing stack and ownership seams:

- React + TypeScript + TailwindCSS
- `SettingsContext` with localStorage-backed state
- document theme tokens applied through `src/contexts/settings/theme.ts`
- semantic surface and control classes in `src/index.css`
- shared primitives in `src/components/ui/*`
- Vitest + jsdom for contract tests
- existing manual verification harness in `src/verification/manual/*`

## Architecture Patterns

### 1. One runtime ownership seam for appearance state

Theme mode, preset identity, accent, background, and custom overrides should describe one explicit runtime contract. Planning should not keep document colors in one seam and background behavior in another.

### 2. Shell-owned settings framing, tab-owned content

The modal shell should own tab semantics, compact navigation, and only the minimum orientation copy. Individual tab surfaces should not need to reintroduce another heavy hero card just to explain themselves.

### 3. Shared settings control primitives, not per-tab control dialects

If Phase 30 needs toggles, segmented controls, or range rows, it should create or normalize shared primitives in the existing `ui` layer instead of leaving each tab to hand-roll its own geometry.

### 4. Standalone utility surfaces must keep working outside the settings modal

`AccountsPage` and `StatisticsTab` are also used in manual verification outside `SettingsPage`. If Phase 30 strips duplicate hero content, it should do so with explicit embedding awareness rather than breaking standalone usage.

## Don't Hand-Roll

- Do not introduce MUI, Chakra, Radix, or another component framework.
- Do not add a new theming library or external i18n runtime.
- Do not create a second settings router to solve what is really a shell and hierarchy problem.
- Do not build open-ended theme customization infrastructure before the current preset/custom contract is truthful.

## Concrete File Seams Most Likely To Change

### Runtime truth and preset behavior

- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/settings/types.ts`
- `src/components/layout/BackgroundLayer.tsx`

### Settings shell and navigation geometry

- `src/components/SettingsPage.tsx`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/settingsTabs.ts`
- `src/index.css`

### Shared control geometry

- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/CollapsibleSection.tsx`
- likely one or more new shared settings primitives for toggle, segmented, or range controls

### Tab content and honesty audit

- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/settings/tabs/DownloadsTab.tsx`
- `src/components/settings/tabs/LauncherTab.tsx`
- `src/components/settings/tabs/StorageTab.tsx`
- `src/features/settings/mirrors/MirrorsSettings.tsx`
- `src/features/settings/statistics/StatisticsTab.tsx`
- `src/features/accounts/AccountsPage.tsx`

### Locale and validation seams

- `src/locales/en.json`
- `src/locales/ru.json`
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/__tests__/SettingsPage.navigation.test.tsx`
- `src/components/settings/__tests__/SecondarySettingsTabs.test.tsx`
- `src/contexts/settings/__tests__/themeDocument.test.ts`
- `src/contexts/settings/__tests__/themeRuntimeContract.test.ts`
- `src/components/layout/__tests__/BackgroundLayer.motion.test.tsx`
- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`

## Existing Tests And Docs That Should Shape Planning

### Strong existing assets

- `.planning/phases/12-theme-truth-and-settings-ia-simplification/12-RESEARCH.md`
- `.planning/phases/22-theme-truth-and-interaction-state-fidelity/22-RESEARCH.md`
- `docs/ru/product-feedback-2026-04-20.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `src/contexts/settings/__tests__/themeDocument.test.ts`
- `src/contexts/settings/__tests__/themeRuntimeContract.test.ts`
- `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.branding.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`

### Tests that currently codify today's misleading contract

- `AppearanceTab.presets.test.tsx` currently enforces the hidden `defaultTheme` coupling.
- `SettingsPage.navigation.test.tsx` and `SecondarySettingsTabs.test.tsx` are built around repeated tab-summary copy being present, not around reducing duplication.
- `BackgroundLayer.motion.test.tsx` only proves reduced-motion fallback; it does not prove honest control scope or visible impact.

### Validation artifacts that are stale

- `src/verification/manual/scenarios.tsx` still uses `Shared launcher brand` as a readiness marker for settings appearance proof even though the dedicated brand card is gone.
- `src/locales/en.json` and `src/locales/ru.json` still carry unused `settings.brand_system_*` keys.

Phase 30 planning should assume some existing tests and manual proof references need deliberate replacement, not just additive tweaks.

## Common Pitfalls

- Fixing only `AppearanceTab` geometry while leaving downloads, launcher, statistics, accounts, and mirrors in their current nested-card shape.
- Treating presets as a styling problem instead of a runtime ownership problem.
- Adding more presets or new appearance options before proving the current controls are honest.
- Refactoring accounts or statistics so aggressively that their standalone manual-verification use stops working.
- Shipping shell-level cleanup without refreshing the manual verification seam, leaving Phase 30 with green unit tests but stale live proof.

## Brownfield-Safe Sequencing

### 1. Repair the appearance runtime contract before changing geometry

The planner should start with one explicit model for:

- theme mode;
- preset identity;
- accent;
- custom overrides;
- background behavior;
- import/export persistence.

If Phase 30 starts with shell restyling only, the settings surface may look cleaner while preset/custom behavior remains misleading.

### 2. Normalize settings shell hierarchy next

Once the state model is truthful, reduce duplication and visual weight in:

- tab navigation;
- shell summary blocks;
- footer guidance;
- nested inner headers.

This should be a shell-first pass, not six independent tab redesigns.

### 3. Standardize controls and audit honesty together

After the shell is lighter, normalize toggles, segmented controls, sliders, and collapsibles across tabs, and use that same pass to decide which appearance controls stay, move, get reworded, or get removed.

This is the right time to decide whether `compactMode` and `disableAnimations` still belong under Appearance, and whether background controls need scope explanation or removal.

### 4. Treat bounded `CUSTOM-01` as a gated last step, not guaranteed scope

The safest planning stance is:

- `SETTINGS-04` is satisfied only when the gate is explicit and the post-gate outcome is locked;
- actual new personalization work should only land after the truth checklist is green;
- Phase 30 may then either ship the smallest preset-adjacent slice or preserve an explicit no-ship defer, but it must not leave the outcome ambiguous.

If the phase still includes any `CUSTOM-01` implementation, it should be a final small plan after the core settings truth plans pass.

## Recommended Plan Shape

The cleanest Phase 30 decomposition is four plans:

- `30-01`: repair preset/theme/custom/background truth and persistence ownership
- `30-02`: slim the settings shell and normalize navigation hierarchy
- `30-03`: unify control geometry and audit appearance-control honesty
- `30-04`: refresh manual proof, finalize the settings-truth checklist, and only then decide whether a bounded `CUSTOM-01` slice is still justified

Recommended wave map:

- Wave 1: `30-01`
- Wave 2: `30-02`
- Wave 3: `30-03`
- Wave 4: `30-04`

## Validation Architecture

### Layer 1: runtime truth contract tests

Prove that:

- preset selection does not hide unexpected dark/light switching;
- preset identity survives persistence and import/export intentionally, not by fragile inference;
- custom overrides either compose honestly with presets or clearly transition to a labeled custom state;
- background behavior reads from the same runtime contract as document theme tokens.

Primary targets:

- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/components/layout/BackgroundLayer.tsx`

### Layer 2: settings shell and control geometry tests

Prove that:

- the settings modal no longer duplicates the same descriptive copy in multiple shell zones;
- tab navigation remains accessible while becoming visually lighter and more compact;
- toggles, sliders, segmented controls, selects, and collapsibles share one geometry language.

Primary targets:

- `src/components/SettingsPage.tsx`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/settings/tabs/DownloadsTab.tsx`
- `src/components/settings/tabs/LauncherTab.tsx`

### Layer 3: honesty and scope tests

Prove that:

- controls kept under Appearance cause a visible effect or disclose their narrow scope;
- controls moved out of Appearance are still reachable from an honest home;
- tabs embedded inside settings do not stack redundant hero blocks on top of shell-owned framing.

Primary targets:

- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/features/settings/mirrors/MirrorsSettings.tsx`
- `src/features/settings/statistics/StatisticsTab.tsx`
- `src/features/accounts/AccountsPage.tsx`

### Layer 4: shell-integrated manual proof and repo gate

Refresh the manual settings proof so it no longer waits for removed brand-card text and can verify:

- one dark preset state;
- one light state;
- one custom-or-bounded-personalization state, if retained;
- EN and RU copy on the real settings shell.

Expected closeout commands:

- `npx vitest run src/contexts/settings/__tests__/themeDocument.test.ts src/contexts/settings/__tests__/themeRuntimeContract.test.ts src/components/settings/__tests__/AppearanceTab.presets.test.tsx src/components/settings/__tests__/AppearanceTab.state-fidelity.test.tsx src/components/settings/__tests__/AppearanceTab.i18n.test.tsx src/components/settings/__tests__/AppearanceTab.branding.test.tsx src/components/settings/__tests__/AppearanceTab.background-controls.test.tsx src/components/settings/__tests__/AppearanceTab.customized-state.test.tsx src/components/settings/__tests__/SettingsTabsHeader.state-fidelity.test.tsx src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx src/components/settings/__tests__/StorageTab.layout.test.tsx src/components/__tests__/SettingsPage.navigation.test.tsx src/components/__tests__/SettingsPage.accounts.test.tsx src/components/__tests__/SettingsPage.downloads.test.tsx src/components/__tests__/SettingsPage.launcher.test.tsx src/components/__tests__/SettingsPage.launcher.i18n.test.tsx src/components/__tests__/SettingsPage.statistics.test.tsx src/components/__tests__/SettingsPage.storage.test.tsx src/components/settings/__tests__/SecondarySettingsTabs.test.tsx src/components/layout/__tests__/BackgroundLayer.motion.test.tsx src/features/accounts/__tests__/AccountsPage.a11y.test.tsx src/features/accounts/__tests__/AccountsPage.layout.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx src/features/settings/mirrors/__tests__/MirrorsSettings.layout.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.test.tsx src/features/settings/statistics/__tests__/StatisticsTab.layout.test.tsx src/verification/manual/__tests__/appearanceProof.test.tsx src/verification/manual/__tests__/views.test.ts`
- `npx tsc --noEmit`
- `npx eslint src/contexts/SettingsContext.tsx src/contexts/settings/theme.ts src/contexts/settings/theme-presets.ts src/contexts/settings/types.ts src/components/SettingsPage.tsx src/components/settings/SettingsTabsHeader.tsx src/components/settings/settingsTabs.ts src/components/settings/tabs/AppearanceTab.tsx src/components/settings/tabs/DownloadsTab.tsx src/components/settings/tabs/LauncherTab.tsx src/components/settings/tabs/StorageTab.tsx src/features/settings/mirrors/MirrorsSettings.tsx src/features/accounts/AccountsPage.tsx src/features/settings/statistics/StatisticsTab.tsx src/components/layout/BackgroundLayer.tsx src/components/ui/CollapsibleSection.tsx src/components/ui/Input.tsx src/components/ui/Select.tsx src/components/ui/Button.tsx src/verification/manual/scenarios.tsx src/verification/manual/views.ts`

## Planner Guidance

- Treat the real appearance contract as `theme + preset + accent + overrides + background`, not as a single dropdown.
- Fix runtime truth before visual polish so Phase 30 does not ship a cleaner-looking lie.
- Use shell-owned hierarchy reduction to remove duplicate copy before touching every tab body.
- Normalize control geometry through shared primitives, not by hand-restyling each tab independently.
- Require every appearance control to pass one of three outcomes: keep and prove, reword honestly, or remove or move.
- Gate bounded `CUSTOM-01` behind explicit proof that `SETTINGS-01`, `SETTINGS-02`, and `SETTINGS-03` are already satisfied.
