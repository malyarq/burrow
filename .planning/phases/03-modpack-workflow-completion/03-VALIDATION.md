---
phase: 3
slug: modpack-workflow-completion
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + `@testing-library/react` for renderer state seams, plus Node-style Vitest service tests for Electron/backend logic |
| **Config file** | Existing `vitest.config.ts` and `tests/setup/vitest.setup.ts` from Phase 2 |
| **Quick run command** | active plan's exact `npx vitest run ...` command |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` |
| **Estimated runtime** | targeted checks: 10-40s; full suite: ~90-240s |

---

## Execution Map

| Wave | Plans | Focus |
|------|-------|-------|
| 1 | `03-01`, `03-02` | Preserve modpack-browser state across navigation and expose metadata-safe duplicate/rename actions from installed cards |
| 2 | `03-03` | Finish history and pagination correctness on top of the preserved browser-state contract |

---

## Sampling Rate

- **After every task:** Run that task's exact `<verify>` command before moving on.
- **After every completed plan:** Run the plan's full `<verification>` checklist, not just the last task check.
- **After Wave 1:** Run `npm test && npx tsc --noEmit`.
- **After Wave 2 / before `$gsd-verify-work`:** Run `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never`.
- **Max feedback latency:** 40 seconds for targeted test slices, 240 seconds for the full phase gate.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-T1 | 03-01 | 1 | FLOW-03, FLOW-04 | renderer state / navigation tests | `npx vitest run src/features/modpacks/__tests__/modpackNavigationState.test.tsx` | ❌ W0 | ⬜ pending |
| 03-01-T2 | 03-01 | 1 | FLOW-03, FLOW-04 | renderer route-roundtrip tests | `npx vitest run src/features/modpacks/__tests__/modpackNavigationState.test.tsx && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 03-02-T1 | 03-02 | 1 | FLOW-01, FLOW-02 | backend metadata preservation tests | `npx vitest run electron/services/instances/__tests__/instanceMetadataCrud.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-T2 | 03-02 | 1 | FLOW-01, FLOW-02 | renderer action-surface checks + backend tests | `npx vitest run electron/services/instances/__tests__/instanceMetadataCrud.test.ts && npx eslint src/components/modpacks/ModpackList.tsx src/components/modpacks/ModpackDetails.tsx src/components/modpacks/details/ModpackDetailsActions.tsx electron/services/instances/instanceService.ts electron/services/modpacks/storage.ts` | ❌ W0 | ⬜ pending |
| 03-03-T1 | 03-03 | 2 | FLOW-03 | renderer history-state tests | `npx vitest run src/components/modpacks/__tests__/ModpackBrowser.history.test.tsx` | ❌ W0 | ⬜ pending |
| 03-03-T2 | 03-03 | 2 | FLOW-04 | backend pagination correctness tests | `npx vitest run electron/services/mods/platform/__tests__/modPlatformService.pagination.test.ts` | ❌ W0 | ⬜ pending |
| 03-03-T3 | 03-03 | 2 | FLOW-03, FLOW-04 | final release gate | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing Vitest infrastructure from Phase 2 covers framework setup and alias resolution
- [x] Existing `npm test` command remains the entrypoint for all new automated checks
- [x] No new test runner or browser-E2E framework is required for this phase

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Duplicate and rename from an explicit installed-card action surface | FLOW-01, FLOW-02 | Card affordance, prompt behavior, and toast UX are renderer-visible behaviors not fully proven by service tests alone | Open the modpack list, trigger rename and duplicate from the shipped card action surface, confirm the list updates without using the details view |
| Return from install/details to the same browser query, filters, page, and history toggle state | FLOW-03, FLOW-04 | Full route transitions and browser UX continuity are more trustworthy with one manual smoke | Open the browser, change search/filter/page settings, enter install or details, go back, and confirm the browser returns to the prior state without a full reload |
| Reopen a recent-history entry from the browser UI | FLOW-03 | The renderer interaction between history mode and result navigation is user-flow specific | View at least one modpack, open history, reopen the item, then return and confirm the browser state remains coherent |

---

## Validation Sign-Off

- [x] All tasks have automated verification or explicit manual-only justification
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Existing infrastructure covers all framework prerequisites
- [x] No watch-mode flags
- [x] Feedback latency < 240s at the phase gate and < 40s at the task level
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
