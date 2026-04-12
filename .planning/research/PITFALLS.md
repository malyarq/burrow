# FMCL Pitfalls Research

**Domain:** Electron + React Minecraft launcher stabilization for a modpack-heavy desktop product
**Milestone Lens:** Push FMCL from feature-rich brownfield app to stable-release quality without a rewrite
**Researched:** 2026-04-12
**Confidence:** HIGH

This document is intentionally release-oriented, not generic. It focuses on the failure modes most likely to block a stable FMCL release given the current architecture:

- Electron main process is the real application core
- Renderer is partly migrated to typed IPC wrappers, but legacy `window.*` globals remain
- FMCL already spans launcher runtime installs, modpack import/export, mirrors, sharing, screenshots, worlds, and multiplayer
- Known issues already include hook/lint regressions, docs drift, and near-zero automated coverage

## Critical Pitfalls

### Pitfall 1: Shipping new work on top of a red hooks/lint baseline

**What goes wrong:**
Existing React hook violations and `any` leaks stop being treated as blockers. New feature work lands on top of them, reviewers become desensitized to warnings, and the renderer develops nondeterministic behavior in the exact places users touch most: backgrounds, accounts, settings, and share flows.

**Why it happens:**
FMCL is brownfield and mixed-structure. UI logic is split across `src/components/`, `src/features/`, contexts, and direct preload usage. When the baseline is already noisy, every additional warning feels cheap even when it hides a real runtime regression.

**Prevention strategy:**
- Restore a zero-error `npx eslint src/` baseline before closing the release milestone.
- Treat hook ordering, missing dependencies, and `no-explicit-any` in renderer boundary code as release blockers, not cleanup work.
- Require `useCallback` or equivalent stable function boundaries for effect dependencies in shared hooks and contexts.
- Do not merge new renderer work that adds new lint debt while known hook errors remain unresolved.

**Warning signs:**
- Review comments say "pre-existing warning" or "we can clean this later".
- New `useEffect` logic captures locally declared functions without stabilization.
- Components still call preload APIs directly instead of going through `src/services/ipc/`.
- `docs/KNOWN_ISSUES.md` grows after supposedly stabilization-focused work.

**Phase mapping:**
Cross-cutting release gate: `Stability Baseline`, before Phase `1` is considered complete and rechecked after Phase `5`/`7` UI changes.

---

### Pitfall 2: Eroding the IPC trust boundary through convenience shortcuts

**What goes wrong:**
Renderer code gradually regains privileged control through permissive IPC handlers and legacy globals. A renderer bug or XSS-equivalent path can turn into arbitrary filesystem writes, import/export abuse, or unsafe OS integration because the main process trusts raw strings like `rootPath`, `instancePath`, and `filePath`.

**Why it happens:**
The architecture keeps both the preferred `window.api.*` namespace and many legacy aliases. Handler code is intentionally thin, but some handlers effectively trust renderer input or cast `unknown` payloads without validation.

**Prevention strategy:**
- Add explicit runtime validation for every IPC payload that crosses into filesystem, network, or launcher execution paths.
- Centralize path allowlisting and normalization in main-process helpers instead of validating ad hoc in each service.
- Continue migration to renderer wrappers in `src/services/ipc/`; do not add new direct `window.*` usage.
- Track legacy alias removal as hardening work, not as optional cleanup.

**Warning signs:**
- New handlers accept raw `string` paths or `unknown` config blobs without a schema.
- Code comments say "trust the renderer".
- New UI code calls `window.account`, `window.share`, `window.screenshots`, or `window.ipcRenderer` directly.
- Contract docs are updated after implementation, not alongside it.

**Phase mapping:**
Cross-cutting release gate: `IPC/Security Hardening`, required before more Phase `2`, `3`, or `6` feature work is considered safe to ship.

---

### Pitfall 3: Path traversal and arbitrary file mutation through file-management features

**What goes wrong:**
Rename, delete, import, backup, export, datapack, screenshot, and save-file flows mutate files outside the intended modpack or app-controlled area. Users can accidentally or maliciously target sibling directories, and imported archives can write unexpected paths.

**Why it happens:**
FMCL has many path-shaped inputs: `rootPath`, `instancePath`, `worldFolder`, `fileName`, `outputPath`, and direct save paths. Several services join user-provided strings onto a base path, but joining is not containment. The app also supports multiple import/export formats, which increases exposure to crafted archives and malformed filenames.

**Prevention strategy:**
- Introduce one shared helper for "resolve inside allowed base or reject".
- Reject path separators, `..`, absolute paths, and device-like names in filename-level inputs.
- Add safe ZIP extraction guards that reject traversal entries before extraction.
- Add malicious path test cases for screenshots, datapacks, imports, exports, and `app:saveFile`.
- Distinguish between user-selected external destinations and app-internal paths; validate them differently.

**Warning signs:**
- A handler or service takes `instancePath`, `worldFolder`, or `fileName` as a plain string and immediately calls `path.join`.
- Support issues mention files appearing outside the selected modpack.
- Import/export failures vary by OS path semantics.
- Security fixes rely on UI restrictions only.

**Phase mapping:**
Cross-cutting release gate: `Path Hardening`, plus Phase `1.1`, Phase `1.2`, Phase `2`, and Phase `3.4` because those phases intensify file operations.

---

### Pitfall 4: Treating mirror success as availability instead of artifact integrity

**What goes wrong:**
Downloads appear to work because a mirror responds, but the returned artifact is HTML, truncated, stale, or otherwise invalid. Users get corrupted Forge/Fabric installs, failed modpack imports, or launcher states that only recover after cache clearing or switching mirrors manually.

**Why it happens:**
FMCL already includes mirror scoring, warmups, retries, and fallback logic. That improves availability, but it can still over-trust a fast bad source. In launcher ecosystems, "HTTP 200" is not a success signal; the artifact itself has to be validated.

**Prevention strategy:**
- Promote a mirror only after validating checksum, expected file shape, and where possible content type.
- Record and quarantine bad hosts aggressively when corrupted jars/zips are detected.
- Surface the selected provider and the exact failure reason in logs and support-facing diagnostics.
- Keep official-source fallback available for integrity failures, not just connectivity failures.
- Add fixture-based failure tests for truncated JARs, HTML challenge pages, and stale metadata.

**Warning signs:**
- Logs mention corrupted or incomplete downloads more than once per provider.
- Issues are geography-dependent or ISP-dependent.
- "Clear cache and retry" resolves runtime installs more often than expected.
- Same modpack succeeds only after switching from `auto` to official provider.

**Phase mapping:**
Phase `1.2` for install/update reliability, Phase `4` for download tuning, and Phase `6.2` for mirror/CDN maturity.

---

### Pitfall 5: Cache invalidation and hard-link dedupe drifting out of sync

**What goes wrong:**
Renderer caches, XMCL metadata, and the main-process content store disagree about what is fresh and what is still referenced. Users see stale version lists, missing assets after cleanup, incorrect disk-saving statistics, or duplicate instances that silently stop sharing deduped content.

**Why it happens:**
FMCL has two persistence worlds: browser storage for UI-side cache and JSON/filesystem state in Electron `userData`. The content store uses age-based cleanup and hard-link semantics, while cross-device fallback turns links into copies. That is useful, but it makes invalidation and reporting easy to get wrong.

**Prevention strategy:**
- Define ownership for every cache: what creates it, what invalidates it, and what user action clears it.
- Treat content-store cleanup as a transactional operation with clear "in use" vs "candidate for deletion" rules.
- Recompute or verify dedupe statistics after import, duplicate, delete, update, and cleanup flows.
- Test same-device and cross-device scenarios explicitly.
- Keep "clear cache" as recovery, not as the normal path to correctness.

**Warning signs:**
- Bugs are fixed mainly by "Clear Cache & Reload".
- Disk-saving stats fluctuate unexpectedly after duplicate/delete flows.
- Imported or duplicated modpacks re-download assets that should already exist.
- Cleanup is avoided because no one trusts it.

**Phase mapping:**
Phase `4.1` hard links/content-store work, plus all Phase `1.2` update/import/export flows that depend on cache correctness.

---

### Pitfall 6: Interop drift across CurseForge, Modrinth, MultiMC, ZIP, and share-code flows

**What goes wrong:**
A flow works for the happy path but silently loses meaning during round-trip conversion: loader version drifts, optional files disappear, metadata collapses, or share codes reproduce only an approximation of the original modpack. Users perceive this as FMCL corrupting packs even when the import technically "succeeds".

**Why it happens:**
FMCL supports many ecosystem formats and a custom `fmcl://share/v1/...` contract. Those contracts are not equivalent. The more formats FMCL bridges, the more tempting it becomes to hide lossy conversion behind a generic "import/export successful" result.

**Prevention strategy:**
- Maintain golden sample fixtures for each supported format and run round-trip tests.
- Make lossy behavior explicit in UI and docs, especially for share codes.
- Version every custom contract and verify backward compatibility before changing it.
- Store provenance and conversion warnings in metadata when importing.
- Verify both installability and semantic fidelity, not only parse success.

**Warning signs:**
- Support reports say "import succeeded but the pack is different".
- Mod loader or Minecraft version changes unexpectedly after export/import.
- Share-generated packs reproduce only some mods or omit options without warning.
- New format support is added without fixture coverage.

**Phase mapping:**
Phase `1.2` import/export/update, Phase `3.4` instance export/import, and Phase `6.4` sharing/social flows.

---

### Pitfall 7: Accessibility regressing under mode switching and aggressive customization

**What goes wrong:**
The launcher looks feature-complete in mouse-driven demos but fails for keyboard-only navigation, screen readers, reduced-motion users, or high-contrast needs. The biggest risk areas are the mode switcher, hidden advanced sections, custom backgrounds, particles, modal flows, and drag-and-drop mod ordering.

**Why it happens:**
FMCL already invested in theming, backgrounds, and custom UI layers before a formal accessibility pass. In Electron apps, custom controls often look native enough to avoid scrutiny while still missing semantic roles, focus management, and motion preferences.

**Prevention strategy:**
- Add keyboard-only walkthroughs for both "Simple Game" and "Modpacks" modes as release criteria.
- Require semantic elements and explicit focus handling for modals, menus, drawers, and switchers.
- Enforce reduced-motion support and contrast checks on theme/background changes.
- Treat drag-and-drop as additive; keyboard alternatives must exist.
- Include accessibility verification in every UI-heavy PR, not only in Phase `7`.

**Warning signs:**
- Clickable `div` patterns or icon-only actions without text alternatives.
- Focus disappears after mode switch, modal close, or async completion.
- A feature is demonstrated only with the mouse.
- Theme or background previews are approved without contrast review.

**Phase mapping:**
Phase `7.1` directly, with regression checks on Phase `0` navigation work and Phase `5` customization work.

---

### Pitfall 8: Documentation, localization, and contract maps drifting away from reality

**What goes wrong:**
The roadmap, README, IPC contract documentation, and actual product behavior disagree. Contributors implement or review against stale expectations, QA tests the wrong flows, and support gives outdated guidance. This is already visible in EN/RU roadmap skew.

**Why it happens:**
The codebase has broad surface area and many cross-cutting features. When large batches land, docs become "finish later" work. In FMCL, that is especially risky because there are two public roadmaps, shared contract docs, and many feature flags/flows that appear complete from the UI.

**Prevention strategy:**
- Make docs and locale updates part of the definition of done for every user-facing or IPC-facing change.
- Keep one dated release-readiness checklist that references commit or tag state.
- Update `docs/ru/contracts-map.md` whenever IPC surface changes.
- Run EN/RU sync checks for roadmap and locale keys before release.
- Keep `docs/KNOWN_ISSUES.md` current so stabilization work is visible.

**Warning signs:**
- RU and EN roadmaps disagree on shipped features.
- A channel exists in code but not in docs, or vice versa.
- User-facing strings are added only to one locale.
- Reviewers need to inspect implementation because docs cannot be trusted.

**Phase mapping:**
Cross-cutting release gate: `Docs/Locale Sync`, required before release packaging and revalidated after Phase `6`/`7` polish work.

---

### Pitfall 9: Relying on manual QA for service-heavy main-process logic

**What goes wrong:**
Critical regressions in `ModpackService`, `ContentManager`, `ShareService`, importer/exporter paths, and launcher orchestration are discovered only after long manual runs or by end users. Fix velocity collapses because every change requires full Electron repro across large modpacks and multiple OS assumptions.

**Why it happens:**
FMCL's product logic mostly lives in Electron services, not in small pure renderer helpers. Manual testing is expensive here because downloads, filesystem changes, cache state, and platform differences all matter. Without service-level tests, regressions are inevitable.

**Prevention strategy:**
- Add Vitest service tests first for `modpackService`, `contentManager`, `shareService`, import/export flows, and path-security helpers.
- Add fixture-driven tests for corrupted downloads, malformed share codes, and malicious filenames.
- Add thin smoke tests for preload contract shape and renderer IPC wrappers where the surface is likely to drift.
- Require tests in PRs that touch launcher orchestration, modpack import/export, or path validation.

**Warning signs:**
- PR validation says "tested manually" for service changes.
- Bugs cannot be reproduced without running the full app.
- Refactors avoid touching fragile code because there is no safety net.
- A release branch accumulates hotfixes for import/export and path behavior.

**Phase mapping:**
Cross-cutting release gate: `Test Baseline`, especially before Phase `1.2`, Phase `4.1`, and Phase `6.4` are considered release-ready.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep adding legacy `window.*` calls in renderer | Fast feature wiring | Harder IPC hardening, harder typing, larger attack surface | Never for new code |
| Accept raw path strings in IPC handlers | Minimal ceremony | Path traversal, OS-specific bugs, impossible security guarantees | Never for app-internal paths |
| Fix mirror issues only by adding retries | Quick drop in visible failures | Corrupted artifact loops and opaque support incidents | Only as a temporary mitigation with integrity validation planned immediately |
| Use "clear cache" as the normal support answer | Short-term user recovery | Hides root causes in cache ownership and invalidation | Only as an emergency recovery path |
| Batch many unrelated release fixes together | Fewer PRs to manage | Review fatigue, docs drift, rollback pain | Only for mechanical codemods with no behavior change |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Electron preload + IPC | Treat `contextIsolation` as enough while handlers still trust renderer input | Validate payloads in main process and keep renderer on typed wrappers |
| XMCL + mirror providers | Assuming fast response means valid artifact | Validate checksum/file shape and quarantine bad providers |
| CurseForge/Modrinth APIs | Treating project/version metadata as interchangeable across ecosystems | Preserve source provenance and test loader/version compatibility per source |
| ZIP/MultiMC/share import-export | Declaring success after parsing | Run round-trip fixture tests and surface lossy conversion explicitly |
| External URL handling | Opening any user-controlled URL externally because Electron blocks in-app navigation | Allowlist schemes/targets and log where the URL originated |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full-directory hashing during dedupe or update checks | UI lag, long "cleanup" windows, CPU spikes | Batch work off the hot path, cache hashes where safe, measure large-pack scenarios | Noticeable on 5+ large modpacks or HDD-backed storage |
| Re-reading large content directories on every open | Settings/modpack pages feel randomly slow | Cache directory listings with explicit invalidation triggers | Breaks when packs have thousands of mods, screenshots, or saves |
| High probe/download concurrency on unstable networks | Saturated bandwidth, more corruption, misleading progress | Tune concurrency per provider and separate probing from user-visible downloads | Breaks on weak home networks or rate-limited mirrors |
| Background effects treated as free | Idle memory/GPU cost, frame drops, unreadable overlays | Gate effects behind reduced-motion and performance settings | Breaks on low-end GPUs and laptops in desktop idle use |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Trusting `rootPath`, `instancePath`, `worldFolder`, `fileName`, or `filePath` from renderer | Arbitrary file read/write/delete outside FMCL roots | Canonicalize and enforce allowed-base containment in main process |
| Adding new legacy globals in preload | Expands privileged API surface and bypasses wrapper migration | Keep only `window.api.*` for new work and retire aliases gradually |
| Importing archives or share payloads without strict size/version/path guards | Zip bombs, traversal, malformed-manifest crashes | Enforce limits, version checks, and safe extraction rules |
| Treating `sandbox: false` as harmless because Node integration is off | A renderer exploit still has a larger blast radius if IPC is permissive | Compensate with stricter IPC validation and minimize exposed capabilities |
| Opening external URLs derived from imported or remote metadata without allowlisting | Phishing or unsafe handoff to OS/browser | Restrict schemes, validate origin, and trace source in logs |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Mode switch resets context or hides advanced state abruptly | Users feel the launcher "lost" their configuration | Preserve selection and clearly show what changed between modes |
| Long-running downloads without durable recovery | Failed installs feel random and expensive | Resume or restart predictably with visible provider/error details |
| Cache problems surfaced as generic launcher weirdness | Users stop trusting updates and duplicates | Show targeted recovery actions tied to the broken subsystem |
| Accessibility deferred until the end | A polished UI becomes exclusionary | Verify keyboard, focus, and contrast during feature work, not afterward |

## "Looks Done But Isn't" Checklist

- [ ] **Hooks baseline:** `npx eslint src/` is zero-error and no new warnings were introduced by the release work.
- [ ] **IPC handler:** every new or touched handler validates payload shape and path containment in main process.
- [ ] **Mirror fallback:** at least one corrupted-artifact scenario and one official fallback scenario were exercised.
- [ ] **Import/export:** one fixture each for CurseForge, Modrinth, ZIP, and MultiMC was round-tripped or explicitly documented as lossy.
- [ ] **Share codes:** invalid, truncated, old-version, and current-version payloads all behave intentionally.
- [ ] **Cache/dedupe:** duplicate, update, delete, and cleanup flows were verified on same-device and cross-device storage.
- [ ] **Accessibility:** both launcher modes can be used keyboard-only and key dialogs restore focus correctly.
- [ ] **Docs/locales:** EN/RU roadmap, locale files, and contract docs reflect the shipped behavior.
- [ ] **Tests:** critical Electron service changes ship with Vitest coverage, not only manual QA notes.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Red hooks/lint baseline | MEDIUM | Freeze new renderer work, restore zero-error baseline, then replay queued UI changes in small PRs |
| IPC trust erosion | HIGH | Audit exposed handlers/globals, add runtime validation, remove direct renderer shortcuts, and retest privileged flows |
| Path traversal or wrong-file mutation | HIGH | Disable affected action, patch containment checks, inspect user-impact scope, and add regression tests before re-enabling |
| Mirror corruption | MEDIUM | Quarantine provider, invalidate affected cache/artifacts, fall back to official source, and capture provider-specific diagnostics |
| Cache/dedupe drift | MEDIUM | Rebuild derived cache where possible, verify content-store integrity, and add explicit invalidation on lifecycle events |
| Interop drift | MEDIUM | Reproduce with saved fixtures, patch conversion rules or document lossiness, then add round-trip coverage |
| Accessibility regression | LOW to MEDIUM | Reproduce with keyboard/screen-reader walkthrough, patch semantics/focus, and lock in a regression checklist |
| Docs/locales drift | LOW | Update release docs immediately, cross-check EN/RU and contract map, and tie future docs changes to code review |
| Missing service tests | MEDIUM | Stop broad refactors, add fixture-backed tests around the unstable subsystem, then resume implementation |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Shipping on a red hooks/lint baseline | Release gate `Stability Baseline` before closing Phase `1` | `tsc --noEmit` passes, `eslint src/` is zero-error, known hook issues are closed |
| IPC trust boundary erosion | Release gate `IPC/Security Hardening` before more Phase `2`/`3`/`6` work | Touched handlers validate payloads and no new direct `window.*` calls are added |
| Path traversal and arbitrary file mutation | Release gate `Path Hardening`; touches Phase `1.1`, `1.2`, `2`, `3.4` | Malicious path tests pass for screenshots, datapacks, import/export, and save-file flows |
| Mirror availability mistaken for integrity | Phase `1.2`, Phase `4`, Phase `6.2` | Corrupted-download scenarios fall back cleanly and bad providers are quarantined |
| Cache invalidation and hard-link drift | Phase `4.1` plus Phase `1.2` update/import/delete flows | Duplicate/update/delete/cleanup cycle preserves content and reports sane stats |
| Interop drift across formats | Phase `1.2`, Phase `3.4`, Phase `6.4` | Round-trip fixtures or explicit lossy-behavior docs exist for each supported format |
| Accessibility regressions under customization | Phase `7.1` with regression checks on Phase `0` and Phase `5` | Keyboard-only and focus-restoration walkthroughs pass in both launcher modes |
| Docs/localization/contract drift | Release gate `Docs/Locale Sync` before release packaging | Roadmaps, locale files, and contract docs match actual shipped behavior |
| Manual-QA-only service logic | Release gate `Test Baseline`; especially before Phase `1.2`, `4.1`, `6.4` | Vitest coverage exists for critical services and risky path/download scenarios |

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/ARCHITECTURE.md`
- `docs/ru/roadmap.md`
- `docs/KNOWN_ISSUES.md`
- `electron/preload.ts`
- `electron/window/windowManager.ts`
- `electron/ipc/handlers/appHandlers.ts`
- `electron/ipc/handlers/modpacksHandlers.ts`
- `electron/services/content/contentManager.ts`
- `electron/services/runtime/downloadService.ts`
- `electron/services/sharing/shareService.ts`
- `electron/services/screenshots/screenshotService.ts`
- `electron/services/instances/datapacksService.ts`

---
*Pitfalls research for: FMCL stable-release hardening*
*Researched: 2026-04-12*
