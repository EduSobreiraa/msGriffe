import { useCallback, useMemo, useState, type PropsWithChildren } from 'react'
import { demoAdminOrders, demoAdminProducts, nextOperationalStatus, type AdminOrder, type AdminProduct, type AdminRole } from '../domain/AdminData'
import { AdminContext } from './AdminContext'

export function AdminProvider({ children }: PropsWithChildren) {
  const [orders, setOrders] = useState<AdminOrder[]>(demoAdminOrders)
  const [products, setProducts] = useState<AdminProduct[]>(demoAdminProducts)
  const [role, setRole] = useState<AdminRole>('SELLER')
  const advanceOrder = useCallback((id: string) => setOrders((current) => current.map((order) => {
    const next = order.id === id ? nextOperationalStatus(order.status) : null
    return next ? { ...order, status: next } : order
  })), [])
  const changeStock = useCallback((id: string, stock: number) => setProducts((current) => current.map((product) => product.id === id ? { ...product, stock: Math.max(0, stock) } : product)), [])
  const value = useMemo(() => ({ orders, products, role, advanceOrder, changeStock, setRole }), [orders, products, role, advanceOrder, changeStock])
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
