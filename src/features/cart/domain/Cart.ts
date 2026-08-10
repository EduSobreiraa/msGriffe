export const MAX_CART_ITEM_QUANTITY = 10

export interface CartProductSnapshot {
  id: string
  slug: string
  name: string
  image: string
  displayPrice: number
}

export interface CartVariantSnapshot {
  id: string
  color: string
  size: string
}

export interface CartItem {
  id: string
  product: CartProductSnapshot
  variant: CartVariantSnapshot
  quantity: number
}

export interface Cart {
  items: CartItem[]
}

export interface AddCartItemInput {
  product: CartProductSnapshot
  variant: CartVariantSnapshot
}

export interface CartTotals {
  totalItems: number
  displaySubtotal: number
}
