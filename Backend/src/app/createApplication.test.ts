import { afterEach, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { createApplication } from './createApplication.js'
import { ApplicationError } from '../shared/errors/ApplicationError.js'

const environment = {
  accessTokenSecret: 'test-access-token-secret-that-has-at-least-32-characters',
  accessTokenTtlSeconds: 900,
  accountUrl: 'https://staging.msgriffe.com.br',
  corsAllowedOrigins: ['https://staging.msgriffe.com.br'],
  host: '127.0.0.1',
  mediaPublicBaseUrl: 'https://media.msgriffe.com.br',
  nodeEnvironment: 'test' as const,
  port: 3000,
  refreshSessionTtlDays: 14,
  sessionCookieSameSite: 'lax' as const,
  sessionCookieSecure: false,
}

describe('createApplication', () => {
  let application: FastifyInstance | undefined

  afterEach(async () => application?.close())

  it('expõe healthcheck versionado com headers defensivos', async () => {
    application = await createApplication(environment)
    const response = await application.inject({ method: 'GET', url: '/v1/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'ok' })
    expect(response.headers['x-content-type-options']).toBe('nosniff')
  })

  it('aceita apenas origem autorizada e nunca expõe erro interno', async () => {
    application = await createApplication(environment)
    const allowed = await application.inject({ headers: { origin: 'https://staging.msgriffe.com.br' }, method: 'GET', url: '/v1/health' })
    const denied = await application.inject({ headers: { origin: 'https://untrusted.example' }, method: 'GET', url: '/v1/missing' })

    expect(allowed.headers['access-control-allow-origin']).toBe('https://staging.msgriffe.com.br')
    expect(denied.headers['access-control-allow-origin']).toBeUndefined()
    expect(denied.statusCode).toBe(404)
    expect(denied.json()).toEqual({ error: { code: 'NOT_FOUND' } })
  })

  it('serializa somente códigos estáveis para falhas conhecidas e desconhecidas', async () => {
    application = await createApplication(environment)
    application.get('/v1/test/forbidden', async () => {
      throw new ApplicationError('FORBIDDEN', 403)
    })
    application.get('/v1/test/unexpected', async () => {
      throw new Error('detalhe interno')
    })

    const forbidden = await application.inject({ method: 'GET', url: '/v1/test/forbidden' })
    const unexpected = await application.inject({ method: 'GET', url: '/v1/test/unexpected' })

    expect(forbidden.statusCode).toBe(403)
    expect(forbidden.json()).toEqual({ error: { code: 'FORBIDDEN' } })
    expect(unexpected.statusCode).toBe(500)
    expect(unexpected.json()).toEqual({ error: { code: 'INTERNAL_ERROR' } })
    expect(unexpected.body).not.toContain('detalhe interno')
  })
})
