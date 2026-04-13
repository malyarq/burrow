# Phase 12 Research: Theme Truth And Settings IA Simplification

## What The Planner Needs To Know

Phase 12 is the trust-recovery phase for the `v0.3.0` complaints around appearance and settings usability. It should not absorb the whole remaining milestone. Its job is to close two concrete user-facing failures that are already visible in the shipped launcher:

1. preset themes do not behave like truthful presets across light and dark mode;
2. settings exposes common tasks through oversized panels, nested collapsibles, and embedded utility sections that feel like tab-inside-tab navigation.

The right phase boundary is therefore:

1. repair the preset theme source of truth so shipped presets apply immediately and predictably;
2. make preset colors readable on the real launcher surfaces that still bypass theme tokens;
3. flatten the common settings paths so appearance, launcher, downloads, accounts, and utilities are reachable without drilling through stacked groups;
4. close on focused theme or settings verification, not on launch-status redesign or modpack workflow changes.

The planner should explicitly avoid absorbing:

- launch-stage clarity and progress modeling;
- modpack dependency truth;
- modpack browser redesign;
- broader feature-parity research against other launchers.

Those are real milestone goals, but they belong to later phases once theme truth and settings navigation stop undermining trust.

## Requirement Fit

This phase directly covers:

- `THEME-01`: shipped preset themes must apply reliably and immediately in light and dark mode
- `THEME-02`: cards, inputs, overlays, and helper text must remain readable in every shipped preset
- `NAV-01`: common settings tasks must no longer feel buried inside nested tabs, collapsibles, and embedded utility panels

This phase should intentionally not claim:

- `LAUNCH-01` or `LAUNCH-02`
- `MPUX-01` through `MPUX-03`
- `VER-01`
- `DOC-01`

## Current Baseline

### Preset themes do not have a truthful runtime contract yet

`src/contexts/settings/theme-presets.ts` defines presets, and `src/components/settings/tabs/AppearanceTab.tsx` applies them through `applyPreset()`. Today that seam only writes two settings:

- `theme`
- `customTheme`

That state is then pushed into `applyThemeToDocument()` from `src/contexts/SettingsContext.tsx`.

This leaves three concrete problems:

1. presets are single-mode records, not stable preset identities that can express the same visual family in both light and dark mode;
2. preset application does not own the whole theme contract, so users can land in hybrid states where base light or dark defaults leak through custom colors;
3. the current tests only prove document-variable updates, not preset selection or preset behavior after mode changes.

The planner should therefore treat `theme-presets.ts`, `AppearanceTab.tsx`, `SettingsContext.tsx`, and `src/contexts/settings/theme.ts` as one runtime seam.

### The document theme contract is narrower than the actual token contract

`src/contexts/settings/theme.ts` clears and reapplies only a subset of variables, while `src/index.css` and Tailwind-mapped semantic tokens rely on a wider set of document variables and derived surfaces.

Today the code explicitly updates only:

- `--bg-app`
- `--bg-card`
- `--bg-sidebar`
- `--text-main`
- `--text-secondary`
- `--border-default`
- accent variables
- `--color-error`

But the renderer also depends on related semantic surfaces such as overlay, muted text, and active-border states. That mismatch is one of the reasons presets can look “half applied,” especially after switching between dark and light mode.

### Too many real surfaces still bypass semantic tokens

Even if the document variables are corrected, many user-visible surfaces still hardcode zinc, white, or `dark:*` palette values directly instead of reading from semantic tokens.

The highest-risk cluster is the text-dense settings or game UI:

- `src/components/settings/tabs/GameTab.tsx`
- `src/components/settings/tabs/game/ArgsSection.tsx`
- `src/components/settings/tabs/game/RuntimeSection.tsx`
- `src/components/settings/tabs/game/ModpackSection.tsx`
- `src/components/settings/tabs/game/AutoConnectSection.tsx`
- `src/components/settings/tabs/game/ResolutionSection.tsx`
- `src/components/settings/tabs/game/MinecraftPathSection.tsx`

The next highest-risk cluster is the modpack import or install flow and other mixed overlays:

- `src/components/modpacks/ImportModpackPreviewModal.tsx`
- `src/components/modpacks/ImportModpackPreviewPage.tsx`
- `src/components/modpacks/InstallModpackModal.tsx`
- `src/components/modpacks/ModpackUpdateModal.tsx`
- `src/components/UpdateModal.tsx`
- `src/components/MultiplayerPage.tsx`

There are also shared primitive outliers that still anchor themselves to hardcoded zinc values instead of semantic tokens:

- `src/components/ui/Textarea.tsx`
- `src/components/ui/LoadingSpinner.tsx`
- `src/components/ui/Breadcrumbs.tsx`
- `src/components/ui/SkeletonLoader.tsx`

The planner should not try to retokenize the whole app. It should target these highest-risk seams because they are the ones most likely to produce unreadable white-on-white or low-contrast regressions under shipped presets.

### Settings is not structurally nested, but it feels nested to the user

`src/components/SettingsPage.tsx` has only one real top-level tablist, but the content inside those tabs recreates the feeling of nested navigation:

- `AppearanceTab` combines branding, theme mode, presets, import or export, language, advanced appearance, background effects, and UI scalability in one very long surface with multiple collapsible groups;
- `LauncherTab` mixes runtime behavior, update checks, path settings, image-cache controls, and cache-clearing utilities in one panel;
- `DownloadsTab` embeds `MirrorsSettings`, which itself opens a nested edit modal, plus download tuning in the same vertical flow;
- `StatisticsTab` uses multiple collapsible groups for mostly read-only data.

This matters because the user complaint is not “too many top-level tabs.” It is “every tab contains another layer of grouping before I can reach the action I came for.”

The common-task paths that Phase 12 should flatten are:

- change theme or preset
- change launcher behavior
- tune downloads and mirrors
- reach accounts quickly
- reach lower-traffic utilities without scrolling through unrelated sections first

The evidence also points to a clear priority order:

- `appearance` is the default landing tab and the highest-traffic settings entry seam;
- `launcher` and `downloads` are the next flatten-first candidates because onboarding and welcome copy already steer users there for common setup tasks;
- `accounts` is a strong continuity target because it is a full management surface that users are already told to reach through settings;
- `storage` and `statistics` are lower-traffic utilities and should be simplified only enough to fit the flatter IA, not turned into a parallel redesign.

Phase 12 should solve this by improving content hierarchy and common-task entry points inside settings, not by inventing a brand-new router.

The good news is that state ownership does not need to change for this work. `src/contexts/SettingsContext.tsx` already centralizes launcher settings persistence, so Phase 12 can simplify IA by changing the shell and tab content seams instead of redesigning storage.

### There is already residual settings truth debt in the live UI

Phase 11 verification already surfaced a raw i18n key leak for `settings.tab_storage`. That is small compared to the broader IA problem, but it is a useful signal: the current settings surface still contains release-truth drift and should be cleaned up while Phase 12 is touching the same ownership seam.

## Brownfield-Safe Sequencing

### 1. Fix preset source of truth before broad surface cleanup

If the phase starts by recoloring screens without fixing how presets are modeled and applied, it will ship another partial truth: surfaces may look better in one mode but still break or reset unpredictably when the user changes theme mode.

### 2. Expand semantic-token coverage before route-specific contrast cleanup

The planner should first close the shared theme contract and primitive outliers, then migrate the highest-risk route surfaces. Otherwise the same unreadable combinations will keep resurfacing anywhere that still composes shared inputs, helpers, or overlays.

### 3. Simplify settings IA around tasks, not around technical ownership

The settings redesign should prioritize what users try to do first, not which file currently owns the behavior. That means surfacing primary actions immediately and pushing advanced or low-frequency controls into secondary groups instead of making everything equally prominent.

### 4. Keep launch and modpack workflow redesign out of this phase

If the planner folds launch clarity or dependency correctness into Phase 12, execution will sprawl across unrelated seams and the phase will stop being testable as a clean theme or settings closure.

## Planning Risks

- If `12-01` only tweaks CSS variables without changing the preset identity or application model, the user-facing “preset only works in light mode” complaint will survive.
- If `12-02` tries to sweep every hardcoded color class in the repo, the phase will become an unbounded retokenization project.
- If `12-03` only restyles settings without reducing scroll depth and buried actions, `NAV-01` will remain unsatisfied even if the UI looks cleaner.
- If verification stays document-only, the phase can appear green while route-level readability and task reachability remain broken in the real launcher.

## Recommended Plan Shape

The cleanest Phase 12 decomposition is four plans:

- `12-01`: repair the preset theme application contract
- `12-02`: close preset readability and contrast regressions on the highest-risk surfaces
- `12-03`: simplify settings information architecture around common tasks
- `12-04`: run the focused theme and settings integration gate and close the phase

Recommended wave map:

- Wave 1: `12-01`
- Wave 2: `12-02`, `12-03`
- Wave 3: `12-04`

This sequencing keeps the preset runtime truth first, then allows contrast cleanup and IA simplification to proceed on top of that stable contract, then closes on integrated verification.

## Validation Architecture

Phase 12 can use the existing Vitest + jsdom lane plus narrow live-browser checks.

### Layer 1: preset contract tests

Extend the current theme coverage beyond `themeDocument.test.ts` to prove:

- preset selection writes the intended source of truth
- switching between light and dark mode preserves truthful preset behavior
- preset application updates the launcher immediately instead of leaving hybrid state behind

This layer should primarily target:

- `src/contexts/settings/theme.ts`
- `src/contexts/SettingsContext.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`

### Layer 2: settings IA tests

Add focused tests around the settings shell and common-task entry points to prove:

- the most common settings actions are visible without drilling through multiple collapsibles
- settings tabs still preserve keyboard and panel semantics
- raw key leaks such as `settings.tab_storage` are closed where Phase 12 touches the surface

### Layer 3: route-level readability checks

Use narrow component tests to prove that the highest-risk screens and overlays render readable text, helper copy, and inputs under shipped presets. This should focus on the curated risk set from the research above instead of trying to prove every surface in one phase.

### Layer 4: focused browser sanity plus repo gate

Phase 12 should still close on:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`

And it should include live-browser spot checks for:

- at least one light preset
- at least one dark preset
- settings navigation after the IA simplification

This is not the full milestone walkthrough, but it is required because `THEME-01`, `THEME-02`, and `NAV-01` are all visible behaviors, not pure unit seams.

## Planner Guidance

- Treat preset truth as a runtime contract, not just a styling tweak.
- Limit contrast work to shared primitives plus the highest-risk hardcoded surfaces called out above.
- Simplify settings by making common actions easier to reach, not by creating more tabs.
- Keep the phase honest: if a change is mainly about launch progress, modpack dependency behavior, or browser discovery ergonomics, it belongs to later phases.
