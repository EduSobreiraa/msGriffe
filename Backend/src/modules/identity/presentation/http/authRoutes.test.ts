import { describe, expect, it } from 'vitest'
import { createApplication } from '../../../../app/createApplication.js'

const environment = { accessTokenSecret: 'test-access-token-secret-that-has-at-least-32-characters', accessTokenTtlSeconds: 900, accountUrl: 'https://staging.msgriffe.com.br', corsAllowedOrigins: ['https://staging.msgriffe.com.br'], host: '127.0.0.1', nodeEnvironment: 'test' as const, port: 3000, refreshSessionTtlDays: 14, sessionCookieSameSite: 'lax' as const, sessionCookieSecure: false }
const session = { accessToken: 'access-token', refreshToken: 'session.secret' }

describe('auth routes', () => {
  it('emite e rotaciona cookie HttpOnly', async () => {
    const calls: string[] = []
    const application = await createApplication(environment, { accessTokenVerifier: { verify: async () => ({ role: 'SUPERADMIN', userId: 'admin-1' }) }, identityService: {
      confirmEmailVerification: async () => { calls.push('confirm-email') }, confirmPasswordRecovery: async () => { calls.push('confirm-password') }, confirmTotpSetup: async () => { calls.push('confirm-totp') }, login: async () => { calls.push('login'); return session }, logout: async () => { calls.push('logout') }, reauthenticate: async () => { calls.push('reauthenticate') }, refresh: async () => { calls.push('refresh'); return session }, register: async () => { calls.push('register'); return session }, requestEmailVerification: async () => { calls.push('request-email') }, requestPasswordRecovery: async () => { calls.push('request-password') }, startTotpSetup: async () => ({ uri: 'otpauth://totp/msGriffe:admin' }),
    } })
    const register = await application.inject({ method: 'POST', url: '/v1/auth/register', payload: { birthDate: '2000-01-01', email: 'Cliente@Exemplo.com', name: 'Cliente', password: 'senha-segura-123', phone: '71999999999' } })
    const cookie = register.cookies[0]?.value
    const csrf = await application.inject({ method: 'GET', url: '/v1/auth/csrf' })
    const csrfCookie = csrf.cookies.find((entry) => entry.name === 'msgriffe_csrf')?.value
    const login = await application.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'cliente@exemplo.com', password: 'senha-segura-123' } })
    const headers = { cookie: `msgriffe_refresh=${cookie}; msgriffe_csrf=${csrfCookie}`, 'x-csrf-token': csrf.json().csrfToken }
    const refresh = await application.inject({ headers, method: 'POST', url: '/v1/auth/session/refresh' })
    const logout = await application.inject({ headers, method: 'POST', url: '/v1/auth/logout' })
    const invalid = await application.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'invalido', password: 'curta' } })
    const recovery = await application.inject({ method: 'POST', url: '/v1/auth/password-recovery/request', payload: { email: 'cliente@exemplo.com' } })
    const verificationRequest = await application.inject({ method: 'POST', url: '/v1/auth/email-verification/request', payload: { email: 'cliente@exemplo.com' } })
    const verificationConfirm = await application.inject({ method: 'POST', url: '/v1/auth/email-verification/confirm', payload: { token: 'token' } })
    const recoveryConfirm = await application.inject({ method: 'POST', url: '/v1/auth/password-recovery/confirm', payload: { password: 'nova-senha-segura-123', token: 'token' } })
    const setup = await application.inject({ headers: { authorization: 'Bearer token' }, method: 'POST', url: '/v1/auth/admin/totp/setup' })
    const confirmTotp = await application.inject({ headers: { authorization: 'Bearer token' }, method: 'POST', url: '/v1/auth/admin/totp/confirm', payload: { code: '123456' } })
    const reauthentication = await application.inject({ headers: { authorization: 'Bearer token' }, method: 'POST', url: '/v1/auth/reauthenticate', payload: { password: 'senha-segura-123' } })
    expect(register.statusCode).toBe(201); expect(register.json()).toEqual({ accessToken: 'access-token' }); expect(register.headers['set-cookie']).toContain('HttpOnly')
    expect(login.statusCode).toBe(200); expect(refresh.statusCode).toBe(200); expect(logout.statusCode).toBe(204); expect(recovery.statusCode).toBe(202); expect(verificationRequest.statusCode).toBe(202); expect(verificationConfirm.statusCode).toBe(204); expect(recoveryConfirm.statusCode).toBe(204); expect(setup.json()).toEqual({ uri: 'otpauth://totp/msGriffe:admin' }); expect(confirmTotp.statusCode).toBe(204); expect(reauthentication.statusCode).toBe(204); expect(invalid.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } }); expect(calls).toEqual(['register', 'login', 'refresh', 'logout', 'request-password', 'request-email', 'confirm-email', 'confirm-password', 'confirm-totp', 'reauthenticate'])
    await application.close()
  })
})
