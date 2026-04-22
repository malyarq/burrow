# Phase 33 Research: Classic Truth And Catalog Density Repair

## What The Planner Needs To Know

Phase 33 is not a generic “make modpacks prettier” pass. It is the direct follow-up to the user feedback about two concrete failures:

1. Classic mode still feels untruthful when the displayed version and loader wording do not match the real cold-start runtime state.
2. The installed and remote modpack catalogs still feel vertically heavy, overexplained, and visually inconsistent even after earlier density cleanup.

The phase boundary is narrower than “all modpack UX” and should stay that way:

1. make Classic mode read from the actual persisted runtime state on cold start and stop using overloaded vanilla wording;
2. remove leftover summary noise and keep search/filter controls compact and horizontal at common desktop widths;
3. keep modpack cards to the small set of summary facts that help decide whether to open details;
4. normalize primary catalog actions so header CTAs and card actions feel like one contract instead of adjacent but unrelated components.

The phase should explicitly avoid:

- reopening detail-tab hierarchy, runtime dependency color semantics, or secondary content surfaces that belong to Phase 34;
- reopening create/add async recovery work that belongs to Phase 35;
- drifting into settings geometry or broader design-system cleanup that belongs to Phase 36;
- another shell-branding pass, which Phase 32 already closed.

## Requirement Fit

### `MODPACK-07`

This requirement is shared between classic bootstrap truth and the renderer surfaces that expose it:

- `src/contexts/ModpackContext.tsx`
- `src/contexts/instances/hooks/useInstanceBootstrap.ts`
- `src/features/launch/hooks/useLaunchState.ts`
- `src/components/Sidebar.tsx`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `src/locales/en.json`
- `src/locales/ru.json`
- `src/contexts/__tests__/ModpackContext.startup-truth.test.ts`
- `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx`

Current state:

- Phase 32 already fixed the worst startup lie by holding the app in `APP_STARTUP_PENDING` until classic config truth resolves, and the startup truth test now explicitly blocks the stale `1.12.2` flash.
- `useLaunchState()` already reads version and loader from `useModpack().config`, so the data source is mostly right.
- The remaining visible mismatch is renderer wording and proof coverage:
  - classic UI still uses `modpacks.loader_vanilla = "Vanilla (no modloader)"` / `Vanilla (без модлоадера)`, which matches the user complaint about an overlong label;
  - there is no dedicated sidebar truth seam that proves the short vanilla label plus persisted classic runtime truth in the actual classic sidebar surface;
  - `SimplePlayDashboard.launch-state.test.tsx` protects the hero truth, but not the sidebar-select contract where the user actually reads version/loader before launching.

Planning implication:

- treat classic truth as both a persistence seam and a UI wording seam;
- add one renderer regression seam for classic sidebar truth instead of assuming startup gating alone closes the product complaint.

Out of scope:

- modpack-mode runtime truth in details; that belongs to Phase 34.

### `MODPACK-08`

This requirement is owned by the installed and remote catalog control surfaces:

- `src/components/modpacks/ModpackCatalogControls.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx`
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx`
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`

Current state:

- The repo already has a shared `ModpackCatalogControls` shell with `data-catalog-controls="shared"` and horizontal `lg:flex-row` grouping.
- Earlier density work already removed the old dedicated summary test ids such as `installed-modpack-summary` and `remote-modpack-summary`.
- The remaining problem is not the existence of a shared controls component, but the surrounding composition:
  - `ModpackList.tsx` still wraps the installed catalog in a large “header hero” block with description text and a stacked CTA row;
  - `ModpackBrowser.tsx` still keeps a comparatively heavy top header with provider messaging, import/history buttons, and route copy before the actual controls block;
  - status text like `Showing 1-1 of N` and `Active: ...` still competes for attention in the controls region, even though the user asked to remove high-level summary noise.

Planning implication:

- phase plans should target the actual composition around `ModpackCatalogControls`, not only the shared component itself;
- installed and remote catalog density should be planned together so the launcher does not “fix” one surface while the other remains tall and noisy.

Out of scope:

- remote provider/platform strategy beyond the density and clarity of the existing browser header.

### `MODPACK-09`

This requirement is primarily a card-content contract:

- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx`
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`

Current state:

- Earlier density tests already reject obvious regressions like `Downloads`, `Version`, `Modloader`, and long descriptions on cards.
- Remote browser cards are already closer to the feedback target: provider badge, title, Minecraft version, updated label, one main CTA.
- Installed cards are denser and more stateful:
  - update chip, active chip, source chip, larger `min-h-[19rem]`, and the split detail/action shell make the cards feel heavier than the remote equivalent;
  - they still carry more visual state than the user’s “just Minecraft version and Updated” expectation.

Planning implication:

- the planner should treat installed and remote card density as separate subproblems inside one shared card-contract wave;
- card reduction is not only about deleting labels, it is also about making state indicators calm enough that they do not reintroduce a “busy card” feeling.

Out of scope:

- details-view metadata; the user explicitly said the rest belongs in details, which is a Phase 34 concern.

### `MODPACK-10`

This requirement spans shared button styling and the specific catalog action clusters where users reported visual mismatch:

- `src/components/ui/Button.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx`
- `src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx`
- any new header/action-shell regression seam added for Phase 33

Current state:

- `Button.tsx` already provides one shared base component and size tokens, so the inconsistency is not coming from raw button primitives.
- The mismatch is in composition:
  - installed list header uses `Import from Code`, `Create`, and `Browser` in a stacked/wrapping CTA shell that still reads uneven in live use;
  - installed cards use `Open details`, `Make active`, and overflow actions in a different layout contract than the remote browser’s single CTA cards;
  - remote browser header uses `Back`, `Import`, and `History` alongside provider status pills, which creates another visual language.

Planning implication:

- the phase needs at least one plan that targets “action geometry and hierarchy” rather than only card density or control density;
- planning should prefer a shared catalog action cluster pattern over piecemeal class tweaks on one button at a time.

Out of scope:

- global launcher-wide button system cleanup; that belongs to `DESIGN-01` in Phase 36.

## Historical Context

Phase 29 (`Modpack Workflow Simplification And Runtime Truth`) already removed some global catalog noise and improved runtime/dependency truth, but it did not finish the direct-feedback closure:

- classic startup truth was hardened in the provider layer, yet the visible classic label and sidebar proof seam were left partially unresolved;
- catalog controls were compacted, but the installed and remote catalog shells still carry heavier headers and status copy than the user wants;
- density tests already exist, but they mostly prove “better than before,” not “fully aligned with direct feedback.”

The planner should therefore treat Phase 33 as a corrective follow-up to earlier catalog work rather than as a duplicate. The key is not to redo existing cleanup blindly, but to finish the last mile where the product still feels wrong in live use.

## Current Hotspots And Why They Matter

### Classic truth now mostly fails at the surface seam, not the persistence seam

`ModpackContext.tsx` plus `ModpackContext.startup-truth.test.ts` already block the most obvious stale `1.12.2` cold-start lie. That means Phase 33 should not spend its main effort re-debugging bootstrap logic unless planning finds a new regression.

The remaining product risk is the renderer surface:

- `Sidebar.tsx` still owns the classic version selector and modloader controls but has no dedicated truth test for the user-facing label contract.
- `modpackRuntimeDependencies.ts` still translates vanilla as `Vanilla (no modloader)` / `Vanilla (без модлоадера)`, which directly matches the feedback complaint.
- `SimplePlayDashboard.tsx` already renders the classic hero truthfully enough to serve as a secondary proof seam.

This matters because a plan that only touches persistence would miss the more visible complaint: “the UI text still feels wrong even if the underlying config is now right.”

### `ModpackCatalogControls` is not the real problem anymore; the shells around it are

The shared controls component is already horizontally structured and partially verified. The lingering vertical heaviness comes from:

- the installed list header block in `ModpackList.tsx`;
- the remote browser top strip in `ModpackBrowser.tsx`;
- the attached status and CTA composition before the user even reaches the grid.

This matters because the user complaint was not “your filter component is implemented incorrectly.” It was “the catalog still takes too much space and feels too vertical.” The plans therefore need to target composition, not just low-level control classes.

### Existing density tests prove partial restraint, but not full action consistency

`ModpackCatalog.controls`, `ModpackCatalog.density`, `ModpackList.ergonomics`, and `ModpackBrowser.ergonomics` already assert a lot of good behavior:

- no top-level summary test ids;
- grouped filters;
- trimmed card metadata;
- no `Downloads` label on remote cards;
- no `Version` or `Modloader` tiles on installed cards.

What is still missing:

- a seam that directly locks the header CTA geometry and wrapping contract the user complained about (`Import from Code`, `Create`, `Browser`);
- a seam that proves classic sidebar wording stays short and truthful in live classic mode;
- updated manual-proof descriptions for the modpack list and browser surfaces if their current descriptions still normalize older “dense but acceptable” assumptions.

This matters because Phase 33 is likely to look green too early if it only reuses the existing partial density tests.

### Manual proof routes still reference legacy density surfaces rather than the Phase 33 contract

`src/verification/manual/views.ts` still exposes legacy density routes like `phase-21-browser-density`, while the general `modpack-list` and `modpack-browser` descriptions stay broad and non-committal.

That means the planner should reserve one proof-refresh plan at the end of the phase if the new catalog/classic contract changes what human reviewers should inspect.

## Validation Architecture

Phase 33 can stay inside the existing Vitest + targeted renderer-lint loop, but it needs new or updated proof seams before execution is trustworthy.

Existing strong seams:

- `src/contexts/__tests__/ModpackContext.startup-truth.test.ts` for classic config gating and stale-runtime suppression;
- `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx` for classic hero/runtime truth;
- `src/components/modpacks/__tests__/ModpackCatalog.controls.test.tsx` for shared installed/remote control shells;
- `src/components/modpacks/__tests__/ModpackCatalog.density.test.tsx` for dense card metadata and installed action-shell assertions;
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx` and `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx` for installed and remote ergonomic constraints.

Missing or weak seams that Phase 33 should plan as Wave 0 or first-wave ownership:

- a dedicated classic sidebar truth seam that proves short vanilla wording plus persisted runtime truth on cold start;
- a header action-cluster seam for the installed catalog CTA row and, if needed, the browser header cluster;
- a manual verification description refresh if `modpack-list` and `modpack-browser` routes still describe the old density story rather than the new direct-feedback contract.

Manual-only verification still matters for:

- real desktop width readability of the installed and remote catalog headers;
- whether the reduced card density still leaves enough information to choose a pack confidently;
- whether the action rows truly read as “one contract” rather than passing by class names alone.

