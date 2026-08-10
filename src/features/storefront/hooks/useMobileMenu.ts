import { useCallback, useEffect, useRef, useState } from 'react'

const desktopMediaQuery = '(min-width: 701px)'

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback((returnFocus = false) => {
    setIsOpen(false)

    if (returnFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus())
    }
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((current) => !current)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    document.body.classList.add('mobile-menu-open')

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('mobile-menu-open')
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, isOpen])

  useEffect(() => {
    if (!window.matchMedia) return

    const mediaQuery = window.matchMedia(desktopMediaQuery)
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) close()
    }

    mediaQuery.addEventListener('change', handleViewportChange)
    return () => mediaQuery.removeEventListener('change', handleViewportChange)
  }, [close])

  return { close, isOpen, toggle, triggerRef }
}
