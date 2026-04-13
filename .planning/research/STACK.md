# Project Research: Stack

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.3.0 Adaptive UX Hardening And Launcher Ergonomics`  
**Researched:** 2026-04-13  
**Confidence:** HIGH

## Question

What stack changes are actually needed to fix FMCL's current UX failures: broken preset themes, weak adaptivity, inconsistent sizing, nested settings IA, unclear launch progress, and awkward modpack flows?

## Conclusion

FMCL does not need a stack rewrite for this milestone. The current Electron + React + TypeScript + TailwindCSS + Vite stack is already sufficient for the work. The gap is not missing platform capability; it is inconsistent use of the existing presentation, theme, and flow seams.

The only stack-level recommendation is to strengthen shared UI primitives and document-level theme behavior before touching more route surfaces. If anchored overlays keep failing, add one small overlay-positioning primitive around the existing component layer instead of hand-placing menus with raw screen coordinates in feature code.

## Keep

- **Electron main/preload/renderer split**
  - Existing IPC seams are already the right boundary for launcher, modpack, and settings work.
- **React + TypeScript strict mode**
  - Needed for state-heavy UI cleanup, typed settings contracts, and safer refactors across shared surfaces.
- **TailwindCSS + CSS custom properties**
  - Already supports adaptive layout, tokenized spacing, and reliable theme application without importing a new design framework.
- **Vitest-based UI regression coverage**
  - Sufficient for seam tests around theme application, settings IA, launch feedback, and modpack ergonomics.

## Strengthen

### 1. Theme Contract

Use `SettingsContext` + `src/contexts/settings/theme.ts` + document CSS variables as the only source of truth for:

- light/dark mode
- preset application
- accent propagation
- readable text/background pairings
- focus and contrast-safe tokens

Preset application should no longer be a best-effort combination of `theme`, `customTheme`, and per-surface fallback styles.

### 2. Layout Contract

Use shared sizing tokens and stable card/control variants across:

- shell navigation
- settings
- classic play
- modpack list and browser
- modal and context menus

The milestone should prefer CSS grid/flex/container-query style adaptation over feature-local width math.

### 3. Overlay Contract

Context menus, dropdowns, and popovers should use one shared anchoring strategy. Current raw `x/y` placement is too fragile for window resizing and non-default bounds.

### 4. Busy-State Contract

Launch, download, install, and background operations need a stable state model with explicit stages. A single percent string is not enough for user trust.

## What Not To Add

- No design-system framework migration
- No renderer rewrite
- No route library rewrite just to flatten settings IA
- No visual-only polish dependency spree
- No launcher-clone feature expansion during this milestone

## Local Evidence

- `src/components/settings/tabs/AppearanceTab.tsx`
  - Presets currently set `theme` and `customTheme`, but the behavior remains vulnerable to inconsistent token usage across screens.
- `src/contexts/settings/theme.ts`
  - Theme application is centralized, but only a subset of semantic variables is normalized there.
- `src/components/modpacks/ModpackList.tsx`
  - Action menu placement uses direct coordinates and fixed width assumptions.
- `src/features/launcher/hooks/useLauncher.ts`
  - Launch state exposes only `progress`, `statusText`, logs, and `isLaunching`; this is too weak for clear staged UX.

## Recommended Build Order

1. Adaptive layout and shared control rhythm
2. Theme preset truth and contrast safety
3. Settings IA flattening
4. Launch-state clarity
5. Modpack creation/browser/list ergonomics
6. Milestone-wide browser verification and release-truth cleanup

## Sources

### Primary

- Local repo inspection of `src/components/settings/tabs/AppearanceTab.tsx`
- Local repo inspection of `src/contexts/settings/theme.ts`
- Local repo inspection of `src/components/modpacks/ModpackList.tsx`
- Local repo inspection of `src/features/launcher/hooks/useLauncher.ts`
- Local repo inspection of `docs/KNOWN_ISSUES.md`

### Secondary

- Prism Launcher theme workflow: https://prismlauncher.org/wiki/getting-started/change-themes/
- ATLauncher launch flow: https://wiki.atlauncher.com/getting-started/launching-minecraft/
- ATLauncher server/start logs model: https://wiki.atlauncher.com/getting-started/starting-a-server/

---
*Research completed: 2026-04-13*
*Ready for requirements: yes*
