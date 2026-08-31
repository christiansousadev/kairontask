# Auditoria 01 — Arquitetura Base, Core e Gerenciamento de Estado

> **Módulos**: `src/main.ts`, `src/app/core/`, `src/app/root-store/`, `src/app/routes/`, `src/app/util/`  
> **Camada**: Core da Aplicação, Bootstrap, Injeção de Dependências e Infraestrutura de Estado

---

## 1. Visão Geral da Arquitetura do Frontend

O Super Productivity foi desenvolvido como uma Single Page Application (SPA) Angular de alto desempenho, utilizando:

- **Standalone Components & Directives**: Sem a complexidade de `NgModule` legado para novos componentes.
- **Signals & Reatividade Fina**: Combina Signals nativos do Angular (`signal`, `computed`, `toSignal`) para renderização otimizada com **RxJS** para pipelines de eventos assíncronos.
- **NgRx Store com Meta-Reducers Atômicos**: Garante que o estado seja determinístico, imutável e sincronizável de ponta a ponta.

```
                           src/main.ts
                    (bootstrapApplication)
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
      App Providers                        AppComponent
  - provideStore / Effects              (Root Shell UI)
  - provideHttpClient                          │
  - provideRouter (app.routes.ts)              ▼
  - GlobalErrorHandler (ErrorHandler)   Dynamic Router Outlet
  - TranslateModule (i18n)             (Lazy-loaded routes)
```

---

## 2. Inventário dos 27 Subsistemas do `src/app/core/`

O diretório [`src/app/core/`](file:///c:/Projects/super-productivity/src/app/core) isola serviços de infraestrutura e utilitários globais:

| Subsistema                   | Caminho                                            | Responsabilidade Técnica                                                                                        |
| :--------------------------- | :------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **Log Central**              | `src/app/core/log.ts`                              | Wrapper único para `Log.log/warn/error`, buffer de histórico em memória e stream `logEvents$`.                  |
| **Error Handler**            | `src/app/core/error-handler/`                      | `GlobalErrorHandler` captura falhas não tratadas, sanitiza stack traces (`stacktrace-js`) e notifica o usuário. |
| **Data Init**                | `src/app/core/data-init/`                          | Inicializa dados essenciais no primeiro boot do aplicativo ou após reset de fábrica.                            |
| **Data Repair**              | `src/app/core/data-repair/`                        | Corrige inconsistências em dados herdados de versões antigas do app ou corrupções parciais.                     |
| **Persistence Core**         | `src/app/core/persistence/`                        | Camada de abstração de armazenamento local para preferências simples e chaves de sessão.                        |
| **Global Tracking Interval** | `src/app/core/global-tracking-interval/`           | Ticker mestre de tempo que orquestra a contagem de segundos para tarefas ativas e lembretes.                    |
| **Date & Time Formats**      | `src/app/core/date-time-format/`                   | Formatação de datas e horários respeitando a localidade do usuário e fusos horários.                            |
| **Platform Info**            | `src/app/core/platform/`                           | Detecta ambiente de execução: `IS_ELECTRON`, `IS_ANDROID`, `IS_IOS`, `IS_WEB`, `IS_TOUCH`.                      |
| **Notify**                   | `src/app/core/notify/`                             | Dispara notificações visuais e sonoras usando a Web Notification API, Electron ou Capacitor.                    |
| **Snack**                    | `src/app/core/snack/`                              | Serviço de exibição de mensagens rápidas (Snackbars / Toasts) do Angular Material.                              |
| **Banner**                   | `src/app/core/banner/`                             | Gerencia banners de alerta fixos no topo da interface (ex: avisos de erro de sync ou atualizações).             |
| **Theme Service**            | `src/app/core/theme/`                              | Aplica temas dinamicamente injetando classes CSS e variáveis no elemento `<html>`.                              |
| **Unsplash**                 | `src/app/core/unsplash/`                           | Busca de imagens de fundo inspiradoras para o modo foco via API do Unsplash.                                    |
| **Input Intent**             | `src/app/core/input-intent/`                       | Identifica se o usuário está interagindo via teclado, mouse ou toque para adaptar estilos de foco.              |
| **Keyboard Layout**          | `src/app/core/keyboard-layout/`                    | Mapeamento de atalhos e suporte a layouts de teclado internacionais.                                            |
| **Language**                 | `src/app/core/language/`                           | Detecta idioma do sistema operacional e orquestra o carregamento de arquivos de tradução.                       |
| **Clipboard Image**          | `src/app/core/clipboard-image/`                    | Captura e processamento de imagens coladas via `Ctrl+V` para anexar em tarefas/notas.                           |
| **Drop & Paste**             | `src/app/core/drop-paste-input/`                   | Manipulação de arquivos arrastados e soltos na interface.                                                       |
| **Startup Overlay**          | `src/app/core/startup-overlay/`                    | Gerencia o splash screen e o overlay de carregamento inicial até a hidratação total do store.                   |
| **Initial PWA Check**        | `src/app/core/initial-pwa-update-check.service.ts` | Verifica atualizações do Service Worker no ciclo de inicialização da PWA.                                       |
| **Confetti**                 | `src/app/core/confetti/`                           | Efeito visual comemorativo ao concluir todas as tarefas do dia via `canvas-confetti`.                           |
| **Example Tasks**            | `src/app/core/example-tasks/`                      | Conjunto de tarefas de demonstração para onboarding de novos usuários.                                          |
| **Share**                    | `src/app/core/share/`                              | Integração com a Web Share API e plugin Capacitor Share no mobile.                                              |
| **IPC Events Frontend**      | `src/app/core/ipc-events.ts`                       | Utilitários de envio de mensagens IPC quando executando em contexto Electron.                                   |

---

## 3. Gerenciamento de Estado: Root Store & Meta-Reducers

### 3.1. Arquitetura do Root Store (`src/app/root-store/`)

O estado global do aplicativo é registrado no [`src/app/root-store/root-state.ts`](file:///c:/Projects/super-productivity/src/app/root-store/root-state.ts) e orquestrado pelo [`src/app/root-store/meta/meta-reducer-registry.ts`](file:///c:/Projects/super-productivity/src/app/root-store/meta/meta-reducer-registry.ts).

### 3.2. A Suíte de Meta-Reducers Compartilhados (`task-shared-meta-reducers/`)

Mutações complexas no Super Productivity **nunca são feitas através de múltiplos efeitos assíncronos encadeados**, pois isso geraria operações parciais no log de sincronização e inconsistência de dados. Em vez disso, o projeto utiliza **Meta-Reducers Atômicos**:

```
                    Ação Despachada (ex: deleteTask)
                                  │
                                  ▼
             ┌────────────────────────────────────────┐
             │         Meta-Reducer Pipeline          │
             │                                        │
             │ 1. task-shared-crud.reducer            │
             │    - Remove a tarefa do slice 'tasks'  │
             │                                        │
             │ 2. tag-shared.reducer                  │
             │    - Limpa o ID da tarefa nas Tags     │
             │                                        │
             │ 3. project-shared.reducer              │
             │    - Limpa o ID da tarefa nos Projetos │
             │                                        │
             │ 4. planner-shared.reducer              │
             │    - Limpa o agendamento no Planner    │
             │                                        │
             │ 5. validate-and-fix-data-consistency   │
             │    - Valida integridade referencial    │
             └───────────────────┬────────────────────┘
                                 │
                                 ▼
                   Novo Estado Consolidado e Atômico
                   (1 Única Operação gerada no Op-Log)
```

#### Catálogo dos Meta-Reducers:

1. **`LWWUpdateMetaReducer` (`lww-update.meta-reducer.ts`)**: Implementa resolução _Last-Write-Wins_ a nível de propriedade para evitar sobreposição cega de dados concorrentes.
2. **`taskSharedCrudReducer` (`task-shared-crud.reducer.ts`)**: Adição, remoção e edição atômica de tarefas e subtarefas.
3. **`taskSharedLifecycleReducer` (`task-shared-lifecycle.reducer.ts`)**: Marcação de conclusão (`done`), reabertura e arquivamento de tarefas.
4. **`taskSharedSchedulingReducer` (`task-shared-scheduling.reducer.ts`)**: Agendamento de prazos (`dueDay`), lembretes e movimentação para a lista de hoje.
5. **`tagSharedReducer` (`tag-shared.reducer.ts`)**: Atualiza as listas de IDs em tags quando tarefas são manipuladas.
6. **`projectSharedReducer` (`project-shared.reducer.ts`)**: Mantém a coerência da lista de tarefas vinculadas a projetos.
7. **`plannerSharedReducer` (`planner-shared.reducer.ts`)**: Aloca e desaloca tarefas nos slots de calendário do planejador.
8. **`shortSyntaxSharedReducer` (`short-syntax-shared.reducer.ts`)**: Processa tags (`#`), projetos (`+`) e estimativas de tempo digitadas no título da tarefa durante a criação.
9. **`issueProviderSharedReducer` (`issue-provider-shared.reducer.ts`)**: Criação e atualização de tarefas atreladas a tickets externos (Jira, GitHub, etc.).
10. **`validateAndFixDataConsistency` (`validate-and-fix-data-consistency-after-batch-update.ts`)**: Cinto de segurança que executa asserções estruturais pós-mutação para reparar qualquer ID órfão.

---

## 4. O Padrão `LOCAL_ACTIONS` e Proteção contra Efeitos Remotos

### 4.1. O Token `LOCAL_ACTIONS` (`src/app/util/local-actions.token.ts`)

- **Regra Fundamental do Projeto**: Todo NgRx Effect deve injetar `LOCAL_ACTIONS`:

  ```typescript
  // CORRETO:
  private _actions$ = inject(LOCAL_ACTIONS);

  // PROIBIDO:
  private _actions$ = inject(Actions);
  ```

- **Por que é crucial?** Durante a sincronização, o `OperationApplierService` recebe operações remotas (ex: "tarefa concluída no smartphone") e despacha ações no NgRx para atualizar a interface do desktop. Se os Effects ouvissem o stream global `Actions`, efeitos colaterais como **tocar som de conclusão, exibir notificação push ou reenviar a operação para o servidor** disparariam em loop infinito. O `LOCAL_ACTIONS` filtra apenas ações iniciadas pelo usuário neste dispositivo.

### 4.2. Efeitos Baseados em Seletores

- Conforme [`CLAUDE.md`](file:///c:/Projects/super-productivity/CLAUDE.md), seletores ignoram a filtragem de ações. Se for estritamente necessário criar um effect que escuta um seletor (`this._store$.select(...)`), ele deve ser protegido com:
  ```typescript
  if (this._hydrationStateService.isApplyingRemoteOps()) {
    return; // Ignora se for replay de sincronização remota
  }
  ```

---

## 5. A Regra Arquitetural da Tag Virtual `TODAY`

- **Decisão de Arquitetura**: A tag com ID `'TODAY'` é uma **tag virtual**.
- **Regra de Ouro**: `task.tagIds` **nunca** deve conter `'TODAY'`.
- **Mecanismo**: A inclusão de uma tarefa no dia de hoje é calculada dinamicamente com base no campo `task.dueDay === todayDateStr`. O objeto `TODAY_TAG.taskIds` no store guarda unicamente a **ordem visual** das tarefas na lista diária.

---

## 6. Auditoria de Logging e Boas Práticas (`Log.ts`)

O arquivo [`src/app/core/log.ts`](file:///c:/Projects/super-productivity/src/app/core/log.ts) implementa um sistema de log seguro com buffer circular para exportação em diagnósticos técnicos.

### 6.1. Diretrizes de Sanitização de Logs:

- ❌ **Anti-Pattern Proibido**: `Log.log(task)` ou `Log.log(task.title)` — Usuários exportam logs para relatar bugs no GitHub. Logar títulos ou descrições de tarefas expõe informações confidenciais do usuário.
- ✅ **Pattern Obrigatório**: `Log.log({ id: task.id })` ou `Log.log('Task moved', { taskId: task.id, targetDay })`.

---

## 7. Recomendações de Manutenção e Evolução do Core

1. **HttpInterceptor Global**: Criar `src/app/core/http/global-http.interceptor.ts` para capturar falhas de rede de forma unificada para todas as integrações.
2. **Opt-in de Telemetria Corporativa**: Caso seja adicionado Sentry/Bugsnag no `GlobalErrorHandler`, vincular a inicialização a uma variável `environment.enableTelemetry` com opt-in explícito na tela de boas-vindas.
