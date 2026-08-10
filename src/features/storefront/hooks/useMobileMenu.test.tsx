import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMobileMenu } from './useMobileMenu'

function MobileMenuHarness() {
  const { isOpen, toggle, triggerRef } = useMobileMenu()

  return (
    <button ref={triggerRef} type="button" onClick={toggle}>
      {isOpen ? 'Aberto' : 'Fechado'}
    </button>
  )
}

describe('useMobileMenu', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.classList.remove('mobile-menu-open')
  })

  it('fecha o menu quando a viewport muda para desktop', () => {
    let viewportListener: ((event: MediaQueryListEvent) => void) | undefined

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        matches: false,
        media: '(min-width: 701px)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (
          _type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) => {
          viewportListener = listener
        },
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    )

    render(<MobileMenuHarness />)
    fireEvent.click(screen.getByRole('button', { name: 'Fechado' }))
    expect(screen.getByRole('button', { name: 'Aberto' })).toBeInTheDocument()

    act(() => {
      viewportListener?.({ matches: true } as MediaQueryListEvent)
    })

    expect(screen.getByRole('button', { name: 'Fechado' })).toBeInTheDocument()
    expect(document.body).not.toHaveClass('mobile-menu-open')
  })
})
