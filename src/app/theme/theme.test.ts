import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, getInitialTheme, THEME_STORAGE_KEY } from './theme'

function mockSystemTheme(prefersLight: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches: prefersLight }),
  )
}

describe('tema da aplicação', () => {
  afterEach(() => {
    window.localStorage.clear()
    delete document.documentElement.dataset.theme
    document.documentElement.style.colorScheme = ''
    vi.unstubAllGlobals()
  })

  it('prioriza o tema armazenado sobre a preferência do sistema', () => {
    mockSystemTheme(true)
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')

    expect(getInitialTheme()).toBe('dark')
  })

  it('usa a preferência do sistema quando não existe escolha armazenada', () => {
    mockSystemTheme(true)

    expect(getInitialTheme()).toBe('light')
  })

  it('aplica e persiste o tema', () => {
    applyTheme('light')

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.style.colorScheme).toBe('light')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })
})
