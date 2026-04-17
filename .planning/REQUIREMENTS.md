# Requirements: FriendLauncher (FMCL)

**Defined:** 2026-04-14  
**Core Value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## v0.4.0 Requirements

Requirements committed for milestone `v0.4.0 Launcher Truth And Product Polish`.

### Launch Truth

- [x] **LAUNCH-01**: User sees a deliberate branded fallback instead of a broken or empty launch image when instance artwork is missing or invalid.
- [x] **LAUNCH-02**: User sees one consistent modloader value across launch controls, summaries, and effective launch settings on the main play surface.
- [x] **LAUNCH-03**: User can trust launch progress because the visible progress indicator, CTA state, and launch status text all advance from the same current stage.
- [x] **LAUNCH-04**: User sees launch-status and runtime-progress copy in the active launcher language instead of mixed-language or raw technical messages.

### Modpack Details

- [x] **DETAIL-01**: User sees pack-level runtime dependencies such as `minecraft` and `forge` marked as satisfied when the installed modpack configuration already provides them.
- [x] **DETAIL-02**: User sees dependency version requirements rendered in readable product copy instead of raw range syntax.
- [x] **DETAIL-03**: User can reach the primary modpack detail sections without relying on a separate horizontal-scroll strip as the default navigation pattern.

### Catalog & Navigation

- [x] **CATALOG-01**: User can read catalog filters and primary controls at shipped desktop widths with the sidebar open.
- [x] **CATALOG-02**: User sees a branded fallback cover instead of an empty gray placeholder for modpacks without artwork.
- [x] **CATALOG-03**: User can understand the active destination in collapsed navigation without stray placeholder letters or ambiguous compact-state affordances.

### Settings & Locale

- [x] **SET-01**: User never sees raw localization keys on the shipped settings surface or launch-adjacent controls.
- [x] **SET-02**: User sees theme preset names presented through one deliberate RU/EN naming policy instead of accidental English-only leakage in the localized UI.

## Future Requirements

Deferred polish that is valuable, but not required to complete `v0.4.0`.

### Launch Truth

- **LAUNCH-F01**: User sees shorter, more product-friendly launch stage wording where it improves comprehension without hiding real state.

### Modpack Details

- **DETAIL-F01**: User sees a compact dependency-health summary before expanding individual dependency rows.

### Catalog & Navigation

- **CATALOG-F01**: User gets secondary affordances such as tooltips or hover labels where they clarify compact catalog controls without adding clutter.

### Settings & Locale

- **SET-F01**: User sees more consistent helper-text rhythm and capitalization across the settings modal.

## Out of Scope

Explicit exclusions for `v0.4.0`.

| Feature | Reason |
| --- | --- |
| New launcher routes or dashboard concepts | This milestone repairs shipped surfaces instead of expanding product scope. |
| Full settings IA redesign | The audit shows localization and polish failures, not a need to rebuild the entire settings model. |
| New modpack-management capabilities | `v0.4.0` fixes truth, readability, and discoverability in current modpack flows only. |
| Major art or branding refresh | The milestone needs branded fallback states, not a broad visual identity project. |
| New visual-regression or browser-E2E platform | The repo already has a reusable manual verification seam, and this milestone should close defects before adding new tooling programs. |
| Unrelated build or workflow debt that does not close an audited user-facing defect | Deep cleanup is allowed only when it directly supports the screenshot-backed bug pool or a proven adjacent shipped-surface inconsistency. |

## Traceability

Which phases cover which requirements. Filled during roadmap creation.

| Requirement | Phase | Status |
| --- | --- | --- |
| LAUNCH-01 | Phase 15 | Complete |
| LAUNCH-02 | Phase 15 | Complete |
| LAUNCH-03 | Phase 15 | Complete |
| LAUNCH-04 | Phase 15 | Complete |
| DETAIL-01 | Phase 16 | Complete |
| DETAIL-02 | Phase 16 | Complete |
| DETAIL-03 | Phase 16 | Complete |
| CATALOG-01 | Phase 17 | Complete |
| CATALOG-02 | Phase 17 | Complete |
| CATALOG-03 | Phase 17 | Complete |
| SET-01 | Phase 17 | Complete |
| SET-02 | Phase 17 | Complete |

**Coverage:**
- v0.4.0 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-14*  
*Last updated: 2026-04-17 after Phase 18 plan 01 execution*
