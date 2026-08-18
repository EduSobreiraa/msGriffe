import { ApiError, apiErrorFromStatus } from './ApiError'

export type ApiMethod = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT'

export interface ApiRequest {
  body?: unknown
  headers?: Record<string, string>
  method?: ApiMethod
  path: string
  signal?: AbortSignal
}

export interface HttpTransport {
  send(request: Request): Promise<Response>
}

export interface SessionRefresher {
  refresh(): Promise<string | null>
}

export interface ApiClient {
  request<T>(request: ApiRequest): Promise<T>
}

function isSafePath(path: string) {
  return path.startsWith('/') && !path.startsWith('//') && !path.includes('://')
}

function isRetryableMethod(method: ApiMethod) {
  return method === 'GET' || method === 'HEAD'
}

export class HttpApiClient implements ApiClient {
  private accessToken: string | null = null

  constructor(
    private readonly baseUrl: string,
    private readonly transport: HttpTransport,
    private readonly sessionRefresher: SessionRefresher,
  ) {}

  async request<T>(request: ApiRequest): Promise<T> {
    const method = request.method ?? 'GET'
    const response = await this.send(request, method)

    if (response.status === 401 && isRetryableMethod(method)) {
      const refreshedToken = await this.sessionRefresher.refresh()

      if (refreshedToken) {
        this.accessToken = refreshedToken
        return this.read<T>(await this.send(request, method))
      }
    }

    return this.read<T>(response)
  }

  private async send(request: ApiRequest, method: ApiMethod) {
    if (!isSafePath(request.path)) throw new ApiError('UNEXPECTED', null)

    const headers = new Headers({ Accept: 'application/json', ...request.headers })
    const hasBody = request.body !== undefined

    if (hasBody) headers.set('Content-Type', 'application/json')
    if (this.accessToken) headers.set('Authorization', `Bearer ${this.accessToken}`)

    try {
      return await this.transport.send(
        new Request(new URL(request.path, `${this.baseUrl}/`), {
          body: hasBody ? JSON.stringify(request.body) : undefined,
          credentials: 'include',
          headers,
          method,
          signal: request.signal,
        }),
      )
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('ABORTED', null)
      }

      throw new ApiError('NETWORK', null)
    }
  }

  private async read<T>(response: Response): Promise<T> {
    if (!response.ok) throw apiErrorFromStatus(response.status)
    if (response.status === 204) return undefined as T

    try {
      return await response.json() as T
    } catch {
      throw new ApiError('UNEXPECTED', response.status)
    }
  }
}
