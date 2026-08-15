import axe from 'axe-core'
import { fireEvent, render, screen } from '@testing-library/react'
import { App } from './App'

async function getAccessibilityViolations() {
  const result = await axe.run(document.body, {
    rules: {
      // O jsdom não calcula contraste visual; os tokens são revisados separadamente.
      'color-contrast': { enabled: false },
    },
  })

  return result.violations.map(({ help, id, nodes }) => ({
    help,
    id,
    targets: nodes.map((node) => node.target),
  }))
}

describe('acessibilidade da página inicial', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    window.localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('não possui violações estruturais conhecidas no tema escuro', async () => {
    render(<App />)

    expect(await getAccessibilityViolations()).toEqual([])
  })

  it('não possui violações estruturais conhecidas no tema claro', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Ativar tema claro' }))

    expect(await getAccessibilityViolations()).toEqual([])
  })
})

describe('acessibilidade da jornada de catálogo', () => {
  it.each([
    ['/produtos', 'Todos os produtos'],
    ['/categorias', 'Categorias'],
    ['/categorias/camisetas', 'Camisetas'],
    ['/produtos/camiseta-boss', 'Camiseta Boss'],
  ])('não possui violações estruturais conhecidas em %s', async (path, heading) => {
    window.history.replaceState(null, '', path)
    render(<App />)

    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument()
    expect(await getAccessibilityViolations()).toEqual([])
  })
})

describe('acessibilidade da sacola', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('não possui violações estruturais conhecidas com o drawer aberto', async () => {
    window.history.replaceState(null, '', '/produtos/camiseta-boss')
    render(<App />)

    await screen.findByRole('heading', { name: 'Camiseta Boss' })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar à sacola' }))
    fireEvent.click(screen.getByRole('button', { name: 'Abrir sacola, 1 item' }))

    expect(screen.getByRole('dialog', { name: 'Sacola' })).toBeInTheDocument()
    expect(await getAccessibilityViolations()).toEqual([])
  })

  it('não possui violações estruturais conhecidas na página cheia', async () => {
    window.history.replaceState(null, '', '/produtos/camiseta-boss')
    render(<App />)

    await screen.findByRole('heading', { name: 'Camiseta Boss' })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar à sacola' }))
    fireEvent.click(screen.getByRole('button', { name: 'Abrir sacola, 1 item' }))
    fireEvent.click(screen.getByRole('link', { name: 'Ver sacola' }))

    expect(await screen.findByRole('heading', { name: 'Sacola', level: 1 })).toBeInTheDocument()
    expect(await getAccessibilityViolations()).toEqual([])
  })
})

describe('acessibilidade do checkout demonstrativo', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('não possui violações estruturais conhecidas', async () => {
    window.history.replaceState(null, '', '/checkout')
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Finalizar compra' })).toBeInTheDocument()
    expect(await getAccessibilityViolations()).toEqual([])
  })
})
