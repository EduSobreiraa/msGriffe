import { Link, type RouteComponentProps } from 'wouter'
import { useState } from 'react'
import { routes } from '../../../app/routes'
import { Button } from '../../../shared/components/Button'
import { Skeleton } from '../../../shared/components/Skeleton'
import { formatCurrency } from '../../../shared/lib/formatters'
import { ProductGallery } from '../components/ProductGallery'
import { useProductDetails } from '../presentation/useProductDetails'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'
import { ProductStructuredData } from '../components/ProductStructuredData'
import { ProductPurchasePanel } from '../components/ProductPurchasePanel'

type ProductPageProps = RouteComponentProps<{ productSlug: string }>

export function ProductPage({ params }: ProductPageProps) {
  const [requestVersion, setRequestVersion] = useState(0)
  const state = useProductDetails(params.productSlug, requestVersion)
  const metadataProduct = state.status === 'success' ? state.product : null
  useDocumentMetadata({
    title: metadataProduct
      ? `${metadataProduct.name} | MS Griffe`
      : state.status === 'not-found'
        ? 'Produto não encontrado | MS Griffe'
        : 'Produto | MS Griffe',
    description: metadataProduct?.description ?? 'Detalhes do produto na MS Griffe.',
    noIndex: state.status === 'not-found' || state.status === 'error',
  })

  if (state.status === 'success') {
    const { product } = state

    return (
      <main className="product-page" id="conteudo-principal" tabIndex={-1}>
        <ProductStructuredData product={product} />
        <div className="container product-page__container">
          <nav className="product-breadcrumb" aria-label="Navegação estrutural">
            <Link href={routes.catalog}>Produtos</Link>
            <span aria-hidden="true">/</span>
            <Link href={routes.category(product.category.slug)}>{product.category.name}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>

          <div className="product-detail">
            <ProductGallery images={product.images} productName={product.name} />

            <section className="product-info" aria-labelledby="product-name">
              <p className="product-info__category">{product.category.name}</p>
              <h1 id="product-name">{product.name}</h1>
              <p className="product-info__price">{formatCurrency(product.price)}</p>
              <p className="product-info__installment">
                ou {product.installmentCount}x de {formatCurrency(product.installmentValue)}
              </p>
              <p className="product-info__description">{product.description}</p>

              <ProductPurchasePanel product={product} />
            </section>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="product-page" id="conteudo-principal" tabIndex={-1}>
      <div className="container product-page__container">
        {state.status === 'loading' && (
          <div className="product-detail" aria-label="Carregando produto" role="status">
            <Skeleton className="product-detail-skeleton" />
            <Skeleton className="product-detail-skeleton" />
          </div>
        )}

        {state.status === 'not-found' && (
          <div className="catalog-state">
            <h1>Produto não encontrado</h1>
            <p>Esta peça pode ter mudado de endereço ou não está mais disponível.</p>
            <Link className="button button--secondary button--small" href={routes.catalog}>
              Voltar ao catálogo
            </Link>
          </div>
        )}

        {state.status === 'error' && (
          <div className="catalog-state" role="alert">
            <h1>Não foi possível carregar o produto</h1>
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
