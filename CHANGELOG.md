# История изменений / Changelog

Здесь кратко описан текущий публичный релиз. Подробная история разработки остаётся в Git, а [GitHub Releases](https://github.com/malyarq/burrow/releases) служит основным источником установочных файлов.

This file summarizes the current public release. Git history remains the detailed development record, and [GitHub Releases](https://github.com/malyarq/burrow/releases) is the canonical source for downloadable artifacts.

## Не выпущено / Unreleased

После v0.13.0 изменений нет. / No changes after v0.13.0.

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
