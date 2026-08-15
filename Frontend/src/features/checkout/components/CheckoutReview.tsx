import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { Button } from '../../../shared/components/Button'
import { formatCurrency } from '../../../shared/lib/formatters'
import { useCart } from '../../cart/presentation/useCart'
import { paymentMethodLabels } from '../domain/CheckoutPayment'
import { useCheckout } from '../presentation/useCheckout'

const deliveryLabels = {
  express: 'Entrega expressa',
  standard: 'Entrega padrão',
}

export function CheckoutReview() {
  const { cart, pricing, totals } = useCart()
  const {
    addressComplete,
    couponCode,
    couponSubmitted,
    deliveryOption,
    paymentMethod,
    startPaymentSimulation,
  } = useCheckout()
  const readyToReview = addressComplete && paymentMethod !== null

  return (
    <section
      aria-disabled={!readyToReview}
      className="checkout-section"
      aria-labelledby="checkout-review-title"
    >
      <div className="checkout-section__heading">
        <p>Etapa 4 de 4</p>
        <h2 id="checkout-review-title">Revisão</h2>
        <span>
          {readyToReview
            ? 'Confira as projeções antes da próxima simulação.'
            : 'Conclua entrega e pagamento para revisar o pedido demonstrativo.'}
        </span>
      </div>

      {cart.items.length === 0 ? (
        <p className="checkout-review__empty">
          Sua sacola está vazia. <Link href={routes.catalog}>Explorar produtos</Link>
        </p>
      ) : (
        <>
          <ul className="checkout-review__items" aria-label="Produtos revisados">
            {cart.items.map((item) => (
              <li key={item.id}>
                <span>{item.product.name} · {item.variant.color} · {item.variant.size}</span>
                <strong>{item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}</strong>
              </li>
            ))}
          </ul>
          <dl className="checkout-review__summary">
            <div>
              <dt>Subtotal · {totals.totalItems} {totals.totalItems === 1 ? 'item' : 'itens'}</dt>
              <dd>{formatCurrency(pricing.displaySubtotal)}</dd>
            </div>
            <div>
              <dt>Desconto demonstrativo</dt>
              <dd>− {formatCurrency(pricing.displayDiscount)}</dd>
            </div>
            <div>
              <dt>Frete estimado</dt>
              <dd>{pricing.shippingIsFree ? 'Grátis' : formatCurrency(pricing.displayShipping)}</dd>
            </div>
            <div>
              <dt>Entrega selecionada</dt>
              <dd>{deliveryLabels[deliveryOption]}</dd>
            </div>
            <div>
              <dt>Pagamento selecionado</dt>
              <dd>{paymentMethod ? paymentMethodLabels[paymentMethod] : 'A escolher'}</dd>
            </div>
            {couponSubmitted && (
              <div>
                <dt>Cupom informado</dt>
                <dd>{couponCode}</dd>
              </div>
            )}
            <div className="checkout-review__total">
              <dt>Total demonstrativo</dt>
              <dd>{formatCurrency(pricing.displayTotal)}</dd>
            </div>
          </dl>
          <p className="checkout-form__notice">
            Simulação do frontend. Estoque, cupom, frete, preço e pagamento serão confirmados pelo backend.
          </p>
          <Button disabled={!readyToReview} fullWidth onClick={startPaymentSimulation}>
            Simular criação do pedido
          </Button>
        </>
      )}
    </section>
  )
}
