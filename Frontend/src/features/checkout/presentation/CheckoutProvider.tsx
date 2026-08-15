import { useCallback, useMemo, useState, type PropsWithChildren } from 'react'
import {
  emptyCheckoutAddress,
  type CheckoutAddress,
  type DeliveryOption,
} from '../domain/CheckoutAddress'
import { emptyCheckoutIdentity, type CheckoutIdentity } from '../domain/CheckoutIdentity'
import type { PaymentMethod } from '../domain/CheckoutPayment'
import type { CheckoutSimulationStatus } from '../domain/CheckoutSimulation'
import { CheckoutContext } from './CheckoutContext'

export function CheckoutProvider({ children }: PropsWithChildren) {
  const [address, setAddress] = useState<CheckoutAddress>(emptyCheckoutAddress)
  const [addressComplete, setAddressComplete] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('standard')
  const [couponCode, setCouponCodeState] = useState('')
  const [couponSubmitted, setCouponSubmitted] = useState(false)
  const [identity, setIdentity] = useState<CheckoutIdentity>(emptyCheckoutIdentity)
  const [identityComplete, setIdentityComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [paymentSimulationStatus, setPaymentSimulationStatusState] =
    useState<CheckoutSimulationStatus | null>(null)

  const clearPaymentSimulation = useCallback(() => setPaymentSimulationStatusState(null), [])

  const updateIdentity = useCallback((values: Partial<CheckoutIdentity>) => {
    setIdentity((current) => ({ ...current, ...values }))
    setIdentityComplete(false)
    clearPaymentSimulation()
  }, [clearPaymentSimulation])

  const markIdentityComplete = useCallback(() => setIdentityComplete(true), [])

  const updateAddress = useCallback((values: Partial<CheckoutAddress>) => {
    setAddress((current) => ({ ...current, ...values }))
    setAddressComplete(false)
    clearPaymentSimulation()
  }, [clearPaymentSimulation])

  const markAddressComplete = useCallback(() => setAddressComplete(true), [])

  const setCouponCode = useCallback((value: string) => {
    setCouponCodeState(value)
    setCouponSubmitted(false)
    clearPaymentSimulation()
  }, [clearPaymentSimulation])

  const submitCoupon = useCallback(() => {
    setCouponSubmitted(true)
    clearPaymentSimulation()
  }, [clearPaymentSimulation])

  const selectPaymentMethod = useCallback((method: Exclude<PaymentMethod, null>) => {
    setPaymentMethod(method)
    clearPaymentSimulation()
  }, [clearPaymentSimulation])

  const startPaymentSimulation = useCallback(
    () => setPaymentSimulationStatusState('PENDING_PAYMENT'),
    [],
  )

  const setPaymentSimulationStatus = useCallback((status: CheckoutSimulationStatus) => {
    setPaymentSimulationStatusState(status)
  }, [])

  const value = useMemo(
    () => ({
      address,
      addressComplete,
      couponCode,
      couponSubmitted,
      deliveryOption,
      identity,
      identityComplete,
      markAddressComplete,
      markIdentityComplete,
      paymentMethod,
      paymentSimulationStatus,
      setDeliveryOption,
      selectPaymentMethod,
      setPaymentSimulationStatus,
      setCouponCode,
      startPaymentSimulation,
      submitCoupon,
      updateAddress,
      updateIdentity,
    }),
    [
      address,
      addressComplete,
      couponCode,
      couponSubmitted,
      deliveryOption,
      identity,
      identityComplete,
      markAddressComplete,
      markIdentityComplete,
      paymentMethod,
      paymentSimulationStatus,
      selectPaymentMethod,
      setPaymentSimulationStatus,
      setCouponCode,
      startPaymentSimulation,
      submitCoupon,
      updateAddress,
      updateIdentity,
    ],
  )

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}
