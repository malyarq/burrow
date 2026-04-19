# Requirements: FriendLauncher (FMCL)

**Defined:** 2026-04-17  
**Core Value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## v1 Requirements

### Shell & Layout Truth

- [ ] **SHELL-01**: User can use every major launcher surface without content rendering under the custom title bar.
- [ ] **SHELL-02**: User can scroll dense screens without sticky headers or fixed footers hiding actionable content.
- [ ] **SHELL-03**: User sees one unambiguous primary action per launcher context.
- [ ] **SHELL-04**: User can use modpack and wizard flows at shipped desktop widths without clipped controls, orphan filters, or broken spacing.

### Brand System & Surface Language

- [ ] **BRAND-01**: User sees one consistent FMCL visual language across shell, modpacks, settings, modals, empty states, and error states.
- [ ] **BRAND-02**: User sees deliberate logo and wordmark usage instead of arbitrary or repetitive branding.
- [ ] **BRAND-03**: User sees product-owned artwork fallbacks that feel intentional when remote or local media is missing.

### Dense Surface IA & CTA Hierarchy

- [ ] **DENSE-01**: User can scan and operate modpack browser filters, cards, and actions without wrapped or ambiguous controls.
- [ ] **DENSE-02**: User can read and use modpack detail tabs and action groups without broken wrapping or duplicated CTAs.
- [ ] **DENSE-03**: User can create or edit modpack configuration with truthful summaries for version, loader, and dependencies.
- [ ] **DENSE-04**: User can understand counts, summaries, and metadata on dense surfaces without unlabeled or contradictory values.

### Theme, Locale & State Fidelity

- [ ] **THEME-01**: User can clearly distinguish selected, active, focus, hover, and disabled states in both dark and light themes.
- [ ] **THEME-02**: User sees accent color applied consistently across controls that claim to use it.
- [ ] **THEME-03**: User can choose presets that are visually distinct and truthful representations of the launcher appearance.
- [ ] **THEME-04**: User sees dates, numbers, and translated copy consistently with the active locale on redesigned surfaces.

### Fallback, Error & Placeholder Productization

- [ ] **FALL-01**: User never sees raw template placeholders, unresolved bindings, or developer-facing debug strings in shipped UI.
- [ ] **FALL-02**: User sees productized empty, missing-data, and zero-result states instead of ambiguous blanks or orphan values.
- [ ] **FALL-03**: User sees a user-safe fatal error surface with recovery guidance instead of raw React internals.
- [ ] **FALL-04**: User sees dependency, availability, and degraded-data states expressed through truthful product copy rather than misleading missing-state logic.

### Verification, Regression & Release Truth

- [ ] **VER-01**: Team can review deterministic manual verification routes for redesigned core surfaces and degraded states.
- [ ] **VER-02**: Team can catch screenshot regressions on milestone-owned views before release.
- [ ] **VER-03**: Team can verify redesigned surfaces across dark/light themes and EN/RU locales before release.
- [ ] **VER-04**: Release-facing docs and milestone truth stay aligned with shipped redesign behavior.

## v2 Requirements

### Future Expansion

- **PERF-01**: User benefits from follow-up renderer and bundle-size optimization work once redesign-quality scope is shipped.
- **CUSTOM-01**: User can access deeper launcher personalization beyond the core preset and accent system.
- **EXPAND-01**: User can access new launcher capabilities only after redesign and trust debt are no longer the main product problem.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Net-new product areas or route expansion | `v0.5.0` is a redesign-quality milestone for existing launcher surfaces, not a feature-growth milestone. |
| UI framework, state-management, or theming-framework rewrite | Research showed the current stack is sufficient; churn here would dilute product work. |
| Preset/effect sprawl and decorative customization depth | The milestone should improve judgment and readability, not multiply visual options before the system is stable. |
| Developer-facing diagnostics or crash-reporting products | The milestone needs user-safe degraded states, not a broad diagnostics feature set. |
| Cross-app or marketing-site brand work | Scope is limited to the shipped launcher experience itself. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHELL-01 | Phase 25 | Pending |
| SHELL-02 | Phase 25 | Pending |
| SHELL-03 | Phase 25 | Pending |
| SHELL-04 | Phase 25 | Pending |
| BRAND-01 | Phase 25 | Pending |
| BRAND-02 | Phase 25 | Pending |
| BRAND-03 | Phase 25 | Pending |
| DENSE-01 | Phase 25 | Pending |
| DENSE-02 | Phase 25 | Pending |
| DENSE-03 | Phase 25 | Pending |
| DENSE-04 | Phase 25 | Pending |
| THEME-01 | Phase 26 | Pending |
| THEME-02 | Phase 26 | Pending |
| THEME-03 | Phase 26 | Pending |
| THEME-04 | Phase 26 | Pending |
| FALL-01 | Phase 26 | Pending |
| FALL-02 | Phase 26 | Pending |
| FALL-03 | Phase 26 | Pending |
| FALL-04 | Phase 26 | Pending |
| VER-01 | Phase 26 | Pending |
| VER-02 | Phase 26 | Pending |
| VER-03 | Phase 26 | Pending |
| VER-04 | Phase 26 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-17*  
*Last updated: 2026-04-19 after the milestone audit created gap-closure Phases 25-26 and reset unsatisfied proof-layer requirements to pending*
