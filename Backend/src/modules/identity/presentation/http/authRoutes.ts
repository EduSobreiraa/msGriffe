import type { FastifyInstance, FastifyReply } from 'fastify'
import { z } from 'zod'
import type { Environment } from '../../../../config/environment.js'
import { IdentityService } from '../../application/IdentityService.js'

export type AuthService = Pick<IdentityService, 'confirmEmailVerification' | 'confirmPasswordRecovery' | 'login' | 'logout' | 'refresh' | 'register' | 'requestEmailVerification' | 'requestPasswordRecovery'>

const cookieName = 'msgriffe_refresh'
const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
})
const registerSchema = credentialsSchema.extend({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform((value, context) => {
    const date = new Date(`${value}T00:00:00.000Z`)
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value || date >= new Date()) {
      context.addIssue({ code: 'custom', message: 'Data de nascimento inválida.' })
      return z.NEVER
    }
    return date
  }),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(32),
})
const emailSchema = z.object({ email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()) })
const tokenSchema = z.object({ token: z.string().min(1).max(512) })
const passwordRecoverySchema = tokenSchema.extend({ password: z.string().min(12).max(128) })

function setRefreshCookie(reply: FastifyReply, environment: Environment, refreshToken: string) {
  reply.setCookie(cookieName, refreshToken, {
    httpOnly: true,
    maxAge: environment.refreshSessionTtlDays * 86_400,
    path: '/v1/auth',
    sameSite: environment.sessionCookieSameSite,
    secure: environment.sessionCookieSecure,
  })
}

export async function registerAuthRoutes(application: FastifyInstance, options: { environment: Environment; identityService: AuthService }) {
  application.post('/v1/auth/register', async (request, reply) => {
    const input = registerSchema.parse(request.body)
    const session = await options.identityService.register(input)
    setRefreshCookie(reply, options.environment, session.refreshToken)
    return reply.status(201).send({ accessToken: session.accessToken })
  })

  application.post('/v1/auth/login', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, async (request, reply) => {
    const input = credentialsSchema.parse(request.body)
    const session = await options.identityService.login(input)
    setRefreshCookie(reply, options.environment, session.refreshToken)
    return { accessToken: session.accessToken }
  })

  application.get('/v1/auth/csrf', async (_request, reply) => ({ csrfToken: await reply.generateCsrf() }))

  application.post('/v1/auth/session/refresh', { config: { rateLimit: { max: 20, timeWindow: '1 minute' } }, onRequest: application.csrfProtection }, async (request, reply) => {
    const session = await options.identityService.refresh(request.cookies[cookieName])
    setRefreshCookie(reply, options.environment, session.refreshToken)
    return { accessToken: session.accessToken }
  })

  application.post('/v1/auth/logout', { onRequest: application.csrfProtection }, async (request, reply) => {
    await options.identityService.logout(request.cookies[cookieName])
    reply.clearCookie(cookieName, { httpOnly: true, path: '/v1/auth', sameSite: options.environment.sessionCookieSameSite, secure: options.environment.sessionCookieSecure })
    return reply.status(204).send()
  })

  application.post('/v1/auth/email-verification/request', { config: { rateLimit: { max: 3, timeWindow: '1 hour' } } }, async (request, reply) => {
    await options.identityService.requestEmailVerification(emailSchema.parse(request.body).email)
    return reply.status(202).send()
  })

  application.post('/v1/auth/email-verification/confirm', async (request, reply) => {
    await options.identityService.confirmEmailVerification(tokenSchema.parse(request.body).token)
    return reply.status(204).send()
  })

  application.post('/v1/auth/password-recovery/request', { config: { rateLimit: { max: 3, timeWindow: '1 hour' } } }, async (request, reply) => {
    await options.identityService.requestPasswordRecovery(emailSchema.parse(request.body).email)
    return reply.status(202).send()
  })

  application.post('/v1/auth/password-recovery/confirm', async (request, reply) => {
    await options.identityService.confirmPasswordRecovery(passwordRecoverySchema.parse(request.body))
    return reply.status(204).send()
  })
}
