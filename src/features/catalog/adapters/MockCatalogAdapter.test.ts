import { describe, expect, it } from 'vitest'
import type { CatalogQuery } from '../application/CatalogReader'
import { MockCatalogAdapter } from './MockCatalogAdapter'

const baseQuery: CatalogQuery = {
  page: 1,
  pageSize: 10,
  sort: 'newest',
}

describe('MockCatalogAdapter', () => {
  const adapter = new MockCatalogAdapter()

  it('lista produtos com metadados de paginação', async () => {
    const result = await adapter.list(baseQuery)

    expect(result.items).toHaveLength(10)
    expect(result).toMatchObject({
      page: 1,
      pageSize: 10,
      totalItems: 12,
      totalPages: 2,
    })
  })

  it('filtra busca sem diferenciar acentos ou caixa', async () => {
    const result = await adapter.list({ ...baseQuery, search: 'FAIXA REFLETIVA' })

    expect(result.items.map((product) => product.slug)).toEqual([
      'camiseta-faixa-refletiva',
    ])
  })

  it('filtra categoria e ordena por preço e nome', async () => {
    const shorts = await adapter.list({
      ...baseQuery,
      categorySlug: 'shorts',
      sort: 'name-asc',
    })
    const descendingPrice = await adapter.list({
      ...baseQuery,
      sort: 'price-desc',
    })

    expect(shorts.items).toHaveLength(6)
    expect(descendingPrice.items[0].price).toBe(109.9)
  })

  it('limita a página ao intervalo disponível', async () => {
    const result = await adapter.list({
      ...baseQuery,
      page: 99,
      pageSize: 2,
      sort: 'price-asc',
    })

    expect(result.page).toBe(6)
    expect(result.items).toHaveLength(2)
  })

  it('filtra por faixa de preço inclusiva', async () => {
    const result = await adapter.list({
      ...baseQuery,
      minimumPrice: 90,
      maximumPrice: 100,
    })

    expect(result.items.length).toBeGreaterThan(0)
    expect(
      result.items.every((product) => product.price >= 90 && product.price <= 100),
    ).toBe(true)
  })

  it('encontra produto pelo slug e retorna null quando ausente', async () => {
    await expect(adapter.findBySlug('camiseta-boss')).resolves.toMatchObject({
      name: 'Camiseta Boss',
    })
    await expect(adapter.findBySlug('inexistente')).resolves.toBeNull()
  })
})
