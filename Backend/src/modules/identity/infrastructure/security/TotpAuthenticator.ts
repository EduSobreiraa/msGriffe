import { TOTP } from 'otpauth'
import type { TwoFactorAuthenticator } from '../../application/identityContracts.js'
import { AesGcmSecretCipher } from './AesGcmSecretCipher.js'

export class TotpAuthenticator implements TwoFactorAuthenticator {
  constructor(private readonly cipher: AesGcmSecretCipher) {}

  createSetup(email: string) {
    const totp = new TOTP({ algorithm: 'SHA1', digits: 6, issuer: 'msGriffe', label: email, period: 30 })
    return { secretCiphertext: this.cipher.encrypt(totp.secret.base32), uri: totp.toString() }
  }

  verify(secretCiphertext: string, code: string): boolean {
    if (!/^\d{6}$/.test(code)) return false
    const totp = new TOTP({ algorithm: 'SHA1', digits: 6, period: 30, secret: this.cipher.decrypt(secretCiphertext) })
    return totp.validate({ token: code, window: 1 }) !== null
  }
}
