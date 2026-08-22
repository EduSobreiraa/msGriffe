export interface ProductCategory {
  id: string
  name: string
  slug: string
}

export interface ProductSummary {
  id: string
  slug: string
  name: string
  price: number
  installmentCount?: number
  installmentValue?: number
  image?: string
  category: ProductCategory
  featured: boolean
}

export interface ProductDetails extends ProductSummary {
  description: string
  images: string[]
  variants: ProductVariant[]
}

export interface ProductVariant {
  id: string
  color: string
  size: string
  available: boolean
}
