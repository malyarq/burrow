---
phase: 27
slug: final-audit-trail-and-residual-debt-closure
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-20
---

# Phase 27 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | shell checks (`test`, `rg`, `git diff --check`) |
| **Config file** | none — final audit-trail cleanup phase |
| **Quick run command** | `test -f .planning/v0.5.0-MILESTONE-AUDIT.md && test -f .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-CONTEXT.md && test -f .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VALIDATION.md && test -f .planning/phases/26-verification-artifact-recovery-for-theme-fallback-and-release-truth/26-VALIDATION.md && rg -n "status: tech_debt|partial_phases: \\[25, 26\\]" .planning/v0.5.0-MILESTONE-AUDIT.md` |
| **Full suite command** | `rg -n '^status: complete$' .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VALIDATION.md .planning/phases/26-verification-artifact-recovery-for-theme-fallback-and-release-truth/26-VALIDATION.md .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VALIDATION.md && rg -n '\\*\\*Approval:\\*\\* complete' .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VALIDATION.md .planning/phases/26-verification-artifact-recovery-for-theme-fallback-and-release-truth/26-VALIDATION.md .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VALIDATION.md && ! rg -n '^status: draft$|\\*\\*Approval:\\*\\* pending' .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VALIDATION.md .planning/phases/26-verification-artifact-recovery-for-theme-fallback-and-release-truth/26-VALIDATION.md .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VALIDATION.md && ! rg -n 'status: draft|deferred to Phase 26|still carries `status: draft`' .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VERIFICATION.md && test -f .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VERIFICATION.md && rg -n 'Evidence Basis|Cleanup Matrix|Audit Outcome' .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VERIFICATION.md && rg -n 'Phase 27 complete|audit milestone|complete milestone' .planning/ROADMAP.md .planning/STATE.md && git diff --check -- .planning/ROADMAP.md .planning/STATE.md .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md .planning/phases/23-fallback-error-and-placeholder-productization/23-VERIFICATION.md .planning/phases/24-verification-locale-and-release-truth/24-VERIFICATION.md .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VALIDATION.md .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VERIFICATION.md .planning/phases/26-verification-artifact-recovery-for-theme-fallback-and-release-truth/26-VALIDATION.md .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VALIDATION.md .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VERIFICATION.md` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run the plan-specific shell check for the docs touched by that task.
- **After every wave:** Run the currently executable subset of the closeout matrix; after the final wave, run the full suite command above.
- **Before milestone re-audit:** `25-VALIDATION.md`, `26-VALIDATION.md`, and `27-VALIDATION.md` must all be complete, stale residual wording must be gone from the recovered proof set, and `27-VERIFICATION.md` must exist.
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 27-01-01 | 01 | 1 | none | phase 25 validation normalization | `rg -n '^status: complete$' .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VALIDATION.md && rg -n '\\*\\*Approval:\\*\\* complete' .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VALIDATION.md && ! rg -n '^status: draft$|\\*\\*Approval:\\*\\* pending' .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VALIDATION.md` | ✅ | ⬜ pending |
| 27-01-02 | 01 | 1 | none | phase 26 validation normalization | `rg -n '^status: complete$' .planning/phases/26-verification-artifact-recovery-for-theme-fallback-and-release-truth/26-VALIDATION.md && rg -n '\\*\\*Approval:\\*\\* complete' .planning/phases/26-verification-artifact-recovery-for-theme-fallback-and-release-truth/26-VALIDATION.md && ! rg -n '^status: draft$|\\*\\*Approval:\\*\\* pending' .planning/phases/26-verification-artifact-recovery-for-theme-fallback-and-release-truth/26-VALIDATION.md` | ✅ | ⬜ pending |
| 27-02-01 | 02 | 1 | none | stale residual cleanup for recovered shell/brand/dense proof | `! rg -n 'still carries `status: draft`|deferred to Phase 26|remains a later proof-layer task' .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md` | ✅ | ⬜ pending |
| 27-02-02 | 02 | 1 | none | stale residual cleanup for phase 25 recovery proof | `! rg -n 'still carries `status: draft`|depends on Phase 26|deferred to Phase 26' .planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VERIFICATION.md` | ✅ | ⬜ pending |
| 27-03-01 | 03 | 2 | none | phase 23 residual retirement or resolution | `! rg -n 'heap OOM|local Node/Vitest heap OOM' .planning/phases/23-fallback-error-and-placeholder-productization/23-VERIFICATION.md` | ✅ | ⬜ pending |
| 27-03-02 | 03 | 2 | none | phase 24 residual retirement or resolution | `! rg -n 'renderer chunk warning|large renderer chunk warning' .planning/phases/24-verification-locale-and-release-truth/24-VERIFICATION.md` | ✅ | ⬜ pending |
| 27-04-01 | 04 | 3 | none | phase 27 verification and validation closeout | `test -f .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VERIFICATION.md && rg -n 'Evidence Basis|Cleanup Matrix|Audit Outcome' .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VERIFICATION.md && rg -n '^status: complete$' .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VALIDATION.md && rg -n '\\*\\*Approval:\\*\\* complete' .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VALIDATION.md` | ❌ planned | ⬜ pending |
| 27-04-02 | 04 | 3 | none | final planning-truth rollover | `rg -n 'Phase 27 complete' .planning/ROADMAP.md .planning/STATE.md && rg -n 'audit milestone|complete milestone' .planning/ROADMAP.md .planning/STATE.md && git diff --check -- .planning/ROADMAP.md .planning/STATE.md .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VALIDATION.md .planning/phases/27-final-audit-trail-and-residual-debt-closure/27-VERIFICATION.md` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing shell tooling is enough for the phase. No new framework is required.

---

## Manual-Only Verifications

All phase behaviors should be expressible through automated shell checks or bounded reruns of already-owned proof commands if residual retirement needs extra evidence.

---

## Validation Sign-Off

- [x] All tasks have automated verification commands
- [x] Sampling continuity is preserved across all waves
- [x] No watch-mode flags
- [x] Feedback latency < 20s for docs-only tasks
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
