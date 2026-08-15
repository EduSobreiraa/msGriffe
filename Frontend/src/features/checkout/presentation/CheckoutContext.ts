import { createContext } from 'react'
import type { CheckoutIdentity } from '../domain/CheckoutIdentity'

export interface CheckoutContextValue {
  identity: CheckoutIdentity
  identityComplete: boolean
  markIdentityComplete(): void
  updateIdentity(values: Partial<CheckoutIdentity>): void
}

export const CheckoutContext = createContext<CheckoutContextValue | null>(null)
