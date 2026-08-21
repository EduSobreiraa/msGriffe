import { describe, expect, it } from 'vitest'
import Fastify from 'fastify'
import { authenticateAccessToken, requireRole } from './accessControl.js'

const verifier = { verify: async (value: string) => value === 'seller-token' ? { role: 'SELLER' as const, userId: 'seller-1' } : { role: 'CUSTOMER' as const, userId: 'customer-1' } }

describe('access control', () => {
  it('rejeita token ausente ou inválido e aplica papel no backend', async () => {
    const application = Fastify()
    application.setErrorHandler((error, _request, reply) => reply.status((error as { statusCode?: number }).statusCode ?? 500).send({ error: { code: (error as { code?: string }).code ?? 'INTERNAL_ERROR' } }))
    application.get('/protected', { preHandler: [authenticateAccessToken(verifier), requireRole('SELLER')] }, async (request) => request.actor)
    const absent = await application.inject({ method: 'GET', url: '/protected' })
    const customer = await application.inject({ headers: { authorization: 'Bearer customer-token' }, method: 'GET', url: '/protected' })
    const seller = await application.inject({ headers: { authorization: 'Bearer seller-token' }, method: 'GET', url: '/protected' })
    expect(absent.statusCode).toBe(401)
    expect(customer.statusCode).toBe(403)
    expect(seller.json()).toEqual({ role: 'SELLER', userId: 'seller-1' })
    await application.close()
  })
})
