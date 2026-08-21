# Regras de negócio backend

## Perfis e identidade

- `CUSTOMER` compra e acompanha pedidos.
- `SELLER` opera catálogo, estoque e a evolução operacional de pedidos.
- `SUPERADMIN` administra manutenção, permissões e configurações críticas; não é um perfil comercial.
- A autorização é sempre validada no backend. Controles do frontend não são segurança.

## Pagamento, pedido e estoque

1. Criar `CheckoutAttempt` antes do pagamento, com `PENDING_PAYMENT`.
2. Mercado Pago comunica aprovação.
3. Validar autenticidade e idempotência do evento.
4. Em transação, verificar e reduzir estoque das variantes de forma atômica.
5. Criar ou confirmar o pedido em `PAID`.

Fluxo operacional: `PAID → PREPARING → SHIPPED → DELIVERED`. `CANCELLED` é excepcional. Nenhum estado de pedido, desconto, frete ou preço é decidido pelo cliente.

Não inventar reserva de estoque, limite de estoque baixo, comportamento para pagamento aprovado sem estoque, política de cancelamento, frete, cupom, parcelamento, juros ou desconto Pix. Essas decisões continuam abertas.

## Conflitos que exigem parada

- O contexto aprovado diz que a sacola não persiste após fechar o navegador; B3 no roadmap menciona carrinho persistido.
- O contexto exclui reembolso do fluxo inicial do MVP; B4 no roadmap menciona reembolso.
- O contrato frontend prevê `requestId` em erros; a API atual não o produz.

Não decidir esses pontos implicitamente. Reportar o conflito e implementar somente a parte independente dele.
