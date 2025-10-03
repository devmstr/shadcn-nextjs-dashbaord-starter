'use client'

import { useEffect, useState } from 'react'
import Image, { ImageProps } from 'next/image'

interface Props extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  fallback?: string
}

export const ImageWithFallback = ({
  fallback = '/image-fallback.svg',
  src,
  alt,
  ...props
}: Props) => {
  const [hasError, setHasError] = useState(false)

  // Reset error when src changes
  useEffect(() => {
    setHasError(false)
  }, [src])

  return (
    <Image
      {...props}
      src={hasError ? fallback : src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  )
}
