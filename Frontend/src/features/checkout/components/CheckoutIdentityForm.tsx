import { useState, type FormEvent } from 'react'
import { Button } from '../../../shared/components/Button'
import {
  type CheckoutIdentity,
  validateCheckoutIdentity,
} from '../domain/CheckoutIdentity'
import { useCheckout } from '../presentation/useCheckout'

type IdentityErrors = Partial<Record<keyof CheckoutIdentity, string>>

export function CheckoutIdentityForm() {
  const { identity, identityComplete, markIdentityComplete, updateIdentity } = useCheckout()
  const [errors, setErrors] = useState<IdentityErrors>({})

  const updateField = <Key extends keyof CheckoutIdentity>(key: Key, value: CheckoutIdentity[Key]) => {
    updateIdentity({ [key]: value } as Pick<CheckoutIdentity, Key>)
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateCheckoutIdentity(identity)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) markIdentityComplete()
  }

  return (
    <section className="checkout-section" aria-labelledby="checkout-identity-title">
      <div className="checkout-section__heading">
        <p>Etapa 1 de 4</p>
        <h2 id="checkout-identity-title">Seus dados</h2>
        <span>Usados somente nesta simulação de checkout.</span>
      </div>

      <form className="checkout-form" noValidate onSubmit={handleSubmit}>
        <div className="checkout-form__grid">
          <label className="checkout-field checkout-field--wide">
            <span>Nome completo</span>
            <input
              autoComplete="name"
              onChange={(event) => updateField('fullName', event.target.value)}
              value={identity.fullName}
            />
            {errors.fullName && <small role="alert">{errors.fullName}</small>}
          </label>
          <label className="checkout-field">
            <span>E-mail</span>
            <input
              autoComplete="email"
              inputMode="email"
              onChange={(event) => updateField('email', event.target.value)}
              type="email"
              value={identity.email}
            />
            {errors.email && <small role="alert">{errors.email}</small>}
          </label>
          <label className="checkout-field">
            <span>Telefone</span>
            <input
              autoComplete="tel"
              inputMode="tel"
              onChange={(event) => updateField('phone', event.target.value)}
              type="tel"
              value={identity.phone}
            />
            {errors.phone && <small role="alert">{errors.phone}</small>}
          </label>
          <label className="checkout-field">
            <span>Senha para criar conta</span>
            <input
              autoComplete="new-password"
              onChange={(event) => updateField('password', event.target.value)}
              type="password"
              value={identity.password}
            />
            {errors.password && <small role="alert">{errors.password}</small>}
          </label>
          <label className="checkout-field">
            <span>CPF</span>
            <input
              autoComplete="off"
              aria-describedby={errors.cpf ? 'checkout-cpf-error' : undefined}
              inputMode="numeric"
              onChange={(event) => updateField('cpf', event.target.value)}
              value={identity.cpf}
            />
            {errors.cpf && <small id="checkout-cpf-error" role="alert">{errors.cpf}</small>}
          </label>
          <label className="checkout-field">
            <span>Data de nascimento</span>
            <input
              autoComplete="bday"
              onChange={(event) => updateField('birthDate', event.target.value)}
              type="date"
              value={identity.birthDate}
            />
            {errors.birthDate && <small role="alert">{errors.birthDate}</small>}
          </label>
        </div>

        <label className="checkout-consent">
          <input
            checked={identity.marketingConsent}
            onChange={(event) => updateField('marketingConsent', event.target.checked)}
            type="checkbox"
          />
          <span>Quero receber novidades e ofertas da MS Griffe.</span>
        </label>

        <p className="checkout-form__notice">
          Dados ficam somente em memória neste navegador. Cadastro, segurança e validação serão feitos pelo backend.
        </p>
        <Button fullWidth type="submit">
          {identityComplete ? 'Dados conferidos' : 'Continuar para entrega'}
        </Button>
      </form>
    </section>
  )
}
