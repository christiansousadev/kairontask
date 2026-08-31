# Auditoria 03 — Módulos de Domínio e Funcionalidades do Usuário

> **Módulos**: `src/app/features/` (Todos os 41 subsistemas de domínio)  
> **Camada**: Lógica de Negócio, Entidades, Componentes de Domínio e Integrações Externas

---

## 1. Visão Geral dos Módulos Funcionais

O diretório [`src/app/features/`](file:///c:/Projects/super-productivity/src/app/features) contém todos os módulos funcionais da aplicação. Cada funcionalidade é autocontida com modelos tipados, serviços de fachada (_Facade Services_), componentes visuais e slices no NgRx Store.

```
                            src/app/features/
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      ▼                            ▼                            ▼
[Core de Tarefas & Projetos] [Produtividade & Hábitos]   [Integrações de Issues]
- tasks                      - time-tracking             - issue (11 provedores)
- task-repeat-cfg            - take-a-break (Pomodoro)   - two-way-sync
- project                    - focus-mode                - calendar-integration
- tag                        - idle                      - issue-panel
- work-context               - before-finish-day
- work-view                  - metric
- planner                    - simple-counter
```

---

## 2. Catálogo Completo dos 41 Módulos de `src/app/features/`

### 2.1. Gestão de Tarefas, Projetos e Organização

| Módulo                   | Caminho                                  | Responsabilidade Técnica                                                                                          |
| :----------------------- | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **Tasks**                | `src/app/features/tasks/`                | Entidades de tarefas, subtarefas, tempo gasto (`timeSpent`), estimativas (`timeEstimate`), seleção e reordenação. |
| **Task Repeat Cfg**      | `src/app/features/task-repeat-cfg/`      | Regras de recorrência: tarefas diárias, dias da semana, intervalos customizados e projeção futura.                |
| **Task View Customizer** | `src/app/features/task-view-customizer/` | Configuração de colunas visíveis, densidade de exibição e campos extras na lista de tarefas.                      |
| **Project**              | `src/app/features/project/`              | Criação e gestão de projetos com cores temáticas (Primary/Accent/Warn), notas e bookmarks dedicados.              |
| **Tag**                  | `src/app/features/tag/`                  | Sistema de etiquetas para categorização transversal de tarefas. Contém a lógica da virtual `TODAY_TAG`.           |
| **Work Context**         | `src/app/features/work-context/`         | Abstração universal que unifica a visão entre Projetos e Tags, provendo seletores de tarefas ativas e métricas.   |
| **Work View**            | `src/app/features/work-view/`            | Tela principal de trabalho: lista de hoje, backlog arrastável, barra de adição rápida e painel bipartido.         |
| **Worklog**              | `src/app/features/worklog/`              | Registro histórico de horas trabalhadas por dia, semana e mês com exportação para CSV/JSON.                       |
| **Archive**              | `src/app/features/archive/`              | Arquivamento de tarefas antigas para manter a memória principal leve e descarregar no IndexedDB.                  |
| **Quick History**        | `src/app/features/quick-history/`        | Menu de acesso rápido às últimas tarefas manipuladas recentemente.                                                |
| **Markdown Checklist**   | `src/app/features/markdown-checklist/`   | Suporte a checklists interativas com caixas de seleção dentro das descrições das tarefas.                         |
| **Boards**               | `src/app/features/boards/`               | Visualização estilo quadro Kanban (A Fazer, Em Andamento, Concluído) para projetos e tags.                        |
| **Planner**              | `src/app/features/planner/`              | Planejador diário e semanal com visualização em calendário para distribuir carga de trabalho.                     |
| **Schedule**             | `src/app/features/schedule/`             | Diálogos de agendamento de tarefas com data, hora e lembrete associado.                                           |
| **Reminder**             | `src/app/features/reminder/`             | Agendador central de alarmes e notificações locais do sistema operacional.                                        |

---

### 2.2. Integrações de Issue Trackers (`src/app/features/issue/`)

O Super Productivity possui uma arquitetura extensível para conectar com 11 plataformas externas:

| Provedor           | Diretório                         | Funcionalidades Específicas                                                                                                               |
| :----------------- | :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Jira**           | `issue/providers/jira/`           | JQL search, transição de status (ex: In Progress -> Done), registro de worklogs remotos, suporte a Cloud e Jira Server via proxy Node.js. |
| **GitHub**         | `issue/providers/github/`         | Importação de issues e Pull Requests atribuídos, busca por repositório/organização, sincronização de status.                              |
| **GitLab**         | `issue/providers/gitlab/`         | Issues de projetos/grupos, time tracking nativo do GitLab, instâncias self-hosted e gitlab.com.                                           |
| **Linear**         | `issue/providers/linear/`         | Integração via GraphQL API de alta velocidade, filtros por Time, Projeto e Ciclo.                                                         |
| **Azure DevOps**   | `issue/providers/azure-devops/`   | Consulta a Work Items via queries WIQL e boards do Azure DevOps Server/Services.                                                          |
| **CalDAV**         | `issue/providers/caldav/`         | Sincronização com calendários Nextcloud/Radicale via protocolo RFC 4791 e parser `ical.js`.                                               |
| **Calendar**       | `issue/providers/calendar/`       | Importação de eventos de calendários genéricos iCal/ICS.                                                                                  |
| **Gitea**          | `issue/providers/gitea/`          | Issues em instâncias self-hosted do Gitea/Forgejo.                                                                                        |
| **Trello**         | `issue/providers/trello/`         | Importação de cards por quadro e lista com atualização de checkitems.                                                                     |
| **OpenProject**    | `issue/providers/open-project/`   | Sincronização de pacotes de trabalho (_Work Packages_) e prazos.                                                                          |
| **Redmine**        | `issue/providers/redmine/`        | Tickets e apontamento de horas em instâncias Redmine corporativas.                                                                        |
| **Nextcloud Deck** | `issue/providers/nextcloud-deck/` | Importação de cartões de quadros do app Deck do Nextcloud.                                                                                |
| **Two-Way Sync**   | `issue/two-way-sync/`             | Motor de sincronização bidirecional que envia conclusões e tempos de volta ao servidor remoto.                                            |

---

### 2.3. Hábitos, Foco e Produtividade

| Módulo                 | Caminho                                     | Responsabilidade Técnica                                                                            |
| :--------------------- | :------------------------------------------ | :-------------------------------------------------------------------------------------------------- |
| **Time Tracking**      | `src/app/features/time-tracking/`           | Motor de cronometragem precisa segundo a segundo na tarefa ativa.                                   |
| **Idle**               | `src/app/features/idle/`                    | Captura eventos de inatividade e exibe diálogo para alocar ou descartar o tempo ocioso.             |
| **Take a Break**       | `src/app/features/take-a-break/`            | Ciclos de Pomodoro e lembretes de pausa com opção de bloqueio de tela no Electron.                  |
| **Focus Mode**         | `src/app/features/focus-mode/`              | Modo imersivo em tela cheia com cronômetro gigante, notas rápidas e imagens relaxantes do Unsplash. |
| **Tracking Reminder**  | `src/app/features/tracking-reminder/`       | Alerta sonoro/visual caso o usuário esteja trabalhando sem nenhum cronômetro ativo.                 |
| **Before Finish Day**  | `src/app/features/before-finish-day/`       | Painel de encerramento do dia com resumo de horas, reflexão e reagendamento de pendências.          |
| **Finish Day Close**   | `src/app/features/finish-day-before-close/` | Intercepta o fechamento da janela para convidar o usuário a finalizar o expediente.                 |
| **Tasks For Tomorrow** | `src/app/features/add-tasks-for-tomorrow/`  | Planejamento rápido da lista de tarefas para o próximo dia útil.                                    |
| **Metric**             | `src/app/features/metric/`                  | Registro de métricas pessoais (produtividade, humor, energia) e gráficos via `chart.js`.            |
| **Simple Counter**     | `src/app/features/simple-counter/`          | Contadores manuais rápidos (ex: contagem de copos d'água, reuniões, chamadas telefônicas).          |
| **Note**               | `src/app/features/note/`                    | Bloco de notas rápido com suporte a Markdown, cores e fixação no topo.                              |

---

### 2.4. Infraestrutura de UI e Auxiliares

| Módulo                 | Caminho                                 | Responsabilidade Técnica                                                          |
| :--------------------- | :-------------------------------------- | :-------------------------------------------------------------------------------- |
| **Config**             | `src/app/features/config/`              | Painel de configurações globais com formulários dinâmicos via `@ngx-formly`.      |
| **User Profile**       | `src/app/features/user-profile/`        | Suporte a múltiplos perfis de usuário com dados isolados no mesmo dispositivo.    |
| **Onboarding**         | `src/app/features/onboarding/`          | Fluxo de boas-vindas e introdução para novos usuários.                            |
| **Shepherd**           | `src/app/features/shepherd/`            | Tours guiados interativos utilizando a biblioteca `shepherd.js`.                  |
| **Panels**             | `src/app/features/panels/`              | Controladores das gavetas laterais retráteis (Right Panel e Bottom Panel).        |
| **Right Panel**        | `src/app/features/right-panel/`         | Painel lateral direito para exibição de detalhes da tarefa, notas e issues.       |
| **Bottom Panel**       | `src/app/features/bottom-panel/`        | Painel inferior com atalhos e informações de contexto.                            |
| **Menu Tree**          | `src/app/features/menu-tree/`           | Árvore de navegação hierárquica da barra lateral.                                 |
| **UI Helper**          | `src/app/features/ui-helper/`           | Diretivas de autofocus, auto-select e utilitários visuais de template.            |
| **Dialog Please Rate** | `src/app/features/dialog-please-rate/`  | Diálogo educado solicitando avaliação do app nas lojas após semanas de uso ativo. |
| **Android / Mobile**   | `src/app/features/android/` / `mobile/` | Ajustes específicos para botões físicos de voltar e gestos de toque no celular.   |

---

## 3. Diretrizes de Desenvolvimento e Manutenção de Features

1. **Uso Exclusivo de Standalone Components**: Qualquer novo componente de feature deve ser declarado como `standalone: true`.
2. **Fachadas Reativas (Facade Pattern)**: Componentes não devem acessar diretamente o NgRx Store; sempre utilize o serviço de fachada correspondente (ex: `TaskService`, `ProjectService`, `WorkContextService`).
3. **Internacionalização Obrigatória**: Todo texto visível na interface deve utilizar a chave de tradução tipada `T.*` importada de [`src/app/t.const.ts`](file:///c:/Projects/super-productivity/src/app/t.const.ts).
