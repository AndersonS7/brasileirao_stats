# Plano v0 — Brasileirão Stats (nome provisório)

Rascunho para revisão. Depois de aprovado, vira `docs/brief.md`, `docs/design.md` e a trilha SDD (`docs/specs/<slug>/`), em inglês.

## 1. Proposta

Site de estatísticas do Brasileirão Série A: tabela, clubes, jogadores e comparador de clubes. Projeto demonstrativo feito com IA para LinkedIn e GitHub, sem fins comerciais.

- **Público:** torcedor que quer consultar e comparar clubes, e recrutadores que veem o projeto no LinkedIn.
- **O que precisa provar:** IA sob direção humana entrega um produto de dados coeso, com pipeline, UI limpa e acessível.
- **Idioma da UI:** pt-BR.
- **Aviso de período (obrigatório):** faixa fixa no topo e no rodapé: "Dados da temporada AAAA, amostra do plano gratuito da API-Football. Não é a temporada em andamento." Cada página mostra a temporada exibida.

## 2. Referência (SofaScore)

Padrões que vale copiar, do que vi na [página da liga](https://www.sofascore.com/football/tournament/brazil/brasileirao-serie-a/325) e nas descrições das páginas de time:

- **Liga:** abas Classificação, Detalhes e Jogos, com filtro Todos/Casa/Fora. Tabela com faixas de cor por zona (Libertadores, Sul-Americana, rebaixamento).
- **Time:** abas de jogos (últimos e próximos, com ícone V/E/D), elenco com estatísticas por jogador, e gráfico de forma dos últimos 10 jogos.
- **Comparador de times** como página própria.

Diferenças deliberadas: sem odds, sem placar ao vivo, sem anúncios, uma única cor de destaque e muito espaço em branco (estilo Google Clean).

## 3. Escopo funcional

| Tela | Rota | Conteúdo | Fase |
|---|---|---|---|
| Liga | `/` | Tabela com filtro Geral/Casa/Fora, zonas, sequência V/E/D. Cards de artilheiro, assistências e melhor ataque/defesa. Gráfico de gols por rodada | 2 |
| Busca de clube | barra global | Busca por nome com atalho `/` | 2 |
| Clube | `/clubes/:id` | Cabeçalho (escudo, estádio, cores). Abas Resumo, Jogos, Estatísticas, Elenco | 3 |
| Jogos | `/jogos` | Resultados por rodada, com navegação anterior/próxima | 3 |
| Jogadores | `/jogadores` | Rankings: gols, assistências, cartões, filtráveis por clube | 4 |
| Comparador | `/comparar?a=&b=` | Dois clubes lado a lado: campanha, ataque, defesa, confronto direto | 4 |

**Aba Estatísticas do clube** (dados de `teams/statistics`): aproveitamento casa e fora, gols por faixa de 15 minutos (marcados e sofridos), maiores sequências, jogos sem sofrer gol, formações mais usadas, cartões por faixa.

**Fora do escopo:** contas de usuário, favoritos no servidor, tempo real, previsões e odds, outras ligas.

## 4. Dados

### Fontes

| Fonte | Uso |
|---|---|
| API-Football (plano gratuito, 100 req/dia) | Estatísticas, tabela, jogos e jogadores |
| TheSportsDB (chave `123`) | Banner, camisa, cores oficiais e descrição dos clubes |

### Temporada exibida

A 2026 não vem no plano gratuito. **A validar:** a temporada mais recente liberada (provavelmente 2024, com liga 71). O número fica em uma constante única de configuração, e todo o site lê dela.

### Pipeline (build time, sem chamar API no navegador)

```
scripts/collect.ts  →  scripts/.cache/ (respostas brutas, git-ignored)
                    →  scripts/transform.ts  →  src/data/*.json (versionado)
```

- A chave fica em `.env` (`API_FOOTBALL_KEY`, com `.env.example` documentado). O navegador nunca a vê.
- `src/data/*.json` vai para o repositório: quem clonar roda o site sem chave.
- A coleta é retomável: cada resposta fica em cache, e o script para ao atingir o orçamento diário.

### Orçamento de requisições (100/dia)

| Etapa | Endpoint | Req | Dia |
|---|---|---|---|
| Base | `standings`, `teams`, `fixtures` (380 jogos) | 3 | 1 |
| Perfil dos clubes | `teams/statistics` x 20 | 20 | 1 |
| Rankings | `topscorers`, `topassists`, `topyellowcards`, `topredcards` | 4 | 1 |
| Elenco | `players/squads` x 20 | 20 | 1 |
| Clubes (imagem) | TheSportsDB `lookupteam` x 20 | 20 (outra API) | 1 |
| Estatísticas por jogo (opcional) | `fixtures/statistics` x 380 | 380 | 4 a 5 dias |

Dia 1 usa cerca de 47 req da API-Football. Posse, chutes e escanteios por jogo entram como melhoria: se ficarem incompletos, a UI mostra a métrica só onde há dados.

### Modelo de dados (`src/data/`)

- `season.json`: temporada, liga, data da coleta.
- `teams.json`: id, nome, escudo, estádio, capacidade, cores, banner, descrição.
- `standings.json`: geral, casa e fora.
- `fixtures.json`: jogos com rodada, placar, times e id de estádio.
- `team-stats/<id>.json`: saída de `teams/statistics` reduzida ao que a UI usa.
- `players.json`: rankings e elencos.

Tipos em `src/types/`. Um passo de validação (`npm run data:check`) confere os JSON contra os tipos e confirma que existem 20 clubes e 380 jogos.

### Derivado localmente (sem gastar requisição)

Confronto direto, forma recente, gols por rodada, ataque e defesa por rodada, e médias casa e fora saem do `fixtures.json`.

## 5. Stack e arquitetura

| Camada | Escolha | Por quê |
|---|---|---|
| Build | Vite + React + TypeScript strict | Padrão do workspace |
| Estilo | Tailwind CSS (tokens em `@theme`) | Padrão do workspace |
| Rotas | React Router | Navegação entre páginas com URL compartilhável |
| Gráficos | Recharts | Barras, linhas e radar. Uma lib basta |
| Ícones | Lucide | Um set coerente |
| Componentes | shadcn/ui só onde ajudar (Tabs, Command para busca) | Acessibilidade pronta |
| Coleta | Node + `tsx`, `fetch` nativo | Sem dependência extra |
| Testes | Playwright (verificação visual em 1440px e 390px) | Exigido pelo workflow |
| Hospedagem | Vercel ou GitHub Pages (site estático) | Sem backend |

**Decisões:**
- **Sem backend.** Os dados são estáticos por natureza (temporada passada e cota diária baixa). O JSON versionado remove chave exposta, limite de taxa e estado de erro de rede.
- **Sem TanStack Query nem gerenciador de estado.** Import direto dos JSON com carregamento tardio por rota. Cada dependência precisa de um motivo, e aqui não há.
- **Busca** no cliente sobre `teams.json`.

### Estrutura

```
src/
  app/            rotas, layout, aviso de temporada
  features/
    league/       tabela, cards de destaque, gráfico de gols por rodada
    club/         cabeçalho, abas, estatísticas
    fixtures/     jogos por rodada
    players/      rankings
    compare/      comparador
  components/ui/  botão, tabs, tabela, barra comparativa, badge de forma
  data/           JSON gerado
  lib/            formatação e seletores puros
  types/
scripts/          collect.ts, transform.ts, check.ts
docs/             brief.md, design.md, specs/
```

## 6. Direção visual (Google Clean, verde)

- **Base:** fundo branco e cinza muito claro, texto grafite. O verde é a única cor de destaque.
- **Verde:** um verde-gramado escuro para ação e destaque (a definir no `design.md` com contraste AA: 4.5:1 sobre branco), mais um tom claro para fundos de faixa. Sem gradiente, sem neon.
- **Cores dos clubes:** só no cabeçalho da página do clube e nas séries do comparador. O resto do site continua verde.
- **Tipografia:** uma família sans geométrica e limpa (candidata: Figtree), com numerais tabulares nas tabelas. Evitar Inter e Roboto.
- **Estrutura:** bordas finas e divisores no lugar de sombras e cards arredondados repetidos. Hierarquia por tamanho e peso, não por caixas.
- **Movimento:** um só, com propósito: as barras do comparador crescem ao carregar. Respeita `prefers-reduced-motion`.
- **Zonas da tabela:** marcação por barra lateral fina, com legenda e não só cor (acessibilidade).
- **Responsivo:** tabela vira lista compacta em 390px, mantendo posição, clube, pontos, jogos e saldo. Abas do clube rolam na horizontal.
- **Acessibilidade:** foco visível, semântica de tabela, texto alternativo nos escudos, navegação por teclado na busca.

## 7. Fases (SDD, uma spec por fase)

| Fase | Entrega | Verificação |
|---|---|---|
| 0. Fundação | Pasta, git, `.gitignore`, `.env.example`, `docs/brief.md` e `design.md`, tokens no Tailwind, layout base e aviso de temporada | `npm run build`, screenshot em 1440px e 390px |
| 1. Pipeline | `collect`, `transform`, `check`, JSON completo | `npm run data:check` passa, 20 clubes e 380 jogos |
| 2. Liga | Página inicial, busca, gráfico de gols por rodada | Playwright, console limpo |
| 3. Clube e jogos | Páginas de clube com abas, lista de jogos por rodada | Idem |
| 4. Jogadores e comparador | Rankings e comparador | Idem |
| 5. Acabamento | Revisão de acessibilidade, README com screenshots e seção "Built with AI", `tsc`, lint | `npm run build`, `npx tsc --noEmit`, lint |

## 8. Riscos

- **Temporada liberada desconhecida.** Se nenhuma temporada completa vier no plano gratuito, o plano B é o CSV aberto (leeofernandes1980) só para tabela e jogos, e as estatísticas por clube ficam derivadas dos jogos.
- **`teams/statistics` incompleto** em alguns clubes: a UI trata dado ausente com estado vazio explícito.
- **Cota diária:** coleta retomável e orçamento por etapa, como na seção 4.
- **Licença e termos:** conferir se os termos da API-Football permitem versionar as respostas no GitHub. Se não permitirem, o repositório traz só dados derivados e agregados, sem a resposta bruta.
- **Imagens do TheSportsDB:** escudos são marcas dos clubes. O README precisa informar o uso demonstrativo.

## 9. Decisões para você

1. **Nome do projeto** (o provisório é `brasileirao-stats`).
2. **Elenco na fase 3** (20 req a mais, mas dá vida à página do clube) ou deixar para depois?
3. **Estatísticas por jogo** (posse, chutes) levam 4 a 5 dias de coleta. Vale esperar, ou o projeto sai sem elas?
4. **Hospedagem:** Vercel ou GitHub Pages?
