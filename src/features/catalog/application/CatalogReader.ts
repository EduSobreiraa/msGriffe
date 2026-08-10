import type { ProductDetails, ProductSummary } from '../domain/Product'

export type CatalogSort = 'newest' | 'price-asc' | 'price-desc' | 'name-asc'

export interface CatalogQuery {
  search?: string
  categorySlug?: string
  featured?: boolean
  maximumPrice?: number
  minimumPrice?: number
  page: number
  pageSize: number
  sort: CatalogSort
}

export interface CatalogResult {
  items: ProductSummary[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CatalogReader {
  findBySlug(slug: string): Promise<ProductDetails | null>
  list(query: CatalogQuery): Promise<CatalogResult>
}
