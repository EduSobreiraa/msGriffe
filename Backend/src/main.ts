import { PrismaClient } from '@prisma/client'
import { createApplication } from './app/createApplication.js'
import { readEnvironment } from './config/environment.js'
import { IdentityService } from './modules/identity/application/IdentityService.js'
import { PrismaIdentityRepository } from './modules/identity/infrastructure/persistence/PrismaIdentityRepository.js'
import { ScryptSecretHasher } from './modules/identity/infrastructure/security/ScryptSecretHasher.js'
import { JoseAccessTokenIssuer } from './modules/identity/infrastructure/tokens/JoseAccessTokenIssuer.js'

const environment = readEnvironment(process.env)
const prisma = new PrismaClient()
const identityService = new IdentityService(
  new PrismaIdentityRepository(prisma),
  new ScryptSecretHasher(),
  new JoseAccessTokenIssuer(environment.accessTokenSecret, environment.accessTokenTtlSeconds),
  environment.refreshSessionTtlDays,
)
const application = await createApplication(environment, { identityService })
application.addHook('onClose', async () => prisma.$disconnect())

const close = async () => {
  await application.close()
  process.exit(0)
}

process.once('SIGINT', close)
process.once('SIGTERM', close)

await application.listen({ host: environment.host, port: environment.port })
