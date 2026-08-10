import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductVariantSelector } from './ProductVariantSelector'

const variants = [
  { id: 'preto-p', color: 'Preto', size: 'P', available: true },
  { id: 'preto-g', color: 'Preto', size: 'G', available: true },
  { id: 'cinza-p', color: 'Cinza', size: 'P', available: true },
  { id: 'cinza-g', color: 'Cinza', size: 'G', available: false },
]

describe('ProductVariantSelector', () => {
  it('seleciona cor e impede tamanho indisponível na combinação', () => {
    render(<ProductVariantSelector variants={variants} />)

    fireEvent.click(screen.getByRole('button', { name: 'G' }))
    expect(screen.getByRole('button', { name: 'G' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cinza' }))

    expect(screen.getByRole('button', { name: 'Cinza' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'P' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'G' })).toBeDisabled()
    expect(screen.getByText('Disponível')).toBeInTheDocument()
  })
})
