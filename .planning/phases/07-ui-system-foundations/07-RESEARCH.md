# Phase 7 Research: UI System Foundations

## What The Planner Needs To Know

Phase 7 is not the general UI refresh phase. It is the foundation phase that decides whether every later screen rollout will converge on one launcher language or fall back into screen-local styling again.

The planner should treat Phase 7 as a narrow but high-leverage brownfield phase with three required outcomes:

1. shared UI primitives and shell components become the real visual contract for refreshed surfaces;
2. theme and accent state become visibly authoritative at the document and shared-component level;
3. iconography and repeated action affordances stop drifting across launcher chrome and foundational controls.

The main planning trap is to let this phase absorb broad route polish, translation cleanup, or “while we are here” redesign of every screen already touched locally. That would dilute the foundation work and recreate the same inconsistency in a different form.

The safest shape is:

1. formalize the shared token and surface contract around `src/index.css`, `src/contexts/settings/theme.ts`, and the reusable `src/components/ui/*` layer;
2. align the launcher shell components that broadcast product identity on every route, especially `Sidebar`, `TitleBar`, and the settings appearance surface;
3. make theme/accent behavior and icon semantics visibly correct on those foundations;
4. close the phase with focused foundation tests and repo gates, leaving broader route rollout to Phase 8.

Do not turn this phase into a full modpack-page redesign, a complete copy audit, or a framework migration. Those belong to later phases or are explicitly out of scope for the milestone.

## Requirement Fit

This phase directly covers:

- `DSYS-01`: consistent visual language across shells, cards, forms, dialogs, and feedback states;
- `DSYS-02`: one icon and action-affordance language across navigation, cards, menus, dialogs, and empty states;
- `THEME-01`: theme and accent settings visibly update the launcher shell plus refreshed screens.

It should intentionally not claim:

- `LOCL-01` full EN/RU cleanup across refreshed surfaces;
- `UX-01` to `UX-04` route-level convenience and coherence outcomes;
- `VER-01` manual browser walkthrough closeout.

Those belong to later phases.

## Current Baseline

### Theme and appearance already have a viable source of truth

- `src/contexts/SettingsContext.tsx` already owns:
  - `theme`, `accentColor`, `customTheme`, `uiScale`, `disableAnimations`, `compactMode`, and `sidebarPosition`;
  - document-side effects via `applyThemeToDocument(theme, accentColor, customTheme)`;
  - translator creation and broad UI settings persistence.
- `src/contexts/settings/theme.ts` already writes document-level CSS custom properties such as:
  - `--bg-app`
  - `--bg-card`
  - `--text-main`
  - `--border-default`
  - `--accent-main`
  - `--accent-hover`
- `src/index.css` already defines:
  - shared root variables for light and dark mode;
  - global focus-visible styling;
  - shared surface classes like `.surface-panel`, `.surface-card`, `.surface-muted`, and `.surface-inline`.

This is the strongest brownfield clue in the phase: the design-system foundation does not need a new state layer. It needs disciplined rollout on top of an existing viable settings and token seam.

### Shared UI primitives already exist, but they are still becoming the real contract

`src/components/ui/` already contains a broad primitive layer:

- `Button.tsx`
- `Input.tsx`
- `Select.tsx`
- `Modal.tsx`
- `Toast.tsx`
- `ProgressBar.tsx`
- `CollapsibleSection.tsx`
- `Tooltip.tsx`
- `ConfirmDialog.tsx`
- `LazyImage.tsx`

The current local UI work is already moving this layer toward the milestone goal. `Button.tsx`, for example, now expresses accent-aware variants, shared focus treatment, and motion behavior. That means Phase 7 should consolidate and normalize this layer, not bypass it.

### Launcher shell surfaces are already being reshaped and should be the foundation rollout targets

The current working tree shows active UI changes in:

- `src/components/Sidebar.tsx`
- `src/components/TitleBar.tsx`
- `src/components/sidebar/SidebarHeader.tsx`
- `src/components/sidebar/LaunchControls.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- multiple files under `src/components/ui/`

This is useful planning evidence:

- the shell is already the highest-leverage place to establish the new product language;
- the planner should not invent parallel foundation work elsewhere while these files are already in flight;
- execution should preserve and refine these seams, not reset them.

### Icon consolidation is partially underway but not system-owned yet

The current shell files already use `lucide-react` (`Sidebar.tsx`, `TitleBar.tsx`, `AppearanceTab.tsx`), which is the right direction. But the requirement is broader than “some icons exist.”

The real Phase 7 gap is to define:

- which icon set is canonical;
- what empty-state and action-state semantics should look like;
- which foundational components or shells own those semantics.

If icon consistency is left as ad hoc component choice, `DSYS-02` will still fail even if the shell looks better.

### Localization is present but should stay out of core Phase 7 scope except where foundations need it

- `SettingsContext` already provides `t(...)` from locale files.
- `src/locales/en.json` and `src/locales/ru.json` are the required source of user-facing strings.
- `docs/KNOWN_ISSUES.md` still identifies visible placeholder and translation drift.

The planner should treat this carefully:

- foundational components must not introduce new hardcoded text;
- shell and appearance surfaces touched in Phase 7 should remain locale-safe;
- but the full text-correctness sweep belongs to Phase 8, not here.

### Test infrastructure already covers the exact class of foundation behavior this phase needs

The current repo already has a usable Vitest + jsdom lane:

- `vitest.config.ts`
- `src/components/ui/__tests__/Modal.a11y.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/__tests__/Sidebar.keyboard.test.tsx`
- `src/features/accounts/__tests__/AccountsPage.a11y.test.tsx`

This means Phase 7 does not need a Wave 0 test-framework install. It needs targeted extension of existing tests to cover:

- shared primitive semantics;
- shell interaction and keyboard behavior where foundations shift;
- theme and token propagation where it can be observed deterministically.

## Brownfield-Safe Sequencing

### 1. Lock the visual contract before expanding route scope

The planner should first make explicit what belongs to the shared system:

- token names and surface classes in `src/index.css`;
- primitive variants in `src/components/ui/*`;
- theme document application in `src/contexts/settings/theme.ts`;
- shell usage in `Sidebar`, `TitleBar`, and settings chrome.

If route rollout starts before those contracts are stable, later phases will inherit unstable foundations.

### 2. Keep Phase 7 focused on shell and primitive ownership

The highest-value foundation rollout targets are:

- launcher chrome (`Sidebar`, `TitleBar`, `SidebarHeader`, `LaunchControls`);
- appearance settings surface (`AppearanceTab`);
- shared primitives that these shells depend on.

That is enough to prove the design-system direction without pulling Phase 8 UX work into this phase.

### 3. Treat theme correctness as “visible payoff,” not only persistence

`THEME-01` is easy to fake by persisting a setting while large parts of the launcher remain visually static. Phase 7 should require evidence that:

- shell surfaces update;
- dialogs and cards update;
- accent changes affect key controls consistently.

The planner should not accept a plan that only tweaks settings storage or only changes a few buttons.

### 4. Land icon rules in the same slice as shell cleanup

Icon consistency should not be a cleanup footnote. The shell is where users learn the launcher’s visual language, so icon semantics and shared action affordances should land in the same plan slice as shell alignment.

### 5. Reserve broad route and copy cleanup for Phase 8

This phase should deliberately stop before:

- large-scale modpack-page redesign;
- account-page coherence beyond the foundational shell and primitive touchpoints;
- full EN/RU string sweep;
- manual experience closeout.

That keeps Phase 7 executable and avoids turning every local UI diff into foundation scope.

## Planning Risks

- If shared token and primitive work stays implicit instead of becoming the phase’s main deliverable, later route rollouts will regress into feature-local styling.
- If theme work only changes document classes but refreshed surfaces still hardcode colors, `THEME-01` will ship as a settings illusion.
- If shell cleanup and icon cleanup are planned separately, the launcher chrome can still communicate mixed affordances even after visual polish.
- If Phase 7 absorbs full route redesign or translation cleanup, the foundation work will lose focus and likely leave unstable primitives behind.
- If existing local UI changes are treated as noise rather than real in-flight seams, execution could create conflict or redundant rework in exactly the files already moving toward the phase goal.
- If validation focuses only on repo-wide lint/type gates, the phase can miss regressions in dialog semantics, keyboard behavior, or theme payoff.

## Recommended Plan Shape

The cleanest Phase 7 decomposition is four plans:

- `07-01`: define and normalize the shared foundation contract across tokens, surface classes, and base primitives;
- `07-02`: align launcher shell components and foundational action semantics, including icon consistency;
- `07-03`: make theme and accent behavior visibly authoritative on shell and shared components, with appearance-settings support aligned to that contract;
- `07-04`: close the phase under focused foundation tests plus repo gates, fixing only fallout introduced by the foundational rollout.

Recommended wave map:

- Wave 1: `07-01`, `07-02`
- Wave 2: `07-03`
- Wave 3: `07-04`

This keeps the system contract first, then shell identity, then theme payoff, then fallout-only closure.

## Validation Architecture

Phase 7 can and should use the existing Vitest + jsdom test infrastructure plus standard repo gates.

### Layer 1: shared primitive verification

Extend or add tests around:

- dialog semantics and focus behavior (`Modal`);
- button or control-state semantics where variants or focus affordances change;
- settings-tab shell behavior where headers or nav semantics change.

### Layer 2: shell and interaction verification

Use focused component tests around:

- sidebar keyboard and activator behavior;
- title bar or shell action affordances where semantics are explicit;
- appearance-settings interactions that can be asserted without a full browser run.

### Layer 3: theme and token verification

Test deterministic seams such as:

- `applyThemeToDocument(...)` side effects on document classes or CSS variables;
- foundational component rendering under light/dark or accent variants when feasible.

### Layer 4: repo gate closure

The phase should still close on:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`

Manual browser walkthrough is not the close condition for Phase 7, but targeted local visual spot checks during execution are still useful to catch shell regressions early.

## Planner Guidance

- Prefer modifications in existing shared seams over creating new architecture.
- Treat currently modified shell and UI files as expected execution targets, not as a signal to broaden scope.
- Keep LOCL-01 and route-level redesign promises out of the foundation phase except where a touched primitive or shell must stay locale-safe.
- Make the plan outputs explicit about which files are foundational ownership and which files are only consumer rollout targets for later phases.

