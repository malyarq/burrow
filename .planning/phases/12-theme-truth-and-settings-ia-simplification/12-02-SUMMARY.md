---
phase: 12-theme-truth-and-settings-ia-simplification
plan: "02"
subsystem: ui
tags: [react, theming, settings, modpacks, vitest]
requires:
  - phase: 12-theme-truth-and-settings-ia-simplification
    provides: truthful preset identity and runtime document tokens from 12-01 that contrast cleanup can reuse without adding a second theme source
provides:
  - semantic theme coverage for shared textareas, breadcrumbs, loading feedback, and skeleton placeholders
  - readable preset-safe settings, update, multiplayer, and modpack import or install surfaces on the highest-risk routes
  - focused regression tests for game settings and modpack import theme surfaces
affects: [12-03 settings IA simplification, 12-04 phase verification, 13 modpack workflow ergonomics]
tech-stack:
  added: []
  patterns: [surface-soft and helper-text semantic seams, shared Select/Textarea reuse for preset-safe controls]
key-files:
  created:
    - src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx
    - src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx
  modified:
    - src/index.css
    - src/components/ui/Textarea.tsx
    - src/components/ui/LoadingSpinner.tsx
    - src/components/ui/Breadcrumbs.tsx
    - src/components/ui/SkeletonLoader.tsx
    - src/components/settings/tabs/GameTab.tsx
    - src/components/settings/tabs/game/RuntimeSection.tsx
    - src/components/UpdateModal.tsx
    - src/components/MultiplayerPage.tsx
    - src/components/modpacks/ImportModpackPreviewModal.tsx
    - src/components/modpacks/ImportModpackPreviewPage.tsx
    - src/components/modpacks/InstallModpackModal.tsx
key-decisions:
  - "Reuse shared semantic seams (`surface-soft`, `helper-text`, `control-frame`, `Select`, `Textarea`) instead of retokenizing each contrast regression with one-off zinc or white classes."
  - "Lock theme readability with narrow DOM-class assertions on the highest-risk settings and import screens instead of broad whole-app retokenization or screenshot infrastructure."
patterns-established:
  - "Contrast-sensitive surfaces should compose shared theme-aware primitives first and only keep hardcoded color cues for status states like warnings."
  - "Preset regressions are tested at the route seam by asserting semantic classes on live controls and cards."
requirements-completed: [THEME-02]
duration: 14min
completed: 2026-04-13
---

# Phase 12 Plan 02: Contrast Cleanup Summary

**Preset readability now holds on FMCL's riskiest settings, update, multiplayer, and modpack import surfaces because shared controls and route cards render through semantic theme seams instead of hardcoded white or zinc palettes**

## Performance

- **Duration:** 14 min
- **Started:** 2026-04-13T14:33:48Z
- **Completed:** 2026-04-13T14:48:13Z
- **Tasks:** 2
- **Files modified:** 19

## Accomplishments
- Repointed shared feedback and input primitives to theme-aware surface classes and document variables so presets stop collapsing into hardcoded neutral colors.
- Reworked the highest-risk settings, update, multiplayer, and modpack preview or install screens to use semantic wrappers, shared controls, and accent-content text where needed.
- Added focused regression tests that prove the game settings and modpack import seams render with semantic classes instead of drifting back to preset-hostile styling.

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand semantic theme coverage through shared seams** - `240f403` (fix)
2. **Task 2: Migrate the highest-risk preset-sensitive screens and add focused readability tests** - `b876b5e` (fix)

## Files Created/Modified
- `src/index.css` - Adds reusable `helper-text` and `surface-soft` semantic seams for high-risk contrast surfaces.
- `src/components/ui/Textarea.tsx` - Moves textarea styling onto the shared control contract and theme document variables.
- `src/components/ui/LoadingSpinner.tsx` - Replaces neutral spinner borders with semantic border, foreground, secondary, and accent tokens.
- `src/components/ui/Breadcrumbs.tsx` - Swaps hardcoded breadcrumb text and separator colors for semantic foreground and muted tokens.
- `src/components/ui/SkeletonLoader.tsx` - Uses foreground alpha instead of fixed neutral backgrounds for loading placeholders.
- `src/components/settings/tabs/GameTab.tsx` - Wraps the game settings panel in the new semantic surface seam.
- `src/components/settings/tabs/game/ArgsSection.tsx` - Reuses the shared textarea primitive for JVM and game arguments.
- `src/components/settings/tabs/game/RuntimeSection.tsx` - Converts helper copy and Java selection to semantic labels, selects, and warning surfaces.
- `src/components/settings/tabs/game/AutoConnectSection.tsx` - Moves the toggle card and checkbox styling to shared theme-aware surfaces.
- `src/components/settings/tabs/game/ResolutionSection.tsx` - Aligns the fullscreen row with the semantic settings-card pattern.
- `src/components/settings/tabs/game/MinecraftPathSection.tsx` - Drops preset-hostile secondary button overrides from the launcher path controls.
- `src/components/UpdateModal.tsx` - Makes version cards, status copy, and secondary actions render through semantic surfaces.
- `src/components/MultiplayerPage.tsx` - Rebuilds the mode switcher and network controls with semantic surfaces and accent-content text.
- `src/components/modpacks/ImportModpackPreviewModal.tsx` - Converts the preview metadata card and action footer to semantic theme classes.
- `src/components/modpacks/ImportModpackPreviewPage.tsx` - Applies the same preset-safe metadata and header treatment to the full-page preview flow.
- `src/components/modpacks/InstallModpackModal.tsx` - Replaces neutral metadata and cancel-button overrides with semantic cards and controls.
- `src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx` - Verifies the highest-risk game settings surfaces render through semantic wrappers and controls.
- `src/components/modpacks/__tests__/ImportModpackPreview.theme.test.tsx` - Verifies import preview and install flows keep semantic cards and accent-content actions.

## Decisions Made

- Reused shared semantic control seams instead of inventing per-screen theme fixes, so later settings IA cleanup can inherit the same readable surfaces.
- Treated accent buttons and active tabs as accent-background plus `--accent-content` text, removing the last hardcoded white text from the plan scope.
- Kept status warnings as explicit amber/error cues while moving all baseline cards, helper copy, and form controls to preset-aware semantic classes.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The plan-level ESLint command includes `src/index.css`, but the current ESLint config does not lint CSS files. Code-file lint verification was rerun with `--no-warn-ignored` after the exact command surfaced an ignored-file warning.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `12-03` can simplify settings information architecture on top of readable, shared theme-safe controls instead of revisiting contrast fixes.
- `12-04` now has focused regression tests for the highest-risk preset surfaces to reuse during phase verification.

## Self-Check: PASSED

- FOUND: `.planning/phases/12-theme-truth-and-settings-ia-simplification/12-02-SUMMARY.md`
- FOUND: `240f403`
- FOUND: `b876b5e`

---
*Phase: 12-theme-truth-and-settings-ia-simplification*
*Completed: 2026-04-13*
