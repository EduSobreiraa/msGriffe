import { useContext } from 'react'
import { AccountContext } from './AccountContext'

export function useAccount() {
  const context = useContext(AccountContext)
  if (!context) throw new Error('useAccount deve ser usado dentro de AccountProvider')
  return context
}
