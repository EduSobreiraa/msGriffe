import { describe, expect, it } from 'vitest'
import { readEnvironment } from './environment.js'

describe('readEnvironment', () => {
  it('normaliza allowlist CORS e valores operacionais', () => {
    expect(readEnvironment({ ACCESS_TOKEN_SECRET: 'test-access-token-secret-that-has-at-least-32-characters', CORS_ALLOWED_ORIGINS: 'http://localhost:5173,https://staging.msgriffe.com.br', PORT: '3100' })).toEqual({
      accessTokenSecret: 'test-access-token-secret-that-has-at-least-32-characters',
      accessTokenTtlSeconds: 900,
      corsAllowedOrigins: ['http://localhost:5173', 'https://staging.msgriffe.com.br'],
      host: '127.0.0.1',
      nodeEnvironment: 'development',
      port: 3100,
      refreshSessionTtlDays: 14,
      sessionCookieSameSite: 'lax',
      sessionCookieSecure: false,
    })
  })

  it('rejeita origem insegura e HTTP em produção', () => {
    const secret = 'test-access-token-secret-that-has-at-least-32-characters'
    expect(() => readEnvironment({ ACCESS_TOKEN_SECRET: secret, CORS_ALLOWED_ORIGINS: 'https://api.msgriffe.com.br/path' })).toThrow('origem inválida')
    expect(() => readEnvironment({ ACCESS_TOKEN_SECRET: secret, CORS_ALLOWED_ORIGINS: 'http://localhost:5173', NODE_ENV: 'production' })).toThrow('HTTPS')
    expect(() => readEnvironment({ ACCESS_TOKEN_SECRET: secret, CORS_ALLOWED_ORIGINS: 'http://localhost:5173', SESSION_COOKIE_SAME_SITE: 'none' })).toThrow('Cookie de sessão')
  })
})
