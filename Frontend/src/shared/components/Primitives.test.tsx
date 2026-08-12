import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'
import { Button, ButtonLink } from './Button'
import { IconButton } from './IconButton'
import { Skeleton } from './Skeleton'

describe('componentes fundamentais', () => {
  it('preserva a semântica de ação e navegação', () => {
    render(
      <>
        <Button>Finalizar compra</Button>
        <ButtonLink href="/produtos">Ver produtos</ButtonLink>
      </>,
    )

    expect(
      screen.getByRole('button', { name: 'Finalizar compra' }),
    ).toHaveAttribute('type', 'button')
    expect(screen.getByRole('link', { name: 'Ver produtos' })).toHaveAttribute(
      'href',
      '/produtos',
    )
  })

  it('exige um nome acessível para ações apenas com ícone', () => {
    render(<IconButton icon="search" label="Buscar produtos" />)

    expect(
      screen.getByRole('button', { name: 'Buscar produtos' }),
    ).toBeInTheDocument()
  })

  it('expõe o significado do badge e oculta o skeleton', () => {
    const { container } = render(
      <>
        <Badge accessibleLabel="2 itens na sacola">2</Badge>
        <Skeleton className="skeleton--test" />
      </>,
    )

    expect(screen.getByLabelText('2 itens na sacola')).toBeInTheDocument()
    expect(container.querySelector('.skeleton')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.skeleton')).toHaveClass('skeleton--test')
  })
})
