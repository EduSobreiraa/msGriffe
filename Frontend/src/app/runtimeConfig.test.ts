import { describe, expect, it } from 'vitest'
import { readRuntimeConfig } from './runtimeConfig'

describe('readRuntimeConfig', () => {
  it('mantém fonte demonstrativa como padrão', () => {
    expect(readRuntimeConfig({})).toEqual({ apiBaseUrl: null, dataSource: 'demo' })
  })

  it('aceita API HTTPS pública e localhost no desenvolvimento', () => {
    expect(readRuntimeConfig({ VITE_API_BASE_URL: 'https://api.msgriffe.com/' })).toEqual({
      apiBaseUrl: 'https://api.msgriffe.com',
      dataSource: 'demo',
    })
    expect(readRuntimeConfig({ VITE_API_BASE_URL: 'http://localhost:3000', VITE_DATA_SOURCE: 'api' })).toEqual({
      apiBaseUrl: 'http://localhost:3000',
      dataSource: 'api',
    })
  })

  it('rejeita fonte e origem inseguras', () => {
    expect(() => readRuntimeConfig({ VITE_DATA_SOURCE: 'mock' })).toThrow('VITE_DATA_SOURCE')
    expect(() => readRuntimeConfig({ VITE_DATA_SOURCE: 'api' })).toThrow('VITE_API_BASE_URL')
    expect(() => readRuntimeConfig({ VITE_API_BASE_URL: 'http://api.msgriffe.com' })).toThrow('HTTPS')
    expect(() => readRuntimeConfig({ VITE_API_BASE_URL: 'https://user:password@api.msgriffe.com' })).toThrow('HTTPS')
  })
})
