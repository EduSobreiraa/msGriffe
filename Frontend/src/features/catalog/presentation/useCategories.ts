import { useEffect, useState } from 'react'
import type { CategorySummary } from '../domain/Category'
import { useCategoryReader } from './useCategoryReader'

export type CategoriesState =
  | { status: 'loading'; categories: null }
  | { status: 'success'; categories: CategorySummary[] }
  | { status: 'error'; categories: null }

export function useCategories(requestVersion = 0): CategoriesState {
  const reader = useCategoryReader()
  const [state, setState] = useState<CategoriesState>({
    status: 'loading',
    categories: null,
  })

  useEffect(() => {
    let active = true

    reader
      .list()
      .then((categories) => {
        if (active) setState({ status: 'success', categories })
      })
      .catch(() => {
        if (active) setState({ status: 'error', categories: null })
      })

    return () => {
      active = false
    }
  }, [reader, requestVersion])

  return state
}
