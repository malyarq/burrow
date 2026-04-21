---
phase: 31-guided-content-browsers-and-capability-expansion
plan: "02"
subsystem: modpacks
tags: [modpacks, shaders, resource-packs, runtime-truth, electron]
requires:
  - phase: 31-guided-content-browsers-and-capability-expansion
    provides: typed resource-pack and shader acquisition outcomes from 31-01
provides:
  - non-mod guided installs that stay instance-scoped instead of polluting manifest.files
  - config-first shader capability inputs for later compatibility guidance
  - normalized active-shader cleanup when deleting the selected pack
affects: [CONTENT-02, CONTENT-05, guided-content-browser, runtime-summary]
tech-stack:
  added: []
  patterns: [manifest writes only for real mods, config-first shader capability with unverified fallback truth]
key-files:
  created: [src/features/modpacks/__tests__/contentManifestTruth.test.ts]
  modified: [src/components/modpacks/AddModPage.tsx, electron/services/mods/platform/modPlatformService.ts, electron/services/mods/platform/types.ts, electron/services/shaders/shaderService.ts, src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx, src/features/modpacks/hooks/useModpackRuntimeSummary.ts, src/features/modpacks/__tests__/runtimeSummary.truth.test.ts]
key-decisions:
  - "Only real mods finalize through modpacks:addMod; guided resource packs and shaders remain instance-scoped downloads."
  - "Shader capability groundwork is authoritative only when config truth is present; metadata and fallback runtime inputs stay unverified."
  - "Non-mod remote installs no longer enter instance-manifest.json as if they were mods."
patterns-established:
  - "Guided non-mod finalize pattern: install through modsIPC.installModFile, skip manifest mutation, and rely on instance folders as the durable truth."
  - "Shader capability pattern: derive supported/needs-setup/unsupported/unverified from config-backed runtime summary instead of archive presence."
requirements-completed: [CONTENT-02, CONTENT-05]
duration: 12min
completed: 2026-04-20
---

# Phase 31 Plan 02: Non-Mod Finalize Truth Summary

**Guided resource-pack and shader installs now stay instance-scoped while shader capability groundwork comes from config-backed runtime truth instead of mod-manifest or active-file guesswork.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-20T22:08:18Z
- **Completed:** 2026-04-20T22:20:05Z
- **Tasks:** 1
- **Files modified:** 8

## Accomplishments
- Gated the real guided finalize seam in `AddModPage` so only `contentType='mod'` writes into `manifest.files`; resource packs and shaders now stop at the instance install path.
- Stopped non-mod platform installs from being recorded in `instance-manifest.json` as fake mods, and normalized active shader state when the selected shader pack is deleted.
- Extended the runtime summary with config-first shader capability inputs plus manifest-truth regression coverage for mod vs non-mod finalize behavior.

## Task Commits

1. **Task 1: Remove accidental mod-manifest coupling and expose shader capability groundwork from runtime truth** - not committed

**Plan metadata:** not committed because `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` already had unrelated local edits before this plan executed.

## Files Created/Modified
- `src/components/modpacks/AddModPage.tsx` - gates manifest finalization to real mods while keeping the existing instance-scoped install flow for resource packs and shaders.
- `electron/services/mods/platform/modPlatformService.ts` - skips instance-manifest mod tracking for non-mod content installs.
- `electron/services/mods/platform/types.ts` - centralizes the manifest-managed content-type predicate used by the platform installer.
- `electron/services/shaders/shaderService.ts` - disables shaders when the active pack is deleted so active-state truth does not drift.
- `src/features/modpacks/hooks/useModpackRuntimeSummary.ts` - adds config-first shader capability inputs (`supported`, `needs-setup`, `unsupported`, `unverified`) plus requested-vs-effective OptiFine truth.
- `src/features/modpacks/__tests__/runtimeSummary.truth.test.ts` - locks the new shader capability semantics on config, metadata fallback, unsupported OptiFine, and setup-required paths.
- `src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx` - preserves the real mod finalize behavior during mixed-success recovery.
- `src/features/modpacks/__tests__/contentManifestTruth.test.ts` - proves resource packs and shaders skip `modpacks:addMod` while real mods still finalize into `manifest.files`.

## Decisions Made
- Manifest mutation remains a mod-only concern for Phase 31; non-mod content stays installed per instance and does not become a hidden runtime dependency.
- Shader capability groundwork should distinguish config-backed truth from metadata or fallback guesses so later UI guidance does not overclaim support.
- Active shader cleanup belongs in the shader service, not the renderer, because stale `optionsshaders.txt` state is a persistence concern.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reworked the new manifest-truth spec to match the plan’s `.ts` test seam**
- **Found during:** Task 1 (non-mod finalize/runtime truth implementation)
- **Issue:** `contentManifestTruth.test.ts` initially used JSX in a `.ts` file and fake timers stalled `waitFor`, so the verification gate could not run.
- **Fix:** Rewrote the test to use `React.createElement(...)` and the repo’s existing real-time debounce pattern for `AddModPage`.
- **Files modified:** `src/features/modpacks/__tests__/contentManifestTruth.test.ts`
- **Verification:** `npx vitest run src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/features/modpacks/__tests__/contentManifestTruth.test.ts`
- **Committed in:** not committed (dirty worktree overlap in plan-owned files)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was limited to the new verification seam. Product scope and implementation boundaries stayed unchanged.

## Issues Encountered

- Atomic task commit was intentionally skipped because the worktree was already dirty in this plan’s seam before execution: `src/components/modpacks/AddModPage.tsx` already had unrelated local edits, and `src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx` was already untracked.
- Metadata commit was also intentionally skipped because `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` already contained unrelated local edits before this plan executed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wave 3 can now make the guided browser canonical without re-litigating whether non-mod installs belong in `manifest.files`.
- Later shader UI work can read `shaderCapability` from `buildModpackRuntimeSummary()` and keep metadata/fallback-only states explicitly unverified.
- No shared contracts, preload bridges, or renderer IPC wrappers were reopened in this plan.

## Self-Check: PASSED

- Verified `31-02-SUMMARY.md` exists on disk.
- Verified the required Wave 2 gate passed: `npx vitest run src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/features/modpacks/__tests__/contentManifestTruth.test.ts` and `npx tsc --noEmit`.
- Task and metadata commits were intentionally skipped because the relevant files were already dirty before execution, so there are no new commit hashes to verify for this plan.
