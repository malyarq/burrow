# Project Research Summary

**Project:** FriendLauncher (FMCL)
**Domain:** Brownfield Electron desktop launcher release milestone
**Researched:** 2026-04-12
**Confidence:** HIGH

## Executive Summary

FMCL is already a feature-rich Electron launcher with strong modpack coverage, local content management, broad import/export interoperability, mirrors, statistics, custom accounts, and FriendTunnel P2P multiplayer. The research converges on one conclusion: this milestone should be run as a release-hardening program, not as a product-expansion or architecture-rewrite effort. The safest path is to preserve the current Electron main process + preload + React renderer split, finish missing launcher workflows on top of existing services, and invest the bulk of roadmap capacity into stability, tests, accessibility, documentation parity, and security boundaries.

The recommended roadmap is conservative by design. Start by restoring a clean lint/type/hooks baseline and hardening the IPC/path boundary, because every later change depends on that trust being restored. Then add service-level test coverage around the current main-process seams, complete the lowest-risk UX gaps that already sit on existing contracts, and only after that extend persisted domains such as image cache, skins, mirror priority/fallback, and richer statistics/export. Accessibility and docs/locales should follow once UI behavior and contracts settle. Final release gating should emphasize handler validation, path containment, mirror integrity, interop round-trips, and documentation truthfulness.

The main release risk is not missing another headline feature. It is letting more work land on top of a noisy React baseline, permissive IPC handlers, filesystem-shaped inputs, and near-zero automated coverage. Brownfield-safe execution means no new architecture layer, no second persistence model, no renderer-side business backend, and no rewrite away from the existing Electron architecture.

## Key Findings

### Recommended Stack

The stack direction is stable: keep Electron, React, TypeScript strict mode, Vite, TailwindCSS, XMCL packages, and the current Hyperswarm-based FriendTunnel transport. The milestone should optimize within that stack instead of migrating frameworks or adding a parallel architecture. The main justified additions are release-enabling tools: Vitest plus Testing Library for coverage, Zod for runtime validation at IPC/file-import boundaries, and targeted Electron hardening such as CSP/local asset loading and build-time fuse tightening.

There is one important brownfield adjustment in the synthesis: security hardening should prioritize handler-side validation, path normalization, CSP, local fonts, safe external URL handling, and minimized preload exposure before any broad renderer sandbox migration. The research identifies sandboxing as desirable, but the architecture guidance makes it clear that a full runtime-shape change should not be the roadmap dependency for this milestone.

**Core technologies:**
- `electron` + preload bridges: desktop shell and privileged execution surface, kept as the current main-process core
- `react` + contexts + renderer IPC wrappers: UI orchestration layer, kept but cleaned up for hooks, accessibility, and wrapper discipline
- `typescript` strict mode + `shared/contracts/*`: typed extension seam, used to evolve features without weakening IPC boundaries
- `vite` + `vitest`: fastest brownfield path to meaningful service and renderer tests in the existing repo
- `zod`: runtime validation for IPC payloads, settings/import/export boundaries, and filesystem/network inputs

### Expected Features

The milestone scope is already defined by the product context and research: stabilize what exists, finish the highest-value remaining release gaps, and defer anything that creates a bigger platform or backend surface. The user promise remains modpack-first desktop workflows with local-first operations and P2P friend play.

**Must have (release table stakes):**
- Clean React/TypeScript/ESLint baseline with current hook/runtime issues removed
- Critical-path automated tests for `modpackService`, `contentManager`, `shareService`, import/export, and related helpers
- Remaining modpack workflow gaps closed on existing surfaces: instance rename/duplicate, discovery continuity, configurable pagination, image disk caching
- Accessibility baseline for keyboard use, semantics, contrast, focus management, and reduced motion
- Documentation parity across README, EN/RU roadmaps, locale files, and IPC contract mapping
- Security hardening for IPC validation, filesystem inputs, XSS exposure, and external URL handling

**Should have (brownfield-safe differentiator completion):**
- Skin management inside the existing account domain
- Mirror fallback and user-controlled mirror priority on top of the current provider/scoring stack
- Local statistics uplift with export, implemented as read-side aggregation inside `StatisticsService`
- Protection against regressions in FriendTunnel and cross-launcher/share interoperability through tests and release gates

**Defer (post-release):**
- Cloud sync, hosted profiles, or backend-heavy social features
- Rewrite away from Electron/React/current IPC architecture
- New persistence systems such as SQLite/IndexedDB for this milestone
- Broad new skin-provider matrix or other expansionary integrations

### Architecture Approach

The architecture recommendation is explicit: preserve the current Electron monolith with typed IPC seams, extend shared contracts first, then renderer wrappers, then thin handlers, then the domain services that already own persistence. New work should stay inside existing domains: `ModpackService` and related instance services for modpack UX completion, `AccountService` for skins/account assets, `MirrorsService` plus existing download/provider ordering for fallback logic, `StatisticsService` for aggregates/export, and the content/download stack for disk-backed remote image caching. Accessibility remains primarily a renderer concern, while authoritative validation remains in the main process.

**Major components:**
1. Renderer (`src/`): feature UI, contexts, dialogs, settings, accessibility behaviors
2. IPC seam (`shared/contracts/*`, preload bridges, `src/services/ipc/*`): preferred typed integration boundary for all privileged work
3. Main-process services (`electron/services/*`): launcher runtime, modpacks, content, accounts, mirrors, stats, sharing, and persistence ownership

### Critical Pitfalls

1. **Shipping on a red hooks/lint baseline** — restore `tsc` and renderer lint discipline first or every later phase compounds hidden regressions
2. **Eroding the IPC trust boundary** — validate payloads and normalize ids/paths/URLs in handlers/services; do not add new direct `window.*` usage
3. **Path traversal and unsafe file mutation** — centralize containment checks for rename/import/export/screenshot/save flows and test malicious path cases
4. **Manual-QA-only main-process logic** — service-heavy FMCL code must gain fixture-backed Vitest coverage before broad feature completion work
5. **Treating mirror availability as artifact integrity** — corrupted/truncated artifact handling and official fallback must be verified, not assumed
6. **Cache/interop/docs drift** — content-store ownership, format round-trips, EN/RU roadmap sync, and contract-map updates must be enforced as release gates

## Implications for Roadmap

Based on the research, the coarse roadmap should sequence the work like this:

### Phase 1: Release Baseline And Guardrails

**Rationale:** Every source treats the current lint/hooks/test/security debt as the multiplier on release risk. This phase creates a trusted baseline before more UI or persistence work lands.

**Delivers:**
- Zero-error `npx eslint src/` and passing `npx tsc --noEmit`
- Removal of new direct renderer `window.*` usage from active work
- Shared handler-side validators for payload shape, ids, paths, URLs, and output destinations
- Initial test scaffolding for service and wrapper tests

**Addresses:**
- Critical stability/code-quality issues
- IPC/security hardening prerequisites
- Pitfalls around hooks baseline, IPC trust erosion, and unsafe file mutation

**Brownfield implication:** keep compatibility shims where needed, but force all new work onto the preferred typed IPC path.

### Phase 2: Test Safety Net For Existing Service Seams

**Rationale:** FMCL’s highest-risk logic lives in Electron services, not in isolated renderer components. Tests need to protect later feature completion and hardening work.

**Delivers:**
- Vitest coverage for `modpackService`, `contentManager`, `shareService`, and critical path/url/import/export helpers
- Fixture-backed tests for malformed share payloads, malicious filenames, and import/export round-trips
- Thin verification around renderer IPC wrappers and preload contract shape

**Addresses:**
- Critical-path automated tests
- Pitfalls around manual-QA-only service logic, interop drift, and unsafe path handling

**Uses:**
- Existing Vite-based toolchain plus new Vitest/Testing Library additions

### Phase 3: Complete Existing Modpack And Discovery UX

**Rationale:** The next lowest-risk value comes from finishing UX already backed by existing services and contracts. This yields visible progress without widening persistence too early.

**Delivers:**
- Instance rename/duplicate from list surfaces
- Discovery continuity improvements such as recent/history handling and configurable pagination
- Replacement of temporary browser dialogs with existing app modal/confirm patterns where applicable

**Addresses:**
- Remaining roadmap gaps that materially affect daily modpack workflows
- Pitfalls around unstable UI interaction patterns and docs drift from partially finished flows

**Implements:**
- Renderer/UI completion over existing `ModpackContext`, `modpacksIPC`, and current modpack contracts

### Phase 4: Extend Persisted Reliability Features Inside Existing Domains

**Rationale:** These items widen storage/contracts and should come only after baseline hardening and test coverage exist. They deepen FMCL’s differentiators without changing its architecture.

**Delivers:**
- Disk-backed image caching through the main-process content/download stack
- Skin management in the account domain
- Mirror fallback and mirror priority inside `MirrorsService` and provider ordering
- Statistics aggregation/export inside `StatisticsService`

**Addresses:**
- Remaining roadmap gaps around cache, skins, mirrors, and richer local stats
- Pitfalls around cache invalidation, mirror integrity, and parallel state ownership

**Avoids:**
- New databases, renderer-side mini backends, or fresh global state systems

### Phase 5: Accessibility And UX Hardening Pass

**Rationale:** Accessibility work is most efficient after the main interaction surfaces stop moving. The research is explicit that this should be a renderer-wide pass over stabilized UI, not a late ARIA patch scramble.

**Delivers:**
- Keyboard-only completion paths for both core launcher modes
- Focus restoration, semantic controls, contrast fixes, and reduced-motion support
- Shared UI primitive cleanup for dialogs, menus, tabs, list actions, and async status messaging

**Addresses:**
- Accessibility baseline
- Pitfalls around customization-heavy UI regressing keyboard/focus/screen-reader behavior

**Implements:**
- Renderer-first fixes in shared primitives and feature pages; minimal privileged changes unless a persisted preference is needed

### Phase 6: Documentation Truth, Final Security Review, And Release Gate

**Rationale:** Docs, locale parity, and final security verification should describe the shipped contract surface, not an intermediate state. This phase closes the release with truthfulness and auditability.

**Delivers:**
- README, EN roadmap, RU roadmap, locale files, and `docs/ru/contracts-map.md` brought in sync with shipped behavior
- Final pass over touched handlers for validation, path containment, safe external URLs, CSP/local asset loading, and preload exposure
- Smoke verification of mirror fallback, import/export/share, cache cleanup, and critical modpack flows

**Addresses:**
- Documentation parity
- Security hardening completion
- Pitfalls around docs/localization drift, residual IPC risk, and release regressions

### Phase Ordering Rationale

- Phase 1 must precede everything else because the current hooks/lint/security baseline affects the correctness of all later work.
- Phase 2 comes before deeper feature completion because FMCL’s main-process services are the real regression hotspot; tests need to protect the brownfield changes, not trail them.
- Phase 3 intentionally harvests low-risk value first by finishing UX on top of services that already exist, which reduces roadmap churn without widening storage.
- Phase 4 waits until after baseline hardening because cache, skins, mirrors, and stats widen contracts and persistence formats; those are safer once validators and tests exist.
- Phase 5 follows feature stabilization because accessibility fixes are cheaper and more durable when shared primitives and page flows have stopped moving.
- Phase 6 closes with docs/security/release gates so project documentation, IPC maps, and locale files match the final shipped state rather than an earlier draft.

### Research Flags

Phases likely needing deeper planning attention:
- **Phase 2:** import/export/share fixtures and malicious-path coverage need careful test-scope planning because they span multiple formats and failure classes
- **Phase 4:** image cache ownership, mirror integrity logic, and storage-format evolution need explicit migration and cleanup rules
- **Phase 6:** final security review should resolve the boundary between “hardening now” and “post-release architecture cleanup,” especially around preload legacy aliases

Phases with standard enough patterns to plan directly:
- **Phase 1:** baseline lint/type/hooks cleanup plus handler validator introduction follow established repo conventions
- **Phase 3:** list-surface rename/duplicate and pagination/history work are mostly renderer completions on top of existing services
- **Phase 5:** accessibility pass is broad but follows standard renderer/UI hardening patterns once the flows stabilize

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | The research is internally consistent on keeping the existing Electron/React/TypeScript stack and only adding release-enabling tooling |
| Features | HIGH | The milestone scope is already well defined in local planning docs and centers on release readiness rather than product expansion |
| Architecture | HIGH | Multiple docs agree on extending current contracts/wrappers/services instead of rewriting or adding a parallel architecture |
| Pitfalls | HIGH | The risks are concrete, release-specific, and tightly tied to the current codebase shape and known issues |

**Overall confidence:** HIGH

### Gaps to Address

- **Sandbox hardening scope:** desirable from a security perspective, but not reliable enough to anchor the roadmap without first validating preload/runtime impact
- **Skin-provider breadth:** core skin management is clear, but provider-matrix breadth should stay out of the release milestone unless a specific provider becomes mandatory
- **Interop fidelity boundaries:** some import/export/share paths may remain intentionally lossy, so the roadmap should require explicit documentation and fixture coverage rather than assume perfect equivalence

## Sources

All sources used for this summary were local project/planning documents. No web or external sources were used.

### Primary (local docs)
- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`
- `.planning/PROJECT.md`

### Formatting reference
- `~/.codex/get-shit-done/templates/research-project/SUMMARY.md`

---
*Research completed: 2026-04-12*
*Ready for roadmap: yes*
