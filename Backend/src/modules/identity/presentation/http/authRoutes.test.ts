import { describe, expect, it } from 'vitest'
import { createApplication } from '../../../../app/createApplication.js'

const environment = { accessTokenSecret: 'test-access-token-secret-that-has-at-least-32-characters', accessTokenTtlSeconds: 900, corsAllowedOrigins: ['https://staging.msgriffe.com.br'], host: '127.0.0.1', nodeEnvironment: 'test' as const, port: 3000, refreshSessionTtlDays: 14, sessionCookieSameSite: 'lax' as const, sessionCookieSecure: false }
const session = { accessToken: 'access-token', refreshToken: 'session.secret' }

describe('auth routes', () => {
  it('emite e rotaciona cookie HttpOnly', async () => {
    const calls: string[] = []
    const application = await createApplication(environment, { identityService: {
      login: async () => { calls.push('login'); return session }, logout: async () => { calls.push('logout') }, refresh: async () => { calls.push('refresh'); return session }, register: async () => { calls.push('register'); return session },
    } })
    const register = await application.inject({ method: 'POST', url: '/v1/auth/register', payload: { birthDate: '2000-01-01', email: 'Cliente@Exemplo.com', name: 'Cliente', password: 'senha-segura-123', phone: '71999999999' } })
    const cookie = register.cookies[0]?.value
    const login = await application.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'cliente@exemplo.com', password: 'senha-segura-123' } })
    const refresh = await application.inject({ headers: { cookie: `msgriffe_refresh=${cookie}` }, method: 'POST', url: '/v1/auth/session/refresh' })
    const logout = await application.inject({ headers: { cookie: `msgriffe_refresh=${cookie}` }, method: 'POST', url: '/v1/auth/logout' })
    const invalid = await application.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'invalido', password: 'curta' } })
    expect(register.statusCode).toBe(201); expect(register.json()).toEqual({ accessToken: 'access-token' }); expect(register.headers['set-cookie']).toContain('HttpOnly')
    expect(login.statusCode).toBe(200); expect(refresh.statusCode).toBe(200); expect(logout.statusCode).toBe(204); expect(invalid.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } }); expect(calls).toEqual(['register', 'login', 'refresh', 'logout'])
    await application.close()
  })
})
