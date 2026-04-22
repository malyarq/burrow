---
status: complete
phase: 36-settings-predictability-and-shared-control-contract
source:
  - 36-01-SUMMARY.md
  - 36-02-SUMMARY.md
  - 36-03-SUMMARY.md
  - 36-04-SUMMARY.md
started: 2026-04-22T18:38:44Z
updated: 2026-04-22T18:56:01Z
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
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Appearance should not add redundant runtime chrome that competes with the actual controls when preset context is already obvious."
  status: failed
  reason: "User reported: Рантайм пресета вообще лишнее."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Settings scrolling and grid layout should stay smooth and aligned, including interface scale and sidebar position controls."
  status: failed
  reason: "User reported: А еще все настройки стали дико лагать при скролле. Просто ужасно. Масштаб интерфейса и положение сайдбара в настройках смещены: я вижу 4 элемента в гриде и 2 этих которые из него будто выехали."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Switching appearance presets and light/dark variants should produce visible, reliable visual changes instead of leaving most preset selections looking unchanged."
  status: failed
  reason: "User reported: Нажал полночь ничего не поменялось. Так же со всеми остальными. Но со светлой все корректно меняется."
  severity: major
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Preset families and their light/dark variants should carry palette-appropriate base accent behavior rather than feeling visually identical unless the user overrides accent manually."
  status: failed
  reason: "User reported: Еще хотелось бы для каждой темы менять базовые акцентные цвета чтобы они лучше подходили по палитре. Точно так же влиять должна светлая темная тема."
  severity: minor
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Background effects and advanced color controls should have visible product impact wherever settings claims they apply."
  status: failed
  reason: "User reported: Фоновые эффекты после настройки я нигде не вижу, вообще, никакие. Настройки цветов в расширенных тоже 0 эффекта дают, буквально нигде нет результата этих настроек, хотя они точно сохранились."
  severity: major
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Controls should not sit inside excessive card-in-card nesting with repeated borders and radii that make settings feel like a layered object stack."
  status: failed
  reason: "User reported: Вижу почти бесконечное количество вложенностей объект в объект, куча рамок и скруглений, выглядит как многослойный торт."
  severity: major
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Collapsed sidebar controls and settings actions should stay centered and their labels should fit without clipping or drift."
  status: failed
  reason: "User reported: У свернутой боковой панели бургер не в центре своего дива. Некоторые текста кнопок не влезают. Не везде они отцентрованы."
  severity: major
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Modpack content tabs and their search/filter bars should share one coherent layout contract instead of mismatched widths, narrow empty states, and column-broken search surfaces."
  status: failed
  reason: "User reported: Миры, скриншоты, шейдеры, ресурспаки, наверное моды тоже, все еще выглядят несогласованно. Слишком узкий див, сетки и выравнивания поиска очень кривые. Поиск должен быть одной строкой, а фильтры второй."
  severity: major
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Secondary catalog actions, counters, and CTA sizing should stay visually coherent, and duplicated actions should justify their presence."
  status: failed
  reason: "User reported: В браузере история полезная штука, а импорт непонятно зачем если на главной есть. Включено и установлено - каунтеры не отцентрованы. Добавить мод кнопка сильно больше чем кнопка обновить."
  severity: major
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Create-modpack flow should not surface partial-success error copy after the modpack is already created without a calmer recovery story."
  status: failed
  reason: "User reported: При создании модпака столкнулся с: Модпак уже создан, но следующий шаг настройки завершился ошибкой. Можно завершить сейчас и поправить сборку позже."
  severity: major
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Embedded utility tabs should inherit the same calm settings surface without repeating the heavy nested-card framing or introducing severe scroll lag."
  status: failed
  reason: "User reported: Уже все описал, не нравится такая большая вложенность визуальная, и то как дико лагает."
  severity: major
  test: 4
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Manual settings proof should stay honest about real direct-feedback gaps instead of implying closure while the live UI still violates the same core expectations."
  status: failed
  reason: "User reported: Уже все описал в других."
  severity: major
  test: 5
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
