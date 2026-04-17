# Pitfalls Research

**Domain:** deep redesign and brand reset of an already shipped Electron desktop launcher UI
**Milestone:** `v0.5.0 Experience Reinvention And Brand Reset`
**Researched:** `2026-04-17`
**Confidence:** HIGH

## Future Phase Buckets Used In This Mapping

These phase names are proposed planning buckets for `v0.5.0`, not already-approved roadmap phases.

| Proposed future phase | What it should own |
| --- | --- |
| Phase 19: Baseline Stability, Scope, And Shell Invariants | clear crash-causing baseline debt, freeze the defect ledger, and define shared titlebar/footer/scroll contracts before visual restyling starts |
| Phase 20: Brand System, Shared Tokens, And Surface Migration | new brand primitives, fallback policy, shared visual seams, and migration off mixed old/new styling |
| Phase 21: Dense Surface IA, Navigation, And CTA Hierarchy | modpack details, wizards, filter rows, dense tabs, and ownership of primary vs contextual actions |
| Phase 22: Theme Truth And Interaction-State Fidelity | accent application, preset differentiation, contrast, selected/focus/disabled states, and readable controls in dark/light modes |
| Phase 23: Fallback, Error, And Placeholder Productization | degraded states, missing art, empty states, raw template leaks, crash surfaces, and low-trust default visuals |
| Phase 24: Verification, Locale, And Release Truth | multi-size and multi-theme proof, EN/RU verification, manual walkthrough expansion, and docs truth |

## Critical Pitfalls

### Pitfall 1: Starting the redesign on top of an unstable shipped baseline

**What goes wrong:**
The milestone spends its energy repainting screens while known runtime or lint-level defects remain in the same shell. The result is a launcher that looks newer in screenshots but is still one bad render path away from a broken session.

**Why it happens:**
Deep redesign work feels visually urgent, so teams classify hook-order issues, stale effect wiring, and crash-prone screens as "separate cleanup" instead of gating the redesign baseline.

**How to avoid:**
Make `v0.5.0` start with a baseline-stability gate. Close crash-level defects in shared or high-traffic surfaces before major restyling begins, and keep `tsc`, lint, and the current verification seam green while the redesign lands.

**Warning signs:**
- `docs/KNOWN_ISSUES.md` still lists crash-capable or runtime-breaking issues in shipped surfaces like `BackgroundLayer.tsx` and `AccountsPage.tsx`.
- Design work starts while the app can still trip `react-hooks/rules-of-hooks` or `ReferenceError` class problems.
- Review discussion is about gradients and spacing while the baseline shell is still operationally fragile.

**Phase to address:**
Phase 19: Baseline Stability, Scope, And Shell Invariants

---

### Pitfall 2: Painting over broken shell and window-chrome contracts

**What goes wrong:**
The redesign makes the launcher more decorative without fixing structural geometry, so the same shipped defects stay visible under nicer paint: content under the custom title bar, sticky headers covering cards, and fixed action bars eating the bottom of pages.

**Why it happens:**
Existing desktop launchers accumulate route-specific padding and "just move it down" fixes. A brand reset often lands above those hacks instead of replacing them with one shell contract.

**How to avoid:**
Define shared invariants first: top safe area below the custom title bar, bottom reservation for fixed footers, and one scroll-container rule per page type. Make every redesigned route consume those seams instead of shipping new magic numbers.

**Warning signs:**
- The same top clipping described in `R1` survives across classic, modpack, wizard, and modal screenshots.
- `R2` and `S18` style overlaps persist after visual refreshes.
- Individual pages introduce custom `pt-*`, sticky offsets, or extra spacer divs to "line up" with the new shell.

**Phase to address:**
Phase 19: Baseline Stability, Scope, And Shell Invariants

---

### Pitfall 3: Running the brand reset as a per-screen repaint

**What goes wrong:**
Core routes get new typography, gradients, and logo usage, but sidebars, modals, sliders, fallback art, and secondary settings controls still use the old visual language. The launcher ends up looking half-replaced instead of intentionally redesigned.

**Why it happens:**
Shipped apps have too many surfaces to repaint manually. Teams start with hero screens, then defer the "boring" seams where the old product identity is most visible.

**How to avoid:**
Create a brand migration inventory before touching screens. Move colors, elevation, marks, fallback art, and spacing rhythm into shared tokens/components, then migrate routes in batches that eliminate mixed old/new identity rather than spreading the reset thinly.

**Warning signs:**
- `R6` already shows accent drift: green accent selected, blue slider handle still present.
- New preset names or hero cards change, but modal overlays, sidebars, and list-row controls still read as a previous design generation.
- The visual diff is strongest on marketing-like areas and weakest on settings, dense lists, and error/fallback surfaces.

**Phase to address:**
Phase 20: Brand System, Shared Tokens, And Surface Migration

---

### Pitfall 4: Preserving the old action hierarchy under new chrome

**What goes wrong:**
The redesign adds polished new action bars or page-level CTAs, but the legacy launcher's global actions remain equally prominent. Users see two competing "primary" actions and lose confidence about which action owns the current context.

**Why it happens:**
Desktop launchers often already have a sidebar-level play affordance. Redesign work adds route-local CTAs without explicitly demoting, removing, or redefining the older ones.

**How to avoid:**
Write an action-ownership map for every major route: what is global, what is contextual, and what deserves primary emphasis. The redesigned page should expose one primary action, with all other actions deliberately secondary or grouped.

**Warning signs:**
- `R4` already shows two green `Play` CTAs on modpack details.
- Fixed footer actions duplicate controls that are still visible in the shell/sidebar.
- Reviews praise the new action bar while no one answers which button a user should click first.

**Phase to address:**
Phase 21: Dense Surface IA, Navigation, And CTA Hierarchy

---

### Pitfall 5: Designing dense existing surfaces against happy-path content only

**What goes wrong:**
Comps look clean, but the shipped launcher's real data breaks them immediately: tabs wrap with empty space still available, labels split across lines, orphan counters appear, summary text contradicts controls, and dense rows collapse under long localized strings.

**Why it happens:**
Brand-reset work is often validated with short English copy, full-width windows, and mock data that avoids worst-case states. Existing launcher surfaces like modpack details and creation wizards are the opposite of that.

**How to avoid:**
Build the redesign with hostile fixtures from day one: long modpack names, long tab labels, Russian strings, narrow windows, missing art, long dependency ranges, and mixed runtime metadata. Dense surfaces need real content pressure, not idealized demo data.

**Warning signs:**
- `R3`, `S02`, `S03`, `S15`, and `S17` already show tab wrapping, broken buttons, ambiguous dropdowns, contradictory summaries, and template-driven rows under stress.
- The redesigned dense screens are approved from one window size and one locale.
- "Looks good in the mock" is doing more work than route-level verification with seeded bad cases.

**Phase to address:**
Phase 21: Dense Surface IA, Navigation, And CTA Hierarchy

---

### Pitfall 6: Making themes expressive but not state-truthful

**What goes wrong:**
The launcher gains moodier dark presets or brighter light themes, but users cannot tell what is selected, focused, disabled, or active. Themes become poster art instead of dependable interaction systems.

**Why it happens:**
Brand resets frequently optimize for screenshots and not for state matrices. In shipped UI, the hardest part is not the resting surface but the dozens of control states across presets, accents, and locales.

**How to avoid:**
Treat theme work as state-system work. Define contrast and differentiation requirements for selected, hover, focus, disabled, segmented, slider, scrollbar, and modal states in every supported preset and accent combination.

**Warning signs:**
- `R6` and `R7` already show partial accent application and weak selected-state contrast.
- `S14` shows a disabled `Next` state that is too faint to read confidently.
- `S12` shows presets that barely differ visually despite different names.
- Theme QA is based on hero screenshots instead of a control-state matrix.

**Phase to address:**
Phase 22: Theme Truth And Interaction-State Fidelity

---

### Pitfall 7: Treating degraded, fallback, and error states as post-redesign cleanup

**What goes wrong:**
The happy path looks branded, but the launcher still collapses into low-trust defaults the moment data or rendering gets messy: raw template placeholders, bad pluralization, generic missing-art states, and full React runtime internals on the crash screen.

**Why it happens:**
Teams naturally prioritize the visible main flow first. In a shipped launcher, though, users hit empty states, missing art, update states, and broken metadata constantly, so those surfaces dominate perceived quality.

**How to avoid:**
Make degraded-state productization an owned phase, not the cleanup pile. Standardize fallback art, placeholder handling, error wording, and crash-screen disclosure rules as branded product surfaces.

**Warning signs:**
- `S17` and `S18` expose `${file.jarVersion}` directly in the UI.
- `S17` shows broken pluralization (`1 Dependencies`).
- `S20` exposes `localhost`, `node_modules`, and the raw React error text on a user-facing crash screen.
- The redesign deck has hero mocks but no empty-state, error-state, or missing-art frames.

**Phase to address:**
Phase 23: Fallback, Error, And Placeholder Productization

---

### Pitfall 8: Declaring the redesign done from curated screenshots

**What goes wrong:**
The milestone closes on before/after captures of the best-looking routes, while resize behavior, theme switching, light mode, Russian copy, modal isolation, and failure states stay effectively untested. The launcher ships with a cleaner gallery and the same trust gaps.

**Why it happens:**
Redesign work is emotionally driven by visible diffs. Once the main screenshots feel better, verification pressure drops unless the team deliberately expands the proof contract.

**How to avoid:**
Upgrade the existing browser-backed verification seam to `v0.5.0` and require proof across route families, sizes, themes, locales, and degraded states. Keep docs synchronized with that evidence instead of letting them trail the shipped reality.

**Warning signs:**
- Verification covers only dark mode or only one window size.
- The redesign has no proof for `R1`/`R2` style overlap cases, `S20` style crash handling, or Russian copy.
- Screenshots are being refreshed faster than regression tests and manual verification routes.

**Phase to address:**
Phase 24: Verification, Locale, And Release Truth

---

### Pitfall 9: Letting "deep redesign" become a license for scope drift

**What goes wrong:**
The milestone quietly expands from redesigning shipped surfaces into architecture rewrites, brand-new navigation models, animation experiments, or unrelated feature additions. The result is a larger diff, weaker reviewability, and fewer closed user-facing problems.

**Why it happens:**
Once a milestone is described as reinvention, almost any change can sound justified. Existing visual debt and existing product debt get merged into one giant bucket.

**How to avoid:**
Keep a strict defect-and-brand ledger tied to shipped surfaces. Every planned task should answer which current trust issue, warning sign, or product-drift symptom it closes. Everything else becomes follow-up, not redesign scope.

**Warning signs:**
- Planned work cannot be traced back to `PROJECT.md`, `KNOWN_ISSUES.md`, or the screenshot report.
- Route count or feature count increases during a milestone that was supposed to be about redesigning existing UI.
- Commit or PR size starts looking like the `163 files / +11000 lines` warning already called out in `docs/KNOWN_ISSUES.md`.

**Phase to address:**
Phase 19: Baseline Stability, Scope, And Shell Invariants

## Technical Debt Patterns

Shortcuts that feel efficient during a redesign but usually make a shipped launcher harder to stabilize.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
| --- | --- | --- | --- |
| Route-specific top padding fixes for titlebar overlap | Fast visual alignment on one screenshot | More `R1` drift, inconsistent drag-safe areas, and repeated shell math | Never after Phase 19 starts |
| Hardcoding new copy or preset names in components to hide locale leaks | Screens look fixed quickly | EN/RU drift returns on the next untouched route | Only for a throwaway prototype, never for milestone code |
| Keeping both old and new primary actions "until we decide later" | Avoids hard product decisions | Duplicated CTA hierarchy, worse user trust, and harder accessibility semantics | Never on shipped routes |
| Shipping route-specific fallback art or empty states | Unblocks one screen | Brand reset stays inconsistent and degraded states remain low-trust | Only as a temporary local stub before Phase 23 consolidation |
| Rewriting a page from scratch instead of extracting a shared seam | Big visual movement fast | More token drift, more layout bugs, and duplicated modal/footer/overlay logic | Acceptable only if the route also becomes the new shared primitive owner in Phase 20 |
| Approving redesign work from static screenshots only | Fast review cycle | Resize, locale, state, and failure regressions escape into the shipped app | Never for milestone closeout |

## Integration Gotchas

Common places where a redesign of an existing launcher surface usually reconnects to the wrong seam.

| Integration seam | Common mistake | Correct approach |
| --- | --- | --- |
| Electron custom title bar and draggable region | Restyling page headers without a shared top inset contract | Centralize titlebar-safe geometry in the shell and make routes consume it |
| Shared renderer state vs user-facing launch/config summaries | Rewording labels while leaving contradictory state mapping intact | Fix the data contract first, then redesign the summary surface |
| Theme tokens and control primitives | Applying new colors directly in route components | Move brand tokens and state variants into shared primitives before route rollout |
| Locale catalogs | Renaming presets or buttons inline during redesign | Keep every user-facing string in `src/locales/en.json` and `src/locales/ru.json`, then verify both |
| Manual verification seam | Creating one-off proof screens for redesigned pages | Extend the existing shared verification entry and seed real failure cases there |
| Fallback imagery and crash surfaces | Handling each missing-art or error state ad hoc per route | Define one fallback/error policy and reuse it across shell, catalog, details, and modals |

## Performance Traps

Patterns that often seem harmless in a redesign but break down on real desktop hardware and real launcher sessions.

| Trap | Symptoms | Prevention | When It Breaks |
| --- | --- | --- | --- |
| Layering blur, glow, and backdrop effects on every modal and page background | Fan spin-up, sluggish overlays, muddy text, and obvious lag when opening settings or modals | Limit live blur layers, prefer composited assets where possible, and test stacked overlays on typical laptops | Breaks first on integrated GPUs and when multiple translucent layers stack, which FMCL already does in settings and modals |
| Fixing overlap bugs with resize/scroll listeners and measured JS offsets | Jank while resizing, sticky headers drifting, footer collisions returning on some routes | Prefer CSS layout contracts and shared shell reservations over per-route measurements | Breaks under narrow-window drag, dense scroll pages, and sticky headers like `S18` |
| Implementing theme or locale switching by remounting whole route trees | Lost scroll position, flicker, and state resets while previewing presets | Use token/state updates and scoped rerenders, not full route teardown | Breaks on long settings and modpack-detail flows where users are actively editing content |

## Security Mistakes

Redesign-specific mistakes that leak internals because error and debug surfaces are treated as design leftovers.

| Mistake | Risk | Prevention |
| --- | --- | --- |
| Rendering raw `Error` objects and runtime stacks in the user-facing crash screen | Leaks local URLs, file paths, framework internals, and makes the app feel unsafe | Replace with a branded crash surface that logs technical detail elsewhere and shows safe user copy |
| Surfacing IPC or filesystem payloads verbatim in redesigned toasts, dialogs, or helpers | Reveals local paths, account names, or implementation details to end users and screenshots | Normalize error messages before rendering and keep raw payloads out of user-visible UI |
| Leaving template placeholders or debug text in list rows and helpers during rollout | Trains users to distrust the launcher and exposes internal field names | Add placeholder-leak checks to Phase 23 and Phase 24 verification |

## UX Pitfalls

Launcher-specific experience mistakes that a brand reset often amplifies instead of solving.

| Pitfall | User Impact | Better Approach |
| --- | --- | --- |
| Two primary CTAs on one route | Users hesitate and may launch the wrong thing | One surface, one primary action, with explicit global/context split |
| Overly translucent modals and drawers | Background keeps competing for attention and the active task feels unfocused | Stronger background suppression and clearer active-layer framing |
| Hidden or weak selected states in segmented controls and toggles | Users cannot trust what mode, language, or loader is active | Treat selected-state contrast as a hard requirement, not a visual preference |
| Dense tabs wrapping or scrolling without a clear pattern | Navigation feels improvised and expensive to scan | Decide on one discoverable desktop pattern for overflowed tab sets |
| Scroll indicators that disappear into the theme | Users miss available content and assume the page ends early | Make scroll affordances visible in both dark and light presets |

## "Looks Done But Isn't" Checklist

- [ ] **Shell redesign:** verify no route still clips under the custom title bar and no fixed footer or sticky header covers live content.
- [ ] **Brand reset:** verify old accent blues, generic fallback art, and previous-generation controls are gone from sidebars, modals, settings, and list rows, not only hero screens.
- [ ] **Dense-route refresh:** verify long modpack names, wrapped tabs, Russian labels, orphan counters, and dependency rows still read coherently.
- [ ] **CTA refresh:** verify each major route exposes one obvious primary action and does not duplicate it elsewhere on the same screen.
- [ ] **Theme rollout:** verify selected, focus, disabled, scrollbar, slider, and segmented states are readable in every supported preset and accent combination.
- [ ] **Fallback/error polish:** verify missing-art, empty, loading, and crash states use branded language and never leak raw template variables, raw i18n keys, or framework internals.
- [ ] **Verification closeout:** verify proof exists for dark and light, EN and RU, wide and narrow, plus at least one degraded-state route family.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
| --- | --- | --- |
| Unstable baseline under a redesign diff | HIGH | Pause visual expansion, fix the baseline lint/runtime blockers, rerun the current verification seam, then resume route migration |
| Shell/window contract drift | MEDIUM | Centralize top/bottom safe-area rules, remove route-level padding hacks, and rerun wide/narrow captures across owned routes |
| Mixed old/new brand language | HIGH | Inventory all visible tokens and fallback surfaces, move them to shared primitives, and delete route-specific overrides |
| CTA hierarchy conflict | MEDIUM | Write an action-ownership matrix per route, demote or remove duplicates, and update tests plus manual walkthroughs |
| Happy-path-only dense surfaces | MEDIUM | Seed worst-case content fixtures, rerun modpack/wizard verification, and revise layout patterns against real data pressure |
| Technical leaks in degraded states | LOW | Centralize fallback and error rendering, replace raw payloads with safe copy, and add explicit regression checks for placeholder leaks |
| Screenshot-only proof | HIGH | Expand the manual verification seam, capture multi-state evidence, and update release docs only after that proof is stable |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
| --- | --- | --- |
| Starting the redesign on an unstable baseline | Phase 19 | Lint, `tsc`, and the current manual verification seam are green before major visual migration starts |
| Painting over broken shell/window contracts | Phase 19 | Wide and narrow route captures show no titlebar clipping, footer overlap, or sticky-header collision |
| Running the brand reset as a per-screen repaint | Phase 20 | Token inventory and fallback policy are shared, and legacy accent/fallback remnants are absent across route families |
| Preserving old action hierarchy under new chrome | Phase 21 | Each major route has one primary CTA and no competing duplicate on the same screen |
| Designing dense surfaces against happy-path content only | Phase 21 | Long-name, RU-copy, narrow-width, and worst-case fixture passes exist for modpack and wizard flows |
| Making themes expressive but not state-truthful | Phase 22 | Control-state matrix passes for dark/light presets, accent variants, and disabled/focus/selected states |
| Treating degraded states as cleanup | Phase 23 | Missing-art, empty, loading, placeholder, and crash routes all render branded safe states |
| Declaring the redesign done from curated screenshots | Phase 24 | Browser-backed proof covers route families, sizes, themes, locales, and degraded states before docs roll forward |
| Letting deep redesign become scope drift | Phase 19 | Every plan item maps back to a shipped defect, warning sign, or explicit brand-consistency gap |

## Sources

- `/Users/kszinikov/fmcl/.planning/PROJECT.md`
- `/Users/kszinikov/fmcl/docs/KNOWN_ISSUES.md`
- `/Users/kszinikov/fmcl/new_screens/BUG_REPORT_2026-04-17.md`
- `/Users/kszinikov/.codex/get-shit-done/templates/research-project/PITFALLS.md`

---
*Pitfalls research for: FMCL `v0.5.0` redesign and brand reset*
*Researched: 2026-04-17*
