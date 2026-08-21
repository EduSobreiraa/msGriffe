import type { FastifyRequest, preHandlerHookHandler } from 'fastify'
import { ApplicationError } from '../../../../shared/errors/ApplicationError.js'
import type { AccessTokenVerifier, IdentityRole } from '../../application/identityContracts.js'

export interface AuthenticatedActor {
  role: IdentityRole
  userId: string
}

declare module 'fastify' {
  interface FastifyRequest {
    actor?: AuthenticatedActor
  }
}

function readBearerToken(request: FastifyRequest) {
  const authorization = request.headers.authorization
  if (!authorization?.startsWith('Bearer ')) throw new ApplicationError('UNAUTHENTICATED', 401)
  const token = authorization.slice('Bearer '.length).trim()
  if (!token) throw new ApplicationError('UNAUTHENTICATED', 401)
  return token
}

export function authenticateAccessToken(verifier: AccessTokenVerifier): preHandlerHookHandler {
  return async (request) => {
    request.actor = Object.freeze(await verifier.verify(readBearerToken(request)))
  }
}

export function requireRole(...allowedRoles: IdentityRole[]): preHandlerHookHandler {
  return async (request) => {
    if (!request.actor) throw new ApplicationError('UNAUTHENTICATED', 401)
    if (!allowedRoles.includes(request.actor.role)) throw new ApplicationError('FORBIDDEN', 403)
  }
}
