import { randomBytes } from 'node:crypto'
import { TOTP } from 'otpauth'
import { describe, expect, it } from 'vitest'
import { AesGcmSecretCipher } from './AesGcmSecretCipher.js'
import { TotpAuthenticator } from './TotpAuthenticator.js'

describe('TotpAuthenticator', () => {
  it('gera URI TOTP e aceita somente código válido', () => {
    const cipher = new AesGcmSecretCipher(randomBytes(32).toString('base64'))
    const authenticator = new TotpAuthenticator(cipher)
    const setup = authenticator.createSetup('admin@msgriffe.com.br')
    expect(setup.uri).toMatch(/^otpauth:\/\/totp\/msGriffe:/)
    const knownSecret = 'JBSWY3DPEHPK3PXP'
    expect(authenticator.verify(cipher.encrypt(knownSecret), new TOTP({ secret: knownSecret }).generate())).toBe(true)
    expect(authenticator.verify(setup.secretCiphertext, 'abcdef')).toBe(false)
  })
})
