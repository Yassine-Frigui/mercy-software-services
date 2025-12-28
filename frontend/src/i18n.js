import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './Assets/translations/english.json';
import fr from './Assets/translations/french.json';

const resources = {
    en: {
        translation: en
    },
    fr: {
        translation: fr
    }
};



i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;