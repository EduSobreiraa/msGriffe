import { afterEach, describe, expect, it, vi } from 'vitest'
import { BrowserHttpTransport } from './BrowserHttpTransport'

describe('BrowserHttpTransport', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('delega Request ao fetch do navegador', async () => {
    const response = new Response(null, { status: 204 })
    const fetchMock = vi.fn().mockResolvedValue(response)
    vi.stubGlobal('fetch', fetchMock)
    const request = new Request('https://api.msgriffe.com/v1/catalog/products')

    await expect(new BrowserHttpTransport().send(request)).resolves.toBe(response)
    expect(fetchMock).toHaveBeenCalledWith(request)
  })
})
