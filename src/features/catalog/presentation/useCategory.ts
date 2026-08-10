import { useEffect, useState } from 'react'
import type { CategorySummary } from '../domain/Category'
import { useCategoryReader } from './useCategoryReader'

export type CategoryState =
  | { status: 'loading'; category: null }
  | { status: 'success'; category: CategorySummary }
  | { status: 'not-found'; category: null }
  | { status: 'error'; category: null }

interface StoredCategoryState {
  slug: string
  value: CategoryState
}

const loadingState: CategoryState = { status: 'loading', category: null }

export function useCategory(slug: string, requestVersion = 0): CategoryState {
  const reader = useCategoryReader()
  const [state, setState] = useState<StoredCategoryState>({
    slug: '',
    value: loadingState,
  })

  useEffect(() => {
    let active = true
    reader
      .findBySlug(slug)
      .then((category) => {
        if (!active) return
        setState({
          slug,
          value: category
            ? { status: 'success', category }
            : { status: 'not-found', category: null },
        })
      })
      .catch(() => {
        if (active) {
          setState({ slug, value: { status: 'error', category: null } })
        }
      })

    return () => {
      active = false
    }
  }, [reader, requestVersion, slug])

  return state.slug === slug ? state.value : loadingState
}
