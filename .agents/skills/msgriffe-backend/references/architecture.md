# Arquitetura e estado atual

## Stack e execução

- Node.js 24, TypeScript 6, Fastify 5, Prisma 6, PostgreSQL 17, Zod 4, Vitest 4 e ESLint 10.
- A API é ESM. `Backend/package.json` é a fonte para scripts e versões instaladas.
- Railway hospedará API e banco em staging e produção; Cloudflare R2 receberá mídia e a cópia externa de backup.
- B0 está concluída. Nenhum recurso remoto, secret ou integração externa foi criado ainda.

## Código existente

```text
Backend/src/
├── app/createApplication.ts
├── config/environment.ts
├── modules/health/presentation/http/healthRoutes.ts
├── shared/errors/ApplicationError.ts
└── main.ts
```

`createApplication` compõe Fastify, Helmet, CORS, erros e rotas. O único módulo funcional é `health`, com `GET /v1/health`.

Para novas features, organizar por domínio em `modules/<domain>/`. A forma alvo é `domain`, `application`, `infrastructure` e `presentation`, usada somente quando cada responsabilidade existir de fato. A direção preferida é presentation → application → domain; infrastructure implementa portas necessárias.

## Persistência atual

- Prisma usa PostgreSQL e gera o cliente em `Backend/generated/prisma`.
- Há uma migration inicial versionada: `20260820000000_initial`.
- IDs são UUID; dinheiro usa centavos inteiros; modelos usam timestamps.
- Modelos: `User`, `Category`, `Product`, `ProductImage`, `ProductVariant`, `CheckoutAttempt`, `Order` e `OrderItem`.
- `ProductImage.objectKey` é a referência de mídia R2; não persistir URL de provedor sem decisão técnica.
- Não existem tabelas de sessão, token, e-mail verificado, 2FA, endereço, CPF, auditoria, cupom, frete ou histórico de estoque.

Toda mudança no schema exige migration Prisma correspondente. Não inserir regra comercial no schema ou no adapter Prisma.
