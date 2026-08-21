import { z } from 'zod'

const localHosts = new Set(['127.0.0.1', 'localhost'])

export interface Environment {
  accessTokenSecret: string
  accessTokenTtlSeconds: number
  corsAllowedOrigins: string[]
  host: string
  nodeEnvironment: 'development' | 'production' | 'test'
  port: number
  refreshSessionTtlDays: number
  sessionCookieSameSite: 'lax' | 'none' | 'strict'
  sessionCookieSecure: boolean
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
    ACCESS_TOKEN_SECRET: z.string().min(32),
    ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().min(60).max(3600).default(900),
    CORS_ALLOWED_ORIGINS: z.string().min(1),
    HOST: z.string().min(1).default('127.0.0.1'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    REFRESH_SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(14),
    SESSION_COOKIE_SAME_SITE: z.enum(['lax', 'none', 'strict']).default('lax'),
    SESSION_COOKIE_SECURE: z.enum(['true', 'false']).optional(),
  }).parse(input)
  const corsAllowedOrigins = [...new Set(parsed.CORS_ALLOWED_ORIGINS.split(',').map((origin) => parseOrigin(origin.trim())))]
  const sessionCookieSecure = parsed.SESSION_COOKIE_SECURE ? parsed.SESSION_COOKIE_SECURE === 'true' : parsed.NODE_ENV === 'production'

  if (parsed.NODE_ENV === 'production' && corsAllowedOrigins.some((origin) => origin.startsWith('http://'))) {
    throw new Error('Produção exige origens CORS HTTPS.')
  }
  if ((parsed.NODE_ENV === 'production' && !sessionCookieSecure) || (parsed.SESSION_COOKIE_SAME_SITE === 'none' && !sessionCookieSecure)) {
    throw new Error('Cookie de sessão exige Secure neste ambiente.')
  }

  return {
    accessTokenSecret: parsed.ACCESS_TOKEN_SECRET,
    accessTokenTtlSeconds: parsed.ACCESS_TOKEN_TTL_SECONDS,
    corsAllowedOrigins,
    host: parsed.HOST,
    nodeEnvironment: parsed.NODE_ENV,
    port: parsed.PORT,
    refreshSessionTtlDays: parsed.REFRESH_SESSION_TTL_DAYS,
    sessionCookieSameSite: parsed.SESSION_COOKIE_SAME_SITE,
    sessionCookieSecure,
  }
}
