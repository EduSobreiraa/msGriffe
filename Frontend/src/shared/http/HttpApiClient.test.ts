import { describe, expect, it, vi } from 'vitest'
import { HttpApiClient, type HttpTransport, type SessionRefresher } from './HttpApiClient'

function transportWith(...responses: Array<Response | Error>): HttpTransport & { requests: Request[] } {
  const requests: Request[] = []
  return {
    requests,
    send: vi.fn(async (request: Request) => {
      requests.push(request)
      const response = responses.shift()
      if (!response) throw new Error('Resposta de teste ausente.')
      if (response instanceof Error) throw response
      return response
    }),
  }
}

describe('HttpApiClient', () => {
  it('envia JSON para origem configurada com cookies incluídos', async () => {
    const transport = transportWith(new Response(JSON.stringify({ id: 'cart-1' }), { status: 200 }))
    const client = new HttpApiClient('https://api.msgriffe.com', transport, { refresh: vi.fn() })

    await expect(client.request({ body: { quantity: 1 }, method: 'POST', path: '/v1/carts' })).resolves.toEqual({ id: 'cart-1' })

    const request = transport.requests[0]
    expect(request.url).toBe('https://api.msgriffe.com/v1/carts')
    expect(request.credentials).toBe('include')
    expect(request.headers.get('Content-Type')).toBe('application/json')
    await expect(request.json()).resolves.toEqual({ quantity: 1 })
  })

  it('renova sessão uma única vez e repete apenas leitura', async () => {
    const transport = transportWith(
      new Response(null, { status: 401 }),
      new Response(JSON.stringify({ items: [] }), { status: 200 }),
    )
    const refresher: SessionRefresher = { refresh: vi.fn().mockResolvedValue('access-token') }
    const client = new HttpApiClient('https://api.msgriffe.com', transport, refresher)

    await expect(client.request({ path: '/v1/catalog/products' })).resolves.toEqual({ items: [] })
    expect(refresher.refresh).toHaveBeenCalledTimes(1)
    expect(transport.requests).toHaveLength(2)
    expect(transport.requests[1].headers.get('Authorization')).toBe('Bearer access-token')
  })

  it('não renova nem repete mutação após 401', async () => {
    const transport = transportWith(new Response(null, { status: 401 }))
    const refresher: SessionRefresher = { refresh: vi.fn() }
    const client = new HttpApiClient('https://api.msgriffe.com', transport, refresher)

    await expect(client.request({ body: { name: 'Teste' }, method: 'POST', path: '/v1/orders' })).rejects.toMatchObject({ code: 'UNAUTHORIZED', status: 401 })
    expect(refresher.refresh).not.toHaveBeenCalled()
    expect(transport.requests).toHaveLength(1)
  })

  it('não repete leitura quando refresh não entrega token', async () => {
    const transport = transportWith(new Response(null, { status: 401 }))
    const refresher: SessionRefresher = { refresh: vi.fn().mockResolvedValue(null) }
    const client = new HttpApiClient('https://api.msgriffe.com', transport, refresher)

    await expect(client.request({ path: '/v1/catalog/products' })).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
    expect(transport.requests).toHaveLength(1)
  })

  it('aceita resposta vazia de operação concluída', async () => {
    const transport = transportWith(new Response(null, { status: 204 }))
    const client = new HttpApiClient('https://api.msgriffe.com', transport, { refresh: vi.fn() })

    await expect(client.request({ method: 'DELETE', path: '/v1/carts/current' })).resolves.toBeUndefined()
  })

  it('normaliza abort e bloqueia caminhos inseguros', async () => {
    const transport: HttpTransport = { send: vi.fn().mockRejectedValue(new DOMException('Abortado', 'AbortError')) }
    const client = new HttpApiClient('https://api.msgriffe.com', transport, { refresh: vi.fn() })

    await expect(client.request({ path: '/v1/catalog/products' })).rejects.toMatchObject({ code: 'ABORTED', status: null })
    await expect(client.request({ path: 'https://other.example/v1/catalog' })).rejects.toMatchObject({ code: 'UNEXPECTED', status: null })
  })
})
