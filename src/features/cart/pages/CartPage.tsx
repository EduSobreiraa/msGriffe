import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'
import { formatCurrency } from '../../../shared/lib/formatters'
import { CartLineItem } from '../components/CartLineItem'
import { useCart } from '../presentation/useCart'

export function CartPage() {
  const { cart, removeItem, totals, updateQuantity } = useCart()
  useDocumentMetadata({
    title: 'Sacola | MS Griffe',
    description: 'Revise os produtos selecionados na sua sacola MS Griffe.',
    noIndex: true,
  })

  const itemLabel = totals.totalItems === 1 ? 'item' : 'itens'

  return (
    <main className="cart-page" id="conteudo-principal" tabIndex={-1}>
      <div className="container cart-page__container">
        <header className="cart-page__heading">
          <p>Sua seleção</p>
          <h1>Sacola</h1>
          <span>Revise suas peças antes de continuar.</span>
        </header>

        {cart.items.length === 0 ? (
          <section className="cart-page__empty" aria-labelledby="empty-cart-title">
            <h2 id="empty-cart-title">Sua sacola está vazia</h2>
            <p>Encontre uma peça, escolha cor e tamanho e volte para revisar aqui.</p>
            <Link className="button button--primary button--medium" href={routes.catalog}>
              Explorar produtos
            </Link>
          </section>
        ) : (
          <div className="cart-page__layout">
            <section className="cart-page__items" aria-labelledby="cart-items-title">
              <div className="cart-page__section-heading">
                <h2 id="cart-items-title">Produtos selecionados</h2>
                <span>{totals.totalItems} {itemLabel}</span>
              </div>
              {cart.items.map((item) => (
                <CartLineItem
                  item={item}
                  key={item.id}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </section>

            <aside className="cart-page__summary" aria-labelledby="cart-summary-title">
              <h2 id="cart-summary-title">Resumo</h2>
              <div>
                <span>Subtotal · {totals.totalItems} {itemLabel}</span>
                <strong>{formatCurrency(totals.displaySubtotal)}</strong>
              </div>
              <p>
                Estimativa local. Preços, descontos, entrega e disponibilidade serão
                confirmados antes do pagamento.
              </p>
              <button className="button button--primary button--medium button--full-width" disabled type="button">
                Continuar em breve
              </button>
              <Link className="cart-page__continue" href={routes.catalog}>
                Continuar comprando
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
