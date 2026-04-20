# Project Research: Stack

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.6.0 Feedback-Driven Stabilization And Expansion`  
**Researched:** 2026-04-20  
**Confidence:** HIGH

## Research Question

Which stack patterns should FMCL reuse for `v0.6.0`, and what minimal stack additions are actually justified for shell restraint/native behavior, modpack workflow truth, settings truth, and guided resource-pack/shader flows without leaving the current Electron + React + TypeScript architecture?

## Bottom Line

`v0.6.0` should stay inside the current stack. This milestone is not blocked by missing frameworks.

The repo already has the right core ingredients:

- Electron main-process ownership for filesystem, runtime, dialogs, updater, and shell behavior
- React + Context state for renderer composition
- typed preload and IPC seams for privileged operations
- local JSON i18n and CSS-variable theme application
- XMCL plus Modrinth and CurseForge clients for content lookup and installation
- Vitest, Playwright, and `manual-verification.html` for regression proof

The milestone should therefore be treated as a contract-hardening and composition milestone, not a platform migration.

Only four repo-local additions are justified:

1. one shared shell and control-metrics contract in the existing CSS/token layer
2. one renderer-side truth-normalization layer for modpack and settings views
3. stronger typed IPC result contracts for mods, resource packs, shaders, and other truth-sensitive flows
4. a thin compatibility-guidance helper for resource packs and shaders

No new UI framework, state library, router, theming library, i18n framework, native window package, or backend service is warranted.

## Reuse By Capability

### 1. Shell restraint and native behavior

**Reuse these patterns**

- `electron/window/windowManager.ts` already owns shell policy:
  - frameless main window
  - `titleBarStyle: 'hiddenInset'` on macOS
  - secure navigation and popup guards
- `src/components/TitleBar.tsx` already has a platform split:
  - macOS renders a quiet drag region
  - non-macOS renders custom controls through `windowControlsIPC`
- `src/utils/platform.ts` already provides lightweight platform detection without another native dependency.
- `src/components/AppLayout.tsx`, `src/components/sidebar/SidebarHeader.tsx`, and `src/components/UpdateNotification.tsx` are already the right renderer shell seams for top-level restraint.
- `src/index.css` already exposes reusable shell and surface primitives through:
  - CSS variables
  - `surface-*`
  - `kicker-label`
  - `app-drag-region`
  - `no-drag`
- `src/app/assets/branding.ts` is already the correct bounded asset contract. For this milestone it should be reduced and applied more carefully, not expanded.

**Minimal addition justified**

Add one repo-local shell contract, not a library. Concretely:

- shared shell chrome metrics for titlebar height, safe top padding, collapsed and expanded sidebar rhythm, and banner slots
- one route-ownership rule for global notices so modpack-local state does not leak back into app-wide chrome
- if needed, one small renderer-readable shell descriptor instead of repeating platform/layout branching ad hoc

This should stay as CSS variables plus a small TS helper module and feed `AppLayout`, `TitleBar`, `SidebarHeader`, and shell-level notification placement.

**Why this is enough**

The current stack already knows how to render platform-specific chrome and already uses Electron window options directly. The `v0.6.0` problem is not missing native capability. The problem is inconsistent shell composition and too much chrome noise.

**Do not add**

- `electron-titlebar-*` or another native titlebar package
- a new routing layer just to control shell chrome
- a second branding system or more branded placeholder infrastructure
- OS-specific native modules for macOS chrome beyond what Electron already provides

### 2. Modpack workflow truth

**Reuse these patterns**

- `src/contexts/ModpackContext.tsx` already owns selected modpack, classic-vs-modpack mode behavior, and bootstrap around persisted selection.
- `src/contexts/instances/services/instancesService.ts` and `src/services/ipc/modpacksIPC.ts` already keep selection and config truth anchored to main-process storage.
- `electron/services/modpacks/modpackService.ts` and the lower-level instance services already own filesystem truth.
- `src/components/modpacks/ModpackRouter.tsx` already localizes primary-action ownership by route. This is the right direction for reducing global noise.
- `src/features/modpacks/hooks/useModpackUpdates.ts` plus `src/components/modpacks/details/ModpackDetailsActions.tsx` already support calm, local update visibility on the relevant modpack surface.
- `src/components/layout/DegradedStateView.tsx`, confirm/toast contexts, and existing modpack tests already provide the right renderer error and degraded-state pattern.

**Minimal addition justified**

Add one shared truth-normalization layer for renderer-facing modpack views:

- merge metadata, resolved runtime config, dependency evaluation, version badges, and update state into one view-model before rendering
- keep this local to the repo in `src/features/modpacks/*` or in shared types only where cross-process data must be formalized
- tighten weak contracts where truth is currently too loose, especially:
  - `shared/contracts/mods.ts` still uses `unknown`
  - boolean-only add/import results for resource packs and shaders are not enough for explainable failures
  - any dependency/status DTOs that currently force the renderer to infer too much

**Why this is enough**

The repo already has the privileged data and the route structure. The instability comes from rendering multiple partial truths side by side: metadata, config, dependency interpretation, and local component state. A shared normalizer and stricter IPC types solve this inside the current architecture.

**Do not add**

- Redux, Zustand, MobX, or TanStack Query
- a backend sync service for modpack state
- a React Router migration for modpack subviews
- optimistic client caches that duplicate main-process truth

### 3. Settings truth and honest personalization

**Reuse these patterns**

- `src/contexts/SettingsContext.tsx` already owns persistent settings state and document-side theme application.
- `src/contexts/settings/theme.ts` and `src/contexts/settings/theme-presets.ts` already provide the theme and preset seam.
- `src/contexts/settings/i18n.ts` plus `src/locales/en.json` and `src/locales/ru.json` already provide the localization model.
- `src/index.css` already carries theme variables and shared surface primitives.
- Existing UI primitives such as `Button`, `Input`, `Select`, and the current settings tabs are enough to normalize geometry without a component-library swap.

**Minimal addition justified**

Add one small appearance/control contract inside the current renderer stack:

- shared geometry tokens for toggles, sliders, segmented controls, and button heights
- one typed map of appearance capabilities that separates:
  - controls that visibly change the UI
  - controls that should be hidden, reworded, or deferred because they currently do not produce meaningful results
- if preset behavior remains confusing, add derived preset-preview/state helpers inside the existing settings module rather than changing theme architecture

**Why this is enough**

The current settings system is already centralized. The milestone problem is truth and control consistency, not missing theming power. The correct fix is to make the current preset and control layer more explicit, not to adopt a new theme engine or a third-party form system.

**Do not add**

- MUI, Chakra, Radix, or another component framework
- a new theming library
- an external i18n runtime
- open-ended customization infrastructure beyond bounded `CUSTOM-01`

### 4. Guided resource-pack and shader flows

**Reuse these patterns**

- `src/components/modpacks/AddModPage.tsx` already supports `contentType="resourcepack"` and `contentType="shader"`.
- `electron/services/mods/platform/modPlatformService.ts` already maps those content types to Modrinth and CurseForge search and installs into `resourcepacks/` or `shaderpacks/`.
- `src/components/modpacks/details/ResourcePacksTab.tsx` and `src/components/modpacks/details/ShadersTab.tsx` already provide the post-install management surfaces.
- `electron/services/resourcePacks/resourcePackService.ts` already parses `pack.mcmeta`, icon data, enable/disable state, and ordering.
- `electron/services/shaders/shaderService.ts` already manages installed shader packs and active shader state.
- `shared/contracts/resourcePacks.ts` and `shared/contracts/shaders.ts` already give these domains their own IPC seams.
- `dialogIPC`, `resourcePacks:add`, and `shaders:add` already exist as fallback import paths.

**Minimal addition justified**

Add thin guidance and better result typing, not a new subsystem:

- enrich the typed search, version, and install result model with compatibility and readiness hints where the UI needs them
- add structured error results for install and import instead of plain `boolean` so the renderer can explain what failed
- add a small compatibility helper that can evaluate known prerequisites from existing launcher truth, such as:
  - whether the modpack/runtime combination is likely shader-capable
  - whether resource pack metadata suggests format or version mismatch
  - whether a failure is recoverable by re-download, different version choice, or local import fallback
- keep OS file dialog import as a secondary escape hatch, not the primary guided flow

This helper can stay repo-local. It does not need a new service boundary unless the same logic must be shared across multiple IPC handlers.

**Why this is enough**

The repo already has both halves of the feature:

- remote discovery and install via the `mods` platform services
- local management via resource-pack and shader domain services

What is missing is truthful guidance between those halves. That is a contract and UX problem, not a stack deficiency.

**Do not add**

- an embedded webview marketplace
- a separate catalog backend
- a database or sync layer for content metadata
- OS-specific file-manager integrations beyond the existing dialog fallback
- a second content-browser implementation separate from `AddModPage`

## Cross-Cutting Reuse

These current stack patterns should be reused across the whole milestone:

- Typed IPC path: shared contract -> preload bridge -> IPC handler -> renderer wrapper -> UI consumer
- Main-process ownership of real state:
  - modpack selection and config
  - filesystem-backed content
  - window and dialog behavior
- Renderer ownership of view composition only:
  - derive and display truth
  - do not duplicate persistence logic that already belongs to Electron services
- Existing design tokens and surface utilities in `src/index.css`
- Existing degraded and recovery patterns via `DegradedStateView`, confirm dialogs, and toast feedback
- Existing proof lane via:
  - `manual-verification.html`
  - `src/verification/manual/*`
  - `tests/visual/manual-closeout.spec.ts`
  - Vitest component and behavior tests

## What Not To Add In v0.6.0

- No router migration.
- No global state rewrite.
- No new theming or settings framework.
- No new i18n framework.
- No native titlebar or window library.
- No component-library replacement.
- No backend service or database for content metadata.
- No separate marketplace app or embedded browser surface.
- No open-ended performance stack work under the `v0.6.0` milestone banner.
- No decorative customization expansion beyond bounded `CUSTOM-01`.
- No new verification platform; expand the existing manual and Playwright seams instead.

## Practical Recommendation

For `v0.6.0`, the stack plan should be:

1. Reuse the current Electron, preload, IPC, and main-process ownership model unchanged.
2. Add shell and control metrics tokens inside the current CSS and renderer shell seams.
3. Add view-model and contract hardening where UI truth is currently split or weakly typed.
4. Add thin compatibility and readiness helpers for guided resource-pack and shader flows.
5. Prove the milestone through the existing manual-verification and Playwright lanes, not a new QA stack.

That is the smallest stack move that matches the milestone inputs from `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `docs/ru/product-feedback-2026-04-20.md`, and `docs/ru/ui-qa-audit-2026-04-14.md`.

## Sources

- `.planning/PROJECT.md`
- `.planning/MILESTONES.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/ARCHITECTURE.md`
- `docs/ru/product-feedback-2026-04-20.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `package.json`
- `manual-verification.html`
- `tests/visual/manual-closeout.spec.ts`
- `src/index.css`
- `src/app/assets/branding.ts`
- `src/utils/platform.ts`
- `src/components/AppLayout.tsx`
- `src/components/TitleBar.tsx`
- `src/components/UpdateNotification.tsx`
- `src/components/sidebar/SidebarHeader.tsx`
- `src/contexts/SettingsContext.tsx`
- `src/contexts/ModpackContext.tsx`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/instances/services/instancesService.ts`
- `src/services/ipc/windowControlsIPC.ts`
- `src/services/ipc/modpacksIPC.ts`
- `src/services/ipc/resourcePacksIPC.ts`
- `src/services/ipc/shadersIPC.ts`
- `src/components/modpacks/ModpackRouter.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsActions.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/features/modpacks/hooks/useModpackUpdates.ts`
- `electron/window/windowManager.ts`
- `electron/ipc/handlers/resourcePacksHandlers.ts`
- `electron/ipc/handlers/shadersHandlers.ts`
- `electron/services/mods/platform/modPlatformService.ts`
- `electron/services/resourcePacks/resourcePackService.ts`
- `electron/services/shaders/shaderService.ts`
- `shared/contracts/mods.ts`
- `shared/contracts/resourcePacks.ts`
- `shared/contracts/shaders.ts`

---
*Research completed: 2026-04-20*  
*Ready for milestone planning: yes*
