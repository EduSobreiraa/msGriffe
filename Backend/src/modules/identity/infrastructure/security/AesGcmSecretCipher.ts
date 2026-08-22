import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { ApplicationError } from '../../../../shared/errors/ApplicationError.js'

export class AesGcmSecretCipher {
  private readonly key: Buffer

  constructor(key: string) {
    this.key = Buffer.from(key, 'base64')
    if (this.key.length !== 32) throw new Error('Chave TOTP inválida.')
  }

  encrypt(value: string): string {
    const iv = randomBytes(12)
    const cipher = createCipheriv('aes-256-gcm', this.key, iv)
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
    return `v1.${iv.toString('base64url')}.${encrypted.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}`
  }

  decrypt(value: string): string {
    try {
      const [version, encodedIv, encodedCiphertext, encodedTag] = value.split('.')
      if (version !== 'v1' || !encodedIv || !encodedCiphertext || !encodedTag) throw new Error('Formato inválido.')
      const decipher = createDecipheriv('aes-256-gcm', this.key, Buffer.from(encodedIv, 'base64url'))
      decipher.setAuthTag(Buffer.from(encodedTag, 'base64url'))
      return Buffer.concat([decipher.update(Buffer.from(encodedCiphertext, 'base64url')), decipher.final()]).toString('utf8')
    } catch {
      throw new ApplicationError('TWO_FACTOR_UNAVAILABLE', 503)
    }
  }
}
