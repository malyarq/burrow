# Phase 32 Research: Shell Identity And Sidebar Cohesion

## What The Planner Needs To Know

Phase 32 is not a fresh shell redesign and not a continuation of the earlier brand-reset wave. It is a correction phase driven directly by `docs/ru/product-feedback-2026-04-20.md`, and the planning packet should treat that feedback as stricter than the older v0.5.0 and v0.6.0 shell assumptions.

The phase boundary is narrow but concrete:

1. remove the redundant sidebar logo block, clipped launcher title, and visibly off-center compact-mode controls;
2. make the macOS shell contract feel fully native in real window runs instead of mixing native traffic lights with renderer-owned identity or spacing drift;
3. keep launcher identity only where app identity is actually needed, while missing-art and empty/fallback surfaces stay calm and content-first;
4. refresh the manual proof harness so phase closeout cannot pass on stale shell-brand wording again.

The phase should explicitly avoid:

- reopening modpack update locality, catalog density, or details hierarchy work that belongs to later phases;
- another broad branding exploration or asset-system rewrite;
- settings geometry cleanup outside the small shell-owned proofs needed for Phase 32 verification;
- a new manual-verification subsystem instead of reusing `src/verification/manual/*`.

## Requirement Fit

### `SHELL-09`

This requirement is mostly owned by the sidebar renderer seam:

- `src/components/sidebar/SidebarHeader.tsx`
- `src/components/Sidebar.tsx`
- `src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx`

The current implementation still contradicts the feedback:

- the expanded header renders both `BrandMark` and `BrandWordmark` inside a square-ish branded block;
- the launcher title lives inside a `truncate` wordmark container, which explains the visible `Friend...` clipping complaint;
- collapsed mode relies on small glyph buttons and a separate expand button whose geometry is close, but not yet locked to the “centered and visually even” requirement.

Planning implication:

- treat the sidebar header as an orientation seam, not a brand-promo seam;
- assume the test contract must be rewritten, because the existing test still protects `sidebar-app-icon` rather than “no redundant logo block” or “readable title.”

Out of scope:

- search/filter density, card metadata, or sidebar action hierarchy outside the header strip itself.

### `SHELL-10`

This requirement is shared between Electron and the renderer shell:

- `electron/window/windowManager.ts`
- `electron/app/bootstrap.ts`
- `src/components/TitleBar.tsx`
- `src/components/AppLayout.tsx`
- `src/services/ipc/windowControlsIPC.ts`
- `electron/window/__tests__/windowManager.macos.test.ts`
- `src/components/__tests__/TitleBar.branding.test.tsx`
- `src/components/__tests__/UpdateNotification.layout.test.tsx`

The repo already moved toward a native-first macOS window in Phase 28, but the contract is still incomplete:

- `createMainWindow()` uses `frame: true` and `hiddenInset` on macOS, which is directionally correct;
- `TitleBar` renders only a drag strip on macOS, which is also correct;
- the native icon path on macOS still prefers `icon-macos.png` ahead of the canonical `/icon.ico` identity path used in the renderer asset system;
- earlier tests prove “minimal macOS strip” but do not yet prove the tighter feedback rule: no competing chrome, safe traffic-light clearance, and no platform-specific identity drift.

Planning implication:

- keep the main window native-first on macOS and verify the real shared top-edge contract rather than only DOM absence of buttons;
- audit native icon resolution and keep it aligned with the canonical launcher mark unless packaging constraints force an explicitly documented exception.

Out of scope:

- console-window redesign;
- Windows/Linux shell restyling beyond any cross-platform cleanup needed to keep the contract coherent.

### `BRAND-01`

This requirement spans the renderer asset policy, empty-state surfaces, and proof fixtures:

- `src/app/assets/branding.ts`
- `src/components/ui/ArtworkFallback.tsx`
- `src/components/ui/LazyImage.tsx`
- `src/components/layout/EmptyStateView.tsx`
- `src/components/modpacks/ModpackList.tsx`
- `src/components/modpacks/details/ModpackDetailsHeader.tsx`
- `src/components/ui/__tests__/ArtworkFallback.policy.test.tsx`
- `src/components/ui/__tests__/LazyImage.cache.test.tsx`
- `src/components/layout/__tests__/EmptyStateView.branding.test.tsx`
- `src/components/modpacks/__tests__/ModpackList.ergonomics.test.tsx`
- `src/components/modpacks/__tests__/ModpackBrowser.ergonomics.test.tsx`
- `src/verification/manual/scenarios.tsx`
- `src/verification/manual/views.ts`

Important current signals:

- `ArtworkFallback` already defaults to `media-fallback`, which is the right direction;
- the actual `MEDIA_FALLBACK_SVG` is still a distinct cube-like branded illustration, which matches the user complaint about “невнятную картинку из кубиков” instead of a calm placeholder;
- `EmptyStateView` is still a fully branded hero with a framed app icon, glow, and wordmark, which is too loud for a fallback surface;
- installed and local modpack surfaces still override missing art back to `app-icon`, so the repo currently exposes two conflicting fallback rules depending on which screen the user is on;
- current tests still defend the branded empty-state contract instead of the new restraint requirement.

Planning implication:

- keep the existing `app-icon`, `product-mark`, and `media-fallback` role split;
- change where and how those roles are used, especially on empty or missing-content surfaces;
- treat the manual proof fixtures as part of the product surface, because they currently continue to normalize the old branding posture.

Out of scope:

- broad content-tab redesign;
- new marketing or brand-token work.

## Historical Context

Phase 28 (`Product Restraint And Native Shell Truth`) moved the main window toward native-first macOS behavior and removed some louder shell-brand noise, but it did not finish the feedback closure:

- the sidebar header still protects a branded lockup contract;
- the macOS tests still stop short of the stricter Phase 32 icon and clearance questions;
- the fallback and empty-state tests still encode older brand-heavy assumptions;
- the manual verification hub still uses stale wording and readiness markers keyed to old shell-brand text.

The planner should therefore treat Phase 32 as a corrective follow-up to Phase 28, not as a duplicate. The new work is justified because the existing automated and manual-proof seams still defend the wrong product contract.

## Current Hotspots And Why They Matter

### SidebarHeader still encodes the exact complaint from the feedback file

`src/components/sidebar/SidebarHeader.tsx` currently renders:

- a framed `BrandMark`;
- a truncating `BrandWordmark`;
- compact-mode controls that are visually close but not explicitly locked to a centered, equal-geometry contract.

This matters because the bug is not theoretical. The user complained about:

- the separate square logo block;
- the clipped `Friend...` title;
- the burger not sitting centered in compact mode;
- the mode switch feeling less round than its container.

The current test seam only proves “the sidebar still shows an app icon and compact glyphs.” Phase 32 needs the test seam to flip toward readability and alignment.

### The macOS shell is mostly right architecturally, but still carries identity drift risk

`electron/window/windowManager.ts` and `src/components/TitleBar.tsx` no longer fight macOS with duplicate custom buttons, but the remaining risks are higher-level:

- the icon candidate order in `windowManager.ts` and `bootstrap.ts` still diverges from the renderer’s canonical `APP_ICON_PATH = '/icon.ico'`;
- the shell contract is proven mostly by narrow unit assertions rather than by a phase-owned manual-proof requirement;
- the app-level notification seam in `AppLayout.tsx` still depends on the title-bar strip ordering, so regressions here can quietly reintroduce unsafe top-edge spacing even if buttons remain hidden.

That means the planner should keep a dedicated shell/integration plan instead of assuming the macOS work is already done.

### Fallback policy is only half-aligned with the product direction

`ArtworkFallback` already prefers neutral fallback routing, which is good. The remaining mismatch is the content of the fallback surfaces:

- `MEDIA_FALLBACK_SVG` is calm compared with the launcher mark, but still too illustrative and branded for the new feedback;
- `EmptyStateView` remains a full branded hero surface;
- `ModpackList.tsx` and `ModpackDetailsHeader.tsx` currently force installed or local missing art back to `app-icon`, while remote browser surfaces already use the neutral fallback;
- tests such as `EmptyStateView.branding.test.tsx` currently prevent that contract from being simplified.

This is why `BRAND-01` needs its own execution slice instead of hiding inside sidebar or title-bar cleanup. The work is not only “change the SVG”; it also needs one authoritative rule for local, installed, and remote missing-art surfaces.

### The manual proof harness still encodes old shell-brand expectations

`src/verification/manual/views.ts` and `src/verification/manual/scenarios.tsx` still describe many shell proofs in terms of:

- `FriendLauncher` text visibility;
- older milestone names and closeout language;
- appearance proof wording that is disconnected from the new direct-feedback shell criteria.

This matters because v0.6.0 already demonstrated the failure mode: a milestone can look “green” while the live product still feels wrong. Phase 32 should therefore plan one explicit pass that updates the proof harness itself to the new shell/sidebar/fallback contract.
