import { randomBytes, randomUUID } from 'node:crypto'
import { ApplicationError } from '../../../shared/errors/ApplicationError.js'
import type { AccessTokenIssuer, AccountTokenPurpose, IdentityRepository, IdentityUser, SecretHasher, TransactionalEmailSender } from './identityContracts.js'

export interface AuthenticatedSession {
  accessToken: string
  refreshToken: string
}

export class IdentityService {
  constructor(
    private readonly repository: IdentityRepository,
    private readonly secretHasher: SecretHasher,
    private readonly accessTokenIssuer: AccessTokenIssuer,
    private readonly refreshSessionTtlDays: number,
    private readonly emailSender?: TransactionalEmailSender,
    private readonly accountUrl?: string,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async login(input: { email: string; password: string }): Promise<AuthenticatedSession> {
    const user = await this.repository.findUserByEmail(input.email)
    if (!user || !user.isActive || !(await this.secretHasher.verify(input.password, user.passwordHash))) throw new ApplicationError('UNAUTHENTICATED', 401)
    return this.createSession(user)
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    const parsed = this.parseRefreshToken(refreshToken)
    if (!parsed) return
    const session = await this.repository.findSession(parsed.sessionId)
    if (!session || !(await this.secretHasher.verify(parsed.secret, session.refreshTokenHash))) return
    await this.repository.revokeSession(session.id, this.now())
  }

  async refresh(refreshToken: string | undefined): Promise<AuthenticatedSession> {
    const parsed = this.parseRefreshToken(refreshToken)
    if (!parsed) throw new ApplicationError('UNAUTHENTICATED', 401)
    const session = await this.repository.findSession(parsed.sessionId)
    const now = this.now()
    if (!session || session.revokedAt || session.expiresAt <= now || !session.user.isActive || !(await this.secretHasher.verify(parsed.secret, session.refreshTokenHash))) {
      throw new ApplicationError('UNAUTHENTICATED', 401)
    }
    return this.rotateSession(session.user, session.id, now)
  }

  async register(input: { birthDate: Date; email: string; name: string; password: string; phone: string }): Promise<AuthenticatedSession> {
    const passwordHash = await this.secretHasher.hash(input.password)
    const user = await this.repository.createCustomer({ ...input, passwordHash })
    if (!user) throw new ApplicationError('ACCOUNT_UNAVAILABLE', 409)
    return this.createSession(user)
  }

  async requestEmailVerification(email: string): Promise<void> {
    const user = await this.repository.findUserByEmail(email)
    if (!user || user.emailVerifiedAt) return
    await this.sendAccountToken(user, 'EMAIL_VERIFICATION')
  }

  async confirmEmailVerification(token: string): Promise<void> {
    const accountToken = await this.requireValidAccountToken(token, 'EMAIL_VERIFICATION')
    if (!(await this.repository.consumeAccountToken(accountToken.id, this.now()))) throw new ApplicationError('INVALID_TOKEN', 400)
    await this.repository.setEmailVerified(accountToken.user.id, this.now())
  }

  async requestPasswordRecovery(email: string): Promise<void> {
    const user = await this.repository.findUserByEmail(email)
    if (!user || !user.isActive) return
    await this.sendAccountToken(user, 'PASSWORD_RESET')
  }

  async confirmPasswordRecovery(input: { password: string; token: string }): Promise<void> {
    const accountToken = await this.requireValidAccountToken(input.token, 'PASSWORD_RESET')
    const now = this.now()
    if (!(await this.repository.consumeAccountToken(accountToken.id, now))) throw new ApplicationError('INVALID_TOKEN', 400)
    await this.repository.setPasswordAndRevokeSessions({ passwordHash: await this.secretHasher.hash(input.password), revokedAt: now, userId: accountToken.user.id })
  }

  private async createSession(user: IdentityUser): Promise<AuthenticatedSession> {
    return this.rotateSession(user, randomUUID(), this.now(), true)
  }

  private async sendAccountToken(user: IdentityUser, purpose: AccountTokenPurpose): Promise<void> {
    if (!this.emailSender || !this.accountUrl) throw new ApplicationError('EMAIL_UNAVAILABLE', 503)
    const id = randomUUID()
    const secret = randomBytes(32).toString('base64url')
    const expiresAt = new Date(this.now().getTime() + 3_600_000)
    await this.repository.createAccountToken({ expiresAt, id, purpose, tokenHash: await this.secretHasher.hash(secret), userId: user.id })
    const token = `${id}.${secret}`
    const path = purpose === 'EMAIL_VERIFICATION' ? 'verificar-email' : 'recuperar-senha'
    const subject = purpose === 'EMAIL_VERIFICATION' ? 'Verifique seu e-mail' : 'Redefina sua senha'
    await this.emailSender.send({ html: `<p>Acesse <a href="${this.accountUrl}/${path}?token=${encodeURIComponent(token)}">msGriffe</a>. Este link expira em uma hora.</p>`, subject, to: user.email })
  }

  private async requireValidAccountToken(value: string, purpose: AccountTokenPurpose) {
    const parsed = this.parseRefreshToken(value)
    if (!parsed) throw new ApplicationError('INVALID_TOKEN', 400)
    const accountToken = await this.repository.findAccountToken(parsed.sessionId)
    if (!accountToken || accountToken.purpose !== purpose || accountToken.consumedAt || accountToken.expiresAt <= this.now() || !(await this.secretHasher.verify(parsed.secret, accountToken.tokenHash))) {
      throw new ApplicationError('INVALID_TOKEN', 400)
    }
    return accountToken
  }

  private parseRefreshToken(value: string | undefined) {
    if (!value) return null
    const parts = value.split('.')
    if (parts.length !== 2 || !parts[0] || !parts[1]) return null
    return { secret: parts[1], sessionId: parts[0] }
  }

  private async rotateSession(user: IdentityUser, sessionId: string, now: Date, isNew = false): Promise<AuthenticatedSession> {
    const secret = randomBytes(32).toString('base64url')
    const refreshTokenHash = await this.secretHasher.hash(secret)
    const expiresAt = new Date(now.getTime() + this.refreshSessionTtlDays * 86_400_000)
    if (isNew) await this.repository.createSession({ expiresAt, id: sessionId, refreshTokenHash, userId: user.id })
    else if (!(await this.repository.rotateSession({ expiresAt, id: sessionId, now, refreshTokenHash }))) throw new ApplicationError('UNAUTHENTICATED', 401)
    return { accessToken: await this.accessTokenIssuer.issue({ role: user.role, userId: user.id }), refreshToken: `${sessionId}.${secret}` }
  }
}
