# Segurança, provedores e operação

## B1 — identidade planejada

- access token curto; frontend o mantém apenas em memória;
- refresh token em cookie `HttpOnly`, com `Secure` e `SameSite` adequados;
- expiração e revogação de sessões;
- verificação de e-mail e recuperação de senha;
- proteção contra enumeração e rate limiting;
- CSRF para mutações autenticadas por cookies;
- TOTP para administração, prioritariamente `SUPERADMIN`, e nova autenticação para ações críticas.

Use bibliotecas consolidadas e primitivas de plataforma; não implementar criptografia própria.

## Provedores

- Brevo Free: verificação de conta, recuperação de senha e mensagens essenciais. Usar adapter; secretos e remetente validado ficam no ambiente. Resend não pertence ao projeto.
- Mercado Pago: fase B4; SDK e webhook ficam em adapter. Validar assinatura, normalizar payload e garantir idempotência.
- Cloudflare R2: mídia de produtos e cópia externa de backup. Persistir `objectKey` quando suficiente.
- Railway: API e PostgreSQL em staging/produção separados, com Railway Secrets. Não versionar credenciais.
- Sentry, Better Stack e Telegram: planejados; não assumir que estão ativos.

## Operação e backup

- Backup diário via `pg_dump`, backup do provedor mais cópia independente no R2.
- Criptografar antes do envio e proteger em repouso; reter e limpar automaticamente após 30 dias.
- Restore mensal inicial em banco isolado; RPO até 24 h e RTO até 4 h.
- A automação de backup, alertas, rollback e go-live pertencem à B7.

Evitar dados sensíveis em respostas e logs. Nunca comprometer segredos, tokens, CPF, endereço, cartão ou payload completo de webhook.
