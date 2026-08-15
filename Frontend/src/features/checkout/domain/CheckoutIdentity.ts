export interface CheckoutIdentity {
  birthDate: string
  cpf: string
  email: string
  fullName: string
  marketingConsent: boolean
  password: string
  phone: string
}

export const emptyCheckoutIdentity: CheckoutIdentity = {
  birthDate: '',
  cpf: '',
  email: '',
  fullName: '',
  marketingConsent: false,
  password: '',
  phone: '',
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function validateCheckoutIdentity(identity: CheckoutIdentity) {
  const errors: Partial<Record<keyof CheckoutIdentity, string>> = {}

  if (identity.fullName.trim().length < 3) errors.fullName = 'Informe seu nome completo.'
  if (!/^\S+@\S+\.\S+$/.test(identity.email)) errors.email = 'Informe um e-mail válido.'
  if (onlyDigits(identity.phone).length < 10) errors.phone = 'Informe um telefone válido.'
  if (identity.password.length < 8) errors.password = 'Use pelo menos 8 caracteres na senha.'
  if (onlyDigits(identity.cpf).length !== 11) errors.cpf = 'Informe um CPF com 11 dígitos.'
  if (!identity.birthDate) errors.birthDate = 'Informe sua data de nascimento.'

  return errors
}
