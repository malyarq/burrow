# Project Research: Stack

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.5.0 Experience Reinvention And Brand Reset`  
**Researched:** 2026-04-17  
**Confidence:** HIGH

## Research Question

What stack additions or stack-level changes are actually justified for a deep launcher redesign, brand reset, fallback/error-state quality, and screenshot-backed UI regression reduction in FMCL without replacing the existing Electron + React + TypeScript + TailwindCSS + Vite architecture?

## Bottom Line

FMCL should keep its core runtime stack. `v0.5.0` does not need a new UI framework, a new state manager, or a broad testing-platform rewrite.

It does need four stack-level upgrades that the current repo does not formalize strongly enough:

1. a real brand-token layer on top of the current Tailwind v4 and runtime theme system
2. shared shell/layout metrics plus shared fallback and error-state primitives
3. automated screenshot regression coverage on top of the existing `manual-verification.html` seam
4. repo-level guards against raw locale keys, unresolved template placeholders, and fallback drift

These changes stay fully inside the current architecture and directly target the defects called out in `.planning/PROJECT.md`, `docs/KNOWN_ISSUES.md`, and `new_screens/BUG_REPORT_2026-04-17.md`.

## Core Stack To Keep

| Technology | Current version | Keep for `v0.5.0` | Why |
| --- | --- | --- | --- |
| Electron | `^40.0.0` | Yes | The milestone is about redesigning and stabilizing the shipped launcher, not replacing the desktop shell. |
| React | `^19.2.3` | Yes | Existing renderer seams already cover layout, overlays, onboarding, modpacks, settings, and error boundaries. |
| TypeScript | `^5.9.3` | Yes | Strong typing is still the cheapest way to keep launcher truth, locale contracts, and fixture data aligned. |
| TailwindCSS | `^4.1.18` | Yes | Tailwind v4 already supports theme-token driven styling; FMCL is not blocked by missing CSS capability. |
| Vite | `^7.3.1` | Yes | The existing browser-backed verification entry already depends on Vite and should stay the main redesign proof seam. |
| Vitest | `^4.1.4` | Yes | Keep it for unit and seam tests; do not replace it just to add visual coverage. |

## Required Stack Changes

| Change | Scope | Integration points | Why it is required for `v0.5.0` |
| --- | --- | --- | --- |
| Tailwind-backed brand token system | Repo-local stack change, no framework swap | `src/index.css`, `src/contexts/settings/theme.ts`, `src/contexts/settings/types.ts`, `src/contexts/settings/theme-presets.ts`, `src/components/ui/*` | The current theme layer mainly covers colors and background, while the redesign needs shared typography, radius, shadow, spacing, shell, and overlay tokens. Today `src/index.css` still hardcodes `Inter`, and `theme.ts` only pushes a narrow color palette into CSS variables. |
| Shared shell metrics and surface-state primitives | Repo-local UI infrastructure | `src/components/AppLayout.tsx`, `src/components/TitleBar.tsx`, `src/components/layout/BackgroundLayer.tsx`, settings/modal surfaces, detail footers | Repeated defects like content sitting under the title bar, fixed footers covering content, and weak modal isolation are shell-contract problems, not single-screen bugs. Central tokens for titlebar height, safe bottom padding, scrim strength, and surface elevation are needed before a redesign can stay consistent. |
| Shared branded fallback/error-state layer | Repo-local UI primitive and asset layer | `src/components/ErrorBoundary.tsx`, `src/components/ErrorBoundaryWrapper.tsx`, `src/components/ui/LazyImage.tsx`, `src/app/assets/branding.ts`, empty/error states across modpacks/settings/screenshots | The current app already has `LazyImage` and launcher-brand fallbacks, but the behavior is inconsistent and the fatal error screen still exposes raw React internals. `v0.5.0` needs one product-owned way to render missing art, empty states, recoverable errors, and fatal failures. |
| Visual regression tooling on the existing manual seam | New dev-only tooling | `manual-verification.html`, `src/verification/manual/ManualVerificationApp.tsx`, `src/verification/manual/views.ts`, `src/verification/manual/scenarios.tsx`, new `playwright.config.*`, new visual test directory | The repo already has a deterministic manual verification entry, but screenshot regressions are still discovered manually after the fact. Add `@playwright/test` and snapshot only milestone-owned views and viewports instead of creating a second verification system. |
| UI contract guards for locale and template leakage | Repo-local checks, no platform migration | `src/contexts/settings/i18n.ts`, `src/locales/en.json`, `src/locales/ru.json`, new `scripts/check-ui-contracts.*` or focused Vitest contracts | Current translator behavior returns the raw key on missing translations, and the screenshot audit already shows raw `${...}` placeholders and mixed-locale output. `v0.5.0` needs guardrails, not another post-hoc QA pass. |

## Optional Stack Changes

| Optional change | When it becomes worth it | Why it stays optional |
| --- | --- | --- |
| `@vitest/browser-playwright` | If the team wants browser-native assertions inside the existing Vitest runner after the first Playwright visual layer is stable | Useful for narrow browser-behavior tests, but it is not the fastest path to screenshot regression reduction. The milestone should land Playwright snapshots first. |
| Tiny Playwright Electron smoke suite | If titlebar, frameless-window, or draggable-region bugs keep escaping browser-only screenshots | Browser snapshots do not prove real Electron shell behavior. Playwright does support Electron automation, but that support is still experimental, so keep this suite minimal and shell-only. |
| Local brand-font asset pipeline | If the redesign introduces one or two custom brand fonts that materially change the launcher identity | Worth doing only when typography is part of the approved redesign direction. Use local WOFF2 assets and tokenized font variables, not hosted font loaders. |

## What Not To Add

| Avoid | Why | Use instead |
| --- | --- | --- |
| Radix, MUI, Chakra, shadcn, or another component-kit rollout | The launcher does not have a widget shortage. The current problems are brand inconsistency, shell metrics, and fallback behavior. | Strengthen existing FMCL primitives and Tailwind tokens. |
| Redux, Zustand, XState, RxJS, or another global state migration | The milestone is not blocked by missing state technology. Most failures are surface contracts and inconsistent UI interpretation. | Keep the existing hooks/context approach and tighten the specific seams that lie to the user. |
| Storybook + Chromatic/Percy/Loki as the first visual-regression move | FMCL already owns a deterministic manual verification entry that mounts real launcher surfaces with fixture data. Replacing that with a component-lab workflow is unnecessary scope. | Snapshot the current `manual-verification.html` routes first. |
| A new i18n framework | The app only ships EN/RU and already has locale catalogs plus a translator. The real gap is missing-key discipline and format consistency. | Add locale-completeness and placeholder-leak checks. |
| A new theming library or CSS-in-JS layer | Tailwind v4 plus root CSS variables already cover dynamic theming. Another styling runtime adds migration cost without solving the milestone bugs. | Use Tailwind theme variables and the existing runtime settings context. |
| More effect libraries for backgrounds or motion | FMCL already has background and particle infrastructure. More visual libraries will increase variability and make screenshots harder to stabilize. | Keep motion CSS-first and make backgrounds deterministic under verification. |

## Integration Points

### 1. Brand Tokens

- Use Tailwind v4 theme variables in `src/index.css` for stable launcher-wide tokens: font family, radius, shadows, spacing, shell heights, and scrim strengths.
- Keep `src/contexts/settings/theme.ts` as the runtime override seam for user-controlled theme, accent, and background selections.
- Extend `src/contexts/settings/types.ts` and `theme-presets.ts` only where the redesign needs semantic tokens, not one-off style booleans.

### 2. Shell And Surface Contracts

- `src/components/TitleBar.tsx` and `src/components/AppLayout.tsx` should consume shared shell metrics instead of hardcoded heights and implicit padding assumptions.
- Modal, detail-footer, and overlay surfaces should share one elevation and scrim policy so `R1`, `R2`, and `R5` class bugs stop recurring under different skins.

### 3. Fallback And Error States

- Keep `src/components/ui/LazyImage.tsx` as the image-loading seam, but move fallback-art policy into a broader branded surface-state layer.
- Replace the current crash presentation in `src/components/ErrorBoundary.tsx` with a product-facing fatal state that can still expose diagnostic details behind an explicit reveal or copy action.
- Grow `src/app/assets/branding.ts` from two asset paths into a small, stable brand-asset contract for hero marks, missing-cover states, and fatal/empty illustrations.

### 4. Screenshot Regression Reduction

- Add Playwright visual tests against `manual-verification.html?view=...`, not against ad-hoc pages.
- Cover milestone-owned views at a small fixed matrix: default desktop, narrower desktop, light/dark where relevant, EN/RU where relevant.
- Use deterministic fixtures from `src/verification/manual/*` and freeze or mask volatile regions during captures instead of loosening expectations broadly.

### 5. Quality Gates

- Add a repo-owned check that fails on unresolved `${...}` placeholders, raw locale keys rendered in the DOM, and locale key drift between `en.json` and `ru.json`.
- Keep these checks inside the existing `npm test` / `npm run lint` / `npx tsc --noEmit` gate rather than inventing another CI lane just for the milestone.

## Rationale By Current Evidence

| Current evidence | Stack implication |
| --- | --- |
| `new_screens/BUG_REPORT_2026-04-17.md` shows titlebar overlap, footer overlap, weak overlay isolation, inconsistent accent states, and a fatal React stack screen | FMCL needs shell/layout tokens plus shared fallback/error-state primitives before redesign work starts landing screen by screen. |
| `src/index.css` and `src/contexts/settings/theme.ts` currently define only a narrow color system and still hardcode typography choices | The redesign needs a first-class brand token layer, not more ad-hoc utility strings. |
| `src/components/ErrorBoundary.tsx` still renders raw stack traces into the user-facing crash screen | Error-state quality is a stack concern now, not only a copy/style concern. |
| `src/components/ui/LazyImage.tsx` and `src/app/assets/branding.ts` already provide the beginnings of a fallback pipeline | The milestone should standardize and extend these seams instead of introducing another image/fallback library. |
| `manual-verification.html` and `src/verification/manual/*` already mount deterministic fixtures for milestone walkthroughs | The right screenshot-regression move is to automate the existing seam, not replace it. |
| `src/contexts/settings/i18n.ts` falls back to raw keys, and the bug report shows unresolved `${file.jarVersion}` and mixed locale output | Add repo-level leakage guards rather than migrating to a new translation system. |

## External References

- Tailwind CSS theme variables: Tailwind v4 already treats theme variables as design-token inputs and exposes namespaces for color, font, spacing, radius, shadow, blur, and more. That fits FMCL’s need for a branded token layer without leaving Tailwind.
- Playwright visual comparisons: Playwright Test supports committed screenshot baselines via `expect(page).toHaveScreenshot()` and allows diff thresholds and style masking. That matches FMCL’s need to automate the existing browser-backed verification seam.
- Playwright Electron automation: official Electron automation exists but is experimental, so use it only for a tiny shell-smoke layer if browser snapshots still miss real frameless-window regressions.
- Vitest Browser Mode: current Vitest supports browser providers, including Playwright, but this is better treated as a later refinement than the first screenshot-regression investment.

## Recommended Scope Boundary

Do in `v0.5.0`:

- formalize brand and shell tokens inside the current Tailwind/runtime theme stack
- unify fallback/error-state rendering
- add screenshot baselines on top of the existing manual verification seam
- add locale/placeholder leakage guards

Do not do in `v0.5.0`:

- swap UI frameworks
- rebuild the app around a new state or theming library
- build a full component-lab platform
- turn visual regression into a broad cross-browser matrix project

## Sources

### Local evidence

- `.planning/PROJECT.md`
- `docs/KNOWN_ISSUES.md`
- `new_screens/BUG_REPORT_2026-04-17.md`
- `package.json`
- `manual-verification.html`
- `src/index.css`
- `src/App.tsx`
- `src/components/AppLayout.tsx`
- `src/components/TitleBar.tsx`
- `src/components/ErrorBoundary.tsx`
- `src/components/ui/LazyImage.tsx`
- `src/components/layout/BackgroundLayer.tsx`
- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/contexts/settings/i18n.ts`
- `src/verification/manual/ManualVerificationApp.tsx`
- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`
- `shared/contracts/launcher.ts`
- `src/features/launcher/hooks/useLauncherIPC.ts`
- `src/features/launcher/services/launcherService.ts`

### External references

- https://tailwindcss.com/docs/theme
- https://playwright.dev/docs/next/test-snapshots
- https://playwright.dev/docs/api/class-electron
- https://vitest.dev/guide/browser/

---
*Research completed: 2026-04-17*  
*Ready for milestone planning: yes*
