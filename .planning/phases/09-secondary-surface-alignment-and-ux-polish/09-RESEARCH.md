# Phase 9 Research: Secondary Surface Alignment And UX Polish

## What The Planner Needs To Know

Phase 9 is not another broad "refresh anything that still looks old" pass. Phase 8 already aligned the highest-traffic launcher routes, so this phase should finish the remaining secondary surfaces that still feel like separate products, while also closing the accessibility and readability debt that now stands out more clearly against the refreshed core.

The planner should treat Phase 9 as a focused completion phase with five concrete outcomes:

1. share/import-share and screenshots stop behaving like legacy overlays with raw strings, emoji controls, browser dialogs, and route-local styling;
2. lower-traffic settings utilities such as mirrors, statistics, launcher utilities, downloads, and storage read like one coherent settings product instead of a mix of old cards and newer primitives;
3. content-management surfaces inside launcher or modpack details stop looking like leftover modules, especially mods, worlds, resource packs, shaders, and datapacks;
4. visible focus, keyboard reachability, contrast, reduced-motion behavior, and backdrop readability are intentionally closed across the touched secondary surfaces instead of being assumed from Phase 7 foundations;
5. the phase closes on focused automated verification plus a narrow secondary-surface sanity pass, without stealing the milestone-wide walkthrough and release-truth work reserved for Phase 10.

The main planning trap is to reopen Phase 8 core-route redesign under the label of "polish." The second trap is to push too much of the accessibility and atmosphere work into Phase 10. Phase 10 should prove the finished experience and update release truth; Phase 9 still needs to make the remaining shipped UI worth verifying.

## Requirement Fit

This phase directly covers:

- `UX-04`: secondary launcher surfaces such as sharing, statistics, mirrors, and content-management views feel like the same product as the refreshed shell and core flows;
- `A11Y-04`: the refreshed UI preserves visible focus states, sufficient contrast, and reduced-motion-respecting behavior across updated secondary surfaces.

It should intentionally not claim:

- `VER-01` milestone-close browser walkthrough;
- `DOC-03` release-facing README and roadmap truth;
- any new capability domain outside visual, interaction, and accessibility alignment of existing launcher surfaces.

## Current Baseline

### Share and screenshot flows are still the most obvious secondary-surface legacy island

`src/features/share/ShareModal.tsx` and `src/features/share/ImportShareModal.tsx` already use the shared `Modal`, `Button`, and `Input` primitives, but they still leak route-local styling and inconsistent feedback:

- hard-coded `loading-spinner` classes instead of the shared loading treatment;
- route-specific zinc backgrounds and button overrides;
- no focused regression coverage around copy, import, error, or disabled states.

`src/features/screenshots/components/ScreenshotsTab.tsx` and `src/features/screenshots/components/ScreenshotLightbox.tsx` are much further behind:

- browser `confirm()` and `alert()` are still used;
- visible raw translation keys or inline English strings such as `t('No screenshots yet')`, `t('Open Folder')`, and `title="Click to rename"` remain;
- emoji buttons and glyphs are used for core toolbar affordances;
- the lightbox is rendered as a portal overlay but without real dialog semantics, named controls, or explicit accessibility structure.

This is strong evidence that share and screenshots belong in one early Phase 9 slice.

### Secondary settings utilities are only partially aligned with the refreshed system

`src/features/settings/mirrors/MirrorsSettings.tsx` and `src/features/settings/statistics/StatisticsTab.tsx` are closer to the new system than many secondary surfaces, but they still mix older utility styling with newer tokens:

- `MirrorsSettings` already has meaningful ARIA labels and list semantics, but still mixes older blue or emerald utility classes, raw `Official` text, and route-specific input styles;
- `StatisticsTab` relies on plain stacked cards with older zinc backgrounds and has no dedicated accessibility or interaction regression beyond typed-data happy paths.

`src/components/settings/tabs/LauncherTab.tsx`, `DownloadsTab.tsx`, and `StorageTab.tsx` are also in scope:

- `DownloadsTab` nests the mirrors surface inside a newer settings shell, so the visual mismatch is currently obvious;
- `LauncherTab` and `StorageTab` are structurally closer to the shared system, but they still need to be evaluated as part of one lower-traffic settings seam rather than left as isolated islands;
- `SettingsPage.accounts.test.tsx` currently mocks these tabs out, so there is no real route-level proof for the secondary settings experience.

This points to a second slice centered on advanced settings utilities rather than on one file at a time.

### Content-management tabs remain a large cluster of legacy UI debt

The main remaining launcher content-management surfaces are:

- `src/components/modpacks/details/ModsTab.tsx`
- `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- `src/components/modpacks/details/WorldsTab.tsx`
- `src/components/modpacks/details/ResourcePacksTab.tsx`
- `src/components/modpacks/details/ShadersTab.tsx`
- `src/components/modpacks/details/WorldDatapacksModal.tsx`

These surfaces still show broad drift:

- repeated browser `confirm()` calls for destructive actions;
- emoji or plain-text glyph buttons such as `🌍`, `📁`, `💾`, `📋`, `▲`, `▼`, and `✕`;
- older `text-gray-*`, `bg-white dark:bg-zinc-800`, and dashed-empty-state recipes instead of the shared surface contract;
- raw fallback copy and inconsistent action naming;
- even a remaining `any[]` seam in `WorldDatapacksModal` search results;
- duplicated mod-management surfaces between `ModsTab` and `ModpackDetailsModsTab`, which implies Phase 9 should align shared patterns rather than let both diverge further.

These tabs appear in both `SimplePlayDashboard` and `ModpackDetails`, so they should be treated as one content-management seam rather than as isolated cleanup tasks.

### Accessibility and atmosphere debt is cross-cutting, not solved by Phase 7 alone

Phase 7 established the shared focus outline and document theme contract, and `src/components/layout/BackgroundLayer.tsx` already respects reduced motion. But the remaining secondary surfaces still carry local interaction and readability debt:

- screenshot overlays and toolbar buttons do not expose clear dialog semantics or consistently keyboard-reachable controls;
- content-management lists still use low-information glyph buttons and uneven focus treatments;
- some updated surfaces use crisp shared tokens while neighboring surfaces still use low-contrast gray-on-gray combinations or route-local white cards that feel detached from the current atmosphere;
- secondary surfaces still need an explicit pass to ensure backgrounds, blur, gradients, and motion do not undermine readability now that the launcher shell is more expressive.

This means `A11Y-04` should not be left as a postscript. It needs an explicit late-phase slice after the secondary-surface rollout lands.

## Existing Verification Seams

Phase 9 does not need new test infrastructure. Existing useful seams already include:

- `src/features/settings/mirrors/__tests__/MirrorsSettings.a11y.test.tsx`
- `src/features/settings/statistics/__tests__/StatisticsTab.test.tsx`
- `src/components/settings/__tests__/SettingsTabsHeader.a11y.test.tsx`
- `src/contexts/settings/__tests__/themeDocument.test.ts`

What is still missing is verification around the actual Phase 9-owned flows:

- share and import-share modal states;
- screenshot gallery and lightbox keyboard plus dialog behavior;
- secondary settings tabs as real surfaces instead of mocked stubs;
- content-management tabs and datapack modal behavior;
- cross-surface accessibility or reduced-motion regression for the newly aligned secondary surfaces.

Phase 9 should add only the focused tests required to lock these seams, not a general-purpose visual-regression system.

## Planning Risks

- If Phase 9 is planned as generic "polish," execution will spread across too many files and fail to close `UX-04` in a defensible way.
- If share and screenshots are split apart, both can retain their legacy overlay semantics and browser-dialog behavior even after partial styling cleanup.
- If mirrors and statistics are refreshed without the surrounding settings utility surfaces, the settings route will still feel stitched together.
- If content-management tabs are handled piecemeal, duplicated patterns between `ModsTab`, `ModpackDetailsModsTab`, and the world or pack tabs will drift further apart.
- If accessibility is treated only as a final gate, low-contrast or keyboard-hostile secondary surfaces can remain visually refreshed but operationally weaker.
- If Phase 9 closes only on lint or type gates, it can miss secondary-surface interaction regressions that are invisible to static checks.

## Recommended Plan Shape

The cleanest Phase 9 decomposition is five plans:

- `09-01`: align share, import-share, screenshots, and screenshot lightbox flows with the shared dialog, form, empty-state, and toolbar language;
- `09-02`: align secondary settings utilities, especially mirrors, statistics, launcher utilities, downloads, and storage, as one coherent lower-traffic settings seam;
- `09-03`: align content-management tabs across launcher and modpack details, covering mods, worlds, resource packs, shaders, and datapacks;
- `09-04`: close cross-cutting accessibility, contrast, reduced-motion, and backdrop-readability debt across the newly aligned secondary surfaces;
- `09-05`: close the phase under focused secondary-surface tests, standard repo gates, and a narrow browser sanity pass without expanding into Phase 10 release-truth work.

Recommended wave map:

- Wave 1: `09-01`, `09-02`
- Wave 2: `09-03`, `09-04`
- Wave 3: `09-05`

This shape keeps the real owner seams separate while preserving one explicit cross-cutting accessibility or polish pass and one final integration closeout.

## Validation Architecture

Phase 9 should use the existing Vitest plus jsdom lane, targeted route-component tests, and a small manual sanity pass.

### Layer 1: secondary-surface component and modal tests

Add focused tests around:

- share/import-share generation, error, copy, and disabled states;
- screenshot gallery empty states, toolbar actions, and lightbox keyboard behavior;
- secondary settings utility surfaces and their visible helper copy;
- content-management tabs and datapack modal interactions.

### Layer 2: focused accessibility and interaction seams

Keep or extend focused tests for:

- mirrors accessibility;
- statistics rendering and export;
- settings tab accessibility;
- reduced-motion or backdrop readability behavior where shared atmosphere intersects with updated secondary surfaces.

### Layer 3: repo gates for integration fallout

After each wave, Phase 9 should still prove it did not destabilize the app via:

- `npm test`
- `npm run lint`
- `npx tsc --noEmit`

### Layer 4: narrow secondary-surface browser sanity

Phase 9 should still record a live sanity pass on the secondary surfaces it owns:

- share and import-share dialog flow;
- screenshots gallery and lightbox;
- mirrors and statistics tabs;
- representative content-management tabs and datapack modal flow.

That is enough for Phase 9. The full milestone walkthrough and release-facing claims remain Phase 10 work.
