# Phase 16: Modpack Detail Integrity And Discoverable Dense Navigation - Context

**Gathered:** 2026-04-14  
**Status:** Ready for planning

<domain>
## Phase Boundary

Repair the shipped modpack detail surface so dependency truth stops contradicting the installed pack runtime and the primary detail sections remain discoverable on dense desktop layouts. This phase fixes runtime dependency satisfaction, readable requirement copy, and detail-page navigation inside the current modpack detail flow. It does not add new modpack-management capabilities, redesign the route architecture, or expand into catalog or settings work.

</domain>

<decisions>
## Implementation Decisions

### Runtime dependency truth
- The selected pack runtime is the authoritative source for pack-provided dependencies on the detail page, using the installed effective configuration rather than only scanning installed mods.
- Runtime-provided dependencies should be limited to what the current pack configuration explicitly provides, especially the active Minecraft version and active loader family or version; Phase 16 should not invent broader alias or compatibility magic.
- Dependencies satisfied by pack runtime should remain visible in the ordinary dependency presentation instead of being hidden or split into a separate conceptual surface.
- When a dependency is satisfied by the pack runtime, the UI should show it as satisfied with clear pack- or runtime-provided status copy rather than implying that a separate installed mod fulfilled it.

### Mismatch semantics
- If the pack runtime matches the dependency type but does not satisfy the required version, the detail page should show a distinct incompatible state rather than collapsing that case into missing.
- The incompatible state should make the difference between required and provided runtime versions understandable in user-facing product copy.
- Detail-page dependency states should stay conservative: a runtime dependency should only flip to satisfied when the effective configuration is explicit and compatible.

### Surface consistency
- The same runtime-truth rules should drive all dependency-health states on the detail page, so rows, summary cues, and related status affordances do not contradict one another.
- Phase 16 should fix the current false-negative experience on the shipped detail surface rather than introducing a larger dependency-management feature or a separate runtime inspection tool.

### Claude's Discretion
- Exact localized wording for the satisfied-by-runtime and incompatible-runtime labels, as long as the copy stays short and clearly distinguishes provided versus required.
- Whether the runtime dependency resolver lives as a local detail-page helper or a reusable shared helper, provided the visible behavior stays consistent across detail-page dependency states.
- Exact implementation of readable range copy and dense navigation inside the existing phase scope, since those areas were left to phase discretion during this discussion rather than explicitly debated.

</decisions>

<specifics>
## Specific Ideas

- Treat `effectiveConfig` as the primary detail-page truth when deciding whether `minecraft`, `forge`, `fabric`, `quilt`, or `neoforge` style runtime requirements are already provided by the installed pack.
- Keep runtime-provided dependencies in the same dependency list the user is already reading; the fix should remove false alarms, not make the dependency UI harder to scan.
- Distinguish "missing" from "incompatible" when the pack runtime exists but is on the wrong version, so users can understand the problem without inferring it from launch failures later.
- Apply one dependency-truth model across detail-page statuses so users do not see a satisfied row paired with a failing summary, or the reverse.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/features/modpacks/hooks/useModpackDetailsConfig.ts`: already resolves the installed effective configuration that should anchor runtime dependency truth on the detail page.
- `src/components/modpacks/ModpackDetails.tsx`: already has both metadata and effective configuration in hand and is the narrowest seam for passing runtime context into detail tabs.
- `src/utils/versionCheck.ts`: existing version compatibility logic that can stay central when comparing provided runtime versions against dependency requirements.

### Established Patterns
- Phase 13 already locked the product direction that modpack dependency truth should stay bound to persisted manifest or runtime data rather than a prettier but lossy summary.
- User-facing strings belong in `src/locales/en.json` and `src/locales/ru.json`, so any runtime-provided or incompatible labels should follow the existing localization contract.
- The milestone is intentionally bounded to repairing shipped surfaces; Phase 16 should correct detail-page truth and discoverability without turning dependency inspection into a broader new feature.

### Integration Points
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`: current dependency-state logic only checks installed mods by id and is the primary false-negative hotspot for `minecraft` and loader dependencies.
- `src/components/modpacks/ModpackDetails.tsx`: best current seam for handing runtime context from `effectiveConfig` with metadata fallback into dependency rendering.
- `shared/types/mods.ts`: shared dependency shape if the planner chooses to express richer structured dependency status rather than keep the fix local to the detail surface.
- `electron/services/mods/scanner.ts`: upstream source of raw dependency ids and version ranges if Phase 16 needs a small data-shape cleanup rather than only UI interpretation.

</code_context>

<deferred>
## Deferred Ideas

None outside phase scope. Readable version-range copy and dense navigation remain Phase 16 work, but they were left to in-phase implementation discretion rather than explicitly locked during this discussion.

</deferred>

---

*Phase: 16-modpack-detail-integrity-and-discoverable-dense-navigation*  
*Context gathered: 2026-04-14*
