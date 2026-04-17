# Project Research Summary

**Project:** FriendLauncher (FMCL)  
**Domain:** Electron desktop Minecraft launcher redesign and brand reset  
**Researched:** 2026-04-17  
**Confidence:** HIGH

## Executive Summary

`v0.5.0` should be planned as a redesign-quality milestone for the shipped launcher, not as a new-capability milestone. The research is consistent across stack, features, architecture, and pitfalls: FMCL already has the right runtime foundation, but it lacks shared shell rules, trustworthy action and state hierarchy, productized fallback/error behavior, and a coherent brand system across dense desktop surfaces.

The milestone recommendation is to keep the current Electron + React + TypeScript + Tailwind + Vite architecture and invest in renderer-local foundations first: semantic brand tokens, shell and overlay metrics, shared control and fallback primitives, and proof on the existing manual verification seam. The main delivery risk is trying to repaint screens one by one while baseline shell defects, CTA conflicts, locale leaks, and degraded-state behavior remain unresolved.

## Key Findings

### Stack Additions / Changes

Keep the core stack. `v0.5.0` does not justify a new UI framework, router, state manager, theming library, or IPC-heavy redesign.

Add or strengthen these repo-local capabilities:

- brand tokens on top of Tailwind v4 and the current runtime theme system
- shared shell metrics for title bar, content insets, sticky regions, action bars, overlays, and elevation
- one branded fallback and error-state layer for missing art, empty states, recoverable errors, and fatal crashes
- screenshot regression coverage on top of `manual-verification.html`
- repo-level guards for raw locale keys, unresolved template placeholders, and locale drift

### Table Stakes

These are the minimum milestone outcomes users now expect from the existing launcher:

- window-safe shell behavior so content does not clip under the custom title bar or behind fixed footers
- one truthful primary action and one truthful runtime state model per route
- graceful fallback, empty, missing-media, and fatal-error behavior that does not leak raw implementation detail
- readable dense desktop navigation, tabs, filters, helpers, and action rows at shipped window sizes
- reliable contrast, selection, disabled, hover, and locale behavior across theme presets

### Differentiators

These are the bounded redesign gains that make `v0.5.0` worth doing:

- an FMCL-specific brand reset across welcome, sidebar, browser, modpack details, settings, modal, and degraded states
- clearer modpack-first confidence surfaces so loader, dependency health, pack identity, and local actions read immediately
- an authored theme system with a smaller number of sharper, more truthful presets
- stronger product judgment in secondary states such as empty labels, modal focus, microcopy, and default/fallback visuals

### Anti-Features

These are attractive but incorrect directions for this milestone:

- a bug-fix-only pass without shared shell, token, and fallback rules
- new capability expansion during the redesign
- preset proliferation, effect-heavy customization, or screenshot-first novelty styling
- raw technical transparency in user-facing crash and fallback surfaces
- duplicate CTAs kept for “discoverability” instead of deciding route ownership

## Architecture And Build Order

The redesign should stay primarily inside `src/`. `electron/` and `shared/` only need changes when packaged assets or native window behavior truly require them. The architecture guidance is stable:

- redesign token-first, not page-by-page utility overrides
- make shell geometry shell-owned, not route-owned
- keep one primary CTA owner per route
- centralize brand assets, missing-media handling, empty states, and fatal-error presentation
- extend the existing manual verification hub instead of inventing a new proof system

### Build Order

1. **Baseline stability and shell invariants**  
   Clear crash-capable baseline debt, freeze defect scope, and define shared titlebar, footer, scroll, and overlay contracts.

2. **Brand tokens and chrome metrics**  
   Formalize spacing, radius, shadows, typography, surface tiers, accent behavior, and shell metrics in `index.css`, `theme.ts`, and related renderer seams.

3. **Brand and fallback foundation**  
   Expand `branding.ts`, unify empty and error states, and replace raw crash output with one product-owned degraded-state language.

4. **Shared controls and state visibility**  
   Normalize button, input, select, tab, segmented, and action-bar behavior so selected, disabled, focus, and accent states are consistent.

5. **High-traffic surface migration**  
   Rebuild shell-owned screens on top of those foundations: settings, dashboard, sidebar, modpack list/browser/details, then secondary flows.

6. **Verification, locale, and release truth**  
   Extend `src/verification/manual/*`, add screenshot checks, verify EN/RU plus wide/narrow and degraded states, and only then roll forward roadmap/docs truth.

### Planning Buckets For REQUIREMENTS.md And ROADMAP.md

These are the natural milestone buckets implied by the research:

- baseline stability, scope, and shell invariants
- brand system, shared tokens, and surface migration
- dense surface IA, navigation, and CTA hierarchy
- theme truth and interaction-state fidelity
- fallback, error, and placeholder productization
- verification, locale, and release truth

## Major Pitfalls

1. **Starting on an unstable baseline**  
   Do not begin broad visual migration while crash-prone or lint-breaking shared surfaces remain unresolved.

2. **Painting over broken shell geometry**  
   Do not solve titlebar, sticky-header, or footer collisions with route-local spacing hacks; define shared shell contracts first.

3. **Running the brand reset as a per-screen repaint**  
   Do not refresh hero screens while sidebars, modals, controls, and degraded states keep the old visual language.

4. **Preserving old CTA hierarchy under new chrome**  
   Do not keep both shell-level and route-level primary actions visible on the same screen.

5. **Designing dense surfaces against happy-path content only**  
   Plan against long names, RU strings, narrow windows, missing art, and contradictory metadata from day one.

6. **Making themes expressive but not state-truthful**  
   Theme work must prove selected, focus, disabled, hover, slider, scrollbar, and segmented states, not just resting surfaces.

7. **Treating degraded states as cleanup**  
   Missing art, placeholders, empty states, and fatal-error presentation need owned scope, not end-of-milestone leftovers.

8. **Declaring done from curated screenshots**  
   Close the milestone through the existing verification seam with theme, locale, size, and degraded-state proof.

9. **Letting redesign become scope drift**  
   Keep every requirement tied back to current shipped trust issues and brand-consistency gaps, not net-new product surface area.

### Additional Guardrails

- avoid heavy blur and layered effects that degrade desktop performance on integrated GPUs
- avoid JS resize or scroll math when CSS shell contracts can solve layout
- avoid remount-heavy theme or locale switching that causes flicker or lost state
- avoid rendering raw `Error` objects, IPC payloads, file paths, or template variables in user-visible UI

## Implications For Next Documents

### REQUIREMENTS.md should be framed around outcomes, not feature expansion

- redesign existing surfaces only
- make shell geometry, CTA truth, theme truth, fallback quality, and locale truth explicit acceptance areas
- require degraded-state behavior and verification proof as first-class scope
- forbid framework swaps, route expansion, and cosmetic-only repaint work

### ROADMAP.md should sequence foundation before migration

- start with baseline and shell/token foundations
- migrate shared fallbacks and controls before screen-by-screen redesign
- move high-traffic surfaces before secondary flows
- end with verification and documentation truth, not with a purely visual closeout

## Confidence Assessment

| Area | Confidence | Notes |
| --- | --- | --- |
| Stack | HIGH | All research points to strengthening the current stack rather than replacing it |
| Features | HIGH | Table stakes, differentiators, and anti-features are directly grounded in current product evidence |
| Architecture | HIGH | Existing renderer seams and verification seams already support the recommended build order |
| Pitfalls | HIGH | The main failure modes are concrete and repeatedly evidenced in the current launcher state |

**Overall confidence:** HIGH

### Gaps To Carry Into Planning

- confirm exact CTA ownership decisions on routes where shell and page actions currently compete
- confirm the final overflow pattern for dense tab sets under real EN/RU content pressure
- confirm whether any additional packaged brand assets require narrow shared-contract changes beyond the current icon path

## Sources

- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`
- `/Users/kszinikov/.codex/get-shit-done/templates/research-project/SUMMARY.md`

---
*Research completed: 2026-04-17*  
*Ready for milestone planning: yes*
