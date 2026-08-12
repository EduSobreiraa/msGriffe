import { ProductCard } from '../../catalog/components/ProductCard'
import { useCatalogProducts } from '../../catalog/presentation/useCatalogProducts'
import { Skeleton } from '../../../shared/components/Skeleton'

export function FeaturedProductsSection() {
  const products = useCatalogProducts({
    featured: true,
    page: 1,
    pageSize: 4,
    sort: 'newest',
  })

  return (
    <section className="featured" id="produtos" aria-labelledby="featured-title">
      <div className="container">
        <div className="section-heading">
          <h2 id="featured-title">Destaques</h2>
          <p>Confira os produtos mais desejados do momento.</p>
        </div>

        <div className="product-grid">
          {products.status === 'loading' &&
            Array.from({ length: 4 }, (_, index) => (
              <Skeleton className="product-card-skeleton" key={index} />
            ))}
          {products.status === 'success' &&
            products.result.items.map((product, index) => (
              <ProductCard
                imageLoading={index === 0 ? 'eager' : 'lazy'}
                imagePriority={index === 0 ? 'high' : 'auto'}
                product={product}
                key={product.id}
              />
            ))}
        </div>

        {products.status === 'error' && (
          <p className="catalog-feedback" role="alert">
            Não foi possível carregar os produtos em destaque.
          </p>
        )}
      </div>
    </section>
  )
}
