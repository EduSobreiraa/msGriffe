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
import { CheckoutProvider } from '../features/checkout/presentation/CheckoutProvider'
import { AccountProvider } from '../features/account/presentation/AccountProvider'

export function App() {
  return (
    <ThemeProvider>
      <CatalogProvider reader={catalogReader}>
        <CategoryProvider reader={categoryReader}>
          <CartProvider
            pricingService={cartPricingService}
            repository={cartRepository}
          >
            <CheckoutProvider>
              <AccountProvider>
                <Header />
                <RouteAccessibility />
                <AppRoutes />
                <WhatsAppLink />
              </AccountProvider>
            </CheckoutProvider>
          </CartProvider>
        </CategoryProvider>
      </CatalogProvider>
    </ThemeProvider>
  )
}
