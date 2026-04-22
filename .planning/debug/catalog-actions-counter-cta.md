---
status: diagnosed
trigger: "История в браузере полезна, а импорт непонятно зачем если на главной есть. Каунтеры не отцентрованы. Добавить мод сильно больше чем Обновить."
created: 2026-04-22T19:18:14Z
updated: 2026-04-22T19:24:59Z
---

## Current Focus

hypothesis: confirmed - Phase 36 only normalized the catalog-header seam, while the browser import/history cluster and installed-mods summary/actions still use separate one-off implementations
test: traced browser, home catalog, mods-tab, button geometry, and related tests to compare which surfaces actually share a control contract
expecting: the reported drift comes from missing reuse of shared geometry and from generic import labeling across routes
next_action: return the root-cause diagnosis for the UAT gap

## Symptoms

expected: Secondary catalog actions, counters, and CTA sizing should stay visually coherent, and duplicated actions should justify their presence.
actual: Browser history is useful, import feels redundant with the home screen, enabled/installed counters are not centered, and the Add Mod CTA is much larger than Refresh.
errors: none reported
reproduction: Open the mod browser/catalog surface in the launcher and inspect the action rail with history/import actions, enabled/installed counters, and Add Mod vs Refresh buttons.
started: Reported during Phase 36 UAT on 2026-04-22; no earlier healthy state recorded.

## Eliminated

## Evidence

- timestamp: 2026-04-22T19:21:36Z
  checked: src/components/modpacks/ModpackBrowser.tsx and src/components/modpacks/ModpackList.tsx
  found: the browser header renders a generic local-file import button next to History, while the installed catalog header already exposes a separate import entry on the home route
  implication: import is duplicated across adjacent catalog routes without enough contextual differentiation, so the extra browser action feels unjustified in the live UI

- timestamp: 2026-04-22T19:22:41Z
  checked: src/components/modpacks/details/ModpackDetailsModsTab.tsx
  found: the mods tab hard-codes its own Add Mod and Refresh buttons without geometry="catalog-primary", and the Add Mod action uses the accent-heavy primary variant while Refresh uses secondary
  implication: the CTA pair is not constrained by a shared width/geometry contract, so the longer Add Mod label expands and reads much larger than Refresh even though both use size="sm"

- timestamp: 2026-04-22T19:23:14Z
  checked: src/components/modpacks/details/ModpackDetailsModsTab.tsx
  found: the Enabled and Installed summary cards are plain stacked text blocks with no centering classes on the container or text
  implication: the counters are rendered off the shared alignment contract, which is why the numeric badges appear visually uncentered

- timestamp: 2026-04-22T19:24:11Z
  checked: src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx
  found: Phase 36 tests only assert shared geometry for installed/browser catalog headers and card actions, not for the installed-mods tab summary/actions where the user reported the problem
  implication: the regression survived because the shared-control work never covered this secondary content workspace

## Resolution

root_cause: Phase 36 standardized only the top-level catalog header seam, but the installed-mods workspace and browser import/history rail remain bespoke. The browser still exposes a generic import CTA alongside History despite the home catalog already owning an import entry, and ModpackDetailsModsTab renders its CTA row and Enabled/Installed counters outside any shared geometry/alignment component. That leaves duplicated actions without route-specific explanation, counters without centering rules, and a longer accent-primary Add Mod button visually overpowering the secondary Refresh action.
fix: 
verification: 
files_changed: []
