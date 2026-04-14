# Phase 14 Research: Manual Verification And Release Truth

## What The Planner Needs To Know

Phase 14 is the milestone closeout phase for `v0.3.0`. It is not another UX redesign wave. Phase 11 through Phase 13 already changed the adaptive shell, theme truth, settings IA, launch-state trust, create-modpack dependency truth, remote browser ergonomics, and installed-card quick flows. This phase exists to prove that shipped experience across real window sizes, absorb only the blocker fallout discovered during that proof, and then make the release-facing description truthful.

The phase boundary should stay narrow and evidence-first:

1. execute milestone-wide live browser walkthroughs through the existing reusable verification seam instead of more ad hoc phase-specific harnesses;
2. cover the milestone-owned surfaces at multiple window sizes, especially the first-launch default bounds and at least one narrower resized width;
3. fix only the issues that block truthful walkthrough completion or final release gating;
4. refresh `README.md`, `docs/en/roadmap.md`, and `docs/ru/roadmap.md` from verified `v0.3.0` reality instead of stale `v0.2.0` wording;
5. close on the full repository gate including `npm run build -- --publish never`, then write one final verification artifact strong enough for milestone audit and archival.

The planner should explicitly avoid:

- reopening finished Phase 11 through Phase 13 product scope because the walkthrough suggests "one more polish pass";
- inventing a new verification framework when `manual-verification.html` already exists;
- folding future launcher ideas directly into current execution instead of capturing them as bounded follow-up opportunities;
- treating docs refresh as a generic rewrite rather than a release-truth exercise grounded in walkthrough evidence.

## Requirement Fit

This phase directly covers:

- `VER-01`: maintainers execute live browser walkthroughs for milestone-owned UX flows at multiple window sizes before closure;
- `DOC-01`: README and public roadmap docs describe the shipped UX-hardening changes and remaining future parity work truthfully after rollout lands.

This phase should intentionally not claim:

- new adaptive layout, theme, settings, launch, or modpack capability work outside walkthrough fallout;
- new v2 parity scope such as a dedicated activity center, extra layout presets, or broader feature expansion.

## Current Baseline

### The reusable manual verification seam already exists and should be reused

Unlike the older ad hoc phase checks, the repo now has a stable walkthrough entry:

- `manual-verification.html`
- `src/verification/manual/ManualVerificationApp.tsx`
- `src/verification/manual/main.tsx`
- `src/verification/manual/mockEnvironment.ts`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/views.ts`

Phase 10 created this seam for `v0.2.0`, and later phases already reused it:

- Phase 11 used it for adaptive shell and overlay proof.
- Phase 12 used it for preset truth review.
- Phase 13 extended it with explicit launch-state and create-modpack dependency scenarios.

That means Phase 14 should not create another verification page. It should reuse and extend the same entry only where the current milestone still lacks coverage.

### Evidence is strong but fragmented by phase

Current verification artifacts already prove the milestone slices individually:

- Phase 11 verified adaptive shell, anchored overlays, and asset fallback truth.
- Phase 12 verified truthful preset application and flatter settings navigation.
- Phase 13 verified launch-state clarity, create-modpack dependency truth, browser ergonomics, and installed-card quick flows.

But the evidence is still phase-local:

- screenshots exist under multiple `/tmp/fmcl-phase11-*`, `/tmp/fmcl-phase12-*`, and `/tmp/fmcl-phase13-*` names;
- the walkthrough coverage is recorded in separate phase summaries and verification files;
- there is not yet one milestone-level pass that proves the combined `v0.3.0` launcher at multiple window sizes end to end.

This is the key planning seam for `VER-01`: Phase 14 must connect those already-refreshed surfaces into one milestone-owned walkthrough rather than re-verifying each phase in isolation.

### Public docs are stale and still describe `v0.2.0`

`README.md`, `docs/en/roadmap.md`, and `docs/ru/roadmap.md` still describe `v0.2.0`.

Concrete drift:

- `README.md` explicitly says the current UI refresh is `v0.2.0`;
- both public roadmap docs still list `v0.2.0` as the current milestone;
- both roadmap docs still describe the follow-up space as if the current UX-hardening milestone has not shipped yet.

For `DOC-01`, the docs must be refreshed from the verified `v0.3.0` launcher:

- adaptive layout and anchored overlay safety;
- truthful preset application across light and dark mode;
- flatter settings navigation;
- explicit launch-state feedback and safer busy-state behavior;
- truthful create-modpack dependency summary;
- clearer modpack browser and installed-card actions;
- the remaining bounded future parity opportunities identified during Phase 14 walkthroughs.

### The final packaging-aware gate is still owed

Phase 13 closed on:

- focused suite
- `npm test`
- `npm run lint`
- `npx tsc --noEmit`

It explicitly deferred:

- `npm run build -- --publish never`

So Phase 14 must own the full final gate:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build -- --publish never`

This is not clerical. The current milestone changed large renderer and manual-verification surfaces, and the packaging-aware build needs to be rerun on the final milestone state before closure.

## Real Planning Seams

### Seam 1: Core adaptive walkthrough on the reusable verification entry

The first execution slice should reuse `manual-verification.html` and record the core `v0.3.0` journey at multiple sizes:

- welcome or onboarding
- dashboard and play state
- settings and accounts continuity
- modpack create flow
- modpack list
- modpack browser

The right sizes are:

- first-launch default window bounds;
- a narrower resized desktop width where adaptive layout pressure is real.

If the walkthrough exposes a blocker, the fix should stay limited to what is necessary to make the milestone truthfully verifiable.

### Seam 2: Secondary and advanced walkthrough plus bounded future opportunity capture

The second slice should cover the remaining milestone-owned surfaces:

- modpack details and export
- add-mod flow
- share
- screenshots
- mirrors and statistics
- representative secondary content-management surface such as datapacks

This slice should also capture the bounded future parity opportunities surfaced by live evidence. The important constraint is that the opportunity list is not scope inflation:

- if an issue blocks truthful milestone closure, fix it now;
- if it is a reasonable follow-up but not a blocker, record it clearly for later rather than slipping it into Phase 14 execution.

### Seam 3: Release-facing docs truth

Docs refresh should run after the walkthrough evidence is in hand. It should update:

- `README.md`
- `docs/en/roadmap.md`
- `docs/ru/roadmap.md`

The docs should describe the verified `v0.3.0` launcher and mention the bounded follow-up opportunities that remain after the milestone closes.

### Seam 4: Final gate and verification artifact

The phase should close on:

- the full repo gate including build;
- recorded multi-size walkthrough evidence;
- updated public docs;
- a `14-VERIFICATION.md` artifact that ties `VER-01` and `DOC-01` to actual evidence rather than assertion.

## Planning Risks

- If Phase 14 starts with docs, it will just rewrite stale assumptions instead of reflecting the verified launcher.
- If Phase 14 uses a new harness instead of reusing `manual-verification.html`, it will duplicate already-solved verification infrastructure.
- If walkthrough fallout is not explicitly bounded, the closeout phase will silently turn into another redesign wave.
- If future parity ideas are not separated from closure blockers, the milestone can expand indefinitely.
- If the final gate omits `npm run build -- --publish never`, the milestone can close without proving the final package state.
- If EN and RU docs are not updated together, `DOC-01` will only be partially true.

## Recommended Plan Shape

The cleanest Phase 14 decomposition matches the roadmap:

- `14-01`: record milestone-wide core browser walkthroughs across adaptive sizes
- `14-02`: extend walkthroughs to advanced and secondary surfaces, fix only milestone blockers, and capture bounded future parity opportunities
- `14-03`: refresh `README.md`, `docs/en/roadmap.md`, and `docs/ru/roadmap.md` from verified `v0.3.0` truth
- `14-04`: run the final repo gate including `npm run build -- --publish never`, then publish `14-VERIFICATION.md`

Recommended wave map:

- Wave 1: `14-01`
- Wave 2: `14-02`, `14-03`
- Wave 3: `14-04`

This ordering keeps evidence first, bounded fallout second, docs truth third, and final closeout last.

## Validation Architecture

Phase 14 should reuse the existing Vitest plus repo-gate lane, but add an explicit milestone-level browser evidence contract.

### Layer 1: reusable manual-verification seam

Each walkthrough plan should record:

- the exact verification entry and view IDs used;
- window sizes exercised;
- screenshot artifacts captured and manually reviewed;
- whether any blocker fallout was found and fixed.

### Layer 2: targeted regression from walkthrough fallout

If walkthrough fallout requires code changes, add only the narrow tests needed to lock the affected seam:

- responsive shell and navigation tests for adaptive regressions;
- launch-state, settings, browser, or card tests for core surfaces;
- share, screenshots, utilities, or content tests for secondary surfaces.

### Layer 3: docs truth check

Docs refresh should verify:

- public docs no longer claim `v0.2.0` as the current milestone;
- README and public roadmap docs describe the verified `v0.3.0` launcher instead of stale aspirations;
- remaining future parity work is framed as future follow-up, not implied as already shipped.

### Layer 4: final repo gate

Before closing the phase:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build -- --publish never`

The final verification artifact should explicitly tie those commands back to the walkthrough evidence and refreshed docs.
