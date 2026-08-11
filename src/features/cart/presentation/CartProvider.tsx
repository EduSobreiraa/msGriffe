import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import type { CartRepository } from '../application/CartRepository'
import type { CartPricingService } from '../application/CartPricingService'
import type { AddCartItemInput } from '../domain/Cart'
import {
  addCartItem,
  calculateCartTotals,
  createEmptyCart,
  removeCartItem,
  updateCartItemQuantity,
} from '../domain/cartOperations'
import { CartContext } from './CartContext'

interface CartProviderProps extends PropsWithChildren {
  pricingService: CartPricingService
  repository: CartRepository
}

export function CartProvider({ children, pricingService, repository }: CartProviderProps) {
  const [cart, setCart] = useState(() => repository.load())

  useEffect(() => {
    repository.save(cart)
  }, [cart, repository])

  const addItem = useCallback((input: AddCartItemInput) => {
    setCart((current) => addCartItem(current, input))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((current) => updateCartItemQuantity(current, itemId, quantity))
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setCart((current) => removeCartItem(current, itemId))
  }, [])

  const clear = useCallback(() => {
    repository.clear()
    setCart(createEmptyCart())
  }, [repository])

  const value = useMemo(
    () => ({
      cart,
      totals: calculateCartTotals(cart),
      pricing: pricingService.calculate(cart),
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [addItem, cart, clear, pricingService, removeItem, updateQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
