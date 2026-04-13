# Project Research Summary

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.3.0 Adaptive UX Hardening And Launcher Ergonomics`  
**Researched:** 2026-04-13  
**Confidence:** HIGH

## Executive Summary

`v0.3.0` should be a UX-trust milestone, not another broad visual refresh. FMCL already has the main launcher capability surface. The next release needs to make that surface adaptive, readable, predictable, and honest under real usage conditions.

The highest-value work is:

1. fix layout and interaction safety across window sizes
2. make preset themes truly apply in light and dark modes
3. flatten settings IA enough to remove “tab inside tab inside tab” fatigue
4. make launch state understandable so users stop guessing whether the launcher is frozen
5. repair modpack creation/browser/list ergonomics where metadata or actions are currently misleading

## Key Findings

### Stack

The current Electron + React + TypeScript + TailwindCSS + Vite stack is sufficient. The milestone should not introduce a UI-framework migration. It should strengthen shared theme, layout, overlay, and busy-state contracts inside the existing architecture.

### Table Stakes

- adaptive shell and route layouts across varying window sizes
- anchored menus and overlays that stay within the window
- consistent control sizing and spacing rhythm
- preset themes that work in dark and light mode
- readable fields/cards in every shipped preset
- flatter settings navigation for common tasks
- explicit launch and background-operation states
- truthful dependency visibility in modpack creation
- safer, clearer modpack browser and installed-pack actions
- no placeholder/logo leaks on shipped surfaces

### Critical Watch-Outs

- raw coordinate menu placement will keep breaking on resize
- preset themes will remain fake unless semantic tokens cover real surfaces
- settings can still feel deeply nested even after superficial tab cleanup
- launch progress must become a stage model, not only a percent label
- dependency UI must derive from typed metadata instead of local assumptions

## Suggested Phase Structure

### Phase 11: Adaptive Layout And Interaction Foundations

Stabilize responsive layout, control rhythm, overlay anchoring, and placeholder/fallback truth.

### Phase 12: Theme Truth And Settings IA Simplification

Repair preset behavior, close contrast regressions, and simplify the settings structure around common tasks.

### Phase 13: Launch Trust And Modpack Workflow Ergonomics

Make launching understandable and fix the most important modpack authoring/browser/list interaction pain.

### Phase 14: Manual Verification And Release Truth

Close the milestone with resize-aware browser walkthroughs, doc truth, and a bounded list of future parity opportunities.

## Recommended Scope Boundary

Do this in `v0.3.0`:

- UX hardening of current launcher surfaces
- real fixes to theme, layout, settings, launch, and modpack trust gaps
- milestone-wide browser verification at multiple sizes

Do not do this in `v0.3.0`:

- clone other launchers wholesale
- add large new domains unrelated to current UX pain
- rewrite the frontend stack
- turn the milestone into a visual-regression tooling project

## External References Used

- Prism Launcher theme workflow: https://prismlauncher.org/wiki/getting-started/change-themes/
- ATLauncher launch behavior: https://wiki.atlauncher.com/getting-started/launching-minecraft/
- ATLauncher explicit modloader/version creation flow: https://wiki.atlauncher.com/getting-started/creating-a-server/
- Modrinth modpack overview: https://support.modrinth.com/en/articles/8802250-modpacks-on-modrinth
- Modrinth dependency format for `.mrpack`: https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack

## Local Evidence Used

- `src/components/SettingsPage.tsx`
- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/contexts/settings/theme.ts`
- `src/features/launcher/hooks/useLauncher.ts`
- `src/components/modpacks/CreateModpackModal.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `docs/KNOWN_ISSUES.md`

---
*Research completed: 2026-04-13*
*Ready for roadmap: yes*
