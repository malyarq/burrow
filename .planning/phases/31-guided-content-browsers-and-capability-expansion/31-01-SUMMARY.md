---
phase: 31-guided-content-browsers-and-capability-expansion
plan: "01"
subsystem: ipc
tags: [electron, ipc, resource-packs, shaders, contracts]
requires:
  - phase: 29-modpack-workflow-simplification-and-runtime-truth
    provides: shared add-content shell and async recovery language that later guided content work reuses
provides:
  - typed acquisition outcomes for resource-pack imports and add flows
  - typed acquisition outcomes for shader add flows
  - supported preload namespaces for resource pack and shader renderer wrappers
affects: [CONTENT-03, guided-content-browser, preload-contracts, renderer-ipc]
tech-stack:
  added: []
  patterns: [named acquisition outcome unions, feature-specific preload wrappers with ipc fallback]
key-files:
  created: [electron/preload/bridges/ResourcePacksBridge.ts, electron/preload/bridges/ShadersBridge.ts]
  modified: [shared/contracts/resourcePacks.ts, shared/contracts/shaders.ts, shared/contracts/windowApi.ts, electron/services/resourcePacks/resourcePackService.ts, electron/services/shaders/shaderService.ts, electron/ipc/handlers/resourcePacksHandlers.ts, electron/ipc/handlers/shadersHandlers.ts, src/services/ipc/resourcePacksIPC.ts, src/services/ipc/shadersIPC.ts, docs/en/contracts-map.md, docs/ru/contracts-map.md]
key-decisions:
  - "Acquisition results now aggregate per-file issues into named statuses instead of exposing booleans or handler-only logs."
  - "Resource pack and shader wrappers now live on window.api while renderer IPC wrappers keep an ipcRenderer fallback for compatibility."
patterns-established:
  - "Content acquisition pattern: service-level validation returns serializable issue objects, handler-level aggregation derives success/partial/failure status."
  - "Preload alignment pattern: when shared feature contracts grow, add a namespaced preload bridge and point renderer wrappers at it."
requirements-completed: [CONTENT-03]
duration: 22min
completed: 2026-04-21
---

# Phase 31 Plan 01: Typed Content Acquisition Summary

**Typed resource-pack and shader acquisition outcomes now travel end to end through shared contracts, preload, IPC handlers, renderer wrappers, and contract docs.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-04-20T21:43:00Z
- **Completed:** 2026-04-20T22:05:27Z
- **Tasks:** 1
- **Files modified:** 15

## Accomplishments
- Replaced boolean resource-pack `add` and `import` outcomes with named serializable result objects carrying imported file names and issue details.
- Replaced boolean shader `add` outcomes with named serializable result objects and added shader archive validation at the service layer.
- Exposed resource pack and shader wrappers through `window.api` and aligned both contract-map language variants with the new result surface.

## Task Commits

1. **Task 1: Replace opaque content outcomes with typed resource-pack and shader result contracts** - `8b7ab7d` (`feat`)

**Plan metadata:** not committed because `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` already had unrelated local edits before this plan executed.

## Files Created/Modified
- `shared/contracts/resourcePacks.ts` - adds `ResourcePackAcquisitionResult` and updates `add`/`import` return types.
- `shared/contracts/shaders.ts` - adds `ShaderPackAcquisitionResult` and updates `add` return type.
- `shared/contracts/windowApi.ts` - extends the supported namespaced preload surface with `resourcePacks` and `shaders`.
- `electron/services/resourcePacks/resourcePackService.ts` - validates archives, detects duplicates, and returns stable acquisition outcomes.
- `electron/services/shaders/shaderService.ts` - validates shader payloads and returns stable acquisition outcomes for imports.
- `electron/ipc/handlers/resourcePacksHandlers.ts` - aggregates per-file import results into named add/import outcomes.
- `electron/ipc/handlers/shadersHandlers.ts` - aggregates per-file shader import results into named add outcomes.
- `electron/preload/bridges/ResourcePacksBridge.ts` - exposes the resource-pack feature contract on `window.api`.
- `electron/preload/bridges/ShadersBridge.ts` - exposes the shader feature contract on `window.api`.
- `src/services/ipc/resourcePacksIPC.ts` - prefers the feature preload namespace while keeping `ipcRenderer` fallback compatibility.
- `src/services/ipc/shadersIPC.ts` - prefers the feature preload namespace while keeping `ipcRenderer` fallback compatibility.
- `docs/en/contracts-map.md` - records the new namespaced preload entries and structured outcome notes.
- `docs/ru/contracts-map.md` - records the new namespaced preload entries and structured outcome notes.

## Decisions Made
- Named acquisition status is the renderer-facing contract; per-file issues carry actionable detail and remove the need for log parsing.
- Handler aggregation owns `success` vs `partial-success` vs singular failure states so services can stay focused on one import at a time.
- Shader validation currently treats a missing `shaders/` payload as `invalid-archive`; `runtime-blocked` remains part of the shared contract for later capability-aware phases.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- A one-off sanity test needed to run from `electron/services/**` because the repo’s Vitest include globs ignore `.planning/tmp`. The temporary test passed and was removed immediately afterward.
- The current `STATE.md` format predates some `gsd-tools` automation assumptions, so roadmap and requirement helpers ran only partially and the missing state/session updates were patched manually.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Later Phase 31 plans can branch on typed resource-pack and shader acquisition results without adding new IPC channels.
- The renderer now has a supported preload namespace for both feature areas, which reduces future reliance on raw `ipcRenderer` fallbacks.
- No blocker remains for guided-browser recovery work in subsequent plans.

## Self-Check: PASSED

- Verified summary and newly created preload bridge files exist on disk.
- Verified task commit `8b7ab7d` is present in `git log`.
