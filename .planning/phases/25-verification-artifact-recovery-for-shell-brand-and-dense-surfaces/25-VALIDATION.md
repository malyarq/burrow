---
phase: 25
slug: verification-artifact-recovery-for-shell-brand-and-dense-surfaces
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-19
---

# Phase 25 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | shell checks (`test`, `rg`, `git diff --check`) |
| **Config file** | none — docs-only audit recovery phase |
| **Quick run command** | `test -f .planning/v0.5.0-MILESTONE-AUDIT.md && test -f .planning/ROADMAP.md && test -f .planning/REQUIREMENTS.md && rg -n "Phase 25|Phase 26|Pending" .planning/ROADMAP.md .planning/REQUIREMENTS.md` |
| **Full suite command** | `test -f .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md && test -f .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md && test -f .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md && rg -n "SHELL-01|SHELL-02|SHELL-03|SHELL-04|BRAND-01|BRAND-02|BRAND-03|DENSE-01|DENSE-02|DENSE-03|DENSE-04" .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md .planning/REQUIREMENTS.md && git diff --check -- .planning/ROADMAP.md .planning/REQUIREMENTS.md .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run the plan-specific proof command for the verification artifact being touched.
- **After every plan wave:** Run the currently executable phase suite; after the final wave, run the full suite command above.
- **Before `$gsd-verify-work`:** All three recovered `VERIFICATION.md` files must exist, every Phase 25 requirement must be referenced in recovered proof, and `git diff --check` must be clean.
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 25-01-01 | 01 | 1 | SHELL-01, SHELL-02, SHELL-03 | verification artifact recovery | `test -f .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-04-SUMMARY.md && test -f .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VALIDATION.md && rg -n "SHELL-01|SHELL-02|SHELL-03" .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md` | ❌ planned | ⬜ pending |
| 25-02-01 | 02 | 1 | BRAND-01, BRAND-02, BRAND-03 | verification artifact recovery | `test -f .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-04-SUMMARY.md && test -f .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VALIDATION.md && rg -n "BRAND-01|BRAND-02|BRAND-03" .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md` | ❌ planned | ⬜ pending |
| 25-03-01 | 03 | 2 | SHELL-04, DENSE-01, DENSE-02, DENSE-03, DENSE-04 | verification artifact recovery | `test -f .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-04-SUMMARY.md && test -f .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VALIDATION.md && rg -n "SHELL-04|DENSE-01|DENSE-02|DENSE-03|DENSE-04" .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md` | ❌ planned | ⬜ pending |
| 25-04-01 | 04 | 3 | SHELL-01, SHELL-02, SHELL-03, SHELL-04, BRAND-01, BRAND-02, BRAND-03, DENSE-01, DENSE-02, DENSE-03, DENSE-04 | focused closeout matrix | `test -f .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md && test -f .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md && test -f .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md && rg -n "SHELL-01|SHELL-02|SHELL-03|SHELL-04|BRAND-01|BRAND-02|BRAND-03|DENSE-01|DENSE-02|DENSE-03|DENSE-04" .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md .planning/REQUIREMENTS.md && git diff --check -- .planning/REQUIREMENTS.md .planning/ROADMAP.md .planning/phases/19-baseline-stability-scope-and-shell-invariants/19-VERIFICATION.md .planning/phases/20-brand-system-shared-tokens-and-surface-migration/20-VERIFICATION.md .planning/phases/21-dense-surface-ia-navigation-and-cta-hierarchy/21-VERIFICATION.md` | ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
