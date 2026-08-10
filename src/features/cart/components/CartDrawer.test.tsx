import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { CartRepository } from '../application/CartRepository'
import type { Cart } from '../domain/Cart'
import { CartProvider } from '../presentation/CartProvider'
import { CartDrawer } from './CartDrawer'

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

function renderDrawer(initialCart: Cart) {
  const repository: CartRepository = {
    load: vi.fn().mockReturnValue(initialCart),
    save: vi.fn(),
    clear: vi.fn(),
  }

  function Harness() {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <>
        <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
          Abrir sacola
        </button>
        <CartDrawer
          isOpen={open}
          onClose={() => setOpen(false)}
          triggerRef={triggerRef}
        />
      </>
    )
  }

  render(
    <CartProvider repository={repository}>
      <Harness />
    </CartProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Abrir sacola' }))
  return repository
}

describe('CartDrawer', () => {
  it('move o foco, altera quantidade e remove o item', async () => {
    const repository = renderDrawer(cartWithItem)

    const closeButtons = screen.getAllByRole('button', { name: 'Fechar sacola' })
    await waitFor(() => expect(closeButtons[1]).toHaveFocus())
    expect(document.body).toHaveClass('modal-open')
    expect(screen.getByText('Subtotal · 1 item')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Aumentar quantidade de Camiseta Boss' }),
    )
    expect(screen.getByText('Subtotal · 2 itens')).toBeInTheDocument()
    expect(screen.getByText('R$ 179,80')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Diminuir quantidade de Camiseta Boss' }),
    )
    expect(screen.getByText('Subtotal · 1 item')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Remover Camiseta Boss, Preto, tamanho P',
      }),
    )
    expect(screen.getByText('Sua sacola está vazia')).toBeInTheDocument()
    expect(repository.save).toHaveBeenLastCalledWith({ items: [] })
  })

  it('fecha por Escape e devolve o foco ao acionador', async () => {
    renderDrawer(cartWithItem)
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: 'Fechar sacola' })[1]).toHaveFocus(),
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('dialog', { name: 'Sacola' })).not.toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Abrir sacola' })).toHaveFocus(),
    )
    expect(document.body).not.toHaveClass('modal-open')
  })

  it('orienta o usuário quando a sacola está vazia', () => {
    renderDrawer({ items: [] })

    expect(screen.getByRole('heading', { name: 'Sua sacola está vazia' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver produtos' })).toHaveAttribute(
      'href',
      '/produtos',
    )
  })

  it('mantém a navegação por Tab dentro do drawer', async () => {
    renderDrawer({ items: [] })
    const closeButton = screen.getAllByRole('button', { name: 'Fechar sacola' })[1]
    const catalogLink = screen.getByRole('link', { name: 'Ver produtos' })
    await waitFor(() => expect(closeButton).toHaveFocus())

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(catalogLink).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(closeButton).toHaveFocus()
  })
})
