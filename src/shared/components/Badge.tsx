import type { HTMLAttributes, PropsWithChildren } from 'react'

type BadgeProps = PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    accessibleLabel?: string
  }
>

export function Badge({
  accessibleLabel,
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`badge ${className}`.trim()}
      aria-label={accessibleLabel}
      {...props}
    >
      {children}
    </span>
  )
}
