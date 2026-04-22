# Requirements: FriendLauncher (FMCL)

**Defined:** 2026-04-22  
**Core Value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## v0.7.0 Requirements

### Shell Identity & Sidebar Cohesion

- [x] **SHELL-09**: User sees a readable launcher header in the sidebar without clipped title text, a redundant logo block, or visibly misaligned compact-mode controls.
- [x] **SHELL-10**: User sees one native-feeling macOS shell layout with no competing custom chrome, duplicate controls, or unsafe title-bar clearance on real window runs.
- [x] **BRAND-01**: User sees the canonical launcher mark only where app identity is needed, while missing-media and fallback surfaces prefer calm content-first placeholders over branded filler.

### Catalog Density & Classic Truth

- [x] **MODPACK-07**: User sees short truthful classic runtime labels on cold start, and the displayed version and loader match the actual launch target.
- [x] **MODPACK-08**: User can scan installed and browsed modpacks without redundant summary counters, and search or filter controls stay compact on one row at common desktop widths.
- [x] **MODPACK-09**: User sees only the minimum high-value summary data on modpack cards before opening details.
- [x] **MODPACK-10**: User sees catalog primary actions that share one consistent height, icon scale, padding, and line-wrapping contract instead of looking like unrelated components.

### Detail & Content Surface Cohesion

- [x] **MODPACK-11**: User can switch modpack detail tabs and immediately read tab content without oversized hero or action blocks pushing useful content below the fold.
- [x] **MODPACK-12**: User sees one authoritative runtime and dependency summary in modpack details, with neutral, warning, and error color semantics that match actual health.
- [x] **CONTENT-07**: User can discover Mods, Resource Packs, Shaders, Worlds, and Screenshots through one consistent tab and layout language instead of per-tab visual drift.

### Async Recovery & Guided Content Reliability

- [x] **MODPACK-13**: User can finish create-modpack and add-mod flows with a fixed reachable primary action even while results stream or installs continue.
- [x] **MODPACK-14**: User sees concrete, actionable failure explanations in create and add flows and does not hit visible flicker or rerender churn when switching the active modpack.
- [x] **CONTENT-08**: User can acquire resource packs and shaders through in-app flows that explain compatibility requirements for the active runtime without ambiguity.
- [x] **CONTENT-09**: User sees guided content failures recover on live product surfaces, not only proof routes, and local fallback remains explicit rather than accidental.

### Settings Predictability & Shared Design Contract

- [x] **SETTINGS-05**: User no longer sees leftover branding blocks or duplicated explanatory copy in settings surfaces that should stay task-focused.
- [x] **SETTINGS-06**: User sees preset-theme changes produce visible, predictable results without hidden theme-mode jumps or “nothing changed” states.
- [x] **SETTINGS-07**: User sees accent, slider, toggle, and tab controls follow one aligned geometry contract with no overlap, drift, or overflow.
- [x] **SETTINGS-08**: User only sees appearance controls that have a visible effect or an explicit scoped explanation of what they change.
- [x] **DESIGN-01**: User experiences one shared button and control contract across shell, catalog, details, content, and settings surfaces.

## Future Requirements

### Performance Follow-Up

- **PERF-01**: User benefits from broader renderer and bundle-size optimization work after the direct-feedback closure milestone stops visible UI trust issues from dominating the experience.

### Post-v0.7.0 Expansion

- **CUSTOM-02**: User can access broader launcher personalization only after truthful settings behavior survives the direct-feedback closure pass in real manual use.
- **CONTENT-06**: User can access broader content discovery or marketplace-style flows only after modpack-scoped guided content management becomes trusted in daily use.
- **SOCIAL-01**: User can access multiplayer or social expansion only after the launcher core stops feeling visually noisy or misleading.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Broad redesign or fresh brand-reset wave | The milestone is about closing explicit feedback gaps, not searching for another visual identity. |
| Marketplace-style content discovery beyond the current modpack scope | The user asked for trustworthy guided content management, not a broad store surface. |
| New multiplayer or social capability expansion | The current direct feedback is concentrated on shell, modpacks, settings, and content-management UX. |
| Framework, router, or state-management rewrite | The remaining problems are product and interaction gaps inside the current architecture, not proof that the stack is wrong. |
| Open-ended customization beyond truthful presets and bounded appearance controls | The user feedback is asking for predictability and restraint, not more personalization depth. |
| Performance work that is not directly tied to visible flicker, churn, or density complaints | The milestone should fix user-seen trust breaks first, then reopen broader performance follow-up. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHELL-09 | Phase 32 | Complete |
| SHELL-10 | Phase 32 | Complete |
| BRAND-01 | Phase 32 | Complete |
| MODPACK-07 | Phase 33 | Complete |
| MODPACK-08 | Phase 33 | Complete |
| MODPACK-09 | Phase 33 | Complete |
| MODPACK-10 | Phase 33 | Complete |
| MODPACK-11 | Phase 34 | Complete |
| MODPACK-12 | Phase 34 | Complete |
| CONTENT-07 | Phase 34 | Complete |
| MODPACK-13 | Phase 35 | Complete |
| MODPACK-14 | Phase 35 | Complete |
| CONTENT-08 | Phase 35 | Complete |
| CONTENT-09 | Phase 35 | Complete |
| SETTINGS-05 | Phase 36 | Complete |
| SETTINGS-06 | Phase 36 | Complete |
| SETTINGS-07 | Phase 36 | Complete |
| SETTINGS-08 | Phase 36 | Complete |
| DESIGN-01 | Phase 36 | Complete |

**Coverage:**
- v0.7.0 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✅

---
*Requirements defined: 2026-04-22*  
*Last updated: 2026-04-22 after completing Plan `36-04`*
