# Project Research: Features

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.4.0 Launcher Truth And Product Polish`  
**Researched:** 2026-04-14  
**Confidence:** HIGH

## Research Question

What user-facing behavior is now table stakes for the already-shipped launcher surfaces implicated by the screenshot audit, and what smaller polish is worth doing only if it stays tightly bounded?

## Milestone Read

`v0.4.0` is not a new-capability milestone. It is a release-truth and finish-quality pass on surfaces that are already shipped: launch, modpack details, modpack catalog, compact navigation, and settings/localization. The bar is simple: the launcher should stop looking broken, stop contradicting itself, and stop leaking internal strings or formats into the product UI.

## Feature Landscape

### 1. Launch Surface Truth And Runtime Feedback

Mapped audit defects: `BUG-01`, `BUG-03`, `BUG-04`, `BUG-05`

**Must-fix table stakes**
- The main launch surface never renders a broken image. If instance artwork is missing or invalid, users see a deliberate branded fallback instead of a browser-style broken asset.
- The selected modloader is represented consistently everywhere on the screen. Picker state, summary state, and effective launch settings must describe the same runtime choice.
- Launch preparation state is truthful across all simultaneous cues. Progress, CTA label/state, and live status/log summary must advance from the same state model and cannot contradict each other.
- Runtime status text follows the active launcher language so Russian and English users see one coherent launch experience instead of mixed-language state copy.

**Optional nice-to-have polish**
- Replace raw technical step wording with shorter user-readable stage copy where it improves comprehension.
- Make the transition from `working` to `ready` visually clearer so users do not guess whether another action is needed.

**Requirement notes**
- This is the milestone's `P0` category because the play screen is the trust anchor for the product.
- Cosmetic work on the launch screen should not outrank removal of state contradictions.

### 2. Modpack Detail Integrity And Readable Dependency Semantics

Mapped audit defects: `BUG-06`, `BUG-07`, `BUG-09`

**Must-fix table stakes**
- Dependency checks in modpack details must recognize pack-level platform/runtime dependencies such as `minecraft` and `forge` when they are already satisfied by the installed pack configuration.
- Dependency requirements must be rendered in product language, not raw range syntax. Users should see readable requirements such as `1.17.1+` or `Forge 35 and above`.
- Dense detail pages must keep section navigation discoverable without making horizontal tab scrolling the default way to reach core sections.

**Optional nice-to-have polish**
- Summarize dependency health with compact satisfied/missing counts before users inspect individual rows.
- Use a bounded overflow pattern for tabs, such as wrap-on-space or a stable `More` affordance, as long as it does not create a new navigation tax.

**Requirement notes**
- This category is about truthful interpretation and navigation of existing modpack data, not new modpack capability.
- Fixes should preserve fast scanning on long detail pages and avoid adding another inner scroll region unless there is no better option.

### 3. Catalog Scanability, Fallback States, And Compact Navigation Safety

Mapped audit defects: `BUG-08`, `BUG-10`, `BUG-11`

**Must-fix table stakes**
- Modpack catalog filters and controls remain legible at shipped desktop sizes with the sidebar open. Truncation is acceptable only when meaning stays recoverable through layout, tooltip, or a shorter label.
- Modpacks without cover art show a deliberate launcher-branded fallback instead of an empty gray block.
- Collapsed navigation keeps clear icon-based affordances and a recognizable active state rather than leaking placeholder text or a stray initial.

**Optional nice-to-have polish**
- Improve compact-mode affordances with tooltips or hover labels where that clarifies truncated controls without adding clutter.
- Tune card density and spacing so the catalog stays scannable when multiple fallback states appear in one view.

**Requirement notes**
- The goal is faster scanning and fewer `this looks broken` moments on already-shipped surfaces.
- This is not a mandate to redesign the catalog or navigation model from scratch.

### 4. Settings Localization And Preset Naming Cohesion

Mapped audit defects: `BUG-02`, `BUG-12`

**Must-fix table stakes**
- No shipped settings or launcher screen may expose raw localization keys. Every visible label, toggle, tab, and utility control must resolve to user-facing copy.
- Theme preset naming must follow one deliberate rule across RU and EN: either localized descriptive names or intentionally productized preset names presented consistently.
- Settings-adjacent labels exposed from shared helpers or launch controls must follow the same localization contract as the settings modal itself.

**Optional nice-to-have polish**
- Add short helper text only where it removes real ambiguity, especially for advanced controls or preset selection.
- Normalize capitalization and wording rhythm across settings so the modal reads as one product instead of multiple feature islands.

**Requirement notes**
- This is not a new settings IA milestone. It is completion work on visible language truth and preset presentation.
- Any copy cleanup should be applied symmetrically in `en` and `ru` so the milestone does not create new language drift.

## Cross-Cutting Release Bar

Treat the following as shipped-surface quality bars, not best-effort cleanup:

- No broken-image placeholders, raw i18n keys, or obviously technical placeholder states on the audited screens.
- No mixed-language status presentation when the active UI language is known.
- No default interaction that forces users into nested scroll regions just to discover primary controls or tabs.
- No state combination that makes two parts of the same screen disagree about what will happen next.

## Must-Fix Prioritization Matrix

| Category | User Value | Implementation Cost | Priority | Why |
| --- | --- | --- | --- | --- |
| Launch surface truth and runtime feedback | HIGH | MEDIUM | P0 | Contradictory launch state breaks trust in the whole launcher |
| Modpack detail integrity and dependency semantics | HIGH | MEDIUM | P1 | False dependency failures and unreadable requirements mislead pack users |
| Catalog scanability and fallback states | MEDIUM/HIGH | LOW/MEDIUM | P1 | Broken-looking cards and cropped controls make the product feel unfinished |
| Settings localization and preset naming cohesion | HIGH | LOW/MEDIUM | P1 | Raw keys and inconsistent preset naming read as release-quality defects |

## Scope Traps And Anti-Features

| Scope trap | Why it is tempting | Why it stays out of `v0.4.0` | Bounded alternative |
| --- | --- | --- | --- |
| New launcher dashboards or new major routes | The audit reveals many visual issues and can invite a broader redesign | The milestone goal is to make shipped surfaces truthful and cohesive, not expand the product map | Repair the current launch, catalog, modpack detail, settings, and nav surfaces only |
| Full settings redesign or new preference taxonomy | Settings are dense, so a full IA rethink is an easy escalation path | The audit mainly shows missing localization and preset inconsistency, not a need to re-architect all settings | Fix visible labels, copy, and small layout polish only where the audit shows failure |
| New modpack management features | Dependency defects can suggest deeper product gaps | This milestone is about truthfulness of current dependency display and detail navigation | Limit work to correct dependency resolution, readable semantics, and accessible tabs |
| Large art or branding refresh | Broken imagery and blank cards make broad visual work tempting | A brand overhaul would bloat the milestone and delay user-visible fixes | Add shared branded fallbacks and repair broken assets only on audited surfaces |
| New verification platform or visual-regression project | Screenshot-backed defects naturally suggest more tooling | The repo already has a manual verification seam, and this milestone is about shipped UX behavior | Reuse existing verification flow and collect only the evidence needed to prove the fixes |
| Competitor parity sweep | Previous milestone research already looked at other launchers | Chasing parity would explode scope beyond the documented defects | Borrow only table-stakes patterns that directly fix the audited friction |

## Dependency Notes

- Launch truth should land before adjacent visual polish on the play screen; otherwise the screen can look nicer while still lying.
- Localization cleanup should happen alongside each behavior fix, not as a final copy sweep, because several audited defects are mixed behavior-and-copy failures.
- Branded fallback work should be shared where possible across launch art and modpack cards so empty and missing-data states feel intentionally productized.
- Dense-screen adaptation should remove cropped labels and inner-scroll traps at shipped desktop widths; it does not require a new responsive strategy for unrelated surfaces.

## Sources

### Primary milestone inputs

- `.planning/PROJECT.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`

### Audit evidence groups

- Launch truth: `BUG-01`, `BUG-03`, `BUG-04`, `BUG-05`
- Modpack detail integrity: `BUG-06`, `BUG-07`, `BUG-09`
- Catalog and compact navigation: `BUG-08`, `BUG-10`, `BUG-11`
- Settings and localization: `BUG-02`, `BUG-12`

---
*Research completed: 2026-04-14*  
*Ready for requirements: yes*
