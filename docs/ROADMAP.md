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
| F2 — Catálogo, busca e produto | Concluída em 2026-08-09 | Jornada pública de descoberta de produtos completa. |
| F3 — Carrinho e checkout visual | Em andamento | Jornada demonstrável de preparação da compra. |
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

Estado: **concluída em 9 de agosto de 2026**.

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
| F2.10 | Encerramento da F2 | Concluída | Quality gate, smoke test e revisão multitelas. |

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

### F2.10 — Encerramento da F2

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F2.10.1 | Congelar o escopo entregue | Concluída | Capacidades, limites e pendências da F2 ficam registrados sem antecipar a F3. |
| F2.10.2 | Reforçar Cloudflare Pages | Concluída | Build inclui fallback SPA e headers defensivos compatíveis com a aplicação. |
| F2.10.3 | Revisar segurança OWASP | Concluída | Exposição, dependências, navegação e conteúdo público passam por checklist proporcional ao risco. |
| F2.10.4 | Executar smoke test | Concluída | Raiz, catálogo, categorias, produto, rota inexistente e assets respondem no preview de produção. |
| F2.10.5 | Validar múltiplas telas | Concluída | Jornadas críticas são verificadas em 390, 768, 1024 e 1440 px. |
| F2.10.6 | Executar quality gate final | Concluída | Lint, testes, cobertura, build e audit permanecem aprovados. |
| F2.10.7 | Encerrar e versionar | Concluída | F2 e F2.10 ficam concluídas, documentação atualizada e commit próprio criado. |

Escopo:

- revisar entregas e limitações intencionais da jornada pública;
- configurar headers de segurança no artefato do Cloudflare Pages;
- validar fallback de SPA e acessos diretos no build final;
- revisar catálogo e produto em mobile, tablet, notebook e desktop;
- registrar métricas, riscos remanescentes e passagem para F3;
- criar commit exclusivo após todas as verificações.

Registro:

- escopo público da F2 congelado em catálogo, busca, filtros, categorias, detalhes, variantes e estados resilientes;
- carrinho, checkout, autenticação e regras comerciais autoritativas permanecem fora da F2;
- `_headers` adiciona CSP estrita, HSTS, proteção contra framing e MIME sniffing, política de referência e restrições de capacidades;
- estilos inline funcionais foram removidos para evitar `unsafe-inline` na CSP;
- futura API deverá ser autorizada explicitamente em `connect-src`, sem curingas;
- busca por padrões de segredo e APIs de injeção não encontrou ocorrências no código da aplicação;
- smoke test aprovou raiz, catálogo, categorias, categoria, produto, 404 da SPA e placeholder por acesso direto;
- `_redirects` e `_headers` confirmados no artefato final do Cloudflare Pages;
- matriz visual aprovada em 390×844, 768×1024, 1024×900 e 1440×1000;
- build final possui aproximadamente 1 MB total, JavaScript de 234 KB e CSS de 22 KB antes de gzip;
- encerramento com 67 testes, 98,02% de statements, 90,4% de branches, 98,86% de funções e 98,31% de linhas;
- lint, build e audit aprovados, com zero vulnerabilidades conhecidas.

Resultado da F2:

- jornada navegável da vitrine ao catálogo, categoria e detalhe;
- contratos e adaptadores simulados isolam a futura API;
- URLs representam busca, filtros, ordenação e paginação;
- acessibilidade, SEO, resiliência, segurança do frontend e responsividade possuem verificações automatizadas ou registradas;
- a próxima fase pode implementar carrinho e checkout visual sem transferir regras financeiras autoritativas ao navegador.

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

Estado: **em andamento**.

Objetivo: construir uma jornada demonstrável de preparação da compra com estado local não sensível e contratos substituíveis, sem afirmar que cálculos ou pagamentos são autoritativos antes do backend.

Limites de segurança:

- nenhum dado sensível, credencial, token, CPF, endereço ou pagamento será persistido no navegador;
- preços e totais locais são apenas demonstrativos e deverão ser recalculados pelo backend;
- conteúdo recuperado do armazenamento local será tratado como entrada não confiável;
- ações financeiras continuarão simuladas e explicitamente identificadas.

### Andamento da F3

| ID | Entrega | Estado | Critério principal |
| --- | --- | --- | --- |
| F3.1 | Fundação do carrinho | Concluída | Domínio, persistência validada e provider independentes da interface. |
| F3.2 | Adição e feedback | Concluída | Variante selecionada entra na sacola e o cabeçalho informa a quantidade. |
| F3.3 | Drawer da sacola | Concluída | Resumo lateral acessível permite revisar e alterar itens. |
| F3.4 | Página do carrinho | Concluída | Itens, quantidades, remoção e estados vazios funcionam em rota própria. |
| F3.5 | Cálculos demonstrativos | Concluída | Subtotal, descontos, frete estimado e total usam serviço substituível. |
| F3.6 | Identificação progressiva | Pendente | Conta e dados pessoais possuem fluxo visual sem persistência sensível indevida. |
| F3.7 | Endereço e entrega | Pendente | Coleta e seleção visual de entrega têm validação e estados definidos. |
| F3.8 | Cupom, pagamento e revisão | Pendente | Opções comerciais e revisão são demonstráveis sem operação financeira real. |
| F3.9 | Estados simulados do pedido | Pendente | Pendente, aprovado, recusado, expirado e erro têm representação inequívoca. |
| F3.10 | Encerramento da F3 | Pendente | Jornadas, OWASP, multitelas, smoke test e commit final aprovados. |

### F3.1 — Fundação do carrinho

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.1.1 | Definir modelos do carrinho | Concluída | Modelos não dependem de React, armazenamento ou futura API. |
| F3.1.2 | Implementar operações puras | Concluída | Adição, quantidade e remoção são imutáveis, limitadas e testáveis. |
| F3.1.3 | Definir porta de persistência | Concluída | Interface pequena permite trocar `localStorage` por backend. |
| F3.1.4 | Criar adapter local seguro | Concluída | Dados inválidos, versões desconhecidas e JSON malformado são descartados. |
| F3.1.5 | Criar provider e hook | Concluída | Estado e ações são injetados sem acoplar componentes ao adapter. |
| F3.1.6 | Integrar composição | Concluída | Aplicação inicializa a sacola sem alterar ainda a jornada visual. |
| F3.1.7 | Testar, validar e versionar | Concluída | Domínio, adapter, provider, quality gate e commit próprio são aprovados. |

Escopo:

- armazenar somente snapshots públicos necessários dos itens;
- limitar quantidades para reduzir abuso e estados inviáveis;
- validar toda leitura do armazenamento local;
- persistir mudanças de forma isolada;
- preparar as ações de adicionar, alterar e remover para a F3.2–F3.4;
- manter a UI atual sem habilitar prematuramente a compra.

Registro:

- modelos armazenam apenas snapshots públicos de produto, variante e quantidade;
- operações puras adicionam, incrementam, limitam, alteram, removem e calculam totais sem mutação;
- subtotal demonstrativo é acumulado em centavos para evitar erro de ponto flutuante;
- quantidade por item é limitada a dez unidades;
- porta `CartRepository` mantém domínio e provider independentes do `localStorage`;
- adapter versionado limita tamanho e número de itens e rejeita JSON, texto, IDs, duplicatas, caminhos, preços e quantidades inválidos;
- falha ou bloqueio do armazenamento não interrompe o estado em memória;
- `CartProvider` expõe ações e totais por hook e foi integrado na composição da aplicação;
- nenhum dado pessoal, credencial ou informação de pagamento é persistido;
- etapa sem alteração visual; permanece válida a matriz multitelas da F2.10;
- encerramento com 79 testes, 97,4% de statements, 90,9% de branches, 98,06% de funções e 98,16% de linhas;
- lint e build aprovados e zero vulnerabilidades no npm audit.

### F3.3 — Drawer da sacola

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.3.1 | Definir comportamento modal | Concluída | Foco entra, fica contido, fecha por Escape e retorna ao acionador. |
| F3.3.2 | Criar item reutilizável | Concluída | Imagem, variante, preço, quantidade e remoção ficam isolados do drawer. |
| F3.3.3 | Implementar resumo lateral | Concluída | Sacola cheia apresenta itens e subtotal demonstrativo. |
| F3.3.4 | Implementar estado vazio | Concluída | Sacola vazia orienta retorno ao catálogo e fecha o drawer ao navegar. |
| F3.3.5 | Habilitar cabeçalho | Concluída | Botão global abre o drawer e mantém quantidade e nome acessível. |
| F3.3.6 | Proteger interação de fundo | Concluída | Backdrop e bloqueio de rolagem evitam interação acidental fora do contexto. |
| F3.3.7 | Testar, revisar e versionar | Concluída | Teclado, operações, OWASP, multitelas e commit próprio são aprovados. |

Escopo:

- abrir o drawer pelo botão global da sacola;
- listar snapshots públicos persistidos;
- aumentar, reduzir e remover itens pelos casos de uso do provider;
- exibir subtotal apenas como estimativa local;
- não coletar dados pessoais nem iniciar checkout nesta etapa;
- preparar componentes reutilizáveis para a página completa da F3.4.

Registro:

- `useModalDialog` concentra entrada, contenção e retorno de foco, fechamento por `Escape`, bloqueio de rolagem e isolamento do conteúdo de fundo;
- `CartLineItem` isola imagem, variante, preço, alteração limitada de quantidade e remoção para reutilização na F3.4;
- drawer apresenta lista, subtotal demonstrativo e ação futura de checkout explicitamente indisponível;
- estado vazio conduz ao catálogo e encerra o contexto modal;
- botão global da sacola abre o drawer e preserva nome acessível com a quantidade atual;
- fundo recebe backdrop e `inert` enquanto o diálogo está aberto, reduzindo interação acidental e navegação de teclado fora do modal;
- testes cobrem abertura, fechamento, retorno e contenção de foco, `Escape`, estado vazio, itens, quantidade, remoção e acessibilidade automatizada;
- matriz visual aprovada em 390×1200, 768×1200, 1024×900 e 1440×1000;
- varredura não encontrou APIs de injeção ou padrões de segredo e o npm audit permaneceu limpo;
- encerramento com 86 testes, 97,25% de statements, 90,06% de branches, 98,69% de funções e 98,2% de linhas;
- lint e build de produção aprovados e zero vulnerabilidades no npm audit.

### F3.4 — Página do carrinho

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.4.1 | Definir rota e metadados | Concluída | `/sacola` possui título, descrição e destino estável no frontend. |
| F3.4.2 | Reutilizar item da sacola | Concluída | Página altera quantidade e remove itens sem duplicar regra de domínio. |
| F3.4.3 | Implementar resumo | Concluída | Quantidade e subtotal demonstrativo ficam claros, sem afirmar valor autoritativo. |
| F3.4.4 | Implementar estado vazio | Concluída | Página vazia orienta retorno ao catálogo sem becos sem saída. |
| F3.4.5 | Conectar drawer | Concluída | Drawer cheio oferece navegação para a página e encerra o modal corretamente. |
| F3.4.6 | Garantir responsividade e acessibilidade | Concluída | Hierarquia, foco e layout funcionam por teclado e na matriz multitelas. |
| F3.4.7 | Testar, revisar e versionar | Concluída | Jornada, OWASP, qualidade, build e commit próprio são aprovados. |

Escopo:

- criar a rota própria `/sacola` sem iniciar checkout ou coletar dados pessoais;
- reutilizar `CartLineItem` e as ações do provider;
- apresentar itens e resumo demonstrativo em regiões semanticamente identificadas;
- manter a operação financeira futura desabilitada e explicitamente sinalizada;
- oferecer estados cheio e vazio com caminhos claros para continuar comprando;
- preservar os limites e a validação de persistência definidos na F3.1.

Registro:

- rota `/sacola` foi adicionada à composição principal com título, descrição, canonical e `noindex, nofollow`;
- `CartPage` mantém somente responsabilidade de apresentação e orquestra as ações já expostas pelo provider;
- `CartLineItem` é compartilhado entre drawer e página, sem duplicar limites, cálculo ou persistência;
- estado cheio apresenta região de produtos, quantidade, subtotal demonstrativo e resumo separado;
- checkout permanece desabilitado e valores locais são identificados como estimativas sujeitas à confirmação do backend;
- estados cheio e vazio oferecem retorno ao catálogo, e o drawer cheio navega para a página fechando o diálogo;
- testes cobrem rota, metadados, estados, quantidade, subtotal, remoção, persistência e jornada drawer–página;
- acessibilidade automatizada foi aprovada na página cheia e a navegação de rota mantém gerenciamento de foco;
- estados cheio e vazio foram revisados em 390×1200, 768×1200, 1024×900 e 1440×1000;
- varredura não encontrou APIs de injeção ou persistência de dados sensíveis e o npm audit permaneceu limpo;
- encerramento com 89 testes, 97,44% de statements, 90,15% de branches, 99,13% de funções e 98,22% de linhas;
- lint e build de produção aprovados e zero vulnerabilidades no npm audit.

### F3.5 — Cálculos demonstrativos

Estado: **concluída em 11 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.5.1 | Definir contrato de precificação | Concluída | Interface recebe o carrinho e devolve valores sem depender de React ou infraestrutura. |
| F3.5.2 | Implementar simulador configurável | Concluída | Regras provisórias operam em centavos, com limites válidos e testes de borda. |
| F3.5.3 | Injetar serviço no provider | Concluída | Componentes consomem resumo calculado sem conhecer o adapter utilizado. |
| F3.5.4 | Evoluir resumo da página | Concluída | Subtotal, desconto, frete estimado e total exibem origem demonstrativa inequívoca. |
| F3.5.5 | Manter resumo do drawer enxuto | Concluída | Drawer continua rápido e não antecipa regras detalhadas da página. |
| F3.5.6 | Garantir responsividade e acessibilidade | Concluída | Valores e avisos mantêm hierarquia legível por teclado e na matriz multitelas. |
| F3.5.7 | Testar, revisar e versionar | Concluída | Domínio, integração, OWASP, qualidade, build e commit próprio são aprovados. |

Escopo:

- criar uma porta substituível para o futuro cálculo autoritativo do backend;
- calcular internamente em centavos e arredondar de forma determinística;
- usar regras locais explicitamente demonstrativas, sem constituir oferta comercial;
- limitar percentuais e valores configuráveis para evitar estados inválidos;
- não coletar CEP, dados pessoais ou forma de pagamento nesta etapa;
- manter o backend como responsável final por preço, desconto, frete, estoque e total.

Regras provisórias da simulação:

- `PROV-001`: desconto demonstrativo de 5% a partir de R$ 200,00;
- `PROV-002`: frete padrão estimado de R$ 19,90;
- `PROV-003`: frete demonstrativo gratuito a partir de R$ 300,00;
- regras deverão ser substituídas após definição comercial do vendedor e integração com o backend.

O estado e os responsáveis por essas decisões estão centralizados no checklist da seção 14.3 de [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).

Registro:

- `CartPricingService` define uma porta pequena, independente de React, persistência e infraestrutura;
- `DemonstrationCartPricingService` recebe regras por construtor e rejeita percentuais, limites e valores monetários inválidos;
- subtotal, desconto, frete e total são calculados em centavos com arredondamento determinístico;
- carrinho vazio não gera frete, desconto ou total artificiais;
- provider recebe o serviço por injeção e expõe o resultado sem acoplar componentes ao adapter demonstrativo;
- página apresenta lista semântica de valores, desconto aplicado, frete estimado ou gratuito e total demonstrativo;
- aviso declara que a simulação do frontend não constitui oferta e que o backend confirmará todos os valores;
- drawer permaneceu com subtotal enxuto e direciona à página para detalhes;
- testes cobrem carrinho vazio, frete padrão, desconto, arredondamento, frete gratuito, regras inválidas e atualização reativa;
- matriz visual aprovada em 390×1200, 768×1200, 1024×900 e 1440×1000;
- varredura não encontrou APIs de injeção ou persistência de dados sensíveis e o npm audit permaneceu limpo;
- encerramento com 94 testes, 97,5% de statements, 90,55% de branches, 99,14% de funções e 98,27% de linhas;
- lint e build de produção aprovados e zero vulnerabilidades no npm audit.

### F3.2 — Adição e feedback

Estado: **concluída em 9 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.2.1 | Controlar variante selecionada | Concluída | Página conhece exatamente a combinação escolhida e nunca presume variante indisponível. |
| F3.2.2 | Mapear produto para carrinho | Concluída | Snapshot público contém apenas campos permitidos pelo domínio do carrinho. |
| F3.2.3 | Habilitar ação no detalhe | Concluída | Botão adiciona a variante disponível e respeita o limite do domínio. |
| F3.2.4 | Exibir feedback acessível | Concluída | Confirmação é visível e anunciada sem modal ou interrupção de foco. |
| F3.2.5 | Atualizar badge global | Concluída | Cabeçalho reflete a soma das quantidades persistidas. |
| F3.2.6 | Preservar limites dos cards | Concluída | Cards continuam navegando ao detalhe sem escolher variante automaticamente. |
| F3.2.7 | Testar, revisar e versionar | Concluída | Interação, persistência, OWASP, multitelas e commit próprio são aprovados. |

Escopo:

- tornar o seletor de variantes controlado pela página;
- adicionar somente variantes existentes e disponíveis;
- persistir apenas snapshot público já validado na F3.1;
- confirmar a ação por região `status`;
- refletir quantidade no cabeçalho sem abrir ainda o drawer;
- manter preço e disponibilidade como informações demonstrativas.

Registro:

- `ProductVariantSelector` passou a ser controlado e informa sempre o ID exato da combinação;
- `ProductPurchasePanel` concentra seleção, mapeamento, adição e feedback sem transferir persistência à página;
- somente variante existente e disponível habilita a ação;
- snapshot contém ID, slug, nome, imagem, preço demonstrativo, cor, tamanho e ID da variante;
- confirmação usa região `status` e preserva o foco do usuário;
- espaço do feedback permanece reservado para evitar salto visual;
- badge do cabeçalho soma quantidades e usa singular/plural no nome acessível;
- nesta etapa, o botão do cabeçalho permaneceu sem ação até a entrega do drawer na F3.3;
- cards continuam sem adição rápida para não presumir cor ou tamanho;
- varredura não encontrou APIs de injeção ou padrões de segredo e o npm audit permaneceu limpo;
- matriz visual aprovada em 390×1200, 768×1200, 1024×900 e 1440×1000;
- encerramento com 81 testes, 97,31% de statements, 90,62% de branches, 98,11% de funções e 98,22% de linhas;
- lint e build aprovados e zero vulnerabilidades no npm audit.

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
