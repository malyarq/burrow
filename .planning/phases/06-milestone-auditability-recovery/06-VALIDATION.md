---
phase: 6
slug: milestone-auditability-recovery
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Planning-artifact verification plus the existing FMCL repo-wide release gate |
| **Config file** | `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/v1.0-MILESTONE-AUDIT.md`, existing `vitest.config.ts`, and repo quality scripts |
| **Quick run command** | targeted `test -f ...`, `rg ...`, and `node "$HOME/.codex/get-shit-done/bin/gsd-tools.cjs" roadmap analyze` checks tied to the active task |
| **Full suite command** | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check` followed by `$gsd-audit-milestone` |
| **Estimated runtime** | targeted checks: 5-30s; full suite plus audit: ~120-300s |

---

## Execution Map

| Wave | Plans | Focus |
|------|-------|-------|
| 1 | `06-01`, `06-02` | Close the concrete milestone gaps, then reconstruct phase verification artifacts and requirement evidence |
| 2 | `06-03` | Re-run milestone audit, confirm gap closure, and prepare archival readiness |

---

## Sampling Rate

- **After every task:** Run the task’s exact `<verify>` command before moving on.
- **After every completed plan:** Run the plan’s full `<verification>` checklist.
- **After Wave 1:** Verify all expected `VERIFICATION.md` files exist and `REQUIREMENTS.md` reflects the updated verified status.
- **After Wave 2 / before milestone closeout:** Run `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check`, then re-run `$gsd-audit-milestone`.
- **Max feedback latency:** 30 seconds for artifact checks and 300 seconds for the full gate plus audit.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-T1 | 06-01 | 1 | FLOW-05, DLVR-01, DLVR-02, DOC-01 | targeted service and renderer regression checks | `npx vitest run electron/services/download/__tests__/downloadFallback.test.ts src/components/ui/__tests__/LazyImage.cache.test.tsx && npx tsc --noEmit` | ✅ | ⬜ pending |
| 06-02-T1 | 06-02 | 1 | REL-01, REL-02, TEST-01, TEST-02, FLOW-01, FLOW-02, FLOW-03, FLOW-04, FLOW-05, ACCT-01, DLVR-01, DLVR-02, DLVR-03, STAT-01, STAT-02, A11Y-01, A11Y-02, A11Y-03, DOC-01, DOC-02, SEC-01, SEC-02, SEC-03 | artifact existence and requirement-evidence reconstruction | `test -f .planning/phases/01-release-baseline-and-trust-boundaries/01-VERIFICATION.md && test -f .planning/phases/02-automated-release-verification/02-VERIFICATION.md && test -f .planning/phases/03-modpack-workflow-completion/03-VERIFICATION.md && test -f .planning/phases/04-delivery-cache-accounts-and-stats-hardening/04-VERIFICATION.md && test -f .planning/phases/05-accessibility-and-release-truthfulness/05-VERIFICATION.md` | ❌ W0 | ⬜ pending |
| 06-03-T1 | 06-03 | 2 | REL-01, REL-02, TEST-01, TEST-02, FLOW-01, FLOW-02, FLOW-03, FLOW-04, FLOW-05, ACCT-01, DLVR-01, DLVR-02, DLVR-03, STAT-01, STAT-02, A11Y-01, A11Y-02, A11Y-03, DOC-01, DOC-02, SEC-01, SEC-02, SEC-03 | repo-wide release gate plus milestone re-audit | `npm test && npm run lint && npx tsc --noEmit && npm run contracts:check && npm run ipc:check` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing repo-wide test, lint, typecheck, contracts, and IPC checks already exist
- [ ] runtime mirror/provider flows honor persisted mirror priority across launcher and version-discovery paths
- [ ] remaining modpack and mod imagery surfaces route remote icons through `LazyImage`
- [ ] `.planning/phases/01-release-baseline-and-trust-boundaries/01-VERIFICATION.md` — missing phase verification artifact
- [ ] `.planning/phases/02-automated-release-verification/02-VERIFICATION.md` — missing phase verification artifact
- [ ] `.planning/phases/03-modpack-workflow-completion/03-VERIFICATION.md` — missing phase verification artifact
- [ ] `.planning/phases/04-delivery-cache-accounts-and-stats-hardening/04-VERIFICATION.md` — missing phase verification artifact
- [ ] `.planning/phases/05-accessibility-and-release-truthfulness/05-VERIFICATION.md` — missing phase verification artifact

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Re-audited milestone reads as genuinely closed instead of merely reworded | all Phase 6 requirements | The audit outcome still requires a human sanity check against the evidence captured in the new `VERIFICATION.md` files and `REQUIREMENTS.md` roll-forward | After execution, read `.planning/v1.0-MILESTONE-AUDIT.md`, confirm no orphaned or unsatisfied requirements remain, and verify the evidence cited in each phase verification matches the shipped work |

---

## Validation Sign-Off

- [x] All tasks have automated verification or explicit manual-only justification
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Existing infrastructure covers framework prerequisites
- [x] No watch-mode flags
- [x] Feedback latency < 300s at the phase gate and < 30s at the task level
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
