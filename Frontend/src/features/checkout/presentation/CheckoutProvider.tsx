import { useCallback, useMemo, useState, type PropsWithChildren } from 'react'
import { emptyCheckoutIdentity, type CheckoutIdentity } from '../domain/CheckoutIdentity'
import { CheckoutContext } from './CheckoutContext'

export function CheckoutProvider({ children }: PropsWithChildren) {
  const [identity, setIdentity] = useState<CheckoutIdentity>(emptyCheckoutIdentity)
  const [identityComplete, setIdentityComplete] = useState(false)

  const updateIdentity = useCallback((values: Partial<CheckoutIdentity>) => {
    setIdentity((current) => ({ ...current, ...values }))
    setIdentityComplete(false)
  }, [])

  const markIdentityComplete = useCallback(() => setIdentityComplete(true), [])

  const value = useMemo(
    () => ({ identity, identityComplete, markIdentityComplete, updateIdentity }),
    [identity, identityComplete, markIdentityComplete, updateIdentity],
  )

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}
