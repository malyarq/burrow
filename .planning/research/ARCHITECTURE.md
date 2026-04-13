# Project Research: Architecture

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.3.0 Adaptive UX Hardening And Launcher Ergonomics`  
**Researched:** 2026-04-13  
**Confidence:** HIGH

## Question

How should the milestone integrate into the existing FMCL architecture without turning UX hardening into another unstable screen-by-screen rewrite?

## Architectural Approach

This milestone should be delivered as a surface-owned rollout on top of shared UI and state contracts, not as a framework or navigation rewrite.

The architecture already has the right seams. The work is to tighten them and stop feature-local exceptions from bypassing them.

## Key Integration Areas

### 1. Appearance And Theme Source Of Truth

**Owners**
- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/index.css`
- `src/components/settings/tabs/AppearanceTab.tsx`

**Needed changes**
- One preset-application path for dark/light/preset/accent behavior
- Semantic color variables expanded enough to cover cards, fields, overlays, and focus states
- Safe preset validation so shipped presets cannot produce unreadable combinations

### 2. Adaptive Shell And Surface Rhythm

**Owners**
- `src/components/AppLayout.tsx`
- `src/components/Sidebar.tsx`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/SimplePlayHome.tsx`
- `src/components/ui/*`

**Needed changes**
- Shared control sizing and spacing tokens
- Responsive container behavior for main surfaces
- No reliance on default window dimensions as an unspoken layout contract

### 3. Settings Navigation

**Owners**
- `src/components/SettingsPage.tsx`
- `src/components/settings/settingsTabs.ts`
- `src/components/settings/SettingsTabsHeader.tsx`
- settings tabs under `src/components/settings/tabs/`

**Needed changes**
- Flatter top-level IA for common settings
- Fewer nested collapsible groups in already-tabbed contexts
- Clear split between routine settings and advanced utilities

### 4. Launch Feedback

**Owners**
- `src/features/launcher/hooks/useLauncher.ts`
- `src/features/launcher/hooks/useLauncherState.ts`
- `src/features/launcher/hooks/useLauncherIPC.ts`
- `src/features/launcher/services/launcherService.ts`
- `src/components/SimplePlayDashboard.tsx`
- `src/features/console/ConsolePage.tsx`

**Needed changes**
- Normalize launcher backend progress events into product-facing stages
- Represent “busy”, “waiting”, “failed”, and “running” distinctly
- Disable or guard repeated launch actions while preserving visible feedback

### 5. Modpack Authoring And Browser Ergonomics

**Owners**
- `src/components/modpacks/CreateModpackModal.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/details/*`
- `src/services/ipc/modpacksIPC.ts`
- `shared/contracts/modpacks.ts`

**Needed changes**
- Surface dependency truth from existing metadata/contracts
- Keep installed-pack actions stable under resize and varying card widths
- Improve browser density, filtering, and action clarity without redoing backend search contracts

### 6. Asset And Fallback Truth

**Owners**
- `src/components/SimplePlayDashboard.tsx`
- `src/components/SimplePlayHome.tsx`
- `src/components/ui/LazyImage.tsx`
- launcher asset paths in `public/`

**Needed changes**
- Remove placeholder leaks
- Ensure fallback imagery is intentional and theme-safe
- Verify easter-egg and classic paths separately from the main happy path

## Proposed Phase Architecture

### Phase 11: Adaptive Layout And Interaction Foundations

Stabilize layout tokens, control rhythm, overlay anchoring, and asset/fallback truth. This creates the visual and interaction contract that later phases can safely consume.

### Phase 12: Theme Truth And Settings IA Simplification

Repair preset behavior and readable surfaces, then simplify the settings structure while the appearance and utility seams are already in focus.

### Phase 13: Launch Trust And Modpack Workflow Ergonomics

Use the stabilized shell/theme/settings foundation to fix the two most trust-critical functional flows: launching and modpack management.

### Phase 14: Verification, Release Truth, And Bounded Parity Notes

Close with live adaptive-size walkthroughs, release-facing docs, and a bounded record of future parity opportunities rather than carrying silent scope into the next milestone.

## What Should Not Happen

- No screen-local responsive hacks that fight shared primitives
- No second theme path for presets
- No ad-hoc menu placement logic per feature
- No “settings redesign” that creates new nesting under new names
- No launch feedback implemented only in logs

## Sources

- Local repo inspection of:
  - `src/components/SettingsPage.tsx`
  - `src/components/settings/settingsTabs.ts`
  - `src/components/settings/tabs/AppearanceTab.tsx`
  - `src/features/launcher/hooks/useLauncher.ts`
  - `src/features/launcher/hooks/useLauncherState.ts`
  - `src/features/launcher/hooks/useLauncherIPC.ts`
  - `src/components/modpacks/CreateModpackModal.tsx`
  - `src/components/modpacks/ModpackList.tsx`
  - `src/components/modpacks/ModpackBrowser.tsx`

---
*Research completed: 2026-04-13*
*Ready for roadmap: yes*
