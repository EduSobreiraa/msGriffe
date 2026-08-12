import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'wouter'
import {
  parseCatalogUrlState,
  serializeCatalogUrlState,
  type CatalogUrlState,
} from './catalogUrlState'

export function useCatalogUrlState() {
  const [params, setParams] = useSearchParams()
  const state = parseCatalogUrlState(params)
  const currentSearch = params.toString()
  const canonicalSearch = serializeCatalogUrlState(state).toString()

  useEffect(() => {
    if (currentSearch !== canonicalSearch) {
      setParams(new URLSearchParams(canonicalSearch), { replace: true })
    }
  }, [canonicalSearch, currentSearch, setParams])

  const updateState = useCallback(
    (
      patch: Partial<CatalogUrlState>,
      options: { preservePage?: boolean; replace?: boolean } = {},
    ) => {
      const nextState = {
        ...state,
        ...patch,
        page: options.preservePage ? (patch.page ?? state.page) : 1,
      }

      setParams(serializeCatalogUrlState(nextState), {
        replace: options.replace,
      })
    },
    [setParams, state],
  )

  return { state, updateState }
}
