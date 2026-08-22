import { describe, expect, it } from 'vitest'
import { CatalogService } from './CatalogService.js'
import type { CatalogRepository } from './catalogContracts.js'

const products = [
  { category: { id: 'camisetas', name: 'Camisetas', slug: 'camisetas' }, createdAt: new Date('2026-08-01'), description: 'Produto um', id: 'one', name: 'Boss', slug: 'boss', variants: [{ color: 'Preto', id: 'one-p', isActive: true, priceInCents: 8990, size: 'P', stock: 1 }, { color: 'Branco', id: 'one-m', isActive: false, priceInCents: 100, size: 'M', stock: 99 }] },
  { category: { id: 'calcas', name: 'Calças', slug: 'calcas' }, createdAt: new Date('2026-08-02'), description: 'Produto dois', id: 'two', name: 'Alfa', slug: 'alfa', variants: [{ color: 'Azul', id: 'two-p', isActive: true, priceInCents: 12990, size: 'P', stock: 0 }] },
]

const repository: CatalogRepository = {
  findActiveProductBySlug: async (slug) => products.find((product) => product.slug === slug) ?? null,
  listActiveProducts: async ({ categorySlug, search }) => products.filter((product) => (!categorySlug || product.category.slug === categorySlug) && (!search || product.name.toLowerCase().includes(search.toLowerCase()))),
}

describe('CatalogService', () => {
  it('lista preço mínimo, disponibilidade, filtros e paginação sem expor estoque', async () => {
    const result = await new CatalogService(repository).list({ maximumPrice: 10_000, page: 4, pageSize: 1, search: 'boss', sort: 'price-asc' })
    expect(result).toMatchObject({ items: [{ available: true, id: 'one', priceInCents: 8990 }], page: 1, totalItems: 1, totalPages: 1 })
    expect(JSON.stringify(result)).not.toContain('stock')
  })

  it('retorna detalhe ativo e não revela produto ausente', async () => {
    const service = new CatalogService(repository)
    await expect(service.getBySlug('boss')).resolves.toMatchObject({ available: true, variants: [{ available: true, id: 'one-p' }] })
    await expect(service.getBySlug('ausente')).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 })
  })
})
