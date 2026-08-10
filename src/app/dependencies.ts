import { MockCatalogAdapter } from '../features/catalog/adapters/MockCatalogAdapter'
import { MockCategoryAdapter } from '../features/catalog/adapters/MockCategoryAdapter'
import { LocalStorageCartRepository } from '../features/cart/adapters/LocalStorageCartRepository'

export const catalogReader = new MockCatalogAdapter()
export const categoryReader = new MockCategoryAdapter()
export const cartRepository = new LocalStorageCartRepository()
