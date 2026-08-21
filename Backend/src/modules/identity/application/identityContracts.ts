export type IdentityRole = 'CUSTOMER' | 'SELLER' | 'SUPERADMIN'

export interface IdentityUser {
  email: string
  id: string
  isActive: boolean
  passwordHash: string
  role: IdentityRole
}

export interface IdentitySession {
  expiresAt: Date
  id: string
  refreshTokenHash: string
  revokedAt: Date | null
  user: IdentityUser
}

export interface IdentityRepository {
  createCustomer(input: { birthDate: Date; email: string; name: string; passwordHash: string; phone: string }): Promise<IdentityUser | null>
  createSession(input: { expiresAt: Date; id: string; refreshTokenHash: string; userId: string }): Promise<void>
  findSession(id: string): Promise<IdentitySession | null>
  findUserByEmail(email: string): Promise<IdentityUser | null>
  revokeSession(id: string, revokedAt: Date): Promise<void>
  rotateSession(input: { expiresAt: Date; id: string; refreshTokenHash: string; now: Date }): Promise<boolean>
}

export interface SecretHasher {
  hash(value: string): Promise<string>
  verify(value: string, encodedHash: string): Promise<boolean>
}

export interface AccessTokenIssuer {
  issue(input: { role: IdentityRole; userId: string }): Promise<string>
}

export interface AccessTokenVerifier {
  verify(value: string): Promise<{ role: IdentityRole; userId: string }>
}
