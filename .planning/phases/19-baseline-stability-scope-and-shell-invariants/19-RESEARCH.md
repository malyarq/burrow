# Phase 19 Research: Baseline Stability, Scope, And Shell Invariants

## What The Planner Needs To Know

Phase 19 is the baseline-trust phase for `v0.5.0`. It should not drift into broad visual redesign, dense IA cleanup, or theme polishing. The phase exists to remove the shared geometry mistakes that make every later redesign screenshot look broken:

1. the shell has no explicit top-safe contract below the custom title bar;
2. deep modpack routes still compete with the sidebar for primary-action ownership;
3. dense routes and modals still rely on nested scroll areas and persistent action rows that are easy to misread as overlays;
4. current verification seams do not render the real shell, so they cannot catch the bugs the screenshot audit reported.

The right Phase 19 boundary is:

1. define one shared shell-owned top inset and stop route-level compensation;
2. define one shared CTA ownership policy between shell-owned and route-owned contexts;
3. convert the highest-risk dense routes away from ambiguous bottom persistence and nested-scroll traps;
4. add shell-integrated proof seams so later phases inherit stable geometry instead of screenshot debt.

The planner should explicitly avoid absorbing:

- brand/token redesign work from Phase 20;
- tab-density and desktop IA rework from Phase 21 unless required to remove overlap;
- theme/accent contrast work from Phase 22;
- fallback/error productization outside direct modal or shell fallout.

## Requirement Fit

This phase directly covers:

- `SHELL-01`: major surfaces must clear the custom title bar without local `pt-*` hacks
- `SHELL-02`: dense surfaces must not hide content behind sticky or persistent action areas
- `SHELL-03`: each context must expose one unambiguous primary action

This phase should intentionally not claim:

- `SHELL-04` except for direct fallout needed to remove overlap
- `DENSE-01` through `DENSE-04`
- `BRAND-01` through `BRAND-03`
- `THEME-01` through `THEME-04`

## Current Hotspots And Why They Create Phase 19 Bugs

### Shared shell geometry is split across siblings instead of expressed as one contract

`src/components/AppLayout.tsx` renders `TitleBar` as a sibling above the main split, but the main pane itself has no explicit safe-area seam. `src/components/TitleBar.tsx` still uses a sticky top bar inside an `overflow-hidden` shell frame. That means the layout depends on natural flow plus local luck instead of one explicit "content starts here" rule. This is the direct structural cause behind the screenshot audit's `R1` top-edge intrusion.

### The sidebar adds its own top strip and compensates locally

`src/components/Sidebar.tsx` adds an absolute collapse strip at `top-0` and then compensates with local `pt-6`. That creates a second top-edge system inside the shell, separate from the title bar. The shell therefore has at least two owners for top spacing:

- the window/title-bar seam;
- the sidebar-local collapse strip.

That is exactly the kind of route-adjacent spacing drift Phase 19 needs to eliminate.

### Sidebar launch remains globally primary because context does not reach the shell

`src/components/Sidebar.tsx` always renders `LaunchControls` at the bottom and only gates by launchability, not by current route. `src/components/sidebar/LaunchControls.tsx` only understands launch state, not context ownership. This is why the shell keeps a strong `PLAY` CTA even when deep routes render their own route-owned primary button. The duplicate-CTA bug is structural, not cosmetic.

### Modpack details currently owns both deep-route content and a persistent bottom action row

`src/components/modpacks/ModpackDetails.tsx` composes:

- a route header;
- a second details header with tabs;
- a dedicated scroll container for tab content;
- a separate bottom `ModpackDetailsActions` row outside that scroll container.

`src/components/modpacks/details/ModpackDetailsActions.tsx` makes `Play` primary and can also make `Update Available` primary. That produces two kinds of ambiguity:

- shell `PLAY` versus route `Play`;
- route `Play` versus route `Update Available`.

Even where the bottom row is not technically `position: fixed`, it still behaves as a persistent route footer that compresses reading order and makes the last visible content edge visually ambiguous.

### Dense content already contains nested scroll traps

`src/components/modpacks/details/ModpackDetailsModsTab.tsx` uses a hard `h-[800px]` internal list surface inside a parent page that already scrolls. `src/components/modpacks/AddModPage.tsx` adds another bounded result scroller inside a scrolling route. `src/components/modpacks/AddModModal.tsx` repeats that pattern inside the generic modal body. This creates exactly the class of "sticky/fixed/overflow" risk Phase 19 is supposed to simplify:

- outer shell scroll;
- route scroll;
- inner list scroll;
- action row below or beside that scroll.

The safest Phase 19 reading is that nested scrolling should be reduced wherever it blocks truthful end-of-page geometry, especially on details and add-content flows.

### Wizard and add-content routes are closer to the desired pattern, but they still inherit shell ambiguity

`src/components/modpacks/ModpackCreationWizard.tsx` and `src/components/modpacks/AddModPage.tsx` already behave more like flow-first pages. Their action rows live after content inside the main page flow. That is good Phase 19 baseline behavior. The remaining risks are:

- they still render under the same shell with no shared top-safe contract;
- the wizard step-three flow delegates to `AddModModal`, reintroducing nested modal scrolling;
- the sidebar `PLAY` still visually competes with route-owned `Next`, `Create`, or `Add selected` actions.

### Current manual verification does not render the real failing geometry

`src/verification/manual/scenarios.tsx` currently renders:

- `ModpackDetails` by itself, not inside `AppLayout` with `TitleBar` and `Sidebar`;
- `CreateModpackModal`, not the route-owned `ModpackCreationWizard`;
- `AddModModal`, not the route-owned `AddModPage`.

That means the current manual proof seam cannot catch:

- content rendering below the title bar;
- duplicate shell versus route CTA ownership;
- shell-plus-route bottom geometry interactions.

## Shared Seam Opportunities That Avoid Route-Local Hacks

### 1. Make `AppLayout` the only owner of shell top clearance

Phase 19 should introduce one explicit shell-safe seam at `AppLayout` level and have all route content inherit it. The planner should avoid page-level `pt-*`, tab-level offsets, or sidebar-only compensation. `TitleBar` height and any shell-owned top controls should flow into one contract, ideally through:

- a shared layout slot or container seam below the title bar;
- or one shared CSS variable / token that the main pane consumes.

The planner should not let `ModpackDetails`, `ModpackCreationWizard`, or `AddModPage` solve title-bar clearance independently.

### 2. Put CTA ownership above `LaunchControls`, not inside it

`LaunchControls` is already a launch-state seam. It should stay that way. The shared seam opportunity is higher:

- `ModpackRouter` or a small route-context seam can tell the shell whether the current view is shell-owned or route-owned;
- `Sidebar` can then decide whether to render launch as primary, secondary, or not at all.

That avoids sprinkling route checks inside `LaunchControls` or deep pages.

### 3. Introduce one reusable route action-section pattern

The details page, wizard, and add-content page should not each invent their own bottom-action behavior. The planner should consider one shared route action section pattern with these properties:

- inline, flow-first placement after content;
- one primary slot;
- secondary and danger actions grouped without competing emphasis;
- no dependence on viewport pinning.

Phase 19 does not need a broad design system for this, just one truthful pattern for the high-risk routes.

### 4. Treat modal body-plus-footer layout as a reusable seam

`Modal.tsx` only provides one scrollable body slot. Consumers like `AddModModal` then place their own bounded results list and action footer inside that slot. The seam opportunity is either:

- keep actions in the same scroll flow and simplify inner bounded lists;
- or add a deliberate body/footer modal pattern later.

For Phase 19, the safe choice is to avoid route-local `max-h` plus footer combinations that recreate overlap pressure inside modal content.

## CTA Ownership Risks And Likely Migration Strategy

### Current ownership risks

- The sidebar assumes launch is globally primary.
- `ModpackDetailsActions` can expose two route-primary buttons at once.
- Deep route actions proxy back into shell launch behavior by selecting the modpack, navigating back, then deferring `onLaunch`.
- Wizard and add-content flows already have their own obvious primary actions, so leaving shell `PLAY` visually dominant makes the product hierarchy false.

### Likely migration strategy

The least risky migration path is:

1. define a route ownership enum above the shell, not inside individual buttons;
2. keep shell launch primary only on launcher-home contexts and borderline list/index contexts where the shell truly owns the task;
3. treat `details`, `create`, `addMod`, `addResourcePack`, `addShader`, and likely `export` as route-owned CTA contexts;
4. on route-owned contexts, demote or remove sidebar launch emphasis rather than trying to restyle every route CTA upward;
5. on modpack details, collapse to one route-primary slot:
   either `Play` or `Update Available`, but not two simultaneous primary buttons.

The important planning point is that CTA truth should come from navigation context, not from ad hoc per-page toggles.

### Borderline contexts the planner should resolve explicitly

- `ModpackList` and `ModpackBrowser` may still want shell launch to stay primary if the route itself is mainly exploratory.
- `ModpackDetails` definitely does not tolerate shell and route launch both reading as primary.
- Wizard and add-content routes definitely own their current-step CTA.

The plan should record a single rule for these borderline contexts so execution does not devolve into screenshot-by-screenshot judgment calls.

## Bottom-Bar, Sticky, And Overflow Risks With Safest Sequencing

### Highest-risk interaction

The riskiest combination is not a single `fixed` class. It is the stack of:

- shell top edge without a safe-area contract;
- route headers and tabs above a dedicated content scroller;
- persistent route action rows below that scroller;
- nested internal scrollers inside the content;
- modal bodies that contain yet another bounded results list.

If the planner attacks only the bottom row, the top-edge bug and nested scroll traps will keep producing misleading screenshots.

### Safest sequencing

1. Stabilize shared shell top geometry first.
   If the top-safe contract is still unstable, every route screenshot remains noisy and downstream page spacing will churn.

2. Define CTA ownership second.
   This removes the biggest product ambiguity before touching route action layout. It also tells execution which surfaces still need a visible route primary.

3. Normalize route action placement and nested scroll on the highest-risk surfaces.
   `ModpackDetails` is the first priority because it combines all three bugs: duplicate CTA, persistent bottom actions, and dense nested content.

4. Clean up modal and add-content overflow after the shared rule exists.
   `AddModModal` and `AddModPage` should follow the same flow-first action rule rather than inventing separate overflow behavior.

### Specific pitfalls to avoid

- hiding shell `PLAY` only in `ModpackDetails` instead of introducing a shared ownership rule;
- adding top padding inside route pages instead of fixing the shell seam;
- preserving nested `max-h` result lists while also moving actions around, which keeps the overlap pressure hidden;
- expanding scope into tab reflow and density redesign while the geometry contract is still changing.

## Suggested Planner Wave Split And File Ownership Boundaries

The cleanest Phase 19 shape is four plans.

### `19-01` Shared shell top-safe contract

Own:

- `src/components/AppLayout.tsx`
- `src/components/TitleBar.tsx`
- `src/components/Sidebar.tsx`
- `src/components/sidebar/SidebarHeader.tsx` only if needed for collapse-strip fallout

Goal:

- one explicit top-clearance rule below the title bar;
- remove sidebar-local top-edge compensation as a second geometry system.

### `19-02` Shared CTA ownership policy

Own:

- `src/components/modpacks/ModpackRouter.tsx`
- `src/components/Sidebar.tsx`
- `src/components/sidebar/LaunchControls.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsActions.tsx`

Goal:

- define shell-owned versus route-owned primary action contexts;
- collapse modpack-details to one route-primary action;
- keep `LaunchControls` state-focused instead of route-aware.

### `19-03` Dense-route flow and overflow cleanup

Own:

- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx` only for fallout spacing, not broad tab redesign
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/components/modpacks/ModpackCreationWizard.tsx`
- `src/components/modpacks/AddModPage.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/modpacks/AddModModal.tsx`

Goal:

- make the highest-risk routes and modal flows behave as flow-first content;
- reduce nested scroll traps where they hide end-of-page controls or helper text;
- keep Phase 21 tab-density work out unless required to remove overlap.

### `19-04` Proof and regression closure

Own:

- `src/components/__tests__/AppLayout.responsive.test.tsx`
- `src/components/__tests__/Sidebar.keyboard.test.tsx` or a new sidebar ownership seam test
- `src/components/sidebar/__tests__/LaunchControls.status.test.tsx`
- targeted modpack route tests
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/views.ts`

Goal:

- prove the shell-integrated geometry and CTA ownership rules;
- close on screenshot-visible regressions, not only copy/state tests.

This split keeps shell ownership, CTA ownership, route overflow, and verification in separate write zones so multiple workers can move without stepping on one another.

## Recommended Verification And Test Seams

### Structural seam tests

Extend `src/components/__tests__/AppLayout.responsive.test.tsx` so it no longer only checks split direction. It should assert the presence of the shared shell contract the phase introduces, for example:

- a main-pane safe-area wrapper;
- a shell-owned data attribute or test id proving content begins below the title bar seam;
- no per-route dependence for that top offset.

### CTA ownership tests

Do not overload `LaunchControls.status.test.tsx` with route knowledge. Instead:

- keep `LaunchControls` tests focused on launch-state wording and disabled/restart behavior;
- add a shell-context test around `Sidebar` or the shared CTA-owner seam;
- add a modpack-details action test proving only one route-primary action is visible at a time.

### Route overflow tests

The best candidate seams are:

- `ModpackDetails` for bottom action placement and route-owned CTA truth;
- `ModpackDetailsModsTab` for nested-scroll reduction or containment changes;
- `AddModModal` or `Modal` for helper-text visibility and modal-body/footer layout.

These tests should stay structural. They do not need pixel-perfect assertions, but they should verify DOM ownership and scroll-container boundaries after the phase introduces them.

### Manual verification seams

Current manual views are insufficient because they render the wrong surfaces in isolation. Phase 19 should extend `src/verification/manual/scenarios.tsx` so manual proof includes:

- one shell-integrated modpack-details view rendered inside the real app shell;
- one shell-integrated create flow using `ModpackCreationWizard`, not `CreateModpackModal`;
- one shell-integrated add-content flow, plus the modal case if the modal remains in shipped use;
- at least one details screenshot in light theme, because the audit shows the same geometry failure there.

The manual-ready message should explicitly mention shell clearance and CTA hierarchy, not only tab content or dependency copy.

## Validation Architecture

Phase 19 should have Nyquist-style validation. The bug class here is geometric and screenshot-visible, so jsdom alone is not enough.

### Layer 1: seam-level structural tests

Use Vitest for:

- shell safe-area ownership in `AppLayout`
- CTA ownership behavior in `Sidebar` or the shared context seam
- route-primary behavior in `ModpackDetailsActions`
- overflow-structure assertions for the highest-risk route or modal surfaces

### Layer 2: shell-integrated manual verification views

Extend the manual harness so the proof surfaces render inside the real shell, not as isolated components. The minimum Phase 19 proof set should include:

- classic/home shell baseline
- modpack details with sidebar visible
- modpack creation wizard page
- add-content flow with its action footer visible

### Layer 3: targeted screenshot validation

If Nyquist is added for this phase, keep it narrow and geometry-focused:

- top edge clears the title bar
- no competing shell and route primary CTA
- bottom helper/action content remains visible without overlay

The point is not broad visual approval. It is to catch the exact screenshot regressions called out in `new_screens/BUG_REPORT_2026-04-17.md`.

### Layer 4: closeout gates

Phase 19 should still close on the normal repo gates, but those are secondary to geometry proof:

- `npx tsc --noEmit`
- relevant `vitest` lanes for shell and modpack seams
- `npx eslint src/`

## Planner Guidance

- Start at shared shell ownership, not at per-route padding.
- Keep CTA truth in one navigation-aware seam, not spread across individual buttons.
- Prefer flow-first action sections after content over persistent bottom bars.
- Treat nested scroll regions as debt unless they are clearly justified and reserved-space-safe.
- Keep Phase 21 concerns such as tab density, card IA, and broad desktop wrapping out of the plan unless they block the shell invariant directly.

## RESEARCH COMPLETE

Changed file: `/Users/kszinikov/fmcl/.planning/phases/19-baseline-stability-scope-and-shell-invariants/19-RESEARCH.md`
