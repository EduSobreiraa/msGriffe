import type { ReactNode } from 'react'
import type { IconName } from '../types/ui'

interface IconProps {
  name: IconName
}

export function Icon({ name }: IconProps) {
  const icons: Record<IconName, ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4.2-4.2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.7-4.4 3.4-6.5 8-6.5s7.3 2.1 8 6.5" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l1 13H5L6 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    card: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 9h20M6 15h4" />
      </>
    ),
    'chevron-left': <path d="m15 18-6-6 6-6" />,
    'chevron-right': <path d="m9 18 6-6-6-6" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    headset: (
      <>
        <path d="M4 13a8 8 0 0 1 16 0M4 13v5h4v-5H4Zm12 0v5h4v-5h-4ZM16 20c-1 1-2.3 1.5-4 1.5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-3Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5M4 17v-5h5M6.5 7.5A7 7 0 0 1 18 9M17.5 16.5A7 7 0 0 1 6 15" />
      </>
    ),
    sliders: <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </>
    ),
    x: <path d="m6 6 12 12M18 6 6 18" />,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[name]}
    </svg>
  )
}
