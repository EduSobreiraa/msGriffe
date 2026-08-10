import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { ThemeContext } from './ThemeContext'
import { applyTheme, getInitialTheme } from './theme'

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
