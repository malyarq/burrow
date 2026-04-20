# Phase 28 Research: Product Restraint And Native Shell Truth

## What The Planner Needs To Know

Phase 28 is the first execution phase of `v0.6.0`, and it should stay narrower than the surrounding feedback might suggest. The phase is not a general shell redesign, not a modpack IA cleanup, and not a settings overhaul. Its job is to remove the remaining top-level launcher weirdness that breaks trust before deeper workflow cleanup starts:

1. stop macOS from feeling like FMCL is layering custom chrome over native chrome;
2. remove loud or redundant launcher identity from top-level shell surfaces that do not need it;
3. keep modpack update visibility local to modpack surfaces instead of shell-level urgency;
4. make reopened launcher state read from persisted truth instead of visible fallback defaults.

The planner should treat earlier milestone work as inherited, not reopened:

- Phase 19 already established the shell-safe-area and shell-versus-route CTA ownership seams. Phase 28 should reuse those seams, not re-litigate dense route geometry.
- Phase 20 and Phase 23 already separated `app-icon`, `product-mark`, and neutral `media-fallback` artwork. Phase 28 should not rewrite the fallback system. It should trim top-level brand noise on critical shell surfaces.
- Phase 21/29-style runtime-summary unification is still a broader modpack truth problem. Phase 28 only owns the reopened shell/runtime lie that the user sees immediately after open or restart.
- Phase 30 owns settings truth and geometry consistency. Phase 28 may remove shell-noise branding from settings, but it should not absorb the full settings cleanup.

One planning nuance matters: the newer product feedback from `2026-04-20` should override older fallback assumptions from the `2026-04-14` audit where they conflict. The audit pushed the repo toward more explicit branded placeholders; the newer feedback explicitly rejects loud branding on fallback and top-level shell surfaces. Phase 28 should follow the newer product direction.

## Requirement Fit

### `SHELL-05`

This requirement is owned by the main-process and renderer shell contract together:

- `electron/window/windowManager.ts`
- `src/components/TitleBar.tsx`
- `src/components/AppLayout.tsx`
- `src/services/ipc/windowControlsIPC.ts`
- `electron/ipc/handlers/windowHandlers.ts`

The likely implementation boundary is platform-conditional shell behavior:

- native-first main-window chrome behavior on macOS;
- no competing right-side custom window controls on macOS;
- renderer safe-area and notification placement that still clears shell chrome without reintroducing route-local padding hacks.

Out of scope:

- console-window behavior in `createConsoleWindow()`;
- Windows/Linux shell redesign beyond whatever shared cleanup naturally falls out of making macOS truthful.

### `SHELL-06`

This requirement is mainly renderer-shell restraint work:

- `src/components/sidebar/SidebarHeader.tsx`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/TitleBar.tsx`

Supporting seams already exist and should mostly be reused rather than rewritten:

- `src/app/assets/branding.ts`
- `src/components/ui/ArtworkFallback.tsx`
- `src/components/layout/DegradedStateView.tsx`

The actual Phase 28 question is not “how do we redesign FMCL branding?” It is “which top-level shell surfaces are still louder than the product needs?” The likely targets are:

- the sidebar header lockup and build block;
- the Classic/Simple Play hero treatment;
- the settings appearance brand explainer card.

Out of scope:

- broad asset replacement;
- deeper fallback/error productization already covered by Phase 23;
- content-tab visual unification and dense route polish.

### `SHELL-07`

The update-signal seam is already shared and reasonably bounded:

- `src/features/modpacks/hooks/useModpackUpdates.ts`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsActions.tsx`
- `src/components/modpacks/ModpackUpdateModal.tsx`

Current code already keeps update signals off persistent shell chrome:

- list-level per-card badge in `ModpackList`;
- detail-level review notice and modal in `ModpackDetails`.

That means Phase 28 should preserve locality and avoid scope drift. The main planner goal is to lock the rule:

- update visibility belongs on modpack list/detail surfaces only;
- no launcher-home, sidebar, or app-shell update urgency layer;
- launch remains the primary intent even when an update exists.

Out of scope:

- modpack card density simplification;
- details-page tab hierarchy cleanup;
- update-modal redesign beyond what is required to keep the signal calm and local.

### `SHELL-08`

This requirement is a startup and persistence-truth problem, not a new persistence-system problem. The relevant seams are:

- `src/contexts/ModpackContext.tsx`
- `src/contexts/instances/hooks/useInstanceBootstrap.ts`
- `src/contexts/instances/services/instancesService.ts`
- `src/contexts/instances/services/legacySeed.ts`
- `src/features/launch/hooks/useLaunchState.ts`
- `src/App.tsx`
- `electron/services/instances/indexStore.ts`
- `electron/services/instances/configStore.ts`
- `electron/services/instances/instanceService.ts`

Persisted truth already exists:

- selected modpack is file-backed through `selectedModpack`;
- per-modpack runtime/modloader is file-backed through config files;
- shell mode and root path are already persisted through settings.

The current risk is visible fallback truth, not absence of storage:

- Classic mode relies on async loading of hidden `classic` config;
- multiple paths still fall back to `1.12.2` and `vanilla`;
- legacy bootstrap hardcodes `1.12.2`/`vanilla` when migrating old state;
- top-level reopened shell surfaces can therefore show a stale default before real config truth arrives.

Out of scope:

- full metadata-vs-config runtime-summary unification across list, details, filters, and add-content flows. That is a larger Phase 29 problem.

## Current Hotspots And Why They Matter

### macOS shell behavior is a hybrid contract spread across Electron and renderer

`electron/window/windowManager.ts` creates the main window with `frame: false` on every platform and switches `titleBarStyle` to `'hiddenInset'` on macOS. At the same time, `src/components/TitleBar.tsx` still renders a renderer-owned drag strip on macOS, and `src/components/AppLayout.tsx` always mounts the title-bar seam above notifications and the shell safe area.

That means macOS behavior is currently a hybrid:

- native traffic lights and native expectations are controlled in Electron;
- shell clearance and drag behavior are still controlled in the renderer.

This is the highest-risk seam for `SHELL-05` because renderer tests currently prove only that the macOS branch hides custom buttons and branding. They do not prove the actual `BrowserWindow` chrome contract in a real macOS window. The planner should expect one main-process pass plus one renderer pass, not a renderer-only fix.

### top-level launcher identity is still louder than the feedback allows

The repo already has a healthy asset split:

- `app-icon` is canonicalized to `icon.ico`;
- `product-mark` is separate;
- `media-fallback` is neutral and already used by `ArtworkFallback`.

That means the main problem is not the asset system. The problem is where deliberate launcher identity is still being overused at the shell level:

- `src/components/sidebar/SidebarHeader.tsx` keeps a full `BrandLockup` plus build label in the sidebar header, which matches the feedback about the square logo block and truncated launcher name.
- `src/components/SimplePlayDashboard.tsx` still treats Classic mode as a large branded hero surface with a clickable icon, wordmark, glow, and easter-egg behavior. That is a likely match for “top-level launcher noise.”
- `src/components/settings/tabs/AppearanceTab.tsx` includes a dedicated “Shared launcher brand” explainer card that the new feedback explicitly calls unnecessary.

The key restraint insight is:

- keep deliberate identity where the platform expects an app identity surface;
- stop using brand promo blocks as filler in shell-level product surfaces.

### the neutral fallback pipeline is mostly correct already, so Phase 28 should not reopen it

`src/components/ui/ArtworkFallback.tsx`, `src/components/ui/LazyImage.tsx`, and `src/components/layout/DegradedStateView.tsx` already encode a calmer fallback/error posture:

- remote or missing content defaults to neutral `media-fallback`;
- degraded-state cards are not logo-forward;
- `EmptyStateView` is branded but appears effectively dormant.

That matters because Phase 28 should not burn time redoing fallback primitives. The planner should focus only on the remaining top-level surfaces that still use branding as noise rather than as identity.

### modpack update locality is structurally close to correct, but the rule needs to stay explicit

The update check path is shared in `useModpackUpdates`, but surfacing is still duplicated by surface:

- `ModpackList` batches update checks and renders per-card “Update available” badges;
- `ModpackDetails` resolves update info again and renders a local review notice plus `ModpackUpdateModal`;
- the shell sidebar does not show update status.

This is good news for Phase 28. The code already reflects the product rule better than the feedback implies. The planning risk is scope creep:

- do not invent a global app-level update store;
- do not add a launcher-home summary banner;
- do not turn the detail-level review notice into a second primary action.

The work here is likely rule-hardening, copy/weight calibration, and tests that prevent regression back to shell-level urgency.

### reopened truth is persisted, but the shell still leaks fallback defaults before or during hydration

Selected modpack and runtime state are not session-only:

- `selectedModpack` is persisted in the main-process index;
- modpack config files persist Minecraft version and modloader;
- settings persist `uiMode` and root path.

The real issue is that startup truth is visibly split:

- `src/features/launch/hooks/useLaunchState.ts` falls back to `1.12.2` and `vanilla` when config is not yet present;
- `src/App.tsx` also falls back to `1.12.2` when building current hint state;
- `src/contexts/instances/services/legacySeed.ts`, `electron/services/instances/indexStore.ts`, `electron/services/instances/configStore.ts`, and `electron/services/instances/instanceService.ts` all encode the same `1.12.2`/`vanilla` fallback.

This creates two distinct failure modes that the planner should separate:

1. a hydration-time lie, where the shell renders `1.12.2`/`vanilla` before the persisted `classic` config or selected config is loaded;
2. a migration-time lie, where older localStorage-based installs are bootstrapped into a hardcoded `1.12.2`/`vanilla` state.

The first one is the direct `SHELL-08` bug visible on reopen. The second is a legacy upgrade trap that can keep generating the same lie on future machines.

### metadata and config disagree on runtime details, but that must stay tightly bounded here

There is a deeper truth split in the modpack stack:

- details and add-content flows tend to read live config;
- list and filters often read metadata;
- `electron/services/modpacks/modpackService.ts` only syncs `metadata.minecraftVersion` on save, not `metadata.modLoader`.

That means global list/detail runtime truth is not fully authoritative yet. The planner must be careful here:

- Phase 28 may fix any top-level reopened shell lie that depends on this split;
- Phase 28 should not absorb full metadata/config authority unification across the modpack UX.

That broader runtime-summary cleanup belongs with Phase 29.

### the current verification seam can help, but it does not prove the two hardest truths yet

The manual harness already has useful shell-integrated views:

- `dashboard`
- `modpack-list`
- `modpack-details`
- `settings-appearance`

But it still has two proof gaps:

1. it cannot prove native macOS chrome correctness inside a real Electron `BrowserWindow`;
2. it does not have an explicit reopen/restart truth scenario that verifies persisted shell/runtime state after quit and relaunch.

That means Phase 28 validation must include both browser-backed proof reuse and one real-app manual checklist.

## Suggested Planner Wave Split And File Ownership Boundaries

The cleanest Phase 28 shape is four execution waves with narrow ownership.

### `28-01` Native macOS shell contract

Own:

- `electron/window/windowManager.ts`
- `src/components/TitleBar.tsx`
- `src/components/AppLayout.tsx`
- `src/services/ipc/windowControlsIPC.ts` only if platform gating must change
- renderer shell tests that encode titlebar/safe-area order

Goal:

- make macOS behave native-first;
- remove any renderer chrome that competes with traffic lights;
- keep notifications and safe-area ordering truthful under the new shell contract.

Do not absorb:

- sidebar cleanup;
- modpack updates;
- runtime persistence work.

### `28-02` Top-level restraint and shell identity cleanup

Own:

- `src/components/sidebar/SidebarHeader.tsx`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- tests that currently lock in louder top-level branding behavior

Goal:

- remove or reduce brand blocks that do not help orientation;
- keep one restrained app identity on critical shell surfaces;
- preserve the existing neutral fallback pipeline.

Do not absorb:

- global brand/token redesign;
- generic fallback/error component work;
- Phase 30 settings geometry cleanup.

### `28-03` Local-only modpack update visibility

Own:

- `src/features/modpacks/hooks/useModpackUpdates.ts`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsActions.tsx`
- `src/components/modpacks/ModpackUpdateModal.tsx`
- update-visibility tests

Goal:

- keep update signals on list/detail surfaces only;
- keep launch primary;
- prevent regression into shell-level or launcher-home urgency.

Do not absorb:

- modpack card simplification;
- details-page density fixes;
- install/update flow redesign.

### `28-04` Reopen/runtime truth at startup

Own:

- `src/contexts/ModpackContext.tsx`
- `src/contexts/instances/hooks/useInstanceBootstrap.ts`
- `src/contexts/instances/services/instancesService.ts`
- `src/contexts/instances/services/legacySeed.ts`
- `src/features/launch/hooks/useLaunchState.ts`
- `src/App.tsx`
- `electron/services/instances/indexStore.ts`
- `electron/services/instances/configStore.ts`
- `electron/services/instances/instanceService.ts`
- only the minimum metadata-sync fallout that affects reopened shell truth

Goal:

- stop visible `1.12.2`/`vanilla` fallback lies on reopen;
- ensure selected modpack/classic runtime is loaded before shell surfaces claim a value;
- preserve existing file-backed persistence instead of inventing another store.

Do not absorb:

- full metadata/config runtime-authority unification across all modpack surfaces;
- Phase 29 loader/version summary cleanup;
- unrelated launcher-flow validation changes.

## Validation Architecture

### 1. Automated coverage should prove platform branching, restraint, locality, and startup truth separately

`SHELL-05` needs both renderer and main-process assertions:

- update existing renderer tests around `TitleBar`, `AppLayout`, and `UpdateNotification` so macOS-safe-area behavior is still encoded after the shell change;
- add a focused main-process test for `createMainWindow()` on `darwin` so the actual `BrowserWindow` chrome branch is asserted, not just the renderer drag strip.

`SHELL-06` should be protected with narrow shell-surface tests:

- add or update tests for `SidebarHeader` so the sidebar no longer depends on a large launcher lockup or truncated wordmark for orientation;
- update `SimplePlayDashboard` tests so Classic mode still has a clear top surface without requiring a loud branded hero fallback;
- update `AppearanceTab` tests so settings no longer depend on the dedicated brand explainer card if that surface is removed or demoted.

`SHELL-07` should be locked with positive and negative assertions:

- positive: list cards can show a calm update badge, and details can show a local review notice/modal;
- negative: `AppLayout`, `Sidebar`, and `SimplePlayDashboard` must not render modpack update urgency.

Existing test seams already help:

- `src/components/__tests__/UpdateNotification.layout.test.tsx`
- `src/components/__tests__/TitleBar.branding.test.tsx`
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetails.actions.test.tsx`
- `src/components/modpacks/__tests__/ModpackUpdateModal.degraded-state.test.tsx`

`SHELL-08` needs new persistence-focused coverage rather than more visual-only tests:

- add a startup/bootstrap test around the modpack provider path so persisted selected state is hydrated before top-level shell/runtime labels claim a default;
- add a focused test for legacy migration so old localStorage bootstrap does not silently force `1.12.2`/`vanilla` when better persisted truth exists or can be derived;
- add a config-save/reload test around classic runtime or selected modpack startup so reopen truth is verified across real persisted files, not only in-memory state.

The most relevant existing seams are:

- `electron/services/instances/__tests__/instanceMetadataCrud.test.ts`
- `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetailsSettings.summary.test.tsx`

### 2. Manual browser-backed proof should reuse the real shell views instead of inventing a new harness

Phase 28 does not need a fresh verification app. It should extend the existing manual seam in:

- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/mockEnvironment.ts`

The minimum useful Phase 28 proof set is:

1. a launcher-home/dashboard view that shows the restrained top-level shell without loud fallback branding;
2. a settings-appearance view that proves the brand promo block is gone or demoted;
3. a modpack-list view that shows update availability only as a per-card local signal;
4. a modpack-details view that shows local review/update affordance without taking over the route or shell.

If the planner wants milestone-owned named views for later closeout, Phase 28 should add them here rather than inventing another verification seam.

### 3. Native macOS shell behavior must be validated in a real Electron app, not only in the browser harness

The browser harness cannot prove:

- traffic-light clearance;
- absence of competing right-side window controls;
- native drag behavior in the actual `BrowserWindow`.

So `28-VALIDATION.md` should include one explicit real-app macOS checklist:

1. launch FMCL on macOS;
2. confirm native traffic lights are visible and unobstructed;
3. confirm there is no competing custom minimize/close group on the right;
4. confirm the app-update banner still sits below shell chrome instead of overlaying it;
5. confirm the window still drags as expected.

### 4. Reopen truth needs a quit-and-relaunch checklist, not just a route screenshot

`SHELL-08` is only partially provable from mounted fixture state. The validation plan should include a real persistence walkthrough:

1. switch to Classic mode;
2. choose a non-default Minecraft version and non-vanilla loader;
3. switch to Modpacks mode and select a non-default installed pack;
4. quit the app completely;
5. relaunch the app;
6. verify shell mode, selected pack, visible version, and visible loader all match persisted truth before any corrective interaction.

If a browser-backed simulation is added in the manual harness, it should be treated as a supplement. The ship-grade proof is the real restart walkthrough.
