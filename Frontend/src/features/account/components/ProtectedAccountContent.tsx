import { Link } from 'wouter'
import type { PropsWithChildren } from 'react'
import { routes } from '../../../app/routes'
import { useAccount } from '../presentation/useAccount'

export function ProtectedAccountContent({ children }: PropsWithChildren) {
  const { sessionState } = useAccount()
  if (sessionState === 'ACTIVE') return children

  const expired = sessionState === 'EXPIRED'
  const denied = sessionState === 'DENIED'
  const title = denied ? 'Acesso não autorizado' : expired ? 'Sessão expirada' : 'Entre para continuar'
  const message = denied
    ? 'Esta área exige uma permissão que será validada pelo backend.'
    : expired
      ? 'Esta sessão demonstrativa expirou. Entre novamente para continuar.'
      : 'Esta é uma proteção visual. O backend validará sessão e permissões reais.'

  return (
    <main className="account-page" id="conteudo-principal" tabIndex={-1}>
      <section className="container account-gate" aria-labelledby="account-gate-title">
        <p>Área da conta</p>
        <h1 id="account-gate-title">{title}</h1>
        <span>{message}</span>
        <Link className="button button--primary button--medium" href={routes.login}>Entrar</Link>
      </section>
    </main>
  )
}
