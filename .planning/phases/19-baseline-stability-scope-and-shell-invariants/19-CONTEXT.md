# Phase 19: Baseline Stability, Scope, And Shell Invariants - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 19 stabilizes FMCL's shipped desktop shell before broader redesign work spreads. It removes title-bar and shell-edge breakage, stops bottom action areas from hiding content, and establishes one unambiguous primary action per affected context. It does not define the new brand system, redesign dense information architecture, or reopen theme and fallback policy outside direct layout fallout.

</domain>

<decisions>
## Implementation Decisions

### Top-edge shell contract
- Every major launcher surface must start below one shared safe zone that fully clears the custom title bar and any shell-owned top controls.
- The shell should feel desktop-safe and deliberate, not visually integrated into the window chrome at the cost of cropped text or ambiguous edges.
- Route content must not compensate with one-off `pt-*`, sticky offsets, or local spacing hacks; title-bar clearance belongs to shared shell seams.

### Primary action ownership
- Deep route-owned surfaces such as modpack details, creation flows, and add-content flows own the single primary CTA for their current task.
- The sidebar `PLAY` control stays primary only on launcher-home contexts where the shell itself owns the task. On deep routes it must be demoted or otherwise removed from competition with the route CTA.
- Supporting utilities such as rename, duplicate, export, and delete stay secondary or danger-level actions and must not visually compete with launch.

### Bottom action behavior on dense screens
- Phase 19 should prefer flow-first action sections after content instead of pinned or overlaying bottom bars.
- Users must be able to read the final helper text, last cards, and final controls without any action row covering the bottom of the page.
- If a surface later needs a persistent action bar, that should be a deliberate later-phase choice with reserved space. Phase 19 should bias toward the simpler inline pattern.

### Claude's Discretion
- Exact shared spacing values and whether the safe zone is owned by `AppLayout`, route wrappers, or another shared seam.
- Exact demotion treatment for sidebar launch on deep routes, as long as only one primary action remains visually dominant.
- Exact handling of borderline contexts like list/index views where both shell-level and route-level actions exist today, as long as hierarchy stays unambiguous.

</decisions>

<specifics>
## Specific Ideas

- The product direction for this milestone already favors simpler, clearer, more intentional decisions over novelty or clever chrome integration.
- The screenshot audit treats title-bar intrusion, duplicate `Play` CTAs, and overlapping bottom bars as trust-breaking product bugs rather than cosmetic cleanup.
- The right baseline for this phase is "desktop-safe and boring in a good way" so later redesign phases inherit stable geometry instead of compensating for shell breakage.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/AppLayout.tsx`: current shared shell split and the narrowest seam for app-wide top-edge and main-pane layout invariants.
- `src/components/TitleBar.tsx`: authoritative custom chrome height and visual window edge.
- `src/components/Sidebar.tsx` and `src/components/sidebar/LaunchControls.tsx`: current sidebar launch ownership and collapse-strip behavior that currently competes with route CTAs.
- `src/components/modpacks/ModpackDetails.tsx`, `src/components/modpacks/details/ModpackDetailsHeader.tsx`, and `src/components/modpacks/details/ModpackDetailsActions.tsx`: current detail-route header, tab, content, and bottom action seams.
- `src/components/modpacks/ModpackCreationWizard.tsx` and `src/components/modpacks/AddModPage.tsx`: dense route flows that currently expose shell overlap and action-layout pressure.
- `src/verification/manual/scenarios.tsx` and `src/verification/manual/views.ts`: existing manual-proof seam that can verify shell clearance and CTA ownership without inventing a new harness.

### Established Patterns
- Phase 11 already locked the rule that shared shell behavior should live in shared seams rather than per-screen breakpoint fixes.
- Phase 15 already treated launch truth as shared surface work, so Phase 19 should preserve truthful launch ownership by context instead of duplicating strong launch CTAs.
- Phase 16 already bounded dense-route work to repairing existing flows rather than adding new capability; the same scope boundary applies here.
- Existing repo rules require new visible behavior to stay localized and testable rather than hidden in route-only styling hacks.

### Integration Points
- `src/App.tsx` → `src/components/AppLayout.tsx` for global shell behavior across simple and modpack modes.
- `src/components/modpacks/ModpackRouter.tsx` → `ModpackDetails.tsx` / `ModpackCreationWizard.tsx` / `AddModPage.tsx` for route-owned CTA and layout decisions.
- Existing test seams: `src/components/__tests__/AppLayout.responsive.test.tsx` and `src/components/sidebar/__tests__/LaunchControls.status.test.tsx`, with likely new route-layout assertions needed around modpack details and wizard screens.

</code_context>

<deferred>
## Deferred Ideas

- Tab wrapping, dense content IA, and long-label desktop readability belong to Phase 21 unless a change is strictly required to remove overlap or CTA ambiguity.
- Brand/logo/fallback policy belongs to Phase 20.
- Theme/accent/selected-state contrast belongs to Phase 22.
- Modal backdrop strength and degraded-state productization belong to later phases unless touched as direct fallout from shell stabilization.

</deferred>

---

*Phase: 19-baseline-stability-scope-and-shell-invariants*
*Context gathered: 2026-04-17*
