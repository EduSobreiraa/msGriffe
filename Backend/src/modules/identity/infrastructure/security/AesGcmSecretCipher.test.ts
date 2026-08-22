import { randomBytes } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { AesGcmSecretCipher } from './AesGcmSecretCipher.js'

describe('AesGcmSecretCipher', () => {
  it('protege segredo TOTP em repouso e detecta alteração', () => {
    const cipher = new AesGcmSecretCipher(randomBytes(32).toString('base64'))
    const protectedValue = cipher.encrypt('totp-secret')
    expect(protectedValue).not.toContain('totp-secret')
    expect(cipher.decrypt(protectedValue)).toBe('totp-secret')
    expect(() => cipher.decrypt(`${protectedValue}x`)).toThrow('TWO_FACTOR_UNAVAILABLE')
  })
})
