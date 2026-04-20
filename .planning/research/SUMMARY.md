# Project Research Summary

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.6.0 Feedback-Driven Stabilization And Expansion`  
**Researched:** 2026-04-20  
**Confidence:** HIGH

## Executive Summary

`v0.6.0` should stay inside the current Electron + React + TypeScript architecture and be planned as a trust-restoration milestone with one bounded expansion seam, not as another redesign wave or platform migration.

The research is aligned across stack, features, architecture, and pitfalls:

- shell restraint and native behavior need consolidation at the existing shell seam, not more chrome invention
- modpack workflows need one authoritative runtime truth projected from the main process, not more renderer heuristics
- settings need honest, deterministic behavior inside the current renderer settings model, not more customization surface
- resource-pack and shader flows should become guided in-app flows using the existing add-content architecture, with compatibility guidance and typed recoverable outcomes

The milestone remains coherent only if it removes noise and contradiction in those four seams while keeping the current main-process, preload, IPC, and renderer split intact.

## Key Findings

### 1. Shell restraint and native behavior

- The current architecture already has the right shell ownership split:
  - Electron owns window policy and native behavior
  - the renderer owns shell composition
- The missing piece is one shared shell contract for titlebar rhythm, drag or safe regions, notification placement, and window-control access.
- macOS should become more native through the existing platform-aware shell path, not through route-level padding or duplicate custom controls.
- App-wide updater messaging can stay global, but modpack-specific urgency must stay local to modpack surfaces.

### 2. Modpack workflow truth

- FMCL is already structurally modpack-first, but runtime truth still drifts between metadata, saved config, launch resolution, and renderer fallbacks.
- `v0.6.0` needs one authoritative runtime-summary projection from main process to renderer covering:
  - effective Minecraft version
  - effective loader type and version
  - whether values are explicit, inferred, or unresolved
  - whether dependency and compatibility checks may trust them
- List cards, details, dashboard, dependency states, and later guided content flows should all read from that same projected truth.
- The milestone is not blocked by missing frameworks; it is blocked by split truth.

### 3. Settings truth

- The settings architecture is already centralized enough: settings should remain renderer-local and stay under the current context and theme seams.
- The actual gap is honesty:
  - preset behavior is not deterministic enough
  - control geometry is inconsistent
  - some controls overstate their real user-visible effect
- `v0.6.0` should reduce misleading settings surface area before allowing any bounded personalization follow-up.
- No new theming library, form system, component framework, or i18n runtime is justified.

### 4. Guided resource-pack and shader flows

- FMCL already has the right architectural base:
  - in-app add-content routing
  - existing resource-pack and shader domain services
  - platform-backed content search and install
- The missing piece is truthful guidance between browse, compatibility, install, and recovery.
- Resource-pack and shader acquisition should default to the in-app guided path.
- Native file pickers should remain as explicit fallback escape hatches, not the primary flow.
- Search and install contracts need stronger typing so the UI can explain compatibility, caveats, and recoverable failures instead of collapsing to boolean or `unknown`.

## Phase And Build-Order Implications

### Recommended phase order

1. **Phase 28: Product restraint and native shell truth**  
   Establish the shared shell contract first so later work does not build on noisy or platform-awkward chrome.

2. **Phase 29: Modpack workflow simplification and runtime truth**  
   Add the authoritative runtime-summary projection next because it is the highest-trust dependency for modpack UI and guided content compatibility.

3. **Phase 30: Settings truth and honest personalization**  
   Clean up settings after shell restraint and runtime truth are clearer; this phase stays mostly renderer-local.

4. **Phase 31: Guided content browsers and bounded capability expansion**  
   Land guided resource-pack and shader flows last so they can consume Phase 29 runtime truth and inherit the calmer shell rules from Phases 28 to 30.

### Cross-phase rules

- Keep the current Electron + React + TypeScript architecture.
- Consolidate truth at existing seams instead of creating parallel systems.
- Do not create a second durable runtime store in the renderer.
- Do not create a second settings store.
- Do not create a separate resource-pack or shader acquisition architecture when `AddModPage` plus the existing platform services already exist.
- Keep shell-level concerns out of route-local work and keep modpack-local urgency out of global shell zones.

## Major Pitfalls

- Treating shell restraint as another branding pass instead of reducing noise and preferring native behavior.
- Fixing macOS behavior with route-level spacing hacks instead of one platform-aware shell contract.
- Leaving modpack-specific update urgency in global shell surfaces.
- Making modpack UI smaller without fixing loader, version, dependency, and runtime truth underneath.
- Reworking modpack tabs one by one instead of enforcing one shared tab-shell contract.
- Styling async flows more calmly while still depending on reload-based recovery or weak failure explanation.
- Cleaning up settings visually without proving preset truth and control honesty.
- Starting bounded personalization before settings trust is restored.
- Calling resource-pack and shader flows guided while still defaulting to Finder or Explorer detours.
- Shipping content browsers without compatibility truth, typed recovery, or protection against blocking import behavior.

## Implications For REQUIREMENTS.md And ROADMAP.md

### REQUIREMENTS.md should lock the milestone around outcome truth

- Define the milestone as stabilization plus one bounded expansion, not as redesign continuation.
- Make shell restraint, native behavior, modpack runtime truth, settings truth, and guided content flows first-class acceptance areas.
- Require authoritative runtime projection as a shared dependency for modpack UI and content compatibility.
- Require settings controls to map to deterministic and user-visible outcomes.
- Require resource-pack and shader flows to be in-app first, compatibility-aware, and recoverable.
- Explicitly forbid framework swaps, router migration, state-library migration, new theming systems, and broad capability expansion under this milestone.

### ROADMAP.md should sequence consolidation before surface migration

- Phase 28 should own shell restraint and native behavior only.
- Phase 29 should own runtime truth and shared modpack workflow semantics.
- Phase 30 should own honest settings behavior and only then any bounded personalization.
- Phase 31 should own guided resource-pack and shader flows on top of the earlier truth contracts.
- Keep unrelated performance, multiplayer, or broad marketplace expansion out of the milestone story.

## High-Confidence Guidance

The strongest planning move is to draft `REQUIREMENTS.md` around trust restoration in four seams and to generate `ROADMAP.md` in the strict order `28 -> 29 -> 30 -> 31`, with the runtime-summary contract treated as the central dependency between stabilization and expansion work.

If planning stays inside the current Electron + React + TypeScript architecture, consolidates truth at existing IPC and renderer seams, and treats guided resource-pack or shader flows as the only bounded expansion, the milestone has a clear release story and a low-risk path from research into requirement drafting and roadmap generation.

## Sources

- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`
