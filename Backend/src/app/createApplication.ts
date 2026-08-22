import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import csrfProtection from '@fastify/csrf-protection'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import Fastify, { type FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import type { Environment } from '../config/environment.js'
import { registerHealthRoutes } from '../modules/health/presentation/http/healthRoutes.js'
import { registerAuthRoutes, type AuthService } from '../modules/identity/presentation/http/authRoutes.js'
import type { AccessTokenVerifier } from '../modules/identity/application/identityContracts.js'
import { ApplicationError } from '../shared/errors/ApplicationError.js'

export async function createApplication(environment: Environment, dependencies?: { accessTokenVerifier: AccessTokenVerifier; identityService: AuthService }): Promise<FastifyInstance> {
  const application = Fastify({
    logger: false,
  })

  await application.register(helmet)
  await application.register(cookie)
  await application.register(csrfProtection, {
    cookieKey: 'msgriffe_csrf',
    cookieOpts: { httpOnly: true, path: '/v1/auth', sameSite: environment.sessionCookieSameSite, secure: environment.sessionCookieSecure },
    getToken: (request) => {
      const token = request.headers['x-csrf-token']
      return Array.isArray(token) ? token[0] : token
    },
  })
  await application.register(rateLimit, {
    global: false,
    errorResponseBuilder: () => ({ error: { code: 'RATE_LIMITED' } }),
  })
  await application.register(cors, {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || environment.corsAllowedOrigins.includes(origin)) return callback(null, true)
      return callback(null, false)
    },
  })

  application.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) return reply.status(400).send({ error: { code: 'VALIDATION_ERROR' } })
    if (error instanceof ApplicationError) {
      return reply.status(error.statusCode).send({ error: { code: error.code } })
    }

    return reply.status(500).send({ error: { code: 'INTERNAL_ERROR' } })
  })
  application.setNotFoundHandler((_request, reply) => reply.status(404).send({ error: { code: 'NOT_FOUND' } }))

  await application.register(registerHealthRoutes)
  if (dependencies) await application.register(registerAuthRoutes, { ...dependencies, environment })
  return application
}
