# Phase 22 Research: Theme Truth And Interaction-State Fidelity

## What The Planner Needs To Know

Phase 22 is not a cosmetic repaint. Its job is to make FMCL's already-redesigned surfaces behave like a truthful theming system: interaction states must read immediately, accents must propagate consistently, presets must remain intentional identities instead of half-persisted color bundles, and locale-sensitive presentation must follow the user's active language rather than ambient browser defaults.

The right phase boundary is therefore:

1. stabilize the runtime truth layer for theme tokens, accent propagation, preset identity, and locale-aware formatting;
2. lock readable selected, active, hover, focus, and disabled states on the highest-risk settings and control surfaces;
3. carry that same state and locale truth onto milestone-owned modpack and secondary content surfaces that already migrated in Phases 20 and 21;
4. close on shell-integrated proof for dark/light, preset/custom accent, and EN/RU presentation rather than reopening broader redesign scope.

The planner should explicitly avoid absorbing:

- a new preset model or settings IA redesign beyond what Phase 12 already established;
- brand reset, fallback-art policy, or shell identity work from Phase 20;
- CTA hierarchy, dense-route geometry, or shell safe-area fixes from Phases 19 and 21;
- degraded-state copy, fatal error handling, or placeholder cleanup, which belong to Phase 23.

## Requirement Fit

This phase directly covers:

- `THEME-01`: users must be able to distinguish selected, active, focus, hover, and disabled states in both dark and light themes;
- `THEME-02`: accent color must apply consistently to controls and states that claim to use it;
- `THEME-03`: presets must remain visually distinct and truthful representations of the launcher appearance;
- `THEME-04`: dates, numbers, and translated copy must follow the active locale on redesigned surfaces.

This phase should intentionally not claim:

- `BRAND-01` through `BRAND-03`
- `SHELL-01` through `SHELL-04`
- `DENSE-01` through `DENSE-04`
- `FALL-01` through `FALL-04`
- `VER-01` through `VER-04`

## Current Baseline

### The runtime theme truth is split across document tokens and hand-authored state classes

`src/index.css`, `src/contexts/settings/theme.ts`, and `src/contexts/SettingsContext.tsx` own the document-level palette and token application. That is still the correct seam, but it does not yet guarantee truthful interaction states:

- `applyThemeToDocument()` in `theme.ts` writes the active palette to the document, but state-specific variables remain narrower than the number of real hover, focus, and selected treatments used by the app;
- accent derivation in `src/contexts/settings/accent.ts` is uneven between preset accents and custom hex accents, especially for hover/soft treatments;
- shared controls such as `Button.tsx`, `Input.tsx`, `Select.tsx`, and `Textarea.tsx` still lean on generic `disabled:opacity-50` and partial accent styling, which makes disabled and active states look weak or inconsistent across dark/light modes.

This is why screenshot evidence shows theme state truth drifting even after earlier theme and brand phases landed.

### Preset identity still has persistence and round-trip gaps

Phase 12 repaired preset application enough to make presets usable, but Phase 22 inherits a narrower truth problem: presets still need to behave like durable identities across import/export, light/dark mode, and accent/state rendering.

The real ownership seam is:

- `src/contexts/settings/types.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/settings/persistence.ts`
- `src/contexts/SettingsContext.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`

Important current gap: imported theme configuration can lose `presetId`, and persistence currently writes an empty preset id in some paths. That means preset round-tripping can fall back to an ambiguous custom-theme state, undermining `THEME-03` even if the colors still look roughly similar.

Phase 22 should treat preset identity as part of the runtime truth layer, not as a settings-only UI polish item.

### The highest-risk state fidelity failures are already visible on live milestone surfaces

The screenshot audit and current component structure point to a concentrated risk set:

- `AppearanceTab.tsx`: segmented controls, theme toggles, accent chips, custom color chip, slider/thumb styling, and advanced toggle rows use many local state classes;
- `SettingsTabsHeader.tsx`: active tab contrast and hover/focus differentiation are weak;
- `DownloadsTab.tsx` and `CollapsibleSection.tsx`: selected/disabled/expanded states can drift from the active accent contract;
- `ModpackList.tsx`, `ModpackBrowser.tsx`, and `ModpackDetailsHeader.tsx`: selected cards, favorite/history toggles, active tabs, menu items, inline actions, and disabled badges do not all share the same state matrix;
- `AddModModal.tsx`, `ModpackDetailsModsTab.tsx`, `WorldDatapacksModal.tsx`, `WorldsTab.tsx`, and `ImportModpackPreviewPage.tsx`: secondary content still contains mixed selected/disabled/danger states and some locale-sensitive metadata.

The screenshot report calls out this drift directly:

- selected accent set to green while some active controls remain gray;
- slider thumb still blue under non-blue accent selection;
- segmented theme/language switches with weak selected contrast;
- weak disabled contrast for important next-step actions;
- modloader segmented control without an obvious selected state.

Phase 22 needs to treat these as one state-fidelity problem instead of scattered visual nits.

### Locale-sensitive formatting is not tied to the app language yet

FMCL translation strings are controlled by `src/contexts/settings/i18n.ts` and the locale JSON files, but date and number formatting remain ambient:

- `src/utils/format.ts` uses `toLocaleDateString()` without an explicit app locale;
- `StatisticsTab.tsx`, `ScreenshotsTab.tsx`, `WorldsTab.tsx`, `ModpackList.tsx`, and `ModpackBrowser.tsx` also rely on implicit locale formatting;
- the active setting is `settings_language`, but formatting does not consistently consume it.

This means the app can show translated copy in one language while dates or numbers still follow the environment locale. Phase 22 is the correct place to fix that contract because `THEME-04` is milestone-owned scope, not later docs polish.

## Existing Verification Base

The phase already has useful seams and should build on them instead of inventing a new test harness:

- `src/contexts/settings/__tests__/themeDocument.test.ts`
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`
- `src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackList.actions.test.tsx`
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/utils/__tests__/format.test.ts`
- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/mockEnvironment.ts`

However, there are still clear gaps:

- no regression test for preset import/export round-trip retaining `presetId`;
- no direct test that locale-sensitive formatting follows `settings_language` across EN/RU;
- weak or absent assertions for selected/hover/focus/disabled visual semantics on segmented controls, tabs, cards, and menus;
- no proof that preset accents and custom hex accents produce the same state contract on shared controls;
- no dedicated manual proof view for Phase 22 dark/light plus EN/RU plus preset/custom accent comparisons.

## Brownfield-Safe Sequencing

### 1. Fix the truth layer before surface repaint

If Phase 22 starts by recoloring individual screens without repairing token, preset, accent, and locale ownership, it will ship another partial truth where settings looks correct but imported presets, custom accents, or route-level metadata still drift.

### 2. Lock shared control-state behavior before route adoption

Shared controls and settings shells are the most efficient place to fix selected/hover/focus/disabled readability. If the phase jumps straight to route-specific tweaks, the same weak states will survive anywhere those shared controls are reused.

### 3. Migrate milestone-owned routes after the shared state contract exists

Modpack browser/list/details and secondary-content routes should adopt the truth layer and shared-state contract rather than inventing one-off fixes. This keeps Phase 22 additive to Phase 21 instead of reopening dense-surface layout work.

### 4. Keep closeout limited to proof and regression

Phase 22 should finish the same way Phases 20 and 21 did: shell-integrated proof plus a focused matrix. Do not turn `22-04` into another broad implementation wave.

## Planning Risks

- If `22-01` stops at CSS token cleanup and does not fix preset identity persistence or locale ownership, `THEME-03` and `THEME-04` will remain partially open.
- If `22-02` only restyles settings without codifying shared control-state behavior, modpack and secondary routes will drift again in `22-03`.
- If `22-03` tries to absorb all remaining fallback/degraded-state polish, it will collapse into Phase 23 scope.
- If proof stays on isolated component seams only, the phase can pass automation while still failing the live-shell comparison between dark/light, preset/custom accent, and EN/RU.

## Recommended Plan Shape

The cleanest Phase 22 decomposition is four plans:

- `22-01`: repair the truth layer for theme tokens, accent propagation, preset identity, and locale-aware formatting;
- `22-02`: make shared controls and settings surfaces read truthful selected/active/hover/focus/disabled states in dark/light and preset/custom accent combinations;
- `22-03`: carry the same state and locale contract onto milestone-owned modpack and secondary content surfaces;
- `22-04`: add shell-integrated proof for dark/light, preset/custom accent, and EN/RU, then close on the focused Phase 22 matrix.

Recommended wave map:

- Wave 1: `22-01`
- Wave 2: `22-02`
- Wave 3: `22-03`
- Wave 4: `22-04`

## Validation Architecture

Phase 22 can use the existing Vitest + jsdom stack, plus the shared manual verification shell.

### Layer 1: truth-layer contract tests

Extend the current token and preset coverage so the phase proves:

- document theme tokens and accent variables reflect the active preset/custom theme truthfully;
- preset import/export and persistence retain `presetId` and do not collapse into anonymous custom theme state;
- date and number formatting follow the active `settings_language` contract rather than ambient locale defaults.

This layer should primarily target:

- `src/contexts/settings/theme.ts`
- `src/contexts/settings/accent.ts`
- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/settings/persistence.ts`
- `src/utils/format.ts`

### Layer 2: shared control and settings-state tests

Add focused tests proving:

- selected, hover, focus, active, and disabled states stay legible in both dark and light modes;
- settings tab headers, segmented controls, accent chips, sliders, and collapsible rows follow the same state semantics;
- preset accents and custom accents share the same state contract on common controls.

### Layer 3: route adoption and locale presentation tests

Use narrow route-level tests to prove:

- modpack list, browser, details header, and representative secondary content surfaces reuse the shared state contract instead of drifting back to hardcoded state styling;
- route-level dates, counts, and translated copy follow the active locale;
- the phase stays on milestone-owned surfaces instead of attempting repo-wide retheming.

### Layer 4: shell-integrated proof and focused closeout gate

Phase 22 should close on:

- a dedicated manual proof route for settings and modpack surfaces under dark/light themes;
- comparison states for preset accent versus custom accent;
- EN and RU proof for locale-sensitive surfaces;
- the focused Phase 22 Vitest matrix plus `npx tsc --noEmit` and `npx eslint src/`.

## Planner Guidance

- Treat theme truth as runtime state ownership, not just styling cleanup.
- Make `settings_language` the formatting source of truth on milestone-owned surfaces touched by this phase.
- Keep preset identity stable through persistence and import/export instead of letting presets degrade into generic custom themes.
- Prefer shared control-state contracts over route-local hover/focus fixes.
- Reuse Phase 20 and 21 shells, brand seams, and density seams; do not reopen them.
