'use client'

import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  // Update <meta name="theme-color">
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="scale-95 rounded-full"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Moon className="size-[1.2rem]" />
      ) : (
        <Sun className="size-[1.2rem]" />
      )}
    </Button>
  )
}
