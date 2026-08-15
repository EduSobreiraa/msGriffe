import { createContext } from 'react'
import type { CheckoutAddress, DeliveryOption } from '../domain/CheckoutAddress'
import type { CheckoutIdentity } from '../domain/CheckoutIdentity'
import type { PaymentMethod } from '../domain/CheckoutPayment'
import type { CheckoutSimulationStatus } from '../domain/CheckoutSimulation'

export interface CheckoutContextValue {
  address: CheckoutAddress
  addressComplete: boolean
  couponCode: string
  couponSubmitted: boolean
  deliveryOption: DeliveryOption
  identity: CheckoutIdentity
  identityComplete: boolean
  markAddressComplete(): void
  markIdentityComplete(): void
  paymentMethod: PaymentMethod
  paymentSimulationStatus: CheckoutSimulationStatus | null
  setDeliveryOption(option: DeliveryOption): void
  selectPaymentMethod(method: Exclude<PaymentMethod, null>): void
  setPaymentSimulationStatus(status: CheckoutSimulationStatus): void
  setCouponCode(value: string): void
  startPaymentSimulation(): void
  submitCoupon(): void
  updateAddress(values: Partial<CheckoutAddress>): void
  updateIdentity(values: Partial<CheckoutIdentity>): void
}

export const CheckoutContext = createContext<CheckoutContextValue | null>(null)
