'use client'

import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'
import { useDirection } from '@/components/providers/direction-provider'
import { useTranslation } from '@/components/providers/i18n.provider'

export function LanguageSwitch() {
  const { dir, setDir } = useDirection()
  const { language, changeLanguage } = useTranslation()

  const toggle = () => {
    const newLang = language === 'en' ? 'ar' : 'en'
    changeLanguage(newLang)
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
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  )
}
