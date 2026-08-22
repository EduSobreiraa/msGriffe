import { ApplicationError } from '../../../shared/errors/ApplicationError.js'
import type { CatalogProductRecord, CatalogQuery, CatalogRepository } from './catalogContracts.js'

export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  async list(query: CatalogQuery) {
    const products = (await this.repository.listActiveProducts({ categorySlug: query.categorySlug, search: query.search }))
      .map((product) => this.toProductSummary(product))
      .filter((product) => (query.minimumPrice === undefined || product.priceInCents >= query.minimumPrice) && (query.maximumPrice === undefined || product.priceInCents <= query.maximumPrice))
      .sort((left, right) => this.compareProducts(left, right, query.sort))
    const totalItems = products.length
    const totalPages = Math.max(1, Math.ceil(totalItems / query.pageSize))
    const page = Math.min(query.page, totalPages)
    return { items: products.slice((page - 1) * query.pageSize, page * query.pageSize), page, pageSize: query.pageSize, totalItems, totalPages }
  }

  async getBySlug(slug: string) {
    const product = await this.repository.findActiveProductBySlug(slug)
    if (!product) throw new ApplicationError('NOT_FOUND', 404)
    const summary = this.toProductSummary(product)
    return {
      ...summary,
      description: product.description,
      variants: product.variants.filter((variant) => variant.isActive).map((variant) => ({ available: variant.stock > 0, color: variant.color, id: variant.id, priceInCents: variant.priceInCents, size: variant.size })),
    }
  }

  private compareProducts(left: { createdAt: Date; name: string; priceInCents: number }, right: { createdAt: Date; name: string; priceInCents: number }, sort: CatalogQuery['sort']) {
    if (sort === 'price-asc') return left.priceInCents - right.priceInCents || left.name.localeCompare(right.name)
    if (sort === 'price-desc') return right.priceInCents - left.priceInCents || left.name.localeCompare(right.name)
    if (sort === 'name-asc') return left.name.localeCompare(right.name)
    return right.createdAt.getTime() - left.createdAt.getTime() || left.name.localeCompare(right.name)
  }

  private toProductSummary(product: CatalogProductRecord) {
    const variants = product.variants.filter((variant) => variant.isActive)
    const priceInCents = Math.min(...variants.map((variant) => variant.priceInCents))
    return { available: variants.some((variant) => variant.stock > 0), category: product.category, createdAt: product.createdAt, id: product.id, name: product.name, priceInCents, slug: product.slug }
  }
}
