import { createContext } from 'react'
import type { AccountAddress, AccountProfile, AccountSessionState } from '../domain/Account'

export interface AccountContextValue {
  addresses: AccountAddress[]
  profile: AccountProfile
  sessionState: AccountSessionState
  addAddress(address: Omit<AccountAddress, 'id'>): void
  endSession(): void
  grantAccess(): void
  removeAddress(id: string): void
  startSession(profile: AccountProfile): void
  updateProfile(profile: AccountProfile): void
}

export const AccountContext = createContext<AccountContextValue | null>(null)
