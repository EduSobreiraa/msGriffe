import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { CartRepository } from '../application/CartRepository'
import type { Cart } from '../domain/Cart'
import { CartProvider } from '../presentation/CartProvider'
import { CartPage } from './CartPage'
import { testCartPricingService } from '../../../test/cartPricingService'

const cartWithItem: Cart = {
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
      quantity: 1,
    },
  ],
}

function renderPage(initialCart: Cart) {
  const repository: CartRepository = {
    load: vi.fn().mockReturnValue(initialCart),
    save: vi.fn(),
    clear: vi.fn(),
  }

  render(
    <CartProvider pricingService={testCartPricingService} repository={repository}>
      <CartPage />
    </CartProvider>,
  )

  return repository
}

describe('CartPage', () => {
  it('apresenta estado vazio com retorno ao catálogo', () => {
    renderPage({ items: [] })

    expect(screen.getByRole('heading', { name: 'Sacola', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sua sacola está vazia' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explorar produtos' })).toHaveAttribute(
      'href',
      '/produtos',
    )
    expect(document.title).toBe('Sacola | MS Griffe')
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    )
  })

  it('revisa, altera e remove itens usando as ações do carrinho', () => {
    const repository = renderPage(cartWithItem)

    expect(screen.getByText('Subtotal · 1 item')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 89,90')).toHaveLength(2)
    expect(screen.getByText('R$ 19,90')).toBeInTheDocument()
    expect(screen.getByText('R$ 109,80')).toBeInTheDocument()
    expect(screen.getByText('− R$ 0,00')).toBeInTheDocument()
    expect(screen.getByText(/não constitui oferta/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continuar checkout demonstrativo' })).toHaveAttribute(
      'href',
      '/checkout',
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Aumentar quantidade de Camiseta Boss' }),
    )
    expect(screen.getByText('Subtotal · 2 itens')).toBeInTheDocument()
    expect(screen.getByText('R$ 179,80')).toBeInTheDocument()
    expect(screen.getByText('R$ 199,70')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Aumentar quantidade de Camiseta Boss' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Aumentar quantidade de Camiseta Boss' }),
    )
    expect(screen.getByText('Desconto demonstrativo · 5%')).toBeInTheDocument()
    expect(screen.getByText('− R$ 17,98')).toBeInTheDocument()
    expect(screen.getByText('Grátis')).toBeInTheDocument()
    expect(screen.getByText('R$ 341,62')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Remover Camiseta Boss, Preto, tamanho P',
      }),
    )
    expect(screen.getByRole('heading', { name: 'Sua sacola está vazia' })).toBeInTheDocument()
    expect(repository.save).toHaveBeenLastCalledWith({ items: [] })
  })
})
