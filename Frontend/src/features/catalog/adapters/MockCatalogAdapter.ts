import type {
  CatalogQuery,
  CatalogReader,
  CatalogResult,
} from '../application/CatalogReader'
import type { ProductDetails } from '../domain/Product'
import { mockProducts } from './mockProducts'

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export class MockCatalogAdapter implements CatalogReader {
  constructor(private readonly products: ProductDetails[] = mockProducts) {}

  async findBySlug(slug: string) {
    return this.products.find((product) => product.slug === slug) ?? null
  }

  async list(query: CatalogQuery): Promise<CatalogResult> {
    let products = [...this.products]

    if (query.search?.trim()) {
      const search = normalize(query.search.trim())
      products = products.filter((product) => normalize(product.name).includes(search))
    }

    if (query.categorySlug) {
      products = products.filter(
        (product) => product.category.slug === query.categorySlug,
      )
    }

    if (query.featured !== undefined) {
      products = products.filter((product) => product.featured === query.featured)
    }

    if (query.minimumPrice !== undefined) {
      products = products.filter((product) => product.price >= query.minimumPrice!)
    }

    if (query.maximumPrice !== undefined) {
      products = products.filter((product) => product.price <= query.maximumPrice!)
    }

    products.sort((left, right) => {
      switch (query.sort) {
        case 'price-asc':
          return left.price - right.price
        case 'price-desc':
          return right.price - left.price
        case 'name-asc':
          return left.name.localeCompare(right.name, 'pt-BR')
        case 'newest':
          return 0
      }
    })

    const totalItems = products.length
    const totalPages = Math.max(1, Math.ceil(totalItems / query.pageSize))
    const page = Math.min(Math.max(1, query.page), totalPages)
    const start = (page - 1) * query.pageSize

    return {
      items: products.slice(start, start + query.pageSize),
      page,
      pageSize: query.pageSize,
      totalItems,
      totalPages,
    }
  }
}
