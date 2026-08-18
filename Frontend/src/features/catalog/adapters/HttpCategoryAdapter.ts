import { ApiError, type ApiClient } from '../../../shared/http'
import type { CategoryReader } from '../application/CategoryReader'
import type { CategorySummary } from '../domain/Category'
import { mapCategory, mapCategoryList } from './CatalogApiMapper'

export class HttpCategoryAdapter implements CategoryReader {
  constructor(private readonly client: ApiClient) {}

  async list(): Promise<CategorySummary[]> {
    return mapCategoryList(await this.client.request<unknown>({ path: '/v1/catalog/categories' }))
  }

  async findBySlug(slug: string): Promise<CategorySummary | null> {
    try {
      return mapCategory(await this.client.request<unknown>({ path: `/v1/catalog/categories/${encodeURIComponent(slug)}` }))
    } catch (error) {
      if (error instanceof ApiError && error.code === 'NOT_FOUND') return null
      throw error
    }
  }
}
