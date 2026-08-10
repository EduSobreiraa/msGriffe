import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ProductSummary } from '../domain/Product'
import { ProductCard } from './ProductCard'

const product: ProductSummary = {
  id: 'camiseta-teste',
  slug: 'camiseta-teste',
  name: 'Camiseta Teste',
  price: 99.9,
  installmentCount: 10,
  installmentValue: 9.99,
  image: '/produto.png',
  category: { id: 'camisetas', name: 'Camisetas', slug: 'camisetas' },
  featured: true,
}

describe('ProductCard', () => {
  it('apresenta imagem, preço e parcelamento do produto', () => {
    render(<ProductCard product={product} />)

    const imageLink = screen.getByRole('link', {
      name: `Ver detalhes de ${product.name}`,
    })
    expect(imageLink).toHaveAttribute(
      'href',
      `/produtos/${product.slug}`,
    )
    expect(imageLink.querySelector('img')).toHaveAttribute('src', product.image)
    expect(screen.getByText('R$ 99,90')).toBeInTheDocument()
    expect(screen.getByText('10x de R$ 9,99')).toBeInTheDocument()
  })

  it('não habilita a sacola antes da fase funcional', () => {
    render(<ProductCard product={product} />)

    expect(
      screen.getByRole('button', {
        name: `Sacola disponível em breve para ${product.name}`,
      }),
    ).toBeDisabled()
  })
})
