import type { PropsWithChildren } from 'react'
import type { CatalogReader } from '../application/CatalogReader'
import { CatalogContext } from './CatalogContext'

interface CatalogProviderProps extends PropsWithChildren {
  reader: CatalogReader
}

export function CatalogProvider({ children, reader }: CatalogProviderProps) {
  return <CatalogContext.Provider value={reader}>{children}</CatalogContext.Provider>
}
