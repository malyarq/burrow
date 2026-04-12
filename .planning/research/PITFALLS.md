# Pitfalls Research

**Domain:** Brownfield desktop-launcher UI system and UX redesign
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Foundation Drift Disguised As Progress

**What goes wrong:**
Screens get individually prettier, but the launcher still looks inconsistent because tokens, shells, and primitives never become the real source of truth.

**Why it happens:**
Brownfield UI work often starts from the most visible page instead of from the most repeated visual contracts.

**How to avoid:**
Start with shared tokens, shared shells, and shared primitive variants before broad screen restyles.

**Warning signs:**
New screens still add one-off shadows, colors, icon sizes, or spacing values that do not exist in shared primitives.

**Phase to address:**
Foundation phase first.

---

### Pitfall 2: Theme Settings That Persist But Do Not Visually Matter

**What goes wrong:**
Theme, accent, or appearance settings save correctly but large parts of the UI ignore them.

**Why it happens:**
Legacy screens keep hardcoded classes or direct color choices while only a subset of components use shared CSS variables.

**How to avoid:**
Treat theme tokens as the only valid source of app colors and explicitly migrate high-traffic screens onto them.

**Warning signs:**
Toggling theme changes buttons or background only, while cards, shells, dialogs, or feature screens stay visually stale.

**Phase to address:**
Foundation and rollout phases.

---

### Pitfall 3: Translation Cleanup Stops At Headlines

**What goes wrong:**
Visible titles are translated, but placeholders, helper text, tooltips, and empty states still leak hardcoded copy or wrong locale content.

**Why it happens:**
Teams audit only the obvious strings and skip deeper interactive states.

**How to avoid:**
Include a full string inventory pass and require EN/RU parity for every touched UI flow.

**Warning signs:**
Search placeholders, modal buttons, validation messages, and “coming soon” strings differ between locales or remain in raw English/Russian.

**Phase to address:**
UI correctness phase.

---

### Pitfall 4: Visual Polish That Reintroduces Accessibility And Performance Debt

**What goes wrong:**
Blur, particles, gradients, and animations make the launcher look impressive in screenshots but reduce contrast, readability, and responsiveness.

**Why it happens:**
Late-stage polish is often treated as decoration instead of product ergonomics.

**How to avoid:**
Keep motion and atmosphere subordinate to contrast, focus, reduced-motion behavior, and frame stability.

**Warning signs:**
Text becomes harder to read on themed backgrounds, focus rings disappear, or the launcher feels heavier after style changes.

**Phase to address:**
Visual polish and verification phases.

---

### Pitfall 5: “Manual Testing” Means One Screenshot And A Guess

**What goes wrong:**
The milestone claims real browser verification, but in practice only the home screen or a static screenshot gets checked.

**Why it happens:**
Manual verification sounds expensive, so it shrinks unless it is explicitly scoped as required work.

**How to avoid:**
Define a browser walkthrough across core routes and critical interactions, and make it a completion artifact.

**Warning signs:**
No checklist exists for settings, accounts, modpacks, dialogs, theme switching, and keyboard/focus behavior.

**Phase to address:**
Verification phase.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Fixing styling in feature files only | Faster local polish | Drift returns on the next screen | Only for one-off emergency bugs, not for milestone foundations |
| Leaving hardcoded strings in touched screens | Faster edits | EN/RU parity silently regresses | Never for user-facing milestone work |
| Keeping multiple icon styles during transition | Avoids asset cleanup | UI hierarchy stays noisy and inconsistent | Only temporarily within the same phase, with a clear cleanup endpoint |
| Treating browser walkthroughs as optional | Saves time now | Shipped UI quality becomes guesswork | Never for this milestone |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Theme settings ↔ root document | Toggling class names without migrating screen styles to token usage | Make `theme.ts` + CSS variables the enforced palette contract |
| Locales ↔ renderer copy | Translating only visible labels while placeholders and helper text stay hardcoded | Audit all user-facing copy states on touched screens |
| Shared primitives ↔ feature screens | Adding “just for this screen” variants directly in feature files | Promote repeated patterns back into `src/components/ui/*` |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Too much blur and layered shadow on every surface | UI feels muddy or sluggish | Limit heavy visual effects to key surfaces and test live runtime | Breaks first on lower-end desktops or busy screens |
| Theme changes causing broad synchronous rerenders | Noticeable stutter when switching appearance | Keep theme work token-driven and avoid effect-driven cascades | Breaks as more screens subscribe to duplicated theme state |
| Remote or dynamic visual assets bypassing shared handling | Icons/images load inconsistently or flash | Reuse existing shared image and fallback seams | Breaks on unstable network or low-cache flows |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Adding rich visual content that bypasses existing safety seams | Reopens unsafe external-asset or path-handling issues | Keep new UI features on existing validated IPC and asset flows |
| Reintroducing unsafe external-link patterns in polished screens | Users can be navigated to untrusted content unexpectedly | Reuse existing guarded external-link handling from the hardened milestone |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Different interaction patterns for similar cards and dialogs | Users relearn controls on each screen | Standardize actions, affordances, and feedback through shared shells |
| Dense “power user” screens without hierarchy cleanup | Launcher feels harder to use despite more polish | Rework information hierarchy first, especially in modpack and settings flows |
| Theme and accent options with weak visible payoff | Settings feel broken or pointless | Make theme changes obvious on the full shell and high-traffic surfaces |

## "Looks Done But Isn't" Checklist

- [ ] **Theme:** Often missing shell/dialog/card rollout — verify light, dark, and accent changes on multiple routes
- [ ] **Localization:** Often missing placeholders and helper copy — verify EN/RU on modals, forms, and empty states
- [ ] **Icons:** Often missing non-happy paths — verify loading, empty, warning, and secondary-action states
- [ ] **Browser verification:** Often missing route coverage — verify launcher home, settings, accounts, modpacks, and dialogs
- [ ] **UX polish:** Often missing keyboard/focus checks after visual changes — verify tab order and visible focus on refreshed screens

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Foundation drift | HIGH | Pull repeated styling back into shared primitives, then re-rollout affected screens |
| Theme inconsistency | MEDIUM | Audit hardcoded colors and migrate route-by-route onto shared tokens |
| Translation leakage | MEDIUM | Build a touched-screen string checklist and patch both locale files together |
| Weak manual verification | LOW | Add a route checklist and rerun the browser walkthrough before phase close |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Foundation drift | Phase 7 | Shared primitives, shell tokens, and appearance source of truth are in place before broad screen refreshes |
| Theme inconsistency | Phase 7-8 | Theme and accent visibly affect all refreshed core routes |
| Translation leakage | Phase 8 | EN/RU walkthrough shows no placeholder or hardcoded-copy leaks on targeted surfaces |
| Accessibility/performance regressions from polish | Phase 9 | Visual updates still pass contrast, reduced-motion, and live-runtime checks |
| Weak manual verification | Phase 10 | Browser checklist exists and is executed against the final refreshed flows |

## Sources

- Local repo inspection: `docs/KNOWN_ISSUES.md`
- Local repo inspection: `src/index.css`, `src/contexts/settings/theme.ts`
- Current milestone framing in `.planning/PROJECT.md`
- Brownfield experience inferred from the current FMCL renderer structure and active UI changes

---
*Pitfalls research for: FMCL v0.2.0 UI system and UX redesign*
*Researched: 2026-04-13*
