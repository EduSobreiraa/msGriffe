import { MockCatalogAdapter } from '../features/catalog/adapters/MockCatalogAdapter'
import { MockCategoryAdapter } from '../features/catalog/adapters/MockCategoryAdapter'
import { HttpCatalogAdapter } from '../features/catalog/adapters/HttpCatalogAdapter'
import { HttpCategoryAdapter } from '../features/catalog/adapters/HttpCategoryAdapter'
import { LocalStorageCartRepository } from '../features/cart/adapters/LocalStorageCartRepository'
import { DemonstrationCartPricingService } from '../features/cart/adapters/DemonstrationCartPricingService'
import { BrowserHttpTransport, BrowserSessionRefresher, HttpApiClient } from '../shared/http'
import { runtimeConfig, type RuntimeConfig } from './runtimeConfig'

export function createCatalogDependencies(config: RuntimeConfig) {
  if (config.dataSource === 'demo') {
    return {
      catalogReader: new MockCatalogAdapter(),
      categoryReader: new MockCategoryAdapter(),
    }
  }

  const transport = new BrowserHttpTransport()
  const client = new HttpApiClient(
    config.apiBaseUrl!,
    transport,
    new BrowserSessionRefresher(config.apiBaseUrl!, transport),
  )

  return {
    catalogReader: new HttpCatalogAdapter(client),
    categoryReader: new HttpCategoryAdapter(client),
  }
}

const catalogDependencies = createCatalogDependencies(runtimeConfig)

export const { catalogReader, categoryReader } = catalogDependencies
export const cartRepository = new LocalStorageCartRepository()
export const cartPricingService = new DemonstrationCartPricingService({
  discountMinimumSubtotal: 200,
  discountPercentage: 0.05,
  freeShippingMinimumSubtotal: 300,
  standardShipping: 19.9,
})
