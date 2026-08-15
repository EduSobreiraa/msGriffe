export type CheckoutSimulationStatus =
  | 'DECLINED'
  | 'ERROR'
  | 'EXPIRED'
  | 'PAID'
  | 'PENDING_PAYMENT'

export const checkoutSimulationStatuses: Record<
  CheckoutSimulationStatus,
  { description: string; title: string }
> = {
  PENDING_PAYMENT: {
    title: 'Pagamento pendente',
    description: 'Simulação iniciada. Nenhum pagamento, pedido ou reserva de estoque foi criado.',
  },
  PAID: {
    title: 'Pagamento aprovado',
    description: 'Estado visual aprovado. Backend ainda precisará confirmar pagamento e reduzir estoque em transação.',
  },
  DECLINED: {
    title: 'Pagamento recusado',
    description: 'Estado visual recusado. Nenhum pagamento ou pedido real foi alterado.',
  },
  EXPIRED: {
    title: 'Pagamento expirado',
    description: 'Estado visual expirado. Nenhuma cobrança, cancelamento ou e-mail foi disparado.',
  },
  ERROR: {
    title: 'Falha no pagamento',
    description: 'Estado visual de erro. Nenhuma comunicação com Mercado Pago foi realizada.',
  },
}
