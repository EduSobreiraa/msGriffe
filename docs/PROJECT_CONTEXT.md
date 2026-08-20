# Contexto do projeto — msGriffe

> Documento inicial de decisões do produto e da arquitetura.
>
> Última atualização: 20 de agosto de 2026.

## 1. Visão geral

A **msGriffe** é uma loja virtual. O sistema deverá atender clientes, vendedores e administradores, cobrindo catálogo, conta do cliente, checkout, pagamento, estoque, acompanhamento de pedidos, comunicação transacional e gestão comercial.

Este documento é a fonte inicial de contexto do projeto. As definições marcadas como provisórias ou pendentes não devem ser tratadas como regras comerciais definitivas sem validação do vendedor.

### 1.1 Escopo funcional fechado do MVP

Inclui:

- aplicação web responsiva, sem aplicativo nativo;
- conta obrigatória para comprar; cadastro com nome, telefone, e-mail e data de nascimento;
- área do cliente para editar dados e senha, e acompanhar pedidos;
- catálogo com busca textual e filtros de categoria, tamanho, preço e disponibilidade;
- produtos com múltiplas imagens e variantes de tamanho e cor;
- carrinho transitório: não persiste após o fechamento do navegador;
- alteração de quantidade e variante limitada pelo estoque disponível;
- checkout com CPF, CEP e endereço, mesmo antes da definição integral de frete;
- estoque por variante, ajuste pelo `SELLER` e painel com CRUD de produtos, pedidos, clientes, últimas compras e analytics básico;
- WhatsApp somente como link ou botão de contato;
- `SUPERADMIN` restrito a manutenção técnica e administrativa, não à operação comercial.

Ficam fora do MVP: avaliações, favoritos, páginas institucionais de Sobre Nós/Contato, CMS e automações de WhatsApp.

## 2. Perfis e responsabilidades

Perfis previstos:

- **CUSTOMER**: cliente cadastrado que navega, compra e acompanha seus pedidos;
- **SELLER**: responsável pelas operações comerciais e pelo andamento operacional dos pedidos;
- **SUPERADMIN**: responsável por configurações críticas, permissões e administração geral.

A autorização deve ser validada sempre pelo backend. Controles visuais no frontend não substituem a verificação de permissão no servidor.

## 3. Autenticação e conta do cliente

Estratégia definida:

- access token de curta duração;
- refresh token armazenado em cookie `HttpOnly`;
- recuperação de senha;
- verificação de e-mail;
- proteção adicional para `SELLER` e `SUPERADMIN`;
- expiração e revogação de sessões;
- proteção contra enumeração de usuários.

Para contas administrativas:

- cookies com `HttpOnly`, `Secure` e `SameSite` adequado;
- 2FA por TOTP, prioritariamente para `SUPERADMIN`;
- não usar SMS como segundo fator;
- nova autenticação para ações sensíveis;
- recuperação inicial de senha por fluxo controlado pelo `SUPERADMIN`, pois haverá poucas contas administrativas;
- não usar Keycloak ou Auth0 no MVP.

O cliente deverá criar uma conta antes de comprar. O cadastro será progressivo para reduzir atrito.

Dados do cadastro inicial:

- nome;
- e-mail;
- telefone;
- data de nascimento;
- senha.

Dados solicitados durante a compra, quando necessários:

- CPF;
- endereço;
- consentimentos aplicáveis.

## 4. Pedidos, pagamentos e estoque

### 4.1 Fluxo principal

Um `Checkout`/`PaymentAttempt` será criado antes do pagamento para preservar o carrinho, os dados e a conciliação com o Mercado Pago. O pedido comercial será criado ou confirmado somente após aprovação:

```text
Checkout/PaymentAttempt criado
    ↓
PENDING_PAYMENT
    ↓
Mercado Pago confirma o pagamento
    ↓
Backend valida pagamento e autenticidade do evento
    ↓
Backend reduz o estoque em transação atômica
    ↓
Pedido é criado ou confirmado como PAID
```

O processamento de webhooks deve ser idempotente. Um mesmo evento recebido mais de uma vez não pode duplicar cobranças, reduzir o estoque novamente ou repetir efeitos colaterais.

### 4.2 Concorrência de estoque

A confirmação do pagamento deve executar uma operação transacional equivalente a:

```text
Abrir transação
    ↓
Bloquear ou atualizar condicionalmente os itens envolvidos
    ↓
Verificar o estoque atual de todas as variantes
    ↓
Reduzir o estoque de forma atômica
    ↓
Registrar a aprovação e confirmar o pedido
    ↓
Finalizar transação
```

Isso evita que dois pagamentos aprovados consumam simultaneamente a última unidade.

Ainda existe uma exceção de negócio: o pagamento pode ser aprovado quando o item já estiver esgotado. O vendedor deverá escolher a regra aplicável entre reembolso, contato com o cliente, substituição ou espera por reposição. Até essa decisão, o sistema deve registrar a falha, impedir estoque negativo e encaminhar o pedido para tratamento manual seguro.

### 4.3 Estados do pedido

Estados iniciais:

- `PENDING_PAYMENT` para o `Checkout`/`PaymentAttempt`;
- `PAID`;
- `PREPARING`;
- `SHIPPED`;
- `DELIVERED`;
- `CANCELLED` como saída excepcional.

O Mercado Pago será a fonte dos eventos financeiros. O `SELLER` será responsável principalmente pelas transições operacionais:

```text
PAID → PREPARING → SHIPPED → DELIVERED
```

Cancelamento e transições reversas dependem de regras comerciais. Reembolso fica fora do fluxo inicial do MVP. Toda mudança de estado deverá ser validada no backend e registrada em histórico.

### 4.4 Formas de pagamento

O sistema deverá ficar preparado para suportar:

- Pix;
- cartão de crédito;
- boleto;
- parcelamento;
- desconto no Pix;
- juros pagos pelo cliente ou pela loja.

As modalidades efetivamente habilitadas serão definidas pelo vendedor antes da integração definitiva.

## 5. Catálogo, preços e promoções

O modelo comercial deverá comportar:

- preço por produto ou variante;
- preço promocional;
- desconto no Pix;
- máximo de parcelas;
- valor mínimo da parcela;
- exibição de preço anterior;
- promoções programadas.

O modelo de cupons deverá ficar preparado para:

- desconto percentual;
- desconto de valor fixo;
- valor mínimo do pedido;
- período de validade;
- limite total de utilizações;
- limite por cliente;
- aplicação a produtos ou categorias específicas;
- frete grátis.

Preços, parcelamento, promoções e regras finais dos cupons dependem do vendedor.

## 6. WhatsApp

Para o MVP, a integração prevista é um link direto por `wa.me`.

Dependem do vendedor:

- número oficial;
- mensagem inicial;
- horário de atendimento;
- envio ou não do resumo do carrinho;
- eventual automação futura.

## 7. Comunicação

O **Resend foi retirado do MVP**. Não haverá e-mail transacional ou infraestrutura inicial de e-mail corporativo.

- atendimento ao cliente: WhatsApp;
- comunicação de pedidos: site e WhatsApp;
- Mercado Pago mantém suas comunicações próprias de pagamento quando aplicável;
- WhatsApp não será mecanismo principal de autenticação administrativa;
- Resend poderá ser reavaliado após o MVP.

## 8. Dashboard administrativo

Métricas aceitas como base:

- faturamento;
- quantidade de pedidos;
- ticket médio;
- produtos mais vendidos;
- pedidos recentes;
- estoque baixo;
- clientes recentes;
- comparação entre períodos.

A área de clientes deverá apresentar:

- nome;
- e-mail ou telefone;
- data da última compra;
- produtos da última compra;
- valor da última compra;
- quantidade total de pedidos;
- valor total gasto.

O layout e a prioridade visual ainda serão refinados a partir das referências fornecidas e da validação do vendedor.

## 9. Ambientes

Ambientes definidos:

```text
Desenvolvimento local
Staging
Produção
```

Os serviços online manterão inicialmente apenas staging e produção. Credenciais, chaves e segredos devem ser separados por ambiente e nunca versionados no repositório.

### 9.1 Hospedagem do frontend

O frontend será hospedado no **Cloudflare Pages**.

Os projetos ou ambientes de preview, staging e produção deverão usar configurações e variáveis próprias. Segredos de backend e credenciais privadas não poderão ser expostos em variáveis incorporadas ao bundle do frontend.

### 9.2 Backend e dados

- API: Node.js + TypeScript, com Fastify como framework preferencial;
- ORM: Prisma;
- banco: PostgreSQL;
- hospedagem da API e banco: Railway;
- domínio público previsto: `api.msgriffe.com.br`;
- object storage de imagens: Cloudflare R2;
- CI/CD: GitHub Actions e deploy automático;
- segredos: Railway Secrets e GitHub Secrets, sem Doppler ou Vault no MVP;
- CORS: allowlist explícita apenas para origens autorizadas de staging e produção.

## 10. Auditoria, logs e retenção

Eventos mínimos de auditoria:

- alteração de preços;
- alteração de estoque;
- mudança de status de pedidos;
- cancelamentos e reembolsos;
- alterações de permissões;
- login administrativo suspeito;
- falhas em webhooks;
- alterações de configurações críticas.

Retenções iniciais:

- logs técnicos comuns: **14 dias**;
- logs e auditorias de segurança: **90 dias**;
- backups: **30 dias**;
- tokens temporários: somente pelo período necessário;
- pedidos, clientes e dados financeiros: conforme necessidade operacional e obrigações legais.

Pedidos, pagamentos, documentos fiscais e histórico comercial não devem ser eliminados por retenções técnicas curtas.

Backup e recuperação:

- backup diário do PostgreSQL;
- considerar cópia externa no Cloudflare R2;
- testes periódicos de restore;
- RPO inicial: até 24 horas;
- RTO inicial: até 4 horas.

## 11. Observabilidade e alertas

A configuração detalhada ocorrerá em etapa posterior da produção.

Direcionamento definido:

- Sentry: erros e exceptions da aplicação;
- Better Stack: uptime e healthchecks;
- Telegram: alertas críticos;
- WhatsApp: atendimento e comunicação operacional ao cliente.

Exemplos de alertas para Telegram:

- múltiplas tentativas de login;
- acesso administrativo suspeito;
- alteração de permissões;
- indisponibilidade da API;
- falha de banco de dados;
- falha repetida em webhook;
- tentativa de operação não autorizada;
- alteração de configuração crítica.
- falha de backup;

## 12. Segurança

Requisitos mínimos:

- hash de senhas com algoritmo atual e configuração segura;
- rate limiting;
- cookies `Secure`, `HttpOnly` e com `SameSite` adequado;
- proteção CSRF obrigatória quando autenticação administrativa usar cookies;
- validação e normalização de entradas;
- controle de acesso por papel e por operação;
- logs de ações administrativas;
- segredos fora do repositório;
- HTTPS obrigatório;
- nova autenticação para operações críticas;
- headers HTTP de segurança;
- atualização periódica de dependências;
- validação de assinatura e idempotência de webhooks;
- aplicação do princípio do menor privilégio.

Sessões administrativas devem ser revogáveis, ter expiração definida e não usar tokens/JWT de longa duração.

## 13. LGPD e documentos legais

A implementação inicial seguirá práticas usuais de privacidade e proteção de dados, sujeitas a validação jurídica posterior.

Documentos e mecanismos previstos:

- Política de Privacidade;
- Termos de Uso;
- Política de Cookies;
- Política de Trocas e Devoluções;
- política de tratamento de dados;
- canal de contato para titulares;
- consentimento específico para marketing.

O sistema deverá observar finalidade, necessidade, transparência, segurança e controle dos consentimentos. Consentimento não deve ser usado como base legal genérica para todo tratamento.

## 14. Pendências

### 14.1 Decisões do vendedor

1. Formas de entrega e frete.
2. Política de troca, cancelamento e reembolso.
3. Formas de pagamento habilitadas.
4. Parcelamento, juros e desconto no Pix.
5. Regras de cupons e promoções.
6. Política de preços.
7. Número e funcionamento do WhatsApp.
8. Endereços de e-mail usados pela loja.
9. Regras comerciais de estoque baixo.
10. Conteúdo e prioridade do dashboard.
11. Documentos legais e políticas da loja.
12. Tratamento de pagamento aprovado sem estoque disponível.
13. Campos, publicação/arquivamento e regras operacionais do CRUD de produtos.

### 14.2 Decisões técnicas posteriores

1. Serviço de frete e cálculo por CEP.
2. Estratégia de otimização, tratamento e URLs das imagens no Cloudflare R2.
3. Configuração detalhada do Better Stack.
4. Configuração detalhada do Sentry.
5. Integração dos alertas com Telegram.
6. Política definitiva de retenção por categoria de log e dado.
7. Estratégia para indisponibilidade do Mercado Pago.

### 14.3 Decisões provisórias implementadas e obrigatórias para revisão

Esta lista funciona como checklist de homologação. Uma implementação aparecer como concluída no `ROADMAP` não transforma uma regra provisória em decisão comercial definitiva.

| ID | Implementação provisória | Estado | Validar com | Momento limite para revisão |
| --- | --- | --- | --- | --- |
| PROV-001 | Desconto demonstrativo de 5% para subtotal a partir de R$ 200,00. | Aguardando validação | Vendedor | Antes da integração autoritativa de preços e promoções. |
| PROV-002 | Frete padrão demonstrativo de R$ 19,90. | Aguardando validação | Vendedor e definição técnica do serviço de frete | Antes da integração de cálculo por CEP. |
| PROV-003 | Frete demonstrativo gratuito para subtotal a partir de R$ 300,00. | Aguardando validação | Vendedor | Antes da integração autoritativa de frete e promoções. |

As regras `PROV-001`–`PROV-003` existem apenas para tornar o frontend demonstrável. Elas não constituem oferta, não devem ser publicadas como política comercial aprovada e deverão ser removidas ou substituídas pelos valores confirmados.

Novas decisões provisórias que afetem comportamento, segurança, integrações, dados ou regras comerciais deverão receber um identificador nesta tabela, responsável pela validação e momento limite de revisão.

## 15. Premissas de implementação

Enquanto as pendências não forem resolvidas:

- regras comerciais devem ser configuráveis quando isso não aumentar desnecessariamente o escopo do MVP;
- integrações externas devem ficar isoladas atrás de serviços ou adaptadores;
- operações financeiras e de estoque devem ser idempotentes, auditáveis e transacionais;
- valores monetários não devem usar ponto flutuante binário;
- datas devem ser armazenadas com referência temporal inequívoca e exibidas no fuso aplicável;
- mudanças importantes neste contexto devem atualizar este documento e registrar a data da decisão;
- nenhuma pendência comercial deve ser silenciosamente convertida em regra definitiva pela implementação;
- decisões provisórias implementadas devem ser adicionadas ao checklist da seção 14.3 e permanecer abertas até validação explícita;
- frontend e backend devem seguir SOLID, modularização por responsabilidade e baixo acoplamento;
- componentes, serviços, casos de uso e módulos devem observar principalmente o princípio da responsabilidade única;
- regras de negócio devem permanecer independentes de frameworks, banco de dados e provedores externos;
- enquanto o backend não for homologado, o frontend usará adaptadores demonstrativos por padrão; a fonte HTTP será ativada somente por configuração pública explícita e contratos validados;
- o access token do frontend, quando existir, ficará somente em memória; renovação de sessão dependerá de cookie `HttpOnly` e não repetirá mutações automaticamente;
- toda nova subfase de produção deve começar com um plano documentado, passos hierárquicos, critérios de aceite e acompanhamento de estado;
- segurança deve ser revisada continuamente com base no OWASP Top 10 e, conforme o risco, nos controles aplicáveis do OWASP ASVS;
- dependências, entradas, autenticação, autorização, sessões, segredos, headers e integrações externas devem fazer parte do quality gate de segurança;
- mudanças de interface devem ser verificadas em mobile, tablet, notebook e desktop, considerando pelo menos 360–390 px, 768 px, 1024 px e 1440 px quando aplicável;
- cada etapa de produção concluída deve gerar um commit somente após código, testes, build, segurança, responsividade e documentação aplicáveis estarem aprovados;
- commits não devem incluir segredos, arquivos de ambiente locais, dependências instaladas, cobertura ou artefatos de build.

O planejamento, andamento e histórico das fases estão centralizados em [`ROADMAP.md`](./ROADMAP.md), cobrindo **F0–F6** para frontend e **B0–B7** para backend.

As regras arquiteturais obrigatórias estão detalhadas em [`ARCHITECTURE_PRINCIPLES.md`](./ARCHITECTURE_PRINCIPLES.md).

## 16. Histórico de decisões

| Data | Decisão |
| --- | --- |
| 2026-08-07 | Cadastro obrigatório e progressivo para compras. |
| 2026-08-07 | Access token curto e refresh token em cookie `HttpOnly`. |
| 2026-08-07 | Estoque reduzido apenas após aprovação do pagamento, de forma transacional. |
| 2026-08-07 | Mercado Pago como integração financeira prevista. |
| 2026-08-07 | Resend como serviço de e-mails transacionais. |
| 2026-08-07 | Ambientes local, staging e produção. |
| 2026-08-07 | Cloudflare Pages como plataforma de hospedagem do frontend. |
| 2026-08-07 | Implementação organizada em frontend (F0–F6) antes do backend (B0–B7). |
| 2026-08-07 | SOLID e responsabilidade única adotados como princípios obrigatórios no frontend e backend. |
| 2026-08-07 | Plano detalhado e versionado passa a ser obrigatório antes de iniciar cada nova subfase de produção. |
| 2026-08-07 | Wouter adotado para roteamento do frontend após remoção do React Router por alertas de segurança nas versões disponíveis. |
| 2026-08-07 | Retenção de 14 dias restrita a logs transitórios elegíveis. |
| 2026-08-09 | OWASP Top 10 e controles aplicáveis do ASVS adotados como referência permanente de segurança. |
| 2026-08-09 | Validação responsiva passa a cobrir mobile, tablet, notebook e desktop conforme o impacto da etapa. |
| 2026-08-09 | Cada etapa concluída deve receber commit próprio após aprovação do quality gate. |
| 2026-08-11 | Decisões provisórias implementadas passam a integrar um checklist obrigatório de revisão, com responsável e prazo de validação. |
| 2026-08-18 | F6 prepara contratos HTTP, refresh de sessão em memória e fonte demonstrativa padrão; nenhuma API real foi ativada. |
| 2026-08-20 | Backend do MVP definido como Fastify, Prisma e PostgreSQL no Railway; imagens no Cloudflare R2 e deploy via GitHub Actions. |
| 2026-08-20 | 2FA TOTP, retenção, backup, RPO/RTO, observabilidade e alertas críticos foram definidos; Resend foi removido do MVP em favor de site e WhatsApp. |
| 2026-08-20 | Escopo funcional do MVP definido: checkout pré-pagamento, pedido confirmado após aprovação, estoque por variante, operação `SELLER` e exclusões explícitas. |
| 2026-08-20 | B0 adota Prisma 6.12 após alerta alto na linha Prisma 7; API Fastify, schema inicial, PostgreSQL local e pipeline de qualidade foram preparados. |
