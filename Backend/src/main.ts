import { createApplication } from './app/createApplication.js'
import { readEnvironment } from './config/environment.js'

const environment = readEnvironment(process.env)
const application = await createApplication(environment)

const close = async () => {
  await application.close()
  process.exit(0)
}

process.once('SIGINT', close)
process.once('SIGTERM', close)

await application.listen({ host: environment.host, port: environment.port })
