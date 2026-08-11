import { AppRoutes } from './AppRoutes'
import {
  cartPricingService,
  cartRepository,
  catalogReader,
  categoryReader,
} from './dependencies'
import { CatalogProvider } from '../features/catalog/presentation/CatalogProvider'
import { CategoryProvider } from '../features/catalog/presentation/CategoryProvider'
import { Header } from '../features/storefront/components/Header'
import { WhatsAppLink } from '../features/storefront/components/WhatsAppLink'
import { ThemeProvider } from './theme/ThemeProvider'
import { RouteAccessibility } from './RouteAccessibility'
import { CartProvider } from '../features/cart/presentation/CartProvider'

export function App() {
  return (
    <ThemeProvider>
      <CatalogProvider reader={catalogReader}>
        <CategoryProvider reader={categoryReader}>
          <CartProvider
            pricingService={cartPricingService}
            repository={cartRepository}
          >
            <Header />
            <RouteAccessibility />
            <AppRoutes />
            <WhatsAppLink />
          </CartProvider>
        </CategoryProvider>
      </CatalogProvider>
    </ThemeProvider>
  )
}
