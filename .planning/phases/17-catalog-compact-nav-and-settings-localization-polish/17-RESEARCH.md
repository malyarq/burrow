---
phase: 17
slug: catalog-compact-nav-and-settings-localization-polish
status: researched
created: 2026-04-17
requirements:
  - CATALOG-01
  - CATALOG-02
  - CATALOG-03
  - SET-01
  - SET-02
---

# Phase 17 Research

## Goal Lens

Phase 17 is a shipped-surface polish and consistency phase, not a new catalog or settings redesign. The plan needs to close the remaining screenshot-backed defects around catalog scanability, branded empty-art states, compact sidebar coherence, and settings/localization truth while preserving the current launcher architecture and shared UI seams.

## Requirement Anchor

- `CATALOG-01`: catalog filters and primary controls stay legible at shipped desktop widths with the sidebar open
- `CATALOG-02`: modpacks without artwork show a branded fallback cover instead of an empty or generic broken-looking state
- `CATALOG-03`: collapsed navigation keeps a coherent active-state affordance without stray placeholder letters
- `SET-01`: the shipped settings shell and launch-adjacent settings controls do not leak raw localization keys
- `SET-02`: theme preset names follow one deliberate RU/EN naming policy

## Audited Bug Cluster Covered Here

- `BUG-08`: catalog filter labels and controls are truncated with the sidebar open
- `BUG-10`: catalog cards without artwork do not present a deliberate branded fallback
- `BUG-11`: collapsed sidebar shows a lone `M` for the modpacks destination
- `BUG-12`: theme preset names remain English-only in Russian settings
- `BUG-02`: raw i18n keys were visible on the settings shell and launch-adjacent controls; Phase 15 covered the launch-runtime seam, but the settings shell still uses direct key rendering and remains a live risk

## Key Code Seams

### Installed catalog scanability seam

- `src/components/modpacks/ModpackList.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Input.tsx`
- `src/components/modpacks/__tests__/ModpackList.*`

The installed modpack catalog is the most likely source of the screenshot with the open sidebar. Its filter row uses a `sm:flex-row` shell plus three fixed-width selects at `w-[140px]`, which is prone to truncation once the content area narrows behind the expanded launcher sidebar. The search/filter header already has the right responsibilities; the issue is layout resilience, not missing product controls.

### Remote browser scanability seam

- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/mockEnvironment.ts`

The remote browser is already more adaptive than the installed list: filters wrap and use `min-w-[150px]` instead of hard-coded widths. It still owns catalog-facing artwork fallback, history recall, and the manual verification seam at `manual-verification.html?view=modpack-browser`, so Phase 17 should treat it as part of the same catalog contract even if the width bug is worse on the installed list.

### Catalog artwork fallback seam

- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/ui/LazyImage.tsx`
- `src/app/assets/branding.ts`

Both catalog surfaces bypass the branded launcher-mark default and hardcode `"/icon.png"` as the fallback asset. `LazyImage` already defaults to `LAUNCHER_MARK_PATH` when no explicit fallback is passed, and it supports a custom placeholder node for richer branded empty states. The likely Phase 17 work is therefore a shared fallback contract, not two unrelated image patches.

### Compact navigation seam

- `src/components/Sidebar.tsx`
- `src/components/sidebar/SidebarHeader.tsx`
- `src/components/__tests__/Sidebar.keyboard.test.tsx`

The collapsed sidebar currently treats the two mode switches differently: `simple` becomes an icon (`PanelsTopLeft`), while `modpacks` becomes the literal string `M`. That matches the audit defect exactly. The surrounding collapsed-shell actions already use proper icon buttons and accessible names, so the compact-nav fix should stay inside the current sidebar header and mode-switch contract rather than reopening launcher-wide navigation.

### Settings shell and preset naming seam

- `src/components/SettingsPage.tsx`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/settingsTabs.ts`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/settings/i18n.ts`
- `src/locales/en.json`
- `src/locales/ru.json`
- `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/__tests__/SettingsPage.navigation.test.tsx`

The settings shell still renders several labels and descriptions through plain `t(key)` with no fallback guard. Because `createTranslator()` returns the key itself on misses, any absent locale entry leaks immediately into the UI. At the same time, theme preset display names are hard-coded English strings in `theme-presets.ts` and rendered directly in `AppearanceTab`, so the preset-naming policy is currently implicit rather than deliberate.

## Current Behavior And Likely Root Causes

### 1. Catalog scanability is split across two surfaces, and the installed list is less resilient

`ModpackList.tsx` uses a two-part filter bar:

- search input in the main column
- a sibling `div` with three fixed-width selects (`140px` each)

That works on wide canvases, but once the expanded sidebar reduces the content width, the controls are forced into a cramped horizontal strip. The remote browser already wraps more gracefully, which suggests the audit defect is either primarily on the installed list or on the shared catalog expectation across both surfaces.

Planning implication:
- at least one plan should own catalog responsiveness across both installed and remote catalog surfaces
- the likely fix is responsive composition and token/layout tuning, not a new filtering model
- do not stop at one catalog surface unless the manual proof explicitly demonstrates the other surface is already compliant

### 2. Branded artwork fallback is inconsistent and currently implementation-led

Installed and remote catalog cards currently call `LazyImage` like this:

- installed list: `fallback="/icon.png"`
- remote browser: `src={modpack.iconUrl ?? '/icon.png'}` plus `fallback="/icon.png"`

That bypasses the launcher-mark asset path and makes no-art behavior depend on the generic icon file rather than a deliberate product fallback. The audit calls for a branded cover/fallback, which is stronger than “show any image that exists.”

Planning implication:
- define one catalog fallback contract reusable by both `ModpackList` and `ModpackBrowser`
- prefer a shared helper or shared `LazyImage` usage pattern over surface-specific art logic
- preserve existing metadata lookup rules; the phase is about the empty-state presentation, not metadata ingestion

### 3. Collapsed modpacks navigation is literally a placeholder-like letter

`SidebarHeader.tsx` renders the collapsed `simple` button as an icon and the collapsed `modpacks` button as the text `M`. That creates the “one lone letter among icons” look captured in the audit. Accessibility is partly in place via `title` on collapsed buttons, but the visual affordance is inconsistent.

Planning implication:
- keep the existing two-mode switch and current `UIMode` state model
- make the compact representation coherent across both modes, preferably icon-led or otherwise equally intentional
- preserve keyboard behavior and active-state visibility while changing the collapsed presentation

### 4. Settings-shell localization is still structurally fragile

Phase 15 repaired the launch-adjacent runtime controls with `translateWithFallback`, but the shared settings shell still relies on raw `t(key)` in multiple places:

- `SettingsTabsHeader.tsx` for tab labels and descriptions
- `SettingsPage.tsx` for header kicker, description, panel hint, and footer hint
- `AppearanceTab.tsx` for many visible strings that currently happen to exist, but still use the raw translator contract

Because the translator returns the key on misses, this shell is one missing locale entry away from leaking raw keys again.

Planning implication:
- Phase 17 should not treat SET-01 as “just add a few locale entries”; it should harden the high-risk shell seams against key leakage
- the fix can stay narrow by targeting settings and launch-adjacent controls only, not every `t(...)` usage in the repo
- reuse the existing fallback pattern already established in runtime/settings subcomponents instead of inventing another translator layer

### 5. Theme preset naming needs a product decision before implementation

`theme-presets.ts` keeps stable preset IDs (`default`, `midnight`, `forest`, `light-plus`, `navy`) but also stores their display names as hard-coded English strings. `AppearanceTab` uses those names directly in:

- the preset combobox options
- the heading summary (`Forest · Dark`, etc.)
- exported theme metadata (`selectedPreset?.name`)

The audit allows either localized names or an explicitly brand-like nonlocalized policy, but the code currently implements neither as a decision; it simply leaks English literals.

Planning implication:
- lock the naming policy early in Phase 17
- preserve preset IDs and persistence shape regardless of the display-name decision
- expect tests to change, because current preset tests assert English UI copy

## Constraints

- User-facing strings must live in `src/locales/en.json` and `src/locales/ru.json`.
- No `any`; keep TypeScript strict seams intact.
- UI code should continue using the current settings context and IPC wrappers rather than new global state paths.
- This phase should not redesign settings IA, launcher routes, or catalog feature scope.
- Any theme-preset naming change must preserve stable preset IDs and migration behavior in `SettingsContext`.
- Manual proof should reuse the existing verification app rather than creating a separate browser-E2E platform.

## Existing Patterns And Prior Decisions

- Phase 11 already pushed adaptive layout fixes toward shared shell/control seams instead of one-off breakpoint hacks; Phase 17 should follow that pattern on catalog controls and compact nav.
- Phase 12 intentionally centralized preset identity in `themePresetId` while inferring from legacy custom theme storage. Phase 17 should change preset presentation, not preset identity semantics.
- Phase 15 and Phase 16 both reused existing manual verification routes instead of creating phase-specific harnesses. Phase 17 should extend `modpack-browser` and the existing settings scenario rather than inventing new proof infrastructure.

## Likely Planning Slices

### Slice A: Catalog control resilience

Scope:
- make installed catalog filters and primary controls readable with the sidebar open
- verify whether the remote browser needs the same responsive treatment or only consistency cleanup
- preserve current filter/search behavior and keyboard accessibility

Likely files:
- `src/components/modpacks/ModpackList.tsx`
- possibly `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/ui/Select.tsx`
- targeted modpack list/browser tests

### Slice B: Shared branded artwork fallback for catalog cards

Scope:
- unify no-art behavior across installed and remote catalog cards
- route both surfaces through one deliberate branded fallback pattern
- keep metadata/art resolution logic intact

Likely files:
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- possibly `src/components/ui/LazyImage.tsx` or a small shared helper
- relevant catalog/manual-fixture tests

### Slice C: Compact sidebar coherence

Scope:
- replace the collapsed `M` affordance with a coherent compact-state representation
- preserve active-state feedback, tooltips/titles, and keyboard behavior

Likely files:
- `src/components/sidebar/SidebarHeader.tsx`
- `src/components/__tests__/Sidebar.keyboard.test.tsx`
- possibly a new sidebar compact-mode regression test

### Slice D: Settings-shell localization hardening and preset naming policy

Scope:
- stop raw key leakage on the settings shell and remaining launch-adjacent settings copy
- choose and implement the preset naming policy
- align visible preset copy, settings shell copy, and tests with that decision

Likely files:
- `src/components/SettingsPage.tsx`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/contexts/settings/theme-presets.ts`
- `src/locales/en.json`
- `src/locales/ru.json`
- settings i18n/preset tests

### Slice E: Manual proof and closeout coverage

Scope:
- extend the existing manual verification seams so Phase 17 states are directly reviewable
- add focused regression coverage for catalog fallback, compact nav, and settings locale/preset naming
- keep closeout gates phase-focused before Phase 18 owns full milestone verification

Likely files:
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/mockEnvironment.ts`
- catalog/sidebar/settings tests

## Risks

- fixing only `ModpackBrowser` or only `ModpackList` will leave the other catalog surface as a likely residual defect
- a branded fallback implemented separately in each surface will drift again the next time card chrome changes
- changing compact-nav visuals without explicit tests can regress active-state clarity or keyboard semantics
- preset naming changes can accidentally mutate persistence or export semantics if IDs and display names are not kept separate
- settings-shell copy can still leak raw keys if only locale entries are added but the direct-render pattern remains unchanged

## Recommended Wave Shape

- Wave 1: catalog control resilience plus shared artwork fallback contract
- Wave 1: compact sidebar coherence
- Wave 2: settings-shell localization hardening and preset naming policy
- Wave 3: manual-seam proof, focused regression suite, and repo gates

Parallelism note:
- compact-nav work is largely independent from catalog work
- preset naming and settings-shell hardening fit together because they share the settings surface and locale files
- manual proof should come after at least one catalog slice and the settings slice land, otherwise the verification seam will lag behind shipped behavior

## Validation Architecture

### Existing test infrastructure

- framework: `vitest`
- static gates: `npm run lint`, `npx tsc --noEmit`
- existing focused suites already cover modpack browser ergonomics/history/a11y, sidebar accessibility, settings navigation, appearance i18n, and preset persistence

### Fast feedback

- component tests on `ModpackList`, `ModpackBrowser`, `SidebarHeader`, `SettingsPage`, and `AppearanceTab`
- targeted lint/type runs on touched settings/sidebar/modpack files

### Coverage gaps the phase should close

- installed catalog filter layout behavior at sidebar-constrained widths
- shared branded fallback behavior for no-art cards on both installed and remote catalog surfaces
- compact sidebar active-state representation in collapsed mode
- settings-shell protection against raw key leakage when translations are missing or incomplete
- explicit preset naming contract for RU and EN surfaces

### Manual-only checks

- browser-backed check with the sidebar open on the catalog surface that originally showed truncation
- browser-backed check of collapsed sidebar navigation after the compact-nav fix
- browser-backed check of the appearance/settings surface in Russian, including preset naming and absence of raw keys

### Manual seam implications

- `modpack-browser` already exists and should be extended with at least one no-art card plus the constrained-width catalog state
- `settings-accounts` currently mounts `SettingsPage` on the `accounts` tab only; Phase 17 likely needs either an appearance-focused settings scenario or a broader settings-shell fixture

## Planning Guidance

- keep at least one plan explicitly cross-surface for catalog requirements, because `CATALOG-01` and `CATALOG-02` span both installed and remote catalog expectations
- do not let the sidebar compact-nav fix turn into a broader launcher-shell redesign; this is a coherence repair, not a new nav system
- settle the preset naming policy before touching locale snapshots and tests; otherwise the phase will churn on copy
- favor shared helpers/contracts where two surfaces are already exhibiting the same defect pattern
- every plan should map cleanly back to one or more of `CATALOG-01`, `CATALOG-02`, `CATALOG-03`, `SET-01`, and `SET-02`

## Files Inspected

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/ui/LazyImage.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Input.tsx`
- `src/components/Sidebar.tsx`
- `src/components/sidebar/SidebarHeader.tsx`
- `src/components/SettingsPage.tsx`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/settingsTabs.ts`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/settings/tabs/game/RuntimeSection.tsx`
- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/i18n.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/settings/types.ts`
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx`
- `src/components/__tests__/Sidebar.keyboard.test.tsx`
- `src/components/__tests__/SettingsPage.navigation.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/settings/__tests__/SecondarySettingsTabs.test.tsx`
- `src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx`
- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/mockEnvironment.ts`
