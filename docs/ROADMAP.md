# Roadmap — msGriffe

> Fonte única para planejamento, execução e acompanhamento das fases do projeto.
>
> Última atualização: 9 de agosto de 2026.

## Convenções

- **F** identifica trabalho de frontend;
- **B** identifica trabalho de backend;
- identificadores hierárquicos representam entregas menores, como `F2.3` e `B4.2`;
- cada nova etapa deve receber objetivo, passos, dependências e critérios de aceite neste documento antes da implementação;
- o estado deve ser atualizado durante a execução;
- uma etapa só é concluída depois de código, testes, validação e documentação aplicáveis;
- segurança deve observar o OWASP Top 10 e controles aplicáveis do OWASP ASVS;
- mudanças visuais devem ser validadas nos tamanhos relevantes de mobile, tablet, notebook e desktop;
- cada etapa concluída deve gerar um commit próprio depois do quality gate, sem segredos ou artefatos gerados.

Estados utilizados:

```text
Pendente → Em andamento → Concluída
```

## Visão geral

| Fase | Estado | Resultado esperado |
| --- | --- | --- |
| F0 — Fundação técnica | Concluída em 2026-08-07 | React, TypeScript, Vite, qualidade e Cloudflare Pages preparados. |
| F1 — Design system e vitrine | Concluída em 2026-08-07 | Página inicial modular, responsiva, acessível e testada. |
| F2 — Catálogo, busca e produto | Em andamento | Jornada pública de descoberta de produtos completa. |
| F3 — Carrinho e checkout visual | Pendente | Jornada demonstrável de preparação da compra. |
| F4 — Conta e pós-compra | Pendente | Área do cliente, autenticação visual e pedidos. |
| F5 — Painel do vendedor | Pendente | Operação administrativa demonstrável. |
| F6 — Integração preparada e qualidade | Pendente | Contratos estabilizados e frontend pronto para API real. |
| B0 — Arquitetura e contratos | Pendente | Fundação técnica do backend. |
| B1 — Identidade e autorização | Pendente | Contas, sessões, papéis e proteção administrativa. |
| B2 — Catálogo, preços e estoque | Pendente | Domínio comercial e persistência do catálogo. |
| B3 — Carrinho e cálculo comercial | Pendente | Carrinho, cupons, frete e totais autoritativos. |
| B4 — Pedidos e Mercado Pago | Pendente | Núcleo transacional da compra. |
| B5 — Operação e comunicação | Pendente | Dashboard, e-mails, auditoria e observabilidade. |
| B6 — Integração frontend-backend | Pendente | Substituição dos simuladores pela API. |
| B7 — Preparação de produção | Pendente | Segurança, recuperação, go-live e monitoramento. |

## F0 — Fundação técnica

Estado: **concluída**.

Entregas:

- aplicação React com TypeScript e Vite;
- npm, lint, testes e build de produção;
- estrutura inicial por feature e responsabilidade;
- assets públicos organizados;
- fallback de SPA para Cloudflare Pages;
- configuração documentada de preview, staging e produção.

## F1 — Design system e vitrine

Estado: **concluída**.

| ID | Entrega | Estado |
| --- | --- | --- |
| F1.1 | Decompor o HTML monolítico | Concluída |
| F1.2 | Organizar por feature e responsabilidade | Concluída |
| F1.3 | Definir tokens semânticos | Concluída |
| F1.4 | Implementar temas claro e escuro | Concluída |
| F1.5 | Consolidar componentes fundamentais | Concluída |
| F1.6 | Refinar cabeçalho e navegação responsiva | Concluída |
| F1.7 | Refinar hero, benefícios e destaques | Concluída |
| F1.8 | Revisar acessibilidade | Concluída |
| F1.9 | Ampliar testes da vitrine | Concluída |
| F1.10 | Validar e encerrar a fase | Concluída |

Resultado:

- 20 testes;
- 98,94% de statements, 92,18% de branches, 100% de funções e 98,86% de linhas;
- auditoria axe nos temas claro e escuro;
- revisão headless em desktop e mobile;
- smoke test da raiz e do fallback de SPA;
- correção do flash inicial de tema e do logo no tema claro.

Limitações intencionais ao final da F1:

- busca, conta e sacola ainda não funcionais;
- WhatsApp depende de número brasileiro válido na configuração;
- catálogo completo e produto pertencem à F2.

## F2 — Catálogo, busca e produto

Estado: **em andamento**.

Objetivo: construir catálogo, filtros, ordenação, busca, categorias e detalhes usando contratos que permitam substituir dados simulados pela API sem reescrever a interface.

Dependências e limites:

- F1 concluída;
- `imgs/msGrifeCatalogo.png` é a referência principal;
- dados atuais são demonstrativos;
- catálogo não assume responsabilidades de carrinho ou checkout;
- regras comerciais e estoque real continuam dependentes do backend e do vendedor.

### Andamento da F2

| ID | Entrega | Estado | Critério principal |
| --- | --- | --- | --- |
| F2.1 | Fundação e roteamento | Concluída | Rotas, `CatalogReader` e adaptador simulado independentes da interface. |
| F2.2 | Página de catálogo | Concluída | Cabeçalho, toolbar, grid, estados e paginação responsivos. |
| F2.3 | Filtros e ordenação | Concluída | Categoria, preço, ordenação e página sincronizados com a URL. |
| F2.4 | Busca | Concluída | Busca acessível com URL, debounce e estados completos. |
| F2.5 | Categorias | Concluída | Navegação e páginas de categoria com URLs estáveis. |
| F2.6 | Detalhe do produto | Concluída | Galeria, variantes, preço, parcelamento e disponibilidade. |
| F2.7 | Estados e resiliência | Concluída | Ausência de imagem, item inexistente e recuperação de falhas. |
| F2.8 | Acessibilidade e SEO | Concluída | Foco, metadados, headings e conteúdo rastreável por rota. |
| F2.9 | Testes da jornada | Concluída | Jornada e contratos críticos cobertos proporcionalmente ao risco. |
| F2.10 | Encerramento da F2 | Pendente | Quality gate, smoke test e revisão desktop/mobile. |

### Registro F2.1

- Wouter 3.10.0 adotado para roteamento;
- React Router removido antes do uso devido a alertas altos nas versões disponíveis;
- porta `CatalogReader`, modelos e `MockCatalogAdapter` implementados;
- composição da dependência isolada em `app/dependencies.ts`;
- rotas de início, catálogo, produto, categoria e 404 criadas;
- encerramento com 28 testes, cobertura global acima de 90% e audit limpo.

### Registro F2.2

- grid de cinco colunas até uma coluna;
- toolbar, contagem, paginação e estados de carregamento, vazio e erro;
- 12 produtos simulados usando as quatro imagens individuais disponíveis;
- revisão headless em 1440×1000 e 390×844;
- encerramento com 32 testes, cobertura acima de 91% e audit limpo.

### Registro F2.3

- URL como fonte canônica de categoria, faixa de preço, ordenação e página;
- parser defensivo e serialização sem parâmetros padrão;
- filtros responsivos com aplicação, validação e limpeza;
- ordenação por recentes, menor preço, maior preço e nome;
- revisão headless de URL filtrada em desktop e mobile;
- encerramento com 39 testes, 97,57% de statements, 91,01% de branches, 97,93% de funções, 97,36% de linhas e audit limpo.

### F2.4 — Busca

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F2.4.1 | Estender estado canônico da URL | Concluída | Termo válido usa `busca` e valores vazios são removidos da URL. |
| F2.4.2 | Criar controle de busca | Concluída | Campo possui rótulo, envio explícito, limpeza e ícones acessíveis. |
| F2.4.3 | Implementar debounce | Concluída | Digitação atualiza a consulta após 300 ms e desmontagem cancela tarefas pendentes. |
| F2.4.4 | Integrar com catálogo | Concluída | Busca combina com filtros e ordenação e reinicia a página. |
| F2.4.5 | Tratar ausência de resultados | Concluída | Mensagem informa o termo e oferece limpeza da busca. |
| F2.4.6 | Testar e validar | Concluída | URL, debounce, envio, limpeza e resultados passam no quality gate. |

Escopo:

- campo de busca acessível;
- termo persistido na URL;
- atraso de 300 ms para evitar consultas excessivas;
- integração com filtros, ordenação e paginação;
- estados sem resultado e erro;
- testes e revisão responsiva.

Registro:

- `busca` incorporada ao parser e serializador da URL;
- controle com envio por formulário, limpeza e atraso de 300 ms;
- hook de debounce cancela tarefas na desmontagem e mantém o callback atual;
- busca combina com categoria, preço e ordenação, reiniciando a página;
- ausência de resultados informa o termo e permite limpar a consulta;
- revisão headless com `?busca=premium` concluída em 1440×1000 e 390×844;
- encerramento com 44 testes, 97,89% de statements, 91,28% de branches, 98,16% de funções e 97,72% de linhas;
- lint e build aprovados e zero vulnerabilidades no npm audit.

### F2.5 — Categorias

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F2.5.1 | Definir porta de categorias | Concluída | `CategoryReader` permanece pequeno e independente de React e HTTP. |
| F2.5.2 | Criar adaptador e provider | Concluída | Categorias simuladas e contagens são acessadas por injeção de dependência. |
| F2.5.3 | Implementar índice de categorias | Concluída | `/categorias` lista destinos reais com carregamento, vazio e erro. |
| F2.5.4 | Implementar página de categoria | Concluída | `/categorias/:slug` valida a categoria e reutiliza catálogo, busca e ordenação. |
| F2.5.5 | Habilitar navegação | Concluída | Cabeçalho e cards indicam corretamente a rota ativa e seus destinos. |
| F2.5.6 | Tratar categoria inexistente | Concluída | Slug inválido recebe estado informativo e retorno para categorias. |
| F2.5.7 | Testar e validar | Concluída | Contrato, rotas, estados, navegação e responsividade passam no quality gate. |

Escopo:

- habilitar a navegação de categorias;
- listar categorias a partir de um contrato próprio;
- resolver `/categorias/:categorySlug`;
- reutilizar o catálogo com categoria canônica;
- tratar categoria inexistente;
- testar navegação, URL e responsividade.

Registro:

- porta `CategoryReader` separada do catálogo conforme segregação de interfaces;
- adaptador simulado deriva categorias, imagens e contagens da mesma fonte de produtos;
- providers e hooks mantêm composição e estados assíncronos fora das páginas;
- índice `/categorias` possui carregamento, vazio, erro e cards acessíveis;
- rota `/categorias/:categorySlug` valida o slug e reutiliza busca, filtros de preço, ordenação e paginação;
- categoria fixa não expõe novamente o seletor de categoria;
- navegação principal reconhece índice e rotas filhas como destino corrente;
- slug inexistente oferece retorno direto ao índice;
- revisão headless concluída em 1440×1000 e 390×844 no índice e no catálogo por categoria;
- encerramento com 50 testes, 97,02% de statements, 89,8% de branches, 97,67% de funções e 97,1% de linhas;
- lint e build aprovados e zero vulnerabilidades no npm audit.

### F2.6 — Detalhe do produto

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F2.6.1 | Evoluir o modelo de produto | Concluída | Detalhes e variantes permanecem independentes de React e do transporte HTTP. |
| F2.6.2 | Implementar consulta de detalhe | Concluída | Hook resolve o produto por slug com estados explícitos e cancelamento seguro. |
| F2.6.3 | Implementar galeria | Concluída | Imagem principal e miniaturas são acessíveis e responsivas. |
| F2.6.4 | Implementar informações comerciais | Concluída | Nome, categoria, preço, parcelamento, descrição e disponibilidade são claros. |
| F2.6.5 | Implementar seleção de variante | Concluída | Tamanho e cor disponíveis podem ser selecionados sem antecipar o carrinho. |
| F2.6.6 | Integrar cards e navegação | Concluída | Cards levam ao detalhe por URL estável e preservam ações com responsabilidades distintas. |
| F2.6.7 | Tratar ausência e falha | Concluída | Produto inexistente e erro de leitura oferecem saída compreensível. |
| F2.6.8 | Testar e validar | Concluída | Contrato, interação, rotas, acessibilidade básica e responsividade passam no quality gate. |

Escopo:

- resolver `/produtos/:productSlug` por meio de `CatalogReader`;
- apresentar galeria preparada para múltiplas imagens;
- exibir preço, parcelamento, descrição e disponibilidade demonstrativos;
- selecionar variante disponível sem adicionar ao carrinho nesta fase;
- conectar os cards do catálogo aos detalhes;
- tratar produto inexistente, falha e carregamento;
- testar e revisar em desktop e mobile.

Registro:

- modelo `ProductVariant` adicionado ao domínio sem dependências de interface ou transporte;
- `useProductDetails` isola consulta por slug, cancelamento e estados assíncronos;
- galeria suporta uma ou várias imagens e troca acessível por miniaturas;
- detalhe apresenta breadcrumb, categoria, nome, preço, parcelamento e descrição;
- seletor de variantes controla cor, tamanho e combinações indisponíveis;
- ação de sacola permanece explicitamente desabilitada até a F3;
- imagem e nome dos cards levam à URL estável do produto sem englobar a ação de sacola;
- estados de carregamento, produto inexistente e falha de leitura implementados;
- revisão headless concluída em 1440×1000 e 390×844, incluindo produto inexistente;
- encerramento com 54 testes, 97,17% de statements, 89,03% de branches, 98,06% de funções e 97,48% de linhas;
- lint e build aprovados e zero vulnerabilidades no npm audit.

### F2.7 — Estados e resiliência

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F2.7.1 | Criar fallback de imagem | Concluída | Um componente isolado substitui mídias quebradas sem ciclo de erro. |
| F2.7.2 | Aplicar fallback na jornada | Concluída | Cards, categorias e galeria mantêm layout e descrição adequados sem imagem. |
| F2.7.3 | Permitir repetir catálogo | Concluída | Falha de produtos pode ser consultada novamente sem recarregar toda a aplicação. |
| F2.7.4 | Permitir repetir categorias | Concluída | Índice e rota de categoria oferecem nova tentativa local. |
| F2.7.5 | Permitir repetir produto | Concluída | Detalhe com erro pode repetir a leitura mantendo o endereço atual. |
| F2.7.6 | Consolidar estados | Concluída | Carregamento, vazio, inexistente e erro usam mensagens e saídas coerentes. |
| F2.7.7 | Testar e validar | Concluída | Fallback, repetição, rotas e responsividade passam no quality gate. |

Escopo:

- fornecer imagem substituta local e independente de rede;
- impedir que uma mídia inválida quebre cards ou galeria;
- repetir leituras assíncronas no contexto da tela atual;
- manter distinção entre vazio, inexistente e erro transitório;
- cobrir recuperação por testes e revisão responsiva.

Registro:

- `ImageWithFallback` concentra o tratamento de mídia quebrada e impede repetição do fallback;
- placeholder SVG local segue a identidade visual e não depende de serviço externo;
- cards de produtos, cards de categorias, imagem principal e miniaturas usam o mesmo comportamento;
- versões de requisição permitem repetir consultas sem recarregar a aplicação ou perder a URL;
- catálogo, índice de categorias, categoria e produto oferecem recuperação local de falhas;
- vazio, inexistente e erro transitório permanecem estados semanticamente distintos;
- testes comprovam que a segunda tentativa consulta novamente o adaptador e recupera conteúdo;
- revisão headless do placeholder e do estado inexistente concluída em 800×800 e 390×844;
- encerramento com 58 testes, 97,81% de statements, 89,93% de branches, 98,78% de funções e 98,12% de linhas;
- lint e build aprovados e zero vulnerabilidades no npm audit.

### F2.8 — Acessibilidade e SEO

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F2.8.1 | Definir metadados por rota | Concluída | Título, descrição e URL canônica refletem o conteúdo atual. |
| F2.8.2 | Controlar indexação de erros | Concluída | Rotas inexistentes e entidades ausentes recebem `noindex`. |
| F2.8.3 | Gerenciar foco de navegação | Concluída | Mudanças de rota levam o foco ao conteúdo sem afetar a carga inicial. |
| F2.8.4 | Anunciar mudanças de rota | Concluída | Tecnologia assistiva recebe o título principal da nova página. |
| F2.8.5 | Adicionar dados de produto | Concluída | Detalhes válidos expõem dados estruturados rastreáveis. |
| F2.8.6 | Auditar páginas públicas | Concluída | Início, catálogo, categorias e produto passam por axe nos estados principais. |
| F2.8.7 | Testar e validar | Concluída | Metadados, foco, anúncio, semântica e build passam no quality gate. |

Escopo:

- atualizar título, descrição, canonical e diretiva de robôs por conteúdo;
- preservar uma hierarquia única de `h1` em cada rota;
- mover foco para o conteúdo após navegação interna;
- anunciar mudanças de página sem poluir visualmente a interface;
- publicar dados estruturados básicos dos produtos;
- ampliar auditorias automatizadas e revisar desktop/mobile.

Registro:

- `useDocumentMetadata` centraliza título, descrição, canonical e diretiva de robôs;
- canonical elimina parâmetros de busca e filtros para consolidar a URL principal da rota;
- páginas e entidades inexistentes recebem `noindex, nofollow`;
- `RouteAccessibility` move o foco para `main` e anuncia o `h1` após navegação interna;
- detalhes de produto publicam JSON-LD com `Product`, `Offer`, BRL e disponibilidade;
- cards usam `h2` no catálogo e `h3` na seção de destaques, respeitando o contexto;
- estados de carregamento receberam `role=status` e rótulos permitidos;
- axe não encontrou violações estruturais nos temas da página inicial, catálogo, categorias e produto;
- revisão headless concluída em 1440×1000 e 390×844 após os ajustes semânticos;
- encerramento com 64 testes, 98,03% de statements, 90,4% de branches, 98,86% de funções e 98,32% de linhas;
- lint e build aprovados e zero vulnerabilidades no npm audit.

### F2.9 — Testes da jornada

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F2.9.1 | Mapear cenários críticos | Concluída | Casos integrados cobrem descoberta, refinamento e detalhe sem repetir unidades triviais. |
| F2.9.2 | Testar descoberta até produto | Concluída | Usuário parte da vitrine, consulta o catálogo e abre um produto real. |
| F2.9.3 | Testar busca e refinamento | Concluída | Busca, ordenação e filtros preservam resultados e URL canônica da interface. |
| F2.9.4 | Testar categorias e breadcrumbs | Concluída | Índice, categoria e retorno estrutural funcionam como uma jornada contínua. |
| F2.9.5 | Testar histórico e acesso direto | Concluída | URLs compartilháveis e navegação do navegador restauram o conteúdo esperado. |
| F2.9.6 | Consolidar utilitários de teste | Concluída | Preparação comum fica isolada e os testes permanecem legíveis. |
| F2.9.7 | Executar quality gate | Concluída | Suíte integrada, cobertura, lint, build e audit encerram a etapa. |

Escopo:

- exercitar a aplicação composta com adaptadores simulados reais;
- validar URLs geradas durante busca, filtros e navegação;
- verificar metadados e conteúdo ao mudar de rota;
- cobrir acesso direto e navegação de retorno;
- evitar dependência de detalhes internos de implementação;
- manter testes determinísticos e rápidos para CI.

Registro:

- utilitário `renderAppAt` centraliza inicialização de rota, tema e armazenamento;
- jornada vitrine → catálogo → busca → ordenação → filtros → produto coberta integralmente;
- parâmetros combinados são validados na URL após refinamento;
- jornada categorias → categoria → produto → breadcrumb valida destinos e contagens;
- evento `popstate` comprova restauração de busca e ordenação por URL compartilhável;
- acesso direto ao detalhe valida conteúdo, canonical e informações comerciais;
- metadados e JSON-LD são verificados dentro da jornada, não apenas isoladamente;
- limites mínimos de cobertura elevados para 90% em statements, linhas e funções e 85% em branches;
- nenhuma mudança visual foi necessária; permanece válida a revisão responsiva da F2.8;
- encerramento com 67 testes, 98,03% de statements, 90,4% de branches, 98,86% de funções e 98,32% de linhas;
- lint e build aprovados e zero vulnerabilidades no npm audit.

## F3 — Carrinho e checkout visual

Estado: **pendente**.

- sacola em drawer e página;
- quantidades e variantes;
- subtotal, descontos, frete e total demonstrativos;
- identificação e cadastro progressivo;
- endereço, entrega, cupom e pagamento visual;
- revisão e estados de pagamento simulados.

## F4 — Conta e pós-compra

Estado: **pendente**.

- cadastro, login e verificação de e-mail;
- recuperação de senha;
- perfil e endereços;
- lista, detalhe e linha do tempo dos pedidos;
- sessão expirada e acesso negado.

## F5 — Painel do vendedor

Estado: **pendente**.

- shell administrativo;
- dashboard e seleção de período;
- pedidos, produtos, variantes, imagens, preços e estoque;
- clientes, categorias, cupons e promoções;
- configurações e auditoria;
- capacidades visuais de `SELLER` e `SUPERADMIN`.

## F6 — Integração preparada e qualidade

Estado: **pendente**.

- contratos definitivos de requests, responses e erros;
- cliente HTTP e renovação de sessão;
- adaptadores simulados e reais;
- tratamento global de falhas;
- testes críticos ponta a ponta;
- desempenho, SEO e staging no Cloudflare Pages.

## Backend — B0 a B7

### B0 — Arquitetura e contratos

- stack, banco, deploy, módulos, migrações, testes e documentação da API.

### B1 — Identidade, sessões e autorização

- cadastro, verificação, tokens, recuperação, papéis, 2FA, rate limiting e auditoria.

### B2 — Catálogo, mídia, preços e estoque

- produtos, categorias, variantes, imagens, preços, promoções, busca e movimentações.

### B3 — Clientes, carrinho e cálculo comercial

- perfil, endereços, carrinho persistido, cupons, frete e totais autoritativos.

### B4 — Pedidos e Mercado Pago

- pedido, pagamento, webhook idempotente, estoque atômico, estados e reembolso.

### B5 — Operação, comunicação e dashboard

- endpoints administrativos, métricas, Resend, alertas, auditoria e observabilidade.

### B6 — Integração frontend-backend

- substituição progressiva dos adaptadores simulados e testes em staging.

### B7 — Preparação de produção

- segurança, backup, RPO/RTO, rollback, carga, LGPD, runbooks e go-live.

## Marco entre frontend e backend

Antes da B0 deverão existir:

- mapa de rotas;
- estados de carregamento e erro;
- matriz inicial de papéis e permissões;
- contratos necessários ao frontend;
- exemplos de payloads e catálogo de erros;
- inventário atualizado das decisões pendentes do vendedor.
