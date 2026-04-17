# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v0.4.0 — Launcher Truth And Product Polish

**Shipped:** 2026-04-17
**Phases:** 4 | **Plans:** 16 | **Sessions:** not explicitly tracked

### What Was Built
- Unified launch-state truth with branded fallback art, truthful loader summaries, localized launch copy, and visible read-only busy settings.
- Corrected modpack detail dependency semantics, readable requirement copy, and dense section navigation.
- Polished catalog fallback imagery, compact-navigation active state, and settings localization including deliberate RU/EN preset naming.
- Closed the milestone with three-view browser-backed proof and a green packaging-aware release gate.

### What Worked
- Reusing existing seams such as `LazyImage` and `manual-verification.html` kept proof and UI fixes local instead of spawning one-off harnesses.
- Focused phase suites kept the final closeout wave small; most milestone risk was already pinned to owned tests before the repo-wide gate.

### What Was Inefficient
- The lack of a standalone milestone audit meant archive prep needed a manual exception note instead of a clean audit handoff.
- Archive automation could not extract tasks or accomplishments from the current summary format, so the milestone entry and archive files required manual repair.

### Patterns Established
- Close UI polish milestones on shared browser-backed proof routes rather than creating phase-specific verification pages.
- Treat final gate fallout as release-truth-only work: fix bounded metadata or packaging blockers, but carry non-blocking warnings forward explicitly.

### Key Lessons
1. Milestone closeout stays cheaper when manual seams mount deterministic fixtures directly instead of depending on click automation or live IPC timing.
2. If archive automation depends on summary metadata, that metadata has to be part of the summary contract rather than implicit in prose sections.

### Cost Observations
- Model mix: balanced profile with executor-style workflow; exact per-model percentages are not tracked in repo artifacts.
- Sessions: not explicitly tracked in planning docs.
- Notable: the reusable manual seam cut repeated browser-setup cost across Phase 16, Phase 17, and Phase 18.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v0.2.0 | not tracked | 4 | Established shared UI system work plus reusable browser-backed manual verification |
| v0.3.0 | not tracked | 4 | Shifted from route rollout to adaptive UX hardening and truthful release-facing docs |
| v0.4.0 | not tracked | 4 | Closed a screenshot-audited polish milestone on deterministic proof seams and a bounded final gate |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v0.2.0 | Focused phase suites + manual walkthrough | not tracked | 0 |
| v0.3.0 | Repo gates + multi-size walkthrough | not tracked | 0 |
| v0.4.0 | `55` test files / `133` tests on final gate | not tracked | 0 |

### Top Lessons (Verified Across Milestones)

1. Shared seams are cheaper and safer than per-surface fixes when UI truth needs to hold across multiple phases.
2. Browser-backed verification has to be part of milestone scope, not a cleanup step after coding is already considered done.
