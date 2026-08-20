# Backend — operação inicial

## Stack e estrutura

`Backend/` contém API Node.js/TypeScript com Fastify, Prisma e PostgreSQL. A organização segue módulos por domínio; a B0 só estabelece configuração, schema, healthcheck e contratos de borda.

```text
Backend/
├── prisma/             # schema e migrações versionadas
├── src/
│   ├── app/            # composição Fastify
│   ├── config/         # ambiente validado
│   ├── modules/        # domínios e presentation HTTP
│   └── shared/         # erros e elementos transversais
└── railway.toml
```

## Desenvolvimento local

```bash
cd Backend
cp .env.example .env
npm install
docker compose up -d
npm run prisma:migrate:dev
npm run dev
```

Healthcheck: `GET http://127.0.0.1:3000/v1/health`.

`DATABASE_URL` nunca é versionada. A migração inicial está no repositório, mas ainda não foi aplicada em banco Railway.

`docker-compose.yml` usa PostgreSQL local na porta `5433`, isolado de outros projetos. As credenciais nele são somente para desenvolvimento; Railway usa Secrets próprios.

## Staging e produção

Criar projetos Railway separados para staging e produção, ambos com PostgreSQL próprio. Configurar Railway Secrets por ambiente:

- `DATABASE_URL`;
- `NODE_ENV=production`;
- `HOST=0.0.0.0`;
- `PORT` fornecida pelo Railway;
- `CORS_ALLOWED_ORIGINS` com URLs HTTPS exatas do Cloudflare Pages.

Railway usará `Backend/railway.toml`: gera cliente Prisma, compila, aplica somente migrações versionadas e inicia a API com healthcheck. A conexão GitHub do Railway fará deploy automático após aprovação no pipeline; nenhum token Railway será salvo neste repositório.

## GitHub Actions

`backend-quality.yml` executa em pull requests e em `main`: instalação reproduzível, validação Prisma, geração do cliente, testes com cobertura, lint e build. Ele usa URL PostgreSQL fictícia somente para validar schema, sem conectar banco.

## Segurança operacional

- CORS permite apenas origens declaradas; produção rejeita HTTP;
- Helmet adiciona headers defensivos; erros retornam somente códigos estáveis;
- logs, Sentry, Better Stack, Telegram, Mercado Pago e Cloudflare R2 não são conectados na B0;
- antes de B1, definir a alternativa para verificação e recuperação de senha de clientes sem e-mail transacional;
- antes do primeiro deploy, configurar backup diário, retenções, restore testado, RPO de 24 h e RTO de 4 h no Railway/R2.
