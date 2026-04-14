# Phase 13 Research: Launch Trust And Modpack Workflow Ergonomics

## What The Planner Needs To Know

Phase 13 is the first `v0.3.0` phase that should change moment-to-moment product behavior instead of mostly fixing structural UI truth. The user complaints behind it are not about cosmetics anymore. They are about trust during active workflows:

1. the launcher looks frozen or vague while Minecraft is preparing or downloading;
2. modpack creation hides or misstates required runtime dependencies;
3. browsing remote modpacks still feels scan-heavy and awkward on real window sizes;
4. installed modpack cards still make common actions feel heavier than they should.

The phase boundary should therefore stay narrow and behavioral:

1. model explicit launch stages and busy-state feedback on the main play surface;
2. make create-modpack dependencies truthful and visible;
3. improve remote modpack browsing for scanning, filtering, paging, and density;
4. tighten installed-card quick flows without reopening the whole modpack system;
5. close on focused UX-trust verification, not on release docs or milestone-wide walkthroughs.

The planner should explicitly avoid absorbing:

- a dedicated global activity center for every background task;
- full feature parity with other launchers;
- a new router or navigation architecture;
- packaging or release-truth work reserved for Phase 14;
- broad CurseForge enablement if the repo still treats that path as unavailable.

## Requirement Fit

This phase directly covers:

- `LAUNCH-01`: user can tell whether FMCL is preparing, downloading, launching, waiting, failed, or already running
- `LAUNCH-02`: user cannot spam conflicting launch actions while FMCL is busy, and failures remain actionable
- `MPUX-01`: create-modpack flow shows required runtime dependencies truthfully
- `MPUX-02`: remote modpack browsing becomes clearer to scan and filter on common window sizes
- `MPUX-03`: installed modpack cards expose stable, lower-friction quick actions

This phase should intentionally not claim:

- `VER-01`
- `DOC-01`
- any new v2 parity requirement such as a dedicated activity center or broader launcher layout personalization

## Current Baseline

### Launch state is still modeled as one boolean plus a generic status string

The renderer launch seam is centered on:

- `src/features/launcher/hooks/useLauncher.ts`
- `src/features/launcher/hooks/useLauncherIPC.ts`
- `src/features/launcher/hooks/useLauncherState.ts`
- `src/components/sidebar/LaunchControls.tsx`
- `src/components/Sidebar.tsx`
- `src/components/SimplePlayDashboard.tsx`

Today the user-facing model is too shallow:

- `useLauncherState()` stores only `isLaunching`, `progress`, `statusText`, and `logs`
- `useLauncher()` sets `status.initializing` before launch, then flips to `status.game_running` once `launcherIPC.launch()` resolves
- failures collapse to the hardcoded string `Launch Failed`
- `useLauncherIPC()` only updates progress for download-like task types and always formats status as download progress text

That means the launcher currently cannot distinguish:

- preparing launch context
- provisioning Java
- installing vanilla or modloaders
- downloading dependencies
- starting the game process
- waiting for the game window to appear
- running after spawn
- failed with a recoverable action

The backend already contains richer signals than the renderer exposes:

- `electron/services/launcher/orchestrator.ts` logs explicit milestones such as version info, Java resolution, vanilla install, modloader install, auth, and final launch
- `electron/services/runtime/taskRunner.ts` already normalizes progress types and emits watchdog logs for silent stalls

The planner should treat launch trust as a state-modeling seam across main-process progress/log events and renderer status presentation, not as a purely visual `LaunchControls` tweak.

### Busy-state protection is incomplete and partly misleading

There is some existing protection:

- `handleLaunch()` early-returns if `state.isLaunching` is already true
- launch buttons are disabled while `isLaunching`
- modpack and settings selectors are disabled off the same boolean in some places

But the overall behavior is still not trustworthy:

- `LaunchControls` shows a pulsing status string with no stage taxonomy
- the “force restart” control appears during the broad `isLaunching` window, even if the launcher is only downloading or appears stalled
- logs are only useful if the console is open, which means the main play surface still looks frozen to a normal user
- there are almost no focused tests around launch-state behavior; existing tests mainly stub `LaunchControls` or only assert sidebar wiring

Phase 13 should therefore plan launch-state work together with explicit busy-state affordances and failure persistence, instead of treating them as separate cleanup items.

### Create-modpack dependencies are currently under-modeled by design

The ownership seam is:

- `src/components/modpacks/CreateModpackModal.tsx`
- `src/components/modpacks/ModpackCreationWizard.tsx`
- `src/components/sidebar/ModloaderSection.tsx`
- `src/features/launcher/hooks/useVersions.ts`
- `src/features/launcher/hooks/useModSupportedVersions.ts`
- `src/services/ipc/modpacksIPC.ts`
- `electron/services/modpacks/modpackService.ts`

Two concrete truth gaps are visible:

1. the UI lets the user pick only a loader type, not a resolved loader version
2. the backend writes manifest loader IDs from that incomplete data

`CreateModpackModal` and `ModpackCreationWizard` pass:

- selected Minecraft version
- selected loader type (`forge`, `fabric`, `neoforge`, or `vanilla`)
- loader version as `undefined`

`electron/services/modpacks/modpackService.ts#createLocalModpack()` then writes:

- `runtime.modLoader.version = undefined`
- manifest entries such as `forge-`, `fabric-`, or `neoforge-`

So the dependency seam is not merely visually missing. It is lossy. The create flow does not currently persist truthful runtime dependency metadata beyond the coarse loader type.

This is the strongest Phase 13 planning finding for `MPUX-01`:

- if the phase only adds a prettier dependency summary without repairing the data source, it will still ship inaccurate dependencies
- if the phase tries to implement full remote loader-version resolution inside creation, it may sprawl beyond the milestone

The right planning question is therefore: what is the minimum truthful dependency contract users need at creation time? A likely answer is:

- always show Minecraft version
- always show selected loader type
- show loader version only when it is actually known
- stop emitting malformed manifest loader IDs for local packs

### Remote modpack browser is functional but still scan-heavy

The current remote browser seam is centered on:

- `src/components/modpacks/ModpackBrowser.tsx`
- `src/features/modpacks/hooks/useModpackNavigation.ts`
- `electron/services/mods/platform/modPlatformService.ts`

The phase inherits some good foundations from earlier work:

- browser state is persisted through `useModpackNavigation`
- page size is configurable and persisted locally
- Modrinth alphabetical pagination was already repaired in `modPlatformService`
- history and favorites are provider-aware

But the browser still feels awkward in ways the roadmap now owns:

- the results layout is fixed at one or two columns for this surface, with no adaptive density control
- search and filters live in a single block above results, but there is little scan feedback besides empty/loading states
- history is a separate full-mode view instead of a lighter integrated recall affordance
- CurseForge remains explicitly disabled as “Soon,” so the tab set communicates parity the product does not actually provide
- result cards have very little structured metadata beyond title, description, and downloads, so browsing relies on reading cards linearly

`MPUX-02` should not become a full browser rewrite. It should focus on:

- faster scanning
- clearer filter and result state
- density or layout that adapts better to real window widths
- honest affordances around platform availability

### Installed modpack cards still make common actions heavier than they should be

The current local-card seam is:

- `src/components/modpacks/ModpackList.tsx`

Phase 11 already fixed the menu anchoring problem through `AnchoredOverlay`, so Phase 13 should not reopen geometry. The remaining ergonomics debt is behavioral:

- the primary card CTA is `Select`, not the next likely action the user wants after selecting
- “Open details” is promoted, but quick actions like play, settings, or last-used flows are still indirect
- action menus contain rename, duplicate, export, share, and delete, but not the most common “just open and play/manage” shortcuts
- local-card density is still relatively heavy for users with many installed packs

This suggests a clean scope split:

- `13-03` owns remote browsing ergonomics
- `13-04` owns installed-pack quick flows and card action priority

That keeps remote and local seams separate enough for planning and execution.

## Brownfield-Safe Sequencing

### 1. Fix launch-state modeling before polishing button copy

If the phase starts by only changing button labels or spinner styling, the product will still not know which state it is in. Stage modeling has to come first so every later surface can render truthfully from the same source.

### 2. Repair dependency data truth before adding dependency UI

The malformed `forge-` or `fabric-` manifest entries show that dependency truth is currently lossy at write time. Any dependency panel or summary added before that seam is repaired will risk shipping polished but wrong information.

### 3. Keep remote-browser and local-card work as separate owner surfaces

`ModpackBrowser.tsx` and `ModpackList.tsx` solve different UX problems. Planning them as one giant “modpack UX” plan would mix remote scanning concerns with local quick-action concerns and create noisy verification.

### 4. Keep the phase inside launcher ergonomics, not general product parity

The repo and roadmap both defer a dedicated activity center and broader parity work. Phase 13 should improve trust and speed for current flows, not invent an entirely new launcher subsystem.

## Planning Risks

- If `13-01` keeps `isLaunching` as the only meaningful renderer state, the user-facing trust problem will survive even if status copy is rewritten.
- If `13-01` exposes more states only through logs, the main play surface will still feel frozen.
- If `13-02` only patches UI without fixing the malformed local manifest dependency data, `MPUX-01` will remain partially false.
- If `13-03` tries to solve every browser complaint at once, it will turn into an unbounded discovery-surface redesign.
- If `13-04` reopens anchored-overlay geometry instead of focusing on action priority and quick flows, it will duplicate already-completed Phase 11 work.
- If `13-05` does not include live browser evidence for launch and modpack flows, the phase may look green in tests while the trust problem remains visible to users.

## Recommended Plan Shape

The cleanest Phase 13 decomposition still matches the roadmap, but the ownership seams should be explicit:

- `13-01`: model explicit launch stages and busy-state feedback
- `13-02`: surface truthful modpack creation dependencies
- `13-03`: improve remote modpack browser scanning, filtering, and adaptive density
- `13-04`: stabilize installed-modpack card actions and quick flows
- `13-05`: run the core UX trust gate and close Phase 13

Recommended wave map:

- Wave 1: `13-01`, `13-02`
- Wave 2: `13-03`, `13-04`
- Wave 3: `13-05`

This sequencing lets launch trust and dependency truth land first, then browser and installed-card ergonomics evolve on top of those clearer product contracts, then close on integrated verification.

## Validation Architecture

Phase 13 can reuse the existing Vitest + jsdom lane plus focused live-browser checks.

### Layer 1: launch-state and busy-state tests

Add focused coverage around the launch-state seam so tests prove:

- stage mapping is explicit instead of one generic status string
- busy states disable conflicting actions but keep recovery visible
- failure states persist until the user can react

Primary ownership seams:

- `src/features/launcher/hooks/useLauncher.ts`
- `src/features/launcher/hooks/useLauncherIPC.ts`
- `src/components/sidebar/LaunchControls.tsx`
- `src/components/Sidebar.tsx`
- `src/components/SimplePlayDashboard.tsx`

### Layer 2: create-modpack dependency truth tests

Add focused tests that prove:

- create flows expose Minecraft and loader dependencies visibly
- local creation does not emit malformed loader IDs such as `forge-`
- the chosen dependency summary stays aligned with what the backend persists

Primary seams:

- `src/components/modpacks/CreateModpackModal.tsx`
- `src/components/modpacks/ModpackCreationWizard.tsx`
- `electron/services/modpacks/modpackService.ts`

### Layer 3: modpack browser and installed-card ergonomics tests

Add targeted tests that prove:

- remote browsing remains keyboard-usable while filter/density changes land
- pagination and filter state remain truthful
- installed-card quick actions open the right next-step flows without menu regressions

Primary seams:

- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `src/features/modpacks/hooks/useModpackNavigation.ts`

### Layer 4: focused live-browser sanity plus repo gate

Phase 13 should still close on:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`

And it should include live-browser sanity for:

- launch states on the main play surface
- the create-modpack dependency path
- remote browser scanning and local-card quick actions

The repo already contains `src/verification/manual/mockEnvironment.ts`, which is useful for browser-backed verification without relying on full live network/runtime conditions for every state.

## Planner Guidance

- Treat launch trust as a shared product-state problem across IPC, task progress, and the play surface.
- Treat modpack dependency truth as both a data-write and UI-disclosure problem.
- Keep remote browser work and installed-card work separate enough that each can close with focused tests.
- Avoid promising CurseForge parity or a brand-new activity center inside this phase unless the codebase evidence changes during execution.
