# Phase 34 Research: Detail Hierarchy And Content Surface Cohesion

## What The Planner Needs To Know

Phase 34 is not a generic “polish the details page” pass. It is the direct answer to a tight cluster of feedback about the modpack details route:

1. tabs are still discoverable too late because the route stacks header, hero, actions, and tab-local mini-headers before useful content starts;
2. the details page still does not present one authoritative runtime and dependency summary on the first-read surface, and healthy versus warning versus broken semantics drift between the settings summary, mods dependency chips, and shader capability messaging;
3. Mods, Resource Packs, Shaders, Worlds, and Screenshots still read like different mini-products instead of one coherent workspace.

The phase boundary should stay narrow:

1. keep tab switching and first-read content above the fold without reopening route-primary ownership or Phase 29 card density work;
2. expose one route-owned runtime and dependency summary on the default details surface and stop details-level truth from drifting between header, settings, and secondary content;
3. establish one details-workspace layout and copy contract across content tabs, especially where screenshots currently escape the shared shell;
4. refresh automated and manual proof seams so later closeout cannot claim success using the older density-era routes.

The phase should explicitly avoid:

- reopening catalog density, classic sidebar truth, or CTA geometry already owned by Phase 33;
- reopening create/add async recovery, guided browser fallback behavior, or install-error explanations that belong to Phase 35;
- drifting into launcher-wide control-system cleanup or settings geometry that belong to Phase 36;
- expanding into the larger “main-process projected runtime summary” architecture debt unless route-level truth cannot be closed without it.

## Requirement Fit

### `MODPACK-11`

This requirement is owned by the route shell and tab host, not by a single tab body:

- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/details/ModpackDetailsActions.tsx`
- `src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetails.density.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx`

Current state:

- Phase 29 already moved the tabs into the hero and demoted the actions rail enough to remove the worst “below the fold” failure.
- The remaining problem is structural, not purely visual:
  - the route still stacks route header, shared hero, and then tab-local summary shells before a user reaches the actual list or content area;
  - the tablist in `ModpackDetailsHeader.tsx` is still implemented as a wrapped grid, which technically works but does not read like the most obvious scan-and-switch surface;
  - `mods`, `resourcepacks`, and `shaders` each restart the page with their own top summary shell, so switching tabs often feels like landing on another mini-hero instead of directly entering content.

Planning implication:

- the phase needs a route-top contract first, before adjusting individual tab bodies;
- tab discoverability should be treated as both layout and proof ownership, not only styling;
- `Play` must remain the sole route-primary action while the tab area becomes more obviously “first read.”

Out of scope:

- generic tab-system cleanup outside the modpack details route;
- widening this work into catalog, settings, or simple-play navigation.

### `MODPACK-12`

This requirement spans the shared runtime summary model and the details-specific surfaces that interpret it:

- `src/features/modpacks/hooks/useModpackRuntimeSummary.ts`
- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/details/ModpackDetailsInfoTab.tsx`
- `src/components/modpacks/details/ModpackDetailsSettingsTab.tsx`
- `src/components/sidebar/ModpackDependencySummary.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/features/modpacks/__tests__/runtimeSummary.truth.test.ts`
- `src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx`
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx`

Current state:

- `ModpackDetails.tsx` already computes one `runtimeSummary`, but the default details experience does not show it. The visible dependency summary remains settings-only.
- `ModpackDetailsHeader.tsx` still rebuilds its own runtime metadata from raw config and metadata instead of consuming the route-owned summary object.
- The details route can render metadata-backed truth first and config-backed truth later because metadata and config readiness are still separate seams.
- Status semantics drift across consumers:
  - `ModpackDependencySummary` already uses neutral, amber, and red tones;
  - shader capability messaging uses its own supported / needs setup / unsupported / unverified contract;
  - mods collapse dependency health into a harsher chip language than the settings summary.

Planning implication:

- Phase 34 should make the route-owned `runtimeSummary` the only details-level source of truth;
- the first-read details surface should expose that summary before a user needs to open settings;
- neutral, warning, and error semantics need one consistent contract across settings, mods, and shaders;
- the plan should add route-level truth coverage for metadata-to-config transition instead of assuming current happy-path tests are enough.

Out of scope:

- moving runtime truth computation into main-process projection if the route-level seam can be stabilized locally;
- broader launcher-wide dependency semantics outside details.

### `CONTENT-07`

This requirement is a details-workspace cohesion problem rather than five unrelated feature bugs:

- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/components/modpacks/details/WorldsTab.tsx`
- `src/features/screenshots/components/ScreenshotsTab.tsx`
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx`

Current state:

- `mods`, `resourcepacks`, `shaders`, and `worlds` all start from similar-but-not-identical summary shells. Each uses different count language, action grammar, and degraded-state treatment.
- `screenshots` is the sharpest drift seam:
  - `ModpackDetails.tsx` excludes `screenshots` from `secondarySurfaceTab`, so screenshots alone render inside a different outer wrapper;
  - `ScreenshotsTab.tsx` uses screenshot-specific gallery and lightbox behavior, which is fine, but its host-level surface language still reads foreign relative to the other tabs.
- `resourcepacks`, `shaders`, and `worlds` are also used from `SimplePlayDashboard`, so a broad refactor there risks widening the phase beyond the details route.

Planning implication:

- the safest Phase 34 move is to build a details-owned workspace contract and apply it deliberately, rather than forcing full feature convergence across every host surface;
- screenshots should stop being a host-level outlier even if its inner gallery remains unique;
- worlds needs explicit happy-path fit coverage inside the shared details workspace, not only degraded-state proof.

Out of scope:

- guided resource-pack and shader browser behavior, fallback import, or compatibility education beyond what is shown inside the details workspace;
- rewriting shared content tabs for every host surface if a details-specific wrapper or composition layer closes the feedback.

## Historical Context

Phase 29 (`Modpack Workflow Simplification And Runtime Truth`) already compacted the modpack details hero and aligned some runtime/dependency truth, but it did not finish the direct-feedback closure:

- tabs became co-located with hero metadata and actions, yet tab-local summary shells still push useful content down after a switch;
- runtime truth became more config-first, yet the first-read details surface still does not expose one authoritative summary and the color semantics remain uneven;
- the details page still treats screenshots differently at the host-wrapper level.

Phase 31 (`Guided Content Browsers And Capability Expansion`) improved guided resource-pack and shader behavior, but it did not unify the details-workspace language across tabs. In practice, that left strong feature-local flows sitting inside a still-inconsistent tab shell.

Phase 33 deliberately stopped at catalog density and classic truth. Its research already warned that detail hierarchy, runtime semantics, and secondary content surfaces belonged to Phase 34 rather than another catalog pass.

The planner should therefore treat Phase 34 as the corrective “details surface cohesion” follow-up to Phases 29, 31, and 33, not as a new broad redesign.

## Current Hotspots And Why They Matter

### The route still spends too much height before useful content begins

`ModpackDetails.tsx` owns one scroll container, one hero, one actions rail, and the tab switch. The page looks tidier than before, but the user still hits another tab-local summary shell after switching. That is why the complaint remains “I switch tabs and still have to scroll before I can read.”

This matters because a plan that only tweaks header spacing or CTA sizing will miss the deeper issue: the route has too many top-of-tab layers.

### The first-read details tab still does not show the authoritative runtime summary

`info` remains the default tab, yet `ModpackDetailsInfoTab.tsx` currently exposes description and source only. The visible runtime/dependency summary lives in `ModpackDetailsSettingsTab.tsx`, and header metadata is built through a separate interpreter.

This matters because the direct feedback was about truth and confidence, not only settings correctness. If a user lands on details and cannot immediately confirm runtime and dependency state, the product still feels unverified.

### Status semantics are already partially solved, but they still drift across tabs

The underlying runtime summary model is no longer naive, yet the UI still describes similar states in different ways:

- settings summary is neutral/amber/red;
- shader capability treats some of the same conditions as “needs setup” or “unverified”;
- mods surface can still make dependency state feel harsher than the summary box.

This matters because the complaint is semantic, not only chromatic: healthy should feel healthy, warning should feel cautionary, and broken should feel broken once, not differently per tab.

### Screenshots are the clearest proof that the host contract is incomplete

The screenshot feature itself is not wrong. The drift comes from the host composition:

- screenshots alone skip the shared secondary-surface wrapper contract;
- they present a visibly different header and outer container treatment before the gallery even begins.

This matters because it turns one tab into proof that the launcher still lacks a single details-workspace grammar.

### Shared content tabs widen the risk of accidental scope creep

Resource packs, shaders, and worlds are also used from `SimplePlayDashboard`. That means Phase 34 should prefer a details-owned wrapper, composition, or slot contract where possible rather than forcing broad shared-tab changes unless the direct feedback truly demands it.

This matters because otherwise the phase can easily drift into an all-host content-system refactor instead of closing the details-route complaints.

## Validation Architecture

Phase 34 can stay inside the existing Vitest + targeted ESLint + `tsc` loop, but it needs at least one new route-level proof seam before execution is trustworthy.

Existing strong seams:

- `src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx` for hero / tabs / actions ownership;
- `src/components/modpacks/__tests__/ModpackDetails.density.test.tsx` for details hierarchy under constrained space;
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx` for tab presence, labels, and visibility;
- `src/features/modpacks/__tests__/runtimeSummary.truth.test.ts` for precedence and capability derivation;
- `src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx` for header/settings alignment under edits;
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` for cross-tab content behavior;
- `src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx` and `src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx` for feature-local capability and screenshots behavior.

Missing or weak seams that the phase should treat as Wave 0 or first-wave ownership:

- a route-level `ModpackDetails` runtime-truth seam that proves the default details surface exposes one authoritative summary and that metadata-to-config transition does not overclaim truth;
- stronger route-integrated `SecondaryContentTabs` expectations that prove tabs share one details-workspace contract instead of only passing isolated feature tests;
- refreshed manual-proof descriptions for `modpack-details`, `phase-21-details-density`, and `phase-21-secondary-density` so later closeout work reviews the Phase 34 contract rather than the earlier density story.

Manual-only verification still matters for:

- real “above the fold” readability after switching tabs at common desktop sizes;
- whether runtime and dependency language feels authoritative at a glance instead of merely technically correct;
- whether Mods, Resource Packs, Shaders, Worlds, and Screenshots now feel like one product surface rather than a set of adjacent feature demos.
