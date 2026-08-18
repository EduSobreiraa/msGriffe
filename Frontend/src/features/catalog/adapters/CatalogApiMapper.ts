import { ApiError } from '../../../shared/http'
import type { CatalogResult } from '../application/CatalogReader'
import type { CategorySummary } from '../domain/Category'
import type { ProductDetails, ProductSummary, ProductVariant } from '../domain/Product'

type ApiRecord = Record<string, unknown>

function invalidContract(): never {
  throw new ApiError('UNEXPECTED', null)
}

function record(value: unknown): ApiRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalidContract()
  return value as ApiRecord
}

function text(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) invalidContract()
  return value
}

function integer(value: unknown, minimum = 0): number {
  if (!Number.isInteger(value) || Number(value) < minimum) invalidContract()
  return Number(value)
}

function imagePath(value: unknown): string {
  const path = text(value)
  if (!path.startsWith('/') || path.startsWith('//')) invalidContract()
  return path
}

function productCategory(value: unknown) {
  const category = record(value)
  return { id: text(category.id), name: text(category.name), slug: text(category.slug) }
}

function productVariants(value: unknown): ProductVariant[] {
  if (!Array.isArray(value)) invalidContract()
  return value.map((item) => {
    const variant = record(item)
    if (typeof variant.available !== 'boolean') invalidContract()
    return { id: text(variant.id), color: text(variant.color), size: text(variant.size), available: variant.available }
  })
}

export function mapProductSummary(value: unknown): ProductSummary {
  const product = record(value)
  const installment = record(product.installment)
  if (typeof product.featured !== 'boolean') invalidContract()

  return {
    id: text(product.id),
    slug: text(product.slug),
    name: text(product.name),
    price: integer(product.priceInCents) / 100,
    installmentCount: integer(installment.count, 1),
    installmentValue: integer(installment.valueInCents) / 100,
    image: imagePath(product.image),
    category: productCategory(product.category),
    featured: product.featured,
  }
}

export function mapProductDetails(value: unknown): ProductDetails {
  const product = record(value)
  const summary = mapProductSummary(product)
  if (!Array.isArray(product.images)) invalidContract()

  return {
    ...summary,
    description: text(product.description),
    images: product.images.map(imagePath),
    variants: productVariants(product.variants),
  }
}

export function mapCatalogResult(value: unknown): CatalogResult {
  const result = record(value)
  if (!Array.isArray(result.items)) invalidContract()

  return {
    items: result.items.map(mapProductSummary),
    page: integer(result.page, 1),
    pageSize: integer(result.pageSize, 1),
    totalItems: integer(result.totalItems),
    totalPages: integer(result.totalPages, 1),
  }
}

export function mapCategory(value: unknown): CategorySummary {
  const category = record(value)
  return {
    id: text(category.id),
    name: text(category.name),
    slug: text(category.slug),
    image: imagePath(category.image),
    productCount: integer(category.productCount),
  }
}

export function mapCategoryList(value: unknown): CategorySummary[] {
  const result = record(value)
  if (!Array.isArray(result.items)) invalidContract()
  return result.items.map(mapCategory)
}
