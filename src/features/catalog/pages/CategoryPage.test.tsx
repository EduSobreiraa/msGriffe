import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MockCatalogAdapter } from '../adapters/MockCatalogAdapter'
import { CatalogProvider } from '../presentation/CatalogProvider'
import { CategoryProvider } from '../presentation/CategoryProvider'
import { CategoryPage } from './CategoryPage'

describe('CategoryPage', () => {
  it('recupera a consulta da categoria sem abandonar a rota', async () => {
    const findBySlug = vi
      .fn()
      .mockRejectedValueOnce(new Error('falha'))
      .mockResolvedValue({
        id: 'camisetas',
        image: '/camiseta.png',
        name: 'Camisetas',
        productCount: 6,
        slug: 'camisetas',
      })

    render(
      <CatalogProvider reader={new MockCatalogAdapter()}>
        <CategoryProvider reader={{ findBySlug, list: vi.fn() }}>
          <CategoryPage params={{ categorySlug: 'camisetas' }} />
        </CategoryProvider>
      </CatalogProvider>,
    )

    expect(
      await screen.findByRole('heading', { name: 'Não foi possível carregar a categoria' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findByRole('heading', { name: 'Camisetas' })).toBeInTheDocument()
    expect(findBySlug).toHaveBeenCalledTimes(2)
  })
})
