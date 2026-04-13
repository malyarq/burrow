# Phase 11 Research: Adaptive Layout And Interaction Foundations

## What The Planner Needs To Know

Phase 11 is the trust-foundation phase for `v0.3.0`. It should not try to solve every UX issue the user reported. Its job is to fix the structural interaction defects that make later work unreliable:

1. layout behavior still assumes a narrow set of window sizes;
2. sizing and rhythm drift between shell, cards, and controls;
3. anchored menus and overlays use brittle coordinate logic;
4. placeholder and fallback assets still leak on shipped classic surfaces.

The right phase boundary is therefore:

1. make the shell and highest-traffic surfaces behave responsively at multiple window sizes;
2. establish one shared sizing and density contract for controls and cards;
3. replace raw overlay placement assumptions with an overflow-safe anchoring seam;
4. remove visible placeholder and fallback leaks on the classic and logo-driven surfaces;
5. close on focused resize and interaction verification, not broad route redesign.

The planner should explicitly avoid absorbing:

- preset-theme correctness across all surfaces;
- deep settings IA simplification;
- launch-stage clarity work;
- modpack dependency truth and browser redesign.

Those are real milestone goals, but they belong to later phases once the layout and interaction foundations stop shifting under them.

## Requirement Fit

This phase directly covers:

- `ADPT-01`: adaptive launcher behavior across default and resized window bounds
- `ADPT-02`: consistent control sizing, row rhythm, and card density
- `ADPT-03`: anchored menus, dropdowns, and overlays that remain inside the current window
- `VIS-01`: placeholder and fallback asset leaks on shipped classic and easter-egg surfaces

This phase should intentionally not claim:

- `THEME-01` or `THEME-02`
- `NAV-01`
- `LAUNCH-01` or `LAUNCH-02`
- `MPUX-01` through `MPUX-03`
- `VER-01` or `DOC-01`

## Current Baseline

### The shell already has the main responsive pressure points

`src/components/AppLayout.tsx` and `src/components/Sidebar.tsx` own the main two-pane launcher structure. Today they already expose the likely failure modes:

- hard width steps for collapsed / compact / full sidebar (`w-16`, `w-64`, `w-80`)
- shell overflow boundaries that assume stable proportions
- classic and modpack modes sharing the same shell while consuming very different content density

This means Phase 11 should start at shell ownership, not at isolated widgets.

### The classic dashboard mixes real product content with decorative layout assumptions

`src/components/SimplePlayDashboard.tsx` and `src/components/SimplePlayHome.tsx` carry:

- large logo-driven hero layout
- welcome banner
- collapsible embedded content panels
- classic-mode product identity and easter-egg surfaces

These files matter for two reasons:

1. they are the easiest place for fixed-spacing assumptions and overflow to survive;
2. they are the exact place where placeholder or fallback asset leaks destroy trust on the most visible path.

### Settings already has one layer of tabs before tab content adds more grouping

`src/components/SettingsPage.tsx` and `src/components/settings/SettingsTabsHeader.tsx` already expose the top-level settings navigation seam. Phase 11 should not redesign settings IA yet, but it does need to normalize responsive tab header behavior and panel sizing because later settings simplification depends on that shell being stable.

### Installed modpack actions already prove the overlay problem

`src/components/modpacks/ModpackList.tsx` currently opens the action menu with direct coordinate math:

- `rect.right - 192`
- `rect.bottom + 8`

That is the phase's strongest local evidence for `ADPT-03`: the current menu strategy is brittle and window-size-sensitive. Planner output should treat modpack card actions as the proving ground for the new anchored overlay seam.

### Shared primitives exist, but layout rhythm is not yet a hard contract

The project already has a credible shared UI base:

- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Modal.tsx`
- `src/index.css`

But Phase 11 should only touch primitives where necessary to normalize size/rhythm and anchor behavior for real consumers. It should not reopen the broader design-system work from `v0.2.0`.

## Brownfield-Safe Sequencing

### 1. Stabilize shell and responsive container behavior first

Before fixing a card menu or placeholder asset, the planner should stabilize:

- shell width behavior
- content min/max width expectations
- cross-mode overflow handling
- consistent spacing between primary shell sections

Otherwise later card or route fixes will still be hostage to the old container behavior.

### 2. Treat overlay anchoring as a shared seam, not a one-off ModpackList fix

The planner should use `ModpackList` as the first consumer, but the fix should create a reusable anchored overlay rule or helper rather than another set of per-feature coordinates.

### 3. Keep placeholder/fallback truth in the same phase as responsive shell work

Placeholder leaks are easy to defer as polish. That would be a mistake here, because the classic shell and logo surfaces are among the first adaptive experiences users see. Phase 11 should close those leaks while the shell and hero surfaces are already being touched.

### 4. Defer theme and IA changes unless they are required to support responsiveness

If the planner starts mixing preset theme correctness or settings regrouping into this phase, it will blur phase ownership and likely leave the responsive foundation half-done.

## Planning Risks

- If Phase 11 becomes “general polish,” the adaptive contract will still be weak when Phase 12 and Phase 13 start.
- If overlay anchoring is fixed only in one menu, the same overflow behavior will reappear in other surfaces later.
- If responsive work is tested only at one window size, the milestone will repeat the same false confidence that caused the current complaints.
- If placeholder/fallback review is skipped, the launcher can still feel unfinished even after layout work lands.
- If the planner touches too many route-specific details now, execution will stall on unrelated UX debates before the foundation phase is complete.

## Recommended Plan Shape

The cleanest Phase 11 decomposition is four plans:

- `11-01`: normalize responsive shell and shared sizing rhythm across the foundational surfaces that broadcast launcher structure
- `11-02`: build an overflow-safe anchored overlay seam and migrate brittle menu consumers onto it
- `11-03`: close placeholder and fallback truth gaps on classic/logo-driven surfaces and any foundational empty states touched by the phase
- `11-04`: close the phase with focused adaptive verification and fallout-only fixes

Recommended wave map:

- Wave 1: `11-01`, `11-02`
- Wave 2: `11-03`
- Wave 3: `11-04`

This shape keeps the layout contract and interaction seam first, then visual trust cleanup, then verification.

## Validation Architecture

Phase 11 can use the existing Vitest + jsdom lane plus narrow live-browser checks.

### Layer 1: layout and shell seam tests

Add or extend focused component tests around:

- `Sidebar`
- `SettingsTabsHeader`
- any shared shell/container seam used to assert keyboard-safe responsive behavior and non-duplicated structure

These tests should not try to prove visual beauty; they should prove structural behavior and safe interaction states.

### Layer 2: anchored overlay tests

Add a focused test for the first anchored overlay consumer, likely `ModpackList`, covering:

- action menu opens from the trigger
- keyboard and pointer opening share the same anchoring contract
- menu remains associated with its trigger semantics

### Layer 3: placeholder and fallback truth checks

Use focused component tests where deterministic, plus live-browser checks for:

- classic surface logo/fallback rendering
- easter-egg surface fallback paths

This is partly visual and may need browser evidence in addition to jsdom.

### Layer 4: repo gate closure

Phase 11 should still close on:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`

### Required manual checks

Because `ADPT-01` is fundamentally about real window sizes, the phase should include narrow live-browser spot checks at more than one size before closeout. This is not the full milestone walkthrough; it is targeted adaptive validation.

## Planner Guidance

- Prefer changing ownership seams that many routes share over polishing a single route.
- Use `AppLayout`, `Sidebar`, `SimplePlayDashboard`, `SimplePlayHome`, `SettingsTabsHeader`, and `ModpackList` as the phase's main consumers.
- Keep the phase honest: if a change is mainly about theme preset correctness, settings regrouping, launch-stage clarity, or modpack dependency truth, it probably belongs to a later phase.
- Make the verification plan explicitly mention multiple window sizes and anchored overlay behavior so `ADPT-01` and `ADPT-03` are not reduced to code review guesses.
