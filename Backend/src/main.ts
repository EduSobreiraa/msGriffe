import { PrismaClient } from '@prisma/client'
import { createApplication } from './app/createApplication.js'
import { readEnvironment } from './config/environment.js'
import { IdentityService } from './modules/identity/application/IdentityService.js'
import { PrismaIdentityRepository } from './modules/identity/infrastructure/persistence/PrismaIdentityRepository.js'
import { ScryptSecretHasher } from './modules/identity/infrastructure/security/ScryptSecretHasher.js'
import { BrevoTransactionalEmailSender } from './modules/identity/infrastructure/email/BrevoTransactionalEmailSender.js'
import { PrismaSecurityAuditRecorder } from './modules/identity/infrastructure/persistence/PrismaSecurityAuditRecorder.js'
import { AesGcmSecretCipher } from './modules/identity/infrastructure/security/AesGcmSecretCipher.js'
import { JoseAccessTokenIssuer } from './modules/identity/infrastructure/tokens/JoseAccessTokenIssuer.js'
import { TotpAuthenticator } from './modules/identity/infrastructure/security/TotpAuthenticator.js'

const environment = readEnvironment(process.env)
const prisma = new PrismaClient()
const emailSender = environment.brevoApiKey && environment.brevoSenderEmail ? new BrevoTransactionalEmailSender(environment.brevoApiKey, environment.brevoSenderEmail) : undefined
const accessTokenIssuer = new JoseAccessTokenIssuer(environment.accessTokenSecret, environment.accessTokenTtlSeconds)
const twoFactorAuthenticator = environment.totpEncryptionKey ? new TotpAuthenticator(new AesGcmSecretCipher(environment.totpEncryptionKey)) : undefined
const identityService = new IdentityService(
  new PrismaIdentityRepository(prisma),
  new ScryptSecretHasher(),
  accessTokenIssuer,
  environment.refreshSessionTtlDays,
  emailSender,
  environment.accountUrl,
  twoFactorAuthenticator,
  new PrismaSecurityAuditRecorder(prisma),
)
const application = await createApplication(environment, { accessTokenVerifier: accessTokenIssuer, identityService })
application.addHook('onClose', async () => prisma.$disconnect())

const close = async () => {
  await application.close()
  process.exit(0)
}

process.once('SIGINT', close)
process.once('SIGTERM', close)

await application.listen({ host: environment.host, port: environment.port })
