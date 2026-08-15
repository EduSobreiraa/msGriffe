import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'
import { CheckoutAddressForm } from '../components/CheckoutAddressForm'
import { CheckoutIdentityForm } from '../components/CheckoutIdentityForm'
import { CheckoutPaymentForm } from '../components/CheckoutPaymentForm'
import { CheckoutReview } from '../components/CheckoutReview'

export function CheckoutPage() {
  useDocumentMetadata({
    title: 'Checkout | MS Griffe',
    description: 'Informe seus dados para continuar a simulação de checkout da MS Griffe.',
    noIndex: true,
  })

  return (
    <main className="checkout-page" id="conteudo-principal" tabIndex={-1}>
      <div className="container checkout-page__container">
        <header className="checkout-page__heading">
          <p>Checkout demonstrativo</p>
          <h1>Finalizar compra</h1>
          <span>Confirme seus dados em etapas. Nenhuma cobrança será realizada.</span>
        </header>
        <CheckoutIdentityForm />
        <CheckoutAddressForm />
        <CheckoutPaymentForm />
        <CheckoutReview />
        <Link className="checkout-page__back" href={routes.cart}>Voltar para sacola</Link>
      </div>
    </main>
  )
}
