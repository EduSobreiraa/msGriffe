import { describe, expect, it } from 'vitest'
import { mapCategory } from './CatalogApiMapper'

describe('mapCategory', () => {
  it('aceita categoria sem imagem pública', () => {
    expect(mapCategory({ id: 'calcas', image: null, name: 'Calças', productCount: 1, slug: 'calcas' })).toEqual({
      id: 'calcas',
      name: 'Calças',
      productCount: 1,
      slug: 'calcas',
    })
  })

  it('preserva URL pública de imagem quando presente', () => {
    expect(mapCategory({ id: 'camisetas', image: 'https://media.msgriffe.com.br/categories/camisetas.jpg', name: 'Camisetas', productCount: 3, slug: 'camisetas' })).toMatchObject({
      image: 'https://media.msgriffe.com.br/categories/camisetas.jpg',
    })
  })
})
