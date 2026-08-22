import { IconButton } from '../../shared/components/IconButton'
import { useTheme } from './useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const targetTheme = theme === 'dark' ? 'claro' : 'escuro'

  return (
    <IconButton
      icon={theme === 'dark' ? 'sun' : 'moon'}
      label={`Ativar tema ${targetTheme}`}
      title={`Ativar tema ${targetTheme}`}
      onClick={toggleTheme}
    />
  )
}
