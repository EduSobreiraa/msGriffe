import { IconButton } from '../../../shared/components/IconButton'
import { formatCurrency } from '../../../shared/lib/formatters'
import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { ImageWithFallback } from '../../../shared/components/ImageWithFallback'
import type { ProductSummary } from '../domain/Product'

interface ProductCardProps {
  product: ProductSummary
  imageLoading?: 'eager' | 'lazy'
  headingLevel?: 2 | 3
}

export function ProductCard({
  headingLevel = 3,
  imageLoading = 'lazy',
  product,
}: ProductCardProps) {
  const Heading = `h${headingLevel}` as const

  return (
    <article className="product-card">
      <Link
        aria-label={`Ver detalhes de ${product.name}`}
        className="product-card__image"
        href={routes.product(product.slug)}
      >
        <ImageWithFallback src={product.image} alt="" loading={imageLoading} />
      </Link>
      <div className="product-card__body">
        <div>
          <Heading>
            <Link href={routes.product(product.slug)}>{product.name}</Link>
          </Heading>
          <div className="product-card__price">{formatCurrency(product.price)}</div>
          <div className="product-card__installment">
            {product.installmentCount}x de {formatCurrency(product.installmentValue)}
          </div>
        </div>
        <IconButton
          className="product-card__bag"
          icon="bag"
          label={`Sacola disponível em breve para ${product.name}`}
          title="Sacola disponível em breve"
          disabled
        />
      </div>
    </article>
  )
}
