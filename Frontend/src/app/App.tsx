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
import { AdminProvider } from '../features/admin/presentation/AdminProvider'

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
                <AdminProvider>
                  <Header />
                  <RouteAccessibility />
                  <AppRoutes />
                  <WhatsAppLink />
                </AdminProvider>
              </AccountProvider>
            </CheckoutProvider>
          </CartProvider>
        </CategoryProvider>
      </CatalogProvider>
    </ThemeProvider>
  )
}
