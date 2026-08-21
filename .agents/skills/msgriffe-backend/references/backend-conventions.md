# Convenções backend

## Código e módulos

- TypeScript estrito, ESM, imports relativos com extensão `.js` e exportações nomeadas.
- Funções e variáveis em `camelCase`; tipos, classes e modelos Prisma em `PascalCase`; valores de enum em maiúsculas.
- Arquivos em `camelCase.ts`; testes co-localizados em `*.test.ts`.
- Dois espaços, sem ponto e vírgula.
- Rotas HTTP são versionadas em `/v1` e o módulo expõe uma função de registro, como `registerHealthRoutes`.

## Ambiente e borda HTTP

- `readEnvironment` é a única configuração atual e valida `CORS_ALLOWED_ORIGINS`, `HOST`, `PORT` e `NODE_ENV` com Zod.
- CORS aceita somente origens exatas declaradas; HTTP só é permitido para `localhost`/`127.0.0.1` fora de produção.
- Helmet é registrado na composição Fastify.
- `ApplicationError` representa falhas conhecidas; resposta pública atual é `{ error: { code } }`.
- Falhas inesperadas retornam `500 / INTERNAL_ERROR`; rota ausente retorna `404 / NOT_FOUND`. Não expor detalhes internos.
- Ainda não há validação de body/query/params, request ID, logger estruturado, CSRF, autenticação ou rate limiting.

## Migrations e testes

- Usar `npm run prisma:migrate:dev` apenas em desenvolvimento para criar/aplicar migrations; usar `npm run prisma:migrate:deploy` para ambientes de deploy.
- Não alterar migration já aplicada; criar outra migration para evolução do schema.
- Vitest usa `Fastify.inject`; mínimos de cobertura: 85% branches, 90% functions, lines e statements.
- Testes atuais cobrem ambiente, CORS, healthcheck, headers e erros. Não há testes com PostgreSQL real ou provedores externos.
- CI executa `npm ci`, `prisma validate`, geração do client, cobertura, lint e build.
