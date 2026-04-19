---
phase: 24
slug: verification-locale-and-release-truth
status: researched
created: 2026-04-19
requirements:
  - VER-01
  - VER-02
  - VER-03
  - VER-04
---

# Phase 24 Research

## What The Planner Needs To Know

Phase 24 is the `v0.5.0` closeout phase. It should not reopen brand, shell, density, theme, or degraded-state implementation except for bounded fallout discovered while proving the shipped redesign. The phase exists to turn already-owned work into one reviewable proof contract.

The repo already has the correct proof seam:

- `manual-verification.html`
- `src/verification/manual/main.tsx`
- `src/verification/manual/ManualVerificationApp.tsx`
- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/mockEnvironment.ts`

The gap is not "add another harness." The gap is that the current seam is still a mix of historical phase views, success-only fixtures, and manual `/tmp` capture habits. Phase 24 needs to turn that into a small, named `v0.5.0` closeout matrix with deterministic screenshot coverage and docs that describe the same proof set.

No extra repo-local instructions were found beyond `AGENTS.md`: `CLAUDE.md`, `.claude/skills/`, and `.agents/skills/` are absent.

## Requirement Fit

### `VER-01`

Phase 24 must create deterministic manual closeout routes for milestone-owned redesigned surfaces and representative degraded states. "Deterministic" here means:

- reviewers can open named proof views directly;
- each view publishes `ready: true` through `#verification-status`;
- the same shell-integrated content appears every run;
- theme, locale, and degraded-state coverage is explicit instead of inferred from old phase routes.

### `VER-02`

Phase 24 must add a strict screenshot regression gate for the owned closeout views. The repo currently has no checked-in visual baseline runner in `package.json`, no Playwright config, and no committed snapshot suite. Existing screenshot proof is documented in planning summaries, not enforced in repo tooling.

### `VER-03`

Phase 24 must prove dark/light and EN/RU explicitly on the final proof set. The repo already has Phase 22 theme and locale views plus locale-aware `formatDate` and `formatNumber` in `SettingsContext`, so the work is not a new formatting system. The work is to elevate theme and locale pairs into the owned closeout matrix and keep them visually stable enough for screenshot capture.

### `VER-04`

Phase 24 must refresh release-facing truth from proof, not memory. Today the following still describe `v0.4.0`:

- `README.md`
- `docs/en/roadmap.md`
- `docs/ru/roadmap.md`
- `src/verification/manual/ManualVerificationApp.tsx`
- `src/verification/manual/views.ts`

Active planning truth also needs the same roll-forward after proof:

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`

## Current Baseline

### The manual seam is reusable, but not yet a closeout contract

`src/verification/manual/views.ts` still exposes one flat `CORE_VIEWS` registry that mixes general routes with Phase 17, Phase 21, and Phase 22 proof views. `OverviewScenario` renders that full mixed list, and `ManualVerificationApp.tsx` still labels the hub as `Milestone v0.4.0`.

That is good enough for ad hoc review, but not for closeout. Phase 24 context explicitly wants named closeout views with clear ownership instead of asking reviewers to infer the final proof set from old phase-specific IDs.

### Theme and locale proof already exist, but they are phase-local

The seam already includes:

- `phase-22-theme-dark`
- `phase-22-theme-light`
- `phase-22-locale-en`
- `phase-22-locale-ru`

Those routes prove the pattern works, but they are still framed as Phase 22 evidence. Phase 24 should reuse their implementation style, not reuse their naming as the final milestone proof.

### Degraded-state proof is still underrepresented in the manual seam

Phase 23 added strong degraded-state logic and tests, but `src/verification/manual/mockEnvironment.ts` still returns mostly success-path data for screenshots, statistics, resource packs, datapacks, and share/import flows. There are no dedicated degraded-state closeout views yet.

That means Phase 24 cannot honestly claim representative degraded-state proof until the manual environment can return view-owned failures or unavailable states on purpose.

### Screenshot regression tooling is still missing

The stack research already pointed to `@playwright/test` as the right addition on top of `manual-verification.html`, but the repo has not landed it yet:

- no Playwright dependency in `package.json`
- no `playwright.config.*`
- no checked-in visual spec directory

Current browser proof still depends on one-off Chromium/CDP capture recorded in phase summaries and verification docs.

### Determinism risks will make visual baselines flaky unless Phase 24 fixes them first

The current proof seam still contains visible moving data and motion sources:

- `src/verification/manual/mockEnvironment.ts` uses `Date.now()` for visible screenshot dates, statistics timestamps, mod file mtimes, and related proof data.
- `src/components/SimplePlayDashboard.tsx` uses `Math.random()` for decorative particles and supports animated transitions unless motion is disabled.
- `seedManualVerificationStorage()` sets language, theme, preset, accent, and UI mode, but does not yet set `settings_disableAnimations`.

Phase 24 should treat these as first-class proof blockers. Without fixed timestamps and disabled animation, Playwright baselines will be noisy by design.

### Locale formatting is already implemented correctly and should be reused

`SettingsContext` already routes `formatDate()` and `formatNumber()` through the active launcher locale. Phase 24 should not invent a new formatter or locale seam. It should keep the closeout locale pair on views that visibly exercise those helpers with dates, counts, and translated UI copy.

## Standard Stack

Keep the existing closeout stack:

- `manual-verification.html` plus `src/verification/manual/*` for shell-integrated proof
- current focused Vitest seams from Phases 19 to 23 for behavior and truth regressions
- `#verification-status` as the deterministic readiness anchor
- the standard final repo gate: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build -- --publish never`

Add only one new testing layer:

- `@playwright/test`, Chromium-only, for screenshot baselines on the owned closeout views

Recommended file shape:

- `playwright.config.ts`
- `tests/visual/manual-closeout.spec.ts`
- committed snapshots under Playwright's normal snapshot directory
- `.planning/phases/24-verification-locale-and-release-truth/24-VALIDATION.md`

Do not add Storybook, Chromatic, Percy, Loki, or a second proof application.

## Architecture Patterns

### 1. Split the view registry into closeout-owned and legacy views

`src/verification/manual/views.ts` should stop acting like one undifferentiated bucket. The planner should prefer a typed registry with at least:

- legacy or general proof views kept for historical use
- a small `v0.5.0` closeout set used by navigation, screenshots, docs, and final verification

The important planning move is single-source ownership. The same data should drive:

- manual navigation labels
- which views get screenshot baselines
- which views are cited in `README.md` and roadmap docs
- which requirements each view helps prove in `24-VALIDATION.md`

### 2. Keep the closeout proof matrix representative, not exhaustive

Phase 24 context rejects another giant walkthrough. The right answer is a small closeout family that tells the `v0.5.0` story cleanly.

Recommended closeout view set:

| Proposed closeout view | Why it should exist | Likely source seams |
| --- | --- | --- |
| `phase-24-home-closeout` | Proves shipped launcher-home shell, brand, launch-state truth, and CTA ownership without first-run noise | `SimplePlayDashboard`, `Sidebar`, `TitleBar` |
| `phase-24-modpacks-closeout` | Proves dense modpack browsing or details truth, fallback art, and real shell composition on the redesigned core path | `ModpackBrowser` or `ModpackDetails`, long-density fixtures from Phase 21 |
| `phase-24-degraded-closeout` | Proves representative failed-load and unavailable states instead of success-only screenshots | `ModpackBrowser`, `ScreenshotsTab`, `StatisticsTab`, `WorldDatapacksModal`, or another small shell-integrated set |
| `phase-24-theme-dark` | Explicit dark-theme proof on shipped content | `SettingsPage` appearance tab or another high-signal view |
| `phase-24-theme-light` | Same proof as above, but light/custom-accent and compared against the dark state | same as dark |
| `phase-24-locale-en` | Explicit EN proof with visible dates, counts, and translated copy | `ModpackBrowser` plus secondary-content overlay |
| `phase-24-locale-ru` | Same proof as above, but RU and directly comparable | same as EN |

The planner can merge `phase-24-home-closeout` and `phase-24-modpacks-closeout` if one composite route stays readable. It should not collapse theme or locale back into implicit coverage.

### 3. Make proof data deterministic before adding snapshots

Recommended hardening rules for closeout views:

- replace visible `Date.now()`-derived timestamps in manual fixtures with fixed epoch values or fixed ISO strings;
- set `settings_disableAnimations=true` in seeded proof storage for closeout views;
- keep `page.emulateMedia({ reducedMotion: 'reduce' })` in Playwright as a second safety net;
- avoid first-run welcome or tour overlays on final closeout views unless a specific view exists to prove onboarding;
- reuse one fixture pair for dark/light and one fixture pair for EN/RU so screenshot differences reflect theme or locale only;
- extend `installManualVerificationEnvironment()` by `view` id so degraded closeout views deliberately reject or return unavailable data instead of inventing a parallel fixture system.

### 4. Drive the screenshot lane from the closeout registry

The screenshot suite should not discover views through hard-coded route strings scattered across tests. It should import the closeout registry and iterate only the owned set.

That yields one consistent contract:

- view id
- viewport
- theme
- locale
- whether the view is screenshot-owned
- optional negative checks such as "no raw locale keys" or "no `${...}` placeholders"

Recommended visual runner behavior:

1. Start one local Vite server through Playwright `webServer`.
2. Open `manual-verification.html?view=<id>`.
3. Wait until `#verification-status` parses to `{ view: <id>, ready: true }`.
4. Run small negative text checks for raw keys or unresolved placeholders where relevant.
5. Capture one strict screenshot per closeout view.

Use view-owned viewport sizes rather than one global matrix. Phase 24 wants representative proof, not a huge width explosion.

### 5. Refresh release truth only after proof and baselines are in place

Once the closeout view family and screenshot lane are stable, Phase 24 should update:

- `README.md`
- `docs/en/roadmap.md`
- `docs/ru/roadmap.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- the visible milestone wording inside `src/verification/manual/ManualVerificationApp.tsx` and `src/verification/manual/views.ts`

Optional metadata audit:

- `package.json` still reports `0.4.0`; treat this as release metadata to review during closeout, but only change it if Phase 24's release flow or docs still expose that mismatch directly.

## Code Examples

Illustrative registry shape for planning:

```ts
export type CloseoutViewDefinition = {
  id: ManualVerificationView;
  label: string;
  description: string;
  milestone: 'v0.5.0';
  closeout: true;
  screenshot: boolean;
  viewport: { width: number; height: number };
  theme?: 'dark' | 'light';
  language?: 'en' | 'ru';
  negativeChecks?: ReadonlyArray<'no-raw-locale-keys' | 'no-template-placeholders'>;
};
```

Illustrative Playwright proof wait:

```ts
await page.goto(`/manual-verification.html?view=${view.id}`);

await expect
  .poll(async () => {
    const payload = await page.locator('#verification-status').textContent();
    return payload ? JSON.parse(payload) : null;
  })
  .toMatchObject({ view: view.id, ready: true });

await expect(page).toHaveScreenshot(`${view.id}.png`, {
  animations: 'disabled',
});
```

The point is not the exact type or file name. The point is that manual proof, screenshot ownership, and docs truth all read from one registry instead of drifting independently.

## Don't Hand-Roll

- Do not build a second verification harness, Storybook proof page, or isolated component-lab workflow.
- Do not keep temporary CDP scripts as the primary regression gate. They are acceptable as one-off artifact capture, not as the committed release-check path.
- Do not freeze the whole repo visually. Snapshot only the milestone-owned closeout views.
- Do not create synthetic locale or theme demo pages that stop exercising real launcher content.
- Do not use Phase 24 to reopen broad theme or degraded-state implementation unless explicit closeout proof shows a blocker.

## Common Pitfalls

- Leaving `v0.4.0` wording in the manual proof UI while README or roadmap docs claim `v0.5.0`.
- Capturing screenshot baselines before fixing `Date.now()`-derived visible fixture data.
- Forgetting to disable animation and random decorative motion on the dashboard proof.
- Reusing `phase-22-*` view IDs as the final closeout proof instead of creating clearly owned Phase 24 views.
- Updating docs before the final proof matrix exists, which turns release truth back into planning memory.
- Proving only happy paths and leaving degraded-state closeout on existing Phase 23 tests alone.
- Treating pending `THEME-01` as "already proven somewhere." If explicit dark/light closeout proof still exposes unreadable state contrast, Phase 24 either needs a bounded fix or an explicit named residual.

## Recommended Plan Shape

The cleanest Phase 24 decomposition is four plans:

- `24-01`: create the `v0.5.0` closeout view registry on the existing manual seam, update the hub copy to `v0.5.0`, and make proof fixtures deterministic
- `24-02`: add representative degraded-state closeout views plus explicit dark/light and EN/RU closeout pairs
- `24-03`: land Playwright screenshot regression on the closeout registry and publish `24-VALIDATION.md` as the authoritative requirement-to-view and requirement-to-test map
- `24-04`: refresh release-facing docs and active planning truth from the proven view set, then run the final closeout gate and publish `24-VERIFICATION.md`

Recommended wave order:

- Wave 1: `24-01`
- Wave 2: `24-02`
- Wave 3: `24-03`
- Wave 4: `24-04`

This ordering matters. If docs land before the closeout registry and screenshot lane exist, `VER-04` will be based on assumptions again.

## Validation Architecture

Phase 24 should create `24-VALIDATION.md`.

This phase has too many coupled proof concerns to leave validation implicit:

- a named manual closeout matrix
- a new visual regression lane
- explicit theme and locale pairs
- release-truth audits tied to the same proof set

`24-VALIDATION.md` should become the authoritative map between `VER-01` to `VER-04` and the exact seams that prove them.

### Layer 1: closeout registry

Record the owned view set with:

- view id
- proof focus
- theme or locale variant when applicable
- viewport
- whether the view is screenshot-gated
- manual-only notes

This layer proves `VER-01` structurally.

### Layer 2: Playwright screenshot suite

Use a Chromium-only Playwright spec that imports the closeout registry and enforces:

- `ready: true` from `#verification-status`
- strict screenshot baselines for closeout views only
- targeted negative checks for raw locale keys or unresolved placeholders where relevant

This layer is the new `VER-02` backbone and also supports `VER-03`.

### Layer 3: focused existing seam matrix

Do not replace the Phase 19 to 23 tests. Reuse them as the behavioral floor underneath the visual suite. `24-VALIDATION.md` should cite the narrow seams that already own the milestone story, for example:

- launch-state truth
- dense modpack hierarchy
- theme/runtime contract
- locale formatting
- degraded-state truth
- fatal error recovery

This keeps the phase bounded: visual proof confirms shipped surfaces, while Vitest keeps the underlying contracts honest.

### Layer 4: manual-only cross-checks

Keep a short manual-only list for behaviors that still need a human decision:

- dark/light selected, active, and disabled state readability on the paired theme views
- EN/RU date, count, and translated-copy truth on the paired locale views
- degraded-state comprehension on the dedicated closeout degraded view
- classification of any remaining issue as blocker versus explicit non-blocking residual

### Layer 5: release-truth audit and final gate

The validation strategy should end with a full closeout command sequence. Recommended final shape:

```bash
npx playwright test
npm test
npm run lint
npx tsc --noEmit
npm run build -- --publish never
```

And a truth audit over:

- `README.md`
- `docs/en/roadmap.md`
- `docs/ru/roadmap.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`

The final `24-VERIFICATION.md` should cite the owned closeout view ids, screenshot artifacts or baseline suite, and any explicitly accepted residuals.
