import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import type { SecretHasher } from '../../application/identityContracts.js'

const keyLength = 64
const parameters = { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }

function derive(value: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(value, salt, keyLength, parameters, (error, derived) => error ? reject(error) : resolve(Buffer.from(derived)))
  })
}

export class ScryptSecretHasher implements SecretHasher {
  async hash(value: string): Promise<string> {
    const salt = randomBytes(16)
    const derived = await derive(value, salt)
    return `scrypt$v1$${salt.toString('base64url')}$${derived.toString('base64url')}`
  }

  async verify(value: string, encodedHash: string): Promise<boolean> {
    const [algorithm, version, saltValue, hashValue] = encodedHash.split('$')
    if (algorithm !== 'scrypt' || version !== 'v1' || !saltValue || !hashValue) return false
    try {
      const expected = Buffer.from(hashValue, 'base64url')
      const derived = await derive(value, Buffer.from(saltValue, 'base64url'))
      return expected.length === derived.length && timingSafeEqual(expected, derived)
    } catch {
      return false
    }
  }
}
