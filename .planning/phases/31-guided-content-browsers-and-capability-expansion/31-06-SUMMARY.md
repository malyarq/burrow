---
phase: 31-guided-content-browsers-and-capability-expansion
plan: "06"
subsystem: ui
tags: [react, modpacks, resource-packs, shaders, recovery]
requires:
  - phase: 31-guided-content-browsers-and-capability-expansion
    provides: typed acquisition outcomes plus honest shader capability guidance from 31-01 through 31-05
provides:
  - named on-surface recovery for guided resource-pack and shader failures
  - typed non-mod remote install outcomes for duplicate and invalid-archive recovery
  - content-type-specific empty-state and action copy across guided add surfaces
affects: [CONTENT-03, guided-content-browser, secondary-content-tabs, platform-installs]
tech-stack:
  added: []
  patterns: [typed non-mod install outcomes, named inline recovery grouped by content type and issue status]
key-files:
  created: [src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx]
  modified: [src/components/modpacks/AddModPage.tsx, src/components/modpacks/details/ResourcePacksTab.tsx, src/components/modpacks/details/ShadersTab.tsx, src/services/ipc/modsIPC.ts, electron/services/mods/platform/modPlatformService.ts, electron/services/mods/platform/types.ts, src/locales/en.json, src/locales/ru.json, src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx, src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx, .planning/STATE.md, .planning/ROADMAP.md, .planning/REQUIREMENTS.md, docs/en/roadmap.md, docs/ru/roadmap.md]
key-decisions:
  - "Remote guided resource-pack and shader installs now return named duplicate, invalid-archive, and failure outcomes instead of forcing the renderer to infer everything from thrown errors."
  - "Unsupported shader runtimes block guided shader installs in the renderer before download starts so recovery points at the runtime card instead of a generic network-style failure."
  - "Installed resource-pack and shader unavailable states now keep the guided add route visible as the next recovery step."
patterns-established:
  - "Guided recovery pattern: keep failed non-mod selections on-surface, group typed issues by status, and render content-type-specific next-step copy instead of raw failure counts."
requirements-completed: [CONTENT-03]
duration: 22min
completed: 2026-04-21
---

# Phase 31 Plan 06: Actionable Guided Recovery Summary

**Resource-pack and shader guided flows now keep named recovery, retry-ready selection state, and content-type-specific copy on the current surface instead of collapsing failures into raw counts or mod-centric placeholders.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-04-21T02:04:39+0300
- **Completed:** 2026-04-21T02:26:38+0300
- **Tasks:** 1
- **Files modified:** 16

## Accomplishments

- Added typed non-mod remote install outcomes in `modPlatformService` so guided resource-pack and shader downloads can distinguish duplicate, invalid-archive, and generic failure states without reusing the mod-only error path.
- Reworked `AddModPage` recovery so local imports and guided remote installs now name the failed resource packs or shaders inline, keep failed non-mod selections available for retry, and block unsupported shader installs before download.
- Replaced remaining mod-centric guided-route placeholders with resource-pack and shader-specific empty-state, no-results, success, and CTA copy.
- Kept installed-state resource-pack and shader tabs actionable during unavailable states by exposing the guided add route as the next step there as well.

## Task Commits

1. **Task 1: Convert typed install and import outcomes into actionable on-surface recovery** - not committed

**Plan metadata:** not committed because `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `docs/en/roadmap.md`, and `docs/ru/roadmap.md` already had unrelated local edits before this plan executed.

## Files Created/Modified

- `src/components/modpacks/AddModPage.tsx` - groups typed non-mod issues into inline recovery, preserves failed non-mod selections for retry, blocks unsupported shader installs before download, and removes mod-centric guided-route copy.
- `electron/services/mods/platform/modPlatformService.ts` - validates guided resource-pack and shader downloads for duplicate and invalid-archive outcomes and returns typed non-mod install results.
- `electron/services/mods/platform/types.ts` - defines typed guided content install outcomes alongside the legacy mod-install success shape.
- `src/services/ipc/modsIPC.ts` - exports renderer-side type guards for the new guided content install results.
- `src/components/modpacks/details/ResourcePacksTab.tsx` - keeps the guided add-resource-pack route visible in unavailable states.
- `src/components/modpacks/details/ShadersTab.tsx` - keeps the guided add-shader route visible in unavailable states.
- `src/locales/en.json` - adds English recovery, CTA, and empty-state copy for resource-pack and shader guided surfaces.
- `src/locales/ru.json` - adds Russian recovery, CTA, and empty-state copy for resource-pack and shader guided surfaces.
- `src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx` - proves named local recovery, named remote duplicate recovery, and shader runtime-blocked recovery.
- `src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx` - locks content-type-specific guided empty-state and CTA copy.
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx` - proves unavailable installed-state tabs keep the guided add route as the next step.

## Decisions Made

- Mod installs intentionally stay on the existing throw-based path so the shared add-mod modal is not reopened while Phase 31 is focused on non-mod guided surfaces.
- Guided non-mod recovery is productized as grouped inline copy plus preserved failed selections, not as another toast-only surface or a broad per-row error UI.
- The installed-state tabs only expose the guided add route as a next step during unavailable states; they do not reintroduce direct OS picker primacy.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Corrected the new non-mod install helper after the first typecheck pass**
- **Found during:** Wave 6 verification
- **Issue:** The platform helper rethrew an undefined `error` symbol on the legacy mod path after the new guided-content catch block was introduced.
- **Fix:** Restored the catch variable and reran the exact Wave 6 verification command.
- **Files modified:** `electron/services/mods/platform/modPlatformService.ts`
- **Verification:** `npx vitest run src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx && npx tsc --noEmit`
- **Committed in:** not committed (dirty worktree overlap in plan-owned files)

---

**Total deviations:** 1 auto-fixed (1 blocking)  
**Impact on plan:** The fix stayed inside the planned non-mod install seam and did not widen scope beyond actionable recovery.

## Issues Encountered

- Manual walkthrough was not completed in this noninteractive execution environment. The Wave 6 automated gate passed, but the plan’s required human check of one resource-pack failure and one shader failure staying on-surface remains a residual gap.
- Atomic task commit was intentionally skipped because plan-owned files already overlapped with pre-existing dirty worktree state, including `src/components/modpacks/AddModPage.tsx`, `electron/services/mods/platform/modPlatformService.ts`, `electron/services/mods/platform/types.ts`, `src/locales/en.json`, `src/locales/ru.json`, `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/REQUIREMENTS.md`, `docs/en/roadmap.md`, and `docs/ru/roadmap.md`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wave 7 can now focus on manual-proof and closeout harness work without reopening guided failure UX.
- Resource-pack and shader guided surfaces now expose one consistent recovery model across local import, remote install, and installed-state unavailable seams.
- The remaining Phase 31 scope is now limited to proof and final bounded-scope closeout rather than product behavior churn.

## Self-Check: PASSED

- Verified `31-06-SUMMARY.md` and `src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx` exist on disk.
- Verified the Wave 6 automated gate passed: `npx vitest run src/components/modpacks/__tests__/ContentInstallRecovery.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPlaceholderTruth.test.tsx src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx && npx tsc --noEmit`.
- Task and metadata commits were intentionally skipped because the relevant files were already dirty before execution, so there are no new commit hashes to verify for this plan.
