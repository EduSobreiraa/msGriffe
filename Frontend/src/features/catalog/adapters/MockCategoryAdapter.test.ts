import { describe, expect, it } from 'vitest'
import { MockCategoryAdapter } from './MockCategoryAdapter'

describe('MockCategoryAdapter', () => {
  const adapter = new MockCategoryAdapter()

  it('deriva categorias e contagens do catálogo', async () => {
    await expect(adapter.list()).resolves.toEqual([
      expect.objectContaining({ slug: 'camisetas', productCount: 6 }),
      expect.objectContaining({ slug: 'shorts', productCount: 6 }),
    ])
  })

  it('encontra por slug e retorna nulo quando não existe', async () => {
    await expect(adapter.findBySlug('shorts')).resolves.toEqual(
      expect.objectContaining({ name: 'Shorts' }),
    )
    await expect(adapter.findBySlug('inexistente')).resolves.toBeNull()
  })
})
