---
phase: 27
slug: final-audit-trail-and-residual-debt-closure
status: researched
created: 2026-04-20
requirements: []
---

# Phase 27 Research

## What The Planner Needs To Know

Phase 27 is not another product phase. The milestone audit already shows:

- requirements: `23/23`
- phases with verification: `8/8`
- integration: `4/4`
- flows: `6/6`

That means the remaining work is purely about cleaning the audit trail so the final audit can return `passed` instead of `tech_debt`.

No extra repo-local instructions were found beyond `AGENTS.md`: `CLAUDE.md`, `.claude/skills/`, and `.agents/skills/` are absent.

## Audit Backlog

### 1. Validation artifacts still open

The fresh audit calls out:

- `.planning/phases/25-verification-artifact-recovery-for-shell-brand-and-dense-surfaces/25-VALIDATION.md`
- `.planning/phases/26-verification-artifact-recovery-for-theme-fallback-and-release-truth/26-VALIDATION.md`

Both still show:

- `status: draft`
- `**Approval:** pending`

If left as-is, they keep Nyquist discovery partial and will likely continue to prevent a clean `passed` verdict.

### 2. Recovered proof still contains stale residual narration

Recovered proof from Phases 19-21 and Phase 25 still narrates older pre-Phase-26 state. Examples:

- `19-VERIFICATION.md`, `20-VERIFICATION.md`, `21-VERIFICATION.md` still say their validation artifacts "carry `status: draft`"
- `25-VERIFICATION.md` still says Nyquist closure is deferred to Phase 26

That wording was accurate when Phase 25 closed, but it is no longer accurate after Phase 26 normalized `19-23` validation truth.

### 3. Two residual debt items remain in the audit

The audit still carries:

- Phase 23: file-by-file Vitest closeout because a larger batched run hit local heap OOM
- Phase 24: pre-existing renderer chunk warning during production build

These are not requirement blockers and the integration review marked the milestone flows clean. Phase 27 therefore needs to decide whether to:

- actually resolve them, or
- explicitly retire them from milestone debt with evidence strong enough for a clean final audit

The second route is usually better unless a fix is cheap and well-bounded.

## Constraints

### Keep scope cleanup-only

Phase 27 should avoid reopening launcher implementation. The current milestone truth already says:

- core product work is complete
- proof recovery is complete
- only archive-friction remains

That means the phase should stay primarily on:

- `*-VALIDATION.md`
- `*-VERIFICATION.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- the final rerun audit artifact, if needed during closeout

### Avoid creating fresh cleanup debt

Because the audit now includes Phase 27 itself once it exists, Phase 27 must not leave:

- `27-VALIDATION.md` as `draft`
- vague residual language in `27-VERIFICATION.md`
- roadmap truth that still points backward to recovery instead of forward to archive

### Do not reset requirements

`REQUIREMENTS.md` is already correct:

- all v0.5.0 requirements are checked off
- all traceability rows point to completed gap-closure phases

Phase 27 has no new requirement IDs and should not reopen checkbox truth.

## Recommended Phase Shape

The smallest coherent plan is four cleanup plans across three waves:

### Wave 1

1. Normalize `25-VALIDATION.md` and `26-VALIDATION.md` to retrospective-complete status.
2. Refresh stale residual prose in recovered Phase `19-21` and Phase `25` verification docs.

These can run in parallel because their write sets do not overlap.

### Wave 2

3. Re-evaluate the Phase 23 and Phase 24 residuals and either resolve them or explicitly retire them from milestone debt.

This should wait for Wave 1 because the phase-level proof set should already be internally consistent before residual disposition is finalized.

### Wave 3

4. Close the phase:
   - publish `27-VERIFICATION.md`
   - normalize `27-VALIDATION.md`
   - roll planning truth to `Phase 27 complete`
   - point next step to rerunning milestone audit

## Validation Posture

This is a docs-first phase. The validation strategy should therefore stay shell-based:

- `test`
- `rg`
- `git diff --check`

Only if residual retirement truly needs fresh evidence should the phase plan call a heavier command like:

- `npx vitest run ...`
- `npm run build -- --publish never`

Those heavier commands should be bounded to the specific residual being retired, not reintroduced as a repo-wide loop.

## What Success Looks Like

After Phase 27 executes:

- `25-VALIDATION.md`, `26-VALIDATION.md`, and `27-VALIDATION.md` are all complete
- stale references to pre-Phase-26 debt are gone from recovered proof
- the Phase 23 and Phase 24 residuals no longer appear as active milestone tech debt
- planning truth points to rerunning the milestone audit
- the rerun audit should be able to return `passed`
