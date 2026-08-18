import { describe, expect, it } from 'vitest'
import { HttpCatalogAdapter } from '../features/catalog/adapters/HttpCatalogAdapter'
import { HttpCategoryAdapter } from '../features/catalog/adapters/HttpCategoryAdapter'
import { MockCatalogAdapter } from '../features/catalog/adapters/MockCatalogAdapter'
import { MockCategoryAdapter } from '../features/catalog/adapters/MockCategoryAdapter'
import { createCatalogDependencies } from './dependencies'

describe('composição de dependências', () => {
  it('mantém demonstração como fonte segura padrão', () => {
    const dependencies = createCatalogDependencies({ apiBaseUrl: null, dataSource: 'demo' })
    expect(dependencies.catalogReader).toBeInstanceOf(MockCatalogAdapter)
    expect(dependencies.categoryReader).toBeInstanceOf(MockCategoryAdapter)
  })

  it('troca somente adaptadores quando ambiente habilita API', () => {
    const dependencies = createCatalogDependencies({ apiBaseUrl: 'https://api.msgriffe.com', dataSource: 'api' })
    expect(dependencies.catalogReader).toBeInstanceOf(HttpCatalogAdapter)
    expect(dependencies.categoryReader).toBeInstanceOf(HttpCategoryAdapter)
  })
})
