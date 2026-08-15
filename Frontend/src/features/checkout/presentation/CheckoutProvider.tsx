import { useCallback, useMemo, useState, type PropsWithChildren } from 'react'
import {
  emptyCheckoutAddress,
  type CheckoutAddress,
  type DeliveryOption,
} from '../domain/CheckoutAddress'
import { emptyCheckoutIdentity, type CheckoutIdentity } from '../domain/CheckoutIdentity'
import { CheckoutContext } from './CheckoutContext'

export function CheckoutProvider({ children }: PropsWithChildren) {
  const [address, setAddress] = useState<CheckoutAddress>(emptyCheckoutAddress)
  const [addressComplete, setAddressComplete] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('standard')
  const [identity, setIdentity] = useState<CheckoutIdentity>(emptyCheckoutIdentity)
  const [identityComplete, setIdentityComplete] = useState(false)

  const updateIdentity = useCallback((values: Partial<CheckoutIdentity>) => {
    setIdentity((current) => ({ ...current, ...values }))
    setIdentityComplete(false)
  }, [])

  const markIdentityComplete = useCallback(() => setIdentityComplete(true), [])

  const updateAddress = useCallback((values: Partial<CheckoutAddress>) => {
    setAddress((current) => ({ ...current, ...values }))
    setAddressComplete(false)
  }, [])

  const markAddressComplete = useCallback(() => setAddressComplete(true), [])

  const value = useMemo(
    () => ({
      address,
      addressComplete,
      deliveryOption,
      identity,
      identityComplete,
      markAddressComplete,
      markIdentityComplete,
      setDeliveryOption,
      updateAddress,
      updateIdentity,
    }),
    [
      address,
      addressComplete,
      deliveryOption,
      identity,
      identityComplete,
      markAddressComplete,
      markIdentityComplete,
      updateAddress,
      updateIdentity,
    ],
  )

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}
