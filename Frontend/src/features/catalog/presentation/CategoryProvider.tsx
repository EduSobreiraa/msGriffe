import type { PropsWithChildren } from 'react'
import type { CategoryReader } from '../application/CategoryReader'
import { CategoryContext } from './CategoryContext'

interface CategoryProviderProps extends PropsWithChildren {
  reader: CategoryReader
}

export function CategoryProvider({ children, reader }: CategoryProviderProps) {
  return <CategoryContext.Provider value={reader}>{children}</CategoryContext.Provider>
}
