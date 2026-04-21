# Phase 31 Research: Guided Content Browsers And Capability Expansion

## What The Planner Needs To Know

Phase 31 should not start from a blank slate. FMCL already has three partial building blocks:

1. installed-state management tabs for resource packs and shaders;
2. a generic in-app add-content route (`AddModPage`) that already accepts `contentType='resourcepack' | 'shader'`;
3. a conflicting direct file-picker path from the classic/simple dashboard.

The planning problem is therefore not "how do we invent content browsing?" It is "how do we turn these split seams into one truthful product contract without broadening FMCL into a marketplace?"

The boundary should stay tight:

1. make the in-app guided flow the canonical path for resource packs and shaders;
2. keep local file import as an explicit fallback inside that guided flow instead of the default path on major surfaces;
3. add honest compatibility guidance, especially for shaders, where current runtime truth is too weak;
4. replace boolean-or-void install/import outcomes with structured, recoverable error reporting;
5. avoid any top-level content hub, cross-pack library, wishlist/store behavior, or unrelated provider expansion.

Two planning facts matter immediately:

- `ModpackDetails` already routes `addResourcePack` and `addShader` through `AddModPage`, so the seed of `CONTENT-01` and `CONTENT-02` exists.
- `SimplePlayDashboard` still calls `resourcePacksIPC.add()` and `shadersIPC.add()` directly, which opens Finder or Explorer and keeps the old local-file path as the primary experience on a high-traffic surface.

That split-brain entry model is the core UX seam Phase 31 has to resolve.

## Requirement Fit

- `CONTENT-01`: partially seeded but not shipped. Resource packs already have an in-app browse/install route in modpack details, but the classic/simple dashboard still defaults to an OS file dialog, so the guided flow is not the canonical path.
- `CONTENT-02`: partially seeded but still untruthful. Shaders already have an in-app browse/install route in modpack details, but there is no compatibility guidance tied to runtime context, and the dashboard still defaults to file import.
- `CONTENT-03`: load failures are reasonably productized, install/import failures are not. Tabs and search routes use degraded states, but pack/shader install and import IPC mostly return `boolean` or `void`, so the renderer cannot explain actionable reasons.
- `CONTENT-04`: inverted today. Local file import exists, but it is primary on the dashboard and absent as an explicit fallback affordance inside the guided browser route.
- `CONTENT-05`: achievable with existing seams if scope stays narrow. `AddModPage` plus the existing Modrinth-backed search/install stack can make resource-pack and shader management feel first-class without adding a new marketplace surface.

## Historical Context

Phase 31 should build on earlier content-surface work rather than reopen it:

- Phase 09 aligned mods, worlds, resource packs, shaders, and datapacks onto one shared secondary-content visual grammar.
- Phase 21 added dense secondary-content and details-tab proof so resource-pack-heavy surfaces stay readable under pressure.
- Phase 23 added truthful unavailable and empty states for resource packs and shaders.
- Phase 29 explicitly deferred guided resource-pack and shader browsers to Phase 31 and only stabilized the shared modpack/add-content shell.

Planning implication:

- do not spend Phase 31 redesigning secondary content from scratch;
- do reuse the existing tabs, degraded states, and add-content route shell;
- do budget for contract and truth work where previous phases intentionally stopped.

## Current Baseline

### There are already two competing add-content entry paths

`src/components/SimplePlayDashboard.tsx` still treats local file import as the add path:

- resource packs: `resourcePacksIPC.add(instancePath)`
- shaders: `shadersIPC.add(instancePath)`

Those IPC calls end in `dialog.showOpenDialog(...)` inside:

- `electron/ipc/handlers/resourcePacksHandlers.ts`
- `electron/ipc/handlers/shadersHandlers.ts`

By contrast, `src/components/modpacks/ModpackDetails.tsx` routes:

- `addResourcePack` -> `ModpackRouter` -> `AddModPage contentType="resourcepack"`
- `addShader` -> `ModpackRouter` -> `AddModPage contentType="shader"`

Why this falls short:

- the launcher exposes different mental models depending on where the user starts;
- the dashboard path still violates the user's feedback expectation that built-in browsing should be primary;
- the details path has no explicit local-import fallback, so `CONTENT-04` is not satisfied there either.

### Resource-pack management is install-state aware, but not guided enough

`src/components/modpacks/details/ResourcePacksTab.tsx` is good installed-state UI:

- load installed packs;
- enable/disable;
- reorder enabled packs;
- delete;
- show unavailable and empty states.

`electron/services/resourcePacks/resourcePackService.ts` already parses useful metadata:

- `pack.mcmeta` description;
- `pack_format`;
- embedded `pack.png`;
- enabled order from `options.txt`.

But the guided-management gaps are still real:

- `packFormat` is collected but not used anywhere for compatibility hints;
- there is no source or acquisition context, only local file truth;
- contract outcomes are weak: `enable`, `disable`, `reorder`, `import`, `delete`, and `add` mostly return `{ ok: boolean }` or `boolean`;
- `resourcePacks:import` exists in the contract, but the renderer does not use it, while the more visible `resourcePacks:add` combines file picking and copying in one opaque main-process action.

Planning implication:

- resource packs already have enough installed-state truth to support a guided browser;
- Phase 31 should normalize contract semantics before adding more UI polish on top.

### Shader management is runtime-blind today

`src/components/modpacks/details/ShadersTab.tsx` only knows:

- installed shader packs from the `shaderpacks/` folder;
- which file name is written to `optionsshaders.txt`;
- how to activate, disable, or delete a local pack.

`electron/services/shaders/shaderService.ts` reinforces that narrow truth:

- `list()` returns only `fileName`, `name`, and `isActive`;
- `setActiveShader()` writes `shaderPack=<name>` to `optionsshaders.txt`;
- there is no capability or dependency model.

This creates the main `CONTENT-02` gap:

- FMCL cannot currently tell whether the active modpack runtime can actually use shaders;
- setting a shader "active" only means a filename was written, not that OptiFine, Iris, Oculus, or another shader-capable runtime path exists;
- deleting the active shader file does not normalize `optionsshaders.txt`, so stored runtime truth can drift from the rendered list.

There is an important nearby reuse seam, though:

- `src/features/modpacks/hooks/useModpackRuntimeSummary.ts`
- `src/components/sidebar/modpackRuntimeDependencies.ts`

That code can already express:

- config-first runtime authority;
- Forge-vs-not-Forge truth;
- `useOptiFine` requests;
- unsupported OptiFine-version warnings when supported versions are supplied.

Current consumers do not exploit that fully:

- `ModpackDetails.tsx`
- `ModpackDetailsHeader.tsx`
- `SimplePlayDashboard.tsx`

all call `buildModpackRuntimeSummary(...)` without `optiFineVersions`, so the existing warning model is not actually informing shader UX today.

Planning implication:

- the right Phase 31 move is to create a shader capability state on top of existing runtime truth, not to pretend platform search metadata alone can answer compatibility.

### `AddModPage` is the reusable seed, not a finished resource-pack or shader product

`src/components/modpacks/AddModPage.tsx` already does more than its name suggests:

- supports `contentType='mod' | 'resourcepack' | 'shader'`;
- passes `contentType` into `modsIPC.searchMods(...)`;
- uses current modpack metadata/config to seed Minecraft version filters;
- handles race ordering and mixed-success recovery better than the older flows.

`electron/services/mods/platform/modPlatformService.ts` already supports that reuse:

- `searchMods()` maps `contentType` to Modrinth project types and CurseForge class IDs;
- `installModFile()` routes downloads into `mods/`, `resourcepacks/`, or `shaderpacks/` depending on `contentType`.

This is the strongest bounded-expansion seam in the repo.

But it is not ready to be declared "guided content browsing" yet:

- the UI remains mod-centric in several empty, error, and success strings;
- the CurseForge button is disabled and marked WIP, which is actually useful for `CONTENT-05` because it keeps provider scope bounded;
- the route auto-selects `versionsList[0]` and exposes no explicit compatibility explanation;
- there is no explicit local-file fallback CTA inside the route;
- after downloading a resource pack or shader, the route still calls `modpacksIPC.addMod(...)`.

That last point is the biggest implementation-risk seam.

`electron/services/modpacks/modpackService.ts#addMod()` writes entries into `manifest.files` as mod dependencies:

- CurseForge -> `projectID` / `fileID`
- Modrinth -> `projectId` / `versionId`

That is semantically correct for mods, but not for resource packs or shaders. If Phase 31 reuses `AddModPage` without fixing that contract, FMCL will keep polluting modpack manifests with secondary content as if it were runtime-required mod content.

Planning implication:

- Phase 31 must decide explicitly whether resource packs and shaders should update manifests at all;
- the safe default is "no broad manifest semantics change until truth is defined," not "reuse addMod blindly."

### Load failures are productized; acquisition failures are not

The repo already has decent degraded-state work for load failures:

- `ResourcePacksTab` uses `DegradedStateView` for unavailable vs empty;
- `ShadersTab` does the same;
- `AddModPage` can render route-level search failure and mixed-success recovery notices.

The failure contract still falls apart deeper in the stack:

- `resourcePacks:add` and `shaders:add` only return `boolean`;
- copy failures are logged to the console inside handler loops;
- install failures in `AddModPage` only increment `failed++`, so the user gets counts but not actionable reasons;
- shader/resource-pack services do not return structured failure codes for invalid archive, duplicate file, bad destination, incompatible runtime, or manifest-write drift.

Planning implication:

- `CONTENT-03` is not mostly a copy task;
- it requires structured outcome objects across renderer wrappers, handlers, and services.

### Manual proof is still resource-pack heavy and shader-light

The manual harness currently includes:

- a generic `modpack-add` route proof;
- a `resource-packs` proof;
- dense secondary-content resource-pack proof.

It does not yet include:

- a shader-browser proof;
- a guided resource-pack browser proof that uses `AddModPage contentType="resourcepack"`;
- a guided shader browser proof with compatibility states;
- a fallback local-import proof inside the guided route.

`src/verification/manual/mockEnvironment.ts` currently seeds resource-pack fixtures, but no comparable shader fixture data appears in the inspected range.

Planning implication:

- Phase 31 closeout will need new manual scenarios rather than relying on existing resource-pack-only proof.

## Standard Stack

Use the existing stack and ownership seams:

- React + TypeScript + TailwindCSS renderer surfaces
- `ModpackRouter` and `AddModPage` for route-owned add-content UX
- `modsIPC` plus `electron/services/mods/platform/modPlatformService.ts` for remote catalog search/download
- `resourcePacksIPC` / `shadersIPC` plus their feature-local services for installed-state management
- `buildModpackRuntimeSummary()` and `buildRuntimeDependencyState()` for config-first runtime truth
- existing degraded-state grammar via `DegradedStateView`
- existing manual verification harness in `src/verification/manual/*`
- `npx tsc --noEmit`, `npm run contracts:check`, `npm run ipc:check`, `npx eslint src/`, and `npx eslint electron/`

## Architecture Patterns

### 1. One canonical guided-entry path, reused across launcher surfaces

Resource-pack and shader add actions should route through the same in-app browser from both:

- `SimplePlayDashboard`
- `ModpackDetails`

The old file picker should survive only as an explicit fallback inside that route.

### 2. Remote acquisition and installed-state management should stay separate

The clean seam already exists:

- `AddModPage` + `mods/platform` handles remote browsing and downloads;
- `ResourcePacksTab` / `ShadersTab` + their services handle installed-state operations.

Phase 31 should strengthen that separation rather than merging everything into a new broad content subsystem.

### 3. Shader compatibility must be modeled as capability state, not guessed from file presence

The safe UI vocabulary is:

- supported;
- needs setup;
- unsupported;
- unverified.

That is more honest than implying FMCL can definitively validate every shader pack from platform metadata alone.

### 4. Failure handling needs typed outcomes, not boolean success flags

If the renderer is supposed to show actionable recovery, main-process content operations need structured results such as:

- success;
- partial success;
- failure code;
- human-readable fallback message.

Without that, `CONTENT-03` cannot be validated truthfully.

## Don't Hand-Roll

- Do not build a new top-level marketplace, catalog home, or global content hub.
- Do not introduce a new provider-aggregation architecture when the existing Modrinth-backed route already covers the bounded Phase 31 scope.
- Do not expand `ContentManager` into a resource-pack or shader library project unless correctness work is already done; it is currently modpack-manifest and dedupe infrastructure, not a user-facing browsing foundation.
- Do not keep using `modpacksIPC.addMod()` for non-mod content without an explicit manifest decision.
- Do not claim shader compatibility with certainty when the launcher only has partial runtime evidence.

## Common Pitfalls

- Leaving the dashboard/classic surface on `resourcePacks:add` / `shaders:add` and calling the work "guided browsing."
- Treating local import as the primary path and the in-app browser as a secondary nice-to-have.
- Polluting `manifest.json` with resource-pack or shader entries because `AddModPage` still reuses the mod manifest path.
- Assuming `shaderPack=<file>` in `optionsshaders.txt` means shaders are actually usable.
- Adding resource-pack compatibility labels without a reliable pack-format-to-Minecraft mapping.
- Reopening Phase 21/29 layout work by regressing tab density, CTA hierarchy, or the route-owned add-flow scroll contract.

## Safe Wave Breakdown

### Wave 1: Contract normalization and runtime-truth groundwork

Goal:

- normalize resource-pack and shader import/install outcome contracts;
- stop non-mod content from following the mod-manifest path by accident;
- define the minimum shader capability state model before UI polish expands.

Likely files and seams:

- `shared/contracts/resourcePacks.ts`
- `shared/contracts/shaders.ts`
- `shared/contracts/ipcChannels.ts`
- `src/services/ipc/resourcePacksIPC.ts`
- `src/services/ipc/shadersIPC.ts`
- `electron/ipc/handlers/resourcePacksHandlers.ts`
- `electron/ipc/handlers/shadersHandlers.ts`
- `electron/services/resourcePacks/resourcePackService.ts`
- `electron/services/shaders/shaderService.ts`
- `electron/services/modpacks/modpackService.ts`

Regression surfaces:

- resource-pack enable/disable/reorder semantics in `options.txt`
- shader activate/disable/delete semantics in `optionsshaders.txt`
- handler/service path-containment rules from earlier security phases
- manifest export/import truth if the add-content route stops touching `manifest.files`

### Wave 2: Canonical guided browser entry and explicit fallback import

Goal:

- make the in-app guided browser the primary add path on both dashboard and details surfaces;
- keep local `.zip` import as an explicit fallback action inside the route.

Likely files and seams:

- `src/components/SimplePlayDashboard.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/ModpackRouter.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/locales/en.json`
- `src/locales/ru.json`

Regression surfaces:

- Phase 29 add-content layout and async recovery
- Phase 21 details-tab reachability and density
- simple dashboard content-tab composition
- route-primary action ownership

### Wave 3: Compatibility guidance and actionable recovery

Goal:

- add honest shader capability guidance tied to the active runtime;
- add actionable install/import failure explanations;
- add light-touch resource-pack guidance only where the data is trustworthy.

Likely files and seams:

- `src/features/modpacks/hooks/useModpackRuntimeSummary.ts`
- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- possibly `src/services/ipc/modsIPC.ts` and `electron/services/mods/platform/*` if richer version metadata must pass through

Regression surfaces:

- runtime-summary truth tests
- shader active-summary truth after delete/disable/failure
- mixed-success recovery and hidden-selection clearing in `AddModPage`
- any loader/version assumptions reused from mod flows

### Wave 4: Verification closeout and manual proof

Goal:

- make guided resource-pack and shader flows first-class in both automated and manual proof;
- prove the new fallback and compatibility states inside the real shell.

Likely files and seams:

- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx`
- `src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx`
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx`
- `src/features/modpacks/__tests__/runtimeSummary.truth.test.ts`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/views.ts`
- `src/verification/manual/mockEnvironment.ts`

Regression surfaces:

- screenshot-ready manual proof routes
- content-tab consistency between resource packs and shaders
- absence of stale mod-centric copy on non-mod flows

## Validation Architecture

### Static and contract gates

- `npx tsc --noEmit`
- `npx eslint src/`
- `npx eslint electron/`
- `npm run contracts:check`
- `npm run ipc:check`

Use the contract checks whenever Wave 1 changes shared IPC surfaces. This phase is not purely renderer work.

### Existing automated seams to extend instead of replacing

- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx`
- `src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx`
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx`
- `src/features/modpacks/__tests__/runtimeSummary.truth.test.ts`
- existing modpack details layout/density tests that guard tab reachability and route-owned actions

### New automated proof the phase should add

- dashboard and details both route add-resource-pack/add-shader through the same in-app browser instead of invoking the OS file picker as the primary path
- the guided browser shows an explicit local-file fallback action for resource packs and shaders
- resource-pack or shader installs do not silently reuse the mod manifest contract
- shader capability states cover at least supported, needs setup, and unverified or unsupported
- import/download failures surface actionable inline recovery, not only generic counts or console errors
- deleting or failing to activate a shader leaves the rendered active-state summary truthful

### Manual proof the phase should add

- one shell-integrated guided resource-pack browser view
- one shell-integrated guided shader browser view
- one compatibility-focused shader proof with a runtime that needs setup or is unsupported
- one explicit local-file fallback proof inside the guided browser route
- one failed acquisition or install proof that shows recoverable explanation text

The current `resource-packs` manual view should remain as installed-state regression proof, but it is not sufficient as Phase 31 closeout evidence by itself.

## Code Examples

- `src/components/modpacks/AddModPage.tsx`: the reusable route shell for content-type-aware search, selection, infinite scrolling, and mixed-success recovery.
- `src/components/modpacks/details/ResourcePacksTab.tsx`: the installed-state resource-pack management pattern, including reorder semantics and truthful unavailable vs empty handling.
- `src/components/modpacks/details/ShadersTab.tsx`: the installed-state shader management pattern and its current capability blind spot.
- `src/features/modpacks/hooks/useModpackRuntimeSummary.ts`: the config-first runtime authority that should anchor shader guidance instead of per-surface guesses.
- `src/components/sidebar/modpackRuntimeDependencies.ts`: existing OptiFine warning logic that can seed shader capability guidance if the phase actually wires it through.

## Planning Guidance

- Treat `SimplePlayDashboard` and `ModpackDetails` as one user journey with one canonical add-content story.
- Use the existing `AddModPage` and Modrinth-backed search/install plumbing as the Phase 31 backbone; that is the bounded capability increase `CONTENT-05` needs.
- Spend the first planning wave on truth and contracts, because compatibility guidance and actionable failures are impossible to verify if install/import surfaces still return booleans.
- Keep shader guidance honest. If FMCL only knows enough to say "setup required" or "runtime unverified," that is better than a false green state.

## Files Inspected

- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/phases/29-modpack-workflow-simplification-and-runtime-truth/29-RESEARCH.md`
- `docs/ru/product-feedback-2026-04-20.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `src/AGENTS.md`
- `shared/AGENTS.md`
- `electron/AGENTS.md`
- `shared/contracts/resourcePacks.ts`
- `shared/contracts/shaders.ts`
- `shared/contracts/ipcChannels.ts`
- `shared/types/resourcePack.ts`
- `src/services/ipc/resourcePacksIPC.ts`
- `src/services/ipc/shadersIPC.ts`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/ModpackRouter.tsx`
- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx`
- `src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx`
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx`
- `src/features/modpacks/hooks/useModpackRuntimeSummary.ts`
- `src/features/modpacks/__tests__/runtimeSummary.truth.test.ts`
- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `electron/ipc/handlers/resourcePacksHandlers.ts`
- `electron/ipc/handlers/shadersHandlers.ts`
- `electron/services/resourcePacks/resourcePackService.ts`
- `electron/services/shaders/shaderService.ts`
- `electron/services/content/contentManager.ts`
- `electron/services/mods/platform/modPlatformService.ts`
- `electron/services/mods/platform/types.ts`
- `electron/services/modpacks/modpackService.ts`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/views.ts`
- `src/verification/manual/mockEnvironment.ts`
