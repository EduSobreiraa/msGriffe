import type { CheckoutSimulationStatus } from '../domain/CheckoutSimulation'
import { checkoutSimulationStatuses } from '../domain/CheckoutSimulation'
import { useCheckout } from '../presentation/useCheckout'

const simulationActions: Array<{ label: string; status: CheckoutSimulationStatus }> = [
  { status: 'PAID', label: 'Simular pagamento aprovado' },
  { status: 'DECLINED', label: 'Simular pagamento recusado' },
  { status: 'EXPIRED', label: 'Simular pagamento expirado' },
  { status: 'ERROR', label: 'Simular falha técnica' },
]

export function CheckoutSimulationPanel() {
  const { paymentSimulationStatus, setPaymentSimulationStatus } = useCheckout()

  if (!paymentSimulationStatus) return null

  const status = checkoutSimulationStatuses[paymentSimulationStatus]

  return (
    <section
      aria-labelledby="checkout-simulation-title"
      className="checkout-simulation"
      data-status={paymentSimulationStatus.toLowerCase()}
    >
      <div aria-atomic="true" aria-live="polite" role="status">
        <p>Estado demonstrativo</p>
        <h2 id="checkout-simulation-title">{status.title}</h2>
        <span>{status.description}</span>
      </div>
      <div className="checkout-simulation__actions" aria-label="Estados simulados de pagamento">
        {simulationActions.map((action) => (
          <button
            className="button button--ghost button--small"
            key={action.status}
            onClick={() => setPaymentSimulationStatus(action.status)}
            type="button"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  )
}
