import { describe, expect, it } from 'vitest'
import { readEnvironment } from './environment.js'

describe('readEnvironment', () => {
  it('normaliza allowlist CORS e valores operacionais', () => {
    expect(readEnvironment({ CORS_ALLOWED_ORIGINS: 'http://localhost:5173,https://staging.msgriffe.com.br', PORT: '3100' })).toEqual({
      corsAllowedOrigins: ['http://localhost:5173', 'https://staging.msgriffe.com.br'],
      host: '127.0.0.1',
      nodeEnvironment: 'development',
      port: 3100,
    })
  })

  it('rejeita origem insegura e HTTP em produção', () => {
    expect(() => readEnvironment({ CORS_ALLOWED_ORIGINS: 'https://api.msgriffe.com.br/path' })).toThrow('origem inválida')
    expect(() => readEnvironment({ CORS_ALLOWED_ORIGINS: 'http://localhost:5173', NODE_ENV: 'production' })).toThrow('HTTPS')
  })
})
