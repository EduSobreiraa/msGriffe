import type { PrismaClient } from '@prisma/client'
import type { CatalogRepository } from '../../application/catalogContracts.js'

export class PrismaCatalogRepository implements CatalogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listPublicCategories() {
    const categories = await this.prisma.category.findMany({
      where: { products: { some: { isActive: true, variants: { some: { isActive: true } } } } },
      select: {
        _count: { select: { products: { where: { isActive: true, variants: { some: { isActive: true } } } } } },
        id: true,
        imageObjectKey: true,
        name: true,
        slug: true,
      },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    })
    return categories.map(({ _count, ...category }) => ({ ...category, productCount: _count.products }))
  }

  async findPublicCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, products: { some: { isActive: true, variants: { some: { isActive: true } } } } },
      select: {
        _count: { select: { products: { where: { isActive: true, variants: { some: { isActive: true } } } } } },
        id: true,
        imageObjectKey: true,
        name: true,
        slug: true,
      },
    })
    if (!category) return null
    const { _count, ...publicCategory } = category
    return { ...publicCategory, productCount: _count.products }
  }

  async listActiveProducts(input: { categorySlug?: string; featured?: boolean; search?: string }) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        ...(input.categorySlug ? { category: { slug: input.categorySlug } } : {}),
        ...(input.featured === undefined ? {} : { isFeatured: input.featured }),
        ...(input.search ? { name: { contains: input.search, mode: 'insensitive' } } : {}),
        variants: { some: { isActive: true } },
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { position: 'asc' }, select: { objectKey: true } },
        variants: { where: { isActive: true }, select: { color: true, id: true, isActive: true, priceInCents: true, size: true, stock: true } },
      },
    })
  }

  async findActiveProductBySlug(slug: string) {
    return this.prisma.product.findFirst({
      where: { isActive: true, slug, variants: { some: { isActive: true } } },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { position: 'asc' }, select: { objectKey: true } },
        variants: { where: { isActive: true }, select: { color: true, id: true, isActive: true, priceInCents: true, size: true, stock: true } },
      },
    })
  }
}
