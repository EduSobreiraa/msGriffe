import { createContext } from 'react'
import type { CheckoutAddress, DeliveryOption } from '../domain/CheckoutAddress'
import type { CheckoutIdentity } from '../domain/CheckoutIdentity'

export interface CheckoutContextValue {
  address: CheckoutAddress
  addressComplete: boolean
  deliveryOption: DeliveryOption
  identity: CheckoutIdentity
  identityComplete: boolean
  markAddressComplete(): void
  markIdentityComplete(): void
  setDeliveryOption(option: DeliveryOption): void
  updateAddress(values: Partial<CheckoutAddress>): void
  updateIdentity(values: Partial<CheckoutIdentity>): void
}

export const CheckoutContext = createContext<CheckoutContextValue | null>(null)
