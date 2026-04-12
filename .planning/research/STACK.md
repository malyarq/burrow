# Stack Research

**Domain:** Brownfield Electron Minecraft launcher nearing stable release  
**Project:** FriendLauncher (FMCL)  
**Researched:** 2026-04-12  
**Overall confidence:** HIGH for keep/add/avoid decisions, MEDIUM for optional packages around skin providers and property-based testing

## Brownfield Direction

FMCL should stay on its current platform:

- Electron main process for privileged work
- React renderer for UI
- TypeScript strict mode across `electron/`, `src/`, and `shared/`
- Vite for bundling
- TailwindCSS for styling
- XMCL packages for Minecraft/runtime concerns

This release cycle should optimize for stability, security, tests, accessibility, and finishing roadmap gaps. It should not introduce a second app architecture, a second persistence model, or a major UI/state-management rewrite.

## Keep

| Stack | Current line | Keep? | Why | Confidence |
|---|---:|---|---|---|
| `electron` | `40.0.x` | Yes | Already aligned with current security guidance if the app enables sandboxing and keeps isolation on. Stable enough for release hardening without a platform migration. | High |
| `react` + `react-dom` | `19.2.x` | Yes | Current renderer already runs on React 19. Release work is about correctness, a11y, and tests, not framework churn. | High |
| `typescript` | `5.9.x` | Yes | Strict TS is already a project rule. The remaining work benefits more from runtime validation at IPC boundaries than from changing compiler tooling. | High |
| `vite` | `7.3.x` | Yes | Best fit for the existing renderer build and for adopting Vitest with shared config. | High |
| `tailwindcss` | `4.1.x` | Yes | Styling system is already CSS-variable driven. Remaining work is accessibility and consistency, not CSS framework replacement. | High |
| `electron-builder` | `26.4.x` | Yes | Existing packaging path is good enough; hardening should happen around build hooks and security settings, not around replacing the packager. | High |
| `undici` | `6.19.x` | Yes | Good base for download, mirror, skin-provider, and metadata HTTP calls. Avoids adding multiple HTTP stacks. | High |
| XMCL packages | mixed current majors | Yes | FMCL is already deeply invested in XMCL for install/launch/runtime behavior. Replacing it late in the cycle would be pure risk. | High |
| `hyperswarm` + `b4a` + `pump` | current | Yes | Core FriendTunnel differentiator already depends on this stack. Hardening should focus on tests and operational safety, not transport replacement. | Medium |

## Add Now

These additions are justified by release gaps already called out in `.planning/PROJECT.md`, `docs/ru/roadmap.md`, and `docs/KNOWN_ISSUES.md`.

| Package / tool | Suggested line | Scope | Why now | Confidence |
|---|---:|---|---|---|
| `vitest` | `4.0.x` | Dev | Best fit with Vite 7. Shared config and fast feedback are more valuable here than a separate Jest stack. | High |
| `@vitest/coverage-v8` | `4.0.x` | Dev | Use V8 coverage first; it is simpler than Istanbul for this codebase and sufficient for release gating. | High |
| `jsdom` | `27.2.x` | Dev | Default DOM environment for renderer tests. Prefer fidelity over raw speed for a release-hardening cycle. Use this line when local/CI Node is `20.19+`; otherwise pin `26.1.x`. | Medium |
| `@testing-library/react` | `16.3.x` | Dev | Current React-compatible renderer testing layer. Use for components, hooks, dialogs, and keyboard-driven flows. | High |
| `@testing-library/dom` | `10.x` | Dev | Required peer for modern React Testing Library. Install explicitly. | High |
| `@testing-library/user-event` | `14.6.x` | Dev | Needed for realistic keyboard and pointer interaction tests. Important for accessibility regressions. | High |
| `@testing-library/jest-dom` | `6.9.x` | Dev | Stronger readable DOM assertions in Vitest. | High |
| `@playwright/test` | `1.57.x` | Dev | Use for Electron smoke flows and packaged-window checks that Vitest should not own. | High |
| `@axe-core/playwright` | `4.11.x` | Dev | Adds automated a11y scanning to Playwright smoke tests. Use as a supplement, not as the only a11y gate. | High |
| `eslint-plugin-jsx-a11y` | `6.10.x` | Dev | Static accessibility linting closes a current blind spot in the renderer. | High |
| `eslint-plugin-testing-library` | `7.13.x` | Dev | Keeps new tests from falling into implementation-detail patterns. This line expects modern Node 20 (`20.9+`). | High |
| `zod` | `4.x` | Runtime + Dev | Best low-friction choice for validating IPC payloads, imported metadata, settings files, and export/import boundaries. | High |
| `@electron/fuses` | `2.0.x` | Build | Hardens packaged builds without changing app architecture. | Medium |

## Add Only If Needed

| Package / tool | Suggested line | Use only when | Why it is optional | Confidence |
|---|---:|---|---|---|
| `msw` | `2.12.x` | Renderer tests become network-heavy or flaky | Useful for browser-like request mocking, but not mandatory for the first wave of service and IPC tests. | Medium |
| `fast-check` | `4.x` | Share-code, export/import, or mirror ordering code needs deeper invariant testing | Valuable for round-trip and parser hardening, but not required to establish the baseline suite. | Medium |

## Testing Stack

### Recommended test layers

1. `Vitest` with multiple projects.
   - `node` environment for Electron services and pure shared utilities
   - `jsdom` environment for renderer hooks/components
   - separate project or file globs for IPC wrapper tests
2. `React Testing Library` + `user-event`.
   - prefer queries by role and accessible name
   - use `data-testid` only for virtualized or purely decorative cases
3. `Playwright`.
   - one small suite for release smoke flows
   - launch the packaged Electron app or dev app and exercise the top user journeys
4. Keep the existing `scripts/test-full.js` harness.
   - do not remove it
   - move it into a slower smoke/nightly lane rather than making it the main PR test framework

### What to cover first

- `electron/services/modpacks/modpackService.ts`
- `electron/services/content/contentManager.ts`
- `electron/services/sharing/shareService.ts`
- export/import round-trips
- mirror ordering/failure handling
- renderer flows around accounts, share modal, settings tabs, and modpack list actions

### Why this stack

Vitest explicitly reuses Vite config and supports React/component testing, DOM environments, and V8 coverage. That matches FMCL better than bolting Jest onto an ESM-first Vite repo. Playwright remains the right boundary for Electron window smoke tests and a11y scans.

## Accessibility Tooling And Patterns

### Tooling

- Add `eslint-plugin-jsx-a11y` for static JSX checks
- Add `eslint-plugin-testing-library` for test hygiene
- Use `React Testing Library` assertions by role/name
- Use `Playwright` + `@axe-core/playwright` on a short list of critical screens

### Required patterns

- Prefer native controls over `div`/`span` click targets
- Use semantic headings, lists, buttons, dialogs, and form labels first; use ARIA only to fill real semantic gaps
- Keep visible focus states for both themes
- Support keyboard-only flows end-to-end for:
  - launch screen
  - modpack list cards
  - settings tabs
  - account dialogs
  - share/import/export dialogs
- Respect `prefers-reduced-motion`; do not require animations for orientation or success state
- Use `aria-live` / `aria-busy` for long-running launcher operations and downloads
- For virtualized lists, keep tab order stable and expose item counts/status in nearby copy

### Brownfield note

Do not try to “solve accessibility” by replacing the current component library. Fix the existing components and interaction patterns in place.

## Electron Security Posture

### Required hardening

- Change both BrowserWindows from `sandbox: false` to sandboxed renderers after validating preload compatibility.
- Keep:
  - `contextIsolation: true`
  - `nodeIntegration: false`
  - `nodeIntegrationInWorker: false`
  - `nodeIntegrationInSubFrames: false`
  - `webSecurity: true`
  - `allowRunningInsecureContent: false`
  - `webviewTag: false`
- Add a real Content Security Policy for packaged renderer HTML.
- Remove runtime remote font loading from `index.html`; package fonts locally instead of depending on Google Fonts in production.
- Validate IPC payloads with `zod` in the main-process handler boundary, not only in renderer types.
- Validate IPC senders and restrict `shell.openExternal` to an explicit allowlist or safe URL predicate.
- Add `@electron/fuses` in packaging to at least:
  - disable `ELECTRON_RUN_AS_NODE`
  - enable cookie encryption

### Brownfield choices

- Do not introduce remote web content.
- Do not add a custom protocol just to satisfy a best-practice checklist in this cycle.
  - Electron’s security docs prefer more hardened loading models.
  - For FMCL’s release cycle, keeping the local packaged renderer and removing remote script/style dependencies is lower risk than a protocol migration.

## Image Caching And Storage

### Recommended approach

Reuse the existing main-process filesystem model.

- Keep `ContentManager` as the base storage primitive.
- Add a dedicated image-cache layer on disk instead of relying on renderer/browser cache.
- Store:
  - raw bytes
  - URL hash key
  - MIME type
  - ETag / Last-Modified
  - source URL
  - fetch timestamp / expiry
- Use stale-while-revalidate semantics for modpack icons, previews, and account avatars.
- Resolve cache access in the main process and expose it through IPC; keep `LazyImage` renderer-only and presentation-only.

### Deliberate non-additions

- Do **not** add SQLite, IndexedDB, or Dexie for image metadata in this release.
- Do **not** add `sharp` just to cache icons/previews.
  - FMCL mostly needs persistence and fallback, not an image-processing pipeline.
  - Native image-processing dependencies complicate Electron packaging and CI.

## Skin-Service Integrations

### Recommended integration model

Use a small adapter layer over `undici`, not provider-specific SDKs.

Recommended provider model:

- existing local permissive Yggdrasil-compatible server for offline/cracked mode
- generic Yggdrasil-compatible providers
- explicit custom provider config stored in main-process-managed settings

### Brownfield guidance

- Keep account and skin/provider state owned by the main process.
- Validate provider URLs and uploaded files in the main process.
- Cache avatars and skin metadata through the same disk-cache strategy as images.
- Treat head/avatar rendering services as optional fallbacks, not as account truth sources.

### What not to use

- No embedded webviews for provider login or skin browsing
- No scraping-based integrations
- No random third-party SDKs unless a provider forces it and there is no small HTTP alternative

Confidence here is medium because the exact provider set can still change, but the adapter-first approach is the right release-safe default.

## Mirror And Fallback Strategy

### Keep and extend the current model

FMCL already has the right foundations:

- per-origin scoring
- candidate ordering
- retries
- blacklist/fallback behavior
- ETag/HEAD probing

Recommended completion work:

- persist recent health snapshots with TTL so mirror selection is not cold on every boot
- separate:
  - user-pinned mirror preference
  - auto-selected best mirror
  - official last-resort fallback
- add temporary circuit-breaker behavior after consecutive failures
- record mirror failure reason categories:
  - timeout
  - HTML challenge
  - checksum mismatch
  - empty/truncated file
  - TLS / DNS error
- expose these diagnostics in logs and optional stats export

### Deliberate non-additions

- Do **not** add a dedicated resilience framework just for mirror retries
- Do **not** add another HTTP client
- Do **not** move mirror logic into renderer state

## Statistics And Export Patterns

### Recommended pattern

Keep JSON as the canonical store for this release, but formalize it.

- Add `schemaVersion`
- keep global and per-instance aggregates
- write through an atomic helper: temp file then rename
- validate on read with `zod`
- gracefully recover from corrupted files by keeping last-known-good or resetting with backup

Recommended export formats:

- JSON for lossless export/import
- CSV for human-readable summaries

Recommended fields:

- app version
- export timestamp
- total launches
- total play time
- per-instance launches/play time/last played
- mirror health summary if user explicitly opts in

### Privacy and scope

- Exports must be explicit user actions
- Never export tokens, auth headers, IP addresses, full filesystem paths, or raw account credentials
- Do not add a telemetry backend or analytics DB for this milestone

### Deliberate non-additions

- Do **not** add `electron-store` just for statistics
- Do **not** add SQLite / DuckDB for launcher stats in this cycle
- Do **not** add spreadsheet-export libraries; JSON + CSV are enough

## What Not To Use

| Avoid | Why | Use instead |
|---|---|---|
| `jest` | Adds a second testing worldview to a Vite-first ESM repo and gives little benefit over Vitest here. | `vitest` |
| `cypress` or deprecated Electron-only test tooling like `spectron` | Wrong abstraction for FMCL’s Electron smoke needs, or outright outdated. | `@playwright/test` |
| `electron-store` as a new general persistence layer | Would create a third persistence style alongside `localStorage` and main-process JSON files. | existing filesystem model + shared atomic write helper |
| `sharp` for routine icon caching | Native dependency cost is not justified by the current roadmap gaps. | raw-byte cache + CSS scaling |
| remote web content, relaxed `shell.openExternal`, or `webview`-based integrations | Security exposure is not worth it for a stable-release launcher. | local renderer bundle + typed IPC + allowlisted external links |
| React Router / Redux / TanStack Query rewrites | Scope explosion with little release payoff. | existing Context + targeted service/hook cleanup |

## Version Compatibility Notes

| Area | Recommendation | Note |
|---|---|---|
| Node in CI | Keep Node `20`, but document `20.19+` as the local baseline if using `jsdom 27.2.x` | GitHub Actions `node-version: 20` will resolve to a current 20.x release, but local developer docs should be explicit. |
| React test stack | `@testing-library/react 16.3.x` | Current release line supports React 19. |
| Vitest + Vite | `vitest 4.0.x` with `vite 7.3.x` | Current Vitest 4 line is the right pairing for the repo’s Vite version. |
| DOM environment | prefer `jsdom 27.2.x` on Node `20.19+`; otherwise pin `26.1.x` | Use `happy-dom` only if CI speed becomes a real bottleneck and test fidelity stays acceptable. |
| Electron packaging hardening | `@electron/fuses 2.0.x` | Add as a build step, not a runtime dependency. |

## Recommended Adoption Order

1. Add `vitest`, `@vitest/coverage-v8`, `jsdom`, and Testing Library packages.
2. Add `eslint-plugin-jsx-a11y` and `eslint-plugin-testing-library`.
3. Add `@playwright/test` and `@axe-core/playwright` for release smoke coverage.
4. Add `zod` at IPC, import/export, and persisted-file boundaries.
5. Enable Electron sandboxing and CSP, then add `@electron/fuses`.
6. Extend the existing filesystem model for image cache, mirror health persistence, and atomic statistics writes.

## Sources

- Repo inspection:
  - `.planning/PROJECT.md`
  - `.planning/codebase/STACK.md`
  - `.planning/codebase/ARCHITECTURE.md`
  - `docs/ru/roadmap.md`
  - `docs/KNOWN_ISSUES.md`
  - `package.json`
  - `.github/workflows/ci.yml`
  - `electron/window/windowManager.ts`
  - `electron/services/content/contentManager.ts`
  - `electron/services/mirrors/mirrorsService.ts`
  - `electron/services/stats/statisticsService.ts`
  - `src/components/ui/LazyImage.tsx`
  - `electron/auth/server.ts`
- Official docs and primary sources:
  - Vitest features: https://vitest.dev/guide/features
  - React Testing Library intro: https://testing-library.com/docs/react-testing-library/intro/
  - Playwright accessibility testing: https://playwright.dev/docs/accessibility-testing
  - Electron security tutorial: https://www.electronjs.org/docs/latest/tutorial/security
  - Electron sandbox tutorial: https://www.electronjs.org/docs/latest/tutorial/sandbox
  - Zod docs / repo: https://zod.dev and https://github.com/colinhacks/zod
  - `@electron/fuses` package: https://www.npmjs.com/package/@electron/fuses
  - package release pages used for current major/minor lines:
    - Vitest releases
    - React Testing Library releases
    - Playwright releases
    - `@axe-core/playwright` / axe-core-npm releases
    - `eslint-plugin-jsx-a11y` releases
    - `eslint-plugin-testing-library` repo and release metadata

---
*Stack research for FMCL stable-release hardening. Preserve the current platform; add only targeted tooling that reduces release risk.*
