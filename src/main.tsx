import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { applyTheme, getInitialTheme } from './app/theme/theme'
import './shared/styles/tokens.css'
import './shared/styles/global.css'

applyTheme(getInitialTheme())

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento raiz da aplicação não encontrado.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
