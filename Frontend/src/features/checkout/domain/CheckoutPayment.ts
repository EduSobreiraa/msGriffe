export type PaymentMethod = 'boleto' | 'card' | 'pix' | null

export const paymentMethodLabels: Record<Exclude<PaymentMethod, null>, string> = {
  boleto: 'Boleto',
  card: 'Cartão de crédito',
  pix: 'Pix',
}
