# Phase 24: Verification, Locale, And Release Truth - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 24 closes `v0.5.0` on proof rather than assumption. It extends the existing manual verification seam with a representative milestone-owned closeout matrix, adds screenshot-backed regression coverage for the redesigned launcher surfaces, verifies dark/light and EN/RU truth explicitly, and refreshes release-facing documentation from that final proof. It does not reopen brand, layout, theme, or degraded-state implementation beyond bounded fallout discovered during closeout.

</domain>

<decisions>
## Implementation Decisions

### Final proof coverage
- The final manual proof should be a curated representative matrix, not a giant walkthrough of every launcher route.
- Proof must stay shell-integrated and use the existing `manual-verification.html` seam rather than a new verification harness or isolated component demos.
- The representative matrix should cover milestone-owned surfaces and degraded states strongly enough that the redesign can be reviewed as a shipped product, not as a pile of partial component checks.
- Phase 24 should prefer named closeout views with clear ownership over overloading older proof routes until reviewers have to infer what is being validated.

### Screenshot regression posture
- Screenshot regression should be strict for the curated `v0.5.0` proof views that Phase 24 owns.
- The screenshot gate should stay bounded to milestone-owned proof surfaces and should not expand into a repo-wide visual freeze for unrelated legacy routes.
- Visual drift on the curated closeout views is release-significant and should not be treated as advisory-only evidence.
- Phase 24 should optimize for deterministic screenshot evidence on the owned proof set, not for the widest possible screenshot capture footprint.

### Theme and locale evidence
- Dark/light theme truth and EN/RU locale truth should be explicitly reviewable in the final proof instead of being left to inference from mixed or incidental routes.
- Phase 24 should expose named closeout views that let reviewers compare dark/light and EN/RU states directly on milestone-owned surfaces.
- Locale proof must remain tied to real redesigned launcher content with visible translated copy, dates, and counts, not synthetic token-only pages.
- Theme and locale proof should demonstrate shipped surfaces under realistic shell composition, including representative degraded or dense states where they matter to the milestone story.

### Release-facing truth
- Phase 24 must refresh `README.md`, `docs/en/roadmap.md`, `docs/ru/roadmap.md`, and active planning state from the final proof set.
- Release-facing docs should describe shipped `v0.5.0` behavior and proof coverage, not stale `v0.4.0` milestone language or midpoint assumptions.
- Planning truth should stay aligned with the same closeout evidence so requirements, roadmap, and state do not claim more or less than the shipped redesign actually proves.
- Bounded non-blocking residuals may be recorded explicitly in the release truth, but they must stay small, named, and clearly non-blocking rather than hidden or hand-waved away.

### Claude's Discretion
- Exact composition of the final closeout views, as long as they remain representative, shell-integrated, and milestone-owned.
- Exact screenshot artifact format and storage location, as long as the owned proof set stays deterministic and reviewable.
- Exact wording of release-proof summaries and residual-debt callouts, as long as README, EN/RU roadmap docs, and planning truth stay synchronized.

</decisions>

<specifics>
## Specific Ideas

- The anti-pattern for this phase is another sprawling manual walkthrough; the user wants a closeout matrix that proves the redesign cleanly instead of generating more noise.
- Screenshot regression should protect the views that actually tell the `v0.5.0` story, not freeze unrelated legacy surfaces that Phase 24 does not own.
- Dark/light and EN/RU should be obvious in the final proof set, not hidden behind assumptions like "the tests already cover that somewhere."
- Release truth should stay honest even if a small bounded residual remains; the goal is no fake perfection and no stale `v0.4.0` wording surviving into `v0.5.0` closeout.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/verification/manual/views.ts`: the registry for reviewable proof view IDs and descriptions; currently mixes older milestone views with newer Phase 20 to 22 proof states.
- `src/verification/manual/scenarios.tsx`: the shell-integrated verification seam that already mounts launcher-home, dense-route, theme, locale, and secondary-content proof states on deterministic fixtures.
- `src/verification/manual/mockEnvironment.ts`: the seeded fixture layer for manual proof, including long-density, theme, locale, and content-management data that Phase 24 can reuse instead of inventing new fake routes.
- Existing focused test seams already cover milestone-owned surfaces such as screenshots, share flows, error recovery, theme runtime, locale formatting, and degraded-state truth; Phase 24 can reuse them as the closeout matrix around the screenshot proof.

### Established Patterns
- Earlier verification phases already locked the rule that browser-backed proof should reuse `manual-verification.html` rather than spawning one-off harnesses.
- Phase 19 through Phase 23 shifted proof into real shell composition, so Phase 24 should preserve shell-integrated views instead of returning to route fragments or isolated demos.
- Phase 22 already proved theme and locale through dedicated named proof views; Phase 24 should build on that explicit-review pattern rather than collapse it back into implicit coverage.
- Earlier release-truth work refreshed docs from proof evidence, not from planning memory; the same discipline should govern `v0.5.0` closeout.

### Integration Points
- `src/verification/manual/views.ts`, `src/verification/manual/scenarios.tsx`, and `src/verification/manual/mockEnvironment.ts` are the narrowest seams for expanding the closeout proof matrix.
- `README.md`, `docs/en/roadmap.md`, and `docs/ru/roadmap.md` are currently stale and still describe `v0.4.0`, so Phase 24 must explicitly own their rewrite from `v0.5.0` proof.
- `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, and `.planning/STATE.md` are the active planning truth seams that must align with the same closeout evidence.
- Existing verification status publishing inside the manual seam remains the likely anchor for deterministic DOM or screenshot readiness checks during closeout.

</code_context>

<deferred>
## Deferred Ideas

- Full repo-wide visual regression infrastructure or permanent CI screenshot baselines beyond the milestone-owned closeout set.
- New product capability, new launcher routes, or broader diagnostics tooling discovered during closeout.
- Any redesign or correctness work outside bounded fallout that is directly required to keep the final `v0.5.0` proof truthful.

</deferred>

---

*Phase: 24-verification-locale-and-release-truth*
*Context gathered: 2026-04-19*
