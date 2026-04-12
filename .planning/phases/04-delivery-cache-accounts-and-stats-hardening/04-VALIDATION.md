---
phase: 4
slug: delivery-cache-accounts-and-stats-hardening
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest for Electron service tests and jsdom renderer tests via `@testing-library/react` |
| **Config file** | Existing `vitest.config.ts` and `tests/setup/vitest.setup.ts` from Phase 2 |
| **Quick run command** | active plan's exact `npx vitest run ...` command |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` |
| **Estimated runtime** | targeted checks: 10-50s; full suite: ~90-240s |

---

## Execution Map

| Wave | Plans | Focus |
|------|-------|-------|
| 1 | `04-01`, `04-02` | Establish persistent image-cache behavior and supported custom-account skin management |
| 2 | `04-03`, `04-04` | Land mirror priority/fallback resilience and richer statistics/export flows |
| 3 | `04-05` | Close the full phase under the repo-wide release gate |

---

## Sampling Rate

- **After every task:** Run that task's exact `<verify>` command before moving on.
- **After every completed plan:** Run the plan's full `<verification>` checklist, not just the last task check.
- **After Wave 1:** Run `npm test && npx tsc --noEmit`.
- **After Wave 2 / before Wave 3:** Run `npm test && npm run lint && npx tsc --noEmit`.
- **After Wave 3 / before `$gsd-verify-work`:** Run `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never`.
- **Max feedback latency:** 50 seconds for targeted slices, 240 seconds for the full phase gate.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-T1 | 04-01 | 1 | FLOW-05 | Electron cache service tests | `npx vitest run electron/services/cache/__tests__/imageCacheService.test.ts` | ❌ W0 | ⬜ pending |
| 04-01-T2 | 04-01 | 1 | FLOW-05 | renderer cached-image tests | `npx vitest run src/components/ui/__tests__/LazyImage.cache.test.tsx` | ❌ W0 | ⬜ pending |
| 04-02-T1 | 04-02 | 1 | ACCT-01 | provider-aware account skin service tests | `npx vitest run electron/services/account/__tests__/skinProviders.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-T2 | 04-02 | 1 | ACCT-01 | account skin renderer tests | `npx vitest run src/features/accounts/__tests__/AccountSkinsPage.test.tsx` | ❌ W0 | ⬜ pending |
| 04-03-T1 | 04-03 | 2 | DLVR-01, DLVR-02 | mirror priority and fallback service tests | `npx vitest run electron/services/mirrors/__tests__/mirrorPriority.test.ts` | ❌ W0 | ⬜ pending |
| 04-03-T2 | 04-03 | 2 | DLVR-02, DLVR-03 | download fallback and integrity tests | `npx vitest run electron/services/download/__tests__/downloadFallback.test.ts` | ❌ W0 | ⬜ pending |
| 04-04-T1 | 04-04 | 2 | STAT-01, STAT-02 | statistics service analytics and export tests | `npx vitest run electron/services/stats/__tests__/statisticsService.analytics.test.ts` | ❌ W0 | ⬜ pending |
| 04-04-T2 | 04-04 | 2 | STAT-01, STAT-02 | statistics UI tests | `npx vitest run src/features/settings/statistics/__tests__/StatisticsTab.test.tsx` | ❌ W0 | ⬜ pending |
| 04-05-T1 | 04-05 | 3 | FLOW-05, ACCT-01, DLVR-01, DLVR-02, DLVR-03, STAT-01, STAT-02 | final release gate | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check && npm run build -- --publish never` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing Vitest infrastructure from Phase 2 covers framework setup, aliases, and jsdom opt-in
- [ ] `electron/services/cache/__tests__/imageCacheService.test.ts` — new cache service coverage
- [ ] `src/components/ui/__tests__/LazyImage.cache.test.tsx` — cached renderer image coverage
- [ ] `electron/services/account/__tests__/skinProviders.test.ts` — supported provider behavior coverage
- [ ] `src/features/accounts/__tests__/AccountSkinsPage.test.tsx` — account skin UI coverage
- [ ] `electron/services/mirrors/__tests__/mirrorPriority.test.ts` — mirror ordering and priority coverage
- [ ] `electron/services/download/__tests__/downloadFallback.test.ts` — fallback and corruption rejection coverage
- [ ] `electron/services/stats/__tests__/statisticsService.analytics.test.ts` — derived statistics and export coverage
- [ ] `src/features/settings/statistics/__tests__/StatisticsTab.test.tsx` — statistics UI coverage

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cached modpack or mod icons survive launcher restart and cleanup controls free the expected space | FLOW-05 | Persistence across actual Electron restart and filesystem state is more trustworthy as a short smoke than pure mock coverage | Browse modpack and mod lists until icons load, restart the launcher, confirm images render from cache, then use cache cleanup controls and confirm size drops without breaking fallback rendering |
| Blessing Skin and LittleSkin skin update flows work against a real provider endpoint | ACCT-01 | Provider semantics and real authentication or upload behavior are better proven against a live or realistic endpoint than mocks alone | Add supported third-party accounts, open skin management, upload or change a skin, refresh the account view, and confirm preview plus persisted state update |
| Mirror priority and fallback honor user order under real network failure conditions | DLVR-01, DLVR-02, DLVR-03 | Real fallback behavior depends on network conditions and end-to-end runtime candidate selection | Configure mirror order, make the top mirror fail or return bad content, install a runtime or modpack, and confirm the launcher falls through to the next healthy mirror while rejecting the bad response |
| Statistics graphs and export are understandable from the shipped settings UI | STAT-01, STAT-02 | Presentation quality and exported file usability are UX concerns not fully captured by unit tests | Generate several launches, open Statistics settings, confirm rankings and trends read clearly, export the dataset, and validate the exported file contents manually |

---

## Validation Sign-Off

- [x] All tasks have automated verification or explicit manual-only justification
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Existing infrastructure covers framework prerequisites
- [x] No watch-mode flags
- [x] Feedback latency < 240s at the phase gate and < 50s at the task level
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
