import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { IconButton } from '../../../shared/components/IconButton'
import { ImageWithFallback } from '../../../shared/components/ImageWithFallback'
import { formatCurrency } from '../../../shared/lib/formatters'
import { MAX_CART_ITEM_QUANTITY, type CartItem } from '../domain/Cart'

interface CartLineItemProps {
  item: CartItem
  onNavigate?(): void
  onRemove(itemId: string): void
  onUpdateQuantity(itemId: string, quantity: number): void
}

export function CartLineItem({
  item,
  onNavigate,
  onRemove,
  onUpdateQuantity,
}: CartLineItemProps) {
  return (
    <article className="cart-line-item">
      <Link
        aria-label={`Ver ${item.product.name}`}
        className="cart-line-item__image"
        href={routes.product(item.product.slug)}
        onClick={onNavigate}
      >
        <ImageWithFallback src={item.product.image} alt="" />
      </Link>

      <div className="cart-line-item__content">
        <div className="cart-line-item__heading">
          <h3>
            <Link href={routes.product(item.product.slug)} onClick={onNavigate}>
              {item.product.name}
            </Link>
          </h3>
          <IconButton
            icon="x"
            label={`Remover ${item.product.name}, ${item.variant.color}, tamanho ${item.variant.size}`}
            onClick={() => onRemove(item.id)}
          />
        </div>
        <p>{item.variant.color} · Tamanho {item.variant.size}</p>
        <strong>{formatCurrency(item.product.displayPrice)}</strong>

        <div className="cart-line-item__quantity" aria-label={`Quantidade de ${item.product.name}`}>
          <button
            aria-label={`Diminuir quantidade de ${item.product.name}`}
            disabled={item.quantity <= 1}
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            type="button"
          >
            −
          </button>
          <span aria-live="polite">{item.quantity}</span>
          <button
            aria-label={`Aumentar quantidade de ${item.product.name}`}
            disabled={item.quantity >= MAX_CART_ITEM_QUANTITY}
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}
