import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { Button } from '../../../shared/components/Button'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'
import { useAccount } from '../presentation/useAccount'

interface AccessStatePageProps { state: 'denied' | 'expired' }

export function AccessStatePage({ state }: AccessStatePageProps) {
  const { grantAccess } = useAccount()
  const expired = state === 'expired'
  useDocumentMetadata({ title: `${expired ? 'Sessão expirada' : 'Acesso negado'} | MS Griffe`, description: 'Estado demonstrativo de acesso.', noIndex: true })
  return (
    <main className="account-page" id="conteudo-principal" tabIndex={-1}>
      <section className="container account-gate" aria-labelledby="access-state-title">
        <p>Segurança da conta</p>
        <h1 id="access-state-title">{expired ? 'Sessão expirada' : 'Acesso negado'}</h1>
        <span>{expired ? 'Entre novamente. Backend revogará e validará sessões reais.' : 'Permissão insuficiente. Backend decidirá autorização real.'}</span>
        {expired && <Button onClick={grantAccess}>Retomar demonstração</Button>}
        <Link className="account-auth__back" href={routes.login}>Ir para entrar</Link>
      </section>
    </main>
  )
}
