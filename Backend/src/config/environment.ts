import { z } from 'zod'

const localHosts = new Set(['127.0.0.1', 'localhost'])

export interface Environment {
  accessTokenSecret: string
  accessTokenTtlSeconds: number
  accountUrl: string
  brevoApiKey?: string
  brevoSenderEmail?: string
  corsAllowedOrigins: string[]
  host: string
  mediaPublicBaseUrl: string
  nodeEnvironment: 'development' | 'production' | 'test'
  port: number
  refreshSessionTtlDays: number
  sessionCookieSameSite: 'lax' | 'none' | 'strict'
  sessionCookieSecure: boolean
  totpEncryptionKey?: string
}

function parseOrigin(value: string) {
  const url = new URL(value)
  const isLocalHttp = url.protocol === 'http:' && localHosts.has(url.hostname)

  if ((url.protocol !== 'https:' && !isLocalHttp) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('CORS_ALLOWED_ORIGINS contém origem inválida.')
  }

  return url.origin
}

function parseMediaPublicBaseUrl(value: string) {
  const url = new URL(value)
  const isLocalHttp = url.protocol === 'http:' && localHosts.has(url.hostname)

  if ((url.protocol !== 'https:' && !isLocalHttp) || url.username || url.password || url.search || url.hash) {
    throw new Error('MEDIA_PUBLIC_BASE_URL contém URL inválida.')
  }

  return url.toString().replace(/\/+$/, '')
}

export function readEnvironment(input: NodeJS.ProcessEnv): Environment {
  const parsed = z.object({
    ACCESS_TOKEN_SECRET: z.string().min(32),
    ACCOUNT_URL: z.string().url().optional(),
    BREVO_API_KEY: z.string().min(1).optional(),
    BREVO_SENDER_EMAIL: z.string().email().optional(),
    ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().min(60).max(3600).default(900),
    CORS_ALLOWED_ORIGINS: z.string().min(1),
    HOST: z.string().min(1).default('127.0.0.1'),
    MEDIA_PUBLIC_BASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    REFRESH_SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(14),
    SESSION_COOKIE_SAME_SITE: z.enum(['lax', 'none', 'strict']).default('lax'),
    SESSION_COOKIE_SECURE: z.enum(['true', 'false']).optional(),
    TOTP_ENCRYPTION_KEY: z.string().optional(),
  }).parse(input)
  const corsAllowedOrigins = [...new Set(parsed.CORS_ALLOWED_ORIGINS.split(',').map((origin) => parseOrigin(origin.trim())))]
  const sessionCookieSecure = parsed.SESSION_COOKIE_SECURE ? parsed.SESSION_COOKIE_SECURE === 'true' : parsed.NODE_ENV === 'production'

  if (parsed.NODE_ENV === 'production' && corsAllowedOrigins.some((origin) => origin.startsWith('http://'))) {
    throw new Error('Produção exige origens CORS HTTPS.')
  }
  if ((parsed.NODE_ENV === 'production' && !sessionCookieSecure) || (parsed.SESSION_COOKIE_SAME_SITE === 'none' && !sessionCookieSecure)) {
    throw new Error('Cookie de sessão exige Secure neste ambiente.')
  }
  if (Boolean(parsed.BREVO_API_KEY) !== Boolean(parsed.BREVO_SENDER_EMAIL)) throw new Error('BREVO_API_KEY e BREVO_SENDER_EMAIL devem ser configurados juntos.')
  if (parsed.TOTP_ENCRYPTION_KEY && Buffer.from(parsed.TOTP_ENCRYPTION_KEY, 'base64').length !== 32) throw new Error('TOTP_ENCRYPTION_KEY deve conter 32 bytes em base64.')

  return {
    accessTokenSecret: parsed.ACCESS_TOKEN_SECRET,
    accountUrl: parsed.ACCOUNT_URL ? parseOrigin(parsed.ACCOUNT_URL) : corsAllowedOrigins[0]!,
    brevoApiKey: parsed.BREVO_API_KEY,
    brevoSenderEmail: parsed.BREVO_SENDER_EMAIL,
    accessTokenTtlSeconds: parsed.ACCESS_TOKEN_TTL_SECONDS,
    corsAllowedOrigins,
    host: parsed.HOST,
    mediaPublicBaseUrl: parseMediaPublicBaseUrl(parsed.MEDIA_PUBLIC_BASE_URL),
    nodeEnvironment: parsed.NODE_ENV,
    port: parsed.PORT,
    refreshSessionTtlDays: parsed.REFRESH_SESSION_TTL_DAYS,
    sessionCookieSameSite: parsed.SESSION_COOKIE_SAME_SITE,
    sessionCookieSecure,
    totpEncryptionKey: parsed.TOTP_ENCRYPTION_KEY,
  }
}
