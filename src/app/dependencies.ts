import { MockCatalogAdapter } from '../features/catalog/adapters/MockCatalogAdapter'
import { MockCategoryAdapter } from '../features/catalog/adapters/MockCategoryAdapter'
import { LocalStorageCartRepository } from '../features/cart/adapters/LocalStorageCartRepository'
import { DemonstrationCartPricingService } from '../features/cart/adapters/DemonstrationCartPricingService'

export const catalogReader = new MockCatalogAdapter()
export const categoryReader = new MockCategoryAdapter()
export const cartRepository = new LocalStorageCartRepository()
export const cartPricingService = new DemonstrationCartPricingService({
  discountMinimumSubtotal: 200,
  discountPercentage: 0.05,
  freeShippingMinimumSubtotal: 300,
  standardShipping: 19.9,
})
