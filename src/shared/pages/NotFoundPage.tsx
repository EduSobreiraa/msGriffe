import { Link } from 'wouter'
import { routes } from '../../app/routes'
import { useDocumentMetadata } from '../hooks/useDocumentMetadata'

export function NotFoundPage() {
  useDocumentMetadata({
    title: 'Página não encontrada | MS Griffe',
    description: 'O endereço informado não foi encontrado.',
    noIndex: true,
  })
  return (
    <main className="page-placeholder" id="conteudo-principal" tabIndex={-1}>
      <div className="container">
        <p className="page-placeholder__eyebrow">Erro 404</p>
        <h1>Página não encontrada</h1>
        <p>O endereço informado não existe ou foi movido.</p>
        <Link className="button button--primary button--medium" href={routes.home}>
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
