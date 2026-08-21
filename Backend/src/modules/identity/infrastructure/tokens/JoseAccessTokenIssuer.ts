import { SignJWT } from 'jose'
import type { AccessTokenIssuer, IdentityRole } from '../../application/identityContracts.js'

export class JoseAccessTokenIssuer implements AccessTokenIssuer {
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
}
