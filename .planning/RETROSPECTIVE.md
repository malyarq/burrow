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

## Milestone: v0.6.0 — Feedback-Driven Stabilization And Expansion

**Shipped:** 2026-04-21
**Phases:** 4 | **Plans:** 20 | **Sessions:** not explicitly tracked

### What Was Built

- Restored native shell behavior, restrained critical shell surfaces, localized update urgency, and truthful reopen-state recovery.
- Unified modpack browse, details, runtime summary, dependency status, and create/add recovery around smaller config-first seams.
- Rebuilt settings truth around one appearance contract, one compact shell hierarchy, honest control scope, and only bounded preset-adjacent customization.
- Added first-class guided resource-pack and shader browsing with explicit local fallback, honest shader capability guidance, named recovery, and no marketplace framing.

### What Worked

- Phase-level summaries plus verification artifacts made late audit repair cheap once the missing 29 and 30 verification files were written down explicitly.
- Shared runtime truth paid off twice: it stabilized Phase 29 modpack UI and gave Phase 31 a clean source for shader capability and recovery messaging.
- Reusing the manual verification seam again kept closeout proof incremental instead of spawning yet another harness for guided content and settings.

### What Was Inefficient

- Auto-advance got execution to green code faster, but it also left manual-signoff walkthroughs as residual debt across every phase.
- Archive tooling still assumes summary frontmatter carries accomplishment one-liners and task counts; when the summaries omit them, milestone closeout needs manual repair.
- Milestone closeout on a dirty working tree weakens release confidence even when planning and tests are green.

### Patterns Established

- When a milestone is feedback-driven rather than expansion-driven, shell truth, runtime truth, and honest control scope should land before any bounded capability increase.
- Verification artifacts must be treated as milestone-owned deliverables; letting them lag behind phase execution creates avoidable archive friction later.
- Guided content flows stay trustworthy when local fallback, compatibility messaging, and recovery all stay on the same route-owned surface.

### Key Lessons

1. Config-first truth seams are multiplicative: they reduce drift in the current phase and make later bounded expansion much easier to reason about.
2. Auto-approved manual proof is acceptable for execution flow, but milestone release signoff still needs an explicit clean-snapshot policy if tags or archives will represent the shipped build.

### Cost Observations

- Model mix: balanced profile with executor-style workflow; exact per-model percentages are not tracked in repo artifacts.
- Sessions: not explicitly tracked in planning docs.
- Notable: the same proof seam and focused phase suites scaled from shell cleanup through guided-content closeout without requiring new test infrastructure.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v0.2.0 | not tracked | 4 | Established shared UI system work plus reusable browser-backed manual verification |
| v0.3.0 | not tracked | 4 | Shifted from route rollout to adaptive UX hardening and truthful release-facing docs |
| v0.4.0 | not tracked | 4 | Closed a screenshot-audited polish milestone on deterministic proof seams and a bounded final gate |
| v0.6.0 | not tracked | 4 | Proved that feedback-driven cleanup plus bounded expansion works best when shell/runtime/settings truth land before new capability |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v0.2.0 | Focused phase suites + manual walkthrough | not tracked | 0 |
| v0.3.0 | Repo gates + multi-size walkthrough | not tracked | 0 |
| v0.4.0 | `55` test files / `133` tests on final gate | not tracked | 0 |
| v0.6.0 | Phase gates + milestone audit reruns across shell, modpacks, settings, and guided content | not tracked | 0 |

### Top Lessons (Verified Across Milestones)

1. Shared seams are cheaper and safer than per-surface fixes when UI truth needs to hold across multiple phases.
2. Browser-backed verification has to be part of milestone scope, not a cleanup step after coding is already considered done.
3. Archive automation remains fragile unless summary metadata and clean release snapshots are treated as first-class deliverables.
