# Phase 5 Research: Accessibility And Release Truthfulness

## What The Planner Needs To Know

Phase 5 is not a greenfield accessibility program and it should not turn into a UI redesign. FMCL already has partial accessibility affordances and a large amount of shipped product surface. The remaining release gap is that these affordances are inconsistent, keyboard support is incomplete across core workflows, and the public documentation no longer matches the product that now exists after Phases 1 through 4.

The planner should treat this as a focused completion and release-truth phase with four connected seams:

1. shared dialog, tab, and shell primitives need correct keyboard and assistive-technology semantics;
2. core launcher and modpack workflows need to be truly keyboard-usable instead of mostly pointer-first;
3. contrast, focus visibility, and reduced-motion behavior need to match release expectations across the real shipped themes and animated surfaces;
4. README plus EN/RU roadmap and contract documents need to describe the actual current FMCL release rather than an older product snapshot.

The safest phase shape is:

1. fix shared accessibility foundations first, especially modal and settings-shell behavior;
2. harden launcher and modpack workflows on top of those foundations with targeted keyboard and ARIA completion;
3. finish visual accessibility and reduced-motion cleanup across the release-critical settings and dashboard surfaces;
4. refresh the public docs and contract maps after the shipped UI behavior is stable;
5. close the phase under the full repo-wide release gate.

Do not turn this phase into a component-library rewrite, a new design system, a localization expansion, or an attempt to certify every niche path in the app. The release requirement is practical keyboard usability, assistive-technology friendliness, visual accessibility, and truthful public documentation inside the current Electron and React architecture.

## Requirement Fit

This phase directly covers:

- `A11Y-01`: users can complete core launcher and modpack flows with keyboard-only navigation;
- `A11Y-02`: interactive controls expose accessible names, roles, and states;
- `A11Y-03`: themes, backgrounds, and animations meet contrast and reduced-motion expectations;
- `DOC-01`: README and EN/RU roadmaps accurately reflect shipped FMCL feature status;
- `DOC-02`: contract maps document the active IPC channels for release-critical domains.

## Current Baseline

### Accessibility support already exists, but it is inconsistent and local to a few components

The codebase already includes some correct or partly correct accessibility work:

- `src/components/ui/Toast.tsx` and `src/components/ui/ToastContainer.tsx` expose alert and live-region semantics;
- `src/components/ui/LoadingSpinner.tsx` and `src/components/ui/SkeletonLoader.tsx` expose loading roles and labels;
- `src/components/ui/Breadcrumbs.tsx` uses navigation semantics;
- `src/components/ui/ConfirmDialog.tsx` already exposes `role="dialog"`, `aria-modal`, and labelled-by relationships;
- `src/components/SimplePlayDashboard.tsx` already contains at least some explicit `role`, `tabIndex`, and keyboard handling.

This is an important brownfield clue: Phase 5 should normalize and extend existing patterns, not invent an unrelated accessibility abstraction layer.

### Shared dialog and settings-shell primitives still block reliable keyboard and AT behavior

`src/components/ui/Modal.tsx` is a major release seam and is currently underpowered for accessibility:

- it does not expose dialog semantics comparable to `ConfirmDialog`;
- it has no focus trap;
- it does not restore focus to the opener;
- it does not establish labelled or described-by relationships;
- it uses timer-driven mount and unmount behavior that can complicate focus timing and reduced-motion handling.

`src/components/settings/SettingsTabsHeader.tsx` is also a clear gap:

- it renders tab-like buttons without `tablist`, `tab`, or `tabpanel` semantics;
- there is no keyboard arrow navigation model;
- it currently contains a duplicate `storage` tab entry, which would directly undermine predictable keyboard movement and assistive-technology announcements.

`src/components/SettingsPage.tsx` depends on those tabs and is therefore part of the same seam.

### Core launcher and modpack surfaces are still too pointer-first

Several release-critical flows remain only partly keyboard-usable:

- `src/components/Sidebar.tsx` contains launch and shell controls, but there is no clear landmark structure and collapsed-mode actions lean heavily on icon-only affordances and title attributes;
- `src/components/modpacks/ModpackBrowser.tsx` and `src/components/modpacks/ModpackList.tsx` already support large parts of the launcher workflow, but the UI still depends heavily on click targets, pointer context menus, and ad hoc control groupings;
- right-click or visually implicit actions in installed-modpack flows are especially risky for keyboard-only users even after Phase 3 made the workflows feature-complete;
- repo-wide search shows many interactive handlers in `src/` without matching semantic patterns such as labelled menus, tab models, or consistent keyboard handling.

Phase 5 does not need to audit every dormant screen first. It does need to make the launcher shell plus the core browse, install, select, rename, duplicate, settings, and statistics flows honestly keyboard-usable.

### Reduced-motion groundwork exists, but animated surfaces still outrun it

FMCL already has two useful reduced-motion hooks:

- `src/index.css` contains a `@media (prefers-reduced-motion: reduce)` block for several animation classes;
- `src/contexts/SettingsContext.tsx` and `src/components/settings/tabs/AppearanceTab.tsx` already support a persisted `disableAnimations` setting.

That groundwork is incomplete because several components still hardcode animation or transition-heavy behavior:

- `src/components/ui/Button.tsx` applies hover or active transforms and transition styling globally;
- `src/components/ui/Modal.tsx` uses timed opacity, scale, and translate transitions;
- `src/components/Sidebar.tsx` and `src/components/SimplePlayDashboard.tsx` use staggered movement and visibility transitions;
- theme-heavy surfaces still need practical contrast review, especially where glassmorphism, muted text, icon-only buttons, and background overlays intersect.

So `A11Y-03` is not "add reduced-motion support from scratch". It is "finish the exceptions and visual polish so the existing motion and theme systems behave accessibly in the real UI."

### Documentation truth is stale in English and only partially caught up in Russian

The public docs no longer fully reflect the product:

- `README.md` still reads as an earlier-stage launcher and under-reports implemented features such as duplicate or rename, history and pagination, cache controls, skins, mirrors, and richer statistics;
- `docs/en/roadmap.md` is clearly stale and still shows items as incomplete that were delivered in earlier phases;
- `docs/en/contracts-map.md` is dated `2026-01-26` and is missing many active channels and preload surfaces that now exist for account, mirrors, share, screenshots, statistics, worlds, resource packs, shaders, and datapacks;
- `docs/ru/contracts-map.md` is much closer to current truth after Phase 4, but it still needs a final release audit rather than assuming the previous update is complete.

Phase 5 should treat documentation truth as a real release deliverable, not a nice-to-have after code freeze.

## Brownfield-Safe Sequencing

### 1. Fix shared accessibility foundations before auditing every feature surface

The modal and settings-shell seams are reused widely. If those remain semantically weak, later keyboard or ARIA cleanup in individual screens will be fragile and repetitive.

That likely means:

- bringing `Modal` closer to `ConfirmDialog` semantics while adding focus management and reduced-motion-safe behavior;
- giving settings navigation proper tab semantics and keyboard movement;
- fixing the duplicated settings-tab entry while those semantics are being repaired.

### 2. Land keyboard and ARIA completion on core launcher and modpack flows, not the whole app at once

The roadmap requirement is about core launcher and modpack workflows. The highest-value surfaces are:

- launcher shell and sidebar actions;
- modpack browser search, history, favorites, pagination, and install navigation;
- installed-modpack list and its card actions;
- settings and recently expanded Phase 4 settings surfaces that users actively reach from the shell.

That scope is large enough to matter and narrow enough to finish.

### 3. Treat visual accessibility as a targeted theme and motion cleanup pass

`A11Y-03` should stay focused on:

- practical contrast improvements where muted or translucent styles undercut readability;
- visible and consistent focus indication;
- eliminating motion that survives `prefers-reduced-motion` or the app-level disable-animations setting.

This should not become a visual redesign or a brand rework.

### 4. Update docs only after the shipped behavior is stable

The docs should be refreshed once the Phase 5 UI behavior is in place. Otherwise the roadmap, README, and contract maps will drift again while the same phase is still landing.

## Planning Risks

- If Phase 5 only adds ARIA labels without fixing focus trap, tab sequencing, or dialog return focus, `A11Y-01` will still fail for keyboard users.
- If the phase audits only shared primitives and skips core modpack or launcher flows, the app will remain only partially keyboard-usable in practice.
- If reduced-motion cleanup ignores the app-level `disableAnimations` setting and only touches CSS media queries, the launcher will still behave inconsistently.
- If contrast work is treated as cosmetic polish rather than release-blocking readability, dark or translucent surfaces can remain hard to read even after semantic fixes.
- If documentation is updated before the final UI pass lands, public docs will restale inside the same phase.
- If the English contract map is translated from the stale English file instead of rebuilt from live IPC and preload sources, `DOC-02` will remain wrong even if the prose looks fresh.

## Recommended Plan Shape

The cleanest Phase 5 decomposition is five plans:

- `05-01`: repair shared accessibility primitives and the settings shell, especially modal semantics, tab behavior, and duplicate-tab correctness;
- `05-02`: complete keyboard and ARIA behavior for the launcher shell plus modpack browser and installed-modpack workflows;
- `05-03`: finish visual accessibility, reduced-motion cleanup, and remaining release-critical settings/account surfaces touched in earlier phases;
- `05-04`: refresh README, EN/RU roadmaps, and EN/RU contract maps from the actual current codebase;
- `05-05`: close the phase under the full repo-wide release gate and fix only accessibility or documentation fallout caused by the phase.

Recommended wave map:

- Wave 1: `05-01`, `05-02`
- Wave 2: `05-03`
- Wave 3: `05-04`
- Wave 4: `05-05`

This keeps the shared-foundation and core-workflow slices independently executable while preserving a disciplined finish: visual polish, then docs truth, then the final gate.

## Validation Architecture

Phase 5 needs mixed validation: targeted renderer tests for the interaction seams that are easiest to regress, plus short manual checks for true keyboard, contrast, and documentation truthfulness in the shipped UI.

### Layer 1: shared accessibility primitive automation

The shared-shell slice should have automated coverage around:

- modal labelling, close behavior, focus trap, and focus return;
- settings-tab semantics and keyboard movement;
- any shared button or loading-state semantics changed during the fix.

### Layer 2: launcher and modpack workflow automation

The core workflow slice should have automated coverage around:

- sidebar keyboard reachability and named controls;
- modpack browser keyboard interaction, history reopening, and result actions;
- installed-modpack card actions staying keyboard-usable after earlier workflow work.

### Layer 3: targeted settings-surface automation

The visual and release-polish slice should add focused tests where practical for:

- accounts, mirrors, and statistics settings surfaces that gained new controls in Phase 4;
- reduced-motion-sensitive state or semantics that would otherwise regress silently.

### Layer 4: manual release checks

Manual verification is still required for:

- a true keyboard-only pass through launcher shell, settings, and modpack flows;
- contrast and focus visibility on the real light and dark themes;
- reduced-motion behavior with both system preference and the FMCL disable-animations setting;
- documentation truth review against the shipped app and active IPC surface.

These should be short, phase-specific release smokes rather than a broad exploratory QA cycle.

### Layer 5: full release gate

Phase 5 should still close under the same repo-wide gate used in earlier phases:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run contracts:check`
- `npm run ipc:check`
- `npm run build -- --publish never`

Phase 5 does not need new infrastructure. It should reuse the Vitest lane from Phase 2 and extend it with a small number of targeted renderer tests that protect the new accessibility seams.
