import { createContext } from 'react'
import type { AddCartItemInput, Cart, CartTotals } from '../domain/Cart'

export interface CartContextValue {
  cart: Cart
  totals: CartTotals
  addItem(input: AddCartItemInput): void
  updateQuantity(itemId: string, quantity: number): void
  removeItem(itemId: string): void
  clear(): void
}

export const CartContext = createContext<CartContextValue | null>(null)
