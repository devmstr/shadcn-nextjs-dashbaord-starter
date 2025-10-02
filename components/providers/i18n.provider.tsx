'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
// import locales
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

i18n
  .use(LanguageDetector) // auto-detect browser language
  .use(initReactI18next) // hooks up with react
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already escapes
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage']
    }
  })

import { I18nextProvider } from 'react-i18next'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
