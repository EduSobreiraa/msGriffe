import { describe, expect, it } from 'vitest'
import { ApplicationError } from '../../../shared/errors/ApplicationError.js'
import { ScryptSecretHasher } from '../infrastructure/security/ScryptSecretHasher.js'
import { IdentityService } from './IdentityService.js'
import type { AccessTokenIssuer, IdentityAccountToken, IdentityRepository, IdentitySession, IdentityUser } from './identityContracts.js'

class InMemoryIdentityRepository implements IdentityRepository {
  readonly sessions = new Map<string, IdentitySession>()
  readonly tokens = new Map<string, IdentityAccountToken>()
  readonly users = new Map<string, IdentityUser>()

  async createCustomer(input: { birthDate: Date; email: string; name: string; passwordHash: string; phone: string }) {
    if (this.users.has(input.email)) return null
    const user = { email: input.email, id: `user-${this.users.size + 1}`, isActive: true, passwordHash: input.passwordHash, role: 'CUSTOMER' as const }
    this.users.set(user.email, user)
    return user
  }

  async createSession(input: { expiresAt: Date; id: string; refreshTokenHash: string; userId: string }) {
    const user = [...this.users.values()].find((candidate) => candidate.id === input.userId)
    if (!user) throw new Error('Usuário ausente no teste.')
    this.sessions.set(input.id, { ...input, revokedAt: null, user })
  }

  async createAccountToken(input: { expiresAt: Date; id: string; purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'; tokenHash: string; userId: string }) {
    const user = [...this.users.values()].find((candidate) => candidate.id === input.userId)
    if (!user) throw new Error('Usuário ausente no teste.')
    this.tokens.set(input.id, { ...input, consumedAt: null, user })
  }

  async consumeAccountToken(id: string, consumedAt: Date) {
    const token = this.tokens.get(id)
    if (!token || token.consumedAt) return false
    token.consumedAt = consumedAt
    return true
  }

  async findAccountToken(id: string) { return this.tokens.get(id) ?? null }

  async findSession(id: string) {
    return this.sessions.get(id) ?? null
  }

  async findUserByEmail(email: string) {
    return this.users.get(email) ?? null
  }

  async revokeSession(id: string, revokedAt: Date) {
    const session = this.sessions.get(id)
    if (session && !session.revokedAt) session.revokedAt = revokedAt
  }

  async revokeUserSessions(userId: string, revokedAt: Date) {
    for (const session of this.sessions.values()) if (session.user.id === userId && !session.revokedAt) session.revokedAt = revokedAt
  }

  async rotateSession(input: { expiresAt: Date; id: string; refreshTokenHash: string; now: Date }) {
    const session = this.sessions.get(input.id)
    if (!session || session.revokedAt || session.expiresAt <= input.now) return false
    session.expiresAt = input.expiresAt
    session.refreshTokenHash = input.refreshTokenHash
    return true
  }

  async setEmailVerified(userId: string, verifiedAt: Date) {
    const user = [...this.users.values()].find((candidate) => candidate.id === userId)
    if (user) user.emailVerifiedAt = verifiedAt
  }

  async setPasswordAndRevokeSessions(input: { passwordHash: string; revokedAt: Date; userId: string }) {
    const user = [...this.users.values()].find((candidate) => candidate.id === input.userId)
    if (user) user.passwordHash = input.passwordHash
    await this.revokeUserSessions(input.userId, input.revokedAt)
  }
}

const accessTokenIssuer: AccessTokenIssuer = { issue: async ({ userId }) => `access-${userId}` }

function createService(repository = new InMemoryIdentityRepository(), sent: Array<{ html: string; subject: string; to: string }> = []) {
  return { repository, sent, service: new IdentityService(repository, new ScryptSecretHasher(), accessTokenIssuer, 14, { send: async (input) => { sent.push(input) } }, 'https://staging.msgriffe.com.br') }
}

describe('IdentityService', () => {
  it('cadastra CUSTOMER, rotaciona refresh token e revoga logout', async () => {
    const { repository, service } = createService()
    const registered = await service.register({ birthDate: new Date('2000-01-01'), email: 'cliente@exemplo.com', name: 'Cliente', password: 'senha-segura-123', phone: '71999999999' })
    const refreshed = await service.refresh(registered.refreshToken)

    expect(registered.accessToken).toBe('access-user-1')
    await expect(service.refresh(registered.refreshToken)).rejects.toMatchObject({ code: 'UNAUTHENTICATED', statusCode: 401 })

    await service.logout(refreshed.refreshToken)
    await expect(service.refresh(refreshed.refreshToken)).rejects.toMatchObject({ code: 'UNAUTHENTICATED', statusCode: 401 })
    expect(repository.users.get('cliente@exemplo.com')?.role).toBe('CUSTOMER')
  })

  it('rejeita login com senha inválida sem expor causa', async () => {
    const { service } = createService()
    await service.register({ birthDate: new Date('2000-01-01'), email: 'cliente@exemplo.com', name: 'Cliente', password: 'senha-segura-123', phone: '71999999999' })

    await expect(service.login({ email: 'cliente@exemplo.com', password: 'senha-incorreta-123' })).rejects.toBeInstanceOf(ApplicationError)
    await expect(service.login({ email: 'cliente@exemplo.com', password: 'senha-incorreta-123' })).rejects.toMatchObject({ code: 'UNAUTHENTICATED', statusCode: 401 })
    await service.logout(undefined)
    await expect(new ScryptSecretHasher().verify('senha-segura-123', 'hash-inválido')).resolves.toBe(false)
  })

  it('emite tokens temporários opacos, confirma e revoga sessões ao redefinir senha', async () => {
    const { repository, sent, service } = createService()
    const registered = await service.register({ birthDate: new Date('2000-01-01'), email: 'cliente@exemplo.com', name: 'Cliente', password: 'senha-segura-123', phone: '71999999999' })
    await service.requestEmailVerification('cliente@exemplo.com')
    const verificationToken = new URL(sent[0]!.html.match(/href="([^"]+)/)![1]!).searchParams.get('token')!
    await service.confirmEmailVerification(verificationToken)
    expect(repository.users.get('cliente@exemplo.com')?.emailVerifiedAt).toBeInstanceOf(Date)
    await expect(service.confirmEmailVerification(verificationToken)).rejects.toMatchObject({ code: 'INVALID_TOKEN' })

    await service.requestPasswordRecovery('cliente@exemplo.com')
    const recoveryToken = new URL(sent[1]!.html.match(/href="([^"]+)/)![1]!).searchParams.get('token')!
    await service.confirmPasswordRecovery({ password: 'nova-senha-segura-123', token: recoveryToken })
    await expect(service.refresh(registered.refreshToken)).rejects.toMatchObject({ code: 'UNAUTHENTICATED' })
    await service.login({ email: 'cliente@exemplo.com', password: 'nova-senha-segura-123' })
  })
})
