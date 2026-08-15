import { useState, type FormEvent } from 'react'
import { Button } from '../../../shared/components/Button'
import type { PaymentMethod } from '../domain/CheckoutPayment'
import { useCheckout } from '../presentation/useCheckout'

const paymentOptions: Array<{ description: string; label: string; value: Exclude<PaymentMethod, null> }> = [
  {
    value: 'pix',
    label: 'Pix',
    description: 'Disponibilidade, desconto e instruções serão definidos pelo backend.',
  },
  {
    value: 'card',
    label: 'Cartão de crédito',
    description: 'Parcelamento e dados financeiros não são coletados nesta simulação.',
  },
  {
    value: 'boleto',
    label: 'Boleto',
    description: 'Vencimento e emissão dependerão da integração de pagamento.',
  },
]

export function CheckoutPaymentForm() {
  const {
    addressComplete,
    couponCode,
    couponSubmitted,
    paymentMethod,
    selectPaymentMethod,
    setCouponCode,
    submitCoupon,
  } = useCheckout()
  const [couponError, setCouponError] = useState('')
  const disabled = !addressComplete

  const handleCouponSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!couponCode.trim()) {
      setCouponError('Informe um cupom para registrá-lo nesta simulação.')
      return
    }

    setCouponError('')
    submitCoupon()
  }

  return (
    <section
      aria-disabled={disabled}
      className="checkout-section"
      aria-labelledby="checkout-payment-title"
    >
      <div className="checkout-section__heading">
        <p>Etapa 3 de 4</p>
        <h2 id="checkout-payment-title">Pagamento</h2>
        <span>
          {disabled
            ? 'Conclua a entrega para escolher uma modalidade de pagamento.'
            : 'Selecione uma modalidade; nenhuma cobrança será iniciada.'}
        </span>
      </div>

      <div className="checkout-payment">
        <form className="checkout-coupon" noValidate onSubmit={handleCouponSubmit}>
          <label className="checkout-field" htmlFor="checkout-coupon-code">
            <span>Cupom de desconto</span>
            <input
              disabled={disabled}
              id="checkout-coupon-code"
              onChange={(event) => {
                setCouponCode(event.target.value)
                setCouponError('')
              }}
              placeholder="Digite seu cupom"
              value={couponCode}
            />
          </label>
          <Button disabled={disabled} size="small" type="submit" variant="secondary">
            Registrar cupom
          </Button>
          {couponError && <small role="alert">{couponError}</small>}
          {couponSubmitted && (
            <p className="checkout-coupon__feedback" role="status">
              Cupom registrado para validação no backend. Nenhum desconto foi aplicado.
            </p>
          )}
        </form>

        <fieldset className="checkout-payment__methods" disabled={disabled}>
          <legend>Forma de pagamento</legend>
          <p>Escolha visual; nenhum dado financeiro é solicitado ou armazenado.</p>
          <div>
            {paymentOptions.map((option) => (
              <label className="checkout-payment__option" key={option.value}>
                <input
                  checked={paymentMethod === option.value}
                  name="payment-method"
                  onChange={() => selectPaymentMethod(option.value)}
                  type="radio"
                  value={option.value}
                />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <p className="checkout-form__notice">
        Cupons, preço final, juros, desconto no Pix e pagamento serão validados pelo backend antes de qualquer cobrança.
      </p>
    </section>
  )
}
