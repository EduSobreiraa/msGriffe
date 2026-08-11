import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { CartRepository } from '../application/CartRepository'
import { CartProvider } from './CartProvider'
import { useCart } from './useCart'
import { testCartPricingService } from '../../../test/cartPricingService'

function CartHarness() {
  const { addItem, cart, clear, pricing, totals, updateQuantity } = useCart()
  const firstItem = cart.items[0]

  return (
    <div>
      <span>{totals.totalItems} itens</span>
      <span>Total {pricing.displayTotal}</span>
      <button
        type="button"
        onClick={() =>
          addItem({
            product: {
              id: 'camiseta-boss',
              slug: 'camiseta-boss',
              name: 'Camiseta Boss',
              image: '/images/bossshirt.png',
              displayPrice: 89.9,
            },
            variant: { id: 'camiseta-boss-preto-p', color: 'Preto', size: 'P' },
          })
        }
      >
        Adicionar
      </button>
      <button type="button" onClick={() => firstItem && updateQuantity(firstItem.id, 3)}>
        Alterar
      </button>
      <button type="button" onClick={clear}>Limpar</button>
    </div>
  )
}

describe('CartProvider', () => {
  it('carrega, altera e persiste o carrinho por meio da porta', () => {
    const repository: CartRepository = {
      load: vi.fn().mockReturnValue({ items: [] }),
      save: vi.fn(),
      clear: vi.fn(),
    }
    render(
      <CartProvider pricingService={testCartPricingService} repository={repository}>
        <CartHarness />
      </CartProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(screen.getByText('1 itens')).toBeInTheDocument()
    expect(screen.getByText('Total 109.8')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }))
    expect(screen.getByText('3 itens')).toBeInTheDocument()
    expect(screen.getByText('Total 276.11')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(screen.getByText('0 itens')).toBeInTheDocument()
    expect(repository.clear).toHaveBeenCalledOnce()
    expect(repository.save).toHaveBeenLastCalledWith({ items: [] })
  })
})
