import { describe, expect, it, vi } from 'vitest'
import { BrowserSessionRefresher } from './BrowserSessionRefresher'

describe('BrowserSessionRefresher', () => {
  it('usa cookie HttpOnly via credentials include e devolve token só para memória', async () => {
    const send = vi.fn().mockResolvedValue(new Response(JSON.stringify({ accessToken: 'token-curto' }), { status: 200 }))
    const refresher = new BrowserSessionRefresher('https://api.msgriffe.com', { send })

    await expect(refresher.refresh()).resolves.toBe('token-curto')
    const request = send.mock.calls[0][0] as Request
    expect(request.url).toBe('https://api.msgriffe.com/v1/auth/session/refresh')
    expect(request.method).toBe('POST')
    expect(request.credentials).toBe('include')
  })

  it('não revela falha de refresh como token ou detalhe de resposta', async () => {
    const refresher = new BrowserSessionRefresher('https://api.msgriffe.com', { send: vi.fn().mockResolvedValue(new Response(null, { status: 401 })) })
    await expect(refresher.refresh()).resolves.toBeNull()
  })

  it('recusa corpo de refresh sem access token válido', async () => {
    const refresher = new BrowserSessionRefresher('https://api.msgriffe.com', { send: vi.fn().mockResolvedValue(new Response(JSON.stringify({ accessToken: 10 }), { status: 200 })) })
    await expect(refresher.refresh()).resolves.toBeNull()
  })
})
