# Project Research: Stack

**Project:** FriendLauncher (FMCL)  
**Milestone:** `v0.4.0 Launcher Truth And Product Polish`  
**Researched:** 2026-04-14  
**Confidence:** HIGH

## Question

What stack additions or changes are actually needed to fix screenshot-backed UI truth defects in FMCL around localization, adaptive overflow, fallback imagery, and runtime-status consistency without expanding beyond the existing Electron + React + TypeScript + TailwindCSS + Vite architecture?

## Conclusion

FMCL does not need new core frontend or runtime libraries for `v0.4.0`.

The current Electron + React + TypeScript + TailwindCSS + Vite stack is already sufficient for the audited defects. The gap is not missing platform capability. The gap is that a few existing seams are still too weak or too inconsistent:

- locale lookup falls back to raw keys, so untranslated labels leak visibly
- overflow behavior is still surface-local in a few dense controls
- fallback imagery exists, but is not applied with one product policy across launcher and modpack surfaces
- launcher truth is still derived from a mix of generic progress events and log parsing, which makes status, percent, and CTA state drift apart

For this milestone, the stack recommendation is therefore:

- keep the current runtime stack unchanged
- add no new npm runtime dependencies
- add at most small repo-local guards or shared primitives where the current seams are too weak

## Recommended Stack

### Core Technologies To Keep

| Technology | Current version | Role in `v0.4.0` | Recommendation |
| --- | --- | --- | --- |
| Electron | `^40.0.0` | desktop shell, preload, IPC | Keep. This milestone is about shipped UI truth, not shell replacement. |
| React | `^19.2.3` | renderer UI and stateful surfaces | Keep. The affected defects are already inside existing React seams. |
| TypeScript | `^5.9.3` | typed UI and IPC contracts | Keep. Strong typing is the cheapest way to tighten launcher truth and locale-safe copy. |
| TailwindCSS | `^4.1.18` | layout, density, theme tokens, overflow behavior | Keep. It already covers the adaptive and fallback work needed here. |
| Vite | `^7.3.1` | build/dev/manual verification entry | Keep. The manual verification seam already runs on it. |

### Existing Supporting Pieces That Are Already Sufficient

| Existing piece | Current use | Why it is sufficient |
| --- | --- | --- |
| `src/contexts/settings/i18n.ts` + `src/locales/en.json` / `ru.json` | EN/RU translation lookup | Sufficient for a two-locale launcher. The defect is missing-key discipline, not missing i18n infrastructure. |
| `src/components/ui/LazyImage.tsx` + cache IPC | remote image loading, fallback image path, cached local URLs | Sufficient for fallback imagery. The defect is inconsistent product usage, not missing image tooling. |
| `shared/contracts/launcher.ts` + `src/features/launcher/*` | typed launcher progress and UI state | Sufficient if the shared payload gets richer and becomes the main truth source. |
| `vitest` + `@testing-library/react` | route and seam regression coverage | Sufficient for localization, overflow, fallback-art, and status-sync regressions. |
| `src/verification/manual/*` | browser-backed walkthrough and screenshot proof | Already the right verification seam for screenshot-audited polish. |

## Minimal Additions Or Changes

### 1. Localization Truth

**Recommendation**

- Keep the current JSON-based translator and EN/RU locale files.
- Add one repo-local locale completeness guard:
  - either `scripts/check-locales.cjs`
  - or a focused Vitest contract
- Localize audited preset/status labels through the existing locale files, or explicitly document them as intentional product names if they must stay English.

**Why**

- `createTranslator()` currently returns the key itself when a translation is missing.
- `settings.tab_storage` is already wired in `src/components/settings/settingsTabs.ts`, and raw-key leakage is a known shipped defect.
- `src/contexts/settings/theme-presets.ts` currently stores preset labels as hard-coded English names, which explains the audit finding around preset naming policy.

**What this does not require**

- no `i18next`
- no `react-intl`
- no `formatjs`
- no extraction or translation-platform runtime SDKs

The milestone only needs completeness and truth for two shipped locales, not a new internationalization platform.

### 2. Adaptive Overflow

**Recommendation**

- Fix dense overflow cases with the current Tailwind + browser stack first:
  - `min-w-0`
  - `flex-wrap`
  - grid/minmax layouts
  - `clamp()` sizing where needed
  - content-priority hiding or “More” grouping for secondary actions
- If the audited tab/filter rows still need behavior beyond CSS, add one small in-repo overflow primitive, not a dependency.

**Why**

- `src/components/modpacks/details/ModpackDetailsHeader.tsx` currently relies on `overflow-x-auto` for the tab strip, which matches the audit failure directly.
- That is a local layout-policy problem, not evidence that FMCL needs a component framework or overflow library.

**What this does not require**

- no Radix UI
- no Headless UI
- no MUI / Chakra / shadcn
- no layout manager or split-pane library

If one shared primitive is needed, it should be an internal FMCL component owned inside `src/components/ui/`.

### 3. Fallback Imagery

**Recommendation**

- Reuse `src/components/ui/LazyImage.tsx`, the existing cache IPC bridge, and bundled branding assets.
- Add a small product-owned fallback asset policy for:
  - launcher hero / instance artwork
  - modpack cover missing-state
  - compact thumbnail variants where a full hero asset is inappropriate

**Why**

- `LazyImage` already supports `fallback`, bundled asset detection, and remote-image caching.
- The audit defect is about broken or empty states, not about missing image transport or rendering capability.

**What this does not require**

- no new image component library
- no skeleton-loader dependency just for cover art
- no external placeholder-image service
- no CDN rewrite

This should stay a local asset-and-component contract inside the current renderer.

### 4. Runtime-Status Consistency

**Recommendation**

- Evolve the existing launcher payload beyond the current generic `{ type, task, total }` model.
- Keep the solution inside the shared contract and launcher service seam.
- Prefer an explicit product-facing status model such as:
  - `stage`
  - `titleKey` or `detailKey`
  - `detailParams`
  - `progressPercent` or `current/total`
  - optional terminal flags such as `canForceRestart`

**Why**

- `shared/types/task.ts` and `shared/contracts/launcher.ts` only expose a very thin progress shape today.
- `src/features/launcher/services/launcherService.ts` and `useLauncherIPC.ts` still infer too much product truth from raw logs and generic task types.
- That explains how “done”, `0%`, and the CTA state can drift apart on the same screen.

**What this does not require**

- no `xstate`
- no `rxjs`
- no Redux-style migration
- no log-only state model as the long-term source of truth

This is a typed contract cleanup, not a state-management rewrite.

### 5. Verification Tooling

**Recommendation**

- Keep using `vitest` + `@testing-library/react` for deterministic UI truth coverage.
- Reuse `src/verification/manual/*` for screenshot-backed browser checks at the exact audited routes and window sizes.
- If capture ergonomics need improvement, add a thin repo-local Chromium/CDP helper script only.

**Suggested coverage additions**

- locale parity / no raw-key leakage for the audited settings and launch surfaces
- responsive overflow behavior for modpack details tabs and catalog filters
- fallback-art rendering when icon or launch artwork is missing
- stage/progress/CTA synchronization for launcher status
- preset-label policy coverage in RU

**What this does not require**

- no Playwright
- no Cypress
- no Percy
- no Chromatic
- no Storybook rollout

The repo already has a reusable manual verification seam because this launcher needs screenshot-backed truth checks, and that seam should be extended rather than replaced.

## Installation

No package installation is recommended for this milestone.

If extra enforcement is needed, prefer repo-local additions only:

- `scripts/check-locales.cjs`
- a focused Vitest locale-parity test
- an internal overflow primitive such as `ResponsiveTabs` or `OverflowActions`
- a richer shared launcher status type in `shared/contracts/launcher.ts`

## Alternatives Considered

| Recommended | Alternative | Why the alternative is not justified in `v0.4.0` |
| --- | --- | --- |
| Keep custom EN/RU translator + add parity guard | `i18next` / `react-intl` | The problem is missing-key enforcement, not pluralization, message formatting, or runtime locale loading. |
| CSS-first overflow fixes, optional internal primitive | external tab/menu framework | Too much dependency weight for a narrow set of audited overflow defects. |
| Richer shared launcher status contract | XState / RxJS | Overfits one status flow and expands scope into infrastructure instead of product truth. |
| Existing manual verification seam + focused Vitest tests | Playwright / visual regression platform | More harness than this bounded polish milestone needs, especially with an existing browser-backed seam already in place. |

## What Not To Add

| Avoid | Why | Use instead |
| --- | --- | --- |
| New UI framework or component kit | The audited issues are local truth and adaptivity defects, not missing widget inventory. | Existing React + Tailwind components, plus one small internal primitive if needed. |
| New i18n framework | Adds migration cost without solving the real failure mode: missing keys and inconsistent copy ownership. | Existing locale JSON files plus parity checks. |
| New state-management library for launcher status | Expands architecture for a single flow and delays the real fix. | Strengthen the typed launcher contract and normalizer. |
| Browser E2E or visual-regression platform | Too much new infrastructure for a milestone that already has a reusable screenshot-backed manual seam. | Existing manual verification entry and focused Vitest coverage. |
| Image/fallback dependency spree | The repo already has lazy loading, caching, and fallback hooks. | Standardize bundled placeholder assets and existing `LazyImage` usage. |

## Recommended Scope Boundary

Do in `v0.4.0`:

- strengthen truth inside the current renderer and IPC seams
- add small repo-local guards where truth currently leaks
- reuse the existing manual verification workflow for screenshot-backed proof

Do not do in `v0.4.0`:

- frontend stack migration
- design-system rollout
- locale-platform migration
- broad E2E infrastructure project
- feature expansion disguised as polish

## Local Evidence Used

- `package.json`
- `.planning/PROJECT.md`
- `docs/ru/ui-qa-audit-2026-04-14.md`
- `src/contexts/settings/i18n.ts`
- `src/components/settings/settingsTabs.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/components/ui/LazyImage.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `shared/types/task.ts`
- `shared/contracts/launcher.ts`
- `src/features/launcher/services/launcherService.ts`
- `src/features/launcher/hooks/useLauncher.ts`
- `src/features/launcher/hooks/useLauncherIPC.ts`
- `src/components/sidebar/__tests__/LaunchControls.status.test.tsx`
- `src/verification/manual/ManualVerificationApp.tsx`

---
*Research completed: 2026-04-14*  
*Ready for milestone planning: yes*
