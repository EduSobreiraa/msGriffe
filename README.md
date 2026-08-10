# MS Griffe

Frontend da loja virtual MS Griffe, construído com React, TypeScript, Vite e Wouter.

A interface oferece temas claro e escuro, respeita a preferência inicial do sistema e persiste a escolha feita pelo usuário no navegador.

A página inicial possui navegação por teclado, suporte a movimento reduzido e auditoria estrutural automatizada de acessibilidade com axe-core nos dois temas.

## Requisitos

- Node.js 24 ou versão LTS compatível;
- npm 11 ou versão compatível.

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local
npm run dev
```

O endereço exibido pelo Vite abre a aplicação local.

## Verificações

```bash
npm run lint
npm run test
npm run test:coverage
npm run build
npm run preview
```

A cobertura mínima exigida é de 75% para branches e 80% para funções, linhas e statements.

O build de produção é gerado em `dist/`.

## Variáveis públicas

Somente valores seguros para exposição no navegador podem usar o prefixo `VITE_`:

- `VITE_API_BASE_URL`: endereço público da futura API;
- `VITE_WHATSAPP_NUMBER`: número do WhatsApp com código do país e DDD, apenas dígitos.

Segredos, tokens privados e credenciais nunca devem ser configurados no frontend.

## Cloudflare Pages

Configuração do projeto:

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

O arquivo `public/_redirects` garante o fallback da aplicação para rotas acessadas diretamente.

## Documentação

- [Contexto do projeto](./docs/PROJECT_CONTEXT.md)
- [Roadmap](./docs/ROADMAP.md)
- [Princípios de arquitetura](./docs/ARCHITECTURE_PRINCIPLES.md)

O protótipo original permanece em `Frontend/ms-grifes-react.html` como referência histórica enquanto a migração é validada.
