import { MockCatalogAdapter } from '../features/catalog/adapters/MockCatalogAdapter'
import { MockCategoryAdapter } from '../features/catalog/adapters/MockCategoryAdapter'

export const catalogReader = new MockCatalogAdapter()
export const categoryReader = new MockCategoryAdapter()
