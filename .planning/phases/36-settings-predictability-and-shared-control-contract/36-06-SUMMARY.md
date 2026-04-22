---
phase: 36-settings-predictability-and-shared-control-contract
plan: "06"
subsystem: settings
tags: [react, settings, appearance, theme, presets]
requires: [36-05]
provides:
  - preset-owned accent defaults that visibly follow preset family and mode
  - preserved explicit accent overrides across preset and mode switches
  - tokenized shell repaint on live dashboard and sidebar surfaces
affects: [36-07, 36-08, settings, appearance, launcher, sidebar]
tech-stack:
  added: []
  patterns:
    - preset-owned accent runtime
    - inferred legacy override migration
    - preset-aware shell token repaint
key-files:
  created: []
  modified:
    - src/contexts/SettingsContext.tsx
    - src/contexts/settings/theme.ts
    - src/contexts/settings/theme-presets.ts
    - src/contexts/settings/types.ts
    - src/components/settings/tabs/AppearanceTab.tsx
    - src/components/SimplePlayDashboard.tsx
    - src/components/sidebar/ModloaderSection.tsx
    - src/components/sidebar/ModpackSection.tsx
    - src/contexts/settings/__tests__/themeRuntimeContract.test.ts
    - src/components/settings/__tests__/AppearanceTab.presets.test.tsx
key-decisions:
  - "Preset families now own accent defaults per mode until the user explicitly overrides accent."
  - "Legacy appearanceState blobs without accent source metadata are re-inferred instead of silently downgrading user overrides."
  - "Visible launcher repaint comes from tokenized real shell surfaces rather than from extra helper chrome in settings."
patterns-established:
  - "Preset runtime truth should live in normalized settings state, not in view-only labels."
  - "High-visibility launcher surfaces must use theme tokens so preset switching is observable outside the settings panel."
requirements-completed: [SETTINGS-06, DESIGN-01]
duration: 17min
completed: 2026-04-22
---

# Phase 36-06 Summary

**Appearance presets now own their palette defaults, user accent overrides survive preset switches, and launcher surfaces visibly repaint under preset changes**

## Performance

- **Duration:** 17 min
- **Started:** 2026-04-22T20:24:00Z
- **Completed:** 2026-04-22T20:41:00Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Made preset families carry mode-specific accent defaults so switching preset family or light/dark mode now visibly repaints accent without hidden manual cleanup.
- Preserved explicit user accent overrides across preset switches and restored legacy overrides when old `appearanceState` blobs are missing the new `accentColorSource` metadata.
- Moved remaining dashboard/sidebar zinc surfaces onto theme tokens so preset switching is visible in the live launcher shell rather than only in settings state.

## Task Commits

Pending. The atomic task commit is created after this summary.

## Files Created/Modified

- `src/contexts/SettingsContext.tsx` - normalized preset-owned accent behavior, preserved explicit overrides, and restored legacy inference for stored appearance state without source metadata.
- `src/contexts/settings/theme.ts` - introduced accent as a first-class runtime customization scope and resolved effective accent from preset ownership vs user override.
- `src/contexts/settings/theme-presets.ts` - assigned per-mode accent defaults to each preset family.
- `src/contexts/settings/types.ts` - added `accentColorSource` to the appearance state contract.
- `src/components/settings/tabs/AppearanceTab.tsx` - reset now clears preset customizations back to preset-owned accent/runtime state instead of only wiping color overrides.
- `src/components/SimplePlayDashboard.tsx` - switched remaining settings panel heading color to theme tokens.
- `src/components/sidebar/ModloaderSection.tsx` - replaced hard-coded zinc surface/text classes with theme-aware shell tokens.
- `src/components/sidebar/ModpackSection.tsx` - moved selected/no-selected modpack surfaces and secondary copy onto shared theme tokens.
- `src/contexts/settings/__tests__/themeRuntimeContract.test.ts` - added preset-owned accent, explicit override, and legacy migration coverage.
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx` - proved accent defaults repaint under preset/mode changes and that explicit overrides survive family switching.

## Decisions Made

- Accent ownership is now part of normalized appearance state, because without it presets looked saved but visually inert once a global accent was chosen in the past.
- Old stored appearance blobs are inferred rather than defaulted, because silent override loss would have made the new preset model feel random after upgrade.
- Launcher repaint proof is anchored in existing dashboard/sidebar surfaces instead of new explanatory UI, because UAT explicitly rejected more settings chrome.

## Deviations from Plan

None - the intended preset-runtime and shell-repaint seams were implemented directly. One extra migration regression test was added after noticing that old `appearanceState` payloads could otherwise drop explicit accents.

## Issues Encountered

- `tsc` initially rejected the inferred `['accent', ...customizationScopes]` array as `string[]`; the runtime state now types that seam explicitly as `ThemeCustomizationScope[]`.
- The repo already contained a partial preset-accent implementation in progress, so this plan was completed by tightening and validating that state instead of replacing it wholesale.

## User Setup Required

None - no manual configuration or external services required.

## Next Phase Readiness

- `36-07` can now focus purely on control geometry and collapsed-sidebar/button-label alignment on top of a preset model that actually repaints the launcher.
- `36-08` still needs to make advanced appearance controls produce obvious visible effects beyond preset/accent shifts.

---
*Phase: 36-settings-predictability-and-shared-control-contract*
*Completed: 2026-04-22*
