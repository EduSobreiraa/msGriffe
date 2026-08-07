# Plano de implementação — msGriffe

> Roteiro incremental para transformar o protótipo visual em uma loja pronta para integração e, depois, implementar o backend.
>
> Última atualização: 7 de agosto de 2026.

## 1. Estratégia

O trabalho será executado em duas fases principais, nesta ordem:

1. **F — Frontend**: decompor o HTML atual, construir toda a experiência da loja e do painel com dados simulados e contratos de serviço estáveis;
2. **B — Backend**: implementar domínio, persistência e integrações reais e conectar os contratos já consumidos pelo frontend.

O frontend será hospedado no **Cloudflare Pages**. Durante a fase F, nenhuma regra financeira ou de segurança será considerada efetivamente protegida apenas por existir na interface; essas garantias serão implementadas e validadas pelo backend na fase B.

## 2. Material de referência atual

- `Frontend/ms-grifes-react.html`: protótipo monolítico da página inicial;
- `Frontend/imgs/`: imagens já recortadas usadas pelo protótipo;
- `imgs/msGrife.png`: referência da vitrine escura;
- `imgs/msGrifeWhite.png`: referência da vitrine clara;
- `imgs/msGrifeCatalogo.png`: referência do catálogo;
- `imgs/msGrifeAnalitcs.png`: referência do dashboard do vendedor.

O protótipo atual carrega React e Babel por CDN e mantém estilos, componentes e dados em um único HTML. “Descompactar o HTML” significa migrar esse conteúdo para uma aplicação compilada, separando páginas, componentes, estilos, dados e serviços.

## 3. Fase F — Frontend

### F0 — Fundação técnica

Objetivo: criar uma base executável, testável e compatível com Cloudflare Pages.

Passos:

1. definir e registrar a stack e versões;
2. criar a aplicação React com TypeScript e build de produção;
3. configurar lint, formatação, testes e variáveis de ambiente públicas;
4. definir aliases, organização de pastas e convenções;
5. configurar roteamento e fallback de SPA no Cloudflare Pages;
6. configurar builds de preview, staging e produção;
7. migrar as imagens existentes para a estrutura pública ou pipeline de assets apropriado.

Critério de conclusão:

- aplicação instala, compila e executa localmente;
- build de produção não depende de React, Babel ou outros scripts carregados por CDN;
- rota acessada diretamente funciona no Cloudflare Pages;
- verificações automáticas básicas passam.

### F1 — Design system e decomposição da vitrine

Objetivo: transformar a página inicial monolítica em componentes reutilizáveis e responsivos.

Passos:

1. extrair tokens de cor, tipografia, espaçamento, bordas e sombras;
2. implementar os temas escuro e claro conforme as referências;
3. criar componentes fundamentais: botão, ícone, campo, seletor, modal, drawer, badge, card, skeleton e feedback;
4. decompor cabeçalho, navegação, hero, benefícios, produtos em destaque, faixa de serviços e botão do WhatsApp;
5. implementar menu e navegação móvel;
6. revisar semântica, teclado, foco, contraste, textos alternativos e estados interativos;
7. validar o comportamento nos principais tamanhos de tela.

Critério de conclusão:

- página inicial reproduz a identidade das referências em desktop e mobile;
- componentes não dependem de dados escritos diretamente no JSX;
- temas e estados de interação são consistentes e acessíveis.

### F2 — Catálogo, busca e produto

Objetivo: construir a jornada de descoberta do produto.

Passos:

1. criar página de catálogo conforme `imgs/msGrifeCatalogo.png`;
2. implementar grid, ordenação, paginação e filtros responsivos;
3. implementar busca com estados vazio, carregando e erro;
4. criar página de categoria;
5. criar página de detalhes do produto;
6. implementar galeria, variantes, tamanhos, preço, promoção, parcelamento e disponibilidade;
7. usar uma camada de catálogo simulado, sem acoplar componentes à futura API.

Critério de conclusão:

- usuário navega da vitrine ao catálogo e ao detalhe do produto;
- URLs representam busca, filtros, ordenação e página quando apropriado;
- ausência de produtos, imagens e estoque possuem tratamento visual.

### F3 — Carrinho e checkout visual

Objetivo: completar a jornada de compra no frontend usando simulações controladas.

Passos:

1. implementar sacola em drawer e página completa;
2. permitir adicionar, remover e alterar quantidades e variantes;
3. exibir subtotal, descontos, estimativa de frete e total;
4. criar identificação e autenticação dentro da jornada;
5. criar coleta progressiva de CPF, nascimento, endereço e consentimentos;
6. construir seleção de entrega, cupom e modalidade de pagamento;
7. criar revisão e confirmação do pedido;
8. implementar telas de pagamento pendente, aprovado, recusado, expirado e erro;
9. persistir apenas dados não sensíveis adequados no navegador.

Critério de conclusão:

- jornada completa pode ser demonstrada com cenários simulados;
- interface nunca afirma que uma operação financeira real ocorreu;
- regras e totais exibidos vêm de uma abstração substituível pelo backend.

### F4 — Conta e pós-compra

Objetivo: implementar a área do cliente.

Passos:

1. cadastro, login e verificação de e-mail;
2. solicitação e redefinição de senha;
3. perfil e dados pessoais;
4. endereços;
5. lista e detalhe de pedidos;
6. linha do tempo do pedido;
7. estados de sessão expirada e acesso negado;
8. pontos de entrada para políticas, privacidade e atendimento.

Critério de conclusão:

- fluxos completos funcionam contra um adaptador de autenticação simulado;
- rotas privadas e redirecionamentos possuem comportamento definido;
- todos os estados de pedido previstos têm representação consistente.

### F5 — Painel do vendedor e administração

Objetivo: implementar a interface operacional baseada em `imgs/msGrifeAnalitcs.png`.

Passos:

1. criar shell administrativo, navegação lateral e cabeçalho;
2. implementar dashboard e seleção de período;
3. criar métricas, gráficos, pedidos recentes e clientes recentes;
4. criar gestão e detalhe de pedidos com transições permitidas;
5. criar gestão de produtos, variantes, imagens, preços e estoque;
6. criar área de clientes;
7. criar interfaces de categorias, cupons e promoções;
8. criar configurações e histórico de auditoria;
9. diferenciar capacidades visuais de `SELLER` e `SUPERADMIN`.

Critério de conclusão:

- painel permite demonstrar as operações previstas com dados simulados;
- ações críticas possuem confirmação e feedback;
- permissões visuais correspondem à matriz de acesso documentada, sem substituir a futura autorização do backend.

### F6 — Integração preparada e qualidade

Objetivo: estabilizar o frontend antes da conexão com o backend.

Passos:

1. consolidar tipos e contratos de requests, responses e erros;
2. centralizar cliente HTTP, autenticação, renovação de sessão e cancelamento de requests;
3. separar adaptadores simulados e reais;
4. adicionar tratamento global de erros e indisponibilidade;
5. cobrir jornadas críticas com testes unitários, de integração e ponta a ponta;
6. medir acessibilidade, responsividade, desempenho e tamanho do bundle;
7. configurar metadados, sitemap, robots, compartilhamento e SEO técnico;
8. validar preview e staging no Cloudflare Pages.

Critério de conclusão:

- trocar dados simulados pela API não exige reescrever páginas ou componentes;
- jornadas críticas possuem testes automatizados;
- staging está navegável, responsivo e sem segredos no bundle.

## 4. Marco entre frontend e backend

Antes de iniciar B1, deverão estar versionados:

- mapa de rotas do frontend;
- modelos de tela e estados de erro/carregamento;
- matriz inicial de papéis e permissões;
- contratos de API necessários ao frontend;
- exemplos de payloads e catálogo de erros;
- inventário das regras ainda pendentes do vendedor.

Esses contratos podem ser refinados durante o backend, mas alterações incompatíveis deverão ser registradas e refletidas nos adaptadores e testes do frontend.

## 5. Fase B — Backend

### B0 — Arquitetura e contratos

Objetivo: estabelecer a base técnica do serviço.

Passos:

1. confirmar stack, banco de dados e estratégia de deploy;
2. modelar módulos, limites de domínio e dependências externas;
3. revisar contratos produzidos na fase F;
4. definir formato padrão de erros, paginação, filtros e idempotência;
5. configurar ambientes, migrações, testes, logs e gestão de segredos;
6. produzir documentação executável da API.

### B1 — Identidade, sessões e autorização

Objetivo: implementar conta, autenticação e proteção administrativa.

Passos:

1. cadastro progressivo e verificação de e-mail;
2. login, access token curto e refresh token em cookie `HttpOnly`;
3. rotação, expiração e revogação de sessões;
4. recuperação de senha sem enumeração de usuários;
5. papéis `CUSTOMER`, `SELLER` e `SUPERADMIN`;
6. autorização por endpoint e operação;
7. proteção adicional e regras de 2FA administrativas;
8. rate limiting e auditoria de eventos de segurança.

### B2 — Catálogo, mídia, preços e estoque

Objetivo: fornecer os dados reais da vitrine e as operações de gestão.

Passos:

1. produtos, categorias, variantes e atributos;
2. imagens e estratégia de armazenamento/otimização;
3. preços, promoções e parcelamento;
4. estoque e histórico de movimentações;
5. busca, filtros, ordenação e paginação;
6. regras de publicação e disponibilidade;
7. importação ou criação do catálogo inicial.

### B3 — Clientes, endereços, carrinho e cálculo comercial

Objetivo: sustentar a preparação do pedido.

Passos:

1. perfil e endereços;
2. carrinho persistido e validação de variantes;
3. cupons e promoções;
4. cálculo autoritativo de preços e totais;
5. integração de frete e cálculo por CEP;
6. validação de estoque sem efetuar baixa antecipada;
7. proteção contra manipulação de preços vindos do cliente.

### B4 — Pedidos e Mercado Pago

Objetivo: implementar o núcleo transacional da compra.

Passos:

1. criação de pedido e snapshot dos dados comerciais;
2. integração das modalidades de pagamento aprovadas;
3. criação e consulta do pagamento;
4. webhook autenticado, idempotente e resiliente;
5. aprovação com redução atômica do estoque;
6. máquina de estados e histórico do pedido;
7. tratamento de pagamento aprovado sem estoque;
8. cancelamento, expiração e reembolso;
9. reconciliação de eventos e estratégia para indisponibilidade do provedor.

### B5 — Operação, comunicação e dashboard

Objetivo: sustentar a operação diária da loja.

Passos:

1. endpoints administrativos de pedidos, produtos, estoque, clientes e promoções;
2. agregações do dashboard e comparações por período;
3. e-mails transacionais via Resend;
4. notificações comerciais e de segurança;
5. auditoria de alterações críticas;
6. Sentry, Better Stack e integração com Telegram;
7. jobs, retentativas e tratamento de falhas.

### B6 — Integração frontend-backend

Objetivo: substituir progressivamente os simuladores pela API real.

Passos:

1. autenticação e conta;
2. catálogo e produto;
3. carrinho, cupom e frete;
4. checkout e pagamento;
5. pedidos e pós-compra;
6. painel administrativo;
7. remover simuladores que não sejam úteis a testes e desenvolvimento;
8. executar testes ponta a ponta em staging.

### B7 — Preparação de produção

Objetivo: liberar o sistema com segurança e possibilidade de recuperação.

Passos:

1. revisão de segurança e permissões;
2. política de backup, restauração, RPO e RTO;
3. migrações e plano de rollback;
4. carga, desempenho e limites operacionais;
5. revisão LGPD e documentos legais;
6. domínios, HTTPS, CORS, cookies e headers;
7. runbooks de pagamento, webhook, estoque e indisponibilidade;
8. checklist de go-live, smoke test e monitoramento pós-lançamento.

Critério final:

- jornadas de cliente e vendedor funcionam em staging com integrações reais de teste;
- recuperação e rollback foram ensaiados;
- alertas críticos chegam aos destinos definidos;
- decisões comerciais obrigatórias foram validadas;
- produção não depende de dados simulados nem de segredos presentes no frontend.

## 6. Ordem de entrega recomendada

```text
F0 → F1 → F2 → F3 → F4 → F5 → F6
                              ↓
B0 → B1 → B2 → B3 → B4 → B5 → B6 → B7
```

F2 a F5 podem compartilhar componentes e contratos, mas cada subfase deverá terminar com uma entrega demonstrável. Dentro de uma subfase, os passos menores poderão virar tarefas independentes somente quando houver critério de aceite claro.

## 7. Decisões necessárias antes ou durante F0

1. stack exata do frontend e gerenciador de pacotes;
2. uso definitivo do tema escuro, claro ou alternância entre ambos;
3. escopo exato das páginas que entram no primeiro MVP demonstrável;
4. estratégia inicial de testes;
5. domínio e modelo de projetos/deploys no Cloudflare Pages;
6. prioridade entre loja pública e painel após a página inicial.

