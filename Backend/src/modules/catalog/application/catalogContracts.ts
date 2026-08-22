export type CatalogSort = 'name-asc' | 'newest' | 'price-asc' | 'price-desc'

export interface CatalogQuery {
  categorySlug?: string
  featured?: boolean
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
  images: Array<{ objectKey: string }>
  id: string
  isFeatured: boolean
  name: string
  slug: string
  variants: CatalogVariant[]
}

export interface CatalogCategoryRecord {
  id: string
  imageObjectKey: string | null
  name: string
  productCount: number
  slug: string
}

export interface CatalogRepository {
  findPublicCategoryBySlug(slug: string): Promise<CatalogCategoryRecord | null>
  findActiveProductBySlug(slug: string): Promise<CatalogProductRecord | null>
  listPublicCategories(): Promise<CatalogCategoryRecord[]>
  listActiveProducts(input: { categorySlug?: string; featured?: boolean; search?: string }): Promise<CatalogProductRecord[]>
}
