import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockProducts } from '../adapters/mockProducts'
import { ProductStructuredData } from './ProductStructuredData'

describe('ProductStructuredData', () => {
  it('publica produto, oferta e disponibilidade em JSON-LD', () => {
    const { container } = render(<ProductStructuredData product={mockProducts[0]} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.textContent ?? '{}')

    expect(data).toMatchObject({
      '@type': 'Product',
      name: 'Camiseta Boss',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: '89.90',
        priceCurrency: 'BRL',
      },
    })
  })
})
