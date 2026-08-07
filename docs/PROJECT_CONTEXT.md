# Contexto do projeto — msGriffe

> Documento inicial de decisões do produto e da arquitetura.
>
> Última atualização: 7 de agosto de 2026.

## 1. Visão geral

A **msGriffe** é uma loja virtual. O sistema deverá atender clientes, vendedores e administradores, cobrindo catálogo, conta do cliente, checkout, pagamento, estoque, acompanhamento de pedidos, comunicação transacional e gestão comercial.

Este documento é a fonte inicial de contexto do projeto. As definições marcadas como provisórias ou pendentes não devem ser tratadas como regras comerciais definitivas sem validação do vendedor.

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

O cliente deverá criar uma conta antes de comprar. O cadastro será progressivo para reduzir atrito.

Dados do cadastro inicial:

- nome;
- e-mail;
- telefone;
- senha.

Dados solicitados durante a compra, quando necessários:

- CPF;
- data de nascimento;
- endereço;
- consentimentos aplicáveis.

## 4. Pedidos, pagamentos e estoque

### 4.1 Fluxo principal

O estoque será reduzido somente após a aprovação do pagamento:

```text
Pedido criado
    ↓
PENDING_PAYMENT
    ↓
Mercado Pago confirma o pagamento
    ↓
Backend valida pagamento e autenticidade do evento
    ↓
Backend reduz o estoque em transação atômica
    ↓
Pedido passa para PAID
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

- `PENDING_PAYMENT`;
- `PAID`;
- `PREPARING`;
- `SHIPPED`;
- `DELIVERED`;
- `CANCELLED`;
- `REFUNDED`.

O Mercado Pago será a fonte dos eventos financeiros. O `SELLER` será responsável principalmente pelas transições operacionais:

```text
PAID → PREPARING → SHIPPED → DELIVERED
```

Cancelamento, reembolso, transições reversas e permissões associadas ainda dependem de regras comerciais. Toda mudança de estado deverá ser validada no backend e registrada em histórico.

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

## 7. E-mails transacionais

Serviço definido: **Resend**.

Eventos previstos:

- cadastro realizado;
- recuperação de senha;
- pedido criado;
- pagamento pendente;
- pagamento aprovado;
- pagamento recusado ou expirado;
- pedido em preparação;
- pedido enviado;
- pedido entregue;
- cancelamento;
- reembolso;
- falha relevante de pagamento ou webhook.

Possíveis endereços remetentes, sujeitos à definição do vendedor:

```text
vendas@dominio.com
pedidos@dominio.com
suporte@dominio.com
seguranca@dominio.com
```

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

A retenção inicial de **14 dias** se aplica somente a logs técnicos, operacionais e de segurança transitórios que não tenham obrigação de armazenamento prolongado.

Pedidos, pagamentos, documentos fiscais e histórico comercial não devem ser eliminados por essa política. A retenção definitiva deverá ser classificada por tipo de dado e validada conforme obrigações legais, fiscais, financeiras e de proteção de dados.

## 11. Observabilidade e alertas

A configuração detalhada ocorrerá em etapa posterior da produção.

Direcionamento inicial:

- alertas de segurança: Telegram;
- alertas comerciais: e-mail;
- erros técnicos: Sentry e Better Stack.

Exemplos de alertas para Telegram:

- múltiplas tentativas de login;
- acesso administrativo suspeito;
- alteração de permissões;
- indisponibilidade da API;
- falha de banco de dados;
- falha repetida em webhook;
- tentativa de operação não autorizada;
- alteração de configuração crítica.

## 12. Segurança

Requisitos mínimos:

- hash de senhas com algoritmo atual e configuração segura;
- rate limiting;
- cookies `Secure`, `HttpOnly` e com `SameSite` adequado;
- proteção contra CSRF quando aplicável;
- validação e normalização de entradas;
- controle de acesso por papel e por operação;
- logs de ações administrativas;
- segredos fora do repositório;
- HTTPS obrigatório;
- confirmação adicional para operações críticas;
- headers HTTP de segurança;
- atualização periódica de dependências;
- validação de assinatura e idempotência de webhooks;
- aplicação do princípio do menor privilégio.

As regras definitivas de 2FA e sessões administrativas ainda serão decididas.

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

### 14.2 Decisões técnicas posteriores

1. Serviço de frete e cálculo por CEP.
2. Estratégia de armazenamento, otimização e tratamento de imagens.
3. Backup, retenção, RPO e RTO.
4. Configuração detalhada do Better Stack.
5. Configuração detalhada do Sentry.
6. Integração dos alertas com Telegram.
7. Política definitiva de retenção por categoria de log e dado.
8. Regras de 2FA e sessões administrativas.
9. Definição exata do escopo do MVP.
10. Estratégia para indisponibilidade do Mercado Pago.

## 15. Premissas de implementação

Enquanto as pendências não forem resolvidas:

- regras comerciais devem ser configuráveis quando isso não aumentar desnecessariamente o escopo do MVP;
- integrações externas devem ficar isoladas atrás de serviços ou adaptadores;
- operações financeiras e de estoque devem ser idempotentes, auditáveis e transacionais;
- valores monetários não devem usar ponto flutuante binário;
- datas devem ser armazenadas com referência temporal inequívoca e exibidas no fuso aplicável;
- mudanças importantes neste contexto devem atualizar este documento e registrar a data da decisão;
- nenhuma pendência comercial deve ser silenciosamente convertida em regra definitiva pela implementação.

O roteiro incremental de construção está registrado em [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md), com as subfases **F0–F6** para frontend e **B0–B7** para backend.

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
| 2026-08-07 | Retenção de 14 dias restrita a logs transitórios elegíveis. |
