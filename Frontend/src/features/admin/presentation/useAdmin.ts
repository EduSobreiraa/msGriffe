import { useContext } from 'react'
import { AdminContext } from './AdminContext'
export function useAdmin() { const context = useContext(AdminContext); if (!context) throw new Error('useAdmin deve ser usado dentro de AdminProvider'); return context }
