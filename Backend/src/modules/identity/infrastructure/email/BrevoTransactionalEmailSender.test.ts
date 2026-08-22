import { describe, expect, it, vi } from 'vitest'
import { BrevoTransactionalEmailSender } from './BrevoTransactionalEmailSender.js'

describe('BrevoTransactionalEmailSender', () => {
  it('envia somente conteúdo transacional e falha sem expor resposta do provedor', async () => {
    const fetcher = vi.fn(async () => new Response('', { status: 201 }))
    const sender = new BrevoTransactionalEmailSender('api-key', 'seguranca@msgriffe.com.br', fetcher)
    await sender.send({ html: '<p>Mensagem</p>', subject: 'Assunto', to: 'cliente@exemplo.com' })
    expect(fetcher).toHaveBeenCalledWith('https://api.brevo.com/v3/smtp/email', expect.objectContaining({ headers: { 'api-key': 'api-key', 'content-type': 'application/json' }, method: 'POST' }))
    await expect(new BrevoTransactionalEmailSender('api-key', 'seguranca@msgriffe.com.br', async () => new Response('', { status: 500 })).send({ html: '', subject: '', to: 'cliente@exemplo.com' })).rejects.toMatchObject({ code: 'EMAIL_UNAVAILABLE', statusCode: 503 })
  })
})
