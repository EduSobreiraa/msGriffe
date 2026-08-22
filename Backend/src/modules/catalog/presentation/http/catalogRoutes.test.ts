import { afterEach, describe, expect, it, vi } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { createApplication } from '../../../../app/createApplication.js'
import { ApplicationError } from '../../../../shared/errors/ApplicationError.js'

const environment = {
  accessTokenSecret: 'test-access-token-secret-that-has-at-least-32-characters',
  accessTokenTtlSeconds: 900,
  accountUrl: 'https://staging.msgriffe.com.br',
  corsAllowedOrigins: ['https://staging.msgriffe.com.br'],
  host: '127.0.0.1',
  mediaPublicBaseUrl: 'https://media.msgriffe.com.br',
  nodeEnvironment: 'test' as const,
  port: 3000,
  refreshSessionTtlDays: 14,
  sessionCookieSameSite: 'lax' as const,
  sessionCookieSecure: false,
}

const product = {
  available: true,
  category: { id: 'camisetas', name: 'Camisetas', slug: 'camisetas' },
  createdAt: new Date('2026-08-01'),
  featured: true,
  id: 'camiseta-boss',
  imageObjectKeys: ['catalog/boss.jpg', 'catalog/boss-detail.jpg'],
  name: 'Camiseta Boss',
  priceInCents: 8990,
  slug: 'camiseta-boss',
}

describe('catalog routes', () => {
  let application: FastifyInstance | undefined

  afterEach(async () => application?.close())

  it('valida a consulta e apresenta imagens públicas sem expor chaves ou estoque', async () => {
    const catalogService = {
      getCategoryBySlug: vi.fn(),
      getBySlug: vi.fn(),
      list: vi.fn().mockResolvedValue({ items: [product], page: 1, pageSize: 10, totalItems: 1, totalPages: 1 }),
      listCategories: vi.fn(),
    }
    application = await createApplication(environment, { catalogService })

    const response = await application.inject({ method: 'GET', url: '/v1/catalog/products?categorySlug=camisetas&featured=true&maximumPrice=9990&minimumPrice=8990&page=1&pageSize=10&search=boss&sort=price-asc' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      items: [{
        category: product.category,
        featured: true,
        id: product.id,
        image: 'https://media.msgriffe.com.br/catalog/boss.jpg',
        name: product.name,
        priceInCents: 8990,
        slug: product.slug,
      }],
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
    })
    expect(catalogService.list).toHaveBeenCalledWith(expect.objectContaining({ categorySlug: 'camisetas', featured: true, maximumPrice: 9990, minimumPrice: 8990, page: 1, pageSize: 10, search: 'boss', sort: 'price-asc' }))
    expect(response.body).not.toContain('imageObjectKeys')
    expect(response.body).not.toContain('stock')
  })

  it('expõe detalhe pelo serviço de aplicação e converte falhas de domínio', async () => {
    const catalogService = {
      getCategoryBySlug: vi.fn(),
      getBySlug: vi.fn().mockResolvedValue({ ...product, description: 'Peça pública', variants: [{ available: true, color: 'Preto', id: 'boss-preto-p', priceInCents: 8990, size: 'P' }] }),
      list: vi.fn(),
      listCategories: vi.fn(),
    }
    application = await createApplication(environment, { catalogService })

    const response = await application.inject({ method: 'GET', url: '/v1/catalog/products/camiseta-boss' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      description: 'Peça pública',
      image: 'https://media.msgriffe.com.br/catalog/boss.jpg',
      images: ['https://media.msgriffe.com.br/catalog/boss.jpg', 'https://media.msgriffe.com.br/catalog/boss-detail.jpg'],
      variants: [{ available: true, color: 'Preto', id: 'boss-preto-p', size: 'P' }],
    })
    expect(catalogService.getBySlug).toHaveBeenCalledWith('camiseta-boss')
  })

  it('rejeita filtros e paginação inválidos antes de chamar aplicação', async () => {
    const catalogService = { getCategoryBySlug: vi.fn(), getBySlug: vi.fn(), list: vi.fn(), listCategories: vi.fn() }
    application = await createApplication(environment, { catalogService })

    const response = await application.inject({ method: 'GET', url: '/v1/catalog/products?featured=yes&minimumPrice=9000&maximumPrice=8990&page=0&pageSize=101&search=' })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
    expect(catalogService.list).not.toHaveBeenCalled()
  })

  it('expõe categorias públicas, resolve somente chaves presentes e aceita imagem ausente', async () => {
    const categories = [
      { id: 'camisetas', imageObjectKey: 'categories/camisetas.jpg', name: 'Camisetas', productCount: 3, slug: 'camisetas' },
      { id: 'calcas', imageObjectKey: null, name: 'Calças', productCount: 1, slug: 'calcas' },
    ]
    const catalogService = {
      getCategoryBySlug: vi.fn().mockResolvedValue(categories[1]),
      getBySlug: vi.fn(),
      list: vi.fn(),
      listCategories: vi.fn().mockResolvedValue(categories),
    }
    application = await createApplication(environment, { catalogService })

    const list = await application.inject({ method: 'GET', url: '/v1/catalog/categories' })
    const detail = await application.inject({ method: 'GET', url: '/v1/catalog/categories/calcas' })

    expect(list.statusCode).toBe(200)
    expect(list.json()).toEqual({
      items: [
        { id: 'camisetas', image: 'https://media.msgriffe.com.br/categories/camisetas.jpg', name: 'Camisetas', productCount: 3, slug: 'camisetas' },
        { id: 'calcas', image: null, name: 'Calças', productCount: 1, slug: 'calcas' },
      ],
    })
    expect(detail.statusCode).toBe(200)
    expect(detail.json()).toEqual({ id: 'calcas', image: null, name: 'Calças', productCount: 1, slug: 'calcas' })
    expect(catalogService.getCategoryBySlug).toHaveBeenCalledWith('calcas')
    expect(list.body).not.toContain('imageObjectKey')
  })

  it('não revela categoria inexistente', async () => {
    const catalogService = {
      getCategoryBySlug: vi.fn().mockRejectedValue(new ApplicationError('NOT_FOUND', 404)),
      getBySlug: vi.fn(),
      list: vi.fn(),
      listCategories: vi.fn(),
    }
    application = await createApplication(environment, { catalogService })

    const response = await application.inject({ method: 'GET', url: '/v1/catalog/categories/inexistente' })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({ error: { code: 'NOT_FOUND' } })
    expect(response.body).not.toContain('inexistente')
  })

  it('nunca permite que objectKey altere origem ou caminho público de mídia', async () => {
    const unsafeProduct = { ...product, imageObjectKeys: ['https://external.example/image.jpg', '../private.jpg', '/catalog/boss photo.jpg'] }
    const catalogService = {
      getCategoryBySlug: vi.fn().mockResolvedValue({ id: 'camisetas', imageObjectKey: 'https://external.example/category.jpg', name: 'Camisetas', productCount: 1, slug: 'camisetas' }),
      getBySlug: vi.fn().mockResolvedValue({ ...unsafeProduct, description: 'Peça pública', variants: [] }),
      list: vi.fn().mockResolvedValue({ items: [unsafeProduct], page: 1, pageSize: 10, totalItems: 1, totalPages: 1 }),
      listCategories: vi.fn(),
    }
    application = await createApplication(environment, { catalogService })

    const list = await application.inject({ method: 'GET', url: '/v1/catalog/products' })
    const detail = await application.inject({ method: 'GET', url: '/v1/catalog/products/camiseta-boss' })
    const category = await application.inject({ method: 'GET', url: '/v1/catalog/categories/camisetas' })

    expect(list.json()).toMatchObject({ items: [{ image: 'https://media.msgriffe.com.br/catalog/boss%20photo.jpg' }] })
    expect(detail.json()).toMatchObject({ images: ['https://media.msgriffe.com.br/catalog/boss%20photo.jpg'] })
    expect(category.json()).toMatchObject({ image: null })
    expect(`${list.body}${detail.body}${category.body}`).not.toContain('external.example')
    expect(`${list.body}${detail.body}`).not.toContain('private.jpg')
  })
})
