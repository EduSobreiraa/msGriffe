export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'msgriffe-theme'

function isTheme(value: string | null): value is Theme {
  return value === 'dark' || value === 'light'
}

export function getInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (isTheme(storedTheme)) {
    return storedTheme
  }

  return window.matchMedia?.('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}
