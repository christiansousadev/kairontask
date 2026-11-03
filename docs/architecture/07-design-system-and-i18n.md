# 07. Design System, UI, Temas e Internacionalização (i18n)

> **Módulos**: `src/styles/`, `docs/styling-guide.md`, `src/assets/i18n/`, `src/app/t.const.ts`, `tools/*i18n*`  
> **Camada**: Design Tokens, Folhas de Estilo Globais, Temas Dinâmicos, Tipografia e Sistema de Tradução

---

## 1. Visão Geral do Design System

O KaironTask possui um sistema de design baseado em **CSS Custom Properties (Variáveis CSS)** altamente modularizado e integrado com os componentes do Angular Material.

```
                    src/styles/_css-variables.scss
                     (Fonte da Verdade de Tokens)
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
  src/styles/themes.scss    Angular Material      Componentes Angular
   (Temas Claro/Escuro)     (Integração CSS Vars)  (SCSS encapsulado)
```

---

## 2. Folha-Mestra de Tokens (`src/styles/_css-variables.scss`)

O arquivo [`src/styles/_css-variables.scss`](file:///c:/Projects/kairontask/src/styles/_css-variables.scss) é o ponto central para qualquer ajuste de identidade visual, cores e espaçamento.

### 2.1. Catálogo dos Tokens Principais

| Categoria               | Variáveis Principais                                                                                                       | Descrição / Valores Padrão                                                                         |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **Marca**               | `--brand-violet`, `--brand-indigo`, `--brand-cyan`, `--brand-gradient`, `--brand-focus-ring`, `--brand-glow`               | Identidade Midnight Obsidian (ver seção 2.3).                                                      |
| **Paleta Material**     | `--c-primary`, `--c-accent`, `--c-warn`, `--palette-{primary,accent,warn}-{50..900}`                                       | Injetadas em tempo de execução pelo `angular-material-css-vars` a partir do tema do contexto.      |
| **Cores Semânticas**    | `--color-success`, `--color-warning`, `--color-danger`                                                                     | `#10b981`, `#f59e0b`, `#ef4444`.                                                                   |
| **Superfícies & Fundo** | `--bg`, `--bg-lighter`, `--card-bg`, `--task-c-bg`, `--sidenav-bg`, `--dark0`…`--dark24`                                   | Fundos de página, cartões de tarefa, barra lateral e escala de elevação escura.                    |
| **Texto & Ícones**      | `--text-color`, `--text-color-less-intense`, `--text-color-muted`, `--text-color-most-intense`                             | Hierarquia de contraste e legibilidade.                                                            |
| **Tipografia**          | `--font-primary-stack`                                                                                                     | Pilha de fontes: `'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`. |
| **Espaçamento**         | `--s` (8px), `--s2` (16px), `--s3` (24px), `--s4` (32px), `--s8` (64px)                                                    | Grid espacial proporcional.                                                                        |
| **Bordas & Sombras**    | `--card-border-radius` (10px), `--task-border-radius` (8px), `--md-sys-level*`, `--whiteframe-shadow-*dp`, `--task-shadow` | Cantos arredondados e elevações em camadas.                                                        |
| **Z-Index**             | `--z-side-nav`, `--z-main-header`, `--z-backdrop`, `--z-add-task-bar`, `--z-tour`                                          | Camadas de sobreposição sem risco de sobreposição incorreta.                                       |

> **Correção (2026-11-03)**: versões anteriores deste caderno listavam `--color-bg`, `--color-surface`, `--color-sidebar` e `--color-text-*`. Esses tokens **não existem** no código; a tabela acima reflete os nomes reais.

### 2.2. Regra Anti-Pattern do Projeto

> **Diretriz Crítica**: Conforme [`CLAUDE.md`](file:///c:/Projects/kairontask/CLAUDE.md) e [`docs/styling-guide.md`](file:///c:/Projects/kairontask/docs/styling-guide.md), **nunca redeclare estilos do Material Theme diretamente**. Sempre utilize as variáveis CSS e classes utilitárias já existentes em `_css-variables.scss`.

### 2.3. Identidade Visual "Midnight Obsidian" (2026-11-03)

Design system autoral do KaironTask: superfícies obsidiana com leve tom ardósia, **violeta** como primária e **ciano elétrico** como destaque.

| Papel         | Token / Local                             | Escuro                     | Claro                               |
| :------------ | :---------------------------------------- | :------------------------- | :---------------------------------- |
| Fundo         | `--bg`                                    | `#0b0d12` (`--dark0-5`)    | `#f5f6fa`                           |
| Barra lateral | `--sidenav-bg`                            | `#0e1117` (`--dark1`)      | transparente                        |
| Superfícies   | `--dark2` / `--card-bg` / `--task-c-bg`   | `#11141b` / `#161a23`      | `#ffffff`                           |
| Texto         | `--text-color`                            | `rgb(226, 230, 240)`       | `rgb(30, 34, 48)`                   |
| Bordas        | `--extra-border-color`, `--divider-color` | `rgba(148, 163, 255, 0.1)` | `#e6e8f0` / `rgba(30, 34, 48, 0.1)` |
| Primária      | `WORK_CONTEXT_DEFAULT_THEME.primary`      | `#7c3aed`                  | `#7c3aed`                           |
| Destaque      | `WORK_CONTEXT_DEFAULT_THEME.accent`       | `#22d3ee`                  | `#22d3ee`                           |

**Onde cada parte vive:**

- **Tokens CSS** — [`src/styles/_css-variables.scss`](file:///c:/Projects/kairontask/src/styles/_css-variables.scss): tokens `--brand-*`, escala obsidiana `--dark0`…`--dark24`, superfícies, texto, sombras mais profundas no escuro (`--md-sys-level*` sobrescritos em `body.isDarkTheme`), `--tag-chip-bg/-border`.
- **Tema padrão de contexto** — [`work-context.const.ts`](file:///c:/Projects/kairontask/src/app/features/work-context/work-context.const.ts): `DEFAULT_TAG_COLOR`/`DEFAULT_TODAY_TAG_COLOR = #7c3aed`, `DEFAULT_PROJECT_COLOR = #22d3ee`, accent `#22d3ee`. Afeta apenas projetos/tags novos ou sem tema salvo.
- **Presets** — [`validated-color-palettes.const.ts`](file:///c:/Projects/kairontask/src/app/core/theme/validated-color-palettes.const.ts): "Midnight Obsidian (Default)" adicionado; "Kairon Indigo" mantido como alternativa.
- **Componentes** — cartões de tarefa (raio 8px, sombras com contorno translúcido, realce ciano para tarefa atual e violeta para selecionada), entrada rápida com anel de foco ciano (`add-task-bar.component.scss`), tags em formato _pill_ (`tag.component.scss`), barra lateral com logotipo em gradiente e assinatura _by Christian Sousa_ (`magic-side-nav`).
- **Splash** — [`src/index.html`](file:///c:/Projects/kairontask/src/index.html): anel cônico violeta→ciano giratório, brilho pulsante, wordmark e suporte a `prefers-color-scheme` / `prefers-reduced-motion`.
- **Cores nativas alinhadas** — `page.scss` (área segura iOS), `global-theme.service.ts` (status/navigation bar Android), `capacitor.config.ts`, `android/app/src/main/res/values*/colors.xml`, `electron/main-window.ts` (title bar overlay), `src/manifest.json` (PWA).

---

## 3. Sistema de Temas (`src/styles/themes.scss`)

A aplicação suporta troca instantânea de temas em tempo de execução sem necessidade de recarregar a interface:

### 3.1. Temas Embutidos

1. **Dark Base** (Tema escuro padrão com alta legibilidade)
2. **Light Base** (Tema claro clássico)
3. **Catppuccin Mocha** (Paleta suave pastel escuro)
4. **Nord Polar Night** & **Nord Snow Storm** (Paleta nórdica fria)
5. **Dracula** (Tema escuro com contrastes em roxo/rosa)
6. **Everforest** (Paleta verde natural suave)
7. **Cyberpunk** (Tema neon de alto contraste)
8. **Glass** (Tema translúcido com efeitos de _glassmorphism_ e _backdrop-filter_)
9. **Rainbow / Arc** (Variações coloridas dinâmicas)

### 3.2. Tema Customizado via Arquivo Local (`styles.css`)

No Desktop Electron, o usuário pode colocar um arquivo `styles.css` diretamente na pasta de dados (`user-data-dir`). Esse arquivo é injetado no DOM após todos os estilos padrões, garantindo total liberdade para customização visual sem alterar o código fonte.

---

## 4. Tipografia e Fontes Offline

- **Fonte Oficial**: `@fontsource/open-sans` embutida no projeto em formato `.woff2` para garantir carregamento instantâneo e funcionamento 100% offline.
- **Ícones**:
  - Material Symbols através do pacote `@material-symbols/font-400`.
  - SVGs vetoriais customizados em [`src/assets/icons/`](file:///c:/Projects/kairontask/src/assets/icons/).

---

## 5. Arquitetura de Internacionalização (i18n)

### 5.1. O Arquivo Canônico `en.json`

- **Arquivo**: [`src/assets/i18n/en.json`](file:///c:/Projects/kairontask/src/assets/i18n/en.json)
- **Regra de Ouro**: **Apenas o arquivo `en.json` deve ser editado manualmente**.
- Os demais 20+ idiomas (pt, de, es, fr, zh, ru, etc.) são atualizados por ferramentas automatizadas de extração e tradutores comunitários.

### 5.2. Chaves Tipadas com Autocomplete (`src/app/t.const.ts`)

Para evitar erros de digitação de chaves em strings nos componentes TypeScript e templates HTML, o projeto gera a constante tipada `T`:

```typescript
import { T } from 'src/app/t.const';

// Exemplo de uso em TypeScript:
this._snackService.open(T.F.TASK.S.DONE);

// Exemplo de uso em Template HTML:
<span>{{ T.F.TASK.V.ADD_SUB_TASK | translate }}</span>
```

### 5.3. Scripts de Manutenção de Idiomas em `tools/`

- `npm run int`: Extrai novas chaves do código para o `en.json`.
- `npm run int:clean`: Remove chaves órfãs e organiza o JSON em ordem alfabética.
- `npm run int:test`: Valida a integridade de todos os arquivos de idioma e previne quebras de interpolação no CI.
- `npm run int:unused`: Identifica chaves não utilizadas no projeto.
