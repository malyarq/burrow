# Phase 21 Research: Dense Surface IA, Navigation, And CTA Hierarchy

## What The Planner Needs To Know

Phase 21 starts after two prerequisite stabilizers:

1. Phase 19 already locked shell-safe geometry, one-primary-action ownership, and flow-first endings for dense routes.
2. Phase 20 already locked brand primitives, shell adoption, and neutral artwork fallback policy.

That means Phase 21 should not reopen shell invariants, title-bar spacing, sidebar CTA ownership, or fallback-art policy. Its job is to make the densest FMCL surfaces readable and trustworthy under real desktop pressure: long labels, crowded metadata, multiple controls, narrow-but-shipped desktop widths, and configuration summaries that must stay truthful when state changes.

The phase boundary is therefore:

- rework dense surface information architecture, navigation, and CTA hierarchy on modpack-owned surfaces;
- improve truth of summaries for version, loader, and dependencies;
- make counts, labels, and metadata legible and non-contradictory;
- prove the result with crowded fixtures and constrained-width verification.

It should explicitly avoid absorbing:

- Phase 22 interaction-state fidelity, hover/focus/selected-state contrast, or preset truth;
- Phase 23 degraded/error-state productization;
- more brand-system work that belongs to already-shipped Phase 20;
- any rewrite of router, shell chrome, or shared fallback policy seams.

## Requirement Fit

Phase 21 directly covers:

- `SHELL-04`: modpack and wizard flows work at shipped desktop widths without clipped controls, orphan filters, or broken spacing;
- `DENSE-01`: modpack browser filters, cards, and actions stay scannable and operable;
- `DENSE-02`: modpack detail tabs and action groups stay readable without broken wrapping or duplicate CTAs;
- `DENSE-03`: create/edit configuration surfaces show truthful summaries for version, loader, and dependencies;
- `DENSE-04`: counts, summaries, and metadata on dense surfaces are labeled and non-contradictory.

Practical consequence:

- catalog density and list/browser hierarchy are the `DENSE-01`/`SHELL-04` workstream;
- details header/tabs/actions and secondary tab density are the `DENSE-02`/`DENSE-04` workstream;
- creation/edit runtime summaries are the `DENSE-03` workstream;
- verification must prove all of those under realistic crowded fixtures, not single-item happy paths.

## Current Dense-Surface Hotspots

### 1. Remote and installed catalog density is concentrated in two files

The remote catalog is almost entirely owned by:

- `src/components/modpacks/ModpackBrowser.tsx`

Important zones:

- state and filter/search/history/favorites plumbing: `74-323`;
- card renderer: `353-441`;
- dense summary/header cluster: `443-517`;
- filter rail, results, and pagination: `614-767`.

The installed analogue is:

- `src/components/modpacks/ModpackList.tsx`

Important zones:

- dense card/actions block: `500-657`;
- top header CTAs: `689-727`;
- filter rail: `730-785`;
- action overlay/menu cluster: `851-969`.

Planning implication:

- Phase 21 should treat `ModpackBrowser` and `ModpackList` as one density/hierarchy workstream, because both expose the same failure modes: wrapped filter controls, stacked summary tokens, competing CTAs, and card metadata that gets dense before the layout acknowledges it.

### 2. Details density is split between shell composition, header metadata, actions, and repeated dense secondary tabs

The details route is composed in:

- `src/components/modpacks/ModpackDetails.tsx`

Important zones:

- shell/header/tab cluster: `327-429`;
- route action rail: `431-449`.

Detailed ownership is then split:

- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/details/ModpackDetailsActions.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/components/modpacks/details/WorldsTab.tsx`
- `src/components/modpacks/details/WorldDatapacksModal.tsx`

Likely density faults called out by code structure:

- metadata and tabs are packed into one header cluster, which is vulnerable to wrapping drift;
- secondary content tabs already live inside a card-heavy shell and then get another `surface-panel` wrapper on top;
- the action rail still collects multiple buttons into a single dense horizontal block, even though primary-action ownership is already solved;
- several secondary tabs repeat dense list-card patterns with counts, toggles, reordering, and external links without a shared density rule.

Planning implication:

- Phase 21 should not treat details as one file. It needs a dedicated plan that spans the shell composition plus `details/*` surfaces together, otherwise the header/actions get fixed while the tabs continue to drift.

### 3. Runtime truth is shared in create flows but split in edit flows

Create-mode runtime truth is shared between:

- `src/components/modpacks/CreateModpackModal.tsx`
- `src/components/modpacks/ModpackCreationWizard.tsx`
- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `src/components/sidebar/ModpackDependencySummary.tsx`

Those surfaces already use a shared dependency summary seam. The wizard step-two block around `352-407` and the modal block around `149-205` are the places where Phase 21 can improve clarity without inventing a second truth source.

Edit-mode truth is weaker:

- `src/components/modpacks/details/ModpackDetailsSettingsTab.tsx`
- `src/features/modpacks/hooks/useModpackDetailsConfig.ts`

The settings tab owns live edits, but there is no shared runtime/dependency summary there. The user effectively edits one surface and reads truth from another display-only header. That directly threatens `DENSE-03`.

Planning implication:

- Phase 21 needs a separate runtime-summary workstream that unifies create and edit truth around the same dependency/version/loader summary seam instead of only polishing wizard cards.

## Verification Seams And Gaps

Existing automated seams already cover parts of the phase:

- browser: `ModpackBrowser.a11y.test.tsx`, `ModpackBrowser.history.test.tsx`, `ModpackBrowser.ergonomics.test.tsx`;
- list: `ModpackList.actions.test.tsx`, `ModpackList.keyboard.test.tsx`, `ModpackList.quick-actions.test.tsx`, `ModpackList.ergonomics.test.tsx`;
- details: `ModpackDetailsHeader.i18n.test.tsx`, `ModpackDetails.actions.test.tsx`, `ModpackDetails.layout.test.tsx`, `details/__tests__/SecondaryContentTabs.test.tsx`;
- create: `CreateModpackDependencies.test.tsx`, `ModpackCreationWizard.layout.test.tsx`.

Manual routes already exist for:

- `modpack-list`
- `modpack-create`
- `modpack-browser`
- `modpack-details`
- `resource-packs`
- `content`

Key gaps:

- no composed density test for `ModpackDetails` under constrained width with long metadata/tabs;
- no edit-settings summary test that proves `DENSE-03` on edit surfaces;
- no crowded browser/list test with long labels and multi-row metadata pressure across multiple cards;
- manual fixtures are still mostly single-item and happy-path; Phase 21 needs intentionally crowded fixtures and long labels.

Planning implication:

- Phase 21 closeout must add both constrained-width automation and crowded manual fixtures, otherwise the phase can “pass” while staying wrong under real density pressure.

## Shared Seams To Reuse

Phase 21 should build on:

- `src/components/modpacks/primaryActionOwnership.ts` from Phase 19, without reopening CTA ownership rules;
- `src/components/sidebar/ModpackDependencySummary.tsx` and `modpackRuntimeDependencies.ts` as the shared runtime/dependency truth seam;
- Phase 20 brand and fallback primitives as already-shipped design constraints, not active work;
- `src/verification/manual/scenarios.tsx` and `views.ts` as the proof harness.

Phase 21 should avoid editing unless strictly necessary:

- `src/components/modpacks/ModpackRouter.tsx`
- shell chrome files like `TitleBar.tsx` or `Sidebar.tsx`
- fallback policy seams like `LazyImage.tsx` or `ArtworkFallback.tsx`

## Likely Plan Boundaries

The cleanest shape is four plans.

### `21-01` Catalog density, filter hierarchy, and constrained-width browser/list ergonomics

Own:

- `ModpackBrowser.tsx`
- `ModpackList.tsx`
- `useModpackNavigation.ts` only if state summaries or round-trip context need minor truth fixes
- browser/list ergonomics tests

Goal:

- make filter rails, summary tokens, card metadata, and card CTAs read cleanly at shipped desktop widths;
- ensure catalog surfaces handle crowded metadata and long labels without broken wrapping or orphan controls.

Requirements:

- `SHELL-04`
- `DENSE-01`
- likely part of `DENSE-04`

### `21-02` Details IA, tab hierarchy, action grouping, and dense secondary content

Own:

- `ModpackDetails.tsx`
- `ModpackDetailsHeader.tsx`
- `ModpackDetailsActions.tsx`
- `ModpackDetailsModsTab.tsx`
- dense secondary tabs and `WorldDatapacksModal.tsx`
- details-specific tests

Goal:

- make detail header metadata, tab hierarchy, and action grouping readable;
- remove duplicated or visually competing dense control clusters across tabs.

Requirements:

- `DENSE-02`
- `SHELL-04`
- part of `DENSE-04`

### `21-03` Runtime summary truth for create and edit surfaces

Own:

- `CreateModpackModal.tsx`
- `ModpackCreationWizard.tsx`
- `ModpackDependencySummary.tsx`
- `modpackRuntimeDependencies.ts`
- `ModpackDetailsSettingsTab.tsx`
- `useModpackDetailsConfig.ts`
- create/edit truth tests

Goal:

- unify version, loader, dependency, and summary truth between create and edit flows;
- ensure edit-mode density and summaries do not contradict the display header.

Requirements:

- `DENSE-03`
- likely part of `DENSE-04`

### `21-04` Crowded proof fixtures and focused density regression closeout

Own:

- manual verification fixtures in `src/verification/manual/*`
- constrained-width and crowded-data tests
- phase closeout docs/state

Goal:

- prove dense surfaces with long labels, realistic card counts, and constrained widths;
- close the phase on density truth rather than visual optimism.

Requirements:

- all phase requirements as proof/closeout.

## Planning Pitfalls To Avoid

- Do not reopen Phase 19 CTA ownership and shell-safe geometry under the banner of “layout cleanup”.
- Do not reopen Phase 20 brand/fallback primitives; consume them.
- Do not fold interaction-state contrast or hover/focus/readability work into this phase. That belongs to Phase 22.
- Do not solve density by hiding information the user still needs. The goal is better hierarchy and labeling, not simply less content.
- Do not restrict proof to single-item/manual happy paths. This phase is specifically about crowded data and constrained widths.

## Validation Architecture

Phase 21 can validate its work through:

### Existing seams worth reusing

- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetails.layout.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx`
- `src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx`
- `src/components/modpacks/__tests__/ModpackCreationWizard.layout.test.tsx`
- shell-integrated manual proof routes in `src/verification/manual/*`

### New seams likely required

- constrained-width density test for composed `ModpackDetails`;
- crowded browser/list density tests with long metadata and CTA pressure;
- edit-settings summary truth test for `ModpackDetailsSettingsTab`;
- manual crowded fixtures for browser/list/details/create with long labels, dense metadata, and edge-case counts.

### Closeout proof expectations

Before Phase 21 can close, proof should include:

- browser and installed catalog views with crowded cards and constrained widths;
- details view with dense metadata/tabs and at least one secondary content tab;
- create or edit runtime-summary view with version/loader/dependency truth;
- focused automation proving the dense seams stay readable without reintroducing duplicate CTA hierarchy or shell overlap.
