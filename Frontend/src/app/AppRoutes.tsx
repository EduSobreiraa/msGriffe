import { Route, Switch } from 'wouter'
import { CatalogPage } from '../features/catalog/pages/CatalogPage'
import { CategoriesPage } from '../features/catalog/pages/CategoriesPage'
import { CategoryPage } from '../features/catalog/pages/CategoryPage'
import { ProductPage } from '../features/catalog/pages/ProductPage'
import { CartPage } from '../features/cart/pages/CartPage'
import { HomePage } from '../features/storefront/pages/HomePage'
import { NotFoundPage } from '../shared/pages/NotFoundPage'
import { routes } from './routes'

export function AppRoutes() {
  return (
    <Switch>
      <Route path={routes.home} component={HomePage} />
      <Route path={routes.catalog}>
        <CatalogPage />
      </Route>
      <Route path={routes.categories} component={CategoriesPage} />
      <Route path={routes.cart} component={CartPage} />
      <Route path="/produtos/:productSlug" component={ProductPage} />
      <Route path="/categorias/:categorySlug" component={CategoryPage} />
      <Route component={NotFoundPage} />
    </Switch>
  )
}
