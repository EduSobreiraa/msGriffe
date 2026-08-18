export type DataSource = 'api' | 'demo'

export interface RuntimeConfig {
  apiBaseUrl: string | null
  dataSource: DataSource
}

type Environment = Record<string, string | boolean | undefined>

function readApiBaseUrl(value: string | boolean | undefined): string | null {
  if (!value) return null
  if (typeof value !== 'string') throw new Error('VITE_API_BASE_URL deve ser texto.')

  const url = new URL(value)
  const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)

  if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password || url.search || url.hash) {
    throw new Error('VITE_API_BASE_URL deve usar HTTPS, sem credenciais, busca ou fragmento.')
  }

  return url.href.replace(/\/$/, '')
}

export function readRuntimeConfig(environment: Environment): RuntimeConfig {
  const rawDataSource = environment.VITE_DATA_SOURCE ?? 'demo'

  if (rawDataSource !== 'api' && rawDataSource !== 'demo') {
    throw new Error('VITE_DATA_SOURCE deve ser "demo" ou "api".')
  }

  const apiBaseUrl = readApiBaseUrl(environment.VITE_API_BASE_URL)

  if (rawDataSource === 'api' && !apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL é obrigatória quando VITE_DATA_SOURCE=api.')
  }

  return { apiBaseUrl, dataSource: rawDataSource }
}

export const runtimeConfig = readRuntimeConfig(import.meta.env)
