# Project Research Summary

**Project:** FriendLauncher (FMCL)
**Domain:** Brownfield desktop-launcher UI system and UX redesign
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Executive Summary

FMCL is not missing core launcher capability; it is missing product coherence. The research points to a brownfield-safe approach: keep the current Electron + React + TypeScript + Tailwind architecture, make shared tokens/primitives/theme state the real source of truth, then roll that system through the most visible launcher flows and only after that spend time on broader polish.

The highest leverage work is not a framework migration or isolated visual tweaks. It is system-first cleanup of shells, cards, dialogs, forms, iconography, and localization, followed by route-level UX refinement for the launcher's most-used flows. The main risks are false progress through screen-local styling, theme settings that do not materially affect the UI, and “manual testing” that never becomes a repeatable browser walkthrough.

## Key Findings

### Recommended Stack

The current stack is already sufficient. React 19, TypeScript 5.9, Tailwind 4, CSS custom properties, and the existing settings/theme seams are appropriate for this milestone. The recommended move is to standardize how FMCL uses them, not to replace them. `lucide-react` should become the default icon language, and the existing Vitest + Testing Library setup is enough for shared UI regression coverage.

**Core technologies:**
- React — renderer composition and screen/state orchestration without a platform rewrite
- TypeScript — typed variants, theme contracts, and locale-safe UI refactors
- TailwindCSS + CSS variables — shared design tokens and consistent theme propagation

### Expected Features

The must-haves are a coherent shared visual system, EN/RU correctness, theme/icon consistency, focused redesign of critical launcher flows, and explicit browser-based verification of those flows.

**Must have (table stakes):**
- Shared shells, surfaces, forms, dialogs, and visual states — users expect one product, not mixed modules
- Full translation correctness across visible UI states — placeholder or missing-copy leaks are product-quality defects
- Real theme propagation and consistent iconography — appearance settings must visibly matter
- Manual browser walkthrough of critical routes — the milestone is about actual experience, not only code health

**Should have (competitive):**
- Modpack-first information hierarchy — aligns the launcher with its strongest product identity
- Atmosphere that supports readability — background and motion should give identity without reducing usability
- Unified treatment of advanced surfaces — accounts, mirrors, stats, and sharing should feel like the same launcher

**Defer (v2+):**
- Large framework migration or full UI-kit replacement — too much scope, not necessary for the product goal
- Deeper personalization and visual-regression infrastructure — valuable later, but not required to validate the milestone

### Architecture Approach

The renderer should be treated as three layers: feature screens, a shared presentation system, and a state/integration layer. `SettingsContext` plus `theme.ts` plus `src/index.css` should stay the appearance source of truth; `src/components/ui/*` should own reusable visual semantics; and `src/locales/*.json` should remain the only allowed source for user-facing copy. Feature screens should consume this system rather than define parallel ones.

**Major components:**
1. Shared UI primitives — own repeated affordances and state styling
2. App shell and high-traffic routes — own hierarchy, navigation, and launcher identity
3. Theme/localization seams — own document-level appearance and EN/RU parity

### Critical Pitfalls

1. **Foundation drift disguised as progress** — fix shared tokens and primitives before wide screen polish
2. **Theme settings with weak visible payoff** — migrate screens onto tokenized colors instead of relying on persistence alone
3. **Translation cleanup that stops at headlines** — include placeholders, helper text, and modal states in scope
4. **Decorative polish that reintroduces accessibility debt** — keep readability, focus, contrast, and motion discipline first
5. **Manual testing reduced to a screenshot** — define and execute a browser walkthrough as milestone evidence

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 7: UI System Foundations
**Rationale:** Shared primitives, theme tokens, icon rules, and shell contracts must stabilize before broad restyling.
**Delivers:** Design-token enforcement, primitive cleanup, shell consistency, theme source-of-truth rollout.
**Addresses:** Shared visual-language and theme-fidelity table stakes.
**Avoids:** Foundation drift and fake theme support.

### Phase 8: UI Correctness And Core Flow Rollout
**Rationale:** Once the system exists, high-traffic routes should consume it while translation and icon defects are removed.
**Delivers:** EN/RU cleanup, icon consistency, and refreshed launcher/modpack/account/settings flows.
**Uses:** Shared primitives and localization contracts from Phase 7.
**Implements:** The highest-value route rollout first.

### Phase 9: Secondary Surface Polish And UX Refinement
**Rationale:** Advanced or lower-traffic surfaces should be aligned only after the main shell feels coherent.
**Delivers:** Unified treatment of share/statistics/mirror/content-management surfaces and any remaining visual hierarchy cleanup.
**Uses:** The same system instead of inventing new exceptions.

### Phase 10: Manual Experience Verification And Release Truth
**Rationale:** The milestone explicitly requires browser-based validation, and documentation should reflect the refreshed UI truthfully.
**Delivers:** Real browser walkthrough evidence, final UI fallout fixes, and documentation updates tied to shipped UX.

### Phase Ordering Rationale

- Foundations come first because theme, icon, and surface drift are structural, not cosmetic.
- Core routes come before secondary surfaces because they define whether the launcher feels coherent in everyday use.
- Verification closes the milestone because visual and interaction quality must be judged on the live product, not inferred from code.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 9:** Secondary surface grouping should be scoped against the actual current UI drift, not assumed from feature names alone.
- **Phase 10:** Manual verification should define an explicit walkthrough/checklist so the completion claim stays concrete.

Phases with standard patterns (skip research-phase):
- **Phase 7:** Uses established token/primitives/source-of-truth patterns already visible in the codebase.
- **Phase 8:** Mostly rollout and cleanup work on known screens rather than new technical terrain.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Current codebase already exposes the right tools for this milestone |
| Features | MEDIUM | User intent is clear, but exact route scope still needs requirement-level scoping |
| Architecture | MEDIUM | Strong local evidence exists, though some screen-level drift still needs direct planning inspection |
| Pitfalls | HIGH | Brownfield UI-system risks are well aligned with the repo's known issues and current seams |

**Overall confidence:** MEDIUM

### Gaps to Address

- Exact set of core routes that must be refreshed in Phase 8 versus Phase 9
- Concrete browser walkthrough checklist and evidence format for milestone completion

## Sources

### Primary (HIGH confidence)
- Local repo inspection: `package.json` — active runtime and tooling stack
- Local repo inspection: `src/index.css`, `src/contexts/settings/theme.ts`, `src/components/ui/Button.tsx` — current theme and shared UI seams
- Local repo inspection: `docs/KNOWN_ISSUES.md` — active correctness gaps and brownfield risks

### Secondary (MEDIUM confidence)
- `.planning/PROJECT.md` — milestone framing and current product priorities
- Current uncommitted UI work in `src/components/` and `src/features/` — evidence of likely rollout seams

### Tertiary (LOW confidence)
- Inference from brownfield launcher UX patterns rather than external ecosystem benchmarking in this run

---
*Research completed: 2026-04-13*
*Ready for roadmap: yes*
