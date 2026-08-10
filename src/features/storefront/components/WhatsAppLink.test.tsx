import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WhatsAppLink } from './WhatsAppLink'

describe('WhatsAppLink', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('não renderiza um link sem número válido', () => {
    vi.stubEnv('VITE_WHATSAPP_NUMBER', '5500000000000')
    const { container } = render(<WhatsAppLink />)

    expect(container).toBeEmptyDOMElement()
  })

  it('normaliza o número válido e cria o destino do WhatsApp', () => {
    vi.stubEnv('VITE_WHATSAPP_NUMBER', '+55 (11) 99999-9999')
    render(<WhatsAppLink />)

    expect(
      screen.getByRole('link', { name: 'Falar com a MS Griffe pelo WhatsApp' }),
    ).toHaveAttribute('href', 'https://wa.me/5511999999999')
  })
})
