import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../shared/components/Button'
import { Icon } from '../../../shared/components/Icon'
import { Skeleton } from '../../../shared/components/Skeleton'
import { CatalogPagination } from '../components/CatalogPagination'
import { CatalogFilters } from '../components/CatalogFilters'
import { CatalogSearch } from '../components/CatalogSearch'
import { ProductCard } from '../components/ProductCard'
import { useCatalogProducts } from '../presentation/useCatalogProducts'
import { useCatalogUrlState } from '../presentation/useCatalogUrlState'
import type { CategorySummary } from '../domain/Category'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'

interface CatalogPageProps {
  category?: CategorySummary
}

export function CatalogPage({ category }: CatalogPageProps = {}) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [requestVersion, setRequestVersion] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const filtersRef = useRef<HTMLFormElement>(null)
  const filtersWasOpenRef = useRef(false)
  const { state, updateState } = useCatalogUrlState()
  const pageTitle = category ? `${category.name} | MS Griffe` : 'Produtos | MS Griffe'
  const pageDescription = category
    ? `Conheça a seleção de ${category.name.toLocaleLowerCase('pt-BR')} da MS Griffe.`
    : 'Explore o catálogo de moda masculina da MS Griffe.'
  useDocumentMetadata({ title: pageTitle, description: pageDescription })
  const products = useCatalogProducts(
    {
      categorySlug: category?.slug ?? state.categorySlug,
      maximumPrice: state.maximumPrice,
      minimumPrice: state.minimumPrice,
      page: state.page,
      pageSize: 10,
      search: state.search,
      sort: state.sort,
    },
    requestVersion,
  )
  const activeFilterCount = [
    category ? undefined : state.categorySlug,
    state.minimumPrice,
    state.maximumPrice,
  ].filter((value) => value !== undefined).length

  useEffect(() => {
    if (
      products.status === 'success' &&
      products.result.page !== state.page
    ) {
      updateState(
        { page: products.result.page },
        { preservePage: true, replace: true },
      )
    }
  }, [products, state.page, updateState])

  useEffect(() => {
    const wasOpen = filtersWasOpenRef.current
    filtersWasOpenRef.current = filtersOpen

    if (!filtersOpen) {
      if (wasOpen) filterButtonRef.current?.focus()
      return
    }

    const firstField = filtersRef.current?.querySelector<HTMLElement>('input, select')
    firstField?.focus()
  }, [filtersOpen])

  useEffect(() => {
    if (!filtersOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFiltersOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [filtersOpen])

  const handlePageChange = (nextPage: number) => {
    updateState({ page: nextPage }, { preservePage: true })
    window.requestAnimationFrame(() => headingRef.current?.focus())
  }

  const filterFormKey = [
    category?.slug ?? state.categorySlug,
    state.minimumPrice,
    state.maximumPrice,
  ].join(':')

  return (
    <main className="catalog-page" id="conteudo-principal" tabIndex={-1}>
      <div className="container catalog-page__container">
        <header className="catalog-heading">
          <p>{category ? 'Categoria' : 'Catálogo'}</p>
          <h1 ref={headingRef} tabIndex={-1}>
            {category?.name ?? 'Todos os produtos'}
          </h1>
          <span>
            {category
              ? `Explore nossa seleção de ${category.name.toLocaleLowerCase('pt-BR')}.`
              : 'Confira todas as peças disponíveis em nossa loja.'}
          </span>
        </header>

        <CatalogSearch
          key={state.search ?? ''}
          value={state.search}
          onSearch={(search) => updateState({ search: search || undefined })}
        />

        <div className="catalog-toolbar" aria-label="Ferramentas do catálogo">
          <Button
            ref={filterButtonRef}
            className="catalog-toolbar__filter"
            variant="secondary"
            size="small"
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <Icon name="sliders" />
            {filtersOpen ? 'Fechar filtros' : 'Filtrar'}
            {!filtersOpen && activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Button>

          <p className="catalog-toolbar__count" aria-live="polite">
            {products.status === 'success'
              ? `${products.result.totalItems} produtos`
              : 'Carregando produtos'}
          </p>

          <label className="catalog-sort">
            <span className="sr-only">Ordenar produtos</span>
            <select
              value={state.sort}
              onChange={(event) =>
                updateState({ sort: event.target.value as typeof state.sort })
              }
            >
              <option value="newest">Mais recentes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name-asc">Nome: A–Z</option>
            </select>
          </label>
        </div>

        {filtersOpen && (
          <CatalogFilters
            ref={filtersRef}
            key={filterFormKey}
            state={state}
            showCategory={!category}
            onApply={(filters) => {
              updateState(filters)
              setFiltersOpen(false)
            }}
            onClear={() => {
              updateState({
                categorySlug: category ? state.categorySlug : undefined,
                minimumPrice: undefined,
                maximumPrice: undefined,
              })
              setFiltersOpen(false)
            }}
          />
        )}

        {products.status === 'loading' && (
          <div
            className="catalog-product-grid"
            aria-label="Carregando catálogo"
            role="status"
          >
            {Array.from({ length: 10 }, (_, index) => (
              <Skeleton className="catalog-card-skeleton" key={index} />
            ))}
          </div>
        )}

        {products.status === 'error' && (
          <div className="catalog-state" role="alert">
            <h2>Não foi possível carregar o catálogo</h2>
            <p>Tente novamente em alguns instantes.</p>
            <Button variant="secondary" size="small" onClick={() => setRequestVersion((value) => value + 1)}>
              Tentar novamente
            </Button>
          </div>
        )}

        {products.status === 'success' && products.result.totalItems === 0 && (
          <div className="catalog-state">
            <h2>Nenhum produto encontrado</h2>
            <p>
              {state.search
                ? `Não encontramos resultados para “${state.search}”.`
                : 'Novas peças serão adicionadas em breve.'}
            </p>
            {state.search && (
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => updateState({ search: undefined })}
              >
                Limpar busca
              </Button>
            )}
          </div>
        )}

        {products.status === 'success' && products.result.totalItems > 0 && (
          <>
            <div className="catalog-product-grid">
              {products.result.items.map((product, index) => (
                <ProductCard
                  headingLevel={2}
                  imageLoading={index === 0 ? 'eager' : 'lazy'}
                  imagePriority={index === 0 ? 'high' : 'auto'}
                  product={product}
                  key={product.id}
                />
              ))}
            </div>
            <CatalogPagination
              currentPage={products.result.page}
              totalPages={products.result.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  )
}
