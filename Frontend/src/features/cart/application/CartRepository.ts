import type { Cart } from '../domain/Cart'

export interface CartRepository {
  load(): Cart
  save(cart: Cart): void
  clear(): void
}
