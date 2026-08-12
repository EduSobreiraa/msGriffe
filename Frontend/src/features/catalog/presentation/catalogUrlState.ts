import type { CatalogSort } from '../application/CatalogReader'

export interface CatalogUrlState {
  categorySlug?: string
  maximumPrice?: number
  minimumPrice?: number
  page: number
  search?: string
  sort: CatalogSort
}

export const defaultCatalogUrlState: CatalogUrlState = {
  page: 1,
  sort: 'newest',
}

const supportedSorts = new Set<CatalogSort>([
  'newest',
  'price-asc',
  'price-desc',
  'name-asc',
])

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function parseNonNegativeNumber(value: string | null) {
  if (value === null || value.trim() === '') return undefined
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

export function parseCatalogUrlState(params: URLSearchParams): CatalogUrlState {
  const categorySlug = params.get('categoria')?.trim() || undefined
  const search = params.get('busca')?.trim() || undefined
  const minimumPrice = parseNonNegativeNumber(params.get('precoMinimo'))
  const parsedMaximumPrice = parseNonNegativeNumber(params.get('precoMaximo'))
  const maximumPrice =
    parsedMaximumPrice !== undefined &&
    (minimumPrice === undefined || parsedMaximumPrice >= minimumPrice)
      ? parsedMaximumPrice
      : undefined
  const requestedSort = params.get('ordenacao') as CatalogSort | null

  return {
    categorySlug,
    minimumPrice,
    maximumPrice,
    page: parsePositiveInteger(params.get('pagina'), 1),
    search,
    sort:
      requestedSort && supportedSorts.has(requestedSort)
        ? requestedSort
        : defaultCatalogUrlState.sort,
  }
}

export function serializeCatalogUrlState(state: CatalogUrlState) {
  const params = new URLSearchParams()

  if (state.categorySlug) params.set('categoria', state.categorySlug)
  if (state.search) params.set('busca', state.search)
  if (state.minimumPrice !== undefined) {
    params.set('precoMinimo', String(state.minimumPrice))
  }
  if (state.maximumPrice !== undefined) {
    params.set('precoMaximo', String(state.maximumPrice))
  }
  if (state.sort !== defaultCatalogUrlState.sort) {
    params.set('ordenacao', state.sort)
  }
  if (state.page > 1) params.set('pagina', String(state.page))

  return params
}
