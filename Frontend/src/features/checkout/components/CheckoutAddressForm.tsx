import { useState, type FormEvent } from 'react'
import { Button } from '../../../shared/components/Button'
import {
  type CheckoutAddress,
  validateCheckoutAddress,
} from '../domain/CheckoutAddress'
import { useCheckout } from '../presentation/useCheckout'
import { DeliveryOptions } from './DeliveryOptions'

type AddressErrors = Partial<Record<keyof CheckoutAddress, string>>

export function CheckoutAddressForm() {
  const {
    address,
    addressComplete,
    identityComplete,
    markAddressComplete,
    updateAddress,
  } = useCheckout()
  const [errors, setErrors] = useState<AddressErrors>({})
  const disabled = !identityComplete

  const updateField = <Key extends keyof CheckoutAddress>(key: Key, value: CheckoutAddress[Key]) => {
    updateAddress({ [key]: value } as Pick<CheckoutAddress, Key>)
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateCheckoutAddress(address)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) markAddressComplete()
  }

  return (
    <section
      aria-disabled={disabled}
      className="checkout-section"
      aria-labelledby="checkout-address-title"
    >
      <div className="checkout-section__heading">
        <p>Etapa 2 de 4</p>
        <h2 id="checkout-address-title">Entrega</h2>
        <span>
          {disabled
            ? 'Conclua seus dados para informar o endereço.'
            : 'Informe onde deseja receber o pedido demonstrativo.'}
        </span>
      </div>

      <form className="checkout-form" noValidate onSubmit={handleSubmit}>
        <div className="checkout-form__grid">
          <label className="checkout-field">
            <span>CEP</span>
            <input
              autoComplete="postal-code"
              disabled={disabled}
              inputMode="numeric"
              onChange={(event) => updateField('cep', event.target.value)}
              value={address.cep}
            />
            {errors.cep && <small role="alert">{errors.cep}</small>}
          </label>
          <label className="checkout-field checkout-field--wide">
            <span>Endereço</span>
            <input
              autoComplete="street-address"
              disabled={disabled}
              onChange={(event) => updateField('street', event.target.value)}
              value={address.street}
            />
            {errors.street && <small role="alert">{errors.street}</small>}
          </label>
          <label className="checkout-field">
            <span>Número</span>
            <input
              autoComplete="address-line2"
              disabled={disabled}
              onChange={(event) => updateField('number', event.target.value)}
              value={address.number}
            />
            {errors.number && <small role="alert">{errors.number}</small>}
          </label>
          <label className="checkout-field">
            <span>Complemento</span>
            <input
              autoComplete="address-line2"
              disabled={disabled}
              onChange={(event) => updateField('complement', event.target.value)}
              value={address.complement}
            />
          </label>
          <label className="checkout-field">
            <span>Bairro</span>
            <input
              autoComplete="address-level3"
              disabled={disabled}
              onChange={(event) => updateField('neighborhood', event.target.value)}
              value={address.neighborhood}
            />
            {errors.neighborhood && <small role="alert">{errors.neighborhood}</small>}
          </label>
          <label className="checkout-field">
            <span>Cidade</span>
            <input
              autoComplete="address-level2"
              disabled={disabled}
              onChange={(event) => updateField('city', event.target.value)}
              value={address.city}
            />
            {errors.city && <small role="alert">{errors.city}</small>}
          </label>
          <label className="checkout-field">
            <span>Estado (UF)</span>
            <input
              autoComplete="address-level1"
              disabled={disabled}
              maxLength={2}
              onChange={(event) => updateField('state', event.target.value.toUpperCase())}
              value={address.state}
            />
            {errors.state && <small role="alert">{errors.state}</small>}
          </label>
        </div>

        <DeliveryOptions disabled={disabled} />
        <p className="checkout-form__notice">
          CEP, endereço, modalidade, prazo e valor do frete serão validados pelo backend antes do pagamento.
        </p>
        <Button disabled={disabled} fullWidth type="submit">
          {addressComplete ? 'Entrega conferida' : 'Continuar para revisão'}
        </Button>
      </form>
    </section>
  )
}
