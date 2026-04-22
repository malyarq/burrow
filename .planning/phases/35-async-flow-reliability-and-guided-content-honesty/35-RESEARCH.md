# Phase 35 Research: Async Flow Reliability And Guided Content Honesty

## What The Planner Needs To Know

Phase 35 is not a generic “make flows nicer” pass. It is the direct answer to four remaining feedback failures that still break trust in live use:

1. create-modpack can still fail with generic copy even when the actionable cause is visible in the current runtime choice;
2. add-mod and guided-content routes still let long result lists dominate the same scroll flow as the confirmation CTA, so the primary action can drift away while search or install work continues;
3. guided resource-pack and shader flows now exist, but the launcher still leans too heavily on proof fixtures and low-claim copy instead of proving live-surface compatibility and recovery behavior;
4. switching the active modpack still has an obvious churn seam because selection and refresh work fan out through multiple renderer updates.

The phase boundary should stay narrow:

1. keep create/add confirmation actions fixed and reachable inside the existing route and modal shells instead of redesigning the whole flow family;
2. turn generic failure copy into concrete next-action explanations where FMCL already knows the likely cause, especially around runtime and content-install issues;
3. make guided resource-pack and shader guidance feel trustworthy on the actual product surfaces, not only in proof routes;
4. remove obvious active-modpack flicker by stabilizing the current selection pipeline instead of rewriting routing or state management.

The phase should explicitly avoid:

- reopening catalog density, details hierarchy, or shared content workspace work already owned by Phases 33 and 34;
- broad marketplace or library expansion for content flows;
- launcher-wide control-system cleanup that belongs to Phase 36;
- a framework, router, or context rewrite.

## Requirement Fit

### `MODPACK-13`

This requirement is owned by the current create/add shells and their layout proof:

- `src/components/modpacks/ModpackCreationWizard.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/AddModModal.tsx`
- `src/components/modpacks/__tests__/CreateModpackFlow.async-state.test.tsx`
- `src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx`
- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx`
- `src/components/modpacks/__tests__/AddModModal.layout.test.tsx`

Current state:

- Phase 29 already locked obvious exits during durable work and protected create/add flows from stale search results and fake rollback.
- The remaining complaint is structural, not only async-state:
  - `ModpackCreationWizard.tsx` renders step content and the final CTA rail in one vertical flow inside the route scroller, so long step-three content can still push the primary action down;
  - `AddModPage.tsx` keeps search, fallback, results, notices, and actions in the same `overflow-y-auto` route container;
  - `AddModModal.tsx` does the same inside the modal body.
- The strongest existing layout tests currently normalize that structure:
  - `AddModPage.layout.test.tsx` explicitly expects the route scroll container to contain the action rail;
  - `AddModModal.layout.test.tsx` explicitly expects the modal body to contain the action rail.

Planning implication:

- Phase 35 must treat fixed, reachable CTA rails as a layout-contract change, not a copy tweak;
- existing layout proof is partially inverted and should be rewritten as part of the phase instead of trusted unchanged;
- create, add page, and add modal should share one “results scroll independently, action rail stays reachable” contract.

Out of scope:

- install/import flows outside create/add and guided content routes.

### `MODPACK-14`

This requirement spans explainable failure copy and active-modpack selection continuity:

- `src/components/modpacks/ModpackCreationWizard.tsx`
- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `src/components/sidebar/ModpackDependencySummary.tsx`
- `src/services/ipc/modpacksIPC.ts`
- `electron/services/modpacks/modpackService.ts`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/AddModModal.tsx`
- `src/contexts/ModpackContext.tsx`
- `src/contexts/instances/hooks/useInstanceCrudActions.ts`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/features/modpacks/__tests__/modpackNavigationState.test.tsx`

Current state:

- Create flow still collapses unknown pre-commit failures into `modpacks.create_error`, even when the current runtime dependency summary already knows the warning that the user needs to act on.
- Add-mod flow still explains regular mod failures only as counts (`added` / `failed`) rather than itemized causes, while guided non-mod flows are already more explicit.
- Active-modpack switching still goes through overlapping update paths:
  - `useInstanceCrudActions.select()` calls `setSelectedModpackId`, `setSelectedId`, `fetchModpackConfig`, `setConfig`, and then `refresh()`;
  - `ModpackList.handleSelect()` does its own optimistic local state update, then calls `select(id)`, `refresh()`, and `loadModpacks()` again;
  - `ModpackDetails` launch flow also calls `select(modpackId)` before routing back and launching.
- Existing tests protect browser-state round trips, but there is no dedicated seam that proves selecting an active modpack does not blank or churn the route state on the way to the final config.

Planning implication:

- Phase 35 should separate “pre-commit runtime choice is invalid or risky” from “post-commit follow-up failed” in create flow copy and behavior;
- add-flow recovery should become more specific for mods, not only for resource packs and shaders;
- active-modpack selection needs its own continuity proof seam before flicker can honestly be called fixed.

Out of scope:

- a broader launch orchestration rewrite;
- main-process runtime discovery changes beyond what the current renderer selection pipeline needs.

### `CONTENT-08`

This requirement is about truthful, in-context guidance for resource-pack and shader acquisition:

- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/features/modpacks/hooks/useModpackRuntimeSummary.ts`
- `src/components/modpacks/__tests__/GuidedContentEntry.test.tsx`
- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx`
- `src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx`
- `src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx`

Current state:

- Shader guidance exists and is already tied to `runtimeSummary`, but it is still concentrated in the guided route and the installed shaders tab rather than enforced as one live-surface contract.
- Resource-pack guidance is intentionally low-claim and instance-scoped, which is correct, but it still does not answer “what does FMCL know here?” in the same clear, runtime-aware way that shader guidance now attempts.
- `SimplePlayDashboard` already routes content entry through guided add views, so the entry-point split that Phase 31 started with is no longer the main risk.
- The remaining gap is clarity:
  - shader states need explicit next-action framing for supported, needs-setup, unsupported, and unverified;
  - resource-pack flows need a tighter explanation of scope and runtime context without inventing fake compatibility labels.

Planning implication:

- Phase 35 should refine the guided honesty contract around “what FMCL knows, what it does not know, and what the user should do next”;
- do not expand into provider scoring or speculative compatibility labels for resource packs.

Out of scope:

- broad new metadata or compatibility inference pipelines.

### `CONTENT-09`

This requirement is about recovery on real product surfaces, not only in proof fixtures:

- `src/components/modpacks/AddModPage.tsx`
- `src/services/ipc/modsIPC.ts`
- `shared/contracts/resourcePacks.ts`
- `shared/contracts/shaders.ts`
- `src/components/modpacks/__tests__/GuidedContentFallback.test.tsx`
- `src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx`
- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/__tests__/guidedContentProof.test.tsx`
- `src/verification/manual/__tests__/views.test.ts`

Current state:

- Guided fallback and shader-recovery proof already exist and are fairly strong in manual fixtures.
- The live route also has recovery behavior, but the most explicit regression package still sits in proof-only files (`guidedContentProof.test.tsx`) and specific fixture scenarios.
- `ResourcePacksTab` and `ShadersTab` already expose degraded load states with retry or guided-add actions, which is good groundwork, but Phase 35 still needs to prove that the same trust story holds once the user moves between live installed-state and guided acquisition.
- Local fallback is explicit on `AddModPage`, but Phase 35 should keep it explicit while tightening the surrounding recovery and retry language.

Planning implication:

- live-surface recovery tests should stop leaning mainly on manual-fixture proof;
- the phase should finish with proof-harness refresh, but manual routes must be downstream evidence of live behavior rather than the only place where the honesty contract is fully readable.

Out of scope:

- reintroducing OS file pickers as primary acquisition behavior.

## Historical Context

Phase 29 already stabilized create/add async state and stopped fake rollback after committed writes, but it did not make the flows product-complete:

- exits lock correctly, but CTA rails still move with long content;
- create failures are still too generic before a durable write;
- regular mod add recovery remains count-heavy instead of cause-heavy.

Phase 31 already introduced guided resource-pack and shader browsing, local fallback, and shader capability messaging, but it closed mostly on proof-first automation:

- the live routes gained the right pieces, yet the strongest regression package still centers on guided proof fixtures;
- content honesty is stronger than before, but still not fully phrased as one clear live-surface contract.

Phase 35 should therefore be treated as the corrective “make the async and guided story trustworthy in daily use” follow-up to Phases 29 and 31, not as a brand-new capability wave.

## Current Hotspots And Why They Matter

### The CTA rails still belong to the scroll flow

`ModpackCreationWizard`, `AddModPage`, and `AddModModal` all keep their primary actions at the tail of the same content flow that can grow due to search results, notices, or step-three content. That is exactly why the user can still experience “I cannot reach Add because new items keep loading.”

This matters because async-state locks alone do not solve a moving-action problem.

### Create flow can warn truthfully before commit, but cannot explain failures truthfully after it

The wizard already computes `runtimeDependencies`, including OptiFine warnings, but the final failure path still drops to a generic `create_error`. That leaves the user to reverse-engineer the likely cause from the controls they just changed.

This matters because the product complaint was not “there was an error.” It was “the launcher did not tell me what actually went wrong.”

### The active-modpack selection path still performs overlapping renderer updates

Selection today fans out through provider state, config fetch, list refresh, optimistic list mutation, and in some places an additional explicit refresh. Even if each step is technically valid, the combination is a good recipe for visible churn.

This matters because the user’s “2-3 rerenders and page flicker” complaint is about perceived stability, not the correctness of the final selected id alone.

### Guided shader honesty is ahead of resource-pack and installed-state clarity

Shaders already expose runtime-aware capability states, while resource packs intentionally avoid compatibility claims. That asymmetry is acceptable only if the launcher clearly explains why the two surfaces make different claims.

This matters because otherwise low-claim honesty reads like missing information rather than deliberate restraint.

### The proof harness is still lagging behind the live trust contract

Current manual views for `modpack-create`, `modpack-add`, `modpack-add-modal`, and the Phase 31 guided routes still describe older proof boundaries such as “route-owned primary action” or “explicit local fallback” without covering fixed CTA rails, actionable failure explanations, or active-modpack continuity.

This matters because later closeout can otherwise pass while reviewers are still checking the older contract.

## Validation Architecture

Phase 35 can stay inside the existing Vitest + targeted renderer lint + `tsc` loop, but it needs new trust seams before execution is believable.

Existing strong seams:

- `src/components/modpacks/__tests__/CreateModpackFlow.async-state.test.tsx` for busy-state exit locking and post-commit recovery;
- `src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx` for stale selection resets, mixed-success recovery, and locked exits;
- `src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx` for guided resource-pack and shader recovery branches that already keep named issues on-surface;
- `src/components/modpacks/__tests__/GuidedContentEntry.test.tsx` and `src/components/modpacks/__tests__/GuidedContentFallback.test.tsx` for entry, fallback, and shader/runtime recovery routing;
- `src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx` and `src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx` for installed-surface entry and shader capability states;
- `src/verification/manual/__tests__/guidedContentProof.test.tsx` for proof-harness guided scenarios.

Missing or weak seams that the phase should treat as Wave 0 or first-wave ownership:

- a create-flow explainability seam that proves FMCL distinguishes pre-commit runtime/dependency causes from post-commit follow-up recovery;
- rewritten add-page and add-modal layout proof that fails if the CTA rail lives inside the same streaming results scroller;
- a modal-specific async recovery seam for `AddModModal`, because the wizard step-three path and details add-mod path both still depend on that overlay rather than the route page;
- an active-modpack selection continuity seam for `ModpackContext` / `ModpackList` that proves selection does not blank or churn the final route state;
- refreshed manual-proof descriptions for create/add/guided routes so future closeout checks the actual Phase 35 contract.

Manual-only verification still matters for:

- whether the fixed create/add CTA rails still feel reachable at common desktop sizes while result lists grow;
- whether create and add failures now read as actionable explanations rather than merely more verbose errors;
- whether active-modpack switching feels visually stable in the real shell;
- whether guided resource-pack and shader recovery now feels like one truthful product story instead of a set of proof fixtures.
