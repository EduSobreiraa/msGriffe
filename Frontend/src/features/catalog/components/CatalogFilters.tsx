import { forwardRef, useState, type FormEvent } from 'react'
import { Button } from '../../../shared/components/Button'
import type { CatalogUrlState } from '../presentation/catalogUrlState'

interface CatalogFiltersProps {
  onApply: (filters: Pick<CatalogUrlState, 'categorySlug' | 'minimumPrice' | 'maximumPrice'>) => void
  onClear: () => void
  state: CatalogUrlState
  showCategory?: boolean
}

function readOptionalNumber(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? '').trim()
  return value === '' ? undefined : Number(value.replace(',', '.'))
}

export const CatalogFilters = forwardRef<HTMLFormElement, CatalogFiltersProps>(function CatalogFilters({
  onApply,
  onClear,
  showCategory = true,
  state,
}: CatalogFiltersProps, ref) {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const minimumPrice = readOptionalNumber(formData, 'minimumPrice')
    const maximumPrice = readOptionalNumber(formData, 'maximumPrice')

    if (
      minimumPrice !== undefined &&
      maximumPrice !== undefined &&
      maximumPrice < minimumPrice
    ) {
      setError('O preço máximo deve ser maior ou igual ao preço mínimo.')
      return
    }

    setError(null)
    onApply({
      categorySlug: showCategory
        ? String(formData.get('category') ?? '') || undefined
        : state.categorySlug,
      minimumPrice,
      maximumPrice,
    })
  }

  return (
    <form
      ref={ref}
      className="catalog-filters"
      id="catalog-filters"
      aria-label="Filtros do catálogo"
      onSubmit={handleSubmit}
    >
      {showCategory && (
        <div className="catalog-filters__field">
          <label htmlFor="catalog-category">Categoria</label>
          <select id="catalog-category" name="category" defaultValue={state.categorySlug ?? ''}>
            <option value="">Todas as categorias</option>
            <option value="camisetas">Camisetas</option>
            <option value="shorts">Shorts</option>
          </select>
        </div>
      )}

      <div className="catalog-filters__field">
        <label htmlFor="minimum-price">Preço mínimo</label>
        <input
          id="minimum-price"
          name="minimumPrice"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          defaultValue={state.minimumPrice}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="catalog-filters__field">
        <label htmlFor="maximum-price">Preço máximo</label>
        <input
          id="maximum-price"
          name="maximumPrice"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          defaultValue={state.maximumPrice}
          placeholder="Sem limite"
        />
      </div>

      <div className="catalog-filters__actions">
        <Button type="button" variant="ghost" size="small" onClick={onClear}>
          Limpar
        </Button>
        <Button type="submit" size="small">
          Aplicar filtros
        </Button>
      </div>

      {error && (
        <p className="catalog-filters__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
})
