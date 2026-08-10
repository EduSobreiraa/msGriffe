import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { App } from './App'
import { routes } from './routes'

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    window.localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('renderiza a identidade e os produtos em destaque', async () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /vista sua melhor versão/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Destaques' })).toBeInTheDocument()
    expect(await screen.findByText('Camiseta Boss')).toBeInTheDocument()
    expect(
      screen.getByRole('img', {
        name: 'Camiseta e shorts masculinos em destaque',
      }),
    ).toHaveAttribute('fetchpriority', 'high')
    expect(
      screen.getByRole('button', {
        name: 'Sacola disponível em breve para Camiseta Boss',
      }),
    ).toBeDisabled()
  })

  it('alterna e persiste o tema escolhido', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Ativar tema claro' }))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem('msgriffe-theme')).toBe('light')
    expect(
      screen.getByRole('button', { name: 'Ativar tema escuro' }),
    ).toBeInTheDocument()
  })

  it('abre e fecha o menu móvel por teclado restaurando o foco', async () => {
    render(<App />)
    const menuButton = screen.getByRole('button', { name: 'Abrir menu' })

    fireEvent.click(menuButton)

    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(document.body).toHaveClass('mobile-menu-open')

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveFocus()
    })
    expect(document.body).not.toHaveClass('mobile-menu-open')
  })

  it('fecha o menu móvel pelo backdrop', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))

    const closeButtons = screen.getAllByRole('button', { name: 'Fechar menu' })
    fireEvent.click(closeButtons[1])

    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(document.body).not.toHaveClass('mobile-menu-open')
  })

  it('fecha o menu móvel depois de navegar', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    fireEvent.click(screen.getByRole('link', { name: 'PRODUTOS' }))

    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('oferece atalhos e contexto semântico de navegação', () => {
    render(<App />)

    expect(
      screen.getByRole('link', { name: 'Ir para o conteúdo principal' }),
    ).toHaveAttribute('href', '#conteudo-principal')
    expect(screen.getByRole('link', { name: 'INÍCIO' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('navega para o catálogo e atualiza o item corrente', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'PRODUTOS' }))

    expect(
      await screen.findByRole('heading', { name: 'Todos os produtos' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'PRODUTOS' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus())
    expect(screen.getByText('Todos os produtos', { selector: '[aria-live]' })).toBeInTheDocument()
    expect(document.title).toBe('Produtos | MS Griffe')
  })

  it('navega pelo índice de categorias até o catálogo filtrado', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'CATEGORIAS' }))

    expect(await screen.findByRole('heading', { name: 'Categorias' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'CATEGORIAS' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    fireEvent.click(
      await screen.findByRole('link', { name: 'Ver Camisetas: 6 produtos' }),
    )

    expect(await screen.findByRole('heading', { name: 'Camisetas' })).toBeInTheDocument()
    expect(await screen.findByText('6 produtos')).toBeInTheDocument()
    expect(screen.queryByLabelText('Categoria')).not.toBeInTheDocument()
  })

  it('renderiza página não encontrada para rota desconhecida', () => {
    window.history.replaceState(null, '', '/rota-inexistente')
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeInTheDocument()
  })

  it('resolve diretamente as rotas parametrizadas de produto e categoria', async () => {
    window.history.replaceState(null, '', routes.product('camiseta-boss'))
    const { unmount } = render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Camiseta Boss' }),
    ).toBeInTheDocument()

    unmount()
    window.history.replaceState(null, '', routes.category('camisetas'))
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Camisetas' })).toBeInTheDocument()
    expect(await screen.findByText('6 produtos')).toBeInTheDocument()
  })

  it('trata uma categoria inexistente', async () => {
    window.history.replaceState(null, '', routes.category('inexistente'))
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Categoria não encontrada' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver categorias' })).toHaveAttribute(
      'href',
      routes.categories,
    )
  })

  it('reflete no cabeçalho a variante adicionada pelo detalhe', async () => {
    window.history.replaceState(null, '', routes.product('camiseta-boss'))
    render(<App />)

    await screen.findByRole('heading', { name: 'Camiseta Boss' })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar à sacola' }))

    expect(
      screen.getByRole('button', {
        name: 'Abrir sacola, 1 item',
      }),
    ).toBeEnabled()
    expect(screen.getByLabelText('1 item na sacola')).toHaveTextContent('1')
    expect(window.localStorage.getItem('msgriffe-cart')).toContain(
      'camiseta-boss-preto-p',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Abrir sacola, 1 item' }))
    expect(screen.getByRole('dialog', { name: 'Sacola' })).toBeInTheDocument()
    expect(screen.getByText('Subtotal · 1 item')).toBeInTheDocument()
  })
})
