import { render } from '@testing-library/react'
import { App } from '../app/App'

export function renderAppAt(path: string) {
  window.history.replaceState(null, '', path)
  window.localStorage.clear()
  delete document.documentElement.dataset.theme

  return render(<App />)
}
