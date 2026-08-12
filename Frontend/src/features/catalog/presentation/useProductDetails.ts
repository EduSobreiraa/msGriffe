import { useEffect, useState } from 'react'
import type { ProductDetails } from '../domain/Product'
import { useCatalogReader } from './useCatalogReader'

export type ProductDetailsState =
  | { status: 'loading'; product: null }
  | { status: 'success'; product: ProductDetails }
  | { status: 'not-found'; product: null }
  | { status: 'error'; product: null }

interface StoredProductDetailsState {
  slug: string
  value: ProductDetailsState
}

const loadingState: ProductDetailsState = { status: 'loading', product: null }

export function useProductDetails(
  slug: string,
  requestVersion = 0,
): ProductDetailsState {
  const reader = useCatalogReader()
  const [state, setState] = useState<StoredProductDetailsState>({
    slug: '',
    value: loadingState,
  })

  useEffect(() => {
    let active = true

    reader
      .findBySlug(slug)
      .then((product) => {
        if (!active) return
        setState({
          slug,
          value: product
            ? { status: 'success', product }
            : { status: 'not-found', product: null },
        })
      })
      .catch(() => {
        if (active) {
          setState({ slug, value: { status: 'error', product: null } })
        }
      })

    return () => {
      active = false
    }
  }, [reader, requestVersion, slug])

  return state.slug === slug ? state.value : loadingState
}
