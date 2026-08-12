export const routes = {
  home: '/',
  catalog: '/produtos',
  categories: '/categorias',
  cart: '/sacola',
  product: (slug: string) => `/produtos/${slug}`,
  category: (slug: string) => `/categorias/${slug}`,
} as const
