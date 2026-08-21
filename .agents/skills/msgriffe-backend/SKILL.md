---
name: msgriffe-backend
description: Orient backend work in the MS Griffe API. Use when implementing or changing Fastify, Prisma, PostgreSQL, authentication, commerce, or provider integrations while preserving approved phases, business rules, security, and module boundaries.
---

# MS Griffe Backend

Use this skill for backend implementation work. It does not replace project context and must not turn planned architecture or frontend contracts into existing behavior.

## Read only what the task needs

- Read the relevant sections of [`docs/PROJECT_CONTEXT.md`](../../../docs/PROJECT_CONTEXT.md) for approved product, payment, role, security, provider, and retention decisions.
- Read [`docs/ROADMAP.md`](../../../docs/ROADMAP.md) before implementation to identify the active backend phase and its explicit limits. B0 is complete; B1 is the next planned phase.
- Read [`docs/ARCHITECTURE_PRINCIPLES.md`](../../../docs/ARCHITECTURE_PRINCIPLES.md) for module boundaries and SOLID rules.
- For persistence changes, inspect [`Backend/prisma/schema.prisma`](../../../Backend/prisma/schema.prisma), affected migrations, and nearby tests first.
- For API integration, read [`docs/FRONTEND_API_CONTRACTS.md`](../../../docs/FRONTEND_API_CONTRACTS.md) as intended contracts only; verify actual routes in `Backend/src/`.
- For environment, deploy, backup, and operational work, read [`docs/BACKEND_OPERATIONS.md`](../../../docs/BACKEND_OPERATIONS.md).

Read the matching reference only when its concern applies:

- [`references/architecture.md`](references/architecture.md): module structure, stack, current B0 baseline, and persistence.
- [`references/backend-conventions.md`](references/backend-conventions.md): TypeScript, Fastify, environment, errors, migrations, and tests.
- [`references/business-rules.md`](references/business-rules.md): roles, checkout, payment, inventory, and unresolved commerce rules.
- [`references/security.md`](references/security.md): identity, CORS, external providers, secrets, backup, and observability.

## Source precedence and conflicts

Use `PROJECT_CONTEXT.md` for approved business and security decisions, `ROADMAP.md` for phase scope, and existing code/schema/migrations for actual current behavior. Architecture documentation describes a target, not permission to create empty layers.

Do not silently resolve a conflict not covered by that precedence. Stop the affected portion and report it. Known conflicts include cart persistence, refunds in the MVP, and the frontend error `requestId` contract versus the current API response.

## Implementation rules

- Work only within the requested and active roadmap phase. Do not anticipate future phases.
- Before a new backend subphase, create its scoped plan in `docs/ROADMAP.md`; complete a phase only after relevant quality checks and a commit.
- Keep business rules out of Fastify handlers, Prisma models, and provider SDK adapters.
- Prefer a coherent minimal module over empty `domain`, `application`, or `infrastructure` layers. Add a layer or port when it separates a real responsibility.
- Keep external services behind adapters. Do not introduce a new framework, ORM, provider, or architectural pattern without a project decision.
- Validate untrusted input at boundaries; keep business validation in the application/domain layer.
- Do not trust client totals, stock, permissions, or order transitions.
- Keep secrets outside the repository and never expose them through public frontend variables or logs.

## Critical invariants

- Roles are `CUSTOMER`, `SELLER`, and `SUPERADMIN`; there is no `USER` role. `SUPERADMIN` is technical/maintenance, not store operation.
- `CheckoutAttempt` represents the pre-payment state. An `Order` is created or confirmed only after validated payment approval.
- Inventory belongs to `ProductVariant`, is reduced only after approved payment, and requires an atomic transaction with the order/payment operation.
- Mercado Pago webhooks must be authenticated, validated, and idempotent.
- Use Brevo for transactional e-mail; do not introduce Resend.
- CORS uses explicit `CORS_ALLOWED_ORIGINS`; never use wildcard origins with credentials.

## Validation proportional to scope

- Run focused tests for isolated changes; include negative paths and authorization/security cases when relevant.
- Run `npm run lint` and `npm run build` for code changes.
- Run `npm run test:coverage` for phase completion or broad backend changes.
- For Prisma work, run `npx prisma validate`, `npm run prisma:generate`, and the relevant migration command against a safe database.
- Do not disable tests, lower coverage thresholds, weaken lint, or mask a failed migration to finish a task.

Report what changed, checks run, migration/operational actions, and any unresolved business or documentation blocker.
