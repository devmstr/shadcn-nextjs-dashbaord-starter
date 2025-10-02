'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import i18n from 'i18next'
import {
  initReactI18next,
  useTranslation as useI18NextTranslation
} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// import locales
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

export type Language = 'en' | 'ar'

const DEFAULT_LANGUAGE: Language = 'en'
const LANGUAGE_COOKIE_NAME = 'lang'
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

// 🔹 Initialize i18next once
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ar: { translation: ar }
      },
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: ['en', 'ar'],
      interpolation: { escapeValue: false },
      detection: {
        order: ['cookie', 'localStorage', 'navigator']
        // INFO: remove cahing cause we use our custom cookie called lang not the default i18next
        // caches: ['cookie', 'localStorage']
      }
    })
}

type I18nContextType = {
  language: Language
  changeLanguage: (lang: Language) => void
  resetLanguage: () => void
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Always start with DEFAULT_LANGUAGE to avoid SSR mismatch
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)

  // On client: sync from cookie/i18next
  useEffect(() => {
    const cookieLang =
      (getCookie(LANGUAGE_COOKIE_NAME) as Language) || i18n.language
    if (cookieLang && cookieLang !== language) {
      setLanguage(cookieLang)
      i18n.changeLanguage(cookieLang)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
    setCookie(LANGUAGE_COOKIE_NAME, lang, LANGUAGE_COOKIE_MAX_AGE)
  }

  const resetLanguage = () => {
    setLanguage(DEFAULT_LANGUAGE)
    i18n.changeLanguage(DEFAULT_LANGUAGE)
    removeCookie(LANGUAGE_COOKIE_NAME)
  }

  return (
    <I18nContext.Provider value={{ language, changeLanguage, resetLanguage }}>
      {children}
    </I18nContext.Provider>
  )
}

// Custom hook wrapping react-i18next's useTranslation
export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  const { t } = useI18NextTranslation()
  return { t, ...context }
}
