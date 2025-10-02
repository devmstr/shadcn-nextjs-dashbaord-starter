'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { DirectionProvider as RdxDirProvider } from '@radix-ui/react-direction'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

export type Direction = 'ltr' | 'rtl'

const DEFAULT_DIRECTION: Direction = 'ltr'
const DIRECTION_COOKIE_NAME = 'dir'
const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type DirectionContextType = {
  defaultDir: Direction
  dir: Direction
  setDir: (dir: Direction) => void
  resetDir: () => void
}

const DirectionContext = createContext<DirectionContextType | null>(null)

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  // Always start with DEFAULT to avoid SSR/CSR mismatch
  const [dir, _setDir] = useState<Direction>(DEFAULT_DIRECTION)

  // On client, check cookie and update if needed
  useEffect(() => {
    const cookieDir = getCookie(DIRECTION_COOKIE_NAME) as Direction | undefined
    if (cookieDir && cookieDir !== dir) {
      _setDir(cookieDir)
    }
  }, [])

  // Apply dir attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('dir', dir)
  }, [dir])

  const setDir = (newDir: Direction) => {
    _setDir(newDir)
    setCookie(DIRECTION_COOKIE_NAME, newDir, DIRECTION_COOKIE_MAX_AGE)
  }

  const resetDir = () => {
    _setDir(DEFAULT_DIRECTION)
    removeCookie(DIRECTION_COOKIE_NAME)
  }

  return (
    <DirectionContext.Provider
      value={{
        defaultDir: DEFAULT_DIRECTION,
        dir,
        setDir,
        resetDir
      }}
    >
      <RdxDirProvider dir={dir}>{children}</RdxDirProvider>
    </DirectionContext.Provider>
  )
}

export function useDirection() {
  const context = useContext(DirectionContext)
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider')
  }
  return context
}
