# Auditoria 07 — Design System, UI, Temas e Internacionalização (i18n)

> **Módulos**: `src/styles/`, `docs/styling-guide.md`, `src/assets/i18n/`, `src/app/t.const.ts`, `tools/*i18n*`  
> **Camada**: Design Tokens, Folhas de Estilo Globais, Temas Dinâmicos, Tipografia e Sistema de Tradução

---

## 1. Visão Geral do Design System

O Super Productivity possui um sistema de design baseado em **CSS Custom Properties (Variáveis CSS)** altamente modularizado e integrado com os componentes do Angular Material.

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

O arquivo [`src/styles/_css-variables.scss`](file:///c:/Projects/super-productivity/src/styles/_css-variables.scss) é o ponto central para qualquer ajuste de identidade visual, cores e espaçamento.

### 2.1. Catálogo dos Tokens Principais

| Categoria               | Variáveis Principais                                                    | Descrição / Valores Padrão                                                                         |
| :---------------------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **Cores Semânticas**    | `--color-primary`, `--color-accent`, `--color-warn`                     | Cores principais da identidade e botões de ação.                                                   |
| **Superfícies & Fundo** | `--color-bg`, `--color-surface`, `--color-sidebar`                      | Fundos de página, cartões de tarefa e barras laterais.                                             |
| **Texto & Ícones**      | `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`  | Hierarquia de contraste e legibilidade.                                                            |
| **Tipografia**          | `--font-primary-stack`                                                  | Pilha de fontes: `'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`. |
| **Espaçamento**         | `--s` (8px), `--s2` (16px), `--s3` (24px), `--s4` (32px), `--s8` (64px) | Grid espacial proporcional.                                                                        |
| **Bordas & Sombras**    | `--card-border-radius`, `--default-box-shadow`, `--elevation-z*`        | Cantos arredondados e elevações em camadas.                                                        |
| **Z-Index**             | `--z-sidebar`, `--z-header`, `--z-modal`, `--z-toast`, `--z-blocker`    | Camadas de sobreposição sem risco de sobreposição incorreta.                                       |

### 2.2. Regra Anti-Pattern do Projeto

> **Diretriz Crítica**: Conforme [`CLAUDE.md`](file:///c:/Projects/super-productivity/CLAUDE.md) e [`docs/styling-guide.md`](file:///c:/Projects/super-productivity/docs/styling-guide.md), **nunca redeclare estilos do Material Theme diretamente**. Sempre utilize as variáveis CSS e classes utilitárias já existentes em `_css-variables.scss`.

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
  - SVGs vetoriais customizados em [`src/assets/icons/`](file:///c:/Projects/super-productivity/src/assets/icons/).

---

## 5. Arquitetura de Internacionalização (i18n)

### 5.1. O Arquivo Canônico `en.json`

- **Arquivo**: [`src/assets/i18n/en.json`](file:///c:/Projects/super-productivity/src/assets/i18n/en.json)
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
