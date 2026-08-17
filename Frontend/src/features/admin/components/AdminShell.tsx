import type { PropsWithChildren } from 'react'
import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { useAdmin } from '../presentation/useAdmin'

export function AdminShell({ children }: PropsWithChildren) {
  const { role, setRole } = useAdmin()
  return <main className="admin-page" id="conteudo-principal" tabIndex={-1}><div className="admin-shell"><aside className="admin-sidebar"><Link className="admin-brand" href={routes.admin}>MS Griffe <span>Operação</span></Link><nav aria-label="Navegação administrativa"><Link href={routes.admin}>Visão geral</Link><Link href={routes.adminOrders}>Pedidos</Link><Link href={routes.adminCatalog}>Catálogo</Link><Link href={routes.adminCustomers}>Clientes</Link><Link href={routes.adminPromotions}>Promoções</Link><Link href={routes.adminSettings}>Configurações</Link></nav><fieldset className="admin-role"><legend>Papel visual</legend><label><input checked={role === 'SELLER'} name="admin-role" onChange={() => setRole('SELLER')} type="radio" /> SELLER</label><label><input checked={role === 'SUPERADMIN'} name="admin-role" onChange={() => setRole('SUPERADMIN')} type="radio" /> SUPERADMIN</label><small>Backend validará papel real.</small></fieldset></aside><section className="admin-content"><p className="admin-disclaimer">Painel demonstrativo. Operações reais exigem backend, autorização e auditoria.</p>{children}</section></div></main>
}
