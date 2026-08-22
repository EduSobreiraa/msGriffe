import { ApplicationError } from '../../../shared/errors/ApplicationError.js'
import type { CatalogCategoryRecord, CatalogProductRecord, CatalogQuery, CatalogRepository } from './catalogContracts.js'

export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  async list(query: CatalogQuery) {
    const products = (await this.repository.listActiveProducts({ categorySlug: query.categorySlug, featured: query.featured, search: query.search }))
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

  async listCategories() {
    return (await this.repository.listPublicCategories()).map((category) => this.toCategorySummary(category))
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.repository.findPublicCategoryBySlug(slug)
    if (!category) throw new ApplicationError('NOT_FOUND', 404)
    return this.toCategorySummary(category)
  }

  private compareProducts(left: { createdAt: Date; id: string; name: string; priceInCents: number }, right: { createdAt: Date; id: string; name: string; priceInCents: number }, sort: CatalogQuery['sort']) {
    if (sort === 'price-asc') return left.priceInCents - right.priceInCents || left.name.localeCompare(right.name) || left.id.localeCompare(right.id)
    if (sort === 'price-desc') return right.priceInCents - left.priceInCents || left.name.localeCompare(right.name) || left.id.localeCompare(right.id)
    if (sort === 'name-asc') return left.name.localeCompare(right.name) || left.id.localeCompare(right.id)
    return right.createdAt.getTime() - left.createdAt.getTime() || left.name.localeCompare(right.name) || left.id.localeCompare(right.id)
  }

  private toProductSummary(product: CatalogProductRecord) {
    const variants = product.variants.filter((variant) => variant.isActive)
    const priceInCents = Math.min(...variants.map((variant) => variant.priceInCents))
    return {
      available: variants.some((variant) => variant.stock > 0),
      category: product.category,
      createdAt: product.createdAt,
      featured: product.isFeatured,
      id: product.id,
      imageObjectKeys: product.images.map((image) => image.objectKey),
      name: product.name,
      priceInCents,
      slug: product.slug,
    }
  }

  private toCategorySummary(category: CatalogCategoryRecord) {
    return {
      id: category.id,
      imageObjectKey: category.imageObjectKey,
      name: category.name,
      productCount: category.productCount,
      slug: category.slug,
    }
  }
}
