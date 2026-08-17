export type AdminRole = 'SELLER' | 'SUPERADMIN'
export type AdminOrderStatus = 'DELIVERED' | 'PAID' | 'PREPARING' | 'SHIPPED'
export type AdminPaymentStatus = 'APPROVED'

export interface AdminOrder { customer: string; id: string; items: number; paymentStatus: AdminPaymentStatus; status: AdminOrderStatus; total: number }
export interface AdminProduct { id: string; image: string; name: string; price: number; stock: number; variants: number }
export interface AdminCustomer { email: string; id: string; lastOrder: string; lastProduct: string; name: string; orders: number; spent: number }

export const adminStatusLabels: Record<AdminOrderStatus, string> = { DELIVERED: 'Entregue', PAID: 'Pago', PREPARING: 'Em preparação', SHIPPED: 'Enviado' }
export const adminPaymentStatusLabels: Record<AdminPaymentStatus, string> = { APPROVED: 'Aprovado' }
export const demoAdminOrders: AdminOrder[] = [
  { id: 'MSG-1024', customer: 'Maria Silva', items: 2, paymentStatus: 'APPROVED', total: 189.8, status: 'PAID' },
  { id: 'MSG-1023', customer: 'João Santos', items: 1, paymentStatus: 'APPROVED', total: 89.9, status: 'PREPARING' },
  { id: 'MSG-1018', customer: 'Ana Costa', items: 3, paymentStatus: 'APPROVED', total: 269.7, status: 'SHIPPED' },
]
export const demoAdminProducts: AdminProduct[] = [
  { id: 'camiseta-boss', name: 'Camiseta Boss', image: '/images/bossshirt.png', price: 89.9, stock: 4, variants: 6 },
  { id: 'short-boss', name: 'Short Boss', image: '/images/bossShort.png', price: 99.9, stock: 2, variants: 4 },
]
export const demoAdminCustomers: AdminCustomer[] = [
  { id: 'customer-maria', name: 'Maria Silva', email: 'maria@exemplo.com', lastOrder: '12 ago 2026', lastProduct: 'Camiseta Boss', orders: 3, spent: 369.6 },
  { id: 'customer-joao', name: 'João Santos', email: 'joao@exemplo.com', lastOrder: '10 ago 2026', lastProduct: 'Short Boss', orders: 1, spent: 89.9 },
]

export function nextOperationalStatus(status: AdminOrderStatus): AdminOrderStatus | null {
  if (status === 'PAID') return 'PREPARING'
  if (status === 'PREPARING') return 'SHIPPED'
  if (status === 'SHIPPED') return 'DELIVERED'
  return null
}
