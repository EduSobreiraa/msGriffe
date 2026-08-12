import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Cart } from '../domain/Cart'
import { CART_STORAGE_KEY, LocalStorageCartRepository } from './LocalStorageCartRepository'

const validCart: Cart = {
  items: [
    {
      id: 'camiseta-boss-preto-p',
      product: {
        id: 'camiseta-boss',
        slug: 'camiseta-boss',
        name: 'Camiseta Boss',
        image: '/images/bossshirt.png',
        displayPrice: 89.9,
      },
      variant: { id: 'camiseta-boss-preto-p', color: 'Preto', size: 'P' },
      quantity: 2,
    },
  ],
}

describe('LocalStorageCartRepository', () => {
  beforeEach(() => window.localStorage.clear())

  it('salva e recupera somente o formato versionado', () => {
    const repository = new LocalStorageCartRepository()
    repository.save(validCart)

    expect(repository.load()).toEqual(validCart)
  })

  it.each([
    '{json inválido',
    JSON.stringify({ version: 99, items: validCart.items }),
    JSON.stringify({ version: 1, items: [{ ...validCart.items[0], quantity: 999 }] }),
    JSON.stringify({
      version: 1,
      items: [
        {
          ...validCart.items[0],
          product: { ...validCart.items[0].product, image: 'https://tracker.test/a.png' },
        },
      ],
    }),
    JSON.stringify({ version: 1, items: [validCart.items[0], validCart.items[0]] }),
    JSON.stringify({
      version: 1,
      items: [
        {
          ...validCart.items[0],
          product: { ...validCart.items[0].product, displayPrice: 10_000_000 },
        },
      ],
    }),
  ])('descarta conteúdo local não confiável', (storedValue) => {
    window.localStorage.setItem(CART_STORAGE_KEY, storedValue)

    expect(new LocalStorageCartRepository().load()).toEqual({ items: [] })
  })

  it('não interrompe a aplicação quando o storage está bloqueado', () => {
    const blockedStorage = {
      getItem: vi.fn(() => {
        throw new DOMException('bloqueado')
      }),
      setItem: vi.fn(() => {
        throw new DOMException('bloqueado')
      }),
      removeItem: vi.fn(() => {
        throw new DOMException('bloqueado')
      }),
    } as unknown as Storage
    const repository = new LocalStorageCartRepository(blockedStorage)

    expect(repository.load()).toEqual({ items: [] })
    expect(() => repository.save(validCart)).not.toThrow()
    expect(() => repository.clear()).not.toThrow()
  })
})
