import { useState } from 'react'
import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { Button } from '../../../shared/components/Button'
import { useCart } from '../../cart/presentation/useCart'
import type { ProductDetails } from '../domain/Product'
import { ProductVariantSelector } from './ProductVariantSelector'

interface ProductPurchasePanelProps {
  product: ProductDetails
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const firstAvailableVariant = product.variants.find((variant) => variant.available)
  const [selectedVariantId, setSelectedVariantId] = useState(
    firstAvailableVariant?.id ?? '',
  )
  const [feedback, setFeedback] = useState('')
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId,
  )

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId)
    setFeedback('')
    setAdded(false)
  }

  const handleAddItem = () => {
    if (!selectedVariant?.available) return

    addItem({
      product: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        displayPrice: product.price,
      },
      variant: {
        id: selectedVariant.id,
        color: selectedVariant.color,
        size: selectedVariant.size,
      },
    })
    setFeedback(`${product.name}, cor ${selectedVariant.color}, tamanho ${selectedVariant.size}, adicionado à sacola.`)
    setAdded(true)
  }

  return (
    <>
      <ProductVariantSelector
        variants={product.variants}
        selectedVariantId={selectedVariantId}
        onChange={handleVariantChange}
      />

      <Button
        className={added ? 'product-info__add-button--added' : ''}
        disabled={!selectedVariant?.available}
        fullWidth
        onClick={handleAddItem}
      >
        {added ? 'Adicionado à sacola' : 'Adicionar à sacola'}
      </Button>
      <p className="product-info__feedback" role="status" aria-live="polite">
        {feedback}
        {feedback && (
          <Link className="product-info__cart-link" href={routes.cart}>
            Ver sacola do produto
          </Link>
        )}
      </p>
      <p className="product-info__notice">
        Preços e disponibilidade serão confirmados no checkout.
      </p>
    </>
  )
}
