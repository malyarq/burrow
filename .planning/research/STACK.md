# Stack Research

**Domain:** Brownfield desktop-launcher UI system and UX redesign
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.3 | Renderer UI composition, stateful flows, accessibility semantics | Already powers FMCL screens; the milestone is about consolidating shared patterns, not replacing the renderer model |
| TypeScript | 5.9.3 | Typed design tokens, component variants, locale-safe UI contracts | Prevents new theme/icon/translation drift while refactoring brownfield UI surfaces |
| TailwindCSS + CSS custom properties | 4.1.18 | Shared visual tokens, surfaces, spacing, and theme propagation | Fits the current codebase and supports a token-first design system without introducing a heavyweight component framework |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.563.0 | Consistent icon set across launcher shells and cards | Use as the default icon source anywhere emoji, missing icons, or mixed glyph styles currently appear |
| clsx + tailwind-merge | 2.1.1 / 3.4.0 | Deterministic variant composition for shared primitives | Use in shared UI components and shell elements instead of ad hoc string concatenation |
| Vitest + @testing-library/react + jsdom | 4.1.4 / 16.3.2 / 29.0.2 | Regression coverage for UI primitives, theme behavior, and utility seams | Use for component-level verification where UI-system behavior can regress without breaking service tests |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint with `react-hooks` and TypeScript rules | Prevent hook-order drift, stale effect patterns, and `any` leakage during UI refactors | Keep `npm run lint` green while shared primitives are being unified |
| `npx tsc --noEmit` | Guard typed theme, locale, and component contracts | Especially important when moving screens onto shared props and token APIs |
| Vite dev server + real browser run | Manual visual and interaction verification | Required for this milestone because screenshots alone do not prove usability or theme correctness |

## Installation

```bash
# Core
# No new core framework required; continue on the existing React + TypeScript + Tailwind stack

# Supporting
# No mandatory runtime additions beyond the already-installed lucide-react stack

# Dev dependencies
# No mandatory new test runner additions; reuse the existing Vitest + Testing Library setup
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Token-first Tailwind + CSS variables | Full UI kit migration (MUI, Ant, Chakra) | Only if the product deliberately chooses a new visual language and accepts a broad component rewrite |
| Selective shared primitive cleanup | Importing a generated `shadcn`-style layer wholesale | Only if FMCL is ready to normalize markup, composition, and accessibility conventions app-wide in one push |
| Existing SettingsContext theme source | New global state layer just for design-system state | Only if theme/layout state truly outgrows current settings ownership, which is not yet evident |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Heavy component-library rewrite | Replaces the current brownfield milestone with a platform migration and guarantees visual churn | Consolidate existing shared primitives and token usage first |
| Screen-local hardcoded colors, blur, spacing, and shadows | Recreates the same visual drift the milestone is trying to remove | Route styling through shared surface classes and CSS custom properties |
| Mixed icon systems, emoji, and one-off inline SVG decisions | Produces inconsistent hierarchy and weakens recognition across screens | Standardize on one icon system with explicit empty/loading/error states |
| Screenshot-only UI verification | Can miss broken focus order, hover/focus contrast, dead toggles, and route-level drift | Use real browser runs with a milestone checklist on critical screens |

## Stack Patterns by Variant

**If the change affects multiple screens:**
- Put the decision in shared primitives, shell components, or theme tokens
- Because one-off fixes in feature files are how brownfield UI drift returns immediately

**If the change is feature-specific but user-facing:**
- Still consume the shared token and icon APIs
- Because visual exceptions should be deliberate, not accidental leftovers

**If a flow must be visually verified:**
- Prefer `npm run dev` or `vite preview` plus browser interaction
- Because runtime theme, focus, and layout issues often do not surface in unit tests

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `react@19.2.3` | `vite@7.3.1`, `@vitejs/plugin-react@5.1.2` | Current renderer stack is modern enough for the milestone without framework changes |
| `tailwindcss@4.1.18` | CSS custom properties in `src/index.css` | Strong fit for tokenized theming and shared surface classes |
| `vitest@4.1.4` | `@testing-library/react@16.3.2`, `jsdom@29.0.2` | Sufficient for component and utility regression coverage around the UI system |

## Sources

- Local repo inspection: `package.json` — current runtime and dev stack
- Local repo inspection: `src/index.css`, `src/contexts/settings/theme.ts` — current token and theme application seams
- Local repo inspection: `src/components/ui/Button.tsx` — shared primitive composition pattern
- Local repo inspection: `docs/KNOWN_ISSUES.md` — active UI correctness and hook-quality pressure points

---
*Stack research for: FMCL v0.2.0 UI system and UX redesign*
*Researched: 2026-04-13*
