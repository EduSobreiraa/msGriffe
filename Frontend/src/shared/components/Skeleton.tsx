import type { HTMLAttributes } from 'react'

type SkeletonProps = Omit<HTMLAttributes<HTMLSpanElement>, 'style'>

export function Skeleton({
  className = '',
  ...props
}: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      aria-hidden="true"
      {...props}
    />
  )
}
