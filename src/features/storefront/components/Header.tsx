import { Badge } from '../../../shared/components/Badge'
import { IconButton } from '../../../shared/components/IconButton'
import { ThemeToggle } from '../../../shared/components/ThemeToggle'
import { useMobileMenu } from '../hooks/useMobileMenu'
import { PrimaryNavigation } from './PrimaryNavigation'
import { Link } from 'wouter'
import { routes } from '../../../app/routes'
import { useCart } from '../../cart/presentation/useCart'

export function Header() {
  const { close, isOpen, toggle, triggerRef } = useMobileMenu()
  const { totals } = useCart()
  const itemLabel = totals.totalItems === 1 ? 'item' : 'itens'
  const bagLabel = totals.totalItems === 0
    ? 'Sacola disponível em breve'
    : `Sacola com ${totals.totalItems} ${itemLabel}; visualização disponível em breve`

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Ir para o conteúdo principal
      </a>
      <header className={`header ${isOpen ? 'header--menu-open' : ''}`}>
        <div className="container header__inner">
          <Link href={routes.home} aria-label="Página inicial da MS Griffe">
            <img
              className="header__logo"
              src="/images/msGriffeLogo.png"
              alt="MS Griffe"
            />
          </Link>

          <PrimaryNavigation isOpen={isOpen} onNavigate={() => close()} />

          <div className="header__actions">
            <ThemeToggle />
            <IconButton
              className="desktop-action"
              icon="search"
              label="Busca disponível em breve"
              title="Busca disponível em breve"
              disabled
            />
            <IconButton
              className="desktop-action"
              icon="user"
              label="Conta disponível em breve"
              title="Conta disponível em breve"
              disabled
            />
            <IconButton
              className="bag-action"
              icon="bag"
              label={bagLabel}
              title="Sacola disponível em breve"
              disabled
            >
              <Badge
                className="bag-action__count"
                accessibleLabel={`${totals.totalItems} ${itemLabel} na sacola`}
              >
                {totals.totalItems}
              </Badge>
            </IconButton>
            <IconButton
              ref={triggerRef}
              className="menu-button"
              icon={isOpen ? 'x' : 'menu'}
              label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isOpen}
              aria-controls="primary-navigation"
              onClick={toggle}
            />
          </div>
        </div>
      </header>
      {isOpen && (
        <button
          className="navigation-backdrop"
          type="button"
          aria-label="Fechar menu"
          onClick={() => close()}
        />
      )}
    </>
  )
}
