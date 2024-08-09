import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en, ita } from './translationExport'

const STORE_LANGUAGE_KEY = 'settings.lang'

const resources = {
  en: {
    translation: en,
  },
  ita: {
    translation: ita,
  },
}

const defaultLanguage = 'ita' // Set your default language here

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v3',
  fallbackLng: defaultLanguage, // Set the default language
  interpolation: {
    escapeValue: false,
  },
})
