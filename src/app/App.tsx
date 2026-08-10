import { AppRoutes } from './AppRoutes'
import { catalogReader, categoryReader } from './dependencies'
import { CatalogProvider } from '../features/catalog/presentation/CatalogProvider'
import { CategoryProvider } from '../features/catalog/presentation/CategoryProvider'
import { Header } from '../features/storefront/components/Header'
import { WhatsAppLink } from '../features/storefront/components/WhatsAppLink'
import { ThemeProvider } from './theme/ThemeProvider'
import { RouteAccessibility } from './RouteAccessibility'

export function App() {
  return (
    <ThemeProvider>
      <CatalogProvider reader={catalogReader}>
        <CategoryProvider reader={categoryReader}>
          <Header />
          <RouteAccessibility />
          <AppRoutes />
          <WhatsAppLink />
        </CategoryProvider>
      </CatalogProvider>
    </ThemeProvider>
  )
}
