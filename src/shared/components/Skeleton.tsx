import type { CSSProperties, HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  height?: CSSProperties['height']
  width?: CSSProperties['width']
  radius?: CSSProperties['borderRadius']
}

export function Skeleton({
  className = '',
  height,
  width,
  radius,
  style,
  ...props
}: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      aria-hidden="true"
      style={{ width, height, borderRadius: radius, ...style }}
      {...props}
    />
  )
}
