import { describe, expect, it } from 'vitest'
import { readEnvironment } from './environment.js'

describe('readEnvironment', () => {
  it('normaliza allowlist CORS e valores operacionais', () => {
    expect(readEnvironment({ ACCESS_TOKEN_SECRET: 'test-access-token-secret-that-has-at-least-32-characters', CORS_ALLOWED_ORIGINS: 'http://localhost:5173,https://staging.msgriffe.com.br', MEDIA_PUBLIC_BASE_URL: 'https://media.msgriffe.com.br/', PORT: '3100' })).toEqual({
      accessTokenSecret: 'test-access-token-secret-that-has-at-least-32-characters',
      accessTokenTtlSeconds: 900,
      accountUrl: 'http://localhost:5173',
      brevoApiKey: undefined,
      brevoSenderEmail: undefined,
      corsAllowedOrigins: ['http://localhost:5173', 'https://staging.msgriffe.com.br'],
      host: '127.0.0.1',
      mediaPublicBaseUrl: 'https://media.msgriffe.com.br',
      nodeEnvironment: 'development',
      port: 3100,
      refreshSessionTtlDays: 14,
      sessionCookieSameSite: 'lax',
      sessionCookieSecure: false,
      totpEncryptionKey: undefined,
    })
  })

  it('rejeita origem insegura e HTTP em produção', () => {
    const secret = 'test-access-token-secret-that-has-at-least-32-characters'
    const required = { ACCESS_TOKEN_SECRET: secret, MEDIA_PUBLIC_BASE_URL: 'https://media.msgriffe.com.br' }
    expect(() => readEnvironment({ ...required, CORS_ALLOWED_ORIGINS: 'https://api.msgriffe.com.br/path' })).toThrow('origem inválida')
    expect(() => readEnvironment({ ...required, CORS_ALLOWED_ORIGINS: 'http://localhost:5173', NODE_ENV: 'production' })).toThrow('HTTPS')
    expect(() => readEnvironment({ ...required, CORS_ALLOWED_ORIGINS: 'http://localhost:5173', SESSION_COOKIE_SAME_SITE: 'none' })).toThrow('Cookie de sessão')
    expect(() => readEnvironment({ ...required, CORS_ALLOWED_ORIGINS: 'http://localhost:5173', MEDIA_PUBLIC_BASE_URL: 'http://media.msgriffe.com.br' })).toThrow('MEDIA_PUBLIC_BASE_URL')
    expect(() => readEnvironment({ ...required, CORS_ALLOWED_ORIGINS: 'http://localhost:5173', MEDIA_PUBLIC_BASE_URL: 'https://media.msgriffe.com.br/path?cache=1' })).toThrow('MEDIA_PUBLIC_BASE_URL')
    expect(() => readEnvironment({ ...required, BREVO_API_KEY: 'secret', CORS_ALLOWED_ORIGINS: 'http://localhost:5173' })).toThrow('BREVO_API_KEY')
    expect(() => readEnvironment({ ...required, CORS_ALLOWED_ORIGINS: 'http://localhost:5173', TOTP_ENCRYPTION_KEY: 'invalid' })).toThrow('TOTP_ENCRYPTION_KEY')
  })
})
