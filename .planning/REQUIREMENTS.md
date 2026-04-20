# Requirements: FriendLauncher (FMCL)

**Defined:** 2026-04-20  
**Core Value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## v0.6.0 Requirements

### Shell Restraint & Native Behavior

- [x] **SHELL-05**: User can use the launcher on macOS without duplicate or conflicting window chrome competing with native traffic-light controls.
- [x] **SHELL-06**: User sees restrained app identity on critical shell surfaces instead of loud branding replacing missing content or fallback media.
- [x] **SHELL-07**: User sees modpack update signals only on the relevant modpack list and detail surfaces, not as global launcher urgency.
- [x] **SHELL-08**: User sees launcher state after reopen or restart match the actual selected profile or runtime instead of stale default values.

### Modpack Workflow & Runtime Truth

- [x] **MODPACK-01**: User can scan installed and browsed modpacks through one compact filter and search composition without clipped or vertically stacked controls.
- [x] **MODPACK-02**: User can scan modpack cards using only the minimum high-value summary data needed before opening details.
- [x] **MODPACK-03**: User can switch and read modpack detail tabs without scrolling past oversized summary and action blocks just to reach tab content.
- [x] **MODPACK-04**: User sees one authoritative loader, version, dependency, and runtime summary across list, details, and launch-related surfaces.
- [x] **MODPACK-05**: User sees dependency status colors and copy that distinguish healthy, warning, and broken states truthfully.
- [ ] **MODPACK-06**: User can finish create-modpack and add-mod flows with stable confirmation actions and actionable failure explanations instead of silent errors, flicker, or reload-style recovery.

### Settings Truth & Honest Personalization

- [ ] **SETTINGS-01**: User can switch preset themes and immediately see a deterministic visual result without hidden dark/light mode coupling or misleading preset labels.
- [ ] **SETTINGS-02**: User sees settings controls, labels, and navigation with one consistent geometry and alignment system instead of mixed component rules.
- [ ] **SETTINGS-03**: User only sees appearance controls that produce a meaningful visible effect or clearly explain what they change.
- [ ] **SETTINGS-04**: User can use a bounded `CUSTOM-01` personalization follow-up only after the underlying settings behavior is already truthful and stable.

### Guided Content Browsers & Compatibility Guidance

- [ ] **CONTENT-01**: User can browse and install resource packs from an in-app flow instead of being forced into Finder or Explorer as the primary path.
- [ ] **CONTENT-02**: User can browse and install shaders from an in-app flow with compatibility guidance tied to the active modpack or runtime context.
- [ ] **CONTENT-03**: User sees recoverable, actionable explanations when resource-pack or shader acquisition or install fails.
- [ ] **CONTENT-04**: User can still choose local file import as an explicit fallback path when guided in-app content flows are not the right fit.
- [ ] **CONTENT-05**: User gets only the bounded `EXPAND-01` capability increase needed to make resource-pack and shader management feel first-class for modpack-heavy use, without turning FMCL into a broad content marketplace.

## Future Requirements

### Performance Follow-Up

- **PERF-01**: User benefits from renderer and bundle-size optimization work after shell, modpack, settings, and content-flow truth are no longer the dominant product complaint.

### Post-v0.6.0 Expansion

- **CUSTOM-02**: User can access broader launcher personalization only after the settings system proves truthful under the bounded `CUSTOM-01` scope.
- **CONTENT-06**: User can access broader content discovery or marketplace-style flows only after guided resource-pack and shader management proves valuable and understandable.
- **SOCIAL-01**: User can access multiplayer or social capability expansion only after the launcher core stops feeling noisy or untruthful.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Fake public patch-release planning such as `v0.5.1`, `v0.5.2`, or `v0.5.3` | `v0.6.0` is one truthful public milestone with internal phases, not a chain of pseudo-releases. |
| UI framework, router, state-management, or theming-framework rewrite | Research showed the current Electron + React + TypeScript architecture is sufficient; churn here would dilute product work. |
| Another broad redesign or brand-reset wave | The problem is lack of restraint and truth, not lack of novelty. |
| Open-ended performance work under the main milestone story | `PERF-01` is real but deferred until product-trust issues stop being the main complaint. |
| Decorative customization sprawl before settings truth is restored | The milestone should remove misleading controls before adding broader appearance depth. |
| Broad content marketplace or unrelated capability growth | Phase 31 is limited to guided resource-pack and shader flows tied directly to modpack-heavy use. |
| Unrelated multiplayer or social expansion | Current feedback does not justify moving the milestone story away from shell, modpacks, settings, and content-flow truth. |

## Traceability

Roadmap mapping is now fixed for milestone `v0.6.0`, with each requirement owned by exactly one phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHELL-05 | Phase 28 | Completed |
| SHELL-06 | Phase 28 | Completed |
| SHELL-07 | Phase 28 | Completed |
| SHELL-08 | Phase 28 | Completed |
| MODPACK-01 | Phase 29 | Completed |
| MODPACK-02 | Phase 29 | Completed |
| MODPACK-03 | Phase 29 | Completed |
| MODPACK-04 | Phase 29 | Completed |
| MODPACK-05 | Phase 29 | Completed |
| MODPACK-06 | Phase 29 | Planned |
| SETTINGS-01 | Phase 30 | Planned |
| SETTINGS-02 | Phase 30 | Planned |
| SETTINGS-03 | Phase 30 | Planned |
| SETTINGS-04 | Phase 30 | Planned |
| CONTENT-01 | Phase 31 | Planned |
| CONTENT-02 | Phase 31 | Planned |
| CONTENT-03 | Phase 31 | Planned |
| CONTENT-04 | Phase 31 | Planned |
| CONTENT-05 | Phase 31 | Planned |

**Coverage:**
- v0.6.0 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✅

---
*Requirements defined: 2026-04-20*  
*Last updated: 2026-04-20 after completing Phase 29 plan 03*
