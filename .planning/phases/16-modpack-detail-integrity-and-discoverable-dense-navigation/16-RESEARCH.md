---
phase: 16
slug: modpack-detail-integrity-and-discoverable-dense-navigation
status: researched
created: 2026-04-14
requirements:
  - DETAIL-01
  - DETAIL-02
  - DETAIL-03
---

# Phase 16 Research

## Goal Lens

Phase 16 is a modpack-detail truth and discoverability repair phase, not a broader modpack-management redesign. The plan needs to make the shipped detail page stop lying about runtime dependencies, stop leaking raw dependency syntax, and stop relying on a horizontally scrolling tab strip as the default way to reach dense secondary sections.

## Requirement Anchor

- `DETAIL-01`: pack-level runtime dependencies such as `minecraft` and `forge` should read as satisfied when the installed modpack configuration already provides them
- `DETAIL-02`: dependency version requirements should render as readable product copy instead of raw range syntax
- `DETAIL-03`: the primary detail sections should remain discoverable without default horizontal tab scrolling

## Audited Bug Cluster Covered Here

- `BUG-06`: `minecraft` and loader dependencies render as missing on the detail surface even when the modpack runtime already provides them
- `BUG-07`: raw dependency range syntax such as Forge-style Maven ranges leaks directly into the UI
- `BUG-09`: the detail-page tab strip depends on horizontal scrolling and becomes hard to discover on dense desktop widths

## Key Code Seams

### Runtime dependency truth seam

- `src/components/modpacks/ModpackDetails.tsx`
- `src/features/modpacks/hooks/useModpackDetailsConfig.ts`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/utils/versionCheck.ts`

`ModpackDetails.tsx` already has both `metadata` and `effectiveConfig` in hand, and `useModpackDetailsConfig.ts` resolves the installed runtime state the UI should trust. The current false-negative behavior is concentrated in `ModpackDetailsModsTab.tsx`, where dependency status is derived only from `mods.find((mod) => mod.id === depId)` plus `isVersionCompatible(installed.version, versionRange)`. The detail surface therefore ignores pack runtime entirely even though the runtime data is already available one level up.

### Requirement-copy seam

- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/utils/versionCheck.ts`
- `electron/services/mods/scanner.ts`
- `shared/types/mods.ts`

The UI currently renders `String(dep.versionRange)` directly in expanded dependency rows. That leaks raw Forge-style strings and collapses string arrays into low-signal comma text. `versionCheck.ts` already understands the accepted range shapes for compatibility decisions, which makes it the safest place to add a formatting helper or companion parser rather than inventing a second version grammar in the component.

### Dense navigation seam

- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx`
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/verification/manual/scenarios.tsx`

The current detail navigation is a simple `div` tablist with `overflow-x-auto`, `whitespace-nowrap`, and no alternate compact or wrapped pattern. Existing tests already cover translated tab labels and secondary content behavior, so the phase can extend that seam instead of creating a separate navigation harness. The manual verification surface already exposes `manual-verification.html?view=modpack-details`, which is the narrowest proof seam for the dense navigation outcome.

## Current Behavior And Likely Root Causes

### 1. Runtime dependencies only look at installed mods, not the pack runtime

`ModpackDetailsModsTab.tsx` treats dependency satisfaction as "is there another installed mod with the same id and a compatible version." This fails for dependencies that are provided by the pack runtime itself, especially:

- `minecraft`
- loader families such as `forge`, `fabric`, `quilt`, or `neoforge`

The phase context already locked the product decision: `effectiveConfig` is the source of truth, runtime-provided dependencies stay in the normal dependency UI, and a wrong runtime version should read as incompatible rather than missing.

Planning implication:
- introduce a resolver that can check runtime-provided dependencies before falling back to installed-mod lookup
- keep the runtime truth contract local to the detail dependency seam unless reuse becomes clearly beneficial
- make sure summary cues and dependency rows share the same resolver so the page does not contradict itself

### 2. Dependency copy leaks parser-friendly syntax instead of user-facing meaning

`ModpackDetailsModsTab.tsx` currently shows the raw `versionRange` value next to the dependency id. That exposes syntax like:

- exact bracketed versions
- lower/upper bounds
- raw string arrays
- unknown Forge fallback blobs from `scanner.ts`

This is not just a localization issue; it is a representation issue. The product needs readable labels such as exact version, at least, up to, or a bounded range while staying faithful to the underlying compatibility logic.

Planning implication:
- derive copy from the same accepted range grammar used for compatibility checks
- keep raw or unknown range strings as a conservative fallback only when the parser truly cannot classify the shape
- route new product-facing copy through locales instead of embedding English phrases in the formatter

### 3. The detail tab strip uses overflow as its primary discovery model

`ModpackDetailsHeader.tsx` renders the primary sections in a single horizontal tab row with `overflow-x-auto`. On audited desktop widths that makes important sections discoverable only if the user notices the strip can scroll. The issue is not that tabs exist; it is that the default navigation pattern becomes hidden when the section count grows.

Phase 16 only needs a discoverable dense-navigation fix, not a new route architecture.

Planning implication:
- keep the existing tab ownership and active-tab model
- replace the default horizontal-scroll-first pattern with a more discoverable dense pattern, such as wrapping, grouped rows, or a compact-but-visible structure that still reads like the current FMCL detail surface
- regression coverage should assert the discoverability contract, not only translated labels

## Existing Patterns And Prior Decisions

- Phase 9 already aligned content-management tabs across `SimplePlayDashboard` and `ModpackDetails`, so Phase 16 should preserve that shared surface feel instead of making the detail route an outlier again.
- Phase 13 locked the direction that dependency truth should stay bound to real manifest or runtime state rather than a prettified but lossy summary.
- Phase 15 kept the milestone bounded to shipped-surface truth repair. Phase 16 should stay equally disciplined: correct the current detail seam, do not turn it into a broader dependency-management or information-architecture initiative.

## Constraints

- User-facing strings must live in `src/locales/en.json` and `src/locales/ru.json`.
- Renderer logic should continue going through current typed seams and component props rather than adding a new cross-process contract.
- The phase should not reopen catalog, settings, or general navigation work that belongs to later phases.
- The dense-navigation fix should stay inside the existing detail page and current tab ownership model.
- The milestone already has Vitest, lint, type-check, and a reusable manual verification seam; no new test platform is needed.

## Likely Planning Slices

### Slice A: Runtime dependency truth contract

Scope:
- pass runtime context into the dependency UI
- resolve runtime-provided vs installed-mod dependencies
- make incompatible runtime versions distinct from missing dependencies
- keep dependency rows and any related summary cues on one truth model

Likely files:
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- possibly a small helper under `src/components/modpacks/details/` or `src/utils/`

### Slice B: Readable dependency requirement copy

Scope:
- add formatter logic for supported range shapes
- replace raw `String(dep.versionRange)` rendering
- add localized product wording for readable requirement states

Likely files:
- `src/utils/versionCheck.ts`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/locales/en.json`
- `src/locales/ru.json`

### Slice C: Discoverable dense detail navigation

Scope:
- replace the default overflow tab strip behavior with a discoverable dense layout
- preserve current tab model and translation behavior
- keep detail screens scannable on audited desktop widths

Likely files:
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx`

### Slice D: Focused proof and manual seam extension

Scope:
- add regression tests for runtime dependency truth, readable ranges, and dense navigation behavior
- extend the existing `modpack-details` manual scenario so the repaired states are reviewable without a new harness
- close the phase under focused gates plus the repo gate

Likely files:
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx`
- `src/verification/manual/scenarios.tsx`

## Risks

- loader-family dependency ids are heterogeneous across scanners and metadata, so the runtime resolver must stay conservative instead of trying to invent deep alias logic
- if range formatting and compatibility parsing diverge, the product copy can look correct while the actual status logic disagrees
- a dense-navigation fix can accidentally regress keyboard semantics if it only changes layout classes without preserving proper tab semantics
- if the phase only fixes expanded dependency rows, the rest of the detail surface can still present contradictory health signals

## Recommended Wave Shape

- Wave 1: runtime dependency truth contract and readable requirement copy
- Wave 2: dense detail navigation and focused regression coverage
- Wave 3: manual-seam proof, integrated gates, and closeout cleanup

Parallelism note:
- the runtime-truth slice and the navigation slice can run in separate plans, but the requirement-copy formatter is tightly coupled to dependency truth and fits best in the same wave

## Validation Architecture

### Existing test infrastructure

- framework: `vitest`
- config: `vitest.config.ts`
- static gates: `npm run lint`, `npx tsc --noEmit`

### Fast feedback

- focused detail-page component tests
- targeted static/type runs on modpack detail components and version helpers

### Coverage gaps the phase should close

- runtime-provided dependency satisfaction and runtime-version incompatibility
- readable rendering for supported range shapes and safe fallback for unknown ones
- dense navigation discoverability on the detail header without raw i18n key regressions
- manual proof that the modpack-details surface stays scannable after the navigation change

### Manual-only checks

- confirm the repaired dependency states read clearly on a realistic modpack detail screen rather than only in isolated DOM assertions
- confirm the dense navigation remains discoverable at the audited desktop width without feeling like a hidden overflow affordance

## Planning Guidance

- keep every plan tied to `DETAIL-01`, `DETAIL-02`, and `DETAIL-03`; this phase is small enough that a plan without direct requirement coverage is likely drift
- avoid planning a backend schema migration unless the current scanner output proves insufficient; the narrowest likely fix is still on the renderer seam
- preserve tab semantics and translated labels while changing dense navigation layout
- reuse the existing manual verification surface instead of inventing a phase-specific proof page

## Files Inspected

- `.planning/phases/16-modpack-detail-integrity-and-discoverable-dense-navigation/16-CONTEXT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/features/modpacks/hooks/useModpackDetailsConfig.ts`
- `src/utils/versionCheck.ts`
- `src/components/modpacks/details/__tests__/SecondaryContentTabs.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx`
- `src/verification/manual/scenarios.tsx`
- `.planning/phases/09-secondary-surface-alignment-and-ux-polish/09-RESEARCH.md`
