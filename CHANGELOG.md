# История изменений / Changelog

Здесь кратко описаны текущие версии продукта. Подробная история разработки остаётся в Git, а [GitHub Releases](https://github.com/malyarq/burrow/releases) служит основным источником установочных файлов.

This file summarizes current product versions. Git history remains the detailed development record, and [GitHub Releases](https://github.com/malyarq/burrow/releases) is the canonical source for downloadable artifacts.

## [1.0.0-next.1] — 2026-09-14

### Русский

- Burrow Next переводит лаунчер на оболочку из четырёх страниц: «Играть», «Библиотека», «Вместе» и «Настройки». Настройки открываются как отдельная страница и не теряют введённые данные или прокрутку при переходе в другой раздел.
- Интерфейс использует нейтральные светлую и тёмную темы, отдельный пользовательский акцент, ограниченное движение, новый знак, иллюстрации и иконки.
- На Windows пилот двух одинаковых модельных сцен оставил Electron + React: медиана готовности 392,7 мс и 301,2 МиБ private bytes против 991,4 мс и 325,2 МиБ у Tauri + Node. Это не проверка полного продукта, сети или запуска Minecraft.
- Next использует отдельный каталог userData; встроенный updater выключен.

Эта предварительная версия не является заявлением о готовом публичном релизе. Полный выпускной прогон Windows, macOS и Linux, Microsoft Auth, подпись пакетов, проверка PostHog и условия CurseForge остаются открытыми ограничениями.

### English

- Burrow Next moves the launcher to a four-page shell: Play, Library, Together, and Settings. Settings opens as a page and retains entered data and scroll position while moving to another area.
- The interface uses neutral light and dark themes, a separate user accent, restrained motion, and new artwork and icons.
- A Windows pilot of two identical model scenes kept Electron + React: median ready time was 392.7 ms and private bytes were 301.2 MiB, compared with 991.4 ms and 325.2 MiB for Tauri + Node. This is not a full-product, network, or Minecraft-launch test.
- Next uses an isolated userData directory; its built-in updater is disabled.

This prerelease is not a claim of public-release readiness. A release-level Windows/macOS/Linux pass, Microsoft Auth, package signing, PostHog confirmation, and CurseForge conditions remain open limits.

## [0.15.0] — 2026-09-14

### Русский

- Свои темы можно сохранять, применять, переименовывать и удалять вместе с акцентом, режимом, цветами и фоновыми эффектами. Готовые палитры: Нейтральная, Тёплый камень, Океан и Полночь для тёмного режима.
- Вкладки настроек подгружаются заранее и сохраняют состояние. Кнопка «Готово» находится в общей шапке; аккаунты, моды, ресурспаки и шейдеры используют согласованные панели и действия.
- Выбор модпака больше не перезагружает фильтры. Обновление ресурсов сохраняет видимый список. Исправлена отметка 8 ГБ на шкале памяти, убрано изменение размеров при появлении диалогов, обновлена стандартная обложка модпака.

### English

- Save, apply, rename and delete personal themes with their accent, mode, colors and background effects. Presets are Neutral, Warm Stone, Ocean and dark-only Midnight.
- Settings tabs preload and retain state. Done stays in the shared header; accounts, mods, resource packs and shaders use consistent panels and actions.
- Selecting a modpack no longer reloads filters. Resource refresh preserves the visible list. Fixed the 8 GB memory tick, removed dialog arrival scaling and replaced the default modpack cover.

## [0.14.0] — 2026-09-14

### Русский

- Переработан интерфейс: нейтральные светлая и тёмная темы, независимый пользовательский акцент и единые размеры элементов. Настройки используют плоские разделы и удобные строки переключателей. Главный экран использует статичный пейзаж. Исправлены цвета готовых тем в тёмном режиме, обрезание рамок фокуса и положение тумблеров. Поля боковой панели больше не мерцают при смене режима, настройки загрузок открываются сразу, а свои цвета показаны на подписанном примере. Пасхалка сохранена. В библиотеке крупнее обложки, в узком окне сворачивается панель, скрытые элементы исключены из клавиатурной навигации.
- Burrow Link различает локальную готовность, подключение друга и игровой поток; таймаут виден пользователю, закрытые попытки не оставляют ожидание.
- Обновление модпаков сохраняет пользовательские файлы и настройки запуска. Небезопасное обновление старой CurseForge-сборки останавливается до замены данных.
- Исправлены восстановление операций после сохранения каталога, атомарная запись игровых настроек и сетевые гонки.
- Выбор Java относится к редактируемому инстансу и сохраняется при изменении других настроек; Classic использует каноническую конфигурацию. Quilt отклоняется явно.
- Исправлены завершение первого знакомства, запуск при занятом порте авторизации, безопасные ошибки входа и привязка обработчиков к пересозданному окну.
- Открытие папки игры принимает только нативный выбор. Проверка обновления проверяет реальные настройки, статистику и выбранный инстанс; зависимости обновлены для устранения известных уязвимостей.
- Исправлена переносимость автоматических проверок на Windows.

### English

- Redesigned the interface with neutral light and dark themes, an independent user accent and consistent control sizes. Settings use flat sections and readable toggle rows. The home screen uses a static landscape. Fixed preset colors in dark mode, clipped focus outlines and toggle alignment. Sidebar fields remain stable when switching modes, download settings open immediately, and custom colors include a labeled preview. The easter egg remains. The library emphasizes covers, the sidebar collapses in narrow windows, and hidden controls stay out of keyboard navigation.
- Burrow Link distinguishes local readiness, peer connection, and game streams; timeouts are visible and closed attempts stop waiting.
- Modpack updates preserve user files and launch settings. Unsafe legacy CurseForge updates stop before replacing data.
- Fixed operation recovery after catalog commits, atomic game settings writes, and network races.
- Java selection targets the edited instance and survives other settings changes; Classic uses canonical configuration. Quilt is explicitly rejected.
- Fixed onboarding completion, startup with an occupied authentication port, safe sign-in errors, and handler rebinding for recreated windows.
- Opening the game folder accepts only native selection. Upgrade checks verify real settings, statistics, and a selected instance; dependencies address known vulnerabilities.
- Fixed Windows portability of automated checks.

## [0.13.0] — 2026-08-09

### Русский

#### Добавлено

- Явный выбор аналитики при первом запуске с равноправным отказом и последующим управлением в настройках.
- Приватные продуктовые метрики запуска приложения и Minecraft, знакомства с интерфейсом, каталога модпаков, обновлений, операций, ошибок и сессий Burrow Link.

#### Изменено

- События аналитики ограничены версионированным контрактом, безопасными категориями и крупными диапазонами времени, количества и трафика.
- Неотправленные события хранятся не более семи дней, повторяются с устойчивым идентификатором и полностью удаляются при отказе от аналитики.

#### Приватность

- Аналитика не создаёт профили пользователей и не отправляет IP-географию, аккаунты, пути, поисковые запросы, журналы, тексты ошибок или секреты приглашений.
- Связь событий одной попытки Burrow Link использует необратимый идентификатор, полученный из случайного секрета комнаты, без передачи самого секрета.

### English

#### Added

- An explicit first-run analytics choice with an equally prominent decline path and later control in settings.
- Privacy-preserving product metrics for application and Minecraft startup, onboarding, modpack catalog use, updates, operations, failures, and Burrow Link sessions.

#### Changed

- Analytics events are constrained by a versioned contract, safe categorical values, and coarse duration, count, and traffic buckets.
- Unsent events expire after seven days, retry with stable insertion identifiers, and are removed immediately when analytics is disabled.

#### Privacy

- Analytics creates no person profiles and sends no IP-derived location, accounts, paths, search queries, logs, error text, or invitation secrets.
- Burrow Link attempt correlation uses a one-way identifier derived from the random room secret without transmitting that secret.

## [0.12.0] — 2026-08-08

### Русский

#### Добавлено

- Двуязычный русско-английский лаунчер для обычного Minecraft и управляемых модпаков.
- Приглашения Burrow Link для совместной игры, обмен модпаками, резервное копирование настроек, пошаговое знакомство с приложением и необязательная приватная аналитика.
- Пакеты для Windows, macOS и Linux с контрольными суммами и автоматизированными проверками запуска на каждой платформе.

#### Изменено

- Идентификатор приложения, каталог пользовательских данных, маркер схемы, временные рабочие каталоги и публичные протоколы приведены к единой айдентике Burrow.
- Приглашения, коды обмена модпаками, резервные копии настроек, обновления пакетов и анонимная аналитика используют только актуальные форматы Burrow.
- До появления внешних пользователей удалены устаревшие пространства имён и ветки миграции старых форматов.

#### Безопасность

- Усилена защита окон Electron, IPC-валидации, навигации, архивов, загрузок, хранения учётных данных, обновлений и изоляции renderer-процесса.
- Анонимная аналитика выключена до явного согласия и отправляет только разрешённые продуктовые события без профилей пользователей, геоданных по IP, путей, аккаунтов, журналов и секретов игровых комнат.

#### Выпуск

- Тег создаётся последним: точный коммит публикуется только после успешной сборки пакетов и обязательных проверок на всех платформах.
- Подпись издателя и notarization для macOS пока не настроены; предупреждения операционных систем описаны в релизе и руководстве пользователя.

### English

#### Added

- A bilingual Russian/English launcher for vanilla Minecraft and managed modpacks.
- Burrow Link multiplayer invitations, modpack sharing, settings backup, guided onboarding, and privacy-first optional analytics.
- Cross-platform Windows, macOS, and Linux packages with checksums and automated native smoke evidence.

#### Changed

- Standardized the application ID, user-data directory, persistent schema marker, temporary workspaces, and public protocols on the Burrow identity.
- Made invitations, modpack share codes, settings backups, package upgrades, and anonymous analytics use only their current Burrow formats.
- Removed pre-public migration branches and obsolete namespaces before external adoption.

#### Security

- Hardened Electron windows, IPC validation, navigation, archives, downloads, credential storage, updater behavior, and renderer isolation.
- Anonymous analytics stays disabled until explicit consent and sends only allowlisted product events without persons, IP-derived location, paths, accounts, logs, or room secrets.

#### Release

- Release publication is tag-last: every platform package and required check must finish before the exact commit is tagged and published.
- Publisher signing and macOS notarization are not configured; the release notes and user guide state the resulting operating-system warnings.
