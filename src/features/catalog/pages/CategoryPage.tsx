import type { RouteComponentProps } from 'wouter'
import { useState } from 'react'
import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Button } from '../../../shared/components/Button'
import { useCategory } from '../presentation/useCategory'
import { CatalogPage } from './CatalogPage'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'

type CategoryPageProps = RouteComponentProps<{ categorySlug: string }>

export function CategoryPage({ params }: CategoryPageProps) {
  const [requestVersion, setRequestVersion] = useState(0)
  const state = useCategory(params.categorySlug, requestVersion)
  useDocumentMetadata({
    title:
      state.status === 'success'
        ? `${state.category.name} | MS Griffe`
        : state.status === 'not-found'
        ? 'Categoria não encontrada | MS Griffe'
        : 'Categoria | MS Griffe',
    description:
      state.status === 'success'
        ? `Conheça a seleção de ${state.category.name.toLocaleLowerCase('pt-BR')} da MS Griffe.`
        : 'Categoria de produtos da MS Griffe.',
    noIndex: state.status === 'not-found' || state.status === 'error',
  })

  if (state.status === 'success') {
    return <CatalogPage category={state.category} />
  }

  return (
    <main className="catalog-page" id="conteudo-principal" tabIndex={-1}>
      <div className="container catalog-page__container">
        {state.status === 'loading' && (
          <div aria-label="Carregando categoria" role="status">
            <Skeleton className="category-heading-skeleton" />
          </div>
        )}

        {state.status === 'not-found' && (
          <div className="catalog-state">
            <h1>Categoria não encontrada</h1>
            <p>Este endereço pode ter mudado ou não está mais disponível.</p>
            <Link className="button button--secondary button--small" href={routes.categories}>
              Ver categorias
            </Link>
          </div>
        )}

        {state.status === 'error' && (
          <div className="catalog-state" role="alert">
            <h1>Não foi possível carregar a categoria</h1>
            <p>Tente novamente em alguns instantes.</p>
            <Button variant="secondary" size="small" onClick={() => setRequestVersion((value) => value + 1)}>
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
