# Feature Research

**Domain:** Brownfield desktop-launcher UI system and UX redesign
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Shared visual language across cards, forms, dialogs, shells, and empty states | A launcher with mixed styles feels unfinished even if features work | MEDIUM | Must be driven by shared primitives and token usage, not isolated screen rewrites |
| Full EN/RU text correctness with no placeholder or missing translation leaks | Broken language coverage reads as broken product quality immediately | MEDIUM | Includes inventorying hardcoded strings and ensuring both locales ship together |
| Theme fidelity that actually changes the app, not only isolated controls | Users expect light/dark/accent choices to affect the whole interface | MEDIUM | Requires document-level tokens and screen adoption, not only settings persistence |
| Consistent iconography and control states | Missing icons and mixed symbols make navigation feel unreliable | LOW | One icon system, explicit loading/error/empty states, and consistent affordances |
| Critical-screen manual verification | UI polish claims are not credible without real interaction checks | LOW | Must cover launcher home, settings, modpacks, accounts, and modal flows |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Modpack-first information hierarchy | Makes FMCL feel purpose-built for its strongest audience instead of generic Minecraft chrome | MEDIUM | Prioritize install, browse, play, share, and manage flows around modpack usage |
| Atmosphere without sacrificing readability | Gives the launcher a deliberate identity beyond “utility app” while still feeling usable | MEDIUM | Backgrounds, accent, and motion should support hierarchy rather than compete with it |
| Theme and accent customization that propagates cleanly | Turns a settings feature into a real product identity system | MEDIUM | Valuable only if implemented through shared tokens, not per-screen overrides |
| Unified treatment of advanced surfaces | Accounts, mirrors, statistics, sharing, and content screens should feel like the same product as onboarding and play | HIGH | Important brownfield differentiator because these surfaces often lag behind the shell |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full visual rewrite of every screen before foundations | Feels like the fastest path to a “new UI” | Guarantees inconsistency and regressions because foundations remain unstable | Establish shared system first, then roll it through high-traffic surfaces |
| Decorative motion everywhere | Makes screenshots look more “alive” | Hurts readability, focus, and reduced-motion compliance in a desktop launcher | Keep a restrained motion language tied to hierarchy and state changes |
| New UI framework adoption as part of the milestone | Seems like a shortcut to consistency | Replaces UX work with migration work and explodes scope | Stay on current stack and unify existing primitives |
| Cosmetic fixes without browser walkthroughs | Feels efficient when time is tight | Misses dead toggles, theme leaks, clipped layouts, and navigation friction | Treat manual browser verification as part of definition of done |

## Feature Dependencies

```
Shared tokens + primitives
    └──requires──> theme source of truth
                          └──requires──> screen rollout

Locale cleanup
    └──requires──> user-facing string inventory

Manual browser verification
    └──requires──> critical-screen checklist

UX flow redesign
    └──enhances──> visual-system rollout
```

### Dependency Notes

- **Shared tokens + primitives require theme source of truth:** visual consistency collapses if screens can bypass the token layer.
- **Locale cleanup requires user-facing string inventory:** missing translation issues usually survive unless they are systematically hunted.
- **Manual browser verification requires a critical-screen checklist:** ad hoc clicking is too easy to under-scope.
- **UX flow redesign enhances visual-system rollout:** stronger flow polish matters more once screens already share structure and affordances.

## MVP Definition

### Launch With (v0.2.0)

- [ ] Shared UI system for shells, cards, forms, dialogs, and visual states — essential because every later screen fix should inherit it
- [ ] EN/RU correctness pass for visible launcher UI text — essential because placeholder and missing copy are currently user-visible defects
- [ ] Real theme/icon consistency across the launcher — essential because settings credibility depends on it
- [ ] Focused redesign of the highest-traffic launcher flows — essential because convenience and visual clarity are part of the milestone goal
- [ ] Manual browser-based verification of the redesigned experience — essential because this milestone is explicitly about perceived quality

### Add After Validation (v0.2.x)

- [ ] Richer secondary visual presets or curated theme packs — add after the base token system and theme propagation prove stable
- [ ] Broader pass over low-traffic management screens — add once the primary shell and modpack/play/account flows are coherent

### Future Consideration (v0.3+)

- [ ] Deeper personalization or layout modes beyond current settings — defer until the base design system is stable
- [ ] Visual regression tooling or screenshot baselines — defer until the desired UI has settled enough to be worth locking visually

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Shared design tokens and primitives | HIGH | MEDIUM | P1 |
| Translation and placeholder cleanup | HIGH | MEDIUM | P1 |
| Theme and accent propagation | HIGH | MEDIUM | P1 |
| Core launcher/modpack/account flow polish | HIGH | HIGH | P1 |
| Unified advanced-surface restyle | MEDIUM | HIGH | P2 |
| Extra visual presets and cosmetic variety | MEDIUM | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| Visual consistency | Dedicated launcher brands usually keep one shell language across home, installs, and settings | Many technical launchers expose feature depth but drift visually between modules | FMCL should keep its breadth while unifying shell, cards, dialogs, and settings surfaces |
| Theme support | Better launchers make theme changes obvious and holistic | Weaker launchers expose a toggle that barely changes content surfaces | FMCL should make theme and accent visibly reshape the full experience |
| Modpack UX | Modpack-oriented launchers win by making browse/install/play/manage feel close together | Generic launchers often bury modpack actions behind technical navigation | FMCL should lean into its modpack-first product identity rather than flatten it |

## Sources

- Local repo inspection: `docs/KNOWN_ISSUES.md`
- Local repo inspection: `src/index.css`, `src/contexts/settings/theme.ts`
- Existing milestone framing in `.planning/PROJECT.md`
- Current brownfield scope and local UI work-in-progress in `src/components/` and `src/features/`

---
*Feature research for: FMCL v0.2.0 UI system and UX redesign*
*Researched: 2026-04-13*
