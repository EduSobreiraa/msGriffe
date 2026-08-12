import type { CartRepository } from '../application/CartRepository'
import type { Cart, CartItem } from '../domain/Cart'
import { MAX_CART_ITEM_QUANTITY } from '../domain/Cart'
import { createEmptyCart } from '../domain/cartOperations'

const STORAGE_VERSION = 1
const MAX_STORED_LENGTH = 100_000
const MAX_STORED_ITEMS = 50
export const CART_STORAGE_KEY = 'msgriffe-cart'

interface StoredCart {
  version: number
  items: unknown
}

function isSafeText(value: unknown, maximumLength = 200): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= maximumLength &&
    ![...value].some((character) => {
      const code = character.charCodeAt(0)
      return code <= 31 || code === 127
    })
  )
}

function isSafeIdentifier(value: unknown): value is string {
  return isSafeText(value, 100) && /^[a-z0-9][a-z0-9-]*$/i.test(value)
}

function parseItem(value: unknown): CartItem | null {
  if (!value || typeof value !== 'object') return null
  const item = value as Partial<CartItem>
  const { product, variant } = item

  if (
    !isSafeIdentifier(item.id) ||
    !Number.isInteger(item.quantity) ||
    Number(item.quantity) < 1 ||
    Number(item.quantity) > MAX_CART_ITEM_QUANTITY ||
    !product ||
    !variant ||
    !isSafeIdentifier(product.id) ||
    !isSafeIdentifier(product.slug) ||
    !isSafeText(product.name) ||
    typeof product.image !== 'string' ||
    !/^\/images\/[a-z0-9._-]+$/i.test(product.image) ||
    !Number.isFinite(product.displayPrice) ||
    Number(product.displayPrice) < 0 ||
    Number(product.displayPrice) > 1_000_000 ||
    !isSafeIdentifier(variant.id) ||
    !isSafeText(variant.color, 50) ||
    !isSafeText(variant.size, 20) ||
    item.id !== variant.id
  ) {
    return null
  }

  return item as CartItem
}

export class LocalStorageCartRepository implements CartRepository {
  constructor(private readonly storage: Storage = window.localStorage) {}

  load(): Cart {
    try {
      const rawValue = this.storage.getItem(CART_STORAGE_KEY)
      if (!rawValue || rawValue.length > MAX_STORED_LENGTH) return createEmptyCart()

      const stored = JSON.parse(rawValue) as StoredCart
      if (
        stored?.version !== STORAGE_VERSION ||
        !Array.isArray(stored.items) ||
        stored.items.length > MAX_STORED_ITEMS
      ) {
        return createEmptyCart()
      }

      const items = stored.items.map(parseItem)
      if (
        items.some((item) => item === null) ||
        new Set(items.map((item) => item?.id)).size !== items.length
      ) {
        return createEmptyCart()
      }

      return { items: items as CartItem[] }
    } catch {
      return createEmptyCart()
    }
  }

  save(cart: Cart): void {
    try {
      this.storage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ version: STORAGE_VERSION, items: cart.items }),
      )
    } catch {
      // Persistência local é melhor esforço; o estado em memória continua válido.
    }
  }

  clear(): void {
    try {
      this.storage.removeItem(CART_STORAGE_KEY)
    } catch {
      // O estado em memória ainda pode ser limpo mesmo se o storage estiver bloqueado.
    }
  }
}
