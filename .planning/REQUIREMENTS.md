# Requirements: FriendLauncher (FMCL)

**Defined:** 2026-04-12  
**Core Value:** Players should be able to install, manage, share, and launch Minecraft modpacks and play with friends through P2P from one stable desktop launcher without juggling multiple external tools.

## v1 Requirements

Requirements for the current release-hardening milestone. These map to roadmap phases.

### Reliability

- [x] **REL-01**: User can use background, accounts, share, and storage flows without React hook ordering, stale effect, or cascading re-render regressions
- [x] **REL-02**: Release candidates pass `npx tsc --noEmit` and `npx eslint src/` before shipment

### Testing

- [x] **TEST-01**: Maintainers can run `npm test` to execute the automated FMCL test suite locally and in CI
- [x] **TEST-02**: Critical `modpackService`, `contentManager`, `shareService`, and formatting flows are covered by automated tests

### Modpack Workflow

- [x] **FLOW-01**: User can duplicate an instance directly from modpack list cards or card actions without opening the details view
- [x] **FLOW-02**: User can rename an instance directly from modpack list cards or card actions without opening the details view
- [x] **FLOW-03**: User can view recently opened or viewed modpacks in the browser
- [x] **FLOW-04**: User can configure page size and navigate paginated modpack browser results
- [x] **FLOW-05**: Modpack and mod imagery loads from a persistent disk cache with size management and cleanup controls

### Accounts And Delivery

- [x] **ACCT-01**: User can preview skins for supported custom accounts, refresh that preview, and open the provider management page from within the launcher
- [x] **DLVR-01**: User can configure mirror priority or preference order for downloads
- [x] **DLVR-02**: Launcher automatically falls back to healthy mirrors when preferred sources fail
- [x] **DLVR-03**: Corrupted or incomplete downloads are detected and rejected instead of being treated as successful mirror responses

Scope note for `ACCT-01` (audit recovery, 2026-04-12): Phase 4 deliberately shipped provider-aware preview, refresh, and provider-site handoff for Blessing Skin and LittleSkin. Full in-launcher upload or edit remains deferred because it would require a broader provider-auth flow than this milestone shipped.

### Statistics

- [x] **STAT-01**: User can view popular modpacks and local usage trends in the launcher statistics UI
- [x] **STAT-02**: User can export local statistics data for backup or analysis

### Accessibility

- [x] **A11Y-01**: User can complete core launcher and modpack flows with keyboard-only navigation
- [x] **A11Y-02**: Interactive controls expose accessible names, roles, and states for assistive technologies
- [x] **A11Y-03**: Themes, backgrounds, and animations meet contrast and reduced-motion expectations for release

### Documentation

- [x] **DOC-01**: README and EN/RU roadmaps accurately reflect shipped FMCL feature status
- [x] **DOC-02**: Contract maps document the active IPC channels for account, mirrors, screenshots, share, statistics, worlds, resource packs, shaders, and datapacks

### Security

- [x] **SEC-01**: Privileged IPC handlers validate payload shape and unsafe values before starting work
- [x] **SEC-02**: File and archive operations prevent path traversal and writes outside allowed roots
- [x] **SEC-03**: Renderer and Electron window configuration are reviewed for XSS exposure, unsafe external URLs, and insecure web preferences

## v2 Requirements

Deferred until after the current release-hardening milestone.

### Post-Release Expansion

- **SYNC-01**: User can sync launcher profiles or modpack state across devices through a cloud-backed service
- **SOC-01**: User can use richer social or hosted multiplayer coordination beyond current P2P and share-code flows
- **SKIN-01**: User can choose from a broader matrix of third-party skin providers beyond the initial supported set
- **LOCL-01**: User can use FMCL in languages beyond English and Russian

## Out of Scope

Explicitly excluded from this milestone to keep the release focused.

| Feature | Reason |
|---------|--------|
| Architecture rewrite away from Electron/React/current IPC model | Brownfield release work should harden the existing platform, not reset it |
| Cloud sync / hosted profiles | Adds backend, privacy, and support scope outside the current local-first milestone |
| Backend-heavy social platform | Would expand FMCL beyond launcher and direct P2P/share responsibilities |
| Full in-launcher skin upload/edit flow | Phase 4 intentionally shipped provider-aware preview, refresh, and provider-site handoff only; deeper provider auth belongs to a later expansion |
| Broad new skin-provider matrix | Finish the core skin-management flow first, then expand provider breadth later |
| Additional locales beyond EN/RU | Translation expansion should follow documentation and release parity, not precede it |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| REL-01 | Phase 6 | Complete |
| REL-02 | Phase 6 | Complete |
| TEST-01 | Phase 6 | Complete |
| TEST-02 | Phase 6 | Complete |
| FLOW-01 | Phase 6 | Complete |
| FLOW-02 | Phase 6 | Complete |
| FLOW-03 | Phase 6 | Complete |
| FLOW-04 | Phase 6 | Complete |
| FLOW-05 | Phase 6 | Complete |
| ACCT-01 | Phase 6 | Complete |
| DLVR-01 | Phase 6 | Complete |
| DLVR-02 | Phase 6 | Complete |
| DLVR-03 | Phase 6 | Complete |
| STAT-01 | Phase 6 | Complete |
| STAT-02 | Phase 6 | Complete |
| A11Y-01 | Phase 6 | Complete |
| A11Y-02 | Phase 6 | Complete |
| A11Y-03 | Phase 6 | Complete |
| DOC-01 | Phase 6 | Complete |
| DOC-02 | Phase 6 | Complete |
| SEC-01 | Phase 6 | Complete |
| SEC-02 | Phase 6 | Complete |
| SEC-03 | Phase 6 | Complete |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-12*  
*Last updated: 2026-04-12 after 06-03 requirement roll-forward and audit recovery*
