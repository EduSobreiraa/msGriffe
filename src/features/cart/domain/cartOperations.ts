import type { AddCartItemInput, Cart, CartTotals } from './Cart'
import { MAX_CART_ITEM_QUANTITY } from './Cart'

export function createEmptyCart(): Cart {
  return { items: [] }
}

export function addCartItem(cart: Cart, input: AddCartItemInput): Cart {
  const itemId = input.variant.id
  const existingItem = cart.items.find((item) => item.id === itemId)

  if (!existingItem) {
    return {
      items: [...cart.items, { ...input, id: itemId, quantity: 1 }],
    }
  }

  return updateCartItemQuantity(cart, itemId, existingItem.quantity + 1)
}

export function updateCartItemQuantity(
  cart: Cart,
  itemId: string,
  requestedQuantity: number,
): Cart {
  if (!Number.isInteger(requestedQuantity)) return cart
  if (requestedQuantity <= 0) return removeCartItem(cart, itemId)

  const quantity = Math.min(requestedQuantity, MAX_CART_ITEM_QUANTITY)
  let changed = false
  const items = cart.items.map((item) => {
    if (item.id !== itemId || item.quantity === quantity) return item
    changed = true
    return { ...item, quantity }
  })

  return changed ? { items } : cart
}

export function removeCartItem(cart: Cart, itemId: string): Cart {
  const items = cart.items.filter((item) => item.id !== itemId)
  return items.length === cart.items.length ? cart : { items }
}

export function calculateCartTotals(cart: Cart): CartTotals {
  const totals = cart.items.reduce<{ totalItems: number; subtotalInCents: number }>(
    (totals, item) => ({
      totalItems: totals.totalItems + item.quantity,
      subtotalInCents:
        totals.subtotalInCents + Math.round(item.product.displayPrice * 100) * item.quantity,
    }),
    { totalItems: 0, subtotalInCents: 0 },
  )

  return {
    totalItems: totals.totalItems,
    displaySubtotal: totals.subtotalInCents / 100,
  }
}
