import type { PrismaClient } from '@prisma/client'
import type { CatalogRepository } from '../../application/catalogContracts.js'

export class PrismaCatalogRepository implements CatalogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listActiveProducts(input: { categorySlug?: string; search?: string }) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        ...(input.categorySlug ? { category: { slug: input.categorySlug } } : {}),
        ...(input.search ? { name: { contains: input.search, mode: 'insensitive' } } : {}),
        variants: { some: { isActive: true } },
      },
      include: { category: { select: { id: true, name: true, slug: true } }, variants: { where: { isActive: true }, select: { color: true, id: true, isActive: true, priceInCents: true, size: true, stock: true } } },
    })
  }

  async findActiveProductBySlug(slug: string) {
    return this.prisma.product.findFirst({
      where: { isActive: true, slug, variants: { some: { isActive: true } } },
      include: { category: { select: { id: true, name: true, slug: true } }, variants: { where: { isActive: true }, select: { color: true, id: true, isActive: true, priceInCents: true, size: true, stock: true } } },
    })
  }
}
