# Princípios de arquitetura — msGriffe

> Regras obrigatórias para frontend e backend.
>
> Última atualização: 7 de agosto de 2026.

## 1. Diretriz central

O sistema seguirá os princípios **SOLID**, com ênfase em modularização, baixo acoplamento, alta coesão e **responsabilidade única**.

Cada módulo, componente, serviço, caso de uso ou classe deverá ter um motivo principal e claramente identificável para mudar. A separação não será baseada apenas no tamanho do arquivo, mas na responsabilidade exercida e no domínio ao qual pertence.

SOLID será aplicado como critério de projeto, não como justificativa para criar abstrações sem necessidade. Interfaces e camadas deverão existir quando isolarem uma responsabilidade, permitirem substituição real, protegerem regras de negócio ou facilitarem testes e manutenção.

## 2. Aplicação dos princípios SOLID

### S — Responsabilidade única

- componentes visuais renderizam uma responsabilidade de interface;
- hooks coordenam estado ou comportamento reutilizável, sem acumular apresentação;
- casos de uso representam uma ação do sistema;
- serviços de domínio protegem regras que não pertencem naturalmente a uma entidade;
- adaptadores cuidam de uma tecnologia ou integração externa;
- repositórios cuidam da leitura e persistência de agregados;
- controllers traduzem o protocolo HTTP, sem conter regra de negócio;
- formatadores e validadores não fazem acesso a dados ou navegação.

Um arquivo não deverá misturar, por exemplo, renderização, chamada HTTP, cálculo comercial e persistência local.

### O — Aberto para extensão, fechado para modificação

Comportamentos variáveis deverão aceitar extensão por composição ou contratos estáveis. Exemplos:

- provedores de pagamento;
- serviços de frete;
- envio de notificações;
- armazenamento de imagens;
- tipos de desconto;
- fontes de dados simuladas e reais do frontend.

Adicionar uma implementação não deverá exigir alterações espalhadas por módulos não relacionados.

### L — Substituição de Liskov

Implementações de um mesmo contrato deverão preservar suas garantias, entradas, saídas e erros esperados. Um adaptador simulado, por exemplo, deverá poder ser substituído pelo adaptador HTTP sem alterar o comportamento esperado pela tela.

### I — Segregação de interfaces

Contratos deverão ser pequenos e orientados às necessidades do consumidor. Nenhum módulo deverá depender de uma interface extensa quando usa apenas uma parte dela.

Exemplos preferidos:

- `ProductReader` separado de `ProductWriter` quando as permissões e consumidores forem diferentes;
- serviços de sessão, perfil e recuperação de senha separados em vez de um serviço genérico de usuário;
- hooks específicos de catálogo, carrinho e checkout em vez de um hook global da loja.

### D — Inversão de dependência

Regras de negócio e casos de uso dependerão de contratos, não de detalhes como banco de dados, Mercado Pago, Brevo ou APIs do navegador.

As implementações concretas serão conectadas nas bordas da aplicação. O sentido principal das dependências será:

```text
Interface/Controller → Caso de uso → Domínio
                           ↓
                        Contrato
                           ↑
                  Adaptador de infraestrutura
```

## 3. Organização do frontend

O frontend será organizado prioritariamente por **feature/domínio**, mantendo elementos verdadeiramente compartilhados fora das features.

Estrutura-alvo:

```text
src/
├── app/                  # composição, providers, rotas e configuração global
├── features/
│   ├── auth/
│   ├── catalog/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   ├── orders/
│   └── admin/
├── shared/
│   ├── components/       # componentes visuais realmente genéricos
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── styles/
└── main.tsx
```

Cada feature poderá conter, conforme a necessidade:

```text
feature/
├── components/
├── pages/
├── hooks/
├── services/
├── adapters/
├── schemas/
├── types/
└── tests/
```

Regras:

- páginas compõem casos de interface; não implementam regras comerciais;
- componentes não acessam diretamente endpoints;
- chamadas externas ficam atrás de serviços ou adaptadores tipados;
- cálculos financeiros exibidos pelo frontend são projeções e serão confirmados pelo backend;
- estado local permanece próximo de quem o utiliza;
- estado global só será criado quando houver consumo realmente transversal;
- `shared` não poderá virar depósito de código sem domínio definido;
- uma feature não deverá importar detalhes internos de outra; deverá usar sua API pública;
- dados simulados e API real implementarão os mesmos contratos quando forem intercambiáveis.

## 4. Organização do backend

O backend será modularizado por domínio de negócio, com separação entre domínio, aplicação, interfaces e infraestrutura.

Estrutura conceitual:

```text
src/
├── modules/
│   ├── identity/
│   ├── catalog/
│   ├── inventory/
│   ├── customers/
│   ├── cart/
│   ├── promotions/
│   ├── orders/
│   ├── payments/
│   ├── shipping/
│   └── notifications/
├── shared/
└── bootstrap/
```

Estrutura interna possível de um módulo:

```text
module/
├── domain/               # entidades, objetos de valor e regras invariantes
├── application/          # casos de uso, portas e DTOs internos
├── infrastructure/       # banco, filas e integrações externas
└── presentation/         # HTTP, jobs, consumers e serialização
```

Regras:

- controllers validam o protocolo, chamam um caso de uso e traduzem a resposta;
- regras comerciais não ficam em controllers, ORM models ou handlers de webhook;
- cada caso de uso representa uma intenção clara, como `ApprovePayment` ou `ChangeOrderStatus`;
- acesso ao banco ocorre por portas de persistência definidas conforme a necessidade do domínio;
- integrações com Mercado Pago, Brevo, frete e Telegram são adaptadores substituíveis;
- webhooks são entradas do sistema e delegam o processamento a casos de uso idempotentes;
- transações são controladas na fronteira do caso de uso que exige atomicidade;
- módulos não consultam tabelas internas de outros módulos de forma arbitrária;
- compartilhamento só ocorre para conceitos realmente comuns e estáveis.

## 5. Responsabilidade única na prática

Sinais de que uma unidade precisa ser separada:

- possui mais de um motivo de mudança;
- combina regra de negócio e detalhe tecnológico;
- precisa de muitos mocks não relacionados para ser testada;
- recebe dependências que são usadas apenas por partes diferentes do fluxo;
- seu nome se torna genérico, como `Utils`, `Helpers`, `Manager` ou `Service`, sem responsabilidade específica;
- uma alteração visual pode quebrar cálculo ou persistência;
- uma troca de provedor exige modificar o domínio.

Separar não significa necessariamente criar uma classe. Funções puras, componentes, hooks, módulos e objetos de valor serão usados conforme a responsabilidade.

## 6. Critérios de revisão

Toda entrega relevante deverá verificar:

1. qual é a responsabilidade de cada nova unidade;
2. quais dependências ela possui e em que direção apontam;
3. se regra de negócio está independente de framework e infraestrutura;
4. se contratos são menores que suas implementações e adequados ao consumidor;
5. se a unidade pode ser testada isoladamente;
6. se uma mudança de tecnologia externa fica restrita ao adaptador correspondente;
7. se nomes representam claramente o domínio e a intenção;
8. se código compartilhado é realmente transversal.

Violações conscientes deverão ser justificadas na revisão e registradas quando criarem dívida técnica relevante.

## 7. Planejamento obrigatório por subfase

Cada nova subfase de produção deverá ter seu plano registrado em `ROADMAP.md` antes da primeira alteração de implementação. Os passos usarão identificadores hierárquicos vinculados à subfase, como `F1.5` ou `B2.3`, para permitir rastreabilidade entre planejamento, código, testes e documentação.

O plano será mantido durante a execução e será parte do critério de conclusão da subfase. Descobertas que alterem escopo, dependências ou critérios de aceite deverão atualizar o plano antes de ampliar a implementação.
