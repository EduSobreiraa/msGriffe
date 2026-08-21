# Roadmap — msGriffe

> Fonte única para planejamento, execução e acompanhamento das fases do projeto.
>
> Última atualização: 20 de agosto de 2026.

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
| F3 — Carrinho e checkout visual | Concluída | Jornada demonstrável de preparação da compra. |
| F4 — Conta e pós-compra | Concluída | Área do cliente, autenticação visual e pedidos. |
| F5 — Painel do vendedor | Concluída | Operação administrativa demonstrável. |
| F6 — Integração preparada e qualidade | Concluída | Contratos estabilizados e frontend pronto para API real. |
| B0 — Arquitetura e contratos | Concluída | Fundação técnica do backend. |
| B1 — Identidade e autorização | Pendente | Contas, sessões, papéis e proteção administrativa. |
| B2 — Catálogo, preços e estoque | Pendente | Domínio comercial e persistência do catálogo. |
| B3 — Carrinho e cálculo comercial | Pendente | Carrinho, cupons, frete e totais autoritativos. |
| B4 — Pedidos e Mercado Pago | Pendente | Núcleo transacional da compra. |
| B5 — Operação e comunicação | Pendente | Dashboard, WhatsApp, auditoria e observabilidade. |
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
- `Frontend/public/images/msGrifeCatalogo.png` é a referência principal;
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

Estado: **concluída em 15 de agosto de 2026**.

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
| F3.6 | Identificação progressiva | Concluída | Conta e dados pessoais possuem fluxo visual sem persistência sensível indevida. |
| F3.7 | Endereço e entrega | Concluída | Coleta e seleção visual de entrega têm validação e estados definidos. |
| F3.8 | Cupom, pagamento e revisão | Concluída | Opções comerciais e revisão são demonstráveis sem operação financeira real. |
| F3.9 | Estados simulados do pedido | Concluída | Pendente, aprovado, recusado, expirado e erro têm representação inequívoca. |
| F3.10 | Encerramento da F3 | Concluída | Jornadas, OWASP, multitelas, smoke test e commit final aprovados. |

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

### F3.6 — Identificação progressiva

Estado: **concluída em 15 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.6.1 | Modelar dados transitórios | Concluída | Dados de conta ficam apenas em memória, fora do carrinho e de persistência local. |
| F3.6.2 | Criar formulário de conta | Concluída | Nome, e-mail, telefone e senha possuem campos semânticos, autocomplete e validação local. |
| F3.6.3 | Criar dados complementares | Concluída | CPF, nascimento e consentimento são solicitados somente na jornada de checkout. |
| F3.6.4 | Exibir privacidade e limites | Concluída | Interface declara que cadastro e confirmação ocorrerão no backend. |
| F3.6.5 | Testar, revisar e versionar | Concluída | Sem persistência sensível, teclado, OWASP, responsividade e commit aprovados. |

Escopo:

- criar a rota privada de indexação `/checkout` sem integrar autenticação ou backend;
- manter os dados de conta e identificação exclusivamente no estado React em memória;
- solicitar somente os campos previstos no contexto do projeto para cadastro e checkout;
- validar formato e presença no cliente apenas como melhoria de experiência;
- identificar claramente que o backend validará, protegerá e persistirá os dados reais.

Registro:

- `CheckoutProvider` concentra os dados transitórios e não possui adapter de persistência;
- formulário semântico coleta nome, e-mail, telefone e senha para a conta, e CPF, nascimento e consentimento durante o checkout;
- cada campo recebe `autocomplete`, tipo e `inputMode` adequados, com erros locais anunciados por `role="alert"`;
- senha utiliza `autocomplete="new-password"` e nunca é enviada, registrada ou gravada pelo frontend;
- rota `/checkout` recebe metadados próprios e `noindex, nofollow`;
- sacola passa a oferecer entrada explícita para o checkout demonstrativo, sem iniciar operação financeira;
- mensagens deixam inequívoco que os dados ficam em memória e que backend confirmará cadastro, segurança e validação;
- testes cobrem validação, metadados, não persistência e acessibilidade automatizada da rota;
- revisão manual aprovada em 390×844 e 1440×960, sem overflow horizontal;
- encerramento com 97 testes, lint e build de produção aprovados.

### F3.7 — Endereço e entrega

Estado: **concluída em 15 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.7.1 | Coletar endereço transitório | Concluída | CEP e endereço possuem validação local e nunca entram no armazenamento do carrinho. |
| F3.7.2 | Selecionar entrega demonstrativa | Concluída | Opções visuais deixam claro que prazo e frete dependem de cálculo autoritativo. |
| F3.7.3 | Testar, revisar e versionar | Concluída | Dados, foco, responsividade e commit aprovados. |

Registro:

- endereço e escolha de modalidade integram o mesmo provider transitório, sem `localStorage`, API ou adapter de dados;
- CEP, endereço, número, complemento, bairro, cidade e UF recebem validação de presença e formato somente para orientar a interface;
- a segunda etapa inicia bloqueada e é liberada após a identificação local, evitando coleta desnecessária fora da jornada;
- modalidades padrão e expressa existem somente como escolhas visuais preparatórias; preço, cobertura, disponibilidade e prazo continuam dependentes de decisão comercial, CEP e backend;
- a interface repete explicitamente que frete e prazo não são garantidos pela simulação;
- testes cobrem bloqueio progressivo, validação, escolha da modalidade e conclusão local;
- revisão manual em 390×844 confirma duas etapas sem overflow horizontal;
- encerramento com 98 testes, lint, build e npm audit aprovados.

### F3.8 — Cupom, pagamento e revisão

Estado: **concluída em 15 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.8.1 | Registrar cupom transitório | Concluída | Código é apenas solicitado e marcado para validação backend; nenhuma regra comercial é inventada. |
| F3.8.2 | Selecionar pagamento visual | Concluída | Pix, cartão e boleto são opções sem coletar dados financeiros ou iniciar cobrança. |
| F3.8.3 | Revisar pedido demonstrativo | Concluída | Produtos, entrega, pagamento e totais projetados ficam inequívocos antes da simulação. |
| F3.8.4 | Testar, revisar e versionar | Concluída | Segurança, acessibilidade, responsividade e commit aprovados. |

Registro:

- cupom é mantido somente na memória da jornada e, ao ser registrado, recebe aviso de validação futura sem alterar preço ou desconto;
- Pix, cartão e boleto são escolhas visuais; a interface não pede, envia ou armazena cartão, parcela, chave Pix ou informação bancária;
- regras de juros, parcela mínima, desconto no Pix, validade e aplicação de cupom não foram presumidas;
- revisão reutiliza produtos e precificação demonstrativa da sacola, além de exibir modalidade de entrega e pagamento escolhidas;
- sacola vazia recebe estado seguro de retorno ao catálogo, inclusive em acesso direto ao checkout;
- todos os valores da revisão permanecem marcados como demonstrativos e sujeitos a confirmação pelo backend;
- testes cobrem registro de cupom sem desconto, escolha de Pix e resumo sem cobrança;
- revisão manual em 390px confirma quatro etapas sem overflow horizontal;
- encerramento com 99 testes, lint, build e npm audit aprovados.

### F3.9 — Estados simulados do pedido

Estado: **concluída em 15 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.9.1 | Modelar estados financeiros visuais | Concluída | Pendente, aprovado, recusado, expirado e erro possuem mensagens e tratamentos distintos. |
| F3.9.2 | Simular transições sem efeito externo | Concluída | Nenhuma cobrança, pedido persistente, e-mail ou alteração de estoque é criada. |
| F3.9.3 | Testar, revisar e versionar | Concluída | Estados, teclado, OWASP, responsividade e commit aprovados. |

Registro:

- estados em memória representam `PENDING_PAYMENT`, `PAID`, `DECLINED`, `EXPIRED` e `ERROR`, todos com mensagens distintas e acessíveis;
- a simulação começa pendente e permite percorrer os desfechos sem sair da página;
- alterações em dados, endereço, cupom ou pagamento limpam o estado simulado para não mostrar confirmação desatualizada;
- aprovação visual explicita que o backend precisará confirmar o pagamento e reduzir estoque em transação;
- nenhum estado cria pedido, reserva produto, reduz estoque, envia e-mail, chama Mercado Pago ou persiste informação no navegador;
- painel usa região de status com `aria-live="polite"` e botões de transição por teclado;
- testes cobrem pendência, aprovação, falha e ausência de persistência de checkout;
- encerramento com 100 testes, lint, build e npm audit aprovados.

### F3.10 — Encerramento da F3

Estado: **concluída em 15 de agosto de 2026**.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F3.10.1 | Consolidar jornada | Concluída | Sacola, checkout e estados simulados formam percurso coerente. |
| F3.10.2 | Revisar limites e decisões provisórias | Concluída | Nenhuma projeção visual é confundida com regra comercial ou backend. |
| F3.10.3 | Executar quality gate | Concluída | Testes, cobertura, lint, build, audit, acessibilidade e matriz multitelas aprovados. |
| F3.10.4 | Atualizar documentação e versionar | Concluída | ROADMAP, contexto e commit de encerramento ficam consistentes. |

Registro:

- jornada automatizada percorre produto → sacola → checkout → dados → entrega → Pix → pendência → aprovação simulada;
- checkout mantém CPF, nascimento, endereço e senha apenas em memória do React; o único armazenamento local continua restrito à sacola pública validada e ao tema;
- preço, desconto, frete, cupom, juros, estoque, entrega e pagamento são repetidamente identificados como projeções sujeitas à confirmação do backend;
- nenhuma integração com autenticação, Mercado Pago, estoque, e-mail, pedido, webhook ou persistência de checkout foi antecipada;
- estados de pagamento usam transações visuais e deixam explícita a futura necessidade de redução de estoque atômica após confirmação autoritativa;
- cobertura final: 96,51% de statements, 88,85% de branches, 98,30% de funções e 97,97% de linhas, acima dos limites configurados de 90%/85%/90%/90%;
- quality gate final: 101 testes aprovados, lint, build de produção, `npm audit` sem vulnerabilidades e `git diff --check` sem erros;
- axe valida a rota do checkout sem violações estruturais conhecidas;
- matriz manual Playwright aprovada em 390×844, 768×1024, 1024×900 e 1440×1000, nos temas claro e escuro, sem overflow horizontal;
- F3 permanece somente como frontend demonstrativo. A próxima fase deve iniciar backend, autenticação, regras autoritativas, pagamento e estoque conforme o contexto do projeto.

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

Estado: **concluída em 17 de agosto de 2026**.

Objetivo: entregar jornada visual de conta e pós-compra com contratos locais transitórios, sem simular autenticação, autorização, pedidos ou persistência autoritativos antes do backend.

Limites de segurança:

- senha, token, CPF, endereço e dados de pagamento nunca serão persistidos pelo frontend;
- sucesso de cadastro, login, verificação, recuperação e sessão será sempre identificado como demonstração visual;
- backend continuará responsável por hash de senha, rate limiting, anti-enumeração, sessão, autorização e auditoria;
- pedidos exibidos serão dados públicos demonstrativos, sem qualquer alteração financeira ou operacional.

### Andamento da F4

| ID | Entrega | Estado | Critério principal |
| --- | --- | --- | --- |
| F4.1 | Fundação de conta | Concluída | Rotas, estado transitório, contratos e proteção visual ficam isolados por feature. |
| F4.2 | Acesso e recuperação | Concluída | Cadastro, login, verificação e recuperação têm formulários acessíveis sem credenciais persistidas. |
| F4.3 | Perfil e endereços | Concluída | Dados de conta e endereços possuem edição local, validação e aviso de backend. |
| F4.4 | Pedidos e pós-compra | Concluída | Lista, detalhe e linha do tempo apresentam somente dados demonstrativos. |
| F4.5 | Sessão e acesso negado | Concluída | Estados de sessão expirada, rota protegida e acesso negado são claros e seguros. |
| F4.6 | Encerramento da F4 | Concluída | Jornada, OWASP, multitelas, quality gate e commit final aprovados. |

### F4.1 — Fundação de conta

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F4.1.1 | Definir modelos e dados demonstrativos | Concluída | Perfil, endereço, pedido e sessão visual ficam fora de infraestrutura e persistência. |
| F4.1.2 | Criar provider e API pública | Concluída | Estado transitório é encapsulado e componentes não conhecem detalhes internos. |
| F4.1.3 | Criar rotas e composição | Concluída | Rotas públicas e protegidas têm destinos estáveis e metadados corretos. |
| F4.1.4 | Testar, revisar e versionar | Concluída | Segurança, acessibilidade, responsividade e commit aprovados. |

### F4.2 — Acesso e recuperação

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F4.2.1 | Criar cadastro e login visuais | Concluída | Campos semânticos validam experiência sem autenticar nem gravar senha. |
| F4.2.2 | Criar verificação de e-mail | Concluída | Estado visual não confirma conta real nem expõe endereço sensível. |
| F4.2.3 | Criar recuperação de senha | Concluída | Mensagem neutra evita enumeração de usuários e não envia e-mail real. |
| F4.2.4 | Testar, revisar e versionar | Concluída | Teclado, OWASP, responsividade e commit aprovados. |

### F4.3 — Perfil e endereços

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F4.3.1 | Criar área de perfil | Concluída | Dados exibidos e editáveis têm responsabilidade visual isolada. |
| F4.3.2 | Criar gerenciamento de endereços | Concluída | Inclusão, edição e remoção locais são identificadas como demonstração. |
| F4.3.3 | Testar, revisar e versionar | Concluída | Sem persistência sensível, acessibilidade e commit aprovados. |

### F4.4 — Pedidos e pós-compra

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F4.4.1 | Criar lista de pedidos | Concluída | Estado, itens, data e total demonstrativos possuem semântica clara. |
| F4.4.2 | Criar detalhe e linha do tempo | Concluída | Estados operacionais e financeiros ficam distintos, sem alterar pedido real. |
| F4.4.3 | Testar, revisar e versionar | Concluída | Rotas, acessibilidade, responsividade e commit aprovados. |

### F4.5 — Sessão e acesso negado

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F4.5.1 | Proteger rotas visualmente | Concluída | Perfil e pedidos orientam login, sem afirmar proteção autoritativa. |
| F4.5.2 | Criar sessão expirada e acesso negado | Concluída | Estados não vazam dados e indicam validação futura no backend. |
| F4.5.3 | Testar, revisar e versionar | Concluída | Fluxos, teclado, segurança e commit aprovados. |

### F4.6 — Encerramento da F4

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F4.6.1 | Consolidar jornadas | Concluída | Acesso, perfil, endereços e pedidos formam percurso coerente. |
| F4.6.2 | Revisar limites e decisões | Concluída | Frontend não assume regra de autenticação, autorização ou pedido. |
| F4.6.3 | Executar quality gate | Concluída | Testes, cobertura, lint, build, audit, acessibilidade e matriz multitelas aprovados. |
| F4.6.4 | Atualizar documentação e versionar | Concluída | ROADMAP e commit de encerramento ficam consistentes. |

Registro:

- `AccountProvider` mantém sessão visual, perfil e endereços apenas em memória; não usa `localStorage`, token ou senha;
- cadastro e login são rotas demonstrativas com campos semânticos, `autocomplete` e validação local de experiência;
- verificação de e-mail e recuperação de senha não enviam mensagem real; recuperação mostra retorno neutro para evitar enumeração;
- perfil permite alterar dados locais e gerenciar endereços transitórios, sempre identificado como demonstração;
- lista, detalhe e linha do tempo usam pedidos públicos estáticos; não executam alteração operacional, financeira ou de estoque;
- rotas de perfil e pedidos possuem gate visual para sessão anônima, expirada ou acesso negado, sem substituir validação autoritativa do backend;
- cabeçalho passa a oferecer acesso à conta e respeita estado visual da sessão;
- jornadas automatizadas cobrem gate, cadastro, verificação, perfil, endereço, pedidos, detalhe, expiração, recuperação e acesso negado;
- axe cobre rotas públicas e protegidas da conta sem violações estruturais conhecidas;
- revisão manual aprovada em 390×844 e 1440×1000, tema escuro, sem overflow horizontal;
- F4 termina como frontend demonstrativo. Backend deverá implementar hash, sessão, tokens `HttpOnly`, CSRF, rate limiting, e-mails, autorização, pedidos e auditoria.

## F5 — Painel do vendedor

Estado: **concluída em 17 de agosto de 2026**.

Objetivo: entregar painel administrativo demonstrativo organizado por domínio, preparado para `SELLER` e `SUPERADMIN`, sem assumir autorização, alteração comercial, estoque, auditoria ou integração real antes do backend.

Limites de segurança:

- capacidade visual nunca substituirá autorização do backend;
- preços, estoque, pedidos, clientes e cupons serão somente dados demonstrativos em memória;
- nenhuma alteração visual enviará e-mail, mudará estoque, reembolsará, registrará auditoria ou persistirá dados;
- ações críticas de `SUPERADMIN` terão estado de acesso negado explícito até existir controle autoritativo.

### Andamento da F5

| ID | Entrega | Estado | Critério principal |
| --- | --- | --- | --- |
| F5.1 | Fundação administrativa | Concluída | Shell, navegação, dados demonstrativos e gate visual são isolados por feature. |
| F5.2 | Dashboard e pedidos | Concluída | Métricas, período, pedidos e transições operacionais são projeções inequívocas. |
| F5.3 | Catálogo e estoque | Concluída | Produtos, variantes, mídia, preço e estoque possuem visual seguro sem escrita real. |
| F5.4 | Clientes e promoções | Concluída | Clientes, categorias, cupons e promoções exibem dados demonstrativos. |
| F5.5 | Configurações e capacidades | Concluída | `SELLER` e `SUPERADMIN`, auditoria e acesso negado ficam claros. |
| F5.6 | Encerramento da F5 | Concluída | Jornada, OWASP, multitelas, quality gate e commit final aprovados. |

### F5.1 — Fundação administrativa

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F5.1.1 | Modelar dados demonstrativos | Concluída | Dados públicos de operação não dependem de React, API ou persistência. |
| F5.1.2 | Criar provider e gate visual | Concluída | Papel visual é encapsulado e não equivale a autorização real. |
| F5.1.3 | Criar shell e rotas | Concluída | Navegação administrativa mantém destino, foco e metadados estáveis. |

### F5.2 — Dashboard e pedidos

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F5.2.1 | Criar dashboard e período | Concluída | Métricas aprovadas pelo contexto ficam marcadas como demonstrativas. |
| F5.2.2 | Criar lista e detalhe de pedidos | Concluída | Status financeiro e operacional ficam distintos sem alteração real. |

### F5.3 — Catálogo e estoque

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F5.3.1 | Criar gestão visual de catálogo | Concluída | Produtos, variantes e mídia são exibidos sem upload ou persistência. |
| F5.3.2 | Criar preço e estoque visuais | Concluída | Alterações locais são identificadas e não substituem regra comercial. |

### F5.4 — Clientes e promoções

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F5.4.1 | Criar área de clientes | Concluída | Campos aceitos no contexto são apresentados com dados demonstrativos. |
| F5.4.2 | Criar categorias e promoções | Concluída | Cupons e promoções não aplicam regra comercial nem persistem dados. |

### F5.5 — Configurações e capacidades

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F5.5.1 | Criar configurações e auditoria visual | Concluída | Itens críticos não executam ação e declaram auditoria futura. |
| F5.5.2 | Criar estados de papel | Concluída | `SELLER`, `SUPERADMIN` e acesso negado possuem capacidade visual clara. |

### F5.6 — Encerramento da F5

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F5.6.1 | Consolidar jornada | Concluída | Shell e áreas administrativas formam percurso coerente. |
| F5.6.2 | Revisar limites | Concluída | Nenhuma projeção visual é confundida com autorização ou operação real. |
| F5.6.3 | Executar quality gate | Concluída | Testes, cobertura, lint, build, audit, acessibilidade e matriz multitelas aprovados. |
| F5.6.4 | Atualizar documentação e versionar | Concluída | ROADMAP e commit de encerramento ficam consistentes. |

Registro:

- a feature `admin` separa domínio, provider, shell e páginas; todos os dados e alterações ficam apenas em memória;
- dashboard mostra faturamento, pedidos, ticket médio, estoque baixo, pedidos recentes e produtos mais vendidos como métricas demonstrativas;
- pedidos possuem lista e detalhe; pagamento aprovado e operação são campos distintos, e a transição visual é limitada a `PAID → PREPARING → SHIPPED → DELIVERED`;
- catálogo apresenta produtos, variantes, mídia, preço e estoque; qualquer ajuste local declara que não altera o catálogo real;
- clientes apresentam os campos aprovados para o dashboard; categorias, cupons e promoções não aplicam regra comercial;
- `SELLER` e `SUPERADMIN` são apenas papéis visuais; configurações críticas continuam negadas ao vendedor e nenhuma ação produz escrita, auditoria, e-mail ou integração externa;
- rotas administrativas usam metadados `noindex`, navegação semântica, tabelas HTML acessíveis e foco no conteúdo principal;
- jornadas e axe cobrem dashboard, pedidos, detalhe, catálogo e configurações; a revisão em 390×844 e 1440×1000 confirmou ausência de overflow global, com tabelas rolando somente no próprio cartão;
- quality gate: 117 testes aprovados, cobertura de statements 94,01%, branches 85,61%, functions 94,50% e lines 96,82%; lint, build, `git diff --check` e `npm audit --audit-level=high` aprovados (0 vulnerabilidades);
- F5 termina como frontend demonstrativo. Backend deverá implementar autenticação, autorização por papel, pagamentos, operações comerciais, persistência, auditoria e alertas autoritativos.

## F6 — Integração preparada e qualidade

Estado: **concluída em 18 de agosto de 2026**.

Objetivo: preparar o frontend para trocar dados demonstrativos por API autoritativa, preservando contratos de feature, segurança de sessão, falhas seguras e deploy em Cloudflare Pages sem ativar integração externa antes do backend.

Limites de segurança:

- nenhuma variável `VITE_` conterá segredo, token privado ou credencial;
- access token, quando a API existir, permanecerá somente em memória; refresh usará cookie `HttpOnly` enviado com `credentials: 'include'`;
- uma resposta `401` poderá renovar sessão uma única vez e nunca repetirá requisições não idempotentes automaticamente;
- mensagens de falha serão genéricas para cliente e não exibirão resposta, URL interna ou detalhes sensíveis;
- adaptadores HTTP permanecerão inativos por padrão até API, CORS, CSP e contratos do backend serem homologados.

### Andamento da F6

| ID | Entrega | Estado | Critério principal |
| --- | --- | --- | --- |
| F6.1 | Contratos e configuração pública | Concluída | Tipos, catálogo de erros e variáveis públicas não acoplam telas à API. |
| F6.2 | Cliente HTTP e sessão | Concluída | Cliente tipado trata falhas e só tenta refresh seguro uma vez. |
| F6.3 | Adaptadores demonstrativos e HTTP | Concluída | Fontes de catálogo são intercambiáveis pelo mesmo contrato. |
| F6.4 | Estados globais de falha | Concluída | Falhas inesperadas têm fallback acessível e recuperação local. |
| F6.5 | Jornadas críticas | Concluída | Fluxos públicos e de erro possuem testes de integração de interface. |
| F6.6 | SEO, desempenho e Cloudflare Pages | Concluída | Artefatos de produção, documentação, qualidade e commit ficam aprovados. |

### F6.1 — Contratos e configuração pública

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F6.1.1 | Documentar contratos de integração | Concluída | Requests, responses, erros e limites pendentes ficam rastreáveis. |
| F6.1.2 | Criar configuração pública tipada | Concluída | Ambiente escolhe fonte de dados sem expor segredo no bundle. |

### F6.2 — Cliente HTTP e sessão

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F6.2.1 | Criar cliente HTTP tipado | Concluída | URL, método, body, erro e abort são tratados em borda única. |
| F6.2.2 | Criar renovação de sessão | Concluída | Refresh via cookie é único, seguro e não persiste token no navegador. |

### F6.3 — Adaptadores demonstrativos e HTTP

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F6.3.1 | Criar adaptadores HTTP de catálogo | Concluída | Implementam os leitores existentes, sem importar páginas ou React. |
| F6.3.2 | Compor fonte de dados por ambiente | Concluída | Demonstração segue padrão; API só ativa por configuração explícita. |

### F6.4 — Estados globais de falha

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F6.4.1 | Criar boundary global | Concluída | Exceção inesperada mostra fallback seguro, focável e recuperável. |
| F6.4.2 | Preservar falhas por feature | Concluída | Loading, retry e estados locais continuam sem duplicar detalhe técnico. |

### F6.5 — Jornadas críticas

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F6.5.1 | Testar HTTP, refresh e adaptadores | Concluída | Contratos cobrem sucesso, erro, abort e regra de retry. |
| F6.5.2 | Testar jornada pública crítica | Concluída | Catálogo, produto, sacola e checkout mantêm percurso sem cobrança real. |

### F6.6 — SEO, desempenho e Cloudflare Pages

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| F6.6.1 | Consolidar metadados e artefatos web | Concluída | Indexação de páginas públicas e exclusão de áreas privadas ficam explícitas. |
| F6.6.2 | Preparar staging e deploy | Concluída | Variáveis, CSP, cache, redirects e comando Cloudflare ficam documentados. |
| F6.6.3 | Executar quality gate | Concluída | Testes, cobertura, lint, build, audit, acessibilidade e matriz multitelas aprovados. |
| F6.6.4 | Atualizar documentação e versionar | Concluída | ROADMAP e commit de encerramento ficam consistentes. |

Registro:

- `FRONTEND_API_CONTRACTS.md` define contrato inicial de sessão, catálogo, categorias, erros e responsabilidades ainda pertencentes ao backend;
- `runtimeConfig` mantém fonte `demo` por padrão, valida origem pública e exige HTTPS fora de localhost; `VITE_DATA_SOURCE=api` exige URL explícita;
- `HttpApiClient` centraliza JSON, abort, status, cookies e token de acesso somente em memória; apenas `GET` e `HEAD` podem executar refresh e retry únicos;
- `BrowserSessionRefresher` usa `POST /v1/auth/session/refresh` com `credentials: 'include'`; token de refresh nunca é exposto ao JavaScript;
- adaptadores HTTP de catálogo e categoria implementam os mesmos leitores dos mocks, validam DTOs e rejeitam mídia externa até existir decisão de CSP e imagem;
- `AppErrorBoundary` não exibe detalhes internos e oferece recuperação com foco; falhas de carregamento e retry já existentes nas features foram preservadas;
- `robots.txt`, preload da imagem principal, metadados existentes e guia de Cloudflare Pages consolidam indexação, desempenho e staging, sem deploy ou API real ativados;
- revisão manual aprovada em 390×844, 768×1024, 1024×900 e 1440×1000, nos temas escuro e claro, sem overflow horizontal;
- quality gate: 147 testes aprovados, cobertura de statements 93,31%, branches 85,76%, functions 95,00% e lines 96,82%; lint, build, artefatos `robots.txt`/headers/redirects, `git diff --check` e `npm audit --audit-level=high` aprovados (0 vulnerabilidades);
- F6 encerra o frontend preparado para integração. Ativação de API, CORS, CSP, sessão, CSRF, contratos comerciais, observabilidade e deploy continuam condicionados às fases B0–B7 e à homologação de staging.

## Backend — B0 a B7

### B0 — Arquitetura e contratos

Estado: **concluída em 20 de agosto de 2026**.

Objetivo: criar fundação backend Node.js/TypeScript com Fastify, Prisma e PostgreSQL, mantendo módulos de domínio, contratos HTTP, segurança de base e execução local/staging sem antecipar regra comercial pendente.

Limites:

- nenhum segredo, serviço Railway/R2/Mercado Pago, banco remoto ou deploy será criado nesta fase;
- fontes externas serão portas/adaptadores, nunca dependência do domínio;
- valores monetários usarão centavos inteiros e datas terão referência temporal inequívoca;
- `Checkout`/`PaymentAttempt` preserva pré-pagamento; `Order` só existe ou confirma após aprovação;
- integração de autenticação, pagamento, imagens e frete fica para B1–B4.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| B0.1 | Estrutura e dependências | Concluída | Workspace backend, Fastify, Prisma, TypeScript e scripts têm responsabilidade explícita. |
| B0.2 | Configuração e segurança base | Concluída | Ambiente validado, segredo ausente falha seguro, CORS allowlist e headers ficam na borda HTTP. |
| B0.3 | Prisma e PostgreSQL | Concluída | Schema inicial, migrações e banco local possuem modelo mínimo sem regra comercial antecipada. |
| B0.4 | Módulos e contratos API | Concluída | Health, erros versionados, DTOs e portas suportam frontend sem acoplamento. |
| B0.5 | Qualidade e operação | Concluída | Testes, lint, build, documentação Railway/GitHub Actions e commit aprovados. |

Registro:

- `Backend/` inicia API Node.js/TypeScript com Fastify; cada módulo separa configuração, composição HTTP, domínio e compartilhados;
- `readEnvironment` valida host, porta e allowlist CORS, normaliza origens e bloqueia HTTP em produção; Helmet e respostas de erro com códigos estáveis protegem a borda HTTP;
- `GET /v1/health` é healthcheck público versionado e foi validado com processo real na porta local 3001;
- Prisma 6.12 foi escolhido porque a linha Prisma 7 instalada inicialmente continha alerta alto em `deepmerge-ts`; `npm audit --audit-level=high` passou sem vulnerabilidades após a troca;
- schema e migração inicial versionam usuários, categorias, produtos, variantes, imagens R2 por `objectKey`, checkout attempts, pedidos e itens; valores monetários usam centavos inteiros;
- `CheckoutAttempt` representa `PENDING_PAYMENT`; `Order` começa em `PAID` após confirmação, preservando contexto pré-pagamento sem expor pedido ao cliente antes disso;
- PostgreSQL 17 local via Docker Compose usa porta 5433 e recebeu a migração `20260820000000_initial`; `prisma migrate status` confirmou banco atualizado;
- Railway e GitHub Actions estão documentados e configurados por arquivos, mas nenhum recurso remoto, segredo ou deploy foi criado;
- quality gate: 5 testes aprovados, cobertura 100%, lint, build, schema Prisma, migração local e healthcheck aprovados; `npm audit --audit-level=high` retornou 0 vulnerabilidades.

### B1 — Identidade, sessões e autorização

Estado: **em andamento em 21 de agosto de 2026**.

Objetivo: implementar identidade e acesso por etapas, mantendo segredos, regras de autorização e integrações fora da borda HTTP e sem antecipar domínios comerciais.

Limites da B1:

- `CUSTOMER`, `SELLER` e `SUPERADMIN` continuam únicos papéis; autorização real pertence ao backend;
- access token curto, refresh token em cookie `HttpOnly`, sessões revogáveis, anti-enumeração, CSRF, rate limiting, TOTP administrativo, recuperação e verificação de e-mail são requisitos da fase, não comportamento já existente;
- Brevo será adaptador de e-mail; não criar integração ou secret antes da subfase correspondente;
- não implementar catálogo, pedidos, pagamentos, frete, cupons ou funcionalidades de fases posteriores.

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| B1.1 | Modelagem de identidade e migration | Concluída | Schema aditivo modela verificação de e-mail, sessões revogáveis e tokens temporários somente por hash. |
| B1.2 | Cadastro, senha e sessão | Pendente | Conta autenticada usa hash de senha seguro, access token curto e refresh session revogável. |
| B1.3 | Autorização e proteção de borda | Pendente | Papéis, CSRF e rate limiting protegem mutações e superfícies sensíveis. |
| B1.4 | Verificação, recuperação e Brevo | Pendente | Fluxos não enumeráveis usam tokens temporários e adaptador de e-mail. |
| B1.5 | Administração reforçada | Pendente | TOTP, reautenticação e auditoria protegem `SELLER` e `SUPERADMIN`. |
| B1.6 | Quality gate e encerramento | Pendente | Testes, migrações, segurança, documentação e commit da fase são aprovados. |

### B1.1 — Modelagem de identidade e migration

Plano:

| ID | Entrega | Estado | Critério de aceite |
| --- | --- | --- | --- |
| B1.1.1 | Mapear estado atual e compatibilidade | Concluída | Leitores e writers atuais não usam autenticação; expansão não altera dados existentes. |
| B1.1.2 | Expandir usuário e sessões | Concluída | `User` comporta verificação; sessão guarda somente hash de refresh token, expiração e revogação. |
| B1.1.3 | Modelar tokens de conta | Concluída | Verificação e recuperação possuem tipo, hash, expiração, consumo e vínculo ao usuário. |
| B1.1.4 | Gerar e aplicar migration aditiva | Concluída | Migration preserva usuários existentes e cria índices necessários sem passo destrutivo. |
| B1.1.5 | Validar e registrar | Concluída | Schema, cliente Prisma, migration, testes, lint e build passam; rollback é remoção das novas tabelas/coluna apenas antes de produção. |

Escopo desta subfase: somente persistência de identidade. Não criar endpoints, cookies, geração de token, hash de senha, Brevo, TOTP, autorização HTTP, auditoria ou rate limiting. A migration será somente expansiva: adiciona coluna anulável e tabelas novas, mantendo compatibilidade com o banco B0.

Registro:

- `User.emailVerifiedAt` é anulável, preservando usuários existentes durante rollout;
- `Session` guarda `refreshTokenHash` único, expiração e revogação; não armazena refresh token bruto, IP ou user agent;
- `AccountToken` guarda hash único, propósito (`EMAIL_VERIFICATION` ou `PASSWORD_RESET`), expiração e consumo;
- migration `20260821113859_identity_persistence` cria enum, tabelas, índices e relacionamentos sem remoção ou alteração de dados existentes;
- rollback só é seguro antes de produção e antes de qualquer writer B1.2: reverter a migration removendo as novas tabelas, enum e coluna; após uso real, restaurar backup e executar procedimento de migração reversa planejado;
- validação: migration aplicada no PostgreSQL local, `prisma migrate status`, `prisma validate`, geração do client, 5 testes com 100% de cobertura do código atual, lint, build e audit sem vulnerabilidades altas.

### B2 — Catálogo, mídia, preços e estoque

- produtos, categorias, variantes, imagens, preços, promoções, busca e movimentações.

### B3 — Clientes, carrinho e cálculo comercial

- perfil, endereços, carrinho persistido, cupons, frete e totais autoritativos.

### B4 — Pedidos e Mercado Pago

- pedido, pagamento, webhook idempotente, estoque atômico, estados e reembolso.

### B5 — Operação, comunicação e dashboard

- endpoints administrativos, métricas, WhatsApp, alertas, auditoria e observabilidade.

### B6 — Integração frontend-backend

- substituição progressiva dos adaptadores simulados e testes em staging.

### B7 — Preparação de produção

- segurança, rollback, carga, LGPD, runbooks e go-live;
- `pg_dump` diário automatizado, protegido antes do envio e armazenado no R2 como cópia independente do backup do provedor;
- retenção e limpeza automática de 30 dias, restore mensal inicial em banco isolado, RPO de 24 h e RTO de 4 h;
- alertar falha de backup, upload, expiração indevida ou teste de restore mal-sucedido.

## Marco entre frontend e backend

Antes da B0 deverão existir:

- mapa de rotas;
- estados de carregamento e erro;
- matriz inicial de papéis e permissões;
- contratos necessários ao frontend;
- exemplos de payloads e catálogo de erros;
- inventário atualizado das decisões pendentes do vendedor.
