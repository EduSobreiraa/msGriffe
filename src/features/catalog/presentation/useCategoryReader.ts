import { useContext } from 'react'
import { CategoryContext } from './CategoryContext'

export function useCategoryReader() {
  const reader = useContext(CategoryContext)

  if (!reader) {
    throw new Error('useCategoryReader deve ser usado dentro de CategoryProvider')
  }

  return reader
}
