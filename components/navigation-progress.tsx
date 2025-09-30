'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar'

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Start the loading bar whenever pathname changes
    ref.current?.continuousStart()

    // Complete it shortly after (simulate page load finishing)
    const timeout = setTimeout(() => {
      ref.current?.complete()
    }, 500) // tweak timing as needed

    return () => clearTimeout(timeout)
  }, [pathname])

  return (
    <LoadingBar color="var(--muted-foreground)" ref={ref} shadow height={2} />
  )
}
