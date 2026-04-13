# Phase 10 Research: Manual Experience Verification And Release Truth

## What The Planner Needs To Know

Phase 10 is not another design pass. Phase 7 through Phase 9 already changed the UI system, core routes, and secondary surfaces. This phase exists to prove the milestone as shipped, absorb only the real fallout that appears during that proof, and then make the public-facing release description truthful.

The planner should treat Phase 10 as a verification and truthfulness phase with four concrete outcomes:

1. a real browser-based walkthrough is executed across the refreshed launcher flows instead of relying only on component tests and narrow phase-scoped smoke checks;
2. issues found during that walkthrough are fixed only where they block milestone truth, without reopening finished Phase 7 through Phase 9 redesign scope;
3. README and public roadmap docs describe the shipped launcher honestly, especially around the refreshed UI and UX surface;
4. the milestone closes under the normal repo gates plus the packaging check that was intentionally deferred in earlier UI phases.

The main trap is to let "final walkthrough" become another open-ended polish wave. The second trap is to treat documentation as a generic rewrite instead of grounding it in what the walkthrough actually proved. The third trap is to repeat the previous phase-specific live harness approach without leaving a stable, milestone-level verification seam.

## Requirement Fit

This phase directly covers:

- `VER-01`: maintainers execute a manual browser-based walkthrough of refreshed critical UI flows before closing the milestone;
- `DOC-03`: README and roadmap-level product descriptions reflect the refreshed launcher UI and UX truthfully after the rollout lands.

It should intentionally not claim:

- new UI system or route redesign work that belongs to Phases 7 through 9;
- backlog cleanup unrelated to walkthrough fallout;
- new capability expansion outside verification, fallout repair, and release-truth documentation.

## Current Baseline

### Phase 7 through Phase 9 already supply strong but partial evidence

The repo already has:

- `07-VERIFICATION.md`, `08-VERIFICATION.md`, and `09-VERIFICATION.md`;
- focused Vitest seams for theme, route truth, secondary utilities, content-management tabs, and reduced motion;
- narrow browser sanity evidence from Phase 8 and Phase 9:
  - `/tmp/fmcl-phase8-overview.png`
  - `/tmp/fmcl-phase8-export.png`
  - `/tmp/fmcl-phase8-add.png`
  - `/tmp/fmcl-phase9-share.png`
  - `/tmp/fmcl-phase9-screenshots.png`
  - `/tmp/fmcl-phase9-utilities.png`
  - `/tmp/fmcl-phase9-content.png`

This is enough to prove the slices individually. It is not yet the same thing as a milestone-wide walkthrough that connects the whole refreshed launcher experience from first-run entry through advanced surfaces and release claims.

### The browser walkthrough seam is still ad hoc

Phase 8 and Phase 9 both used temporary same-origin harness pages for browser verification and explicitly removed them afterward. `STATE.md` already records that Phase 10 should not depend on more phase-scoped scaffolding. There is no stable browser walkthrough entry point in the repository today:

- no persistent dev-only walkthrough page;
- no reusable milestone verification harness;
- no scripted route matrix living in the repo as a maintained seam.

That means Phase 10 must plan a reusable verification seam before or together with the broader walkthrough. Otherwise the phase will either regress back to one-off pages or be forced into an unreliable manual browser session with no stable setup.

### The public docs are mostly feature-complete but not yet walkthrough-grounded

`README.md` already reflects much of the shipped capability set, including:

- share and import flows;
- screenshots, mirrors, statistics, and UI customization;
- skin-management handoff and image caching.

But the docs are still feature-list-first. They do not yet reflect the final verified experience language that Phase 10 is supposed to close on.

`docs/en/roadmap.md` and `docs/ru/roadmap.md` are much riskier:

- they are long historical delivery documents rather than concise release-truth summaries;
- they still contain checkbox drift and partial statements from older phases;
- some items remain worded around old UI states or incomplete assumptions even though the new UI milestone changed the real product shape.

For `DOC-03`, these roadmap-facing docs should be refreshed from the live verified launcher, not preserved as stale implementation archaeology.

### Packaging verification is still owed

`STATE.md` explicitly says `npm run build -- --publish never` was deferred in Phase 8 and the broader packaging or release-truth gate was deferred again in Phase 9. Phase 10 therefore needs to own:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build -- --publish never`

This is a real planning concern, not a clerical add-on, because the UI milestone changed a large surface area and the release build has not been rerun since the post-v1 milestone started.

## Real Planning Seams

### Seam 1: milestone-wide browser walkthrough on a reusable verification entry

The cleanest first slice is not "fix bugs." It is:

- define the walkthrough scope;
- create or stabilize one reusable browser verification seam if the real app cannot be exercised directly in the browser;
- run the walkthrough across the refreshed milestone-owned surfaces;
- record the evidence in a durable summary.

The walkthrough scope should include:

- onboarding or welcome entry;
- home or play dashboard;
- settings or accounts continuity;
- modpack list, browser, details, export, and add-content seams;
- share or import-share;
- screenshots or lightbox;
- mirrors or statistics;
- representative content-management tab or datapack modal.

This is broader than the previous phase passes, but still bounded to the milestone-owned UI.

### Seam 2: fallout-only repair from walkthrough findings

Because fallout is unknown up front, the second slice should be explicitly constrained:

- fix only issues discovered during the walkthrough that undermine milestone truth;
- prefer targeted seam tests over new infrastructure;
- do not reopen general visual redesign or unrelated backlog.

This slice should consume evidence from the walkthrough summary instead of re-inventing scope.

### Seam 3: release-facing docs truth refresh

The documentation slice should update:

- `README.md`
- `docs/en/roadmap.md`
- `docs/ru/roadmap.md`

The source of truth should be the verified shipped experience, not the earlier roadmap aspirations.

This means the docs plan should likely run after at least the first walkthrough wave, and after any fallout fixes that materially change what the launcher claims.

### Seam 4: final gate and milestone closeout evidence

The phase should close on:

- green repo gates;
- green packaging build;
- recorded walkthrough evidence;
- updated docs;
- phase verification file tying `VER-01` and `DOC-03` to the actual artifacts.

## Planning Risks

- If the first Phase 10 plan starts with docs instead of walkthrough evidence, the docs will repeat assumptions instead of reflecting reality.
- If the browser walkthrough is attempted without a stable verification seam, execution can waste time on environment problems rather than product truth.
- If fallout is not explicitly bounded, Phase 10 can silently turn into Phase 11-style polish work.
- If the final gate omits `npm run build -- --publish never`, the milestone can still close without proving the refreshed launcher packages cleanly.
- If roadmap docs are updated only in one language, `DOC-03` will be only partially true.

## Recommended Plan Shape

The cleanest Phase 10 decomposition is four plans:

- `10-01`: establish a reusable browser verification seam if needed, then execute and record the milestone-wide walkthrough for the refreshed core launcher flows;
- `10-02`: extend that walkthrough across advanced and secondary surfaces, fixing only walkthrough fallout and locking it with targeted tests where needed;
- `10-03`: refresh `README.md`, `docs/en/roadmap.md`, and `docs/ru/roadmap.md` from the verified shipped experience instead of stale implementation claims;
- `10-04`: close the phase under the full repo gate plus `npm run build -- --publish never`, then write the final verification artifact.

Recommended wave map:

- Wave 1: `10-01`
- Wave 2: `10-02`, `10-03`
- Wave 3: `10-04`

This ordering keeps evidence first, fallout second, docs truth third, and final closeout last.

## Validation Architecture

Phase 10 should reuse the existing Vitest plus repo-gate lane, but add an explicit browser walkthrough evidence contract.

### Layer 1: walkthrough-backed evidence

Each walkthrough plan should record:

- the exact browser entry used;
- which refreshed surfaces were covered;
- screenshot evidence for each pass;
- what fallout was or was not found.

### Layer 2: targeted fallout regression

If walkthrough fallout requires code changes, add only the narrow tests needed to lock the issue:

- route or interaction seam tests for the affected flow;
- no new generic visual-regression system;
- no speculative coverage for untouched surfaces.

### Layer 3: full milestone gate

Before closing the phase:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build -- --publish never`

### Layer 4: documentation truth check

The final verification should explicitly confirm that:

- README feature bullets match the verified launcher;
- EN and RU roadmap docs no longer claim stale UI state or outdated checkbox truth;
- the phase verification artifact links docs back to walkthrough evidence and final gates.
