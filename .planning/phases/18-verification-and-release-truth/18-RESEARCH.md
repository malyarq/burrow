---
phase: 18
slug: verification-and-release-truth
status: researched
created: 2026-04-17
requirements: []
---

# Phase 18 Research

## What The Planner Needs To Know

Phase 18 is the `v0.4.0` closeout phase. It is not another polish wave. Phase 15 through Phase 17 already repaired the milestone-owned defects; Phase 18 exists to prove those repairs on the real verification seam, align release and planning state to what actually shipped, and finish on the final repository and packaging gate.

The planning question is not "what else should we improve?" It is:

1. which repaired surfaces still need explicit proof;
2. which focused automated checks should become the closeout regression matrix;
3. which docs and metadata still lie about `v0.4.0`;
4. which residual warnings are acceptable to carry and which should be fixed now because they affect release truth.

No extra repo-local instructions were found beyond `AGENTS.md`: `CLAUDE.md`, `.claude/skills/`, and `.agents/skills/` are absent.

## Proof Obligations Derived From The Roadmap

Phase 18 success criteria in `.planning/ROADMAP.md` translate into four concrete obligations:

1. **Automated regression truth**: the closeout suite must cover the milestone-owned launch, detail, catalog or compact-nav, and settings or locale fixes from Phases 15 to 17.
2. **Manual proof truth**: browser-backed evidence must exist on the current `manual-verification.html` seam for the repaired surfaces, not just older summaries.
3. **Documentation truth**: release-facing docs and active planning docs must describe shipped `v0.4.0` behavior, not the midpoint state after only Phase 15.
4. **Gate truth**: the milestone closes only after `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build -- --publish never` pass on the final state.

Because there is no separate Phase 18 requirement list, the planner should treat the shipped requirement set from Phases 15 to 17 as the proof set:

- `LAUNCH-01` to `LAUNCH-04`
- `DETAIL-01` to `DETAIL-03`
- `CATALOG-01` to `CATALOG-03`
- `SET-01` and `SET-02`

## Current Baseline

### The verification seam already exists and is sufficient

The repo already exposes the exact proof views Phase 18 needs:

- `manual-verification.html?view=dashboard` for Phase 15 launch truth
- `manual-verification.html?view=modpack-details` for Phase 16 detail truth
- `manual-verification.html?view=phase-17-polish` for Phase 17 catalog, compact-nav, and Russian settings proof

These routes live on the shared manual verification app in `src/verification/manual/*`. Phase 18 should not create a new browser harness, a new route family, or a new verification framework.

### Existing focused tests already map well to the milestone fixes

The prior phase validation files and closeout summaries already establish the right focused suite components:

- launch truth:
  - `src/components/sidebar/__tests__/LaunchControls.status.test.tsx`
  - `src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx`
- detail truth:
  - `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
  - `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx`
- catalog and compact-nav truth:
  - `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
  - `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx`
  - `src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx`
- settings and locale truth:
  - `src/components/__tests__/SettingsPage.navigation.test.tsx`
  - `src/components/settings/__tests__/AppearanceTab.i18n.test.tsx`
  - `src/components/settings/__tests__/AppearanceTab.presets.test.tsx`

One Phase 17 closeout detail matters for planning: the repo-wide gate still caught `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx` after the visible settings copy changed. That test is not in the current focused closeout suite, so Phase 18 should likely add it to the milestone regression matrix instead of depending on repo-wide fallout to catch it again.

### Manual evidence is asymmetric across Phases 15 to 17

Current evidence quality is uneven:

- Phase 15 closed with stable screenshot artifacts for `dashboard`
- Phase 17 closed with both screenshot and DOM artifacts for `phase-17-polish`
- Phase 16 closed with a working `modpack-details` seam, but the headless Chromium capture was flaky and no stable screenshot artifact was retained

This means Phase 18 does not need to rebuild all prior evidence equally. It specifically needs to rerun Phase 16 proof in a cleaner browser session and then produce one coherent closeout record across all three proof views.

### Release-facing docs are currently stale for `v0.4.0`

The docs do not yet describe the shipped state truthfully:

- `README.md` still says the current verified release is `v0.3.0`
- `docs/en/roadmap.md` and `docs/ru/roadmap.md` still describe `v0.4.0` as if only Phase 15 is complete
- both public roadmap docs still say the active walkthrough only covers `manual-verification.html?view=dashboard`

This is not a full rewrite problem. The public roadmap pages already know `v0.4.0` exists; they need an evidence-driven status roll-forward after Phase 18 proof lands.

### Planning truth is also stale

The closeout phase is not only about product proof. The planning layer still has real drift:

- `.planning/REQUIREMENTS.md` still marks `SET-01` and `SET-02` as pending even though Phase 17 shipped them
- `node "$HOME/.codex/get-shit-done/bin/gsd-tools.cjs" init milestone-op` still reports stale `v0.2` metadata
- active milestone summary frontmatter still mixes `requirements:` and `requirements_completed:`, which has already forced manual audit reconciliation in earlier milestones
- `.planning/STATE.md` currently says `completed_phases: 3` but `percent: 100`, so the status view is not fully self-consistent while Phase 18 is still unplanned

Phase 18 should treat this as workflow truth debt that matters because it affects milestone closure and archive credibility.

### Packaging warnings need an explicit contract

The known packaging notes remain:

- large renderer chunk warning
- missing `description` in `package.json`
- missing `author` in `package.json`

The planner should separate these:

- the missing `package.json` metadata is cheap release-truth debt and a reasonable closeout candidate
- the large chunk warning is probably not Phase 18 scope unless there is a trivially bounded fix

Do not let the closeout phase turn into a generic chunk-splitting campaign.

## What Phase 18 Should Not Reopen

- No new routes, no new verification app, and no Playwright or visual-regression platform.
- No milestone-wide rerun of untouched `v0.3.0` surfaces such as share, screenshots, utilities, or datapacks unless the final walkthrough exposes a real blocker there.
- No broad workflow-tooling cleanup that depends on unrelated local files such as `.planning/config.json`, which `STATE.md` already marks as intentionally excluded from phase commits.
- No generic performance or architecture cleanup unrelated to the audited `v0.4.0` defects and truthful milestone closure.

## Real Planning Seams

### Seam 1: establish the exact closeout regression matrix

Phase 18 should start by codifying one focused suite for the `v0.4.0` fixes instead of relying on three separate phase memory trails. The likely closeout command is the union of the phase-owned tests:

```bash
npx vitest run \
  src/components/sidebar/__tests__/LaunchControls.status.test.tsx \
  src/components/__tests__/SimplePlayDashboard.launch-state.test.tsx \
  src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx \
  src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx \
  src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx \
  src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx \
  src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx \
  src/components/__tests__/SettingsPage.navigation.test.tsx \
  src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx \
  src/components/settings/__tests__/AppearanceTab.i18n.test.tsx \
  src/components/settings/__tests__/AppearanceTab.presets.test.tsx
```

Planning implication:

- capture this matrix in `18-VALIDATION.md`
- only add more tests if Phase 18 fallout reveals an uncovered milestone defect
- keep repo-wide `npm test` as the final safety net, not the main way to discover missing closeout coverage

### Seam 2: rerun manual proof on the three existing `v0.4.0` proof views

Phase 18 does not need a giant route matrix like Phase 10 or Phase 14. `v0.4.0` only repaired three proof surfaces:

- `dashboard`
- `modpack-details`
- `phase-17-polish`

The plan should explicitly reuse those views and capture:

- screenshot artifact
- DOM artifact or hidden verification-status payload
- proof message confirming `ready: true`
- negative checks where appropriate, especially no raw settings keys on the Phase 17 proof route

The Phase 16 failure mode matters here. The summary already says the previous headless capture was flaky after the seam changed. Phase 17 succeeded by using an isolated browser session and retaining both screenshot and DOM outputs. Phase 18 should follow that cleaner-browser pattern, especially for `modpack-details`, instead of assuming the old direct headless invocation will behave.

Planning implication:

- run captures sequentially, not in parallel
- prefer isolated `--user-data-dir` sessions for DOM capture
- keep the route set minimal and view-specific rather than building a new all-in-one closeout page

### Seam 3: align release truth and planning truth after proof, not before

The doc slice should happen after manual evidence is recorded, because several files currently understate shipped progress.

Minimum likely truth-alignment set:

- `README.md`
- `docs/en/roadmap.md`
- `docs/ru/roadmap.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`

Possible additional planning-truth cleanup, if required by the archive or milestone audit workflow:

- normalize active-milestone summary frontmatter onto `requirements_completed:` for extractor-friendly closure
- update `.planning/PROJECT.md` and `.planning/MILESTONES.md` once the milestone is actually shipped

The important planning decision is scope control: Phase 18 should refresh only the sections made false by shipped `v0.4.0` work. It should not rewrite history docs wholesale.

### Seam 4: close on the full gate and decide how residual warnings are recorded

The final plan must run, in sequence:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build -- --publish never`

Sequential execution matters. Earlier summaries already recorded that concurrent heavy commands and live browser work produced misleading failures on this machine.

The final verification artifact should explicitly state:

- which warnings remain non-blocking after the build
- whether `package.json` metadata was fixed or intentionally carried
- whether milestone audit or archive steps still need manual scope resolution because `gsd-tools init milestone-op` remains stale

## Recommended Plan Shape

- `18-01`: define the closeout validation matrix and make the focused `v0.4.0` regression suite authoritative
- `18-02`: rerun browser-backed evidence on `dashboard`, `modpack-details`, and `phase-17-polish`, fixing only proof-blocking fallout
- `18-03`: refresh release-facing docs and active planning truth from the recorded `v0.4.0` evidence, including requirements traceability and workflow metadata that affects milestone closure
- `18-04`: run the full repository and packaging gate, then publish the final verification or milestone-closeout artifact with explicit residual-warning notes

Recommended wave order:

- Wave 1: `18-01`
- Wave 2: `18-02`
- Wave 3: `18-03`
- Wave 4: `18-04`

This keeps automation truth first, manual proof second, doc truth third, and final closure last. Do not swap `18-03` ahead of `18-02`, or the docs will be refreshed from assumptions instead of proof.

## Planning Risks

- If Phase 18 starts by "cleaning docs," it will rewrite stale assumptions instead of reflecting actual evidence.
- If it retries the Phase 16 proof with the same flaky browser setup, the closeout can stall on tooling noise rather than product truth.
- If the focused regression matrix does not include the already-known settings accessibility seam, repo-wide fallout will keep catching issues too late.
- If public docs are updated but `.planning/REQUIREMENTS.md` and milestone summaries stay stale, the release-facing story will be truer than the planning system that is supposed to archive it.
- If the missing `package.json` metadata is left undecided until the final build, Phase 18 can waste time debating whether a known warning is acceptable at the worst possible moment.
- If the phase tries to fix the large chunk warning as open-ended performance work, the closeout scope will sprawl.

## Recommended Acceptance Checklist For Planning

- [ ] One focused automated suite exists for all `v0.4.0` repaired regressions.
- [ ] Manual artifacts exist for `dashboard`, `modpack-details`, and `phase-17-polish`.
- [ ] `README.md` and both public roadmap docs describe shipped `v0.4.0` truth rather than the post-Phase-15 midpoint.
- [ ] `.planning/REQUIREMENTS.md` no longer leaves `SET-01` and `SET-02` pending.
- [ ] Active milestone metadata is consistent enough that milestone closure does not depend on hidden manual reconciliation.
- [ ] Final gate passes on `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build -- --publish never`.
- [ ] Any remaining build warnings are explicitly classified as accepted residuals or fixed before closure.
