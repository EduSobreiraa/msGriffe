import { Link, useRoute } from 'wouter'
import { routes } from '../../../app/routes'
import { formatCurrency } from '../../../shared/lib/formatters'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'
import { ProtectedAccountContent } from '../components/ProtectedAccountContent'
import { demoOrders, orderStatusLabels } from '../domain/Account'

function OrdersContent() {
  return <main className="account-page" id="conteudo-principal" tabIndex={-1}><div className="container account-layout"><header className="account-heading"><p>Área da conta</p><h1>Seus pedidos</h1><span>Histórico demonstrativo. Backend será fonte de dados autoritativa.</span></header><nav className="account-navigation" aria-label="Navegação da conta"><Link href={routes.account}>Perfil</Link><Link href={routes.orders}>Pedidos</Link></nav><section className="account-card" aria-label="Lista de pedidos">{demoOrders.map((order) => <article className="account-order" key={order.id}><div><p>{order.id}</p><h2>{orderStatusLabels[order.status]}</h2><span>{order.createdAt} · {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</span></div><div><strong>{formatCurrency(order.total)}</strong><Link href={routes.order(order.id)}>Ver pedido</Link></div></article>)}</section></div></main>
}

function OrderDetailContent({ orderId }: { orderId: string }) {
  const order = demoOrders.find((item) => item.id === orderId)
  if (!order) return <main className="account-page" id="conteudo-principal" tabIndex={-1}><section className="container account-gate"><h1>Pedido não encontrado</h1><Link className="button button--primary button--medium" href={routes.orders}>Voltar para pedidos</Link></section></main>
  const steps = ['Pagamento confirmado', 'Em preparação', 'Pedido enviado', 'Pedido entregue']
  return <main className="account-page" id="conteudo-principal" tabIndex={-1}><div className="container account-layout"><header className="account-heading"><p>{order.id}</p><h1>{orderStatusLabels[order.status]}</h1><span>Atualização visual. Status real será validado pelo backend.</span></header><section className="account-card"><h2>Itens</h2><ul className="account-order-items">{order.items.map((item) => <li key={`${item.name}-${item.variant}`}><span>{item.name} · {item.variant}</span><strong>{item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}</strong></li>)}</ul><p className="account-order-total">Total demonstrativo: <strong>{formatCurrency(order.total)}</strong></p></section><section className="account-card"><h2>Linha do tempo</h2><ol className="account-timeline">{steps.map((step, index) => <li className={index <= (order.status === 'DELIVERED' ? 3 : order.status === 'SHIPPED' ? 2 : 1) ? 'account-timeline__item--done' : ''} key={step}>{step}<span>{index <= 1 ? 'Demonstração de status' : 'Aguardando confirmação'}</span></li>)}</ol></section><Link className="account-auth__back" href={routes.orders}>Voltar para pedidos</Link></div></main>
}

export function OrdersPage() {
  useDocumentMetadata({ title: 'Meus pedidos | MS Griffe', description: 'Pedidos demonstrativos da conta.', noIndex: true })
  return <ProtectedAccountContent><OrdersContent /></ProtectedAccountContent>
}

export function OrderDetailPage() {
  const [, params] = useRoute('/conta/pedidos/:orderId')
  useDocumentMetadata({ title: 'Pedido | MS Griffe', description: 'Detalhe demonstrativo de pedido.', noIndex: true })
  return <ProtectedAccountContent><OrderDetailContent orderId={params?.orderId ?? ''} /></ProtectedAccountContent>
}
