import { describe, expect, it } from 'vitest'
import {
  parseCatalogUrlState,
  serializeCatalogUrlState,
} from './catalogUrlState'

describe('estado do catálogo na URL', () => {
  it('interpreta parâmetros válidos', () => {
    const state = parseCatalogUrlState(
      new URLSearchParams(
        'busca=boss&categoria=shorts&precoMinimo=80&precoMaximo=100&ordenacao=price-desc&pagina=2',
      ),
    )

    expect(state).toEqual({
      categorySlug: 'shorts',
      search: 'boss',
      minimumPrice: 80,
      maximumPrice: 100,
      sort: 'price-desc',
      page: 2,
    })
  })

  it('normaliza valores inválidos para padrões seguros', () => {
    const state = parseCatalogUrlState(
      new URLSearchParams(
        'precoMinimo=90&precoMaximo=20&ordenacao=desconhecida&pagina=-4',
      ),
    )

    expect(state).toEqual({
      categorySlug: undefined,
      search: undefined,
      minimumPrice: 90,
      maximumPrice: undefined,
      sort: 'newest',
      page: 1,
    })
  })

  it('serializa somente valores diferentes do padrão', () => {
    expect(
      serializeCatalogUrlState({
        categorySlug: 'camisetas',
        search: 'boss',
        minimumPrice: 80,
        maximumPrice: 100,
        sort: 'name-asc',
        page: 3,
      }).toString(),
    ).toBe(
      'categoria=camisetas&busca=boss&precoMinimo=80&precoMaximo=100&ordenacao=name-asc&pagina=3',
    )

    expect(
      serializeCatalogUrlState({ page: 1, sort: 'newest' }).toString(),
    ).toBe('')
  })
})
