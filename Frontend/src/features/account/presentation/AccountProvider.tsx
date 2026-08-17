import { useCallback, useMemo, useState, type PropsWithChildren } from 'react'
import type { AccountAddress, AccountProfile, AccountSessionState } from '../domain/Account'
import { emptyAccountProfile } from '../domain/Account'
import { AccountContext } from './AccountContext'

export function AccountProvider({ children }: PropsWithChildren) {
  const [addresses, setAddresses] = useState<AccountAddress[]>([])
  const [profile, setProfile] = useState<AccountProfile>(emptyAccountProfile)
  const [sessionState, setSessionState] = useState<AccountSessionState>('ANONYMOUS')

  const startSession = useCallback((nextProfile: AccountProfile) => {
    setProfile(nextProfile)
    setSessionState('ACTIVE')
  }, [])

  const updateProfile = useCallback((nextProfile: AccountProfile) => setProfile(nextProfile), [])
  const endSession = useCallback(() => setSessionState('EXPIRED'), [])
  const grantAccess = useCallback(() => setSessionState('ACTIVE'), [])
  const addAddress = useCallback((address: Omit<AccountAddress, 'id'>) => {
    setAddresses((current) => [...current, { ...address, id: crypto.randomUUID() }])
  }, [])
  const removeAddress = useCallback((id: string) => {
    setAddresses((current) => current.filter((address) => address.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      addresses,
      profile,
      sessionState,
      addAddress,
      endSession,
      grantAccess,
      removeAddress,
      startSession,
      updateProfile,
    }),
    [addresses, profile, sessionState, addAddress, endSession, grantAccess, removeAddress, startSession, updateProfile],
  )

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}
