import type { ImgHTMLAttributes, SyntheticEvent } from 'react'

const defaultFallback = '/images/product-placeholder.svg'

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

export function ImageWithFallback({
  fallbackSrc = defaultFallback,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    onError?.(event)
    const image = event.currentTarget

    if (image.dataset.fallbackApplied === 'true') return

    image.dataset.fallbackApplied = 'true'
    image.src = fallbackSrc
  }

  return <img {...props} onError={handleError} />
}
