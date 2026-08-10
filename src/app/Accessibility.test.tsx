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
