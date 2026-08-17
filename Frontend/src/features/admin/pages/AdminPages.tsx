import { useState } from 'react'
import { Link, useRoute } from 'wouter'
import { routes } from '../../../app/routes'
import { formatCurrency } from '../../../shared/lib/formatters'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'
import { AdminShell } from '../components/AdminShell'
import { adminPaymentStatusLabels, adminStatusLabels, demoAdminCustomers, nextOperationalStatus } from '../domain/AdminData'
import { useAdmin } from '../presentation/useAdmin'

function PageHeader({ title, text }: { text: string; title: string }) { return <header className="admin-heading"><h1>{title}</h1><span>{text}</span></header> }

export function AdminDashboardPage() {
  const [period, setPeriod] = useState('30 dias')
  const { orders, products } = useAdmin()
  useDocumentMetadata({ title: 'Operação | MS Griffe', description: 'Dashboard administrativo demonstrativo.', noIndex: true })
  const lowStock = products.filter((product) => product.stock <= 3)
  return <AdminShell><PageHeader title="Visão geral" text="Métricas demonstrativas, sujeitas à confirmação por dados autoritativos." /><div className="admin-toolbar"><label>Período <select aria-label="Período do dashboard" onChange={(event) => setPeriod(event.target.value)} value={period}><option>7 dias</option><option>30 dias</option><option>90 dias</option></select></label><span>{period}</span></div><section className="admin-metrics" aria-label="Métricas demonstrativas"><article><span>Faturamento</span><strong>R$ 12.480,00</strong></article><article><span>Pedidos</span><strong>48</strong></article><article><span>Ticket médio</span><strong>R$ 260,00</strong></article><article><span>Estoque baixo</span><strong>{lowStock.length}</strong></article></section><div className="admin-grid"><section className="admin-card"><h2>Pedidos recentes</h2>{orders.map((order) => <p className="admin-row" key={order.id}><span>{order.id} · {order.customer}</span><strong>{adminStatusLabels[order.status]}</strong></p>)}</section><section className="admin-card"><h2>Produtos mais vendidos</h2><p className="admin-row"><span>Camiseta Boss</span><strong>32 unidades</strong></p><p className="admin-row"><span>Short Boss</span><strong>21 unidades</strong></p></section></div></AdminShell>
}

export function AdminOrdersPage() {
  const { advanceOrder, orders } = useAdmin()
  useDocumentMetadata({ title: 'Pedidos | Operação MS Griffe', description: 'Pedidos demonstrativos da operação.', noIndex: true })
  return <AdminShell><PageHeader title="Pedidos" text="Alteração local de status. Backend validará pagamento, permissão, transição e auditoria." /><section className="admin-card"><table className="admin-table"><thead><tr><th scope="col">Pedido</th><th scope="col">Cliente</th><th scope="col">Pagamento</th><th scope="col">Operação</th><th scope="col">Total</th><th scope="col">Ação</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><Link href={routes.adminOrder(order.id)}>{order.id}</Link></td><td>{order.customer}</td><td>{adminPaymentStatusLabels[order.paymentStatus]}</td><td>{adminStatusLabels[order.status]}</td><td>{formatCurrency(order.total)}</td><td>{nextOperationalStatus(order.status) ? <button className="button button--secondary button--small" onClick={() => advanceOrder(order.id)} type="button">Avançar visualmente</button> : 'Concluído'}</td></tr>)}</tbody></table></section></AdminShell>
}

export function AdminOrderDetailPage() {
  const [, params] = useRoute('/admin/pedidos/:orderId')
  const { advanceOrder, orders } = useAdmin()
  const order = orders.find((item) => item.id === params?.orderId)
  useDocumentMetadata({ title: 'Pedido | Operação MS Griffe', description: 'Detalhe demonstrativo de pedido administrativo.', noIndex: true })
  if (!order) return <AdminShell><PageHeader title="Pedido não encontrado" text="O backend será a fonte autoritativa para consulta de pedidos." /><Link className="button button--secondary button--small" href={routes.adminOrders}>Voltar para pedidos</Link></AdminShell>
  const steps = ['Pagamento confirmado', 'Em preparação', 'Pedido enviado', 'Pedido entregue']
  const completedStep = order.status === 'DELIVERED' ? 3 : order.status === 'SHIPPED' ? 2 : order.status === 'PREPARING' ? 1 : 0
  return <AdminShell><PageHeader title={order.id} text="Detalhe demonstrativo. Pagamento e transição operacional reais dependem do backend." /><div className="admin-grid"><section className="admin-card"><h2>Resumo</h2><p className="admin-row"><span>Cliente</span><strong>{order.customer}</strong></p><p className="admin-row"><span>Pagamento</span><strong>{adminPaymentStatusLabels[order.paymentStatus]}</strong></p><p className="admin-row"><span>Operação</span><strong>{adminStatusLabels[order.status]}</strong></p><p className="admin-row"><span>Total</span><strong>{formatCurrency(order.total)}</strong></p>{nextOperationalStatus(order.status) && <button className="button button--secondary button--small" onClick={() => advanceOrder(order.id)} type="button">Avançar visualmente</button>}</section><section className="admin-card"><h2>Linha do tempo</h2><ol className="admin-audit">{steps.map((step, index) => <li key={step}>{step} {index <= completedStep ? '— demonstração concluída' : '— aguardando confirmação'}</li>)}</ol></section></div><Link className="checkout-page__back" href={routes.adminOrders}>Voltar para pedidos</Link></AdminShell>
}

export function AdminCatalogPage() {
  const { changeStock, products } = useAdmin()
  useDocumentMetadata({ title: 'Catálogo | Operação MS Griffe', description: 'Catálogo demonstrativo da operação.', noIndex: true })
  return <AdminShell><PageHeader title="Catálogo e estoque" text="Preços, variantes, imagens e estoque são dados demonstrativos sem escrita comercial real." /><section className="admin-card"><div className="admin-products">{products.map((product) => <article key={product.id}><img alt="" src={product.image} /><div><h2>{product.name}</h2><span>{product.variants} variantes · {formatCurrency(product.price)}</span></div><label>Estoque <input aria-label={`Estoque de ${product.name}`} inputMode="numeric" min="0" onChange={(event) => changeStock(product.id, Number(event.target.value))} type="number" value={product.stock} /></label></article>)}</div><p className="admin-note">Ajustes desta tela não alteram estoque, preço, imagem ou catálogo real.</p></section></AdminShell>
}

export function AdminCustomersPage() {
  useDocumentMetadata({ title: 'Clientes | Operação MS Griffe', description: 'Clientes demonstrativos da operação.', noIndex: true })
  return <AdminShell><PageHeader title="Clientes" text="Dados demonstrativos. Backend aplicará acesso, retenção e privacidade." /><section className="admin-card"><table className="admin-table"><thead><tr><th scope="col">Cliente</th><th scope="col">Última compra</th><th scope="col">Produto</th><th scope="col">Pedidos</th><th scope="col">Total gasto</th></tr></thead><tbody>{demoAdminCustomers.map((customer) => <tr key={customer.id}><td>{customer.name}<small>{customer.email}</small></td><td>{customer.lastOrder}</td><td>{customer.lastProduct}</td><td>{customer.orders}</td><td>{formatCurrency(customer.spent)}</td></tr>)}</tbody></table></section></AdminShell>
}

export function AdminPromotionsPage() {
  useDocumentMetadata({ title: 'Promoções | Operação MS Griffe', description: 'Promoções demonstrativas da operação.', noIndex: true })
  return <AdminShell><PageHeader title="Categorias e promoções" text="Regras comerciais dependem de decisão do vendedor e validação do backend." /><div className="admin-grid"><section className="admin-card"><h2>Categorias</h2><p className="admin-row"><span>Camisetas</span><strong>12 produtos</strong></p><p className="admin-row"><span>Shorts</span><strong>8 produtos</strong></p></section><section className="admin-card"><h2>Cupons e promoções</h2><p className="admin-card__empty">Nenhuma regra comercial será aplicada nesta demonstração.</p><button className="button button--secondary button--small" type="button">Criar visualmente</button></section></div></AdminShell>
}

export function AdminSettingsPage() {
  const { role } = useAdmin()
  useDocumentMetadata({ title: 'Configurações | Operação MS Griffe', description: 'Configurações demonstrativas da operação.', noIndex: true })
  const allowed = role === 'SUPERADMIN'
  return <AdminShell><PageHeader title="Configurações e auditoria" text="Operações críticas serão autorizadas, registradas e notificadas pelo backend." />{allowed ? <section className="admin-card"><h2>Capacidade SUPERADMIN visual</h2><p className="admin-card__empty">Permissões, integrações, retenção e alertas aparecem aqui após implementação autoritativa. Nenhuma configuração é alterada nesta tela.</p><h2>Eventos auditáveis</h2><ul className="admin-audit"><li>Alteração de preço ou estoque</li><li>Mudança de status, cancelamento e reembolso</li><li>Permissões e configurações críticas</li><li>Login administrativo suspeito e falha de webhook</li></ul></section> : <section className="admin-card admin-denied"><h2>Capacidade restrita</h2><p>SELLER não altera configurações críticas. Backend validará `SUPERADMIN` antes da operação.</p><Link className="button button--secondary button--small" href={routes.admin}>Voltar ao dashboard</Link></section>}</AdminShell>
}
