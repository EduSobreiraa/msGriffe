# Cloudflare Pages — staging e produção

## Configuração base

Diretório do projeto: `Frontend`.

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Node.js: 24 LTS
```

Conectar repositório GitHub ao Cloudflare Pages cria previews para pull requests. Manter projeto de staging separado da produção enquanto o domínio e as integrações finais são homologados.

## Variáveis públicas por ambiente

Somente valores que podem chegar ao bundle usam `VITE_`.

| Variável | Staging atual | Produção atual | Quando API existir |
| --- | --- | --- | --- |
| `VITE_DATA_SOURCE` | `demo` | `demo` | `api` somente após homologação |
| `VITE_API_BASE_URL` | vazia | vazia | origem HTTPS pública exata da API |
| `VITE_WHATSAPP_NUMBER` | número de teste aprovado | número oficial aprovado | mesma regra |

Nunca criar `VITE_` para secret, token privado, chave Mercado Pago, Brevo, Sentry, banco ou Telegram. Esses valores pertencem ao backend e à infraestrutura privada.

## Antes de ativar `VITE_DATA_SOURCE=api`

1. Confirmar API HTTPS, CORS com origem exata de staging/produção e cookies `Secure` compatíveis.
2. Atualizar `connect-src` em `Frontend/public/_headers` com origem exata da API; nunca usar curingas.
3. Homologar `POST /v1/auth/session/refresh`, CSRF para mutações, expiração, revogação e resposta de erro.
4. Executar testes contra staging e validar que preço, estoque, frete, desconto e pagamento vêm do backend.
5. Revisar cache, URLs de imagens, robots, sitemap e domínio canônico final.

## Headers, redirects e cache

- `_redirects` mantém fallback SPA sem mascarar rotas de API;
- `_headers` mantém CSP restritiva, HSTS, `nosniff`, anti-frame e permissões mínimas;
- assets com hash recebem cache longo; HTML permanece controlado pelo deploy;
- mudanças de CSP, domínio ou API exigem revisão de segurança antes do deploy.

## Release

1. Pull request aprovada com `npm run test:coverage`, `npm run lint`, `npm run build` e `npm audit --audit-level=high`.
2. Conferir preview Cloudflare em mobile, tablet, notebook e desktop; confirmar temas e teclado quando afetados.
3. Promover commit para staging; validar headers, redirect, canonical, `robots.txt` e ausência de segredos no bundle.
4. Após homologação comercial, promover mesma revisão para produção.
5. Para rollback, restaurar deploy Cloudflare anterior e registrar motivo; não alterar dados comerciais pelo frontend.
