import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'

export function EmailVerificationPage() {
  useDocumentMetadata({ title: 'Verificar e-mail | MS Griffe', description: 'Verificação demonstrativa de e-mail.', noIndex: true })
  return (
    <main className="account-page" id="conteudo-principal" tabIndex={-1}>
      <section className="container account-gate" aria-labelledby="verification-title">
        <p>Conta criada</p>
        <h1 id="verification-title">Verifique seu e-mail</h1>
        <span>Esta tela não confirma e-mail real. Backend enviará e validará link assinado com expiração.</span>
        <Link className="button button--primary button--medium" href={routes.account}>Abrir minha conta</Link>
      </section>
    </main>
  )
}
