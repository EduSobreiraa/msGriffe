# MS Griffe

Projeto da loja virtual MS Griffe. O frontend React/TypeScript/Vite fica em [`Frontend/`](./Frontend); esta raiz concentra documentação e operação do projeto.

A API Node.js/TypeScript/Fastify fica em [`Backend/`](./Backend), com Prisma e PostgreSQL preparados para Railway.

A interface oferece temas claro e escuro, respeita a preferência inicial do sistema e persiste a escolha feita pelo usuário no navegador.

A página inicial possui navegação por teclado, suporte a movimento reduzido e auditoria estrutural automatizada de acessibilidade com axe-core nos dois temas.

## Requisitos

- Node.js 24 ou versão LTS compatível;
- npm 11 ou versão compatível.

## Desenvolvimento local

```bash
cd Frontend
npm install
cp .env.example .env.local
npm run dev
```

O endereço exibido pelo Vite abre a aplicação local.

## Verificações

```bash
cd Frontend
npm run lint
npm run test
npm run test:coverage
npm run build
npm run preview
```

A cobertura mínima exigida é de 85% para branches e 90% para funções, linhas e statements.

O build de produção é gerado em `Frontend/dist/`.

## Variáveis públicas

Somente valores seguros para exposição no navegador podem usar o prefixo `VITE_`:

- `VITE_API_BASE_URL`: endereço público da futura API;
- `VITE_DATA_SOURCE`: `demo` por padrão; `api` somente após homologação de backend;
- `VITE_WHATSAPP_NUMBER`: número do WhatsApp com código do país e DDD, apenas dígitos.

Segredos, tokens privados e credenciais nunca devem ser configurados no frontend.

## Cloudflare Pages

Configuração do projeto:

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

Os arquivos `Frontend/public/_redirects` e `Frontend/public/_headers` garantem, respectivamente, o fallback da aplicação e os headers defensivos no Cloudflare Pages.

A CSP atual permite conexões somente com a própria origem. Quando a API real for habilitada, seu domínio público deverá ser incluído explicitamente em `connect-src`; curingas não devem ser usados para contornar essa configuração.

O checklist de staging, produção, variáveis públicas e promoção está em [Cloudflare Pages](./docs/DEPLOYMENT_CLOUDFLARE_PAGES.md). Os contratos que conectam o frontend ao backend estão em [Contratos de API](./docs/FRONTEND_API_CONTRACTS.md).

## Documentação

- [Contexto do projeto](./docs/PROJECT_CONTEXT.md)
- [Roadmap](./docs/ROADMAP.md)
- [Princípios de arquitetura](./docs/ARCHITECTURE_PRINCIPLES.md)
- [Contratos de API do frontend](./docs/FRONTEND_API_CONTRACTS.md)
- [Deploy Cloudflare Pages](./docs/DEPLOYMENT_CLOUDFLARE_PAGES.md)
- [Operação do backend](./docs/BACKEND_OPERATIONS.md)

O protótipo original permanece em [`Frontend/legacy-prototype.html`](./Frontend/legacy-prototype.html) como referência histórica enquanto a migração é validada.
