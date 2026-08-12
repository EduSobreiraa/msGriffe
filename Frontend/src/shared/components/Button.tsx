import { forwardRef } from 'react'
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'medium' | 'small'

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps
>

type ButtonLinkProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
  }
>

function getButtonClassName({
  className = '',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
}: ButtonStyleProps & { className?: string }) {
  return [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  children,
  className,
  variant,
  size,
  fullWidth,
  type = 'button',
  ...props
}, ref) {
  return (
    <button
      className={getButtonClassName({ className, variant, size, fullWidth })}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
})

export function ButtonLink({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  fullWidth,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={getButtonClassName({
        className,
        variant,
        size,
        fullWidth,
      })}
      {...props}
    >
      {children}
    </a>
  )
}
