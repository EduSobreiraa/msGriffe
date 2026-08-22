import { describe, expect, it } from 'vitest'
import { CatalogService } from './CatalogService.js'
import type { CatalogCategoryRecord, CatalogProductRecord, CatalogRepository } from './catalogContracts.js'

const products: CatalogProductRecord[] = [
  { category: { id: 'camisetas', name: 'Camisetas', slug: 'camisetas' }, createdAt: new Date('2026-08-01'), description: 'Produto um', id: 'one', images: [{ objectKey: 'catalog/boss.jpg' }], isFeatured: true, name: 'Boss', slug: 'boss', variants: [{ color: 'Preto', id: 'one-p', isActive: true, priceInCents: 8990, size: 'P', stock: 1 }, { color: 'Branco', id: 'one-m', isActive: false, priceInCents: 100, size: 'M', stock: 99 }] },
  { category: { id: 'calcas', name: 'Calças', slug: 'calcas' }, createdAt: new Date('2026-08-02'), description: 'Produto dois', id: 'two', images: [], isFeatured: false, name: 'Alfa', slug: 'alfa', variants: [{ color: 'Azul', id: 'two-p', isActive: true, priceInCents: 12990, size: 'P', stock: 0 }] },
]

const categories: CatalogCategoryRecord[] = [
  { id: 'camisetas', imageObjectKey: 'categories/camisetas.jpg', name: 'Camisetas', productCount: 1, slug: 'camisetas' },
  { id: 'calcas', imageObjectKey: null, name: 'Calças', productCount: 1, slug: 'calcas' },
]

const repository: CatalogRepository = {
  findPublicCategoryBySlug: async (slug) => categories.find((category) => category.slug === slug) ?? null,
  findActiveProductBySlug: async (slug) => products.find((product) => product.slug === slug) ?? null,
  listPublicCategories: async () => categories,
  listActiveProducts: async ({ categorySlug, featured, search }) => products.filter((product) => (!categorySlug || product.category.slug === categorySlug) && (featured === undefined || product.isFeatured === featured) && (!search || product.name.toLowerCase().includes(search.toLowerCase()))),
}

describe('CatalogService', () => {
  it('lista preço mínimo, disponibilidade, filtros e paginação sem expor estoque', async () => {
    const result = await new CatalogService(repository).list({ categorySlug: 'camisetas', featured: true, maximumPrice: 10_000, page: 4, pageSize: 1, search: 'boss', sort: 'price-asc' })
    expect(result).toMatchObject({ items: [{ available: true, featured: true, id: 'one', imageObjectKeys: ['catalog/boss.jpg'], priceInCents: 8990 }], page: 1, totalItems: 1, totalPages: 1 })
    expect(JSON.stringify(result)).not.toContain('stock')
  })

  it('retorna detalhe ativo e não revela produto ausente', async () => {
    const service = new CatalogService(repository)
    await expect(service.getBySlug('boss')).resolves.toMatchObject({ available: true, variants: [{ available: true, id: 'one-p' }] })
    await expect(service.getBySlug('ausente')).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 })
  })

  it('lista categorias públicas e não revela categoria sem produto público', async () => {
    const service = new CatalogService(repository)
    await expect(service.listCategories()).resolves.toEqual(categories)
    await expect(service.getCategoryBySlug('calcas')).resolves.toEqual(categories[1])
    await expect(service.getCategoryBySlug('ausente')).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 })
  })

  it.each(['name-asc', 'newest', 'price-asc', 'price-desc'] as const)('ordena empates de %s por identificador estável', async (sort) => {
    const baseProduct = products[0]!
    const tiedProducts: CatalogProductRecord[] = ['two', 'one'].map((id) => ({
      ...baseProduct,
      createdAt: new Date('2026-08-03'),
      id,
      name: 'Mesmo produto',
      slug: `produto-${id}`,
      variants: [{ color: 'Preto', id: `${id}-p`, isActive: true, priceInCents: 8990, size: 'P', stock: 1 }],
    }))
    const service = new CatalogService({ ...repository, listActiveProducts: async () => tiedProducts })

    await expect(service.list({ page: 1, pageSize: 10, sort })).resolves.toMatchObject({
      items: [{ id: 'one' }, { id: 'two' }],
    })
  })
})
