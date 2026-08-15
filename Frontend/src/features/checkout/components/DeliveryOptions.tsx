import type { DeliveryOption } from '../domain/CheckoutAddress'
import { useCheckout } from '../presentation/useCheckout'

interface DeliveryOptionsProps {
  disabled: boolean
}

const options: Array<{ description: string; label: string; value: DeliveryOption }> = [
  {
    value: 'standard',
    label: 'Entrega padrão',
    description: 'A modalidade, o prazo e o valor serão confirmados no backend.',
  },
  {
    value: 'express',
    label: 'Entrega expressa',
    description: 'Disponibilidade e valor dependem do CEP e da definição comercial.',
  },
]

export function DeliveryOptions({ disabled }: DeliveryOptionsProps) {
  const { deliveryOption, setDeliveryOption } = useCheckout()

  return (
    <fieldset className="checkout-delivery" disabled={disabled}>
      <legend>Modalidade de entrega</legend>
      <p>Escolha visual. Nenhum prazo ou frete é garantido nesta simulação.</p>
      <div className="checkout-delivery__options">
        {options.map((option) => (
          <label className="checkout-delivery__option" key={option.value}>
            <input
              checked={deliveryOption === option.value}
              name="delivery-option"
              onChange={() => setDeliveryOption(option.value)}
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
  )
}
