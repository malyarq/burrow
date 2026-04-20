# Phase 29 Research: Modpack Workflow Simplification And Runtime Truth

## What The Planner Needs To Know

Phase 29 is the first broad modpack-cleanup phase of `v0.6.0`. It should stay bounded to existing modpack browse, detail, dependency, runtime-summary, create, and add-content seams. The goal is not to add new capability; it is to remove the current split-brain feeling where the user sees too many controls, too much card detail, inconsistent tab composition, and contradictory runtime truth depending on which surface they are on.

Three constraints matter most:

1. Phase 28 already removed shell-level noise and startup lies. Phase 29 must keep complexity local to modpack-owned surfaces rather than reopening shell chrome or launcher-home identity work.
2. Phase 16 already established that effective runtime config is the truthful dependency source. Phase 29 should extend that principle across more modpack surfaces instead of inventing a second runtime authority.
3. Phase 31 owns in-app resource-pack and shader browsers. Phase 29 may align existing tabs and add-mod flows, but it must not absorb guided content-browser expansion.

The current product feedback is unusually specific, so the planner should treat those decisions as locked rather than optional taste:

- search and filters should collapse into one compact horizontal composition;
- top summary blocks in the modpack list should lose weight or disappear;
- modpack cards should keep only minimal summary data;
- details tabs must be reachable without scrolling below oversized action blocks;
- visible runtime truth must stop depending on stale metadata or per-component formatter drift;
- create/add flows must stop relying on silent failure, flicker, or reload-style recovery.

## Requirement Fit

### `MODPACK-01`

This is primarily a shared catalog-controls composition problem across:

- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/features/modpacks/hooks/useModpackNavigation.ts`

The current breakage is not one broken control. It is duplicated composition spread across header strips, summary chips, search/filter cards, history mode, and pagination, with the core filter rows collapsing into vertical stacks below `xl`.

Planning implication:

- favor one shared presentational controls shell reused by installed and remote surfaces;
- keep browser-only state/pagination/history in wrappers rather than forcing one monolithic page component.

### `MODPACK-02`

This is a density and card-summary problem, not a missing-data problem. The visible seams are:

- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx`

Planning implication:

- reduce card summary content before adding new compactness logic elsewhere;
- keep details view as the place where deeper pack information becomes visible.

### `MODPACK-03`

This is a details-layout and tab discoverability problem inside:

- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/details/ModpackDetailsActions.tsx`
- existing detail density/layout tests

The key issue is composition: oversized summary and actions occupy the top of the route, pushing tabs and tab content down. Phase 29 should shrink or rearrange that top-of-route seam rather than inventing new navigation.

### `MODPACK-04` and `MODPACK-05`

These are the runtime-truth core of the phase.

Best existing seed:

- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `src/components/sidebar/ModpackDependencySummary.tsx`
- `src/features/modpacks/hooks/useModpackDetailsConfig.ts`

Current split:

- details header formats runtime one way;
- details settings tab already uses shared dependency helpers;
- list cards and filter summaries rely mostly on metadata;
- launch-adjacent surfaces partially reuse runtime helpers but still merge sources ad hoc.

Planning implication:

- create one normalized runtime-summary source with explicit precedence before trying to “polish” dependent surfaces;
- let dependency color and warning semantics come out of that shared source, not from per-surface visual rules.

### `MODPACK-06`

This is an async flow stability and error-contract problem in:

- `src/components/modpacks/ModpackCreationWizard.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/AddModModal.tsx`
- `electron/services/modpacks/modpackService.ts`

The current issues are not limited to copy:

- exit paths stay live during create/install;
- stale async responses can overwrite newer user intent;
- post-commit failures can present as generic create failure and encourage duplicate retries;
- mixed-success add closes too early;
- degraded-state and retry behavior is inconsistent.

Planning implication:

- Phase 29 must explicitly choose a commit model and busy-state contract before implementation tasks can be decomposed cleanly.

## Current Hotspots And Why They Matter

### Installed and remote catalog controls are duplicated, not shared

`ModpackList.tsx` and `ModpackBrowser.tsx` each own their own search, filter, sort, active-filter summary, and reset behavior. The duplication is both visual and behavioral. This matters because every density change or runtime-summary cleanup would otherwise need to be implemented twice.

### Runtime truth is already partially normalized, but the authority is in the wrong place

`buildRuntimeDependencyState()` and `ModpackDependencySummary` already encode useful truth about runtime, dependency count, warnings, and humanized loader labels. But they live in a sidebar-named seam and are not the authoritative source for list cards, details header, mods-tab runtime context, or launch-adjacent pack summaries. Phase 29 should promote that seed into a modpack-owned summary seam instead of creating a third interpretation.

### Details header and actions are fighting tab discoverability

The current details route already has tests for density and route-primary action ownership. That means the planner does not need to discover whether the problem exists; it needs to design the smallest rearrangement that makes tabs feel immediate and keeps route actions secondary to content reachability.

### Async create and add flows lack one durable contract

The create wizard and add-mod surfaces currently behave as if they are cancellable and all-or-nothing, but the actual backend writes are durable once they start. That mismatch creates duplicate risk, drifting CTA state, and confusing recovery. The planner should bias toward explicit post-commit recovery instead of trying to fake transactional behavior the product does not actually have.

## Suggested Planner Shape

The cleanest likely split is three or four plan lanes:

1. shared catalog-controls composition plus card-density reduction;
2. details-layout and tab reachability cleanup;
3. authoritative runtime-summary unification plus dependency semantics;
4. async create/add flow stabilization and error-contract tests.

If the planner can keep runtime-summary unification separate from the async flows, execution can stay parallelizable and easier to verify.

## Validation Architecture

### Existing test infrastructure

- framework: `vitest`
- config: `vitest.config.ts`
- static gates: `npx eslint src/`, `npx eslint electron/`, `npx tsc --noEmit`

### Fast feedback

- focused modpack catalog, detail-density, runtime-summary, and async-flow component tests
- targeted static/type runs on touched modpack renderer seams plus `electron/services/modpacks/*` when commit semantics change

### Coverage gaps the phase should close

- one shared catalog-controls composition used by installed and remote surfaces
- minimal card-summary rendering on both installed and remote modpack cards
- tab reachability and above-the-fold details composition without route-action competition
- authoritative runtime-summary normalization across details, list, filters, and launch-adjacent surfaces
- dependency color and copy semantics for healthy, warning, and broken states
- busy-state locking, stale async response ordering, mixed-success recovery, and post-commit failure behavior in create/add flows

### Manual-only checks

- confirm the compact catalog-controls composition actually scans faster at realistic desktop widths and does not feel cramped
- confirm detail tabs feel immediately reachable in the real route, not only in isolated DOM assertions
- confirm create/add failure recovery feels explanatory and stable in the live app rather than merely test-green

## Planning Guidance

- Keep every plan tied directly to `MODPACK-01` through `MODPACK-06`; avoid side quests into resource-pack/shader browser expansion or settings cleanup.
- Treat the normalized runtime-summary source as an enabling seam, not as an excuse to redesign every consumer surface in one task.
- Prefer tests that encode interaction contracts and race ordering over purely static snapshots for create/add flows.
- Reuse existing detail and catalog verification seams instead of inventing a phase-specific harness.

## Files Inspected

- `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-CONTEXT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `docs/ru/product-feedback-2026-04-20.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/ModpackCreationWizard.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `src/features/modpacks/hooks/useModpackDetailsConfig.ts`
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetails.density.test.tsx`
- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx`
