import { useState, type FormEvent } from 'react'
import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { Button } from '../../../shared/components/Button'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'
import { type AccountAddress, validateAccountProfile } from '../domain/Account'
import { ProtectedAccountContent } from '../components/ProtectedAccountContent'
import { useAccount } from '../presentation/useAccount'

const emptyAddress: Omit<AccountAddress, 'id'> = {
  city: '', label: '', neighborhood: '', number: '', state: '', street: '', zipCode: '',
}

function AccountContent() {
  const { addresses, profile, endSession, removeAddress, updateProfile, addAddress } = useAccount()
  const [draft, setDraft] = useState(profile)
  const [address, setAddress] = useState(emptyAddress)
  const [profileMessage, setProfileMessage] = useState('')
  const [addressMessage, setAddressMessage] = useState('')

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (Object.keys(validateAccountProfile(draft)).length) return
    updateProfile(draft)
    setProfileMessage('Alterações registradas somente nesta demonstração.')
  }
  const saveAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!address.label || !address.street || !address.number || !address.city || !address.state || address.zipCode.replace(/\D/g, '').length !== 8) return
    addAddress(address)
    setAddress(emptyAddress)
    setAddressMessage('Endereço registrado somente nesta demonstração.')
  }

  return (
    <main className="account-page" id="conteudo-principal" tabIndex={-1}>
      <div className="container account-layout">
        <header className="account-heading"><p>Área da conta</p><h1>Olá, {profile.fullName}</h1><span>Dados ficam apenas nesta sessão visual.</span></header>
        <nav className="account-navigation" aria-label="Navegação da conta"><Link href={routes.account}>Perfil</Link><Link href={routes.orders}>Pedidos</Link></nav>
        <section className="account-card" aria-labelledby="profile-title">
          <h2 id="profile-title">Seus dados</h2>
          <form className="account-form account-form--grid" noValidate onSubmit={saveProfile}>
            <label><span>Nome completo</span><input autoComplete="name" onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} value={draft.fullName} /></label>
            <label><span>E-mail</span><input autoComplete="email" onChange={(event) => setDraft({ ...draft, email: event.target.value })} type="email" value={draft.email} /></label>
            <label><span>Telefone</span><input autoComplete="tel" onChange={(event) => setDraft({ ...draft, phone: event.target.value })} type="tel" value={draft.phone} /></label>
            <Button type="submit">Salvar dados</Button>
          </form>
          {profileMessage && <p className="account-feedback" role="status">{profileMessage}</p>}
        </section>
        <section className="account-card" aria-labelledby="address-title">
          <h2 id="address-title">Endereços</h2>
          {addresses.length === 0 ? <p className="account-card__empty">Nenhum endereço salvo nesta demonstração.</p> : <ul className="account-addresses">{addresses.map((item) => <li key={item.id}><div><strong>{item.label}</strong><span>{item.street}, {item.number} · {item.neighborhood}<br />{item.city} · {item.state} · {item.zipCode}</span></div><button className="button button--ghost button--small" onClick={() => removeAddress(item.id)} type="button">Remover</button></li>)}</ul>}
          <form className="account-form account-form--grid" noValidate onSubmit={saveAddress}>
            <label><span>Identificação</span><input onChange={(event) => setAddress({ ...address, label: event.target.value })} placeholder="Casa, trabalho..." value={address.label} /></label>
            <label><span>CEP</span><input autoComplete="postal-code" inputMode="numeric" onChange={(event) => setAddress({ ...address, zipCode: event.target.value })} value={address.zipCode} /></label>
            <label><span>Endereço</span><input autoComplete="street-address" onChange={(event) => setAddress({ ...address, street: event.target.value })} value={address.street} /></label>
            <label><span>Número</span><input onChange={(event) => setAddress({ ...address, number: event.target.value })} value={address.number} /></label>
            <label><span>Bairro</span><input onChange={(event) => setAddress({ ...address, neighborhood: event.target.value })} value={address.neighborhood} /></label>
            <label><span>Cidade</span><input onChange={(event) => setAddress({ ...address, city: event.target.value })} value={address.city} /></label>
            <label><span>Estado (UF)</span><input maxLength={2} onChange={(event) => setAddress({ ...address, state: event.target.value.toUpperCase() })} value={address.state} /></label>
            <Button type="submit">Adicionar endereço</Button>
          </form>
          {addressMessage && <p className="account-feedback" role="status">{addressMessage}</p>}
        </section>
        <button className="account-signout" onClick={endSession} type="button">Encerrar sessão demonstrativa</button>
      </div>
    </main>
  )
}

export function AccountPage() {
  useDocumentMetadata({ title: 'Minha conta | MS Griffe', description: 'Perfil demonstrativo da conta MS Griffe.', noIndex: true })
  return <ProtectedAccountContent><AccountContent /></ProtectedAccountContent>
}
