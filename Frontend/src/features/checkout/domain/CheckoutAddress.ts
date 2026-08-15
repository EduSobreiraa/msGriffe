import { onlyDigits } from './CheckoutIdentity'

export type DeliveryOption = 'express' | 'standard'

export interface CheckoutAddress {
  cep: string
  city: string
  complement: string
  neighborhood: string
  number: string
  state: string
  street: string
}

export const emptyCheckoutAddress: CheckoutAddress = {
  cep: '',
  city: '',
  complement: '',
  neighborhood: '',
  number: '',
  state: '',
  street: '',
}

export function validateCheckoutAddress(address: CheckoutAddress) {
  const errors: Partial<Record<keyof CheckoutAddress, string>> = {}

  if (onlyDigits(address.cep).length !== 8) errors.cep = 'Informe um CEP com 8 dígitos.'
  if (address.street.trim().length < 3) errors.street = 'Informe seu endereço.'
  if (!address.number.trim()) errors.number = 'Informe o número.'
  if (address.neighborhood.trim().length < 2) errors.neighborhood = 'Informe o bairro.'
  if (address.city.trim().length < 2) errors.city = 'Informe a cidade.'
  if (!/^[A-Za-z]{2}$/.test(address.state.trim())) errors.state = 'Informe a sigla do estado.'

  return errors
}
