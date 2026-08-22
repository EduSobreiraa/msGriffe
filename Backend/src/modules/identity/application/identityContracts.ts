export type IdentityRole = 'CUSTOMER' | 'SELLER' | 'SUPERADMIN'

export interface IdentityUser {
  email: string
  emailVerifiedAt?: Date | null
  id: string
  isActive: boolean
  passwordHash: string
  role: IdentityRole
  totpEnabledAt?: Date | null
  totpPendingSecretCiphertext?: string | null
  totpSecretCiphertext?: string | null
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
  createAccountToken(input: { expiresAt: Date; id: string; purpose: AccountTokenPurpose; tokenHash: string; userId: string }): Promise<void>
  consumeAccountToken(id: string, consumedAt: Date): Promise<boolean>
  findAccountToken(id: string): Promise<IdentityAccountToken | null>
  findSession(id: string): Promise<IdentitySession | null>
  findUserById(id: string): Promise<IdentityUser | null>
  findUserByEmail(email: string): Promise<IdentityUser | null>
  revokeSession(id: string, revokedAt: Date): Promise<void>
  revokeUserSessions(userId: string, revokedAt: Date): Promise<void>
  rotateSession(input: { expiresAt: Date; id: string; refreshTokenHash: string; now: Date }): Promise<boolean>
  setEmailVerified(userId: string, verifiedAt: Date): Promise<void>
  setPasswordAndRevokeSessions(input: { passwordHash: string; revokedAt: Date; userId: string }): Promise<void>
  startTotpSetup(input: { secretCiphertext: string; userId: string }): Promise<void>
  enableTotp(input: { enabledAt: Date; userId: string }): Promise<boolean>
}

export type AccountTokenPurpose = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'

export interface IdentityAccountToken {
  consumedAt: Date | null
  expiresAt: Date
  id: string
  purpose: AccountTokenPurpose
  tokenHash: string
  user: IdentityUser
}

export interface TransactionalEmailSender {
  send(input: { html: string; subject: string; to: string }): Promise<void>
}

export interface TwoFactorAuthenticator {
  createSetup(email: string): { secretCiphertext: string; uri: string }
  verify(secretCiphertext: string, code: string): boolean
}

export interface SecurityAuditRecorder {
  record(input: { action: string; actorId: string }): Promise<void>
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
