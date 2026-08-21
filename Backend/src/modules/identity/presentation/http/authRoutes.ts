import type { FastifyInstance, FastifyReply } from 'fastify'
import { z } from 'zod'
import type { Environment } from '../../../../config/environment.js'
import { IdentityService } from '../../application/IdentityService.js'

export type AuthService = Pick<IdentityService, 'login' | 'logout' | 'refresh' | 'register'>

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

  application.post('/v1/auth/login', async (request, reply) => {
    const input = credentialsSchema.parse(request.body)
    const session = await options.identityService.login(input)
    setRefreshCookie(reply, options.environment, session.refreshToken)
    return { accessToken: session.accessToken }
  })

  application.post('/v1/auth/session/refresh', async (request, reply) => {
    const session = await options.identityService.refresh(request.cookies[cookieName])
    setRefreshCookie(reply, options.environment, session.refreshToken)
    return { accessToken: session.accessToken }
  })

  application.post('/v1/auth/logout', async (request, reply) => {
    await options.identityService.logout(request.cookies[cookieName])
    reply.clearCookie(cookieName, { httpOnly: true, path: '/v1/auth', sameSite: options.environment.sessionCookieSameSite, secure: options.environment.sessionCookieSecure })
    return reply.status(204).send()
  })
}
