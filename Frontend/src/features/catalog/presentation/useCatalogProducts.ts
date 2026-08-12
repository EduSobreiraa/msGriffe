import { useEffect, useState } from 'react'
import type {
  CatalogQuery,
  CatalogResult,
} from '../application/CatalogReader'
import { useCatalogReader } from './useCatalogReader'

type CatalogProductsState =
  | { status: 'loading'; result: null }
  | { status: 'success'; result: CatalogResult }
  | { status: 'error'; result: null }

interface StoredCatalogProductsState {
  queryKey: string
  value: CatalogProductsState
}

const loadingState: CatalogProductsState = { status: 'loading', result: null }

export function useCatalogProducts(
  query: CatalogQuery,
  requestVersion = 0,
): CatalogProductsState {
  const reader = useCatalogReader()
  const [state, setState] = useState<StoredCatalogProductsState>({
    queryKey: '',
    value: loadingState,
  })
  const {
    categorySlug,
    featured,
    maximumPrice,
    minimumPrice,
    page,
    pageSize,
    search,
    sort,
  } = query
  const queryKey = JSON.stringify([
    categorySlug,
    featured,
    maximumPrice,
    minimumPrice,
    page,
    pageSize,
    search,
    sort,
    requestVersion,
  ])

  useEffect(() => {
    let active = true

    reader
      .list({
        categorySlug,
        featured,
        maximumPrice,
        minimumPrice,
        page,
        pageSize,
        search,
        sort,
      })
      .then((result) => {
        if (active) {
          setState({
            queryKey,
            value: { status: 'success', result },
          })
        }
      })
      .catch(() => {
        if (active) {
          setState({
            queryKey,
            value: { status: 'error', result: null },
          })
        }
      })

    return () => {
      active = false
    }
  }, [
    categorySlug,
    featured,
    maximumPrice,
    minimumPrice,
    page,
    pageSize,
    queryKey,
    reader,
    requestVersion,
    search,
    sort,
  ])

  return state.queryKey === queryKey ? state.value : loadingState
}
