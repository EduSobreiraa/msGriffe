import { Prisma, type PrismaClient } from '@prisma/client'
import type { IdentityRepository, IdentitySession, IdentityUser } from '../../application/identityContracts.js'

function toUser(user: { email: string; id: string; isActive: boolean; passwordHash: string; role: 'CUSTOMER' | 'SELLER' | 'SUPERADMIN' }): IdentityUser {
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

  async findSession(id: string): Promise<IdentitySession | null> {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { user: { select: { email: true, id: true, isActive: true, passwordHash: true, role: true } } },
    })
    return session ? { ...session, user: toUser(session.user) } : null
  }

  async findUserByEmail(email: string): Promise<IdentityUser | null> {
    const user = await this.prisma.user.findUnique({ where: { email }, select: { email: true, id: true, isActive: true, passwordHash: true, role: true } })
    return user ? toUser(user) : null
  }

  async revokeSession(id: string, revokedAt: Date): Promise<void> {
    await this.prisma.session.updateMany({ data: { revokedAt }, where: { id, revokedAt: null } })
  }

  async rotateSession(input: { expiresAt: Date; id: string; refreshTokenHash: string; now: Date }): Promise<boolean> {
    const result = await this.prisma.session.updateMany({
      data: { expiresAt: input.expiresAt, refreshTokenHash: input.refreshTokenHash },
      where: { expiresAt: { gt: input.now }, id: input.id, revokedAt: null },
    })
    return result.count === 1
  }
}
