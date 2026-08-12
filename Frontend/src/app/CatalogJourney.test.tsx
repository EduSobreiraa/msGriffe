import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderAppAt } from '../test/renderAppAt'

describe('jornada pública do catálogo', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('parte da vitrine, refina resultados e abre um produto', async () => {
    renderAppAt('/')
    await screen.findByText('Camiseta Boss')

    fireEvent.click(screen.getByRole('link', { name: 'VER PRODUTOS' }))
    expect(
      await screen.findByRole('heading', { name: 'Todos os produtos' }),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar produtos' }), {
      target: { value: 'premium' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(await screen.findByText('4 produtos')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox', { name: 'Ordenar produtos' }), {
      target: { value: 'price-desc' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: 'camisetas' },
    })
    fireEvent.change(screen.getByLabelText('Preço mínimo'), {
      target: { value: '90' },
    })
    fireEvent.change(screen.getByLabelText('Preço máximo'), {
      target: { value: '110' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    expect(await screen.findByText('2 produtos')).toBeInTheDocument()
    expect(window.location.search).toBe(
      '?categoria=camisetas&busca=premium&precoMinimo=90&precoMaximo=110&ordenacao=price-desc',
    )

    fireEvent.click(
      screen.getByRole('link', { name: 'Ver detalhes de Camiseta Boss Premium' }),
    )

    expect(
      await screen.findByRole('heading', { name: 'Camiseta Boss Premium' }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/produtos/camiseta-boss-premium')
    expect(document.title).toBe('Camiseta Boss Premium | MS Griffe')
    expect(document.querySelector('script[type="application/ld+json"]')).toHaveTextContent(
      'Camiseta Boss Premium',
    )
  })

  it('navega por categorias, usa breadcrumbs e restaura uma URL compartilhável', async () => {
    renderAppAt('/categorias')
    expect(await screen.findByRole('heading', { name: 'Categorias' })).toBeInTheDocument()

    fireEvent.click(
      await screen.findByRole('link', { name: 'Ver Shorts: 6 produtos' }),
    )
    expect(await screen.findByRole('heading', { name: 'Shorts' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/categorias/shorts')

    fireEvent.click(
      await screen.findByRole('link', { name: 'Ver detalhes de Short Boss Azul' }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Short Boss Azul' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Shorts' }))
    expect(await screen.findByRole('heading', { name: 'Shorts' })).toBeInTheDocument()
    expect(await screen.findByText('6 produtos')).toBeInTheDocument()

    window.history.replaceState(
      null,
      '',
      '/produtos?busca=faixa&ordenacao=name-asc',
    )
    fireEvent.popState(window)

    expect(
      await screen.findByRole('heading', { name: 'Todos os produtos' }),
    ).toBeInTheDocument()
    expect(await screen.findByText('2 produtos')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Buscar produtos' })).toHaveValue(
      'faixa',
    )
    expect(screen.getByRole('combobox', { name: 'Ordenar produtos' })).toHaveValue(
      'name-asc',
    )
    await waitFor(() => expect(document.title).toBe('Produtos | MS Griffe'))
  })

  it('resolve diretamente uma URL de produto compartilhada', async () => {
    renderAppAt('/produtos/short-boss-cinza-premium')

    expect(
      await screen.findByRole('heading', { name: 'Short Boss Cinza Premium' }),
    ).toBeInTheDocument()
    expect(screen.getByText('R$ 89,90')).toBeInTheDocument()
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${window.location.origin}/produtos/short-boss-cinza-premium`,
    )
  })
})
