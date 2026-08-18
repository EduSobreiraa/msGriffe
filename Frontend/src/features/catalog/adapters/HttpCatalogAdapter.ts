import { ApiError, type ApiClient } from '../../../shared/http'
import type { CatalogQuery, CatalogReader, CatalogResult } from '../application/CatalogReader'
import type { ProductDetails } from '../domain/Product'
import { mapCatalogResult, mapProductDetails } from './CatalogApiMapper'

function catalogPath(query: CatalogQuery) {
  const parameters = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    sort: query.sort,
  })

  if (query.search) parameters.set('search', query.search)
  if (query.categorySlug) parameters.set('categorySlug', query.categorySlug)
  if (query.featured !== undefined) parameters.set('featured', String(query.featured))
  if (query.minimumPrice !== undefined) parameters.set('minimumPrice', String(query.minimumPrice))
  if (query.maximumPrice !== undefined) parameters.set('maximumPrice', String(query.maximumPrice))

  return `/v1/catalog/products?${parameters.toString()}`
}

export class HttpCatalogAdapter implements CatalogReader {
  constructor(private readonly client: ApiClient) {}

  async findBySlug(slug: string): Promise<ProductDetails | null> {
    try {
      return mapProductDetails(await this.client.request<unknown>({ path: `/v1/catalog/products/${encodeURIComponent(slug)}` }))
    } catch (error) {
      if (error instanceof ApiError && error.code === 'NOT_FOUND') return null
      throw error
    }
  }

  async list(query: CatalogQuery): Promise<CatalogResult> {
    return mapCatalogResult(await this.client.request<unknown>({ path: catalogPath(query) }))
  }
}
