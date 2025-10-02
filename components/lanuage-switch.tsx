'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'
import { useDirection } from '@/components/providers/direction-provider'
import { useTranslation } from 'react-i18next'
import { getCookie } from '@/lib/cookies'

const LANGUAGE_COOKIE = 'i18next'
const DEFAULT_LANG = 'en'

export function LanguageSwitch() {
  const { setDir } = useDirection()
  const { i18n } = useTranslation()
  const [lang, setLang] = useState(DEFAULT_LANG)

  // On mount → sync with cookie or fallback
  useEffect(() => {
    const cookieLang = getCookie(LANGUAGE_COOKIE)

    const initialLang = cookieLang || DEFAULT_LANG
    setLang(initialLang)
    i18n.changeLanguage(initialLang)
    setDir(initialLang === 'ar' ? 'rtl' : 'ltr')
  }, [i18n, setDir])

  const toggle = () => {
    const newLang = lang === 'en' ? 'ar' : 'en'
    setLang(newLang)
    i18n.changeLanguage(newLang)
    setDir(newLang === 'ar' ? 'rtl' : 'ltr')
  }

  return (
    <Button
      onClick={toggle}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 rounded-xl border-primary/40 bg-background hover:bg-primary/10 transition"
      aria-label="Toggle language and direction"
    >
      <Languages className="h-4 w-4" />
      <span className="font-semibold">
        {lang === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  )
}
