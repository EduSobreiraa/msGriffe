import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductGallery } from './ProductGallery'

describe('ProductGallery', () => {
  it('permite trocar a imagem principal por uma miniatura', () => {
    render(
      <ProductGallery
        images={['/frente.png', '/costas.png']}
        productName="Camiseta Teste"
      />,
    )

    const mainImage = screen.getByRole('img', { name: 'Camiseta Teste' })
    expect(mainImage).toHaveAttribute('src', '/frente.png')

    fireEvent.click(
      screen.getByRole('button', { name: 'Ver imagem 2 de Camiseta Teste' }),
    )

    expect(mainImage).toHaveAttribute('src', '/costas.png')
  })
})
