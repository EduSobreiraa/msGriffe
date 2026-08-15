export const routes = {
  home: '/',
  catalog: '/produtos',
  categories: '/categorias',
  cart: '/sacola',
  checkout: '/checkout',
  product: (slug: string) => `/produtos/${slug}`,
  category: (slug: string) => `/categorias/${slug}`,
} as const
