import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppErrorBoundary } from './AppErrorBoundary'

function BrokenPage(): never {
  throw new Error('detalhe interno que não pode aparecer')
}

describe('AppErrorBoundary', () => {
  afterEach(() => vi.restoreAllMocks())

  it('oculta detalhe interno e oferece recuperação acessível', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    render(<AppErrorBoundary><BrokenPage /></AppErrorBoundary>)

    expect(screen.getByRole('heading', { name: 'Não foi possível abrir esta página' })).toHaveFocus()
    expect(screen.queryByText(/detalhe interno/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para início' })).toHaveAttribute('href', '/')
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(screen.getByRole('heading', { name: 'Não foi possível abrir esta página' })).toBeInTheDocument()
  })
})
