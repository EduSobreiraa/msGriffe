import { createContext } from 'react'
import type { CategoryReader } from '../application/CategoryReader'

export const CategoryContext = createContext<CategoryReader | null>(null)
