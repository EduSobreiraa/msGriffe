import { ApplicationError } from '../../../../shared/errors/ApplicationError.js'
import type { TransactionalEmailSender } from '../../application/identityContracts.js'

export class BrevoTransactionalEmailSender implements TransactionalEmailSender {
  constructor(private readonly apiKey: string, private readonly senderEmail: string, private readonly fetcher: typeof fetch = fetch) {}

  async send(input: { html: string; subject: string; to: string }): Promise<void> {
    const response = await this.fetcher('https://api.brevo.com/v3/smtp/email', {
      body: JSON.stringify({ htmlContent: input.html, sender: { email: this.senderEmail }, subject: input.subject, to: [{ email: input.to }] }),
      headers: { 'api-key': this.apiKey, 'content-type': 'application/json' },
      method: 'POST',
    })
    if (!response.ok) throw new ApplicationError('EMAIL_UNAVAILABLE', 503)
  }
}
