import { useContext } from 'react'
import { CheckoutContext } from './CheckoutContext'

export function useCheckout() {
  const context = useContext(CheckoutContext)

  if (!context) throw new Error('useCheckout deve ser usado dentro de CheckoutProvider')

  return context
}
