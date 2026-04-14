# Роадмап FriendLauncher

## Текущий Milestone

- Milestone: `v0.4.0`
- Тема: Launcher Truth And Product Polish
- Статус: активен, Phase 15 завершена
- Обновлено: `2026-04-14`

## Зачем Нужен Этот Milestone

У FMCL уже есть широкий набор сценариев, но screenshot-backed аудит от `2026-04-14` показал более узкий, но важный класс дефектов доверия: противоречивые launch states, устаревшие loader summaries, broken-looking fallback art, raw localization keys и несколько оставшихся проблем на плотных surface-ах. Milestone `v0.4.0` закрывает эти дефекты без расширения архитектурного scope и без новых feature-направлений.

## Что Уже Проверено

Текущий browser-backed walkthrough этого milestone пока покрывает classic dashboard через `manual-verification.html?view=dashboard` и подтверждает:

- branded fallback art на классическом hero, когда у сборки нет artwork
- truthful loader summary для активной launch-конфигурации
- локализованные waiting, downloading и failure states на launch surface
- видимые read-only advanced settings во время активного запуска

## Статус Фаз

| Фаза | Статус | Результат |
|------|--------|-----------|
| 15. Launch Truth And Shared Surface Contracts | Завершена | Branded fallback art, truthful loader summary, синхронизированные launch stages, локализованный runtime copy и read-only busy-state settings |
| 16. Modpack Detail Integrity And Discoverable Dense Navigation | Запланирована | Truthful dependency semantics, читаемый requirement copy и discoverable dense navigation |
| 17. Catalog, Compact Nav, And Settings Localization Polish | Запланирована | Каталожная legibility, fallback imagery, compact-nav truth и оставшаяся localization cleanup |
| 18. Verification And Release Truth | Запланирована | Focused automation, полный walkthrough, release docs и финальные milestone gates |

## Что Уже Даёт `v0.4.0`

- Launch progress больше не скатывается к ложному `0%`, когда реальный прогресс ещё неопределён
- Classic launch feedback теперь согласован между CTA, status card и runtime stage transitions
- Отсутствующий hero artwork заменяется осмысленным FMCL fallback вместо broken-image состояния
- Advanced launch settings остаются видимыми для справки и становятся read-only во время активного запуска
- Runtime settings и launch-adjacent controls теперь уважают выбранный язык лаунчера на audited classic surface

## Следующие Кандидаты

Это ближайшие milestone-owned шаги после Phase 15:

- truthful dependency satisfaction и более понятный requirement copy на modpack details
- плотная detail navigation без горизонтального tab-friction по умолчанию
- полировка catalog fallback imagery, compact-nav truth и оставшихся localization defects
- финальный milestone-wide walkthrough, docs refresh и packaging-aware release gates
