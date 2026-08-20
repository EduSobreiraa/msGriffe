import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import Fastify, { type FastifyInstance } from 'fastify'
import type { Environment } from '../config/environment.js'
import { registerHealthRoutes } from '../modules/health/presentation/http/healthRoutes.js'
import { ApplicationError } from '../shared/errors/ApplicationError.js'

export async function createApplication(environment: Environment): Promise<FastifyInstance> {
  const application = Fastify({
    logger: false,
  })

  await application.register(helmet)
  await application.register(cors, {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || environment.corsAllowedOrigins.includes(origin)) return callback(null, true)
      return callback(null, false)
    },
  })

  application.setErrorHandler((error, _request, reply) => {
    if (error instanceof ApplicationError) {
      return reply.status(error.statusCode).send({ error: { code: error.code } })
    }

    return reply.status(500).send({ error: { code: 'INTERNAL_ERROR' } })
  })
  application.setNotFoundHandler((_request, reply) => reply.status(404).send({ error: { code: 'NOT_FOUND' } }))

  await application.register(registerHealthRoutes)
  return application
}
