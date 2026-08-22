import type { PrismaClient } from '@prisma/client'
import type { SecurityAuditRecorder } from '../../application/identityContracts.js'

export class PrismaSecurityAuditRecorder implements SecurityAuditRecorder {
  constructor(private readonly prisma: PrismaClient) {}

  async record(input: { action: string; actorId: string }): Promise<void> {
    await this.prisma.securityAuditEvent.create({ data: input })
  }
}
