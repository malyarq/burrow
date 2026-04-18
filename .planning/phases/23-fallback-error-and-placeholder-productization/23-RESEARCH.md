# Phase 23 Research: Fallback, Error, And Placeholder Productization

## What The Planner Needs To Know

Phase 23 starts after three prerequisite layers are already in place:

1. Phase 20 established the brand contract and the neutral media-fallback policy through `LazyImage` and `ArtworkFallback`.
2. Phase 21 established dense-route hierarchy and the shared runtime-summary seam for Minecraft/modloader truth.
3. Phase 22 established theme/locale runtime truth on the milestone-owned redesign surfaces.

That means Phase 23 should not reopen branding, shell geometry, dense IA, or broad theme work. Its job is narrower and more product-critical: make already-shipped surfaces behave truthfully when data is missing, loads fail, dependencies are uncertain, or the renderer crashes.

The biggest current failures are not only "bad copy." Several routes currently misclassify failures as empty states, "no updates," or endless loading. If planning stays at the wording level only, `FALL-02` and `FALL-04` will remain open even if the text looks calmer.

The clean boundary is:

- productize degraded states on existing renderer surfaces;
- introduce shared reusable empty/fallback/crash seams where repetition is already obvious;
- sanitize or map technical error text before it reaches user-facing UI;
- keep fatal crash handling recovery-first and renderer-local.

The phase should explicitly avoid:

- redoing Phase 20 brand decisions or reintroducing launcher-mark hero empties;
- reopening Phase 21 layout/density work except for trivial fit fixes needed by degraded-state components;
- reopening Phase 22 theme/locale architecture beyond consuming its existing tokens and active-language truth;
- broad diagnostics tooling, crash-reporting products, or a repo-wide IPC error-taxonomy rewrite;
- final milestone proof, release docs, or screenshot-regression closeout that belongs to Phase 24.

## Requirement Fit

Phase 23 directly covers:

- `FALL-01`: raw template placeholders, unresolved bindings, and developer-facing debug strings must stop leaking into shipped surfaces;
- `FALL-02`: empty, missing-data, zero-result, and failed-load states must become explicit, calm, and action-oriented instead of collapsing into blanks or toasts;
- `FALL-03`: fatal renderer crashes must land on a user-safe recovery surface instead of raw React internals and duplicated exception text;
- `FALL-04`: dependency, availability, and incomplete-data states must stay conservative and explicit rather than optimistic or silent.

Practical boundary by workstream:

- shared degraded-state primitives plus technical-string sanitization are the `FALL-01` foundation;
- route-level empty/zero-result/failed-load adoption is the main `FALL-02` workstream;
- `ErrorBoundary` productization is the `FALL-03` workstream;
- dependency/update/import/share/runtime ambiguity handling is the `FALL-04` workstream.

## Current Baseline

### The fatal crash seam is narrow, but the current surface is still raw and duplicated

The crash path is centralized in the right place:

- `src/components/ErrorBoundary.tsx`
- `src/components/ErrorBoundaryWrapper.tsx`
- `src/main.tsx`
- `src/App.tsx`

But the rendered experience is still the exact anti-goal from the screenshot audit:

- `ErrorBoundary` shows `error.toString()` and the full `error.stack` by default inside the main card;
- the copy button copies `Error: ...` plus `Stack: ...` verbatim;
- the primary recovery action is still `window.location.reload()`, which is acceptable as behavior but not productized as a recovery-first flow;
- the boundary is mounted twice: once outside providers in `main.tsx` and again through `ErrorBoundaryWrapper` inside the settings context.

Planning implications:

- Phase 23 should probably keep one shared fatal-error view component and let both boundary mounts use it;
- the outer boundary cannot rely on `useSettings()`, so localized crash copy will need either a pre-provider translator seam or a bounded `settings_language` read from storage;
- the default crash surface should hide technical details behind a disclosure or copy action instead of rendering raw stack text inline.

### Empty and degraded state UI already exists, but it is route-local and inconsistent

Most milestone-owned surfaces already render some empty-state UI:

- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/features/screenshots/components/ScreenshotsTab.tsx`
- `src/features/settings/statistics/StatisticsTab.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/components/modpacks/details/WorldsTab.tsx`
- `src/components/modpacks/details/WorldDatapacksModal.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`

The good news is that Phase 23 is not starting from zero:

- many EN/RU empty-state strings already exist in `src/locales/en.json` and `src/locales/ru.json`;
- `ScreenshotsTab` is already close to the desired posture: explicit title, short explanation, and one clear next step;
- resource pack, shader, world, and datapack tabs already use calm card-based empties instead of giant warning panels.

The important constraint is that the one existing shared empty-state component is the wrong baseline for this phase:

- `src/components/layout/EmptyStateView.tsx` is currently unused;
- it intentionally renders a large `BrandMark`, `BrandWordmark`, accent glow, and strong brand framing;
- `src/components/layout/__tests__/EmptyStateView.branding.test.tsx` explicitly protects that brand contract.

Planning implication:

- Phase 23 should not repurpose `EmptyStateView` into a calm degraded-state primitive;
- it should introduce a new reusable empty/fallback component or component family that can stay quieter and more action-oriented without reopening Phase 20 brand decisions.

### Several surfaces still collapse real failures into empty or loading states

This is the most important implementation fact for planning.

Current failure-modeling gaps:

- `src/components/modpacks/ModpackBrowser.tsx` catches search failures, clears the results array, and then renders either `No modpacks found` or `Loading popular modpacks...`. A backend or network failure is therefore indistinguishable from a genuine zero-result state.
- `src/components/modpacks/ModpackList.tsx` catches list-load failures, sets `modpacks` to `[]`, and then renders the same empty state used for a truly empty library.
- `src/features/screenshots/components/ScreenshotsTab.tsx` toasts `screenshots.loadError`, but because `screenshots` stays `[]`, the route still falls through to the normal `No screenshots yet` surface.
- `src/components/modpacks/details/ResourcePacksTab.tsx`, `ShadersTab.tsx`, `WorldsTab.tsx`, and `WorldDatapacksModal.tsx` follow the same pattern: toast on load failure, then render the normal empty-state card because the list state remains empty.
- `src/features/settings/statistics/StatisticsTab.tsx` is worse: `getStats()` failure only logs to `console.error`, never stores an error state, and leaves `stats === null`, which means the tab stays on its loading spinner forever.
- `src/components/modpacks/ModpackUpdateModal.tsx` catches version-load failure but only logs it; `versions.length === 0` then renders `No updates available`, which is actively misleading.

Planning implication:

- Phase 23 needs an explicit async-state contract on degraded surfaces, even if it is small and route-local: `loading`, `ready`, `empty`, `zero-results`, `error`, and optionally `unavailable`;
- toasts can remain secondary, but they cannot be the only truthful signal;
- this is the real `FALL-02`/`FALL-04` seam, not just copy polish.

### Technical strings still leak into user-facing UI through shared paths

There are at least three recurring technical-string leak paths.

1. renderer IPC wrappers preserve technical prefixes

- `src/services/ipc/ipcError.ts` converts failures into `[namespace] method failed: ...`;
- wrappers such as `src/services/ipc/shareIPC.ts` rethrow those errors.

2. several UI surfaces render `err.message` directly

- `src/features/share/ShareModal.tsx`
- `src/features/share/ImportShareModal.tsx`
- `src/components/modpacks/ImportModpackPreviewPage.tsx`

Those surfaces can therefore render developer-ish wrapper text directly inside user UI.

3. some product surfaces still trust raw remote or runtime strings

- `src/components/modpacks/AddModModal.tsx` and `src/components/modpacks/AddModPage.tsx` render remote `version.name` directly, which is the most likely seam for the screenshot-backed `${file.jarVersion}` leak;
- `src/components/modpacks/ModpackUpdateModal.tsx` still uses a mixed-language placeholder contract via `modpacks.changelog_placeholder`, and `src/locales/ru.json` currently contains `Changelog будет загружен...`;
- `src/features/launcher/hooks/useLauncher.ts` and `useLauncherIPC.ts` still append technical `[SYSTEM]` and `Error: ...` strings into the visible launch status/log flow.

Planning implication:

- Phase 23 needs one shared display-error and suspicious-placeholder policy for phase-owned surfaces;
- it should not try to rewrite every inline `t(...) || '...'` fallback in the repo, but it should remove raw `err.message` rendering and suspicious templated values from the degraded-state paths this phase touches.

### Dependency truth already has a good seam, but it still lacks an explicit "unknown" or "unverified" state

Phase 21 already established a strong base:

- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `src/components/sidebar/ModpackDependencySummary.tsx`
- `src/components/modpacks/details/ModpackDetailsSettingsTab.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`

Current strengths:

- runtime summary for create and edit flows is already shared;
- dependency status inside `ModpackDetailsModsTab` distinguishes `missing`, `incompatible`, `installed`, and `provided`;
- tests already exist for runtime-provided and runtime-incompatible dependency copy.

Current gap:

- once data is present, the UI is truthful, but there is no explicit state for "runtime truth could not be proven" or "supporting data failed to load";
- list-based content surfaces often hide a failed load behind empty;
- update/changelog surfaces often treat unknown as absent;
- the runtime summary seam only models OptiFine warnings, not incomplete proof states.

Planning implication:

- Phase 23 should extend the existing dependency-truth seam conservatively instead of rewriting it;
- the planner should bias toward explicit `unknown`, `unavailable`, or `couldn't verify` states when data fetches fail or are incomplete, especially on update and dependency surfaces;
- it should not reopen Phase 21's basic loader/version summary architecture.

### Phase 20 and Phase 22 constraints are already settled and should stay settled

Two existing shared seams should be treated as fixed constraints:

- `src/components/ui/LazyImage.tsx`
- `src/components/ui/ArtworkFallback.tsx`

These already encode the Phase 20 fallback-art policy. Phase 23 should reuse them, not replace them with launcher-logo or app-icon empties.

Likewise, Phase 22 already owns theme and active-locale truth. Phase 23 degraded states need to consume current tokens and locale files, not invent their own dark/light or EN/RU behavior. That is especially important for the outer crash boundary because it currently sits outside `SettingsProvider`.

## Existing Verification Base

There is already enough validation surface to avoid inventing a new test harness.

Useful existing tests:

- `src/components/layout/__tests__/EmptyStateView.branding.test.tsx` proves the current brand-owned empty component is intentionally logo-forward and should not be silently reused as the Phase 23 degraded-state primitive.
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` already covers runtime-provided dependency truth plus readable secondary-content summaries.
- `src/components/modpacks/__tests__/CreateModpackDependencies.test.tsx` and `ModpackDetailsSettings.summary.test.tsx` already protect the shared Phase 21 runtime-summary seam.
- `src/features/screenshots/components/__tests__/ScreenshotsExperience.test.tsx` already covers the screenshot empty state and its explicit open-folder action.
- `src/features/share/__tests__/ShareFlows.test.tsx` already covers inline share/import failure rendering through the typed IPC seam.
- `src/features/settings/statistics/__tests__/StatisticsTab.test.tsx` already covers the happy path and export flow for statistics.
- `src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx` covers the happy-path preview surfaces.

Existing manual proof seam:

- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`

Relevant existing manual views already exist for:

- `modpack-list`
- `modpack-browser`
- `modpack-details`
- `resource-packs`
- `share`
- `screenshots`
- `utilities`
- `content`

Key gaps:

- no tests for `ErrorBoundary` behavior or a recovery-first crash surface;
- no tests that distinguish failed-load from empty on browser/list/screenshots/resource-pack/shader/world/datapack surfaces;
- no test for the statistics load-failure path, which currently becomes endless loading;
- no test for `ModpackUpdateModal` differentiating "no updates" from "failed to load versions";
- no test for placeholder sanitization on remote values such as suspicious template strings;
- current share-flow tests explicitly accept raw backend messages inline, so they will need updating if Phase 23 maps technical errors to calmer product copy;
- no dedicated Phase 23 manual degraded-state views exist yet, although the harness can be extended without building a second proof system.

## Brownfield-Safe Sequencing

### 1. Define the degraded-state contract before touching many routes

If Phase 23 starts by rewriting copy inside individual screens, the repo will keep a dozen near-duplicate empty/error surfaces and still fail `FALL-02` on the next newly touched route.

The first step should define:

- what a calm inline unavailable state looks like;
- what a card-level empty or zero-result state looks like;
- when a surface shows an action button versus just explanatory copy;
- how technical errors are mapped or sanitized before display.

### 2. Fix async state modeling before visual polish

The largest current regressions are caused by missing state distinctions, not styling:

- failed load masquerading as empty;
- failed fetch masquerading as no updates;
- failed stats load masquerading as loading forever.

If the plan starts from visuals first, these logic bugs will survive behind prettier cards.

### 3. Keep crash handling focused on recovery, not a diagnostics feature

The planner should resist broad crash-reporting ambitions. Phase 23 only needs:

- a safe default crash card;
- restart as the primary action;
- optional details/copy as a secondary action;
- enough implementation structure that both boundary mounts can reuse the same surface.

### 4. Extend dependency truth conservatively, not optimistically

When proof is incomplete, the UI should say so. Do not add new inferred "healthy" states just to keep surfaces quiet. Phase 23 should prefer calm explicit ambiguity over silent optimism.

## Planning Risks

- Reusing `EmptyStateView` will reopen Phase 20 branding scope and fight its existing brand-contract test instead of helping Phase 23.
- Treating load failures as toast-only problems will leave the core degraded-state bug intact, because the visible surface will still look like a normal empty state.
- Trying to clean every inline fallback string in `src/` will turn Phase 23 into a repo-wide localization sweep rather than a bounded degraded-state phase.
- Turning crash work into diagnostics plumbing or telemetry will violate the milestone's explicit out-of-scope line.
- Modifying `LazyImage` or `ArtworkFallback` as part of empty-state work risks reopening the already-shipped fallback-art policy from Phase 20.

## Recommended Plan Shape

The cleanest Phase 23 decomposition is four plans.

### `23-01` Shared degraded-state primitives, copy rules, and sanitization seams

Own:

- a new calm degraded-state component family under `src/components/layout/` or `src/components/ui/`
- localized copy additions in `src/locales/en.json` and `src/locales/ru.json`
- a small shared helper for mapping technical errors and suspicious placeholder text into user-safe copy
- any minimal helper needed so the outer crash boundary can resolve active-language fallback copy without `SettingsProvider`

Goal:

- establish one reusable contract for empty, zero-result, unavailable, and inline failure states;
- stop phase-owned surfaces from rendering raw IPC prefixes, template placeholders, or mixed-language fallback copy.

Requirements:

- `FALL-01`
- foundation for `FALL-02`
- foundation for `FALL-03`

### `23-02` Route adoption for empty, zero-result, and failed-load states

Own:

- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `src/features/screenshots/components/ScreenshotsTab.tsx`
- `src/features/settings/statistics/StatisticsTab.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/components/modpacks/details/WorldsTab.tsx`
- `src/components/modpacks/details/WorldDatapacksModal.tsx`

Goal:

- distinguish `loading`, `empty library`, `zero results`, and `failed to load`;
- pair each empty or zero-result state with one contextual next step when the surface benefits from it;
- stop toasts from being the only truthful degraded signal.

Requirements:

- `FALL-02`
- part of `FALL-04`

### `23-03` Recovery-first fatal crash surface

Own:

- `src/components/ErrorBoundary.tsx`
- `src/components/ErrorBoundaryWrapper.tsx`
- `src/main.tsx`
- `src/App.tsx`

Goal:

- replace the raw React crash dump with a recovery-first surface;
- keep restart primary;
- keep technical details hidden by default and available only as a secondary affordance;
- make the same crash surface work both inside and outside the settings provider.

Requirements:

- `FALL-03`
- part of `FALL-01`

### `23-04` Dependency truth, update truth, and placeholder cleanup on high-risk flows

Own:

- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `src/components/sidebar/ModpackDependencySummary.tsx` only if conservative unknown-state support is required
- `src/components/modpacks/ModpackUpdateModal.tsx`
- `src/components/modpacks/AddModModal.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/features/share/ShareModal.tsx`
- `src/features/share/ImportShareModal.tsx`
- `src/components/modpacks/ImportModpackPreviewPage.tsx`
- `src/features/launcher/hooks/useLauncher.ts` and `useLauncherIPC.ts` only for user-visible degraded copy, not a launch-state redesign

Goal:

- stop raw placeholder and wrapper-error leakage on the most visible degraded flows;
- distinguish "no updates", "no changelog", "failed to load updates", and "could not verify runtime/dependency truth";
- keep dependency surfaces conservative when proof is incomplete.

Requirements:

- `FALL-01`
- `FALL-04`

Recommended wave map:

- Wave 1: `23-01`
- Wave 2: `23-02` and `23-03`
- Wave 3: `23-04`

## Validation Architecture

Phase 23 can stay inside the existing Vitest + jsdom stack plus the current manual verification shell. Phase 24 should still own final release-proof and screenshot coverage, but Phase 23 needs enough direct regression coverage that degraded states do not revert immediately.

### Layer 1: shared degraded-state contract tests

Add focused tests for the new shared degraded-state primitives and helpers so the phase proves:

- empty, zero-result, inline unavailable, and error variants render distinct titles, body copy, and optional actions;
- suspicious templated strings or technical IPC prefixes are sanitized or mapped before display;
- localized copy works in both EN and RU for the new shared degraded-state keys;
- the crash surface keeps details hidden by default.

This layer should cover the new shared component/helper seam directly.

### Layer 2: route-level async-state tests

Add narrow route tests proving that representative surfaces distinguish `error` from `empty`:

- browser search failure does not render the normal zero-result state;
- installed modpack load failure does not render the normal `No modpacks` surface;
- screenshots/resource packs/shaders/worlds/datapacks load failure does not collapse into the normal empty card;
- statistics failure does not loop forever on the loading spinner;
- update modal failure does not claim there are no updates.

This is the core regression layer for `FALL-02` and the visibility half of `FALL-04`.

### Layer 3: dependency and placeholder truth tests

Extend existing modpack/detail/share tests so the phase proves:

- runtime and dependency surfaces can express `provided`, `incompatible`, `missing`, and any new conservative unknown/unverified state without contradiction;
- remote placeholder-like values do not leak unchanged into visible version or changelog fields;
- share/import surfaces render user-safe inline failures rather than raw wrapper or backend messages.

The existing tests around `SecondaryContentTabs`, share flows, and runtime summaries are the right starting point.

### Layer 4: crash and manual proof integration

Phase 23 should add targeted crash and degraded-state proof, but only through the existing harness:

- a dedicated crash-state test for `ErrorBoundary`;
- at most a small number of new manual fixtures or degraded variants on existing views such as `share`, `screenshots`, `utilities`, `content`, `modpack-browser`, and `modpack-details`;
- no new verification harness parallel to `manual-verification.html`.

Closeout gate for the phase should remain focused:

- targeted Vitest regression suite for touched degraded-state surfaces;
- `npx tsc --noEmit`;
- `npx eslint src/`.

## Planner Guidance

- Treat failed-load versus empty as a first-class modeling problem, not a wording problem.
- Prefer a new calm degraded-state component over reusing the existing brand-owned `EmptyStateView`.
- Keep `LazyImage` and `ArtworkFallback` unchanged unless a Phase 23 surface truly needs a smaller integration fix.
- Use shared sanitization and error-mapping helpers for phase-owned flows instead of rendering raw `err.message`.
- Keep crash handling renderer-local and recovery-first; do not expand into telemetry or diagnostics product scope.
- Extend the Phase 21 dependency-summary seam conservatively rather than replacing it with a new source of runtime truth.
