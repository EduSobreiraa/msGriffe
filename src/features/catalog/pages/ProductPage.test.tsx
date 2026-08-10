import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { CatalogReader } from '../application/CatalogReader'
import { MockCatalogAdapter } from '../adapters/MockCatalogAdapter'
import { CatalogProvider } from '../presentation/CatalogProvider'
import { ProductPage } from './ProductPage'

function renderProduct(reader: CatalogReader, slug = 'camiseta-boss') {
  return render(
    <CatalogProvider reader={reader}>
      <ProductPage params={{ productSlug: slug }} />
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
    expect(screen.getByRole('button', { name: 'Adicionar à sacola em breve' })).toBeDisabled()
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
