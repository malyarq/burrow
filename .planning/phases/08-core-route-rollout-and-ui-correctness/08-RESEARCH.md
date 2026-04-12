# Phase 8 Research: Core Route Rollout And UI Correctness

## What The Planner Needs To Know

Phase 8 is the first broad rollout phase of the `v0.2.0` milestone. Phase 7 already established the shared visual foundation, shell language, and document-level theme contract. Phase 8 must now move the most-used launcher routes onto that foundation without turning into an unbounded “fix all UI” rewrite.

The planner should treat this phase as route-owned rollout work with five mandatory outcomes:

1. the launcher entry, home/play, settings, accounts, onboarding, and core modpack routes consume the shared surface and action contract from Phase 7 instead of reintroducing local styling dialects;
2. refreshed EN and RU copy on those routes is complete enough that visible placeholders, raw fallback strings, or missing keys stop leaking into the shipped UI;
3. action truth matches what the UI promises, especially around first-run guidance, modpack actions, and settings or account affordances;
4. route-level forms, dialogs, headers, filters, and feedback states stop mixing old fixed-dark styling, legacy spacing, emoji, and ad hoc icon or button semantics;
5. the phase closes on focused route sanity evidence, but without consuming the full milestone-wide manual walkthrough reserved for Phase 10.

The main planning trap is to keep polishing Phase 7 foundations instead of rolling them out to actual route owners. The second trap is to let Phase 8 absorb all secondary surfaces, accessibility cleanup, or release documentation truth. Those belong to later phases.

## Requirement Fit

This phase directly covers:

- `DSYS-03`: refreshed core surfaces use shared primitives and shared tokens instead of feature-local styling exceptions;
- `LOCL-01`: refreshed core routes ship complete visible EN and RU copy across labels, helper text, placeholders, validation, tooltips, and empty states;
- `UX-01`: launcher home and play flow emphasizes primary actions and current status more clearly;
- `UX-02`: browse, inspect, install, and manage modpacks through a coherent and lower-friction experience;
- `UX-03`: account and settings flows match the rest of the launcher visually and structurally.

It should intentionally not claim:

- `A11Y-04` broad focus, contrast, and reduced-motion completion across the rest of the refreshed UI;
- `UX-04` secondary-surface alignment;
- `VER-01` milestone closeout walkthrough;
- `DOC-03` release-facing documentation truth.

## Current Baseline

### Core routes are state-driven owner surfaces, not React Router pages

The renderer is still driven primarily by application state:

- `src/App.tsx` gates onboarding and mounts `AppLayout`;
- `src/components/AppLayout.tsx` chooses the center pane by `uiMode`;
- `src/components/SettingsPage.tsx` is an overlay, not a route;
- `src/components/modpacks/ModpackRouter.tsx` is its own internal route switch backed by `useModpackNavigation`.

That means Phase 8 should plan around owner components and route-state seams, not around a page-router migration.

### Home and play flow still carries legacy route-level styling and messaging

`src/components/SimplePlayDashboard.tsx` still contains legacy route-local presentation:

- indigo welcome-banner styling that does not use the Phase 7 token layer;
- emoji-driven affordances and older copy fallbacks;
- mixed dashboard, classic settings, and content tab responsibilities in one route owner;
- a first-use experience that is visually stronger than pre-Phase-7, but still not fully aligned with the new shell language.

Explorer inspection also found route-truth drift: onboarding and welcome guidance currently tell users to start with modpacks even though the app defaults to the classic/simple path on first run.

### Settings and accounts are only partially rolled onto the new system

`src/components/SettingsPage.tsx` already uses the refreshed modal shell and tab header, but the route is not yet fully coherent:

- the footer action still carries route-local accent styling;
- `AccountsPage.tsx` and `AddAccountDialog.tsx` are actively being modernized in the working tree;
- `AccountSkinPanel.tsx` remains a visible split point with older hard-coded dark styling and route-local presentation.

This is strong evidence that Phase 8 should treat settings plus accounts as one rollout seam instead of separate cleanup chores.

### Onboarding is a sensitive DOM-selector seam, not just a copy surface

`WelcomePage.tsx` and `OnboardingTour.tsx` are mounted from `App.tsx` and the tour targets DOM selectors such as `[data-tour="classic"]` and `[data-tour="modpacks"]`.

That matters for planning:

- onboarding changes can silently break tour targeting if layout ownership changes;
- the copy must match the actual first-run route and launcher mode;
- onboarding should adopt the shared visual language without introducing route-local exceptions or raw fallback copy.

### Modpack routes are the highest-volume visual and localization drift zone

Phase 3 fixed navigation correctness and history persistence, but the route surfaces still show broad UI truth debt:

- `ModpackList.tsx` exposes a `Play` action in the context menu that only selects a pack instead of launching anything;
- `ModpackBrowser.tsx`, `InstallModpackPage.tsx`, `AddModModal.tsx`, `ExportModpackPage.tsx`, and `ModpackDetailsHeader.tsx` still mix old `zinc` or `white`/`dark` route-local styling with Phase 7 primitives;
- multiple controls still fall back to raw Russian or placeholder English strings in both code and locale gaps;
- disabled provider tabs still expose raw `(WIP)` copy instead of an honest, localized product message.

This is the most important Phase 8 rollout seam for `UX-02` and a major part of `LOCL-01`.

### Existing local edits are relevant planning evidence, not noise

The working tree already contains local route work in:

- `src/components/onboarding/WelcomePage.tsx`
- `src/features/accounts/AccountsPage.tsx`
- `src/features/accounts/AddAccountDialog.tsx`

The planner should preserve those files as real in-flight seams and avoid creating duplicate plan slices that ignore them. The correct posture is “refine and complete” rather than “invent a different route.”

## Existing Verification Seams

Phase 8 does not need a new test framework. The repo already has focused route-level seams that Phase 8 should extend:

- `src/components/__tests__/Sidebar.keyboard.test.tsx`
- `src/features/accounts/__tests__/AccountsPage.a11y.test.tsx`
- `src/features/accounts/__tests__/AccountSkinsPage.test.tsx`
- `src/components/modpacks/__tests__/ModpackList.keyboard.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.a11y.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx`

What is still missing is coverage for the new route-truth work itself:

- home/play and onboarding coherence;
- settings/accounts modal integration beyond isolated account behavior;
- modpack route action truth and newly touched localization or details/header seams.

Phase 8 should add only the focused tests needed to prove those rollout seams, not a broad visual-regression system.

## Planning Risks

- If Phase 8 is planned as generic polish instead of owner-route rollout, execution will spread across too many files without proving the milestone requirements.
- If onboarding copy is refreshed without reconciling it with the actual default launcher mode, the launcher will look better but still mislead first-run users.
- If settings/accounts visual cleanup stops before `AccountSkinPanel`, the settings route will still feel stitched together from incompatible passes.
- If modpack list/browser/details/install work is split too narrowly, action truth and localization gaps can survive in the cracks between owners.
- If Phase 8 closes only on lint and type gates, it can miss route-level regressions in onboarding targets, action semantics, and route-specific helper or placeholder copy.
- If Phase 8 broadens into all secondary surfaces or full milestone manual verification, it will steal scope from Phases 9 and 10 and likely stall execution.

## Recommended Plan Shape

The cleanest Phase 8 decomposition is four plans:

- `08-01`: align the launcher entry, home/play route, and onboarding guidance around the real default flow and shared route language;
- `08-02`: complete the settings and accounts rollout so account, skin, and settings behaviors read as one product surface;
- `08-03`: align the core modpack routes, including list, browser, install, details-header, export, and add-mod seams, with corrected action truth and locale completeness;
- `08-04`: run the focused route verification suite plus repo gates and fix only Phase 8 fallout, including a narrow live browser sanity pass on the refreshed critical flows.

Recommended wave map:

- Wave 1: `08-01`, `08-02`
- Wave 2: `08-03`
- Wave 3: `08-04`

This keeps entry, settings/accounts, and modpack rollout separable while still giving the phase one clear integration closeout.

## Validation Architecture

Phase 8 should use the existing Vitest + jsdom lane plus targeted manual route sanity.

### Layer 1: focused route regression coverage

Add or extend tests around:

- home/play and onboarding copy or route-truth seams;
- settings/accounts and skin-panel integration;
- modpack list action truth, browser controls, and details/header or export localization seams.

### Layer 2: targeted accessibility and interaction seams

Keep using the existing accessibility and keyboard route tests for:

- account list semantics;
- account skin panel behavior;
- modpack list keyboard/menu behavior;
- modpack browser search and result activation.

### Layer 3: repo gates for rollout fallout

After each wave, Phase 8 should still prove it did not destabilize the app via:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`

### Layer 4: route-level manual sanity

Phase 8 still needs live route evidence, but it should stay narrow:

- check the first-run entry and onboarding guidance;
- check the home/play dashboard hierarchy;
- check settings/accounts visual continuity;
- check modpack list/browser/details/install coherence.

That manual sanity is enough for Phase 8. The milestone-wide real walkthrough remains Phase 10 work.
