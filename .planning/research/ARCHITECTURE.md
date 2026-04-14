# Project Research: Architecture

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.4.0 Launcher Truth And Product Polish`  
**Researched:** 2026-04-14  
**Confidence:** HIGH

## Research Question

How should launch-state truth, dependency resolution truth, localization completion, fallback assets, and adaptive navigation fixes integrate with the existing Electron main process, preload bridges, renderer services, and shared UI seams?

## Architectural Approach

`v0.4.0` should be delivered as a surface-owned truth and polish rollout on top of current FMCL seams, not as a rewrite. The architecture already has the right layers:

- Electron main process owns launcher, filesystem, and dependency truth
- preload bridges expose capabilities into the renderer
- renderer hooks and service wrappers translate those capabilities into product-facing UI

The failures in the screenshot audit come from drift between these layers. Several screens are rendering stale, incomplete, or unlocalized interpretations of data that already exists elsewhere in the app.

## Key Integration Areas

### 1. Launch Truth And Runtime Feedback

**Primary owners**
- `src/components/SimplePlayDashboard.tsx`
- `src/features/launcher/hooks/useLauncher.ts`
- `src/features/launcher/hooks/useLauncherIPC.ts`
- `src/features/launcher/services/launcherService.ts`
- `electron/services/runtime/taskRunner.ts`

**What to integrate**
- one renderer-facing launch stage model
- one source for status title, detail, progress, and CTA disabled/loading state
- localized runtime status text derived from typed launch stages rather than raw log phrasing

**Why this seam matters**
- `SimplePlayDashboard.tsx` already consumes `launchStage`, `statusText`, `statusDetail`, and `progress`
- the audit proves those cues can currently disagree on one screen

### 2. Modpack Detail Integrity And Dependency Semantics

**Primary owners**
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModsTab.tsx`
- `src/components/modpacks/details/*`
- `src/services/ipc/modpacksIPC.ts`
- `shared/contracts/modpacks.ts`
- `electron/services/mods/scanner.ts`

**What to integrate**
- pack-level runtime metadata with mod dependency status rendering
- readable dependency requirement formatting before values reach the UI
- dense detail navigation that does not depend on dedicated horizontal scrolling as the default behavior

**Why this seam matters**
- `ModpackDetails.tsx` assembles metadata, mod state, tabs, and active content panes
- dependency truth is likely split between pack runtime data and scanner output

### 3. Catalog Scanability, Fallback States, And Compact Navigation Safety

**Primary owners**
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/Sidebar.tsx`
- `src/components/ui/LazyImage.tsx`
- `src/app/assets/branding`

**What to integrate**
- shared fallback art and empty-state treatment
- filter and toolbar layout that remains legible with the sidebar open
- collapsed navigation with consistent icon-based active states

**Why this seam matters**
- the audit defects are renderer-surface problems, but they should share one fallback and compact-state policy instead of multiple feature-local hacks

### 4. Settings Localization And Preset Naming Cohesion

**Primary owners**
- `src/components/settings/settingsTabs.ts`
- `src/components/settings/SettingsTabsHeader.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/contexts/settings/theme-presets.ts`
- `src/locales/en.json`
- `src/locales/ru.json`

**What to integrate**
- complete locale coverage for shipped settings and launch-adjacent labels
- one deliberate preset naming rule across RU and EN
- shared settings metadata that never leaks raw locale keys into the tabs shell

**Why this seam matters**
- the audit shows both missing translation coverage and preset labels that are defined outside locale files

## Suggested Build Order

### 1. Shared Truth Seams First

Stabilize launch-state mapping, locale ownership, and shared fallback-art policy first.

This prevents later polish work from making one surface prettier while another surface still lies or leaks raw strings.

### 2. Modpack Detail Integrity Second

Then fix dependency semantics and dense detail navigation as one coherent slice.

This work depends on honest metadata interpretation but stays within one product area once that truth is available.

### 3. Catalog, Compact Nav, And Settings Polish Third

After the shared truth rules exist, finish the remaining scanability, fallback, and localization defects across browser, cards, sidebar, and settings shell.

### 4. Verification And Release Truth Last

Close with targeted tests, manual walkthrough evidence, and green repo gates rather than assuming the product is fixed because the screens look cleaner.

## What Should NOT Happen

- no screen-local launch-state patches that bypass shared launcher status mapping
- no separate dependency interpretation rules in multiple tabs or cards
- no second fallback-art system for launch hero versus modpack cover cards
- no localization cleanup that edits copy in one component but leaves locale catalogs incomplete
- no scope expansion into new routes or feature work unrelated to the audited shipped surfaces

## Likely Files And Seams To Touch

| Area | Likely files or modules |
| --- | --- |
| Launch truth | `src/components/SimplePlayDashboard.tsx`, `src/features/launcher/hooks/useLauncher.ts`, `src/features/launcher/services/launcherService.ts`, `electron/services/runtime/taskRunner.ts` |
| Modpack detail semantics | `src/components/modpacks/ModpackDetails.tsx`, `src/components/modpacks/details/ModsTab.tsx`, `electron/services/mods/scanner.ts`, `shared/contracts/modpacks.ts` |
| Catalog fallbacks and filters | `src/components/modpacks/ModpackBrowser.tsx`, `src/components/modpacks/ModpackList.tsx`, `src/components/ui/LazyImage.tsx`, branding assets |
| Compact nav | `src/components/Sidebar.tsx` and sidebar subcomponents |
| Settings localization | `src/components/settings/settingsTabs.ts`, `src/components/settings/tabs/AppearanceTab.tsx`, `src/contexts/settings/theme-presets.ts`, locale JSON files |

## Sources

- `.planning/PROJECT.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/settings/settingsTabs.ts`
- `src/contexts/settings/theme-presets.ts`

---
*Research completed: 2026-04-14*  
*Ready for roadmap: yes*
