---
phase: 31-guided-content-browsers-and-capability-expansion
plan: "05"
subsystem: ui
tags: [react, modpacks, shaders, runtime-truth, guided-content]
requires:
  - phase: 31-guided-content-browsers-and-capability-expansion
    provides: guided shader and resource-pack routes plus config-first shader capability groundwork from 31-02 through 31-04
provides:
  - honest shader capability guidance in both the guided add route and installed shader surface
  - source-aware runtime-summary copy for supported, needs-setup, unsupported, and unverified shader states
  - restrained instance-scoped resource-pack guidance that avoids fake compatibility labels
affects: [CONTENT-02, guided-content-browser, runtime-summary, classic-dashboard, modpack-details]
tech-stack:
  added: []
  patterns: [shared shader capability copy derived from runtime summary truth, instance-scoped resource-pack guidance without compatibility claims]
key-files:
  created: [src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx]
  modified: [src/components/SimplePlayDashboard.tsx, src/components/modpacks/ModpackDetails.tsx, src/features/modpacks/hooks/useModpackRuntimeSummary.ts, src/components/modpacks/AddModPage.tsx, src/components/modpacks/details/ResourcePacksTab.tsx, src/components/modpacks/details/ShadersTab.tsx, src/locales/en.json, src/locales/ru.json, src/components/modpacks/__tests__/AddModPage.layout.test.tsx, src/features/modpacks/__tests__/runtimeSummary.truth.test.ts]
key-decisions:
  - "Only config-backed runtime truth may claim supported or needs-setup shader states; metadata and launcher fallback remain explicitly unverified."
  - "The guided shader browser and installed shader tab now share one capability-copy model so FMCL does not imply certainty from catalog metadata, archive presence, or an active filename."
  - "Resource packs only get a low-claim instance-scope note in this wave; FMCL still avoids compatibility labels it cannot defend."
patterns-established:
  - "Shader capability banner pattern: derive status, label, and copy from runtime summary helpers and keep a separate caution that active or downloaded files are not proof of compatibility."
  - "Non-shader content guidance pattern: add scope or ownership notes only when the launcher has truthful local evidence, not provider-level compatibility claims."
requirements-completed: [CONTENT-02]
duration: 12min
completed: 2026-04-21
---

# Phase 31 Plan 05: Honest Shader Capability Guidance Summary

**Shader browsing and installed-state surfaces now explain supported, needs-setup, unsupported, and unverified runtime states from config-first truth instead of implying compatibility from catalog or active-file signals.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-20T22:52:39Z
- **Completed:** 2026-04-20T23:04:39Z
- **Tasks:** 1
- **Files modified:** 11

## Accomplishments
- Added shared runtime-summary helpers for shader capability labels, tone, runtime context, and source-aware explanatory copy.
- Surfaced shader capability banners in both `AddModPage` and `ShadersTab`, then threaded verified runtime data from modpack details and the classic dashboard into the installed-state surface.
- Added restrained instance-scope resource-pack guidance, created a dedicated shader compatibility spec, and extended the existing runtime-summary and add-route tests to lock the honesty rules.

## Task Commits

1. **Task 1: Surface shader capability guidance from config-first runtime truth** - not committed

**Plan metadata:** not committed because `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` already had unrelated local edits before this plan executed.

## Files Created/Modified
- `src/features/modpacks/hooks/useModpackRuntimeSummary.ts` - adds shared shader capability label, tone, runtime-context, and description helpers on top of existing config-first truth.
- `src/components/modpacks/AddModPage.tsx` - shows honest shader runtime guidance in the guided browser and keeps resource-pack guidance limited to instance scope.
- `src/components/modpacks/details/ShadersTab.tsx` - adds installed-state capability messaging that distinguishes active-file state from verified runtime support.
- `src/components/SimplePlayDashboard.tsx` - passes supported-version-aware runtime truth into the classic shader surface.
- `src/components/modpacks/ModpackDetails.tsx` - passes supported-version-aware runtime truth into the modpack-details shader surface.
- `src/components/modpacks/details/ResourcePacksTab.tsx` - adds a restrained scope note without inventing compatibility labels.
- `src/locales/en.json` - adds English copy for shader capability states, cautions, and resource-pack scope guidance.
- `src/locales/ru.json` - adds Russian copy for shader capability states, cautions, and resource-pack scope guidance.
- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx` - proves shader browsing shows honest runtime setup guidance and resource-pack browsing stays instance-scoped.
- `src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx` - proves supported, needs-setup, unsupported, and unverified shader states render correctly.
- `src/features/modpacks/__tests__/runtimeSummary.truth.test.ts` - locks the new label and description helpers to truthful runtime evidence.

## Decisions Made
- Supported-version data is only used when it exists; otherwise FMCL avoids inventing an unsupported verdict and falls back to less certain messaging.
- Shader capability copy stays tied to runtime truth, while a separate caution line covers the remaining uncertainty that individual shader packs may still fail.
- Resource-pack UX in this wave stays narrowly scoped to local-instance truth so shader compatibility work does not spill into fake pack scoring.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Re-threaded the classic dashboard shader tab through its local content-manager scope**
- **Found during:** Task 1 verification
- **Issue:** `SimplePlayDashboard` renders `ShadersTab` from `ContentManagerSection`, which could not directly see the outer `runtimeSummary` symbol after the new prop was added.
- **Fix:** Passed `runtimeSummary` into `ContentManagerSection` explicitly and forwarded it to `ShadersTab`.
- **Files modified:** `src/components/SimplePlayDashboard.tsx`
- **Verification:** `npx tsc --noEmit`
- **Committed in:** not committed (dirty worktree overlap in plan-owned files)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix stayed inside the planned shader-guidance seam and was required only to complete the new prop threading safely.

## Issues Encountered

- Manual walkthrough was not completed in this noninteractive execution environment. The Wave 5 automated gate passed, but the plan’s required human review of supported, needs-setup, unsupported, and unverified shader messaging remains a residual gap.
- Atomic task commit was intentionally skipped because required plan files already overlapped with pre-existing dirty worktree state, including `src/components/modpacks/AddModPage.tsx`, `src/features/modpacks/hooks/useModpackRuntimeSummary.ts`, `src/components/modpacks/__tests__/AddModPage.layout.test.tsx`, `src/locales/en.json`, and `src/locales/ru.json`.
- Metadata commit was also intentionally skipped because `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` were already dirty before this plan execution.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wave 6 can build recovery UX on top of shader surfaces that now describe runtime truth without overclaiming compatibility.
- The classic dashboard and modpack-details shader tabs now share the same capability language, which reduces the risk of one surface sounding more certain than the other.
- Manual validation is still advisable before release signoff so a human can judge whether the new shader-state language is clear enough in real UI context.

## Self-Check: PASSED

- Verified `31-05-SUMMARY.md` and `src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx` exist on disk.
- Verified the Wave 5 automated gate passed: `npx vitest run src/features/modpacks/__tests__/runtimeSummary.truth.test.ts src/components/modpacks/__tests__/AddModPage.layout.test.tsx src/components/modpacks/details/__tests__/ShadersTab.degraded-state.test.tsx src/components/modpacks/details/__tests__/ShadersTab.compatibility.test.tsx` and `npx tsc --noEmit`.
- Task and metadata commits were intentionally skipped because the relevant files were already dirty before execution, so there are no new commit hashes to verify for this plan.
