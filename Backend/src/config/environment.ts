import { z } from 'zod'

const localHosts = new Set(['127.0.0.1', 'localhost'])

export interface Environment {
  corsAllowedOrigins: string[]
  host: string
  nodeEnvironment: 'development' | 'production' | 'test'
  port: number
}

function parseOrigin(value: string) {
  const url = new URL(value)
  const isLocalHttp = url.protocol === 'http:' && localHosts.has(url.hostname)

  if ((url.protocol !== 'https:' && !isLocalHttp) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('CORS_ALLOWED_ORIGINS contém origem inválida.')
  }

  return url.origin
}

export function readEnvironment(input: NodeJS.ProcessEnv): Environment {
  const parsed = z.object({
    CORS_ALLOWED_ORIGINS: z.string().min(1),
    HOST: z.string().min(1).default('127.0.0.1'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  }).parse(input)
  const corsAllowedOrigins = [...new Set(parsed.CORS_ALLOWED_ORIGINS.split(',').map((origin) => parseOrigin(origin.trim())))]

  if (parsed.NODE_ENV === 'production' && corsAllowedOrigins.some((origin) => origin.startsWith('http://'))) {
    throw new Error('Produção exige origens CORS HTTPS.')
  }

  return {
    corsAllowedOrigins,
    host: parsed.HOST,
    nodeEnvironment: parsed.NODE_ENV,
    port: parsed.PORT,
  }
}
