---
phase: 2
slug: automated-release-verification
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + `@testing-library/react` (Node-first suite, `jsdom` available for renderer-safe expansion) |
| **Config file** | `vitest.config.ts` plus test setup files created in Wave 0 |
| **Quick run command** | task-specific `npx vitest run ...` command from the active plan task |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` |
| **Estimated runtime** | targeted checks: 5-20s; full suite: ~90-240s |

---

## Execution Map

| Wave | Plans | Focus |
|------|-------|-------|
| 1 | `02-01` | Install Vitest foundation, add `npm test`, wire CI or release checks, and prove the fast lane is executable |
| 2 | `02-02`, `02-03` | Add deterministic module coverage for format/share/content and focused `modpackService` coverage |

---

## Sampling Rate

- **After every task:** Run that task's exact `<verify>` command before moving on.
- **After every completed plan:** Run the plan's full `<verification>` checklist, not just the last task check.
- **After Wave 1:** Run `npm test && npx tsc --noEmit`.
- **After Wave 2 / before `$gsd-verify-work`:** Run `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never`.
- **Max feedback latency:** 20 seconds for targeted test slices, 240 seconds for the full phase gate.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-T1 | 02-01 | 1 | TEST-01 | framework setup | `npm test -- --passWithNoTests` | ❌ W0 | ⬜ pending |
| 02-01-T2 | 02-01 | 1 | TEST-01 | command parity + smoke proof | `npm test && npx tsc --noEmit` | ✅ | ⬜ pending |
| 02-02-T1 | 02-02 | 2 | TEST-02 | pure utility tests | `npx vitest run src/utils/__tests__/format.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-T2 | 02-02 | 2 | TEST-02 | share-code round-trip and malformed-input tests | `npx vitest run electron/services/sharing/__tests__/shareService.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-T3 | 02-02 | 2 | TEST-02 | temp-directory content-store tests | `npx vitest run electron/services/content/__tests__/contentManager.test.ts` | ❌ W0 | ⬜ pending |
| 02-03-T1 | 02-03 | 2 | TEST-02 | mocked service-orchestration tests | `npx vitest run electron/services/modpacks/__tests__/modpackService.test.ts` | ❌ W0 | ⬜ pending |
| 02-03-T2 | 02-03 | 2 | TEST-01, TEST-02 | final release gate | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `02-01` owns `vitest.config.ts` and repo-wide Vitest alias wiring
- [x] `02-01` owns the `package.json` `test` script and keeps it non-watch
- [x] `02-01` enforces the fast test lane in `.github/workflows/ci.yml` and, if still needed after review, `.github/workflows/release.yml`
- [x] `02-01` lands minimal smoke coverage before broader service coverage begins
- [x] `02-01` owns any shared setup file(s) needed for mocks or `jsdom` support

---

## Manual-Only Verifications

All Phase 2 target behaviors should have automated verification. Manual smoke is optional and should not be required for sign-off.

---

## Validation Sign-Off

- [x] All tasks have automated verification or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers framework, command, and CI prerequisites
- [x] No watch-mode flags
- [x] Feedback latency < 240s at the phase gate and < 20s at the task level
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
