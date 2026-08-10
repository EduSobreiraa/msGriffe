import { routes } from '../../../app/routes'
import type { ProductDetails } from '../domain/Product'

interface ProductStructuredDataProps {
  product: ProductDetails
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((image) => new URL(image, window.location.origin).href),
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'BRL',
      availability: product.variants.some((variant) => variant.available)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: new URL(routes.product(product.slug), window.location.origin).href,
    },
  }
  const serializedData = JSON.stringify(data).replace(/</g, '\\u003c')

  return <script type="application/ld+json">{serializedData}</script>
}
