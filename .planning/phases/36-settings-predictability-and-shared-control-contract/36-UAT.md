---
status: diagnosed
phase: 36-settings-predictability-and-shared-control-contract
source:
  - 36-01-SUMMARY.md
  - 36-02-SUMMARY.md
  - 36-03-SUMMARY.md
  - 36-04-SUMMARY.md
started: 2026-04-22T18:38:44Z
updated: 2026-04-22T19:24:36Z
---

## Current Test

[testing complete]

## Tests

### 1. Settings Shell Density
expected: Open Settings on a laptop-width window. You should see one compact shell summary above the real content area, a segmented tab rail instead of stacked intro cards, and the Statistics tab should not repeat that shell-level guidance inside the panel.
result: issue
reported: "Внешний вид / Примените готовый профиль оболочки и поверхностей или импортируйте и экспортируйте свой. / Изменения сохраняются автоматически по мере настройки. Эти надписи не нужны. Достаточно свитча вкладок. Я вижу что свитчер вложен во вложенность. Это лишнее. Далее я вижу что настройки тоже как вложенность вложены во вложенность и так много где, например цвет акцента и язык. Рантайм пресета вообще лишнее. А еще все настройки стали дико лагать при скролле. Просто ужасно. Масштаб интерфейса и положение сайдбара в настройках смещены: я вижу 4 элемента в гриде и 2 этих которые из него будто выехали."
severity: major

### 2. Appearance Preset Predictability
expected: In Appearance, selecting a preset should keep the active preset family and mode visible. If you switch light/dark mode and make a bounded customization, the UI should still show the preset ancestry plus a customized state, and the reset action should name the exact target runtime.
result: issue
reported: "Нажал полночь ничего не поменялось. Так же со всеми остальными. Но со светлой все корректно меняется. Еще хотелось бы для каждой темы менять базовые акцентные цвета чтобы они лучше подходили по палитре. Точно так же влиять должна светлая темная тема. Рантайм мне вообще не нужен. Фоновые эффекты после настройки я нигде не вижу, вообще, никакие. Настройки цветов в расширенных тоже 0 эффекта дают, буквально нигде нет результата этих настроек, хотя они точно сохранились."
severity: major

### 3. Shared Control Contract
expected: Tabs, toggles, sliders, and accent choices should read like one control family. Accent chips should show the same active and focus treatment as the rest of settings controls, and custom accent selection should behave like a real visible chip rather than a hidden overlay oddity.
result: issue
reported: "В целом все так, но мне все еще не нравится что я вижу почти бесконечное количество вложенностей объект в объект из-за этого целая куча рамок скруглений и выглядит как многослойный торт. Слишком многослойный. У свернутой боковой панели бургер не в центре своего дива. Некоторые текста кнопок в них не влезают. Это очень важно проверять. Не везде они отцентрованы. Миры, скриншоты, шейдеры, ресурспаки, наверное моды тоже, все еще выглядят несогласованно. Слишком узкий див в случае когда оно не установлено, там еще кнопка добавить. Сетки и выравнивания поиска все еще очень кривые, вообще плохо выглядит. Думаю поиск это одна строка, а вторая строка все фильтры, сейчас как будто по столбцам разбита. В браузере история полезная штука, а импорт непонятно зачем если на главной есть. При создании модпака столкнулся с: Модпак уже создан, но следующий шаг настройки завершился ошибкой. Можно завершить сейчас и поправить сборку позже. Включено и установлено - каунтеры не отцентрованы. Добавить мод кнопка сильно больше чем кнопка обновить, это сильно выбивается визуально."
severity: major

### 4. Embedded Utility Tabs
expected: Downloads, Launcher, Storage, and Statistics should all feel like parts of the same settings surface, without nested mini-dashboard framing or repeated shell copy. Utility actions such as export or runtime controls should stay inside shared settings sections.
result: issue
reported: "Уже все описал, не нравится такая большая вложенность визуальная, и то как дико лагает."
severity: major

### 5. Settings Proof Route Honesty
expected: The manual settings verification route should explicitly direct review toward duplicate-copy removal, preset predictability, aligned control geometry, and visible-effect scope, rather than older preset-only wording.
result: issue
reported: "Уже все описал в других."
severity: major

## Summary

total: 5
passed: 0
issues: 5
pending: 0
skipped: 0

## Gaps

- truth: "Settings should open with one compact navigation shell and no redundant shell copy or card-in-card nesting before the real controls begin."
  status: failed
  reason: "User reported: Внешний вид / Примените готовый профиль оболочки и поверхностей или импортируйте и экспортируйте свой. / Изменения сохраняются автоматически по мере настройки. Эти надписи не нужны. Достаточно свитча вкладок. Я вижу что свитчер вложен во вложенность. Это лишнее. Далее я вижу что настройки тоже как вложенность вложены во вложенность и так много где, например цвет акцента и язык."
  severity: major
  test: 1
  root_cause: "SettingsPage already renders shell copy and a framed panel, but AppearanceTab still behaves like a standalone screen with its own hero and nested control shells, so the route shows duplicate intro chrome and card-in-card nesting."
  artifacts:
    - path: "src/components/SettingsPage.tsx"
      issue: "Route shell already owns label, description, and panel framing."
    - path: "src/components/settings/settingsTabs.ts"
      issue: "Appearance tab still injects shell-level description copy."
    - path: "src/components/settings/tabs/AppearanceTab.tsx"
      issue: "No embedded mode; renders standalone hero and nested accent/language wrappers."
  missing:
    - "Add embedded-mode behavior to AppearanceTab so it can render inside the existing settings shell."
    - "Remove route-level duplicate appearance intro copy from the settings shell contract."
    - "Flatten accent and language sections into shared settings sections instead of nested surface stacks."
  debug_session: ".planning/debug/settings-shell-nesting.md"

- truth: "Appearance should not add redundant runtime chrome that competes with the actual controls when preset context is already obvious."
  status: failed
  reason: "User reported: Рантайм пресета вообще лишнее."
  severity: major
  test: 1
  root_cause: "AppearanceTab unconditionally renders a separate preset-runtime card even though preset summary, mode switch, and reset target are already visible in the main controls, and locale/tests explicitly preserve that extra chrome."
  artifacts:
    - path: "src/components/settings/tabs/AppearanceTab.tsx"
      issue: "Always renders the dedicated Preset Runtime side card."
    - path: "src/locales/en.json"
      issue: "Copy explicitly says runtime state should stay permanently visible."
    - path: "src/components/settings/__tests__/AppearanceTab.presets.test.tsx"
      issue: "Tests lock the duplicated runtime strip as expected behavior."
  missing:
    - "Remove or collapse the dedicated runtime card into the existing preset heading/reset area."
    - "Update locale copy so preset ancestry appears only when it adds context."
    - "Rewrite appearance tests around reduced chrome instead of a permanent runtime card."
  debug_session: ".planning/debug/preset-runtime-chrome.md"

- truth: "Settings scrolling and grid layout should stay smooth and aligned, including interface scale and sidebar position controls."
  status: failed
  reason: "User reported: А еще все настройки стали дико лагать при скролле. Просто ужасно. Масштаб интерфейса и положение сайдбара в настройках смещены: я вижу 4 элемента в гриде и 2 этих которые из него будто выехали."
  severity: major
  test: 1
  root_cause: "Phase 36 stacked multiple blur-heavy shared surfaces inside the modal scroll container and left LauncherTab split into a 4-control grid plus a second 2-control grid, causing both scroll repaint jank and the 'two cards outside the grid' layout drift."
  artifacts:
    - path: "src/index.css"
      issue: "Repeated surface primitives all carry backdrop blur and custom-painted styling."
    - path: "src/components/settings/tabs/LauncherTab.tsx"
      issue: "Scale and sidebar position live in a second grid separate from the four toggles."
    - path: "src/components/ui/Modal.tsx"
      issue: "All nested blurred surfaces repaint inside the scrollable modal body."
  missing:
    - "Remove blur-heavy styling from repeated inner settings primitives and keep it only on the outer shell."
    - "Merge launcher runtime controls into one responsive six-item grid."
    - "Add a layout/performance seam that catches split launcher grids and over-nested blurred wrappers."
  debug_session: ".planning/debug/settings-scroll-grid-lag.md"

- truth: "Switching appearance presets and light/dark variants should produce visible, reliable visual changes instead of leaving most preset selections looking unchanged."
  status: failed
  reason: "User reported: Нажал полночь ничего не поменялось. Так же со всеми остальными. Но со светлой все корректно меняется."
  severity: major
  test: 2
  root_cause: "Preset switching updates document theme tokens, but most visible launcher shell surfaces still use hard-coded zinc/dark Tailwind classes and a separate global accent, so dark preset families repaint too little to look meaningfully different."
  artifacts:
    - path: "src/contexts/settings/theme-presets.ts"
      issue: "Preset families only own a narrow colors/brand token set."
    - path: "src/components/sidebar/ModloaderSection.tsx"
      issue: "High-visibility shell surface still uses hard-coded dark-mode styling."
    - path: "src/components/SimplePlayDashboard.tsx"
      issue: "Dashboard still bypasses tokenized preset colors on visible shell text/surfaces."
  missing:
    - "Move shell/sidebar/dashboard surfaces onto tokenized theme classes."
    - "Expand preset ownership to the same high-visibility surfaces light/dark mode already repaints."
    - "Add live-surface tests that fail when preset switches rewrite tokens but leave the shell visually unchanged."
  debug_session: ".planning/debug/preset-visual-noop.md"

- truth: "Preset families and their light/dark variants should carry palette-appropriate base accent behavior rather than feeling visually identical unless the user overrides accent manually."
  status: failed
  reason: "User reported: Еще хотелось бы для каждой темы менять базовые акцентные цвета чтобы они лучше подходили по палитре. Точно так же влиять должна светлая темная тема."
  severity: minor
  test: 2
  root_cause: "Accent color is a separate persisted setting outside the preset contract, and preset/mode changes intentionally do not touch it, so preset families cannot provide palette-coupled accent defaults."
  artifacts:
    - path: "src/contexts/settings/types.ts"
      issue: "No preset-owned accent field exists in the appearance state model."
    - path: "src/contexts/SettingsContext.tsx"
      issue: "applyThemePreset and setTheme preserve the global accentColor value."
    - path: "src/contexts/settings/theme.ts"
      issue: "Accent CSS vars derive only from standalone accentColor."
  missing:
    - "Add preset-owned accent defaults for each preset family and mode."
    - "Resolve effective accent from preset+mode unless the user explicitly overrides it."
    - "Differentiate manual accent override state from preset default accent state in the UI contract."
  debug_session: ".planning/debug/preset-palette-drift.md"

- truth: "Background effects and advanced color controls should have visible product impact wherever settings claims they apply."
  status: failed
  reason: "User reported: Фоновые эффекты после настройки я нигде не вижу, вообще, никакие. Настройки цветов в расширенных тоже 0 эффекта дают, буквально нигде нет результата этих настроек, хотя они точно сохранились."
  severity: major
  test: 2
  root_cause: "The controls persist and update tokens, but the only runtime consumer of background config is BackgroundLayer behind opaque shell and modal surfaces, so users have no reliable visible preview or live surface proving those settings matter."
  artifacts:
    - path: "src/components/layout/BackgroundLayer.tsx"
      issue: "Background effects render behind the app at -z-10 and are largely hidden."
    - path: "src/components/AppLayout.tsx"
      issue: "Main shell paints solid background surfaces over the backdrop."
    - path: "src/components/ui/Modal.tsx"
      issue: "Settings modal scrim and panels hide the very effects users are trying to evaluate."
  missing:
    - "Move background effects onto a genuinely visible shell layer."
    - "Add a live preview/application seam for advanced colors inside settings."
    - "Stop claiming visible effect for controls that only update hidden tokens."
  debug_session: ".planning/debug/background-advanced-noeffect.md"

- truth: "Controls should not sit inside excessive card-in-card nesting with repeated borders and radii that make settings feel like a layered object stack."
  status: failed
  reason: "User reported: Вижу почти бесконечное количество вложенностей объект в объект, куча рамок и скруглений, выглядит как многослойный торт."
  severity: major
  test: 3
  root_cause: "Phase 36 added multiple reusable settings wrappers, but each wrapper is itself card-like and framed, so embedding tabs now compose bordered/radiused shells on top of the existing SettingsPage panel instead of flattening inside it."
  artifacts:
    - path: "src/components/SettingsPage.tsx"
      issue: "Every tab already starts inside a framed shell panel."
    - path: "src/index.css"
      issue: "surface-panel, surface-card, surface-muted, settings-section-shell, settings-control-card, and related rows all have visible frame styling."
    - path: "src/features/settings/statistics/StatisticsTab.tsx"
      issue: "Embedded utility tab stacks multiple framed section shells inside the route shell."
  missing:
    - "Define one dominant tab surface and demote inner groupings to layout-only containers."
    - "Flatten embedded utility and appearance sections instead of wrapping them in new bordered cards."
    - "Add tests that reject repeated framed wrappers in embedded settings mode."
  debug_session: ".planning/debug/nested-card-excess.md"

- truth: "Collapsed sidebar controls and settings actions should stay centered and their labels should fit without clipping or drift."
  status: failed
  reason: "User reported: У свернутой боковой панели бургер не в центре своего дива. Некоторые текста кнопок не влезают. Не везде они отцентрованы."
  severity: major
  test: 3
  root_cause: "Collapsed sidebar header still uses a one-off 40x40 native burger while neighboring compact controls use larger shared geometry, and default Button clips localized labels because wrapping is only enabled for catalog-primary geometry."
  artifacts:
    - path: "src/components/sidebar/SidebarHeader.tsx"
      issue: "Collapsed burger uses ad-hoc h-10 w-10 button geometry."
    - path: "src/components/ui/Button.tsx"
      issue: "Default button hides overflow and does not enable label wrapping."
    - path: "src/components/settings/tabs/LauncherTab.tsx"
      issue: "Long localized utility actions still rely on default clipped button geometry."
  missing:
    - "Move the collapsed burger onto the shared compact button seam."
    - "Make default button geometry label-safe or add an explicit wrapped utility-button geometry."
    - "Add tests for centered compact sidebar controls and non-clipped settings action labels."
  debug_session: ".planning/debug/collapsed-sidebar-centering.md"

- truth: "Modpack content tabs and their search/filter bars should share one coherent layout contract instead of mismatched widths, narrow empty states, and column-broken search surfaces."
  status: failed
  reason: "User reported: Миры, скриншоты, шейдеры, ресурспаки, наверное моды тоже, все еще выглядят несогласованно. Слишком узкий див, сетки и выравнивания поиска очень кривые. Поиск должен быть одной строкой, а фильтры второй."
  severity: major
  test: 3
  root_cause: "The modpack secondary-content area never received a shared workspace contract, so mods, datapacks, add-content pages, and degraded states all hand-build their own widths and search/filter grids while DegradedStateView defaults to a narrow centered card."
  artifacts:
    - path: "src/components/modpacks/ModpackDetails.tsx"
      issue: "Secondary content host is only a pass-through mount point."
    - path: "src/components/modpacks/details/ModpackDetailsModsTab.tsx"
      issue: "Uses its own one-row search/filter grid and custom empty-state layout."
    - path: "src/components/layout/DegradedStateView.tsx"
      issue: "Default max-w-2xl card layout makes empty/degraded states too narrow."
  missing:
    - "Extract a shared modpack secondary-content workspace contract for width, search row, filter row, and degraded states."
    - "Migrate mods, datapack search, screenshots/worlds/shaders/resource packs, and add-content pages onto that contract."
    - "Render degraded states inline/full-width instead of the default capped card in secondary-content surfaces."
  debug_session: ".planning/debug/content-tabs-search-layout.md"

- truth: "Secondary catalog actions, counters, and CTA sizing should stay visually coherent, and duplicated actions should justify their presence."
  status: failed
  reason: "User reported: В браузере история полезная штука, а импорт непонятно зачем если на главной есть. Включено и установлено - каунтеры не отцентрованы. Добавить мод кнопка сильно больше чем кнопка обновить."
  severity: major
  test: 3
  root_cause: "Phase 36 only normalized top-level catalog headers. The browser still exposes a duplicate generic Import action, while ModpackDetailsModsTab keeps bespoke counters and a CTA row outside the shared button/counter geometry contract."
  artifacts:
    - path: "src/components/modpacks/ModpackBrowser.tsx"
      issue: "Browser route still owns a generic Import action beside History."
    - path: "src/components/modpacks/ModpackList.tsx"
      issue: "Main catalog already exposes import, creating cross-route duplication."
    - path: "src/components/modpacks/details/ModpackDetailsModsTab.tsx"
      issue: "Enabled/Installed counters and Add Mod/Refresh actions use a one-off layout and mismatched button emphasis."
  missing:
    - "Remove or clearly differentiate the browser Import action from the home catalog import entry."
    - "Move mods-tab counters onto a centered shared summary geometry."
    - "Normalize Add Mod and Refresh into one shared CTA size/weight contract."
  debug_session: ".planning/debug/catalog-actions-counter-cta.md"

- truth: "Create-modpack flow should not surface partial-success error copy after the modpack is already created without a calmer recovery story."
  status: failed
  reason: "User reported: При создании модпака столкнулся с: Модпак уже создан, но следующий шаг настройки завершился ошибкой. Можно завершить сейчас и поправить сборку позже."
  severity: major
  test: 3
  root_cause: "The create wizard intentionally treats createLocal as the durable success boundary and converts any later metadata or game-settings failure into an explicit post-commit recovery notice after the modpack already exists."
  artifacts:
    - path: "src/components/modpacks/ModpackCreationWizard.tsx"
      issue: "Post-create follow-up failures are routed into postCommitNotice instead of a softer success boundary."
    - path: "src/components/modpacks/__tests__/CreateModpackFlow.async-state.test.tsx"
      issue: "Tests lock explicit post-commit recovery as expected behavior."
    - path: "src/verification/manual/views.ts"
      issue: "Manual proof still frames post-commit recovery as the intended story."
  missing:
    - "Treat createLocal as the only hard success boundary and downgrade follow-up persistence failures to calm inline info."
    - "Remove the alarming partial-success recovery copy for secondary metadata/settings writes."
    - "Update tests and manual proof so they no longer require explicit post-commit recovery messaging."
  debug_session: ".planning/debug/create-modpack-partial-error.md"

- truth: "Embedded utility tabs should inherit the same calm settings surface without repeating the heavy nested-card framing or introducing severe scroll lag."
  status: failed
  reason: "User reported: Уже все описал, не нравится такая большая вложенность визуальная, и то как дико лагает."
  severity: major
  test: 4
  root_cause: "Shared utility-tab consistency was implemented by adding more settings-section and surface wrappers inside the already-framed SettingsPage panel, so Downloads/Launcher/Storage/Statistics now multiply both chrome and scroll repaint cost instead of flattening into one shell."
  artifacts:
    - path: "src/components/settings/tabs/DownloadsTab.tsx"
      issue: "Embedded downloads still add utility shells and cards."
    - path: "src/components/settings/tabs/StorageTab.tsx"
      issue: "Storage tab stacks embedded shells plus stat cards inside the route panel."
    - path: "src/features/settings/statistics/StatisticsTab.tsx"
      issue: "Statistics tab uses repeated settings-section-shell containers and inner framed items."
  missing:
    - "Keep one shell at the settings panel level and flatten utility tabs to layout-first containers."
    - "Reserve framed surfaces only for true exceptions like degraded/error states or one high-priority action block."
    - "Remove backdrop blur from repeated inner control/stat wrappers."
  debug_session: ".planning/debug/utility-tabs-nesting-lag.md"

- truth: "Manual settings proof should stay honest about real direct-feedback gaps instead of implying closure while the live UI still violates the same core expectations."
  status: failed
  reason: "User reported: Уже все описал в других."
  severity: major
  test: 5
  root_cause: "The manual settings proof is copy-driven, not behavior-driven: readiness is based on static strings rendering, while proof tests only lock route wording and mocked text, so the proof can pass even when live settings behavior still fails the same UAT expectations."
  artifacts:
    - path: "src/verification/manual/scenarios.tsx"
      issue: "settings-appearance route marks ready from static text instead of real interactions."
    - path: "src/verification/manual/__tests__/appearanceProof.test.tsx"
      issue: "Proof test uses a mocked text-only SettingsPage."
    - path: "src/verification/manual/views.ts"
      issue: "Route is still framed as Phase 36 closeout proof despite no live walkthrough gate."
  missing:
    - "Replace wording-only proof with behavior-driven proof on real settings surfaces."
    - "Require observable preset/mode/control checks before proof route reaches ready state."
    - "Remove closeout framing unless live walkthrough and behavior checks actually pass."
  debug_session: ".planning/debug/proof-route-honesty.md"
