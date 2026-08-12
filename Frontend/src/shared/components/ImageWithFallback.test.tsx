import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ImageWithFallback } from './ImageWithFallback'

describe('ImageWithFallback', () => {
  it('substitui uma imagem quebrada apenas uma vez', () => {
    const onError = vi.fn()
    render(<ImageWithFallback alt="Produto" onError={onError} src="/quebrada.png" />)
    const image = screen.getByRole('img', { name: 'Produto' })

    fireEvent.error(image)
    expect(image).toHaveAttribute('src', '/images/product-placeholder.svg')
    expect(image).toHaveAttribute('data-fallback-applied', 'true')

    fireEvent.error(image)
    expect(onError).toHaveBeenCalledTimes(2)
    expect(image).toHaveAttribute('src', '/images/product-placeholder.svg')
  })
})
