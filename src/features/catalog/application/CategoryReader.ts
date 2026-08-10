import type { CategorySummary } from '../domain/Category'

export interface CategoryReader {
  list(): Promise<CategorySummary[]>
  findBySlug(slug: string): Promise<CategorySummary | null>
}
