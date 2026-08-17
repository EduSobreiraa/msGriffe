import { useState, type FormEvent } from 'react'
import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { Button } from '../../../shared/components/Button'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'

export function PasswordRecoveryPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  useDocumentMetadata({ title: 'Recuperar senha | MS Griffe', description: 'Recuperação demonstrativa de senha.', noIndex: true })
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (/^\S+@\S+\.\S+$/.test(email)) setSubmitted(true)
  }
  return (
    <main className="account-page" id="conteudo-principal" tabIndex={-1}>
      <section className="container account-auth" aria-labelledby="recovery-title">
        <p>Segurança da conta</p>
        <h1 id="recovery-title">Recuperar senha</h1>
        <span>Mensagem neutra evita revelar se um e-mail possui conta.</span>
        <form className="account-form" noValidate onSubmit={submit}>
          <label><span>E-mail</span><input autoComplete="email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} /></label>
          <Button fullWidth type="submit">Solicitar recuperação</Button>
        </form>
        {submitted && <p className="account-feedback" role="status">Se existir uma conta elegível, o backend enviará instruções ao e-mail informado.</p>}
        <Link className="account-auth__back" href={routes.login}>Voltar para entrar</Link>
      </section>
    </main>
  )
}
