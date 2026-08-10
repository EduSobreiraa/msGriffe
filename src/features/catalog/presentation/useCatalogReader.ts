import { useContext } from 'react'
import { CatalogContext } from './CatalogContext'

export function useCatalogReader() {
  const reader = useContext(CatalogContext)

  if (!reader) {
    throw new Error('useCatalogReader deve ser usado dentro de CatalogProvider.')
  }

  return reader
}
