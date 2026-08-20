import type { FastifyInstance } from 'fastify'

export async function registerHealthRoutes(application: FastifyInstance) {
  application.get('/v1/health', async () => ({ status: 'ok' }))
}
