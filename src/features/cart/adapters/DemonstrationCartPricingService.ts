import type { CartPricingService } from '../application/CartPricingService'
import type { Cart } from '../domain/Cart'
import type { CartPricingSummary } from '../domain/CartPricing'
import { calculateCartTotals } from '../domain/cartOperations'

export interface DemonstrationPricingRules {
  discountMinimumSubtotal: number
  discountPercentage: number
  freeShippingMinimumSubtotal: number
  standardShipping: number
}

const MAX_RULE_VALUE = 1_000_000

function toValidCents(value: number, name: string) {
  if (!Number.isFinite(value) || value < 0 || value > MAX_RULE_VALUE) {
    throw new RangeError(`${name} deve ser um valor monetário válido`)
  }
  return Math.round(value * 100)
}

export class DemonstrationCartPricingService implements CartPricingService {
  private readonly discountMinimumInCents: number
  private readonly discountPercentage: number
  private readonly freeShippingMinimumInCents: number
  private readonly standardShippingInCents: number

  constructor(rules: DemonstrationPricingRules) {
    if (
      !Number.isFinite(rules.discountPercentage) ||
      rules.discountPercentage < 0 ||
      rules.discountPercentage > 1
    ) {
      throw new RangeError('discountPercentage deve estar entre zero e um')
    }

    this.discountMinimumInCents = toValidCents(
      rules.discountMinimumSubtotal,
      'discountMinimumSubtotal',
    )
    this.discountPercentage = rules.discountPercentage
    this.freeShippingMinimumInCents = toValidCents(
      rules.freeShippingMinimumSubtotal,
      'freeShippingMinimumSubtotal',
    )
    this.standardShippingInCents = toValidCents(
      rules.standardShipping,
      'standardShipping',
    )
  }

  calculate(cart: Cart): CartPricingSummary {
    const { displaySubtotal } = calculateCartTotals(cart)
    const subtotalInCents = Math.round(displaySubtotal * 100)

    if (subtotalInCents === 0) {
      return {
        displaySubtotal: 0,
        displayDiscount: 0,
        displayShipping: 0,
        displayTotal: 0,
        discountPercentage: 0,
        shippingIsFree: false,
      }
    }

    const discountInCents = subtotalInCents >= this.discountMinimumInCents
      ? Math.round(subtotalInCents * this.discountPercentage)
      : 0
    const shippingIsFree = subtotalInCents >= this.freeShippingMinimumInCents
    const shippingInCents = shippingIsFree ? 0 : this.standardShippingInCents
    const totalInCents = Math.max(0, subtotalInCents - discountInCents + shippingInCents)

    return {
      displaySubtotal: subtotalInCents / 100,
      displayDiscount: discountInCents / 100,
      displayShipping: shippingInCents / 100,
      displayTotal: totalInCents / 100,
      discountPercentage: discountInCents > 0 ? this.discountPercentage : 0,
      shippingIsFree,
    }
  }
}
