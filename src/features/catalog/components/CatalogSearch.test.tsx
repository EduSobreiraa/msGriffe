import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CatalogSearch } from './CatalogSearch'

describe('CatalogSearch', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('aguarda 300 ms antes de pesquisar durante a digitação', () => {
    vi.useFakeTimers()
    const onSearch = vi.fn()
    render(<CatalogSearch onSearch={onSearch} />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar produtos' }), {
      target: { value: 'boss' },
    })
    expect(onSearch).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(299))
    expect(onSearch).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(onSearch).toHaveBeenCalledWith('boss')
  })

  it('envia imediatamente e cancela a busca pendente', () => {
    vi.useFakeTimers()
    const onSearch = vi.fn()
    render(<CatalogSearch onSearch={onSearch} />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar produtos' }), {
      target: { value: '  camiseta  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('camiseta')
    act(() => vi.runAllTimers())
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('limpa o termo e devolve o foco ao campo', () => {
    const onSearch = vi.fn()
    render(<CatalogSearch value="boss" onSearch={onSearch} />)

    fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }))

    expect(onSearch).toHaveBeenCalledWith('')
    expect(screen.getByRole('searchbox', { name: 'Buscar produtos' })).toHaveFocus()
  })
})
