import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'wouter'
import { routes } from '../../../app/routes'
import { Button } from '../../../shared/components/Button'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'
import { type AccountProfile, validateAccountProfile } from '../domain/Account'
import { useAccount } from '../presentation/useAccount'

interface AuthPageProps {
  mode: 'login' | 'signup'
}

const emptyProfile: AccountProfile = { email: '', fullName: '', phone: '' }

export function AuthPage({ mode }: AuthPageProps) {
  const [, setLocation] = useLocation()
  const { startSession } = useAccount()
  const [profile, setProfile] = useState(emptyProfile)
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof AccountProfile | 'password', string>>>({})
  const signup = mode === 'signup'
  useDocumentMetadata({
    title: `${signup ? 'Criar conta' : 'Entrar'} | MS Griffe`,
    description: 'Acesso demonstrativo à conta MS Griffe.',
    noIndex: true,
  })

  const update = <Key extends keyof AccountProfile>(key: Key, value: AccountProfile[Key]) => {
    setProfile((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof AccountProfile | 'password', string>> = signup
      ? validateAccountProfile(profile)
      : {}
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) nextErrors.email = 'Informe um e-mail válido.'
    if (password.length < 8) nextErrors.password = 'Use pelo menos 8 caracteres.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    startSession({
      email: profile.email,
      fullName: signup ? profile.fullName : 'Cliente MS Griffe',
      phone: signup ? profile.phone : '',
    })
    setLocation(signup ? routes.emailVerification : routes.account)
  }

  return (
    <main className="account-page" id="conteudo-principal" tabIndex={-1}>
      <section className="container account-auth" aria-labelledby="account-auth-title">
        <p>{signup ? 'Nova conta' : 'Área da conta'}</p>
        <h1 id="account-auth-title">{signup ? 'Criar conta' : 'Entrar'}</h1>
        <span>Fluxo visual. Backend fará autenticação, proteção e persistência reais.</span>
        <form className="account-form" noValidate onSubmit={submit}>
          {signup && (
            <label>
              <span>Nome completo</span>
              <input autoComplete="name" onChange={(event) => update('fullName', event.target.value)} value={profile.fullName} />
              {errors.fullName && <small role="alert">{errors.fullName}</small>}
            </label>
          )}
          <label>
            <span>E-mail</span>
            <input autoComplete="email" onChange={(event) => update('email', event.target.value)} type="email" value={profile.email} />
            {errors.email && <small role="alert">{errors.email}</small>}
          </label>
          {signup && (
            <label>
              <span>Telefone</span>
              <input autoComplete="tel" onChange={(event) => update('phone', event.target.value)} type="tel" value={profile.phone} />
              {errors.phone && <small role="alert">{errors.phone}</small>}
            </label>
          )}
          <label>
            <span>Senha</span>
            <input autoComplete={signup ? 'new-password' : 'current-password'} onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
            {errors.password && <small role="alert">{errors.password}</small>}
          </label>
          <p>Senha não é armazenada neste frontend demonstrativo.</p>
          <Button fullWidth type="submit">{signup ? 'Criar conta demonstrativa' : 'Entrar demonstrativamente'}</Button>
        </form>
        <nav aria-label="Ações de conta" className="account-auth__links">
          <Link href={signup ? routes.login : routes.signup}>{signup ? 'Já tenho conta' : 'Criar conta'}</Link>
          {!signup && <Link href={routes.passwordRecovery}>Esqueci minha senha</Link>}
        </nav>
      </section>
    </main>
  )
}
