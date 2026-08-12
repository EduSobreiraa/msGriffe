import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'wouter'

export function RouteAccessibility() {
  const [location] = useLocation()
  const previousLocation = useRef(location)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (previousLocation.current === location) return
    previousLocation.current = location

    const frame = window.requestAnimationFrame(() => {
      const main = document.querySelector<HTMLElement>('main')
      main?.focus()
      setAnnouncement(document.querySelector('h1')?.textContent?.trim() ?? 'Página atualizada')
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location])

  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {announcement}
    </p>
  )
}
