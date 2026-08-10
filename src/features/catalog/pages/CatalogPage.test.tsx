import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MockCatalogAdapter } from '../adapters/MockCatalogAdapter'
import type { CatalogReader } from '../application/CatalogReader'
import { CatalogProvider } from '../presentation/CatalogProvider'
import { CatalogPage } from './CatalogPage'

function renderCatalog(reader: CatalogReader = new MockCatalogAdapter()) {
  return render(
    <CatalogProvider reader={reader}>
      <CatalogPage />
    </CatalogProvider>,
  )
}

describe('CatalogPage', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/produtos')
  })

  it('renderiza toolbar e primeira página do catálogo', async () => {
    renderCatalog()

    expect(
      screen.getByRole('heading', { name: 'Todos os produtos' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtrar/i })).toBeEnabled()
    expect(screen.getByRole('combobox', { name: 'Ordenar produtos' })).toBeEnabled()
    expect(await screen.findByText('12 produtos')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(10)
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('navega para a próxima página', async () => {
    renderCatalog()
    await screen.findByText('12 produtos')

    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }))

    expect(await screen.findByText('Short Boss Azul Premium')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(window.location.search).toBe('?pagina=2')
  })

  it('aplica e limpa filtros sincronizados com a URL', async () => {
    renderCatalog()
    await screen.findByText('12 produtos')

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: 'shorts' },
    })
    fireEvent.change(screen.getByLabelText('Preço mínimo'), {
      target: { value: '85' },
    })
    fireEvent.change(screen.getByLabelText('Preço máximo'), {
      target: { value: '90' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    expect(await screen.findByText('2 produtos')).toBeInTheDocument()
    expect(window.location.search).toContain('categoria=shorts')
    expect(window.location.search).toContain('precoMinimo=85')
    expect(window.location.search).toContain('precoMaximo=90')

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar (3)' }))
    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }))

    expect(await screen.findByText('12 produtos')).toBeInTheDocument()
    expect(window.location.search).toBe('')
  })

  it('valida a faixa de preço antes de aplicar', async () => {
    renderCatalog()
    await screen.findByText('12 produtos')
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))
    fireEvent.change(screen.getByLabelText('Preço mínimo'), {
      target: { value: '100' },
    })
    fireEvent.change(screen.getByLabelText('Preço máximo'), {
      target: { value: '50' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'O preço máximo deve ser maior ou igual ao preço mínimo.',
    )
    expect(window.location.search).toBe('')
  })

  it('ordena produtos e reinicia a paginação', async () => {
    window.history.replaceState(null, '', '/produtos?pagina=2')
    renderCatalog()
    await screen.findByText('Short Boss Azul Premium')

    fireEvent.change(screen.getByRole('combobox', { name: 'Ordenar produtos' }), {
      target: { value: 'price-desc' },
    })

    expect(await screen.findByText('Camiseta Boss Premium')).toBeInTheDocument()
    expect(window.location.search).toBe('?ordenacao=price-desc')
  })

  it('busca produtos, registra o termo na URL e reinicia a página', async () => {
    window.history.replaceState(null, '', '/produtos?pagina=2')
    renderCatalog()
    await screen.findByText('Short Boss Azul Premium')

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar produtos' }), {
      target: { value: 'premium' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(await screen.findByText('4 produtos')).toBeInTheDocument()
    expect(window.location.search).toBe('?busca=premium')
  })

  it('explica a ausência de resultados e permite limpar a busca', async () => {
    renderCatalog()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar produtos' }), {
      target: { value: 'produto inexistente' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(
      await screen.findByText('Não encontramos resultados para “produto inexistente”.'),
    ).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Limpar busca' })[1])

    expect(await screen.findByText('12 produtos')).toBeInTheDocument()
    expect(window.location.search).toBe('')
  })

  it('apresenta estado vazio', async () => {
    const reader: CatalogReader = {
      findBySlug: vi.fn().mockResolvedValue(null),
      list: vi.fn().mockResolvedValue({
        items: [],
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
      }),
    }

    renderCatalog(reader)

    expect(
      await screen.findByRole('heading', { name: 'Nenhum produto encontrado' }),
    ).toBeInTheDocument()
  })

  it('apresenta falha de carregamento', async () => {
    const reader: CatalogReader = {
      findBySlug: vi.fn().mockResolvedValue(null),
      list: vi
        .fn()
        .mockRejectedValueOnce(new Error('Falha simulada'))
        .mockResolvedValue({
          items: [],
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 1,
        }),
    }

    renderCatalog(reader)

    expect(
      await screen.findByRole('heading', {
        name: 'Não foi possível carregar o catálogo',
      }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(
      await screen.findByRole('heading', { name: 'Nenhum produto encontrado' }),
    ).toBeInTheDocument()
    expect(reader.list).toHaveBeenCalledTimes(2)
  })
})
