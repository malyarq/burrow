import type { TourStep } from './OnboardingTour';

export function createTourSteps(t: (key: string) => string): TourStep[] {
  return [
    {
      id: 'classic',
      target: '[data-tour="classic"]',
      title: t('onboarding.tour.step_classic.title') || 'Классика',
      content: t('onboarding.tour.step_classic.content') || 'Режим быстрого запуска без менеджмента модпаков. Укажите никнейм, версию и модлоадер, затем нажмите «Играть».',
      position: 'bottom',
    },
    {
      id: 'modpacks',
      target: '[data-tour="modpacks"]',
      title: t('onboarding.tour.step_modpacks.title') || 'Модпаки',
      content: t('onboarding.tour.step_modpacks.content') || 'Здесь вы можете выбрать или создать модпак. Модпаки содержат моды, настройки и версию Minecraft.',
      position: 'bottom',
    },
    {
      id: 'multiplayer',
      target: '[data-tour="multiplayer"]',
      title: t('onboarding.tour.step_multiplayer.title') || 'Мультиплеер',
      content: t('onboarding.tour.step_multiplayer.content') || 'Управление серверами и подключением к мультиплееру.',
      position: 'bottom',
    },
    {
      id: 'settings',
      target: '[data-tour="settings"]',
      title: t('onboarding.tour.step_settings.title') || 'Настройки',
      content: t('onboarding.tour.step_settings.content') || 'Путь к Minecraft, язык, тема, источник загрузок и другие параметры лаунчера.',
      position: 'bottom',
    },
  ];
}
