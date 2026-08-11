import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { CatalogReader } from '../application/CatalogReader'
import { MockCatalogAdapter } from '../adapters/MockCatalogAdapter'
import { CatalogProvider } from '../presentation/CatalogProvider'
import { ProductPage } from './ProductPage'
import { CartProvider } from '../../cart/presentation/CartProvider'
import { testCartPricingService } from '../../../test/cartPricingService'
import type { CartRepository } from '../../cart/application/CartRepository'

function renderProduct(
  reader: CatalogReader,
  slug = 'camiseta-boss',
  repository: CartRepository = {
    load: vi.fn().mockReturnValue({ items: [] }),
    save: vi.fn(),
    clear: vi.fn(),
  },
) {
  return render(
    <CatalogProvider reader={reader}>
      <CartProvider pricingService={testCartPricingService} repository={repository}>
        <ProductPage params={{ productSlug: slug }} />
      </CartProvider>
    </CatalogProvider>,
  )
}

describe('ProductPage', () => {
  it('apresenta detalhe comercial e variantes', async () => {
    renderProduct(new MockCatalogAdapter())

    expect(await screen.findByRole('heading', { name: 'Camiseta Boss' })).toBeInTheDocument()
    expect(screen.getByText('R$ 89,90')).toBeInTheDocument()
    expect(screen.getByText('ou 12x de R$ 8,32')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /Cor:/ })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /Tamanho:/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Adicionar à sacola' })).toBeEnabled()
  })

  it('adiciona exatamente a variante selecionada e informa o resultado', async () => {
    const repository: CartRepository = {
      load: vi.fn().mockReturnValue({ items: [] }),
      save: vi.fn(),
      clear: vi.fn(),
    }
    renderProduct(new MockCatalogAdapter(), 'camiseta-boss', repository)
    await screen.findByRole('heading', { name: 'Camiseta Boss' })

    fireEvent.click(screen.getByRole('button', { name: 'Cinza' }))
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar à sacola' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Camiseta Boss, cor Cinza, tamanho M, adicionado à sacola.',
    )
    expect(repository.save).toHaveBeenLastCalledWith({
      items: [
        expect.objectContaining({
          id: 'camiseta-boss-cinza-m',
          quantity: 1,
          variant: expect.objectContaining({ color: 'Cinza', size: 'M' }),
        }),
      ],
    })
  })

  it('apresenta produto inexistente', async () => {
    const missingReader: CatalogReader = {
      findBySlug: vi.fn().mockResolvedValue(null),
      list: vi.fn(),
    }
    renderProduct(missingReader, 'inexistente')

    expect(await screen.findByRole('heading', { name: 'Produto não encontrado' })).toBeInTheDocument()

  })

  it('recupera uma falha de leitura', async () => {
    const product = await new MockCatalogAdapter().findBySlug('camiseta-boss')
    const findBySlug = vi
      .fn()
      .mockRejectedValueOnce(new Error('falha'))
      .mockResolvedValue(product)

    renderProduct({ findBySlug, list: vi.fn() })

    expect(
      await screen.findByRole('heading', { name: 'Não foi possível carregar o produto' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findByRole('heading', { name: 'Camiseta Boss' })).toBeInTheDocument()
    expect(findBySlug).toHaveBeenCalledTimes(2)
  })
})
