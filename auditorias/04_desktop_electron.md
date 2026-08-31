# Auditoria 04 — Camada Desktop (Electron)

> **Módulos**: `electron/`, `electron-builder.yaml`, `electron/shared-with-frontend/`, `electron/ipc-handlers/`  
> **Camada**: Wrapper Desktop, Processo Principal Node.js, Sandboxing e Integração Nativa com o Sistema Operacional

---

## 1. Visão Geral da Arquitetura Desktop

O Super Productivity utiliza o **Electron 37+** para empacotar a aplicação web em uma aplicação desktop nativa para Windows, macOS e Linux. A arquitetura segue rigorosamente as recomendações de segurança do Electron, mantendo o processo Node.js completamente isolado do Renderer via `Context Isolation` e `Preload Bridge`.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MAIN PROCESS (Node.js)                            │
│  electron/main.ts  -->  electron/start-app.ts  -->  electron/main-window.ts │
├─────────────────────────────────────────────────────────────────────────────┤
│ Native Subsystems:                                                          │
│ - Idle Time Handler (powerMonitor)    - Local REST API (Stream Deck/CLI)    │
│ - Tray Indicator & Live Tooltip       - Jira Proxy (HTTPS sem CORS)         │
│ - Full-screen Pomodoro Blocker        - Local File Sync (fs direto)         │
│ - Plugin Node Sandbox & OAuth         - Deep Link Protocol Handler          │
├─────────────────────────────────────────────────────────────────────────────┤
│ IPC Handlers (electron/ipc-handlers/):                                      │
│ - app-control.ts    - exec.ts              - jira.ts                        │
│ - app-data.ts       - global-shortcuts.ts  - system.ts                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ IPC (ContextBridge)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRELOAD & CONTRATO IPC                              │
│         electron/preload.ts  <--->  electron/electronAPI.d.ts               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ window.ea.*
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RENDERER PROCESS (Angular)                          │
│               src/app/core/electron/ (IS_ELECTRON = true)                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Processo Principal e Inicialização (`electron/`)

- **Ponto de Entrada**: [`electron/main.ts`](file:///c:/Projects/super-productivity/electron/main.ts) inicia o ciclo e delega a orquestração para [`electron/start-app.ts`](file:///c:/Projects/super-productivity/electron/start-app.ts).
- **Instância Única (`Single Instance Lock`)**: Utiliza `app.requestSingleInstanceLock()` para garantir que apenas um processo do aplicativo execute simultaneamente; abrir uma nova instância foca a janela existente.
- **Gerenciamento de Janela (`electron/main-window.ts`)**:
  - Salva e restaura coordenadas, largura e altura da janela via `electron-window-state`.
  - Configura opções de segurança: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: false` (para suporte aos scripts do preload tipados).
  - Suporte a tema escuro/claro nativo no frame da janela.

---

## 3. Catálogo dos Subsistemas Nativos do Electron

| Subsistema              | Arquivo                                          | Responsabilidade Técnica                                                                                                                                                                       |
| :---------------------- | :----------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Idle Time Handler**   | `electron/idle-time-handler.ts`                  | Monitora o tempo de inatividade do usuário com `powerMonitor.getSystemIdleTime()`. Avisa o renderer quando o usuário fica inativo por mais de X minutos para tratar o tempo ocioso.            |
| **Indicator & Tray**    | `electron/indicator.ts`                          | Ícone na bandeja do sistema (Windows Taskbar, macOS Menu Bar, Linux AppIndicator) com menus de contexto dinâmicos, controle de play/pause e contagem de tempo no tooltip.                      |
| **Proxy do Jira**       | `electron/jira.ts`                               | Executa chamadas HTTPS via Node.js puro (`node-fetch` / `https-proxy-agent`) para instâncias Jira Cloud e Jira Server corporativas, contornando bloqueios de CORS e certificados customizados. |
| **Local File Sync**     | `electron/local-file-sync.ts`                    | Permite sincronização lendo e gravando diretamente em um arquivo local no disco rígido (compatível com Syncthing, pastas de rede e discos compartilhados).                                     |
| **Local REST API**      | `electron/local-rest-api.ts`                     | Microservidor HTTP local que expõe endpoints REST protegidos para automações externas, atalhos do terminal e botões do Elgato Stream Deck.                                                     |
| **Full-screen Blocker** | `electron/full-screen-blocker.ts`                | Cria uma janela secundária modal opaca e em tela cheia para forçar o descanso visual durante pausas longas do Pomodoro.                                                                        |
| **Lockscreen Monitor**  | `electron/lockscreen.ts`                         | Detecta quando o usuário bloqueia ou desbloqueia a tela do sistema operacional para pausar o cronômetro automaticamente.                                                                       |
| **Clipboard Image**     | `electron/clipboard-image-handler.ts`            | Lê buffers binários de imagens coladas na área de transferência diretamente do sistema operacional.                                                                                            |
| **Plugin Executor**     | `electron/plugin-node-executor.ts`               | Sandbox para execução de scripts de backend de plugins instalados pelo usuário.                                                                                                                |
| **Protocol Handler**    | `electron/protocol-handler.ts`                   | Registra e gerencia o esquema de URL `super-productivity://` para abertura de tarefas via links externos e callbacks OAuth.                                                                    |
| **Error Informer**      | `electron/error-handler-with-frontend-inform.ts` | Captura exceções não tratadas no processo Node.js e envia via IPC para a UI exibir uma mensagem amigável antes de falhar.                                                                      |
| **Task Widget**         | `electron/task-widget/`                          | Mini-janela flutuante (_Always-on-Top_) compacta para controle rápido de tarefas sem ocupar a tela inteira.                                                                                    |
| **Automated Backup**    | `electron/backup.ts`                             | Rotina de snapshot que grava arquivos JSON timestamped na subpasta `backup/` do diretório de dados do usuário.                                                                                 |

---

## 4. Camada de IPC e Segurança (`electron/ipc-handlers/`)

A comunicação entre o Angular e o Electron é isolada através de handlers tipados:

1. **`app-control.ts`**: Controle do ciclo de vida da janela (fechar, minimizar, maximizar, reiniciar, definir progresso na barra de tarefas).
2. **`app-data.ts`**: Consulta caminhos do sistema operacional (`userDataPath`, `desktopPath`, versão do app).
3. **`exec.ts`**: Execução controlada de scripts e comandos do sistema operacional configurados em bookmarks de projetos.
4. **`global-shortcuts.ts`**: Registro e escuta de atalhos de teclado globais do sistema (ex: pausar/iniciar tarefa mesmo com o app minimizado).
5. **`jira.ts`**: Roteamento de chamadas de rede autenticadas para o Jira.
6. **`system.ts`**: Abertura segura de links externos no navegador padrão (`shell.openExternal`) e abertura de arquivos locais (`shell.openPath`).

### 4.1. Contrato Tipado no Preload

- **Arquivo de Tipos**: [`electron/electronAPI.d.ts`](file:///c:/Projects/super-productivity/electron/electronAPI.d.ts)
- **Implementação do Bridge**: [`electron/preload.ts`](file:///c:/Projects/super-productivity/electron/preload.ts) expõe o namespace seguro `window.ea`.

---

## 5. Empacotamento Desktop (`electron-builder.yaml`)

O arquivo [`electron-builder.yaml`](file:///c:/Projects/super-productivity/electron-builder.yaml) controla a geração de binários:

- **Windows**:
  - `NSIS`: Instalador `.exe` de 64 bits com assistente completo.
  - `AppX`: Pacote universal para distribuição na Microsoft Store.
  - `Portable`: Executável sem necessidade de privilégios de administrador.
- **macOS**:
  - `DMG`: Imagem de disco padrão para distribuição direta com notarização Apple.
  - `MAS`: Build sandboxed para a Mac App Store (`build/electron-builder.mas.yaml`).
- **Linux**:
  - `AppImage`: Pacote universal portátil para distribuições modernas.
  - `deb`: Pacote para Debian/Ubuntu/Mint.
  - `snap`: Pacote Snapcraft para a Snap Store.

---

## 6. Diretrizes de Manutenção do Electron

1. **Sincronia de Assinaturas de IPC**: Qualquer alteração em métodos IPC deve ser refletida simultaneamente em `ipc-handlers/*`, `electron/preload.ts`, `electron/electronAPI.d.ts` e `electron/shared-with-frontend/ipc-events.const.ts`.
2. **Compatibilidade Linux Wayland**: Ao inicializar em ambientes Wayland, o Electron detecta a sessão e pode aplicar a flag `--force-x11` caso haja incompatibilidade com aceleradores gráficos.
