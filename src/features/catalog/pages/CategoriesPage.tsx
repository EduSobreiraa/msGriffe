import { Link } from 'wouter'
import { useState } from 'react'
import { routes } from '../../../app/routes'
import { Skeleton } from '../../../shared/components/Skeleton'
import { ImageWithFallback } from '../../../shared/components/ImageWithFallback'
import { Button } from '../../../shared/components/Button'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'
import { useCategories } from '../presentation/useCategories'

export function CategoriesPage() {
  const [requestVersion, setRequestVersion] = useState(0)
  const state = useCategories(requestVersion)
  useDocumentMetadata({
    title: 'Categorias | MS Griffe',
    description: 'Navegue pelas categorias de moda masculina da MS Griffe.',
  })

  return (
    <main className="catalog-page" id="conteudo-principal" tabIndex={-1}>
      <div className="container catalog-page__container">
        <header className="catalog-heading">
          <p>Descubra</p>
          <h1>Categorias</h1>
          <span>Encontre sua próxima peça pelo estilo que procura.</span>
        </header>

        {state.status === 'loading' && (
          <div className="category-grid" aria-label="Carregando categorias" role="status">
            {Array.from({ length: 2 }, (_, index) => (
              <Skeleton className="category-card-skeleton" key={index} />
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <div className="catalog-state" role="alert">
            <h2>Não foi possível carregar as categorias</h2>
            <p>Tente novamente em alguns instantes.</p>
            <Button variant="secondary" size="small" onClick={() => setRequestVersion((value) => value + 1)}>
              Tentar novamente
            </Button>
          </div>
        )}

        {state.status === 'success' && state.categories.length === 0 && (
          <div className="catalog-state">
            <h2>Nenhuma categoria disponível</h2>
            <p>Novas coleções serão adicionadas em breve.</p>
          </div>
        )}

        {state.status === 'success' && state.categories.length > 0 && (
          <div className="category-grid">
            {state.categories.map((category) => (
              <Link
                aria-label={`Ver ${category.name}: ${category.productCount} produtos`}
                className="category-card"
                href={routes.category(category.slug)}
                key={category.id}
              >
                <ImageWithFallback src={category.image} alt="" />
                <span className="category-card__overlay">
                  <strong>{category.name}</strong>
                  <small>{category.productCount} produtos</small>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
