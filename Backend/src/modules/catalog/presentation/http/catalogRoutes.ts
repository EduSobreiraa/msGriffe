import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type { CatalogService } from '../../application/CatalogService.js'

type CatalogHttpService = Pick<CatalogService, 'getBySlug' | 'getCategoryBySlug' | 'list' | 'listCategories'>

interface CatalogProductResponse {
  category: { id: string; name: string; slug: string }
  featured: boolean
  id: string
  imageObjectKeys: string[]
  name: string
  priceInCents: number
  slug: string
}

interface CatalogProductDetailResponse extends CatalogProductResponse {
  description: string
  variants: Array<{ available: boolean; color: string; id: string; size: string }>
}

interface CatalogCategoryResponse {
  id: string
  imageObjectKey: string | null
  name: string
  productCount: number
  slug: string
}

const querySchema = z.object({
  categorySlug: z.string().trim().min(1).max(120).optional(),
  featured: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  maximumPrice: z.coerce.number().int().min(0).optional(),
  minimumPrice: z.coerce.number().int().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
  search: z.string().trim().min(1).max(120).optional(),
  sort: z.enum(['name-asc', 'newest', 'price-asc', 'price-desc']).default('newest'),
}).refine((query) => query.maximumPrice === undefined || query.minimumPrice === undefined || query.maximumPrice >= query.minimumPrice, {
  message: 'Faixa de preço inválida.',
})

const slugSchema = z.object({ slug: z.string().trim().min(1).max(160) })

function resolveMediaUrl(mediaPublicBaseUrl: string, objectKey: string) {
  const segments = objectKey.trim().replace(/^\/+/, '').split('/')
  if (segments.some((segment) => segment.length === 0 || segment === '.' || segment === '..')) return null
  return `${mediaPublicBaseUrl}/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`
}

function resolveMediaUrls(mediaPublicBaseUrl: string, objectKeys: string[]) {
  return objectKeys
    .map((objectKey) => resolveMediaUrl(mediaPublicBaseUrl, objectKey))
    .filter((image): image is string => image !== null)
}

function toProductResponse(product: CatalogProductResponse, mediaPublicBaseUrl: string) {
  const images = resolveMediaUrls(mediaPublicBaseUrl, product.imageObjectKeys)
  return {
    category: product.category,
    featured: product.featured,
    id: product.id,
    image: images[0],
    name: product.name,
    priceInCents: product.priceInCents,
    slug: product.slug,
  }
}

function toProductDetailResponse(product: CatalogProductDetailResponse, mediaPublicBaseUrl: string) {
  return {
    ...toProductResponse(product, mediaPublicBaseUrl),
    description: product.description,
    images: resolveMediaUrls(mediaPublicBaseUrl, product.imageObjectKeys),
    variants: product.variants,
  }
}

function toCategoryResponse(category: CatalogCategoryResponse, mediaPublicBaseUrl: string) {
  return {
    id: category.id,
    image: category.imageObjectKey ? resolveMediaUrl(mediaPublicBaseUrl, category.imageObjectKey) : null,
    name: category.name,
    productCount: category.productCount,
    slug: category.slug,
  }
}

export async function registerCatalogRoutes(application: FastifyInstance, options: { catalogService: CatalogHttpService; mediaPublicBaseUrl: string }) {
  application.get('/v1/catalog/products', async (request) => {
    const result = await options.catalogService.list(querySchema.parse(request.query))
    return {
      ...result,
      items: result.items.map((product) => toProductResponse(product, options.mediaPublicBaseUrl)),
    }
  })

  application.get('/v1/catalog/products/:slug', async (request) => {
    const product = await options.catalogService.getBySlug(slugSchema.parse(request.params).slug)
    return toProductDetailResponse(product, options.mediaPublicBaseUrl)
  })

  application.get('/v1/catalog/categories', async () => {
    const categories = await options.catalogService.listCategories()
    return { items: categories.map((category) => toCategoryResponse(category, options.mediaPublicBaseUrl)) }
  })

  application.get('/v1/catalog/categories/:slug', async (request) => {
    const category = await options.catalogService.getCategoryBySlug(slugSchema.parse(request.params).slug)
    return toCategoryResponse(category, options.mediaPublicBaseUrl)
  })
}
