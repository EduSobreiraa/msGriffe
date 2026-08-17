import { createContext } from 'react'
import type { AdminOrder, AdminProduct, AdminRole } from '../domain/AdminData'

export interface AdminContextValue {
  orders: AdminOrder[]
  products: AdminProduct[]
  role: AdminRole
  advanceOrder(id: string): void
  changeStock(id: string, stock: number): void
  setRole(role: AdminRole): void
}

export const AdminContext = createContext<AdminContextValue | null>(null)
