import { describe, expect, it, vi } from 'vitest'
import { ApiError, type ApiClient } from '../../../shared/http'
import { HttpCatalogAdapter } from './HttpCatalogAdapter'
import { HttpCategoryAdapter } from './HttpCategoryAdapter'

const product = {
  id: 'camiseta-boss', slug: 'camiseta-boss', name: 'Camiseta Boss', priceInCents: 8990,
  installment: { count: 3, valueInCents: 2997 }, image: '/images/bossshirt.png',
  category: { id: 'camisetas', name: 'Camisetas', slug: 'camisetas' }, featured: true,
}

describe('adaptadores HTTP de catálogo', () => {
  it('mapeia centavos e query sem expor DTO à interface', async () => {
    const request = vi.fn().mockResolvedValue({ items: [product], page: 1, pageSize: 10, totalItems: 1, totalPages: 1 })
    const adapter = new HttpCatalogAdapter({ request } as ApiClient)

    await expect(adapter.list({ maximumPrice: 89.9, minimumPrice: 50, page: 1, pageSize: 10, search: 'boss', sort: 'newest' })).resolves.toMatchObject({
      items: [{ name: 'Camiseta Boss', price: 89.9 }], totalItems: 1,
    })
    expect(request).toHaveBeenCalledWith({ path: expect.stringContaining('maximumPrice=8990') })
    expect(request).toHaveBeenCalledWith({ path: expect.stringContaining('minimumPrice=5000') })
    expect(request).toHaveBeenCalledWith({ path: expect.stringContaining('search=boss') })
  })

  it('mantém contrato de leitor ao converter 404 em nulo', async () => {
    const adapter = new HttpCatalogAdapter({ request: vi.fn().mockRejectedValue(new ApiError('NOT_FOUND', 404)) })
    await expect(adapter.findBySlug('ausente')).resolves.toBeNull()
  })

  it('aceita URLs públicas de mídia e parcelamento ausente na API real', async () => {
    const catalog = new HttpCatalogAdapter({ request: vi.fn().mockResolvedValue({ ...product, description: 'Peça', image: 'https://media.msgriffe.com.br/catalog/boss.jpg', images: ['https://media.msgriffe.com.br/catalog/boss.jpg'], installment: undefined, variants: [] }) })
    const result = await catalog.findBySlug('camiseta-boss')
    expect(result).toMatchObject({ image: 'https://media.msgriffe.com.br/catalog/boss.jpg' })
    expect(result).not.toHaveProperty('installmentCount')
    expect(result).not.toHaveProperty('installmentValue')

    const categories = new HttpCategoryAdapter({ request: vi.fn().mockResolvedValue({ items: [{ ...product.category, image: '/images/bossshirt.png', productCount: 6 }] }) })
    await expect(categories.list()).resolves.toEqual([{ ...product.category, image: '/images/bossshirt.png', productCount: 6 }])
  })

  it('mapeia detalhe e preserva categoria ausente como nula', async () => {
    const catalog = new HttpCatalogAdapter({ request: vi.fn().mockResolvedValue({ ...product, description: 'Peça', images: ['/images/bossshirt.png'], variants: [{ id: 'camiseta-boss-preto-p', color: 'Preto', size: 'P', available: true }] }) })
    await expect(catalog.findBySlug('camiseta-boss')).resolves.toMatchObject({ description: 'Peça', variants: [{ available: true }] })

    const categories = new HttpCategoryAdapter({ request: vi.fn().mockRejectedValue(new ApiError('NOT_FOUND', 404)) })
    await expect(categories.findBySlug('ausente')).resolves.toBeNull()
  })
})
