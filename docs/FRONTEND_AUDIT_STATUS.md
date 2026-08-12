# Status da auditoria de frontend

## Objetivo

Registrar situação das melhorias de carregamento, responsividade, acessibilidade e feedback visual identificadas na auditoria do storefront MS Griffe.

## Base da auditoria

Esta documentação consolida análise feita com duas referências complementares:

- `ui-ux-pro-max`: critérios gerais de UX/UI para acessibilidade, touch targets, performance, CLS, lazy loading, feedback, responsividade, truncamento e navegação.
- `msgriffe-frontend`: arquitetura, tokens, identidade visual, padrões existentes, comportamento responsivo e regras de acessibilidade específicas do storefront.

Decisões foram aplicadas somente onde as duas referências eram compatíveis com código e padrões já existentes no projeto.

Escopo mantido: ajustes locais de interface. Não houve alteração no formato, armazenamento ou infraestrutura de imagens, nem nos contratos ou regras de domínio do catálogo.

## Situação atual

### Imagens e loading

- Hero mantém `fetchPriority="high"`.
- Galeria principal de produto mantém carregamento prioritário.
- Página `/produtos` usa `eager` e prioridade alta apenas no primeiro produto.
- Demais imagens do catálogo usam `loading="lazy"`.
- Imagens fora da área inicial em cards, categorias, miniaturas e sacola usam lazy loading quando apropriado.
- Dimensões `width`/`height` e `aspect-ratio` reservam espaço para reduzir layout shift.
- Fallback de imagem permanece ativo, incluindo proteção contra repetição do fallback.
- Skeletons existentes foram preservados e continuam reservando geometria próxima ao conteúdo final.

### Galeria de produto

- Imagem principal usa `aspect-ratio: 1 / 1`.
- Removido `height` HTML conflitante da imagem principal.
- Mobile validado com imagem de `356×356`.
- Layout desktop preservado.

### Filtros do catálogo

- Desktop mantém painel inline em grid.
- Mobile usa painel em uma coluna, com espaçamento reduzido.
- Botão informa estado por `aria-expanded`.
- Ao abrir, foco vai para primeiro campo.
- `Escape` fecha painel e devolve foco ao botão.
- Aplicar e Limpar fecham painel.
- Formulário possui `aria-label="Filtros do catálogo"`.
- Contratos de URL e regras de filtragem permanecem inalterados.

### Feedback de adição à sacola

- `role="status"` e `aria-live="polite"` foram preservados.
- Botão muda para `Adicionado à sacola` após sucesso.
- Estado visual usa apenas cor/borda discreta, sem animação chamativa.
- Link `Ver sacola` aparece junto ao feedback para acesso direto.
- Contador do header continua refletindo quantidade atual.
- Troca de variante limpa feedback e estado visual anterior.

### Breadcrumb de produto

- Breadcrumb permanece presente em todas as larguras.
- Mobile usa gaps menores e line-height controlado.
- Nome atual pode quebrar sem truncamento, usando `overflow-wrap: anywhere`.
- `aria-label="Navegação estrutural"` e `aria-current="page"` preservados.
- Links continuam acessíveis por teclado.

### Fase 3: responsividade visual

- Hero mobile mantém composição atual, com imagem reposicionada por `clamp()` e sem overflow horizontal em `320px`.
- Catálogo preserva três colunas quando cards mantêm pelo menos `180px`; usa duas colunas com mínimo de `160px` e uma coluna abaixo de `420px`.
- Drawer usa `100dvh`; rodapé recebe `safe-area-inset-bottom` em telas pequenas.
- WhatsApp mantém função e posição responsiva; fica atrás do drawer pela hierarquia de camadas existente.

### Fase 4: consistência estrutural

- Estados reutilizáveis agora usam tokens semânticos para conteúdo sobre marca/overlay, scrim, superfície de imagem, sucesso, borda de hover, borda do hero e escala de ícones.
- Temas dark/light recebem tokens equivalentes.
- Ícones lineares compartilham `--icon-size` e `--icon-stroke-width`; SVGs preservados.
- Navegação futura permanece sem alteração: `SOBRE NÓS`, `CONTATO`, busca e conta aguardam decisão de roadmap.

### Fase 4: validação Playwright MCP

- Desktop `1280×720` e mobile `390×844` validados sem overflow horizontal.
- Escala dos ícones confirmada em `21px`, stroke `1.7px`.
- Alternância dark/light validada sem quebra visual observada.
- Filtros confirmados com `aria-expanded`, foco no primeiro campo, fechamento por `Escape` e retorno de foco ao botão.
- Navegação “em breve” permaneceu inalterada.
- Console Playwright sem erros durante validação.

## Validação realizada

### Testes automatizados

- `npm run lint` executado com sucesso após cada grupo de alterações.
- Testes focados de catálogo, produto, galeria e variantes executados com sucesso.
- Últimos grupos validados:
  - `CatalogPage.test.tsx`: 9 testes.
  - `ProductPage.test.tsx`: 4 testes.
  - `ProductGallery.test.tsx`: 1 teste.
  - `ProductVariantSelector.test.tsx`: 4 testes.

Validação anterior também confirmou build e suíte completa: 28 arquivos e 94 testes aprovados.

### Playwright MCP

Viewports usados:

- Desktop: `1280×720`.
- Mobile: `390×844`.

Verificações realizadas:

- Sem overflow horizontal nas páginas alteradas.
- Prioridade e lazy loading das imagens do catálogo.
- Proporção da galeria mobile.
- Abertura, fechamento, Escape, foco e `aria-expanded` dos filtros.
- Feedback de adição, contador, `aria-live` e link para sacola.
- Quebra do breadcrumb e preservação de nome longo.
- Composição hero em `320×800`.
- Densidade catálogo em `390×844` e `700×844`.
- Altura e rodapé drawer em `390×844`.

## Duplicações preservadas intencionalmente

- Containers de storefront, catálogo, produto e carrinho mantêm diferenças de largura por função e densidade.
- Gaps e paddings específicos permanecem locais quando expressam hierarquia ou necessidade responsiva distinta.
- Cores de fotografia, gradientes de marca e scrims com opacidades diferentes não foram artificialmente unificadas.

## Pendências dependentes de roadmap

- `SOBRE NÓS` e `CONTATO` continuam como “Disponível em breve”.
- Busca e conta continuam desabilitadas com feedback “disponível em breve”.
- Nenhum item foi removido ou implementado nesta fase.

## Publicação

- Documentação atualizada após validação da Fase 4.
- Push para GitHub pendente de execução nesta sessão.

## Pendências e observações

- Playwright registrou `404` para `/favicon.ico`. Problema existente de recurso estático, fora do escopo desta auditoria.
- Não foi introduzida auditoria Lighthouse/axe automatizada. Recomenda-se etapa posterior para métricas de LCP, CLS, INP e cobertura ampliada de acessibilidade.
- A estratégia de imagens continua baseada nos assets atuais; otimização de formato, CDN ou pipeline permanece fora do escopo.

## Critério de conclusão

Melhorias desta etapa podem ser consideradas concluídas quando lint, testes focados e validação Playwright permanecerem aprovados, sem regressões nos contratos de catálogo, no fallback de imagens, na navegação por teclado ou nos estados de erro/retry.
