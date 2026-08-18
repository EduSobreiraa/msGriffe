import type { HttpTransport } from './HttpApiClient'

export class BrowserHttpTransport implements HttpTransport {
  send(request: Request) {
    return fetch(request)
  }
}
