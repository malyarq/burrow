# Project Research: Features

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.3.0 Adaptive UX Hardening And Launcher Ergonomics`  
**Researched:** 2026-04-13  
**Confidence:** HIGH

## Question

What are the real table-stakes and high-value UX fixes for the next milestone, given the user-reported pain and current launcher patterns in Prism Launcher, ATLauncher, and Modrinth?

## Recommended Feature Categories

### 1. Adaptive Layout And Interaction Safety

**Table stakes**
- Shell, dashboard, settings, and modpack surfaces adapt to different window sizes without clipped controls or broken density
- Context menus and floating actions stay anchored to their trigger and inside the window bounds
- Shared controls use consistent height, spacing, and action hierarchy

**Differentiators**
- Graceful adaptation across first-launch default bounds and later user-resized windows
- Dense but readable layouts for modpack-heavy workflows instead of oversized empty chrome

### 2. Theme Truth And Readability

**Table stakes**
- Preset themes apply immediately and reliably in both dark and light mode
- Text, inputs, cards, and overlays remain readable in every shipped preset
- Theme changes affect the real launcher, not only isolated widgets

**Differentiators**
- Presets feel intentional instead of being thin wrappers around one light-mode success path
- Accent and preset behavior remains safe on content-heavy modpack/settings screens

**External evidence**
- Prism Launcher exposes both widget themes and icon themes as explicit UI choices, reinforcing that appearance controls must have visible and understandable effects.

### 3. Settings Information Architecture

**Table stakes**
- Users can reach appearance, launcher, downloads, storage, statistics, and accounts without getting trapped in nested tab-inside-tab patterns
- Advanced controls stay available, but the common path is flatter and easier to scan

**Differentiators**
- Core preferences and advanced utilities are separated cleanly by intent
- Repeated “detail panel inside settings panel inside collapsible section” patterns are reduced

### 4. Launch Trust And Busy-State Feedback

**Table stakes**
- User can tell whether FMCL is preparing versions, downloading assets, resolving dependencies, launching Java, or running the game
- Primary buttons reflect busy/blocked state clearly enough to stop spam-clicking
- Failures and waits are visible as launcher states, not only as buried logs

**Differentiators**
- A compact launch timeline or stage model that turns raw backend progress into understandable product feedback
- Better separation between “still working” and “waiting for user attention”

**External evidence**
- ATLauncher keeps the launch action explicit and exposes logs/output in a separate, clearly acknowledged launch surface instead of pretending nothing is happening.

### 5. Modpack Creation And Dependency Truth

**Table stakes**
- Modpack creation shows required runtime dependencies correctly, including Minecraft and selected loader/runtime choices
- Required and optional dependency states are distinguishable
- Users do not leave creation flows with false assumptions about what the modpack contains

**Differentiators**
- Dependency summaries are visible before commit, not hidden behind later detail screens
- Export/import flows stay consistent with creation-time metadata

**External evidence**
- Modrinth's `.mrpack` format explicitly lists `minecraft`, `forge`, `neoforge`, `fabric-loader`, and `quilt-loader` in `dependencies`, so launchers should surface these as first-class dependencies rather than omit them.
- Modrinth also recommends a chooser dialog for optional files, which implies FMCL should distinguish required vs optional content clearly instead of flattening everything into one vague dependency list.

### 6. Modpack Browser And Installed-Pack Ergonomics

**Table stakes**
- Browser states are easy to scan and filter
- Installed-pack cards expose actions predictably without mispositioned menus
- Core actions such as details, duplicate, rename, export, and browse do not feel hidden or unstable

**Differentiators**
- Better density, sorting, and browsing ergonomics for modpack-heavy use
- Clearer distinction between browsing remote packs and managing installed ones

**External evidence**
- ATLauncher and Modrinth both emphasize pack browsing as a first-class surface with explicit install flows, version selection, and platform grouping.

### 7. Visual Trust And Asset Correctness

**Table stakes**
- No placeholder logo or asset leaks on shipped classic, welcome, or easter-egg surfaces
- Fallback imagery is intentional and product-safe
- White-on-white or broken-field regressions are treated as blockers

## Explicit Defer List

These are useful, but too broad for `v0.3.0` unless they directly unblock current UX pain:

- Full dashboard personalization/layout presets
- Broad new launcher domains unrelated to current pain points
- Full competitor feature parity sweep
- Automated visual regression infrastructure

## Sources

### Official ecosystem references

- Prism Launcher theme and icon workflow: https://prismlauncher.org/wiki/getting-started/change-themes/
- ATLauncher launch basics: https://wiki.atlauncher.com/getting-started/launching-minecraft/
- ATLauncher create pack/server flow with modloader/version choice: https://wiki.atlauncher.com/getting-started/creating-a-server/
- Modrinth modpacks overview: https://support.modrinth.com/en/articles/8802250-modpacks-on-modrinth
- Modrinth `.mrpack` dependency format: https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack

### Local evidence

- `src/components/settings/tabs/AppearanceTab.tsx`
- `src/components/SettingsPage.tsx`
- `src/components/modpacks/CreateModpackModal.tsx`
- `src/components/modpacks/ModpackBrowser.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/SimplePlayDashboard.tsx`

---
*Research completed: 2026-04-13*
*Ready for requirements: yes*
