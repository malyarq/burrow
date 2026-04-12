# Requirements: FriendLauncher (FMCL)

**Defined:** 2026-04-13  
**Core Value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## v1 Requirements

Requirements for the current UI-system and experience-rework milestone. These map to roadmap phases 7-10.

### Design System

- [x] **DSYS-01**: User sees a consistent visual language across launcher shells, cards, forms, dialogs, and feedback states instead of mixed screen-by-screen styling
- [x] **DSYS-02**: User sees one consistent icon and action-affordance language across navigation, cards, menus, dialogs, and empty states
- [ ] **DSYS-03**: User sees refreshed core surfaces built from shared primitives and shared visual tokens instead of feature-local styling exceptions

### Localization And Theme Fidelity

- [ ] **LOCL-01**: User sees complete English and Russian UI copy across labels, placeholders, helper text, validation, tooltips, and empty states on refreshed surfaces
- [x] **THEME-01**: User can switch theme and accent settings and see the launcher shell plus refreshed screens update consistently instead of only isolated controls changing
- [ ] **A11Y-04**: User can use the refreshed UI with visible focus states, sufficient contrast, and reduced-motion-respecting behavior

### Core UX Flows

- [ ] **UX-01**: User can navigate a clearer launcher home and play flow that emphasizes the primary actions and current status at a glance
- [ ] **UX-02**: User can browse, inspect, install, and manage modpacks through a visually coherent and lower-friction modpack experience
- [ ] **UX-03**: User can use account and settings flows that match the rest of the launcher visually and structurally

### Advanced Surface Alignment

- [ ] **UX-04**: User can use secondary launcher surfaces such as sharing, statistics, mirrors, and content-management views without them feeling like a different product

### Verification And Release Truth

- [ ] **VER-01**: Maintainers execute a manual browser-based walkthrough of refreshed critical UI flows before closing the milestone
- [ ] **DOC-03**: README and roadmap-level product descriptions reflect the refreshed launcher UI and UX truthfully after the rollout lands

## v2 Requirements

Deferred until after the current UI-system milestone.

### Future Experience Expansion

- **AUTO-01**: Maintainers can run automated visual-regression or snapshot workflows for the most important launcher surfaces
- **THEME-02**: User can choose from richer curated theme packs or layout modes beyond the base token system
- **LOCL-02**: User can use FMCL in additional locales beyond English and Russian
- **PERS-01**: User can personalize launcher layout or dashboard density beyond the current appearance controls

## Out of Scope

Explicitly excluded from this milestone to keep the work centered on product coherence and usability.

| Feature | Reason |
|---------|--------|
| Rewriting FMCL away from Electron, React, TypeScript, Tailwind, or the current IPC architecture | This milestone is a brownfield UI-system rollout, not a platform migration |
| Importing a heavyweight UI framework to replace the current component layer wholesale | Would turn the milestone into a migration project and slow real UX improvement |
| Backend-heavy social, sync, or hosted cloud features | Expands scope away from launcher presentation and usability |
| Broad third-party provider expansions unrelated to launcher UI coherence | The current goal is to improve the existing experience, not open new capability domains |
| Automated visual-regression infrastructure as a release gate | Useful later, but not required to validate the refreshed UI in this milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSYS-01 | Phase 7 | Complete |
| DSYS-02 | Phase 7 | Complete |
| DSYS-03 | Phase 8 | Pending |
| LOCL-01 | Phase 8 | Pending |
| THEME-01 | Phase 7 | Complete |
| A11Y-04 | Phase 9 | Pending |
| UX-01 | Phase 8 | Pending |
| UX-02 | Phase 8 | Pending |
| UX-03 | Phase 8 | Pending |
| UX-04 | Phase 9 | Pending |
| VER-01 | Phase 10 | Pending |
| DOC-03 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-13*  
*Last updated: 2026-04-13 after Phase 7 completion*
