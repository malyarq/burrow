---
status: diagnosed
trigger: "Diagnose one UAT gap for Phase 36.

Gap truth: Collapsed sidebar controls and settings actions should stay centered and their labels should fit without clipping or drift.
Severity: major
Test: 3
User report: У свернутой боковой панели бургер не в центре своего дива. Тексты некоторых кнопок не влезают. Не везде отцентрованы.
Debug slug: collapsed-sidebar-centering
Goal: find_root_cause_only"
created: 2026-04-22T19:12:31Z
updated: 2026-04-22T19:16:20Z
---

## Current Focus

hypothesis: Confirmed: Phase 36 normalized only the catalog CTA seam, but the collapsed sidebar header and settings utility actions still sit on legacy/ad-hoc button geometry. That leaves the burger on a smaller standalone square than the rest of the collapsed rail, and leaves settings action rows on the default Button wrapper that clips long labels because it hides overflow without enabling the catalog wrapping rules.
test: Correlate Sidebar/SidebarHeader compact geometry, Button default vs catalog-primary behavior, and concrete settings action rows that still use the default button seam.
expecting: The code should show a hardcoded 40px collapsed expand button, a wider 48px compact icon rail elsewhere, default buttons with overflow-hidden/non-wrapping inner flex, and settings rows with long Russian labels but no geometry test coverage.
next_action: return root-cause diagnosis for Phase 36 UAT gap 3

## Symptoms

expected: With the sidebar collapsed, the burger and other compact controls stay visually centered in their slots, and action labels across the affected settings/modpack surfaces fit without clipping or drift.
actual: The collapsed sidebar burger is not centered inside its container, some button texts do not fit, and multiple controls are not centered consistently.
errors: none reported
reproduction: Collapse the sidebar, inspect the burger alignment, then review Test 3 action controls for clipped labels or off-center content.
started: Reported during Phase 36 UAT on 2026-04-22; exact regression point unknown

## Eliminated

## Evidence

- timestamp: 2026-04-22T19:16:20Z
  checked: src/components/Sidebar.tsx, src/components/sidebar/SidebarHeader.tsx, and src/components/sidebar/__tests__/SidebarHeader.compact-mode.test.tsx
  found: The collapsed sidebar rail shrinks to w-14/w-16 with padding, but the expand burger is not a shared Button at all; it is a standalone native button hardcoded to h-10 w-10, while the collapsed multiplayer/settings rail below uses shared Button instances sized to w-12 h-12. The compact-mode test explicitly locks the expand button to h-10/w-10.
  implication: The burger is the only compact sidebar control on a smaller geometry seam than its neighboring collapsed controls, which creates the visible centering/drift mismatch reported in UAT.

- timestamp: 2026-04-22T19:16:20Z
  checked: src/components/ui/Button.tsx and src/components/modpacks/__tests__/CatalogHeaderActions.test.tsx
  found: The default Button wrapper always renders with overflow-hidden and an inner flex row, but it does not add any wrapping or min-width reset for the label. The only place that gets label-safe geometry is the catalog-primary override, which adds whitespace-normal, and the catalog tests assert that geometry explicitly.
  implication: Long button labels are only protected where catalog-primary is opted in; everywhere else, long localized labels can be clipped inside the default button shell.

- timestamp: 2026-04-22T19:16:20Z
  checked: src/components/settings/tabs/LauncherTab.tsx, src/components/settings/__tests__/LauncherTab.layout.test.tsx, and src/locales/ru.json
  found: LauncherTab still renders settings utility actions such as the side-by-side image-cache buttons with the default Button geometry inside an sm:flex-row, including Russian labels like "Сохранить лимит" and "Очистить кэш изображений". The launcher layout test verifies shared shell structure, sliders, and segmented options, but it does not assert button geometry or label wrapping for these actions.
  implication: The settings action rows that match the UAT complaint never adopted the label-safe shared geometry and were not covered by a regression test, so clipping/drift survived Phase 36.

## Resolution

root_cause: Phase 36’s “shared control contract” was applied selectively. The collapsed sidebar header still uses an ad-hoc 40px native expand button instead of the same compact button geometry used by the rest of the collapsed rail, so the burger visually drifts in the narrowed sidebar. At the same time, settings utility actions still use the default Button seam, whose wrapper hides overflow and does not opt into the catalog-primary wrapping rules. In side-by-side settings rows with longer Russian labels, that causes text clipping instead of stable centered button content.
fix:
verification:
files_changed: []
