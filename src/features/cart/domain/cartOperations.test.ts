import { describe, expect, it } from 'vitest'
import type { AddCartItemInput } from './Cart'
import {
  addCartItem,
  calculateCartTotals,
  createEmptyCart,
  removeCartItem,
  updateCartItemQuantity,
} from './cartOperations'

const item: AddCartItemInput = {
  product: {
    id: 'camiseta-boss',
    slug: 'camiseta-boss',
    name: 'Camiseta Boss',
    image: '/images/bossshirt.png',
    displayPrice: 89.9,
  },
  variant: { id: 'camiseta-boss-preto-p', color: 'Preto', size: 'P' },
}

describe('operações do carrinho', () => {
  it('adiciona e incrementa a mesma variante sem mutar o estado anterior', () => {
    const emptyCart = createEmptyCart()
    const firstCart = addCartItem(emptyCart, item)
    const secondCart = addCartItem(firstCart, item)

    expect(emptyCart.items).toEqual([])
    expect(firstCart.items[0].quantity).toBe(1)
    expect(secondCart.items[0].quantity).toBe(2)
  })

  it('limita quantidade, remove com zero e ignora valores fracionários', () => {
    const cart = addCartItem(createEmptyCart(), item)
    const limited = updateCartItemQuantity(cart, item.variant.id, 99)

    expect(limited.items[0].quantity).toBe(10)
    expect(updateCartItemQuantity(limited, item.variant.id, 1.5)).toBe(limited)
    expect(updateCartItemQuantity(limited, item.variant.id, 0).items).toEqual([])
  })

  it('remove itens e calcula totais demonstrativos', () => {
    const cart = updateCartItemQuantity(
      addCartItem(createEmptyCart(), item),
      item.variant.id,
      3,
    )

    expect(calculateCartTotals(cart)).toEqual({
      totalItems: 3,
      displaySubtotal: 269.7,
    })
    expect(removeCartItem(cart, 'inexistente')).toBe(cart)
    expect(removeCartItem(cart, item.variant.id)).toEqual(createEmptyCart())
  })
})
