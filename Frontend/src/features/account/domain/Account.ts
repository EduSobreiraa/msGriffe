export type AccountSessionState = 'ACTIVE' | 'ANONYMOUS' | 'DENIED' | 'EXPIRED'

export interface AccountProfile {
  email: string
  fullName: string
  phone: string
}

export interface AccountAddress {
  city: string
  id: string
  label: string
  neighborhood: string
  number: string
  state: string
  street: string
  zipCode: string
}

export type CustomerOrderStatus = 'DELIVERED' | 'PREPARING' | 'SHIPPED'

export interface CustomerOrder {
  createdAt: string
  id: string
  items: Array<{ name: string; quantity: number; variant: string }>
  status: CustomerOrderStatus
  total: number
}

export const orderStatusLabels: Record<CustomerOrderStatus, string> = {
  DELIVERED: 'Entregue',
  PREPARING: 'Em preparação',
  SHIPPED: 'Enviado',
}

export const demoOrders: CustomerOrder[] = [
  {
    id: 'MSG-1024',
    createdAt: '12 de agosto de 2026',
    status: 'SHIPPED',
    total: 189.8,
    items: [
      { name: 'Camiseta Boss', variant: 'Preto · M', quantity: 1 },
      { name: 'Short Boss', variant: 'Cinza · G', quantity: 1 },
    ],
  },
  {
    id: 'MSG-0987',
    createdAt: '3 de agosto de 2026',
    status: 'DELIVERED',
    total: 89.9,
    items: [{ name: 'Camiseta Boss', variant: 'Cinza · P', quantity: 1 }],
  },
]

export const emptyAccountProfile: AccountProfile = {
  email: '',
  fullName: '',
  phone: '',
}

export function validateAccountProfile(profile: AccountProfile) {
  const errors: Partial<Record<keyof AccountProfile, string>> = {}
  if (profile.fullName.trim().length < 3) errors.fullName = 'Informe seu nome completo.'
  if (!/^\S+@\S+\.\S+$/.test(profile.email)) errors.email = 'Informe um e-mail válido.'
  if (profile.phone.replace(/\D/g, '').length < 10) errors.phone = 'Informe um telefone válido.'
  return errors
}
