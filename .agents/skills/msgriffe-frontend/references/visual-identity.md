# Identidade visual e padrões atuais

Este documento registra apenas decisões observáveis no frontend atual. A fonte de verdade continua sendo [`src/shared/styles/tokens.css`](../../../../src/shared/styles/tokens.css), [`src/shared/styles/global.css`](../../../../src/shared/styles/global.css) e os assets existentes.

## Referências visuais

Consultar antes de criar ou substituir visuais:

- [`public/images/hero_products.png`](../../../../public/images/hero_products.png): composição de produtos sobre fundo grafite, com contraste preto/branco e acentos de azul nas peças.
- [`public/images/msGriffeLogo.png`](../../../../public/images/msGriffeLogo.png): logo usada no header atual.
- [`imgs/msGrifeCatalogo.png`](../../../../imgs/msGrifeCatalogo.png): referência histórica do catálogo, com header preto, navegação clara, indicador dourado ativo, cards escuros e grade densa.
- [`imgs/msGrife.png`](../../../../imgs/msGrife.png), [`imgs/msGrifeWhite.png`](../../../../imgs/msGrifeWhite.png) e [`imgs/msGrifeAnalitcs.png`](../../../../imgs/msGrifeAnalitcs.png): referências históricas adicionais de marca e produto.

## Direção da marca

- Masculina, premium, minimalista e direta.
- Preto/grafite como base estrutural.
- Branco para leitura principal e contraste.
- Dourado como acento de marca, destaque ativo, CTA e preço — não como preenchimento dominante.
- Imagens de produto com composição limpa, fundo neutro/escuro e foco no item.
- Superfícies discretamente elevadas por borda, sombra e contraste tonal; evitar decoração excessiva.

Não introduzir cores vibrantes, efeitos chamativos, estética playful, gradientes dominantes, glassmorphism ou ornamentos que não estejam alinhados aos tokens e assets atuais sem justificativa explícita.

## Temas

O tema escuro é a referência principal: fundo profundo, superfícies grafite, texto claro, bordas discretas e dourado luminoso.

O tema claro deve preservar a mesma hierarquia: superfícies claras, texto escuro, bordas neutras e dourado mais escuro para legibilidade. As duas variações estão definidas nos tokens; não inverter cores manualmente em componentes.

Use os tokens de `tokens.css` em vez de cores ad hoc. Qualquer novo token deve ter função semântica clara e manter contraste suficiente nos dois temas.

## Tipografia e hierarquia

- A implementação atual usa uma sans-serif de sistema baseada em `Inter`.
- Títulos são fortes, frequentemente uppercase, com tracking controlado e alto contraste.
- Eyebrows e labels usam escala menor, peso alto e espaçamento de letras para orientação.
- Corpo, descrições, parcelamento e textos auxiliares devem permanecer legíveis e subordinados ao título/preço.
- Preço é um dos focos visuais do card e do detalhe do produto; o dourado deve reforçar essa prioridade sem substituir a informação textual.
- Não trocar a família tipográfica nem introduzir uma segunda família sem decisão explícita de produto/marca.

## Espaçamento, layout e responsividade

- Reutilizar containers, gaps, paddings, breakpoints, raios e sombras já definidos em `global.css`.
- Preservar o ritmo espaçado do storefront e a maior densidade informacional do catálogo.
- O catálogo usa grade responsiva: múltiplas colunas em desktop, redução progressiva em tablet e adaptação para mobile.
- O detalhe do produto prioriza galeria e informações em desktop e empilha essas áreas em telas menores.
- O header reduz navegação para menu móvel; o drawer da sacola ocupa a lateral e mantém foco gerenciado.
- Não criar scroll horizontal, esconder conteúdo essencial atrás de elementos fixos ou desabilitar zoom.
- Validar mudanças nos tamanhos realmente afetados; usar 375px, 768px, 1024px e 1440px somente quando a alteração for responsiva ou global.

## Padrões de componentes

- Header: fundo escuro/translúcido, logo, navegação textual, ações com ícones SVG e estado ativo dourado.
- Hero: copy curta e forte, CTA primário único e composição fotográfica de produtos.
- Benefit strip: informações curtas, ícones lineares e separadores discretos.
- Product card: imagem dominante, nome, preço, parcelamento e superfície escura/contida.
- Catálogo: heading contextual, busca, filtros, ordenação, contagem, grade, estados de loading/erro/vazio e paginação.
- Produto: breadcrumb, galeria, título, categoria, preço, descrição, seleção de variantes e CTA de compra.
- Sacola: drawer acessível, resumo persistente no contexto, itens com quantidade/remover e estado vazio claro.
- Botões, icon buttons, badges, skeletons e fallback de imagem devem reutilizar os componentes compartilhados existentes.

## Padrões que não devem mudar sem justificativa

- Paleta base preto/grafite, branco e dourado.
- Existência dos temas escuro e claro e sua equivalência de hierarquia.
- Organização frontend por feature/domínio.
- Uso de tokens CSS e componentes compartilhados antes de estilos locais.
- Tratamento de foco, teclado, `aria-live`, dialogs e `prefers-reduced-motion`.
- Linguagem de ícones SVG linear e consistente.
- Catálogo visualmente limpo, orientado a produto, com preço e imagem como focos.
- Separação entre conteúdo de storefront, catálogo, produto e carrinho.
- Avisos de que preços, estoque, frete, descontos e total exibidos no frontend podem ser apenas projeções até confirmação do backend.

Quando uma nova necessidade não estiver coberta aqui, consultar primeiro a implementação atual e os documentos de arquitetura/contexto. Não preencher lacunas com uma nova direção visual por suposição.
