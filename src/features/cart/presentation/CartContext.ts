import { createContext } from 'react'
import type { AddCartItemInput, Cart, CartTotals } from '../domain/Cart'
import type { CartPricingSummary } from '../domain/CartPricing'

export interface CartContextValue {
  cart: Cart
  totals: CartTotals
  pricing: CartPricingSummary
  addItem(input: AddCartItemInput): void
  updateQuantity(itemId: string, quantity: number): void
  removeItem(itemId: string): void
  clear(): void
}

export const CartContext = createContext<CartContextValue | null>(null)
