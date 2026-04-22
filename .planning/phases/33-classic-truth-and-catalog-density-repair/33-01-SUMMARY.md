---
phase: 33-classic-truth-and-catalog-density-repair
plan: "01"
subsystem: ui
tags: [react, typescript, classic-mode, sidebar, runtime-truth, i18n, vitest]
requires:
  - phase: 32-shell-identity-and-sidebar-cohesion
    provides: startup gating that keeps classic launch state blocked until persisted config truth resolves
provides:
  - classic sidebar runtime summary sourced from the launch model instead of stale visible fallbacks
  - short vanilla loader wording across classic renderer surfaces
  - dedicated sidebar truth regression coverage for MODPACK-07
affects: [classic-launcher-home, sidebar, launch-surface, runtime-labels, MODPACK-07]
tech-stack:
  added: []
  patterns:
    - classic renderer labels should derive from the authoritative launch model, not metadata or UI fallback state
    - sidebar truth seams get narrow renderer tests instead of relying only on provider-level startup gating
key-files:
  created:
    - src/components/__tests__/Sidebar.classic-truth.test.tsx
  modified:
    - src/components/Sidebar.tsx
    - src/components/SimplePlayDashboard.tsx
    - src/components/sidebar/modpackRuntimeDependencies.ts
    - src/locales/en.json
    - src/locales/ru.json
key-decisions:
  - "Classic visible runtime labels now come from the App launch model plus persisted loader version data instead of the dashboard fallback path."
  - "The shared vanilla loader copy was shortened to 'Vanilla' so classic state reads as a factual label rather than an explanation."
  - "Per-task git commits were skipped in this turn because the worktree was already dirty and another wave agent was operating in parallel on the same repository."
patterns-established:
  - "Classic truth surface: show a compact runtime summary in the sidebar and reuse shared runtime-label helpers for dashboard copy."
  - "Regression pattern: explicit assertions for both truthful version text and absence of legacy wording."
requirements-completed: [MODPACK-07]
duration: 9min
completed: 2026-04-22
---

# Phase 33 Plan 01: Classic Truth Summary

**Classic sidebar and launch summary now show the persisted runtime target with short vanilla wording, backed by a dedicated sidebar truth regression seam**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-22T10:34:00Z
- **Completed:** 2026-04-22T10:42:51Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Added a compact classic runtime summary to the sidebar so the first read-before-launch seam shows the selected Minecraft version and loader directly.
- Switched classic dashboard labels to the authoritative launch model for visible runtime data and removed the old visible fallback path from that surface.
- Shortened vanilla loader wording to `Vanilla` in both locales and added a focused sidebar regression test that fails on stale `1.12.2` or `Vanilla (no modloader)` output.

## Task Commits

Per-task commits were intentionally skipped for safety in this turn.

1. **Task 1: Shorten classic runtime wording and remove any leftover stale-source fallback at the visible surface** - not committed
2. **Task 2: Add a dedicated classic sidebar truth seam** - not committed

**Commit decision:** Atomic commits were not safe to create because this branch already had a large dirty baseline and another wave agent was working in parallel on the same repository. Using the shared git index could have staged or committed unrelated changes.

## Files Created/Modified
- `src/components/Sidebar.tsx` - adds the classic runtime summary box and derives its loader label from the selected launch state
- `src/components/SimplePlayDashboard.tsx` - uses the launch model for classic version/loader labels and default content-runtime values
- `src/components/sidebar/modpackRuntimeDependencies.ts` - shortens vanilla wording and adds a reusable loader-label helper with optional version suffix
- `src/locales/en.json` - updates English vanilla wording and adds the sidebar runtime label
- `src/locales/ru.json` - updates Russian locale entries for the same sidebar/runtime copy
- `src/components/__tests__/Sidebar.classic-truth.test.tsx` - locks the classic sidebar seam against stale fallback values and legacy vanilla wording

## Decisions Made
- Kept the runtime truth fix local to the classic renderer surfaces instead of changing the broader modpack runtime summary hook, because this plan only owned the classic read-before-launch seam.
- Preserved loader version display when it is present in persisted config, but stopped letting the dashboard surface depend on metadata/fallback resolution for its user-facing runtime labels.
- Skipped `.planning/STATE.md` and `.planning/ROADMAP.md` updates because the user requested centralized integration while another wave agent is running.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Completed the new sidebar test fixture with a full `MCVersion` shape**
- **Found during:** Task 2 verification
- **Issue:** `npx tsc --noEmit` failed because the new test only provided `id` and `type`, while `MCVersion` also requires `url`, `time`, and `releaseTime`.
- **Fix:** Expanded the mocked version fixture in `src/components/__tests__/Sidebar.classic-truth.test.tsx` to satisfy the strict type.
- **Files modified:** `src/components/__tests__/Sidebar.classic-truth.test.tsx`
- **Verification:** `npx vitest run src/contexts/__tests__/ModpackContext.startup-truth.test.ts src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/Sidebar.classic-truth.test.tsx`; `npx tsc --noEmit`
- **Committed in:** not committed; left in working tree for commit safety

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was required to keep the new regression seam compatible with strict TypeScript. No product scope drift.

## Issues Encountered
- The repo already contained many unrelated local modifications and a parallel wave agent was active, so git commits and shared planning-file updates were treated as unsafe for this turn.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Classic renderer truth is covered at the provider seam and now at the sidebar/dashboard seam, so the next plans in Phase 33 can build on a stable launch-state presentation baseline.
- Manual cold-start verification was not run interactively in this turn. With workflow auto-advance enabled, it was treated as auto-approved rather than blocking completion.

## Verification

- `npx vitest run src/contexts/__tests__/ModpackContext.startup-truth.test.ts src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx src/components/__tests__/Sidebar.classic-truth.test.tsx`
- `npx eslint src/components/Sidebar.tsx src/components/SimplePlayDashboard.tsx src/components/sidebar/modpackRuntimeDependencies.ts src/components/__tests__/Sidebar.classic-truth.test.tsx`
- `npx tsc --noEmit`

## Self-Check: PASSED

- Summary file created at `.planning/phases/33-classic-truth-and-catalog-density-repair/33-01-SUMMARY.md`
- All plan-owned source and test files referenced above exist in the working tree
- Shared planning files were intentionally left untouched per user instruction

---
*Phase: 33-classic-truth-and-catalog-density-repair*
*Completed: 2026-04-22*
