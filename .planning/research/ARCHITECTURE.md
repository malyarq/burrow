# v0.6.0 Architecture Integration Research

## Scope

Milestone: `v0.6.0 Feedback-Driven Stabilization And Expansion`

This note only covers the architecture impact of these milestone themes:

- Phase 28: shell restraint and native behavior
- Phase 29: modpack runtime truth
- Phase 30: settings truth
- Phase 31: guided resource-pack and shader flows

It does not reopen unrelated launcher expansion, performance work, or broad redesign outside these seams.

## Main Architectural Conclusion

FMCL already has the right high-level split for this milestone:

- the main process owns durable modpack, filesystem, launch, and runtime behavior
- the renderer owns layout, navigation, and local UI preferences
- preload and `shared/contracts/*` are the trust boundary between them

The remaining product problems mostly come from truth drifting across that split:

- shell behavior is partly native and partly custom, with a few renderer-side bypasses
- runtime truth is still derived in multiple renderer places instead of projected once from main-process state
- settings truth is spread across preset inference, theme mode, and noisy UI composition
- guided content browsing already exists for resource packs and shaders, but some entrypoints still bypass it and drop back to raw OS file picking

The milestone should therefore add as little new architecture as possible. The right move is to consolidate truth at existing seams, not create parallel state systems.

## Integration Map

| Workstream | Current integration points | Modified components | New components or seams worth adding | Data flow / IPC impact |
| --- | --- | --- | --- | --- |
| Shell restraint and native behavior | `electron/window/windowManager.ts`, `src/components/AppLayout.tsx`, `src/components/TitleBar.tsx`, `src/components/sidebar/SidebarHeader.tsx`, `src/contexts/SettingsContext.tsx`, `src/services/ipc/windowControlsIPC.ts` | `windowManager.ts`, `TitleBar.tsx`, `SidebarHeader.tsx`, `AppLayout.tsx`, `SettingsContext.tsx`, `windowControlsIPC.ts`, `electron/preload/bridges/WindowControlsBridge.ts`, `electron/ipc/handlers/windowHandlers.ts`, `shared/contracts/windowControls.ts` | Small shell-capabilities seam if needed, for example a typed platform or window-capability read model instead of renderer guessing | Low-to-moderate IPC change. Minimum change is to expose existing console controls through the wrapper and keep shell logic platform-aware. No new persistent state required. |
| Modpack runtime truth | `src/contexts/ModpackContext.tsx`, `src/features/launch/hooks/useLaunchState.ts`, `src/features/modpacks/hooks/useModpackDetailsConfig.ts`, `src/components/modpacks/ModpackList.tsx`, `src/components/SimplePlayDashboard.tsx`, `electron/services/instances/*`, `electron/services/launcher/launchFlow/*`, `electron/services/modpacks/modpackService.ts` | `ModpackContext.tsx`, `useLaunchState.ts`, `ModpackList.tsx`, `SimplePlayDashboard.tsx`, `modpackService.ts`, `instanceService.ts`, `indexStore.ts`, `configStore.ts`, launch-flow runtime resolution | Add one authoritative runtime-summary projection shared by list, detail, dashboard, and guided content flows. This should be a shared type plus a modpack IPC read method, not a renderer-only helper. | High IPC relevance. Runtime truth should be projected from main process to renderer once. Renderer must stop inventing fallback runtime values independently of main launch resolution. |
| Settings truth | `src/contexts/SettingsContext.tsx`, `src/contexts/settings/theme.ts`, `src/contexts/settings/theme-presets.ts`, `src/components/SettingsPage.tsx`, `src/components/settings/SettingsTabsHeader.tsx`, `src/components/settings/tabs/AppearanceTab.tsx`, `src/components/settings/tabs/LauncherTab.tsx` | `SettingsContext.tsx`, settings tab layout and shared controls, theme preset resolution helpers | Add a small internal settings-view-model seam and a shared control row system. This is renderer-local; it does not need a new main-process settings service. | Mostly no IPC change. The important architectural rule is to keep product settings truth in one renderer store and remove UI that implies behavior the app does not actually deliver. |
| Guided resource-pack and shader flows | `src/components/modpacks/ModpackRouter.tsx`, `src/components/modpacks/AddModPage.tsx`, `src/components/modpacks/details/ResourcePacksTab.tsx`, `src/components/modpacks/details/ShadersTab.tsx`, `src/components/SimplePlayDashboard.tsx`, `electron/services/mods/platform/modPlatformService.ts`, `electron/services/resourcePacks/*`, `electron/services/shaders/*`, `shared/contracts/mods.ts` | `AddModPage.tsx`, `ModpackRouter.tsx`, `SimplePlayDashboard.tsx`, resource-pack and shader detail tabs, `shared/contracts/mods.ts`, `modsIPC.ts`, preload bridge, mod-platform service | Add typed search, compatibility, and install result models for non-mod content. Add a reusable compatibility-guidance panel instead of separate per-surface heuristics. | Moderate IPC change. Search and install are already IPC-backed, but they are weakly typed. Guided compatibility should consume authoritative runtime truth and return recoverable install errors. |

## Phase 28: Product Restraint And Native Shell Truth

### What the existing architecture already gives us

- `electron/window/windowManager.ts` already differentiates macOS shell behavior with `titleBarStyle: 'hiddenInset'` on Darwin and a frameless custom shell on other platforms.
- `src/components/TitleBar.tsx` already renders a minimal drag region on macOS and custom controls elsewhere.
- `src/components/AppLayout.tsx` already keeps app-wide updater messaging in one place through `UpdateNotification`.
- Modpack update visibility is already mostly local to modpack surfaces through `src/components/modpacks/ModpackList.tsx` and `src/components/modpacks/details/ModpackDetailsActions.tsx`.

### Where the current architecture still fights the product goal

- `src/components/sidebar/SidebarHeader.tsx` still carries a large share of launcher branding and high-level chrome weight, so shell noise is not isolated to one replaceable seam.
- `src/contexts/SettingsContext.tsx` still bypasses the renderer IPC wrapper and calls `window.windowControls?.openConsole()` and `closeConsole()` directly.
- The shell has two different urgency layers:
  - app-updater urgency in `AppLayout.tsx`
  - modpack-update urgency in modpack surfaces

This split is correct, but it is easy to accidentally blur if Phase 28 edits do not preserve the separation explicitly.

### Integration recommendation

- Treat `AppLayout.tsx`, `TitleBar.tsx`, and `SidebarHeader.tsx` as the only shell-restraint entrypoints.
- Do not push shell decisions down into route components.
- Normalize all window-control access through `src/services/ipc/windowControlsIPC.ts`, even when the underlying preload API already exists.
- Keep app update messaging global and modpack update messaging local. That is already the right architecture and should be protected during cleanup.

### New vs modified components

Modified:

- `electron/window/windowManager.ts`
- `src/components/AppLayout.tsx`
- `src/components/TitleBar.tsx`
- `src/components/sidebar/SidebarHeader.tsx`
- `src/contexts/SettingsContext.tsx`
- `src/services/ipc/windowControlsIPC.ts`
- `electron/preload/bridges/WindowControlsBridge.ts`
- `electron/ipc/handlers/windowHandlers.ts`
- `shared/contracts/windowControls.ts`

New, only if the cleanup needs them:

- a small shared `WindowShellCapabilities` contract if renderer logic needs a typed, future-safe platform capability read model

### IPC implications

- Minimum required change: expose console controls through the existing IPC wrapper so renderer settings stop bypassing the wrapper layer.
- Optional change: add a typed capability getter if shell decisions start depending on more than `isMac`.

## Phase 29: Modpack Workflow Simplification And Runtime Truth

### What the existing architecture already gives us

- The main process already owns real runtime resolution through `electron/services/instances/*` and `electron/services/launcher/launchFlow/*`.
- Modpack product behavior already sits above that storage layer in `electron/services/modpacks/modpackService.ts`.
- Renderer modpack state already has one main orchestration point in `src/contexts/ModpackContext.tsx`.

### Where runtime truth currently splits

- `src/contexts/ModpackContext.tsx` only loads the hidden `classic` config when `isClassicMode && minecraftPath`.
- `electron/services/launcher/launchFlow/resolveModpack.ts` still resolves from the default root path even when renderer-side `minecraftPath` is unset.
- `src/features/launch/hooks/useLaunchState.ts` falls back to `1.12.2` and `vanilla` when the renderer has no runtime config.
- `src/contexts/instances/services/legacySeed.ts`, `electron/services/instances/indexStore.ts`, `configStore.ts`, and `instanceService.ts` still carry bootstrap defaults that can leak into UI semantics.
- `electron/services/modpacks/modpackService.ts` currently syncs `metadata.minecraftVersion` on config save, but not `metadata.modLoader`, so list cards can drift from real runtime state.

### Integration recommendation

Phase 29 should establish one authoritative runtime-summary projection owned by the main process and consumed everywhere in the renderer.

That projection should answer, for each modpack or classic profile:

- effective Minecraft version
- effective loader type and version
- whether the value is explicit, inferred, or unresolved
- whether dependency checks and content compatibility checks may trust it

The renderer should then stop deriving fallback runtime values in multiple places. `ModpackContext`, launch UI, sidebar summaries, list cards, details headers, dependency badges, and later Phase 31 compatibility guidance should all consume the same projected runtime summary.

### New vs modified components

Modified:

- `src/contexts/ModpackContext.tsx`
- `src/features/launch/hooks/useLaunchState.ts`
- `src/features/modpacks/hooks/useModpackDetailsConfig.ts`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/components/sidebar/modpackRuntimeDependencies.ts`
- `electron/services/modpacks/modpackService.ts`
- `electron/services/instances/instanceService.ts`
- `electron/services/instances/indexStore.ts`
- `electron/services/instances/configStore.ts`
- launch-flow runtime resolution under `electron/services/launcher/launchFlow/`
- `shared/contracts/modpacks.ts` and the related preload and renderer IPC wrapper path

New:

- a shared type such as `ResolvedRuntimeSummary`
- one modpack IPC read seam that returns authoritative runtime summaries for:
  - modpack list rows
  - selected modpack detail
  - classic mode

### IPC implications

- This phase should add or extend a modpack IPC contract so runtime truth comes from main to renderer as data, not as duplicated heuristics.
- The renderer should stop assuming `1.12.2` or `vanilla` as user-facing truth unless main explicitly marks them as unresolved bootstrap defaults.
- `modpackService.ts` should keep projected metadata and persisted config synchronized enough that list surfaces do not lie after runtime edits.

## Phase 30: Settings Truth And Honest Personalization

### What the existing architecture already gives us

- Settings state already has one renderer-level owner in `src/contexts/SettingsContext.tsx`.
- Theme helpers already live under `src/contexts/settings/`.
- The settings route is already decomposed into tab-level components.

### Where settings truth currently weakens

- Preset truth is split between `themePresetId`, the active `theme`, and preset resolution logic that changes behavior depending on current light or dark mode.
- `inferThemePresetId()` and `resolveThemeConfig()` do not form one stable, user-facing preset model.
- `src/components/settings/tabs/AppearanceTab.tsx` mixes high-value controls with decorative or weak-result controls.
- `AppearanceTab.tsx` and `LauncherTab.tsx` use different control geometry systems.
- `src/components/SettingsPage.tsx` and `src/components/settings/SettingsTabsHeader.tsx` still spend too much structure on navigation chrome instead of truthful settings content.

### Integration recommendation

This phase should stay renderer-local and avoid inventing a new persisted settings backend.

The right architectural move is:

- keep `SettingsContext.tsx` as the owner
- simplify it into one stable settings view model
- make preset resolution explicit and reviewable
- reduce settings UI to controls that map cleanly to a real state change

If a control does not map to a durable, explainable outcome, it should leave the settings architecture instead of being “made prettier”.

### New vs modified components

Modified:

- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/components/SettingsPage.tsx`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/settings/tabs/LauncherTab.tsx`
- `src/components/settings/settingsTabs.ts`

New:

- a small renderer-only settings view-model layer if needed to separate persisted state from panel presentation
- a shared settings control row or field component system used by both appearance and launcher settings

### IPC implications

- No major IPC expansion is needed for this phase.
- The only shell-adjacent setting that crosses the boundary is console visibility, and that should use the normalized window-controls wrapper established in Phase 28.

## Phase 31: Guided Content Browsers And Capability Expansion

### What the existing architecture already gives us

- `src/components/modpacks/ModpackRouter.tsx` already has in-app routes for `addResourcePack` and `addShader`.
- `src/components/modpacks/AddModPage.tsx` already supports `contentType="resourcepack"` and `contentType="shader"`.
- `electron/services/mods/platform/modPlatformService.ts` already maps content types to Modrinth and CurseForge search/install behavior and installs into the correct target directories.

This means the core architecture for in-app resource-pack and shader browsing already exists.

### Where the user experience still bypasses that architecture

- `src/components/SimplePlayDashboard.tsx` still uses `resourcePacksIPC.add(instancePath)` and `shadersIPC.add(instancePath)`, which pushes users into native file-picking detours.
- `shared/contracts/mods.ts`, the preload bridge, and `src/services/ipc/modsIPC.ts` still use weak `unknown` typing for search, version, and install payloads.
- Compatibility guidance is not modeled as a first-class response tied to authoritative runtime truth.
- Resource-pack and shader management tabs are good inventory surfaces, but not yet the primary acquisition architecture.

### Integration recommendation

Phase 31 should build on the existing in-app browser path instead of creating another acquisition stack.

The phase should:

- reroute the main add-entry surfaces toward `AddModPage`
- keep native file import only as an explicit fallback action
- use the runtime-summary contract from Phase 29 for compatibility guidance
- make install failure and incompatibility states typed and recoverable

This is the clearest place where milestone sequencing matters. Phase 31 should not invent its own runtime heuristics because Phase 29 already needs to solve that problem for the whole product.

### New vs modified components

Modified:

- `src/components/SimplePlayDashboard.tsx`
- `src/components/modpacks/ModpackRouter.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/services/ipc/modsIPC.ts`
- `electron/preload/bridges/ModsBridge.ts`
- `electron/ipc/handlers/modsHandlers.ts`
- `electron/services/mods/platform/modPlatformService.ts`
- `shared/contracts/mods.ts`

New:

- shared typed models for content search results, version choices, compatibility guidance, and install outcomes
- a reusable compatibility-guidance panel or decision block inside the existing add-content flow
- a small fallback import action that keeps the old local-file behavior available without making it the primary architecture

### IPC implications

- `shared/contracts/mods.ts` should stop returning `unknown` for the Phase 31 path.
- Search results should return enough typed information to render source, loader or game-version compatibility, and recoverable failure states.
- Install calls should return a typed outcome that can distinguish:
  - installed successfully
  - compatible but optional caveats
  - incompatible with current runtime truth
  - recoverable platform or network failure

## Cross-Phase Architectural Rules

- Do not create a second durable modpack truth in renderer state. Runtime truth must come from main-process projection.
- Do not add a second settings store. Settings truth should remain renderer-local and simpler, not more distributed.
- Do not create separate resource-pack and shader acquisition architectures. Reuse the `AddModPage` plus platform-service path and make it first-class.
- Do not let Phase 28 shell cleanup absorb route-level product work that belongs to Phases 29 to 31.
- Protect the existing split between global app updates and local modpack updates.

## Recommended Build Order For Roadmap Creation

### 1. Phase 28 first: shell restraint and native behavior

Why first:

- it is the cleanest top-level scope boundary
- it removes shell noise without needing deeper data model changes
- it normalizes the shell and window-control seam before other phases touch nearby UI

Expected output:

- restrained shell entrypoints
- native-first macOS behavior preserved through one shell seam
- normalized window-controls access
- no accidental shell-wide modpack urgency

### 2. Phase 29 second: authoritative runtime truth

Why second:

- it fixes the highest-risk product trust problem
- it establishes a reusable runtime-summary contract needed by later phases
- it prevents Phase 31 from duplicating compatibility logic in renderer-only code

Expected output:

- one authoritative runtime projection from main to renderer
- list, detail, dashboard, and dependency surfaces reading the same truth
- metadata and config no longer drifting on loader or version semantics

### 3. Phase 30 third: settings truth

Why third:

- it depends only lightly on earlier phases
- it benefits from the shell restraint already established in Phase 28
- it stays mostly renderer-local, making it a clean follow-on after the higher-risk runtime work

Expected output:

- stable preset truth
- shared control geometry
- removal of misleading settings surfaces

### 4. Phase 31 fourth: guided resource-pack and shader flows

Why fourth:

- it should consume the runtime-summary contract from Phase 29
- it can reuse shell and settings restraint work rather than reopening them
- the existing add-content architecture already exists, so the milestone value comes from making it truthful and primary, not from inventing a new route family

Expected output:

- in-app browsing as the default content-acquisition path
- compatibility guidance tied to authoritative runtime truth
- typed, recoverable install outcomes
- native file import preserved only as an explicit fallback

## Roadmap-Shaping Summary

For `v0.6.0`, the architecture should evolve by consolidation, not expansion:

- Phase 28 consolidates shell behavior at the existing shell seam.
- Phase 29 consolidates runtime truth at the main-process modpack seam.
- Phase 30 consolidates settings truth at the existing renderer settings seam.
- Phase 31 consolidates guided content acquisition around the add-content path that already exists, while upgrading contracts and compatibility modeling.

If roadmap planning keeps those boundaries intact, the milestone can remove the main trust and clarity problems without starting another broad architectural migration.
