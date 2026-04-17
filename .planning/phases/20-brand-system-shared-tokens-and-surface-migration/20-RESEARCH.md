# Phase 20 Research: Brand System, Shared Tokens, And Surface Migration

## What The Planner Needs To Know

Phase 20 is the first redesign phase after Phase 19 stabilized shell geometry, CTA ownership, and dense-route flow endings. It should not reopen those shell invariants. Its job is to formalize FMCL's brand contract and migrate the highest-visibility shared surfaces onto that contract before later density, theme-fidelity, and fallback-productization phases expand the redesign.

The strongest planning constraint is the user's explicit brand direction:

1. avoid abstract or novelty-first branding drift;
2. prefer simpler, clearer, more Minecraft-native decisions when they read better;
3. treat the current abstract logo/fallback usage as a regression from the older cube-like baseline;
4. stop missing artwork from degrading into an irritating launcher-logo placeholder;
5. define where logo usage is allowed, where neutral fallback art is required, and which shared tokens actually own the visual language.

Phase 20 therefore needs to lock three things before it spreads across more screens:

1. a canonical brand asset and wordmark rule set;
2. a shared token system for shell surfaces, typography, and brand-owned accents that does not collapse back into ad hoc zinc classes or user-accent-only styling;
3. one consistent media-fallback policy across modpack, settings, account, and shell surfaces.

The phase should explicitly avoid absorbing:

- shell safe-area, CTA ownership, or dense-flow repairs already closed in Phase 19;
- dense IA and width-management work owned by Phase 21;
- selected/disabled/hover/accent-state fidelity owned by Phase 22;
- graceful error logic, raw-placeholder removal, and degraded-state copy productization owned by Phase 23.

## Requirement Fit

This phase directly covers:

- `BRAND-01`: one consistent FMCL visual language across shell, modpacks, settings, modals, empty states, and error states;
- `BRAND-02`: deliberate logo and wordmark usage instead of arbitrary or repetitive branding;
- `BRAND-03`: product-owned artwork fallbacks that feel intentional when remote or local media is missing.

This phase should only touch adjacent areas when necessary to support those requirements:

- `SHELL-01` through `SHELL-03` are already complete and should be treated as inherited constraints, not reopened work.
- `THEME-01` through `THEME-04` stay out of scope except where token architecture must stop hard-coding brand decisions into user accent or preset data.
- `FALL-01` through `FALL-04` stay out of scope except for establishing the visual brand contract those later fallback states should reuse.

The practical boundary is:

- Phase 20 defines brand primitives, token ownership, and fallback imagery policy.
- Phase 23 later decides how fatal errors, empty states, and degraded copy behave as product flows.

## Current Brand, Token, And Fallback Hotspots

### 1. Brand assets exist, but their ownership is split and under-specified

Current brand assets live in:

- `public/launcher-mark.svg`
- `public/icon.png`
- `public/icon.ico`
- `src/app/assets/branding.ts`
- `src/app/hooks/useAppIcon.ts`

The app icon and the launcher mark are already distinct assets, but their usage rules are not explicit. `useAppIcon()` treats `/icon.png` as the runtime window icon seam, while `LazyImage` defaults to `LAUNCHER_MARK_PATH`. `TitleBar` then falls back between `APP_ICON_PATH` and `LAUNCHER_MARK_PATH` based on load failures. That means the codebase has assets, but not a canonical rule for when each asset is correct.

Planning implication: Phase 20 should not start by redrawing every screen. It should start by defining a brand module that answers:

- what is the OS/window icon?
- what is the in-product mark?
- is there a dedicated wordmark, or should wordmark remain typographic?
- when should media fallback show a neutral placeholder instead of a brand mark?

### 2. There is no single wordmark seam

`FriendLauncher` is text-rendered in multiple places instead of through a shared component or asset:

- `src/components/TitleBar.tsx`
- `src/components/sidebar/SidebarHeader.tsx`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/onboarding/WelcomePage.tsx`
- `src/components/layout/EmptyStateView.tsx`
- `src/components/SimplePlayHome.tsx`

This guarantees drift in typography, spacing, case, and mark-to-wordmark pairing.

Planning implication: Phase 20 needs either:

- a shared `BrandWordmark`/`BrandLockup` component; or
- a single wordmark asset and wrapper seam.

Without that, `BRAND-02` will stay impossible to enforce.

### 3. Token ownership is mixed between CSS vars, preset palettes, and raw Tailwind zinc classes

The current token seams are spread across:

- `src/index.css`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/settings/accent.ts`
- `src/contexts/settings/types.ts`
- `src/contexts/SettingsContext.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`

Important observations:

- `src/index.css` defines only a narrow document palette: `--bg-*`, `--text-*`, `--border-*`, `--accent-*`, `--color-error`, plus shared surface utility classes such as `.surface-panel`, `.surface-card`, `.surface-muted`, `.surface-inline`, `.surface-soft`, `.kicker-label`, and `.control-frame`.
- `src/index.css` also hard-codes `Inter` as the global font and uses global accent-driven radial glows in `body`, which means the product's visual identity is currently tied to user accent.
- `src/contexts/settings/theme.ts` only resolves document colors; it does not model typography, shell chrome, brand-mark treatment, illustration tone, or surface hierarchy depth.
- `src/contexts/settings/theme-presets.ts` currently encodes preset identity mostly as color swaps. That is too shallow for Phase 20's brand work, but too deep a rewrite would bleed into Phase 22.
- `src/contexts/settings/accent.ts` mixes static Tailwind preset classes with inline custom hex fallback, again treating accent as the main driver of product identity.

Planning implication: Phase 20 should introduce a brand token layer that sits above raw color palettes and below per-surface migration. The phase should not solve every theme-state problem, but it must stop using user accent as the only visual identity system.

### 4. Fallback imagery policy is inconsistent across routes

`LazyImage` is the shared image seam:

- `src/components/ui/LazyImage.tsx`

It defaults to `LAUNCHER_MARK_PATH` when no explicit fallback is provided. That is already a shared policy, but it is overridden in many deep routes with `/icon.png`:

- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/InstallModpackPage.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/AddModModal.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/WorldDatapacksModal.tsx`
- `src/components/sidebar/ModpackSection.tsx`
- `src/features/accounts/AccountSkinPanel.tsx`

That means adjacent surfaces fall back to different assets depending on who last touched the file:

- `ModpackList` and `ModpackBrowser` use the launcher mark path through the shared seam.
- deeper routes and account/media surfaces often force `/icon.png`.
- `ModpackSection` bypasses `LazyImage` entirely and hand-rolls `onError`.

Planning implication: Phase 20 must decide whether missing artwork should use:

- a neutral product-owned placeholder illustration;
- a reserved brand-mark fallback in limited contexts;
- the OS icon only for desktop chrome, never for content.

The current mixed state directly conflicts with `BRAND-03`.

### 5. Brand migration surfaces exist, but they split between shared utilities and legacy hard-coded styling

Good migration seams already exist:

- shared surface classes in `src/index.css`
- `SettingsContext` token application
- `LazyImage`
- `TitleBar` / `SidebarHeader` shell chrome
- manual verification routes in `src/verification/manual/*`

But several visible surfaces still use raw zinc classes or one-off styling:

- `src/components/ErrorBoundary.tsx`
- `src/components/sidebar/ModpackSection.tsx`
- parts of `src/components/SimplePlayDashboard.tsx`
- `src/components/SimplePlayHome.tsx` (legacy duplicate)

Planning implication: Phase 20 should prefer migrating these high-visibility shell-owned surfaces onto shared brand primitives instead of inventing another parallel visual language in one feature directory.

## Screenshot And Audit Signals That Matter For Planning

The screenshot and audit artifacts do not only point to correctness bugs. They also define Phase 20's brand-risk areas:

- `docs/ru/ui-qa-audit-2026-04-14.md` already recorded missing modpack-cover fallback as a product issue, not a technical nit.
- `new_screens/BUG_REPORT_2026-04-17.md` reinforces that placeholder leakage and raw runtime surfaces are visible enough to affect product trust.
- The milestone definition in `.planning/PROJECT.md` explicitly calls out logo usage, fallback art, empty states, and error states as milestone-owned product surfaces.

Planning implication: Phase 20 should give later phases a brand system they can reuse on empty/error states, but should not absorb Phase 23's work of replacing technical crash content or all placeholder logic.

## Shared Seam Opportunities

### 1. Introduce a canonical branding module before migrating screens

Likely ownership seam:

- keep asset constants in `src/app/assets/branding.ts`;
- add shared components such as `src/components/branding/BrandMark.tsx`, `BrandWordmark.tsx`, or `BrandLockup.tsx`;
- add explicit helpers for choosing between app icon, launcher mark, and content-art placeholders.

This gives the planner a stable seam for `BRAND-02` and prevents further string- or asset-level duplication.

### 2. Separate product brand tokens from user accent tokens

Right now `--accent-main` affects focus rings, shell glows, and many visual highlights. That means user accent can recolor the whole launcher and weaken brand consistency.

Phase 20 should define where product brand is stable and where user accent remains customizable. Likely split:

- product-owned tokens: shell depth, typography, brand-mark treatment, illustration framing, neutral placeholder palette, maybe shell chrome emphasis;
- user-owned tokens: accent highlights, personalization surfaces, minor control emphasis.

The planner should avoid turning Phase 20 into a full theme rewrite. The objective is to stop product identity from being nothing more than the user's chosen accent.

### 3. Use shared surface utilities as the migration backbone

`src/index.css` already exposes shared surface classes. Phase 20 should evolve these, or add adjacent brand-specific utility classes, instead of patching each surface with bespoke shadow, blur, and border combinations.

This is the safest path to `BRAND-01` because the shell, settings, onboarding, and modpack routes already consume those classes unevenly.

### 4. Put artwork fallback policy on top of `LazyImage`, not inside each route

The right Phase 20 seam is not raw string replacement from `"/icon.png"` to another asset. It is a content-fallback policy layer around `LazyImage` and other shared brand helpers:

- neutral placeholder for missing cover art;
- brand mark only where the product itself is the subject;
- OS icon only for window or packaging identity;
- no hand-rolled `onError` branches in route components.

That gives Phase 20 one migration seam and gives Phase 23 a stable visual fallback language later.

### 5. Reuse Phase 19 manual verification as the proof seam

Phase 19 already moved manual verification into the real shell. Phase 20 should reuse that seam for brand proof:

- launcher-home;
- modpack list;
- modpack browser;
- details/install/add/import preview routes;
- settings appearance;
- empty/error representatives where possible.

That is the cheapest way to ensure the new brand system is visible across real shell composition instead of only in isolated component tests.

## Likely Planner Boundaries And Wave Split

The cleanest Phase 20 shape is four plans.

### `20-01` Canonical brand primitives and token contract

Own:

- `public/launcher-mark.svg`
- `src/app/assets/branding.ts`
- new shared branding components under `src/components/branding/*`
- `src/index.css`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/accent.ts`
- `src/contexts/settings/types.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/SettingsContext.tsx` only for token wiring fallout

Goal:

- define canonical mark/icon/wordmark ownership;
- separate product brand tokens from user accent behavior;
- create shared brand primitives that later surfaces can consume.

### `20-02` Shell and shared surface migration

Own:

- `src/components/TitleBar.tsx`
- `src/components/sidebar/SidebarHeader.tsx`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/onboarding/WelcomePage.tsx`
- `src/components/layout/EmptyStateView.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/SimplePlayHome.tsx` only to remove or reconcile legacy duplication

Goal:

- apply the canonical mark/wordmark rules to shell-owned surfaces;
- make launcher-home, onboarding, empty shell surfaces, and appearance settings visibly speak the same design language;
- remove repeated text-rendered brand drift.

### `20-03` Artwork fallback policy and route migration

Own:

- `src/components/ui/LazyImage.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/InstallModpackPage.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/AddModModal.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/WorldDatapacksModal.tsx`
- `src/components/sidebar/ModpackSection.tsx`
- `src/features/accounts/AccountSkinPanel.tsx`
- any other high-visibility `LazyImage` consumers that still force `/icon.png`

Goal:

- remove fallback drift between `launcher-mark.svg`, `/icon.png`, and route-local `onError` behavior;
- introduce a neutral product-owned artwork fallback for content surfaces;
- reserve the launcher mark for true brand contexts instead of every missing image.

### `20-04` Proof, regression coverage, and documentation truth

Own:

- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/views.ts`
- focused tests around branding/fallback seams
- `.planning/STATE.md`
- `.planning/ROADMAP.md`

Goal:

- capture shell-integrated brand proof on the migrated surfaces;
- lock the new branding/fallback policy with focused regression tests;
- record the phase as the baseline for later dense IA and theme-fidelity work.

## Planning Pitfalls To Avoid

- Do not let Phase 20 turn into a full preset/theme fidelity rewrite. Distinct preset readability, selected-state contrast, and accent consistency still belong to Phase 22.
- Do not let it turn into a full error-state productization rewrite. `ErrorBoundary.tsx` is an important brand hotspot, but raw stack removal and user-safe recovery behavior still belong to Phase 23.
- Do not solve missing-art fallback by splashing the logo everywhere. That would repeat the exact product drift the user called out.
- Do not replace the shell with a second set of bespoke component-level shadows and gradients. Extend the shared token and brand seams instead.
- Do not keep `SimplePlayHome.tsx` as a second brand language if it is only a legacy duplicate.
- Do not conflate desktop icon rules with content-artwork rules. The window icon and missing-cover placeholder should not be the same thing.

## Validation Architecture

Phase 20 can validate its work through a mix of shared seam tests and shell-integrated manual proof.

### Existing seams worth reusing

- `src/components/ui/__tests__/LazyImage.cache.test.tsx`
- `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx`
- `src/components/__tests__/SimplePlayHome.visualTruth.test.tsx`
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`

### Likely new tests Phase 20 should plan

- a branding seam test for `TitleBar`/shared wordmark usage;
- a shared fallback-policy test proving route content no longer overrides `/icon.png` ad hoc;
- a shell-surface visual-truth test for launcher-home and empty-state branding;
- a manual verification registry update that exposes Phase 20 proof states through the real shell.

### Manual proof expectations

The planner should expect shell-integrated manual proof for at least:

- launcher-home;
- modpack list/browser;
- one deep media route such as details or install;
- appearance settings;
- one empty or degraded artwork representative.

### Repo gates

The phase should continue to close on:

- `npx vitest run ...` for the focused brand/fallback matrix;
- `npx tsc --noEmit`;
- `npx eslint src/`.

## Bottom Line For The Planner

Phase 20 should begin by defining FMCL's canonical brand primitives and token ownership, then migrate shell-owned and artwork-heavy surfaces onto those seams, and only then lock proof and tests.

If the planner starts from screenshots and repaints screens directly, it will recreate the same drift the user is trying to kill. If it starts from brand rules, token ownership, and fallback policy, later phases can safely redesign dense surfaces and state fidelity without re-litigating what FMCL is supposed to look like.
