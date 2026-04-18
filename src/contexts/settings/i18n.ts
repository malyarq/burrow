import en from '../../locales/en.json';
import ru from '../../locales/ru.json';
import type { Language } from './types';

interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = { en, ru };

export const LANGUAGE_LOCALES: Record<Language, string> = {
  en: 'en-US',
  ru: 'ru-RU',
};

export function getLocaleForLanguage(language: Language) {
  return LANGUAGE_LOCALES[language] ?? LANGUAGE_LOCALES.en;
}

export function createTranslator(language: Language) {
  return (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      });
    }
    return text;
  };
}
