# Architecture Research

**Domain:** FMCL `v0.5.0` redesign integration inside the current Electron + React launcher
**Researched:** `2026-04-17`
**Confidence:** `HIGH`

## Standard Architecture

### Current System Overview

```text
┌────────────────────────────────────────────────────────────────────┐
│                         Electron Main Process                      │
├────────────────────────────────────────────────────────────────────┤
│ BrowserWindow lifecycle                                            │
│ hidden native frame + custom title bar                             │
│ packaged asset resolution + preload exposure                       │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ preload + IPC
┌──────────────────────────────▼─────────────────────────────────────┐
│                         Shared Contracts                           │
├────────────────────────────────────────────────────────────────────┤
│ window controls · assets · modpacks · launcher · settings         │
│ only native / filesystem / cross-process seams belong here        │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ typed wrappers
┌──────────────────────────────▼─────────────────────────────────────┐
│                        Renderer Root (`src/`)                      │
├────────────────────────────────────────────────────────────────────┤
│ `main.tsx`                                                         │
│   → `AppProviders`                                                 │
│     → `SettingsProvider`                                           │
│     → `ModpackProvider`                                            │
│     → `ToastProvider` / `ConfirmProvider`                          │
│   → `App`                                                          │
│     → `AppLayout`                                                  │
│       → `BackgroundLayer`                                          │
│       → `TitleBar`                                                 │
│       → `Sidebar`                                                  │
│       → overlay pages (`SettingsPage`, `MultiplayerPage`)          │
│       → main content (`SimplePlayDashboard` / `ModpackRouter`)     │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ shared UI primitives
┌──────────────────────────────▼─────────────────────────────────────┐
│                    Design / Verification Surfaces                  │
├────────────────────────────────────────────────────────────────────┤
│ `index.css` surface classes + CSS vars                             │
│ `theme.ts` + `theme-presets.ts` document token application         │
│ `app/assets/branding.ts` asset fallback entrypoint                 │
│ `verification/manual/*` browser-backed proof harness               │
└────────────────────────────────────────────────────────────────────┘
```

### Architecture Baseline

| Area | Current owner | Why it matters for `v0.5.0` |
| --- | --- | --- |
| Shell composition | `src/App.tsx`, `src/components/AppLayout.tsx` | The redesign must land through the existing shell rather than bypassing it page by page. |
| Window chrome | `src/components/TitleBar.tsx`, `electron/window/windowManager.ts` | Screenshot bugs around top overlap come from the custom title-bar contract. |
| Theme and appearance state | `src/contexts/SettingsContext.tsx`, `src/contexts/settings/theme.ts`, `src/contexts/settings/theme-presets.ts`, `src/index.css` | FMCL already applies document-level tokens; this is the right leverage point for the brand reset. |
| Shared UI primitives | `src/components/ui/*`, `src/index.css` | Accent inconsistency, weak selected states, and overlay bleed are primitive problems, not page-only problems. |
| Brand assets and fallbacks | `src/app/assets/branding.ts`, `src/app/hooks/useAppIcon.ts`, `src/components/layout/EmptyStateView.tsx` | Brand reset fails if logos, empty states, and image fallbacks stay fragmented. |
| Modpack content shell | `src/components/modpacks/ModpackDetails.tsx`, `src/components/modpacks/details/*` | Several screenshot bugs sit at the boundary between shell actions and detail-page actions. |
| Verification seam | `src/verification/manual/*` | `v0.5.0` should extend the existing proof harness instead of inventing a new one. |

## Main Conclusions

- `v0.5.0` is primarily a renderer-shell milestone. Most work should stay in `src/`; `electron/` and `shared/` should only move when asset packaging or native window behavior truly requires it.
- The redesign should be driven by semantic design tokens and shell primitives first, not by screen-by-screen Tailwind overrides.
- The current architecture already has reusable seams worth preserving: `SettingsProvider` for appearance state, `index.css` surface classes, the custom `Modal`, shared form controls, and the manual verification harness.
- Several visible bugs are architectural mismatches, not isolated screen defects:
  - title bar / overlay offsets are hard-coded in multiple places
  - primary action ownership is split between `Sidebar` and detail pages
  - tab, segmented, and modal states are implemented ad hoc instead of through a single state-visibility contract
- Fatal-error presentation is also split today: `src/main.tsx` mounts a plain `ErrorBoundary`, while `src/App.tsx` mounts a translated `ErrorBoundaryWrapper`. `v0.5.0` should keep the safety but collapse the user-facing presentation into one branded fallback language.
- The redesign should not introduce a new router, state library, or Electron bridge. That would spend milestone budget on platform churn instead of product quality.

## Integration Points

### Redesign Pressure Map

| Product problem | Primary integration point | Type | Notes |
| --- | --- | --- | --- |
| Top content sliding under custom title bar | `AppLayout`, `TitleBar`, onboarding overlays, modal offsets, shared chrome metrics | Modified seam | Current code mixes `h-9`, `top-[32px]`, and page-local spacing. This should become one shell inset contract. |
| Footer / action bar overlapping page content | `ModpackDetails`, `ModpackDetailsActions`, modal footer layouts, shared action-bar primitive | Modified seam | Fix once at the layout contract level, not by adding extra bottom padding per screen. |
| Duplicate primary launch CTA | `Sidebar`, `ModpackRouter`, `ModpackDetailsActions` | Modified seam | `v0.5.0` should define one owner for the primary action on each route. |
| Inconsistent accent and selected states | `SettingsContext`, `theme.ts`, `theme-presets.ts`, `index.css`, `Button`, `Input`, `Select`, tab/segmented controls | Modified seam | This is the core brand-system integration point. |
| Weak modal isolation and background bleed | `Modal`, `UpdateModal`, `ShareModal`, create/add flows, overlay tokens | Modified seam | Overlay blur, dimming, z-order, and padding should come from one primitive contract. |
| Placeholder leakage and broken fallbacks | `branding.ts`, `useAppIcon`, `EmptyStateView`, `ErrorBoundary`, `LazyImage` fallback usage | Modified seam | Brand reset needs a single asset and fallback registry. |
| Settings tab clarity and shell consistency | `SettingsPage`, `SettingsTabsHeader`, `settingsTabs.ts` | Modified seam | The redesign should keep tab semantics but improve active-state legibility and hierarchy. |
| Modpack tab wrapping and dense secondary surfaces | `ModpackDetailsHeader`, `ModpackDetails*Tab`, `SecondaryContentTabs` tests | Modified seam | Current tests explicitly lock in wrapped tabs; that contract likely changes in `v0.5.0`. |
| Redesign proof and screenshot regression checks | `verification/manual/views.ts`, `verification/manual/scenarios.tsx` | Modified seam | Add `v0.5.0` scenarios here instead of building a new harness. |
| Additional packaged brand assets | `assetsIPC`, preload bridge, `shared/contracts/assets*` | Optional new contract | Only needed if renderer must request filesystem-resolved assets beyond the current icon path. |

### Internal Boundaries To Respect

| Boundary | Keep / change | Guidance |
| --- | --- | --- |
| `electron/` ↔ renderer | Keep narrow | Do not move theme, layout, or brand state into IPC just because the milestone is visual. |
| `shared/contracts/*` ↔ design system | Keep separate | Shared contracts should stay about native capability, not renderer styling. |
| `SettingsProvider` ↔ feature components | Keep and extend | Appearance, language, compact mode, and animation settings already live here; keep using that seam. |
| `AppLayout` ↔ feature routes | Extend carefully | Shell metrics, route-level action ownership, and overlay behavior belong here. |
| `verification/manual/*` ↔ live components | Keep | Continue mounting real components with fixture data. |

## Recommended Project Structure

The milestone should stay inside the existing directory model and only add a few focused seams where repetition already exists.

```text
src/
├── app/
│   ├── assets/
│   │   └── branding.ts                # expand into the single brand asset registry
│   └── providers.tsx                  # existing provider stack; keep
├── components/
│   ├── layout/
│   │   ├── BackgroundLayer.tsx        # existing ambient layer
│   │   ├── EmptyStateView.tsx         # shared fallback surface
│   │   └── AppChrome.tsx              # NEW only if title-bar/inset logic needs extraction
│   ├── settings/
│   │   └── SettingsTabsHeader.tsx     # shared secondary navigation
│   ├── ui/
│   │   ├── Button.tsx                 # existing CTA primitive
│   │   ├── Input.tsx / Select.tsx     # existing control primitives
│   │   ├── Modal.tsx                  # existing overlay primitive
│   │   ├── SegmentedControl.tsx       # NEW recommended primitive
│   │   ├── TabStrip.tsx               # NEW recommended primitive
│   │   └── ActionBar.tsx              # NEW recommended primitive
│   └── modpacks/details/              # consumers of shared tab/action primitives
├── contexts/
│   └── settings/
│       ├── theme.ts                   # keep as document-token writer
│       ├── theme-presets.ts           # keep as preset definitions
│       └── chrome.ts                  # NEW renderer-only shell metrics if constants grow
├── verification/
│   └── manual/
│       ├── views.ts                   # extend with v0.5 views
│       └── scenarios.tsx              # extend with shell/fallback/brand proofs
└── index.css                          # keep as semantic surface + token home
```

### Structure Rationale

- **Keep the redesign in `src/`:** the milestone is about product quality on existing surfaces, not about new native capabilities.
- **Add only renderer-local seams:** a small `chrome.ts`, `SegmentedControl`, `TabStrip`, or `ActionBar` is justified because the same problems repeat across pages.
- **Do not create a separate “new UI” subtree:** that would fork the app and slow roadmap execution. Rebuild existing primitives and consumers in place.
- **Treat `index.css` + `theme.ts` as the design-system kernel:** the current code already centralizes document CSS variables and surface classes there.

## New vs Modified Seams

### Modified Seams

| Seam | Current files | Why modify it |
| --- | --- | --- |
| Shell chrome and insets | `src/components/AppLayout.tsx`, `src/components/TitleBar.tsx`, onboarding overlays, `src/components/ui/Modal.tsx` | Needed to fix title-bar overlap, top safe-area drift, and overlay layering. |
| Theme token application | `src/contexts/SettingsContext.tsx`, `src/contexts/settings/theme.ts`, `src/contexts/settings/theme-presets.ts`, `src/index.css` | Best place to impose a stronger visual language without page-level duplication. |
| Shared controls | `src/components/ui/Button.tsx`, `Input.tsx`, `Select.tsx`, plus page-local segmented/tab controls | Needed to make selected, disabled, focus, and accent states consistent. |
| Brand and fallback surfaces | `src/app/assets/branding.ts`, `src/app/hooks/useAppIcon.ts`, `src/components/layout/EmptyStateView.tsx`, `src/components/ErrorBoundary.tsx`, `src/main.tsx`, `src/App.tsx` | Brand reset needs a single registry and one user-facing degraded-state language across empty, missing-media, and fatal-error surfaces. |
| Settings shell | `src/components/SettingsPage.tsx`, `src/components/settings/SettingsTabsHeader.tsx`, `src/components/settings/tabs/AppearanceTab.tsx` | The appearance editor is part of the milestone and already sits on a reusable shell. |
| Modpack detail shell | `src/components/modpacks/ModpackDetails.tsx`, `src/components/modpacks/details/ModpackDetailsHeader.tsx`, `ModpackDetailsActions.tsx` | Current route has layout overlap, wrapped tabs, and duplicate CTA ownership. |
| Manual verification | `src/verification/manual/*` | `v0.5.0` needs proof for chrome, brand fallbacks, error states, and redesigned core screens. |

### Recommended New Seams

| Seam | Scope | Why it is justified |
| --- | --- | --- |
| `chrome.ts` or CSS shell variables | Renderer only | Gives one source for title-bar height, content inset, overlay offset, and z-index layers. |
| `SegmentedControl` primitive | Renderer only | The same weak selected-state problem appears in theme mode, language, loader choice, and settings toggles. |
| `TabStrip` primitive | Renderer only | Modpack detail tabs and future secondary navigation should not each reinvent wrapping, overflow, and active states. |
| `ActionBar` primitive | Renderer only | Sticky/bottom action bars repeat across details and modal flows and need a shared spacing contract. |
| Expanded brand manifest | Renderer only, optional asset IPC | Centralizes logos, wordmarks, empty/error illustrations, and generic fallback imagery. |

### Seams That Should Not Be Added

- No new global state library.
- No new routing library.
- No “design IPC” bridge for theme or layout state.
- No parallel `src/redesign/` tree.

## Shared Primitives, Assets, and Contracts

### Shared Primitives To Normalize Early

| Primitive | Current source | `v0.5.0` expectation |
| --- | --- | --- |
| Shell inset / chrome height | scattered between `TitleBar`, overlay offsets, page padding | One renderer-local metric contract. |
| Surface hierarchy | `surface-panel`, `surface-card`, `surface-inline`, `surface-soft` in `src/index.css` | Fewer, stronger semantic tiers with clearer role mapping. |
| CTA states | `src/components/ui/Button.tsx` | One contract for primary, secondary, destructive, disabled, busy, and progress states. |
| Input / select field states | `src/components/ui/Input.tsx`, `Select.tsx` | Consistent contrast, focus, disabled, and error treatment under brand tokens. |
| Segmented / tab controls | page-local implementations in settings, modpacks, onboarding | Shared primitives with accessibility preserved and layout behavior explicit. |
| Modal / overlay frame | `src/components/ui/Modal.tsx` and feature modals | Shared backdrop opacity, blur, spacing, and focus-trap behavior. |
| Empty / error / missing-media states | `EmptyStateView`, `ErrorBoundary`, `LazyImage` fallbacks | Branded, non-irritating fallback system instead of literal one-off placeholders. |

### Brand Assets

Recommended asset set for the brand reset:

- app icon
- monochrome mark
- wordmark
- compact sidebar mark
- empty-state illustration
- generic missing-cover fallback
- graceful fatal-error illustration or badge

Guidance:

- Keep asset identifiers centralized in `src/app/assets/branding.ts`.
- Prefer bundled renderer assets first.
- Use the existing `assetsIPC.getIconPath()` pattern only for assets that truly need packaged native resolution.
- Do not scatter `'/icon.png'` and similar literals through feature components.

### Contracts

Default position for `v0.5.0`:

- **No new shared contracts are required for the redesign itself.**
- Theme selection, preset choice, brand tokens, compact mode, and visual fallback behavior should remain renderer-local in `SettingsProvider` and CSS variables.

Optional contract changes only if needed:

- extend assets contract if renderer needs multiple packaged asset paths, not just the app icon
- extend window-controls contract only if the redesign requires native window actions beyond `minimize` and `close`

If a contract must change, follow the existing FMCL path in one pass:

`shared/contracts/*` → preload bridge → `electron/ipc/*` handler → `src/services/ipc/*` wrapper → UI consumer → `docs/ru/contracts-map.md`

## Architectural Patterns For `v0.5.0`

### Pattern 1: Token-First Redesign

**What:** Change document tokens, surface classes, and shared control primitives before rewriting page markup.

**When to use:** Any issue that repeats across settings, dashboard, modpack flows, or modals.

**Trade-offs:** Slight upfront cost, but it avoids drift and reduces per-screen patch work.

### Pattern 2: Shell-Owned Layout Metrics

**What:** Define title-bar height, overlay offsets, and content insets once and consume them from shell/layout primitives.

**When to use:** Title-bar overlap, sticky header drift, modal frame positioning, footer/action-bar spacing.

**Trade-offs:** Requires touching a few cross-cutting files early, but removes a large class of screenshot regressions.

### Pattern 3: One Owner Per Primary Action

**What:** Each route must have a single owner for its primary CTA.

**When to use:** Especially on `modpack-details`, where `Sidebar` and `ModpackDetailsActions` currently compete.

**Trade-offs:** Requires an explicit shell decision, but it removes contradictory hierarchy and simplifies future tests.

**Recommended direction:** when a content page exposes a route-specific primary action bar, the shell CTA should be demoted or hidden contextually rather than duplicated.

### Pattern 4: Brand Fallback Registry

**What:** Resolve logos, placeholders, error imagery, and missing-media fallbacks through one branding module.

**When to use:** Title bar, empty states, screenshot placeholders, modpack cards, crash screens, onboarding.

**Trade-offs:** Slightly more centralization, but it prevents visual drift and “annoying default” regressions.

## Verification Implications

Current architecture already has useful regression nets:

- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx`
- `src/components/layout/__tests__/BackgroundLayer.motion.test.tsx`
- `src/components/settings/__tests__/AppearanceTab.presets.test.tsx`
- `src/verification/manual/*`

Important note for roadmap planning:

- `ModpackDetailsHeader.i18n.test.tsx` currently asserts wrapped tabs (`flex-wrap`) and explicitly rejects horizontal overflow. If `v0.5.0` changes tab behavior, this is an intentional contract update, not an incidental regression.
- `KNOWN_ISSUES.md` says the project has no tests, but the current renderer already contains targeted UI tests. The roadmap should build on them instead of assuming no safety net exists.
- The manual verification hub still labels itself as milestone `v0.4.0`; `v0.5.0` should update and extend that same harness.

## Recommended Build Order

1. **Define semantic tokens and chrome metrics first.**
   Files: `src/index.css`, `src/contexts/settings/theme.ts`, `src/contexts/settings/theme-presets.ts`, optional new `src/contexts/settings/chrome.ts`.
   Output: one source for shell spacing, surface tiers, accent usage, and contrast rules.

2. **Refactor shell chrome and overlay positioning.**
   Files: `src/components/AppLayout.tsx`, `src/components/TitleBar.tsx`, `src/components/ui/Modal.tsx`, onboarding overlay offsets.
   Output: no top overlap, stable z-order, and reusable inset rules before feature screens change.

3. **Centralize brand assets and fallback behavior.**
   Files: `src/app/assets/branding.ts`, `src/app/hooks/useAppIcon.ts`, `src/components/layout/EmptyStateView.tsx`, `src/components/ErrorBoundary.tsx`, image fallback consumers.
   Output: logo, fallback art, empty states, and crash state all draw from one registry.

4. **Normalize shared control primitives.**
   Files: `src/components/ui/Button.tsx`, `Input.tsx`, `Select.tsx`, new `SegmentedControl` / `TabStrip` / `ActionBar` if needed.
   Output: selected, disabled, focused, and accent-driven states become coherent everywhere.

5. **Rebuild the shell-owned high-traffic screens on top of those primitives.**
   Files: `SettingsPage`, `AppearanceTab`, `SimplePlayDashboard`, `Sidebar`, `ModpackList`, `ModpackBrowser`, `ModpackDetails*`.
   Output: the launcher’s main flows share one visual and action hierarchy.

6. **Resolve route-specific ownership decisions before finishing detail pages.**
   Biggest case: `Sidebar` launch CTA vs `ModpackDetailsActions`.
   Output: one primary action owner per route and no competing CTAs.

7. **Finish secondary flows and technical fallback cleanup.**
   Files: create/import/export/add-mod/share/screenshots/utilities plus error/empty states.
   Output: the redesign does not collapse into legacy-looking secondary surfaces.

8. **Extend verification and close the milestone through the existing proof seam.**
   Files: `src/verification/manual/views.ts`, `src/verification/manual/scenarios.tsx`, related tests, roadmap/docs updates.
   Output: browser-backed evidence for the redesign without a parallel verification toolchain.

## Anti-Patterns To Avoid

### Anti-Pattern 1: Per-Screen Safe-Area Patches

**What people do:** add one-off top margins, `pt-*`, or route-local offsets to dodge the custom title bar.

**Why it is wrong:** it guarantees future overlap drift across onboarding, modpacks, settings, and dialogs.

**Do this instead:** define one shell inset contract and consume it everywhere.

### Anti-Pattern 2: Visual State Stored in IPC

**What people do:** push theme, brand, or layout state into Electron/shared contracts because it feels “global.”

**Why it is wrong:** it bloats cross-process seams for renderer-only concerns and slows iteration.

**Do this instead:** keep visual state in `SettingsProvider` and document CSS variables unless native packaging truly demands otherwise.

### Anti-Pattern 3: Screen-Specific Brand Fallbacks

**What people do:** hardcode different fallback images or copy in every component.

**Why it is wrong:** brand reset immediately fragments and low-trust defaults come back.

**Do this instead:** resolve all brand assets and degraded states through one registry.

### Anti-Pattern 4: Locking Old Layout Decisions Into Tests

**What people do:** preserve incidental class-level behavior like wrapped tabs just because tests currently assert it.

**Why it is wrong:** `v0.5.0` is intentionally changing some of those contracts.

**Do this instead:** keep accessibility, translation, and interaction guarantees, but update layout assertions where the product decision changes.

## Roadmap Guidance

For downstream roadmap creation, the milestone should be framed as four bounded architecture tracks:

1. **Shell and chrome foundation**
   Title bar, insets, overlays, z-order, action ownership.

2. **Design token and primitive foundation**
   Theme tokens, surface hierarchy, CTA/control states, tabs and segmented controls.

3. **Brand and fallback foundation**
   Logos, wordmarks, empty/error/missing-media states, asset registry.

4. **Feature-surface migration and proof**
   Settings, dashboard, modpack surfaces, then secondary flows, with manual verification updates.

This keeps `v0.5.0` inside the existing Electron + React architecture while still allowing a meaningful redesign and brand reset.

## Sources

- `.planning/PROJECT.md`
- `AGENTS.md`
- `electron/AGENTS.md`
- `src/AGENTS.md`
- `shared/AGENTS.md`
- `docs/KNOWN_ISSUES.md`
- `new_screens/BUG_REPORT_2026-04-17.md`
- `src/main.tsx`
- `src/app/providers.tsx`
- `src/App.tsx`
- `src/components/AppLayout.tsx`
- `src/components/TitleBar.tsx`
- `src/components/Sidebar.tsx`
- `src/components/SettingsPage.tsx`
- `src/components/modpacks/ModpackDetails.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/modpacks/details/ModpackDetailsActions.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/layout/BackgroundLayer.tsx`
- `src/components/layout/EmptyStateView.tsx`
- `src/components/ErrorBoundary.tsx`
- `src/contexts/SettingsContext.tsx`
- `src/contexts/settings/theme.ts`
- `src/contexts/settings/theme-presets.ts`
- `src/index.css`
- `src/app/assets/branding.ts`
- `src/app/hooks/useAppIcon.ts`
- `electron/window/windowManager.ts`
- `shared/contracts/settings.ts`
- `shared/contracts/windowApi.ts`
- `src/services/ipc/windowControlsIPC.ts`
- `src/services/ipc/assetsIPC.ts`
- `src/verification/manual/ManualVerificationApp.tsx`
- `src/verification/manual/views.ts`
- `src/verification/manual/scenarios.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/components/settings/__tests__/ThemeSurfaceContrast.test.tsx`
- `src/components/modpacks/__tests__/ModpackDetailsHeader.i18n.test.tsx`

---
*Architecture research for FMCL milestone `v0.5.0`*
