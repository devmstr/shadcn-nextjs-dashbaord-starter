'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

export type Language = 'en' | 'ar'

interface I18nContextProps {
  t: (key: string) => string
  language: Language
  isRTL: boolean
  changeLanguage: (lang: Language) => void
}

const dictionaries = { en, ar }

const I18nContext = createContext<I18nContextProps | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    const keys = key.split('.')
    let result: any = dictionaries[language]
    for (const k of keys) {
      result = result?.[k]
    }
    return result ?? key // fallback to raw key
  }

  const changeLanguage = (lang: Language) => setLanguage(lang)

  return (
    <I18nContext.Provider
      value={{ t, language, isRTL: language === 'ar', changeLanguage }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider')
  return ctx
}
