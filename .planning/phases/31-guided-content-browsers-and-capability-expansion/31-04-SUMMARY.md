---
phase: 31-guided-content-browsers-and-capability-expansion
plan: "04"
subsystem: ui
tags: [react, modpacks, resource-packs, shaders, fallback]
requires:
  - phase: 31-guided-content-browsers-and-capability-expansion
    provides: canonical guided entry plus non-mod finalize truth from 31-02 and 31-03
provides:
  - explicit guided-route local .zip fallback for resource packs
  - explicit guided-route local .zip fallback for shaders
  - regression coverage proving fallback stays instance-scoped and secondary
affects: [CONTENT-01, CONTENT-04, guided-content-browser, add-content-route]
tech-stack:
  added: []
  patterns: [guided-route-owned local fallback using typed acquisition outcomes]
key-files:
  created: [src/components/modpacks/__tests__/GuidedContentFallback.test.tsx]
  modified: [src/components/modpacks/AddModPage.tsx, src/components/modpacks/__tests__/AddModPage.layout.test.tsx, src/locales/en.json, src/locales/ru.json, docs/en/roadmap.md, docs/ru/roadmap.md]
key-decisions:
  - "Local .zip import stays inside AddModPage for resource packs and shaders instead of restoring parent-surface picker primacy."
  - "The fallback resolves the concrete instance path first, then delegates to typed resource-pack or shader acquisition contracts."
patterns-established:
  - "Guided fallback pattern: render a subdued in-route local-import card only for non-mod content types and keep browse/search as the main surface."
requirements-completed: [CONTENT-01, CONTENT-04]
duration: 8min
completed: 2026-04-21
---

# Phase 31 Plan 04: Guided Local Fallback Summary

**Resource-pack and shader guided routes now carry their own explicit local `.zip` fallback, so users can import local files without reopening the old parent-surface picker model.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-20T22:42:10Z
- **Completed:** 2026-04-20T22:50:10Z
- **Tasks:** 1
- **Files modified:** 7

## Accomplishments
- Added a secondary local-import card inside `AddModPage` for resource-pack and shader flows, wired through `modpacksIPC.resolvePath(...)` plus the typed `resourcePacksIPC.add(...)` and `shadersIPC.add(...)` outcomes.
- Kept guided browsing primary by leaving the remote catalog search/filter shell intact and restricting the fallback to non-mod content types only.
- Added Wave 4 regression coverage for guided fallback behavior, updated the layout spec to lock the resource-pack route’s secondary fallback affordance, and aligned the mirrored roadmap docs with the shipped fallback state.

## Task Commits

1. **Task 1: Add explicit resource-pack and shader local-import fallback inside the guided browser** - not committed

**Plan metadata:** not committed because `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` already had unrelated local edits before this plan executed.

## Files Created/Modified
- `src/components/modpacks/AddModPage.tsx` - adds the secondary local `.zip` fallback card, resolves the instance path, and maps typed acquisition outcomes into on-surface notices.
- `src/components/modpacks/__tests__/GuidedContentFallback.test.tsx` - proves resource-pack and shader fallback stays inside the guided route, uses the resolved instance path, and avoids manifest writes.
- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx` - locks the resource-pack fallback card into the guided route and proves the normal mod route does not render it.
- `src/locales/en.json` - adds English fallback copy for the guided local-import affordance and recovery notices.
- `src/locales/ru.json` - adds Russian fallback copy for the guided local-import affordance and recovery notices.
- `docs/en/roadmap.md` - updates the public milestone summary so local guided fallback is described as shipped work instead of remaining scope.
- `docs/ru/roadmap.md` - updates the mirrored Russian milestone summary to reflect shipped guided fallback progress.

## Decisions Made
- The guided route remains the canonical owner of both browse and fallback flows; local import is available there as a secondary affordance, not as a competing top-level CTA.
- Local fallback stays instance-scoped by resolving the concrete modpack path first, rather than relying on ID-only renderer assumptions or reopening dashboard-level picker shortcuts.
- Non-mod manifest truth from 31-02 stays intact because the fallback imports directly into resource-pack or shader folders and never calls `modpacks:addMod`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Switched the new fallback regression spec back to real timers**
- **Found during:** Task 1 (Wave 4 fallback verification)
- **Issue:** The newly added fallback spec used fake timers, which stalled `waitFor(...)` around the promise-based local import path and blocked the verification gate.
- **Fix:** Removed fake-timer control from `GuidedContentFallback.test.tsx` so the mocked IPC promises settle under normal timers.
- **Files modified:** `src/components/modpacks/__tests__/GuidedContentFallback.test.tsx`
- **Verification:** `npx vitest run src/components/modpacks/__tests__/GuidedContentFallback.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx`
- **Committed in:** not committed (dirty worktree overlap in plan-owned files)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix stayed inside the new Wave 4 verification seam. Product scope and UI behavior remained unchanged.

## Issues Encountered

- Manual walkthrough was not completed in this noninteractive execution environment. The Wave 4 automated gate passed, but the plan’s human UI walkthrough remains a residual release-signoff gap.
- Atomic task commit was intentionally skipped because `src/components/modpacks/AddModPage.tsx`, `src/locales/en.json`, and `src/locales/ru.json` already contained unrelated baseline edits before this plan executed, so a normal file-level commit would have captured extra work outside 31-04.
- Metadata commit was also intentionally skipped because `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` were already dirty before this plan execution.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wave 5 can build shader compatibility guidance on top of a stable route that now owns both remote browsing and local fallback.
- The guided content surface now satisfies `CONTENT-04` without reopening the dashboard-level picker model as primary.
- No code blocker remains for later guided-browser compatibility or recovery work, but manual fallback walkthrough proof is still advisable before release signoff.

## Self-Check: PASSED

- Verified `31-04-SUMMARY.md` and `src/components/modpacks/__tests__/GuidedContentFallback.test.tsx` exist on disk.
- Verified the Wave 4 automated gate passed: `npx vitest run src/components/modpacks/__tests__/GuidedContentFallback.test.tsx src/components/modpacks/__tests__/AddModFlow.async-recovery.test.tsx src/components/modpacks/__tests__/AddModPage.layout.test.tsx` and `npx tsc --noEmit`.
- Task and metadata commits were intentionally skipped because the relevant files were already dirty before execution, so there are no new commit hashes to verify for this plan.
