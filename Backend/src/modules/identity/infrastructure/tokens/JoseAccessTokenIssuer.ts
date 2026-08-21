import { jwtVerify, SignJWT } from 'jose'
import { ApplicationError } from '../../../../shared/errors/ApplicationError.js'
import type { AccessTokenIssuer, AccessTokenVerifier, IdentityRole } from '../../application/identityContracts.js'

const roles = new Set<IdentityRole>(['CUSTOMER', 'SELLER', 'SUPERADMIN'])

export class JoseAccessTokenIssuer implements AccessTokenIssuer, AccessTokenVerifier {
  private readonly secret: Uint8Array

  constructor(secret: string, private readonly ttlSeconds: number) {
    this.secret = new TextEncoder().encode(secret)
  }

  issue(input: { role: IdentityRole; userId: string }): Promise<string> {
    return new SignJWT({ role: input.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(input.userId)
      .setIssuedAt()
      .setExpirationTime(`${this.ttlSeconds}s`)
      .sign(this.secret)
  }

  async verify(value: string): Promise<{ role: IdentityRole; userId: string }> {
    try {
      const { payload } = await jwtVerify(value, this.secret, { algorithms: ['HS256'] })
      if (typeof payload.sub !== 'string' || typeof payload.role !== 'string' || !roles.has(payload.role as IdentityRole)) throw new Error('Claims inválidas.')
      return { role: payload.role as IdentityRole, userId: payload.sub }
    } catch {
      throw new ApplicationError('UNAUTHENTICATED', 401)
    }
  }
}
