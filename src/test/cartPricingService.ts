import { DemonstrationCartPricingService } from '../features/cart/adapters/DemonstrationCartPricingService'

export const testCartPricingService = new DemonstrationCartPricingService({
  discountMinimumSubtotal: 200,
  discountPercentage: 0.05,
  freeShippingMinimumSubtotal: 300,
  standardShipping: 19.9,
})
