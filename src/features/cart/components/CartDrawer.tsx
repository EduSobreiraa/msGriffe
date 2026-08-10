import { useRef, type RefObject } from 'react'
import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { Button } from '../../../shared/components/Button'
import { IconButton } from '../../../shared/components/IconButton'
import { formatCurrency } from '../../../shared/lib/formatters'
import { useModalDialog } from '../../../shared/hooks/useModalDialog'
import { useCart } from '../presentation/useCart'
import { CartLineItem } from './CartLineItem'

interface CartDrawerProps {
  isOpen: boolean
  onClose(): void
  triggerRef: RefObject<HTMLElement | null>
}

export function CartDrawer({ isOpen, onClose, triggerRef }: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { cart, removeItem, totals, updateQuantity } = useCart()

  useModalDialog({
    containerRef: drawerRef,
    initialFocusRef: closeButtonRef,
    isOpen,
    onClose,
    returnFocusRef: triggerRef,
  })

  if (!isOpen) return null

  const itemLabel = totals.totalItems === 1 ? 'item' : 'itens'

  return (
    <>
      <button
        aria-label="Fechar sacola"
        className="cart-drawer-backdrop"
        onClick={onClose}
        type="button"
      />
      <div
        aria-labelledby="cart-drawer-title"
        aria-modal="true"
        className="cart-drawer"
        ref={drawerRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="cart-drawer__header">
          <div>
            <p>Sua seleção</p>
            <h2 id="cart-drawer-title">Sacola</h2>
          </div>
          <IconButton
            ref={closeButtonRef}
            icon="x"
            label="Fechar sacola"
            onClick={onClose}
          />
        </header>

        {cart.items.length === 0 ? (
          <div className="cart-drawer__empty">
            <h3>Sua sacola está vazia</h3>
            <p>Escolha uma peça e selecione cor e tamanho para começar.</p>
            <Link
              className="button button--primary button--medium"
              href={routes.catalog}
              onClick={onClose}
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {cart.items.map((item) => (
                <CartLineItem
                  item={item}
                  key={item.id}
                  onNavigate={onClose}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
            <footer className="cart-drawer__footer">
              <div>
                <span>Subtotal · {totals.totalItems} {itemLabel}</span>
                <strong>{formatCurrency(totals.displaySubtotal)}</strong>
              </div>
              <p>Estimativa local. Valores serão confirmados no checkout.</p>
              <Button disabled fullWidth>Ir para o carrinho em breve</Button>
            </footer>
          </>
        )}
      </div>
    </>
  )
}
