import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { CategoryReader } from '../application/CategoryReader'
import { CategoryProvider } from '../presentation/CategoryProvider'
import { CategoriesPage } from './CategoriesPage'

function renderCategories(reader: CategoryReader) {
  return render(
    <CategoryProvider reader={reader}>
      <CategoriesPage />
    </CategoryProvider>,
  )
}

describe('CategoriesPage', () => {
  it('lista destinos reais e suas contagens', async () => {
    renderCategories({
      findBySlug: vi.fn(),
      list: vi.fn().mockResolvedValue([
        {
          id: 'camisetas',
          image: '/camiseta.png',
          name: 'Camisetas',
          productCount: 6,
          slug: 'camisetas',
        },
      ]),
    })

    expect(await screen.findByRole('link', { name: 'Ver Camisetas: 6 produtos' })).toHaveAttribute(
      'href',
      '/categorias/camisetas',
    )
  })

  it('apresenta estado vazio', async () => {
    renderCategories({
      findBySlug: vi.fn(),
      list: vi.fn().mockResolvedValue([]),
    })

    expect(await screen.findByText('Nenhuma categoria disponível')).toBeInTheDocument()
  })

  it('recupera uma falha ao tentar novamente', async () => {
    const list = vi
      .fn()
      .mockRejectedValueOnce(new Error('falha'))
      .mockResolvedValue([])

    renderCategories({ findBySlug: vi.fn(), list })

    expect(
      await screen.findByText('Não foi possível carregar as categorias'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findByText('Nenhuma categoria disponível')).toBeInTheDocument()
    expect(list).toHaveBeenCalledTimes(2)
  })
})
