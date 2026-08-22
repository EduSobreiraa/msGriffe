import type { ProductCategory } from './Product'

export interface CategorySummary extends ProductCategory {
  image?: string
  productCount: number
}
