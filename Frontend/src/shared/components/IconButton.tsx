import { forwardRef, type ButtonHTMLAttributes, type PropsWithChildren } from 'react'
import type { IconName } from '../types/ui'
import { Icon } from './Icon'

type IconButtonProps = PropsWithChildren<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
    label: string
    icon: IconName
  }
>

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { children, className = '', icon, label, type = 'button', ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={`icon-button ${className}`.trim()}
        type={type}
        aria-label={label}
        {...props}
      >
        <Icon name={icon} />
        {children}
      </button>
    )
  },
)
