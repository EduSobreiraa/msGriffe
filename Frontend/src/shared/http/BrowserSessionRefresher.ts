import type { HttpTransport, SessionRefresher } from './HttpApiClient'

interface RefreshResponse {
  accessToken?: unknown
}

export class BrowserSessionRefresher implements SessionRefresher {
  constructor(
    private readonly baseUrl: string,
    private readonly transport: HttpTransport,
  ) {}

  async refresh(): Promise<string | null> {
    try {
      const response = await this.transport.send(
        new Request(new URL('/v1/auth/session/refresh', `${this.baseUrl}/`), {
          credentials: 'include',
          headers: { Accept: 'application/json' },
          method: 'POST',
        }),
      )

      if (!response.ok) return null
      const body = await response.json() as RefreshResponse

      return typeof body.accessToken === 'string' && body.accessToken.length > 0
        ? body.accessToken
        : null
    } catch {
      return null
    }
  }
}
