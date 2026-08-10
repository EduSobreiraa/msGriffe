import type { CategoryReader } from '../application/CategoryReader'
import type { CategorySummary } from '../domain/Category'
import { mockProducts } from './mockProducts'

export class MockCategoryAdapter implements CategoryReader {
  async list(): Promise<CategorySummary[]> {
    const categories = new Map<string, CategorySummary>()

    for (const product of mockProducts) {
      const current = categories.get(product.category.slug)

      categories.set(product.category.slug, {
        ...product.category,
        image: current?.image ?? product.image,
        productCount: (current?.productCount ?? 0) + 1,
      })
    }

    return [...categories.values()].sort((left, right) =>
      left.name.localeCompare(right.name, 'pt-BR'),
    )
  }

  async findBySlug(slug: string): Promise<CategorySummary | null> {
    const categories = await this.list()
    return categories.find((category) => category.slug === slug) ?? null
  }
}
