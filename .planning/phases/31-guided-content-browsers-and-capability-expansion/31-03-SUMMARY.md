---
phase: 31-guided-content-browsers-and-capability-expansion
plan: "03"
subsystem: ui
tags: [react, modpacks, resource-packs, shaders, navigation]
requires:
  - phase: 31-guided-content-browsers-and-capability-expansion
    provides: non-mod finalize truth and config-first shader capability groundwork from 31-02
provides:
  - canonical in-app guided entry for resource packs from both classic and details surfaces
  - canonical in-app guided entry for shaders from both classic and details surfaces
  - regression coverage for queued route handoff and resource-pack guided-entry state
affects: [CONTENT-01, CONTENT-05, guided-content-browser, simple-dashboard, modpack-route-shell]
tech-stack:
  added: []
  patterns: [queued initial modpack view handoff between launcher modes]
key-files:
  created: [src/components/modpacks/__tests__/GuidedContentEntry.test.tsx, src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx]
  modified: [src/components/SimplePlayDashboard.tsx, src/components/modpacks/ModpackRouter.tsx, src/features/modpacks/hooks/useModpackNavigation.ts, src/components/modpacks/__tests__/AddModPage.layout.test.tsx]
key-decisions:
  - "Classic dashboard guided-content actions queue a one-shot modpack view instead of introducing a broader cross-shell router state."
  - "Classic mode routes directly to add-resource-pack and add-shader views because the hidden classic instance does not have a normal details route to return to."
patterns-established:
  - "Queued guided-entry pattern: launcher surfaces outside ModpackRouter can seed the next router mount with a normalized initial view and let the route shell own the rest of the flow."
requirements-completed: [CONTENT-01, CONTENT-05]
duration: 13min
completed: 2026-04-21
---

# Phase 31 Plan 03: Canonical Guided Entry Summary

**Classic dashboard and modpack details now converge on the same in-app guided browser route for resource packs and shaders, instead of defaulting classic users into direct OS file pickers.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-04-20T22:21:00Z
- **Completed:** 2026-04-20T22:34:06Z
- **Tasks:** 1
- **Files modified:** 6

## Accomplishments
- Replaced classic dashboard resource-pack and shader add actions with a queued handoff into `ModpackRouter`, so both high-traffic entry surfaces now land on the same guided route shell.
- Kept the existing route-owned details actions intact while proving that resource-pack and shader entry still resolves to `AddModPage` with the correct bounded content type.
- Added focused regression coverage for the queued guided-entry seam, resource-pack guided buttons, and resource-pack route filters.

## Task Commits

1. **Task 1: Rewire dashboard and details actions into one canonical guided-browser entry** - `300a6e8` (`feat`)

**Plan metadata:** not committed because `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `docs/en/roadmap.md`, and `docs/ru/roadmap.md` already had unrelated local edits before this plan executed.

## Files Created/Modified
- `src/components/SimplePlayDashboard.tsx` - queues resource-pack and shader guided-entry intents instead of invoking direct OS file pickers from classic mode.
- `src/features/modpacks/hooks/useModpackNavigation.ts` - adds the one-shot queued initial-view seam consumed by the modpack route shell.
- `src/components/modpacks/ModpackRouter.tsx` - starts from a queued guided-entry view when classic mode hands off into modpacks mode.
- `src/components/modpacks/__tests__/GuidedContentEntry.test.tsx` - proves dashboard and details entry surfaces converge on the same guided route types.
- `src/components/modpacks/__tests__/AddModPage.layout.test.tsx` - locks resource-pack guided browsing to instance-scoped filters without modloader chrome.
- `src/components/modpacks/details/__tests__/ResourcePacksTab.guided-state.test.tsx` - proves both populated and empty resource-pack states use the guided-browser callback.

## Decisions Made
- A queued initial view is enough for classic-to-modpacks handoff; persistent shared navigation state would be broader than this plan needs.
- The hidden classic instance should enter guided add routes directly, because forcing a detour through normal details would overfit a surface that does not exist for classic mode.
- Existing details navigation stays unchanged so the route shell remains the canonical owner of resource-pack and shader acquisition.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Manual walkthrough was not completed in this noninteractive execution environment. Automated route and layout verification passed, but interactive proof remains a residual gap for a later manual session if strict human walkthrough evidence is required.
- Metadata commit was intentionally skipped because `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `docs/en/roadmap.md`, and `docs/ru/roadmap.md` already contained unrelated local edits before this plan executed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Later Phase 31 plans can assume resource packs and shaders already share one route-owned guided entry story across classic and modpack-heavy surfaces.
- The queued initial-view seam can be reused by future bounded launcher-to-router handoffs without adding a full global router state.
- No code blocker remains for the remaining guided-browser and compatibility-guidance plans, but a manual UI walkthrough is still advisable before release signoff.

## Self-Check: PASSED

- Verified `31-03-SUMMARY.md`, `GuidedContentEntry.test.tsx`, and `ResourcePacksTab.guided-state.test.tsx` exist on disk.
- Verified task commit `300a6e8` is present in `git log`.
