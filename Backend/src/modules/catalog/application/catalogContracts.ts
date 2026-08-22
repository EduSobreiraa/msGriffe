export type CatalogSort = 'name-asc' | 'newest' | 'price-asc' | 'price-desc'

export interface CatalogQuery {
  categorySlug?: string
  maximumPrice?: number
  minimumPrice?: number
  page: number
  pageSize: number
  search?: string
  sort: CatalogSort
}

export interface CatalogVariant {
  color: string
  id: string
  isActive: boolean
  priceInCents: number
  size: string
  stock: number
}

export interface CatalogProductRecord {
  category: { id: string; name: string; slug: string }
  createdAt: Date
  description: string
  id: string
  name: string
  slug: string
  variants: CatalogVariant[]
}

export interface CatalogRepository {
  listActiveProducts(input: { categorySlug?: string; search?: string }): Promise<CatalogProductRecord[]>
  findActiveProductBySlug(slug: string): Promise<CatalogProductRecord | null>
}
