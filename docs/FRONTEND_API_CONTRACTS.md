# Contratos de integração do frontend

> Estado: preparado na F6. A implementação autoritativa, autenticação e validação final pertencem às fases B0–B6.

## Convenções

- base pública: `VITE_API_BASE_URL`;
- versão inicial: `/v1`;
- JSON UTF-8; valores monetários usam inteiros em centavos;
- navegador envia cookies somente com `credentials: 'include'`; refresh token nunca é lido pelo JavaScript;
- access token é devolvido em resposta de refresh e guardado apenas em memória pelo cliente HTTP;
- rotas mutáveis precisam de proteção CSRF definida pelo backend antes da ativação;
- respostas de erro não são exibidas literalmente pela interface.

## Envelope de erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "requestId": "uuid-opaco"
  }
}
```

`message`, detalhes internos, stack traces, tokens, CPF, endereço, cartão e dados de webhook não devem integrar esse envelope público.

| HTTP | Código interno esperado | Uso no frontend |
| --- | --- | --- |
| 400, 409, 422 | `VALIDATION_ERROR` | campo ou ação inválida, sem revelar regra interna |
| 401 | `UNAUTHENTICATED` | sessão expirada; GET/HEAD pode fazer um refresh único |
| 403 | `FORBIDDEN` | acesso negado |
| 404 | `NOT_FOUND` | recurso ausente |
| 408, 429, 5xx | `TEMPORARY_UNAVAILABLE` | retry manual, sem loop automático |

## Sessão

### `POST /v1/auth/session/refresh`

Entrada: sem body; refresh token somente em cookie `HttpOnly`, `Secure` e `SameSite` definido pelo backend.

Resposta `200`:

```json
{ "accessToken": "jwt-de-curta-duracao" }
```

Resposta `401`: sessão inexistente, expirada ou revogada. O navegador não tenta refresh novamente na mesma requisição. Requisições `POST`, `PUT`, `PATCH` e `DELETE` nunca são reenviadas automaticamente.

## Catálogo

### `GET /v1/catalog/products`

Query permitida: `page`, `pageSize`, `sort`, `search`, `categorySlug`, `featured`, `minimumPrice`, `maximumPrice`.

Resposta `200`:

```json
{
  "items": [{
    "id": "camiseta-boss",
    "slug": "camiseta-boss",
    "name": "Camiseta Boss",
    "priceInCents": 8990,
    "image": "https://media.msgriffe.com.br/catalog/bossshirt.png",
    "category": { "id": "camisetas", "name": "Camisetas", "slug": "camisetas" },
    "featured": true
  }],
  "page": 1,
  "pageSize": 10,
  "totalItems": 1,
  "totalPages": 1
}
```

`installment` é opcional e não será inventado pelo catálogo. `image` é opcional quando o produto não possui imagem pública; quando presente, é URL resolvida de um `objectKey` pela base pública de mídia.

### `GET /v1/catalog/products/:slug`

Usa formato de produto da lista e acrescenta:

```json
{
  "description": "Descrição pública",
  "images": ["https://media.msgriffe.com.br/catalog/bossshirt.png"],
  "variants": [{ "id": "camiseta-boss-preto-p", "color": "Preto", "size": "P", "available": true }]
}
```

### `GET /v1/catalog/categories` e `GET /v1/catalog/categories/:slug`

Lista responde `{ "items": [...] }`; categoria contém `id`, `name`, `slug`, `image` e `productCount`. `image` pode ser `null` quando a categoria ainda não tiver imagem cadastrada. Quando presente, a API resolve o `objectKey` com a base pública de mídia; o frontend não trata placeholder como dado autoritativo.

## Contratos posteriores por domínio

| Domínio | Backend responsável | Pré-condição de ativação no frontend |
| --- | --- | --- |
| identidade e perfil | B1 | cookies, CSRF, expiração, recuperação e autorização homologados |
| catálogo, preços e estoque | B2 | validação de DTO, imagens, centavos e cache homologados |
| carrinho, frete e cupom | B3 | totais autoritativos e regra comercial do vendedor definidos |
| pedido e pagamento | B4 | Mercado Pago, webhook idempotente e estoque atômico homologados |
| operação e dashboard | B5 | permissões, auditoria, métricas e dados LGPD homologados |

Nenhum contrato desta página autoriza o frontend a decidir pagamento, estoque, desconto, frete, permissão ou transição de pedido.
