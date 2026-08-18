import { describe, expect, it } from 'vitest'
import { apiErrorFromStatus } from './ApiError'

describe('apiErrorFromStatus', () => {
  it.each([
    [401, 'UNAUTHORIZED'], [403, 'FORBIDDEN'], [404, 'NOT_FOUND'],
    [400, 'VALIDATION'], [409, 'VALIDATION'], [422, 'VALIDATION'],
    [408, 'UNAVAILABLE'], [429, 'UNAVAILABLE'], [500, 'UNAVAILABLE'], [418, 'UNEXPECTED'],
  ] as const)('normaliza HTTP %i como %s', (status, code) => {
    expect(apiErrorFromStatus(status)).toMatchObject({ code, status })
  })
})
