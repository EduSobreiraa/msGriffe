import { Prisma, type PrismaClient } from '@prisma/client'
import type { IdentityRepository, IdentitySession, IdentityUser } from '../../application/identityContracts.js'

function toUser(user: { email: string; id: string; isActive: boolean; passwordHash: string; role: 'CUSTOMER' | 'SELLER' | 'SUPERADMIN'; totpEnabledAt?: Date | null; totpPendingSecretCiphertext?: string | null; totpSecretCiphertext?: string | null }): IdentityUser {
  return user
}

export class PrismaIdentityRepository implements IdentityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createCustomer(input: { birthDate: Date; email: string; name: string; passwordHash: string; phone: string }): Promise<IdentityUser | null> {
    try {
      return toUser(await this.prisma.user.create({ data: { ...input, role: 'CUSTOMER' } }))
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return null
      throw error
    }
  }

  async createSession(input: { expiresAt: Date; id: string; refreshTokenHash: string; userId: string }): Promise<void> {
    await this.prisma.session.create({ data: input })
  }

  async createAccountToken(input: { expiresAt: Date; id: string; purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'; tokenHash: string; userId: string }): Promise<void> {
    await this.prisma.accountToken.create({ data: input })
  }

  async consumeAccountToken(id: string, consumedAt: Date): Promise<boolean> {
    const result = await this.prisma.accountToken.updateMany({ data: { consumedAt }, where: { consumedAt: null, id } })
    return result.count === 1
  }

  async findAccountToken(id: string) {
    const accountToken = await this.prisma.accountToken.findUnique({
      where: { id },
      include: { user: { select: { email: true, id: true, isActive: true, passwordHash: true, role: true, totpEnabledAt: true, totpPendingSecretCiphertext: true, totpSecretCiphertext: true } } },
    })
    return accountToken ? { ...accountToken, purpose: accountToken.purpose, user: toUser(accountToken.user) } : null
  }

  async findSession(id: string): Promise<IdentitySession | null> {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { user: { select: { email: true, id: true, isActive: true, passwordHash: true, role: true, totpEnabledAt: true, totpPendingSecretCiphertext: true, totpSecretCiphertext: true } } },
    })
    return session ? { ...session, user: toUser(session.user) } : null
  }

  async findUserByEmail(email: string): Promise<IdentityUser | null> {
    const user = await this.prisma.user.findUnique({ where: { email }, select: { email: true, id: true, isActive: true, passwordHash: true, role: true, totpEnabledAt: true, totpPendingSecretCiphertext: true, totpSecretCiphertext: true } })
    return user ? toUser(user) : null
  }

  async findUserById(id: string): Promise<IdentityUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { email: true, id: true, isActive: true, passwordHash: true, role: true, totpEnabledAt: true, totpPendingSecretCiphertext: true, totpSecretCiphertext: true } })
    return user ? toUser(user) : null
  }

  async revokeSession(id: string, revokedAt: Date): Promise<void> {
    await this.prisma.session.updateMany({ data: { revokedAt }, where: { id, revokedAt: null } })
  }

  async revokeUserSessions(userId: string, revokedAt: Date): Promise<void> {
    await this.prisma.session.updateMany({ data: { revokedAt }, where: { revokedAt: null, userId } })
  }

  async rotateSession(input: { expiresAt: Date; id: string; refreshTokenHash: string; now: Date }): Promise<boolean> {
    const result = await this.prisma.session.updateMany({
      data: { expiresAt: input.expiresAt, refreshTokenHash: input.refreshTokenHash },
      where: { expiresAt: { gt: input.now }, id: input.id, revokedAt: null },
    })
    return result.count === 1
  }

  async setEmailVerified(userId: string, verifiedAt: Date): Promise<void> {
    await this.prisma.user.update({ data: { emailVerifiedAt: verifiedAt }, where: { id: userId } })
  }

  async setPasswordAndRevokeSessions(input: { passwordHash: string; revokedAt: Date; userId: string }): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.user.update({ data: { passwordHash: input.passwordHash }, where: { id: input.userId } }),
      this.prisma.session.updateMany({ data: { revokedAt: input.revokedAt }, where: { revokedAt: null, userId: input.userId } }),
    ])
  }

  async startTotpSetup(input: { secretCiphertext: string; userId: string }): Promise<void> {
    await this.prisma.user.update({ data: { totpPendingSecretCiphertext: input.secretCiphertext }, where: { id: input.userId } })
  }

  async enableTotp(input: { enabledAt: Date; userId: string }): Promise<boolean> {
    return this.prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({ where: { id: input.userId }, select: { totpPendingSecretCiphertext: true } })
      if (!user?.totpPendingSecretCiphertext) return false
      await transaction.user.update({ data: { totpEnabledAt: input.enabledAt, totpPendingSecretCiphertext: null, totpSecretCiphertext: user.totpPendingSecretCiphertext }, where: { id: input.userId } })
      return true
    })
  }
}
