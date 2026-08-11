import { describe, expect, it } from 'vitest'
import type { Cart } from '../domain/Cart'
import { DemonstrationCartPricingService } from './DemonstrationCartPricingService'

const rules = {
  discountMinimumSubtotal: 200,
  discountPercentage: 0.05,
  freeShippingMinimumSubtotal: 300,
  standardShipping: 19.9,
}

function cartWithSubtotal(displayPrice: number, quantity = 1): Cart {
  return {
    items: [{
      id: 'item-preto-p',
      product: {
        id: 'item',
        slug: 'item',
        name: 'Item',
        image: '/images/item.png',
        displayPrice,
      },
      variant: { id: 'item-preto-p', color: 'Preto', size: 'P' },
      quantity,
    }],
  }
}

describe('DemonstrationCartPricingService', () => {
  const service = new DemonstrationCartPricingService(rules)

  it('não cobra ou concede valores em carrinho vazio', () => {
    expect(service.calculate({ items: [] })).toEqual({
      displaySubtotal: 0,
      displayDiscount: 0,
      displayShipping: 0,
      displayTotal: 0,
      discountPercentage: 0,
      shippingIsFree: false,
    })
  })

  it('estima frete sem desconto abaixo do primeiro limite', () => {
    expect(service.calculate(cartWithSubtotal(89.9))).toEqual({
      displaySubtotal: 89.9,
      displayDiscount: 0,
      displayShipping: 19.9,
      displayTotal: 109.8,
      discountPercentage: 0,
      shippingIsFree: false,
    })
  })

  it('arredonda desconto em centavos e mantém frete antes da gratuidade', () => {
    expect(service.calculate(cartWithSubtotal(89.9, 3))).toEqual({
      displaySubtotal: 269.7,
      displayDiscount: 13.49,
      displayShipping: 19.9,
      displayTotal: 276.11,
      discountPercentage: 0.05,
      shippingIsFree: false,
    })
  })

  it('aplica frete demonstrativo gratuito no limite configurado', () => {
    expect(service.calculate(cartWithSubtotal(100, 3))).toEqual({
      displaySubtotal: 300,
      displayDiscount: 15,
      displayShipping: 0,
      displayTotal: 285,
      discountPercentage: 0.05,
      shippingIsFree: true,
    })
  })

  it('rejeita regras monetárias e percentuais inválidos', () => {
    expect(() => new DemonstrationCartPricingService({ ...rules, discountPercentage: 2 }))
      .toThrow(RangeError)
    expect(() => new DemonstrationCartPricingService({ ...rules, standardShipping: -1 }))
      .toThrow(RangeError)
    expect(() => new DemonstrationCartPricingService({
      ...rules,
      freeShippingMinimumSubtotal: Number.NaN,
    })).toThrow(RangeError)
  })
})
