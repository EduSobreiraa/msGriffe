import { Link, useLocation } from 'wouter'
import { routes } from '../../../app/routes'

const navigationItems = [
  { label: 'INÍCIO', href: routes.home },
  { label: 'PRODUTOS', href: routes.catalog },
  { label: 'CATEGORIAS', href: routes.categories },
  { label: 'SOBRE NÓS' },
  { label: 'CONTATO' },
]

interface PrimaryNavigationProps {
  isOpen: boolean
  onNavigate: () => void
}

export function PrimaryNavigation({
  isOpen,
  onNavigate,
}: PrimaryNavigationProps) {
  const [location] = useLocation()

  const isCurrent = (href: string) =>
    href === routes.home ? location === href : location.startsWith(href)

  return (
    <nav
      id="primary-navigation"
      className={`navigation ${isOpen ? 'navigation--open' : ''}`}
      aria-label="Navegação principal"
    >
      {navigationItems.map((item) =>
        item.href ? (
          <Link
            className={isCurrent(item.href) ? 'active' : undefined}
            href={item.href}
            aria-current={isCurrent(item.href) ? 'page' : undefined}
            key={item.label}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        ) : (
          <span
            className="navigation__coming-soon"
            title="Disponível em breve"
            key={item.label}
          >
            {item.label}
          </span>
        ),
      )}
    </nav>
  )
}
