# Project Research: Pitfalls

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.4.0 Launcher Truth And Product Polish`  
**Researched:** 2026-04-14  
**Confidence:** HIGH

## Research Question

What are the common mistakes when fixing screenshot-backed truth and polish bugs in an already-shipped launcher UI, especially around contradictory state sources, localization drift, fallback rendering, overflow handling, and “fix everything” scope creep?

## Primary Risks

### 1. Fixing labels without fixing the shared state contract

**Failure mode**
- one part of the launch surface shows the “right” value, but another control still reads stale loader or progress state
- a localized status title hides the fact that percent, CTA state, and log summary still disagree

**Current evidence**
- the audit shows conflicting modloader values and `done` while progress remains `0%`
- `SimplePlayDashboard.tsx` already consumes several parallel launch-status fields

**Prevention**
- fix shared launch-state mapping first
- require one source of truth for launch stage, progress, and user-facing status text

**Best contained in**
- the first roadmap phase

### 2. Treating raw i18n keys as one-off copy defects

**Failure mode**
- a visible raw key is replaced with hardcoded text in one component
- locale catalogs stay incomplete, so the same key leaks elsewhere later

**Current evidence**
- the audit calls out `settings.tab_storage`, `general.show_advanced`, `settings.java_auto`, and `general.rescan`
- `theme-presets.ts` stores preset labels as hard-coded English names

**Prevention**
- fix missing locale ownership, not just the current screen
- require every touched visible string to resolve cleanly in both `en` and `ru`

**Best contained in**
- the shared localization or settings polish phase

### 3. Solving dense tabs with another discoverability trap

**Failure mode**
- the tab row stops truncating one screen but gains another scroll region or a harder-to-find overflow control

**Current evidence**
- the audit already flags detail-tab discoverability on long modpack pages

**Prevention**
- prefer wrap, compact grouping, or a stable `More` affordance
- avoid adding inner horizontal scrolling unless the result is demonstrably easier to use

**Best contained in**
- the modpack-detail navigation phase

### 4. Rendering platform/runtime requirements as missing mods

**Failure mode**
- dependency UI keeps treating `minecraft`, `forge`, or similar runtime facts as absent because the screen only checks installed mod files

**Current evidence**
- the audit shows `minecraft` and `forge` incorrectly marked missing
- pack runtime metadata and scanner output likely live in different seams

**Prevention**
- resolve dependency truth from pack runtime metadata before rendering status badges
- separate runtime requirements from file-based mod dependencies in the UI

**Best contained in**
- the modpack detail integrity phase

### 5. Duplicating fallback behavior per surface

**Failure mode**
- the launch surface gets one emergency image fix while catalog cards still show gray blocks
- each missing-art surface invents its own fallback behavior and the product still feels inconsistent

**Current evidence**
- the audit shows broken or empty imagery on both launch and catalog flows

**Prevention**
- define one branded fallback policy and reuse it
- treat empty, broken, and missing imagery as one product-quality problem

**Best contained in**
- the shared truth or polish foundation work

### 6. Letting “full polish” reopen unrelated backlog work

**Failure mode**
- chunk-splitting, workflow drift, architecture cleanup, or new launcher features absorb time meant for visible shipped-surface defects

**Current evidence**
- the user asked for deep cleanup, but the screenshot audit remains the clearest defect ledger
- `PROJECT.md` already tracks other non-blocking debt that can easily sprawl

**Prevention**
- keep the milestone anchored to documented defects plus directly related proven cleanup
- force every extra task to answer which audited user-facing problem it closes

**Best contained in**
- requirements and roadmap scoping

### 7. Proving only static visuals, not user trust

**Failure mode**
- screenshots look cleaner, but runtime status, compact-nav affordances, or fallback behavior still break during real interaction

**Current evidence**
- several audited defects are interaction or state-sync problems, not just layout bugs

**Prevention**
- verify through live walkthrough plus targeted tests, not image review alone
- explicitly exercise launch progress, dense tabs, collapsed nav, and missing-art paths

**Best contained in**
- the final verification or release-truth phase

## Anti-Patterns To Avoid

- fixing a raw key with inline text instead of adding the missing locale key
- changing only the displayed loader label while the effective launch config still disagrees
- adding a new scrollable strip to solve existing overflow
- implementing a launch-art fallback only on the play screen while catalog cards stay untreated
- turning the polish milestone into a generic tech-debt sweep with no direct user-visible closure

## Roadmap Guidance From These Risks

- put shared truth and locale ownership before cosmetic cleanup
- isolate dependency semantics into a phase that can test them directly
- keep verification as a dedicated closeout step; do not assume screenshot comparison is enough
- reject requirements that do not map back to the audit or a directly related proven inconsistency

## Sources

- `.planning/PROJECT.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`
- `src/components/SimplePlayDashboard.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/settings/settingsTabs.ts`
- `src/contexts/settings/theme-presets.ts`

---
*Research completed: 2026-04-14*  
*Ready for roadmap: yes*
