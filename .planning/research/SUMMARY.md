# Project Research Summary

**Project:** FriendLauncher (FMCL)  
**Domain:** Electron desktop Minecraft launcher polish and bug-fix planning  
**Researched:** 2026-04-14  
**Confidence:** HIGH

## Executive Summary

`v0.4.0` should be a release-truth and finish-quality milestone, not a new-feature milestone. The screenshot audit and codebase review both point to the same problem: the already-shipped launcher surface still leaks contradictory state, raw localization keys, broken or empty imagery, and dense navigation that feels unfinished.

The current stack is sufficient. The milestone should not add new frameworks or major tooling. Instead, it should tighten shared launch-state mapping, locale ownership, fallback-art policy, and modpack-detail semantics, then prove the fixes through the existing manual verification seam plus targeted automated tests.

## Key Findings

### Recommended Stack

The current Electron, React, TypeScript, Tailwind, and Vitest setup already covers the milestone needs. The repo should reuse existing status, image, locale, and verification seams rather than introducing a new state, UI, or visual-regression platform.

**Core technologies:**
- `Electron` — source of launcher, filesystem, and dependency truth
- `React + TypeScript` — render and normalize product-facing state safely
- `TailwindCSS` — repair overflow, compact controls, and branded fallback presentation
- `Vitest + Testing Library` — add focused regressions for the exact bugs already captured in screenshots

### Expected Features

Research and the audit converge on four categories that define this milestone:

**Must have (table stakes):**
- truthful launch surface and runtime feedback
- correct modpack dependency semantics with readable requirement formatting
- catalog and compact navigation scanability plus branded fallbacks
- complete settings and launch-surface localization without raw keys or inconsistent preset naming

**Should have (bounded polish):**
- clearer user-facing launch stage wording
- compact overflow treatment for dense tabs and controls
- shared fallback behavior across launch and catalog imagery

**Defer (future milestones):**
- new launcher routes or large feature additions
- full settings IA redesign
- competitor parity sweeps
- new visual-regression infrastructure

### Architecture Approach

The fixes should land on existing seams instead of bypassing them. Launch truth belongs in launcher hooks and status mapping, dependency truth belongs in modpack metadata plus scanner interpretation, fallback-art behavior belongs in shared visual seams, and settings localization belongs in locale catalogs plus shared settings metadata.

**Major components:**
1. Launch state pipeline — `useLauncher*`, `launcherService`, `taskRunner`, and `SimplePlayDashboard`
2. Modpack detail pipeline — `ModpackDetails`, detail tabs, metadata IPC, and dependency scanning
3. Surface polish pipeline — modpack browser or list, sidebar, settings metadata, theme presets, and locale catalogs

### Critical Pitfalls

1. **Local label fixes hiding shared state drift** — fix upstream truth contracts before polishing individual widgets
2. **Inline copy masking missing locale ownership** — add missing locale keys in both languages instead of patching the visible screen only
3. **Overflow fixes that add new discoverability debt** — avoid replacing one horizontal-scroll problem with another nested control trap
4. **Runtime dependencies rendered as missing mods** — separate pack-level runtime requirements from file-based dependency checks
5. **Unbounded “full polish” sprawl** — keep every requirement tied to the screenshot audit or a directly related proven inconsistency

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 15: Launch Truth And Shared Surface Contracts
**Rationale:** Shared truth defects break user trust fastest and will contaminate later polish work if left unresolved.  
**Delivers:** Correct launch-stage mapping, synchronized progress and CTA behavior, localized runtime status, and shared fallback ownership for broken launch imagery.  
**Addresses:** launch-surface truth plus shared localization or fallback ownership.  
**Avoids:** patching visible labels while upstream state remains contradictory.

### Phase 16: Modpack Detail Integrity And Discoverable Dense Navigation
**Rationale:** Once shared truth is stable, dependency semantics and dense detail navigation can be fixed as one coherent modpack-detail slice.  
**Delivers:** correct dependency satisfaction rules, readable version-range formatting, and discoverable detail tabs without default horizontal-scroll tax.  
**Uses:** existing modpack metadata, scanner output, and detail-tab seams.  
**Implements:** the modpack-detail integration points called out in `ARCHITECTURE.md`.

### Phase 17: Catalog, Compact Nav, And Settings Localization Polish
**Rationale:** Remaining defects cluster around scanability, compact-state affordances, missing cover fallbacks, and raw or inconsistent settings copy.  
**Delivers:** legible catalog filters, branded card fallbacks, coherent collapsed navigation, and finished settings or preset-name localization.  
**Addresses:** the shipped-surface polish bucket without reopening new feature scope.  
**Avoids:** a full redesign of the browser, sidebar, or settings IA.

### Phase 18: Verification And Release Truth
**Rationale:** Several defects are interaction and trust issues, so the milestone needs explicit verification rather than visual cleanup alone.  
**Delivers:** targeted tests, walkthrough evidence through the existing manual verification seam, updated docs/locales where needed, and green lint or typecheck or build gates.  
**Addresses:** proof that the screenshot-backed defect set is actually closed.  
**Avoids:** relying only on static screenshots or code-review intuition.

### Phase Ordering Rationale

- launch and shared truth work comes first because multiple surfaces consume the same state or locale patterns
- modpack detail integrity deserves its own slice because dependency truth and dense-tab discoverability are tightly coupled
- catalog/settings/nav polish comes after shared fallback and locale rules are established
- verification stays a dedicated closeout step because several failures are behavioral, not purely visual

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 15:** confirm how launcher progress and status text are assembled across hooks and main-process events before choosing the exact implementation cut
- **Phase 16:** inspect current dependency-shape data from scanner output and modpack metadata to avoid fixing only one dependency subtype

Phases with standard patterns:
- **Phase 17:** mostly renderer layout, fallback, and locale-completion work on existing surfaces
- **Phase 18:** uses established project verification and release-truth practices

## Confidence Assessment

| Area | Confidence | Notes |
| --- | --- | --- |
| Stack | HIGH | Current dependencies and tooling already cover the milestone needs |
| Features | HIGH | The screenshot audit gives a concrete, user-visible defect ledger |
| Architecture | HIGH | Affected seams are visible in the current codebase and map cleanly to the audit categories |
| Pitfalls | HIGH | Risks are specific to the audited failures and repeated patterns in the repo |

**Overall confidence:** HIGH

### Gaps To Address

- confirm the exact source of launch-status desynchronization between renderer-visible progress and task-completion logs
- confirm whether detail tabs should wrap, compact, or overflow into a `More` affordance on current widths
- confirm whether preset naming should become localized descriptions or remain intentional product names in both locales

## Sources

### Primary

- `.planning/PROJECT.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `package.json`
- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`

### Secondary

- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`

---
*Research completed: 2026-04-14*  
*Ready for roadmap: yes*
