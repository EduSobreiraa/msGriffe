import { createContext } from 'react'
import type { CatalogReader } from '../application/CatalogReader'

export const CatalogContext = createContext<CatalogReader | null>(null)
