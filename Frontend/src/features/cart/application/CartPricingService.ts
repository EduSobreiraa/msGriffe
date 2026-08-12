import type { Cart } from '../domain/Cart'
import type { CartPricingSummary } from '../domain/CartPricing'

export interface CartPricingService {
  calculate(cart: Cart): CartPricingSummary
}
