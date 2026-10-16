# Auditoria 02 — Persistência, Sincronização e Log de Operações (Op-Log)

> **Módulos**: `src/app/op-log/`, `src/app/pfapi/`, `src/app/imex/sync/`, `src/app/imex/local-backup/`, `src/app/imex/file-imex/`  
> **Camada**: Persistência de Dados Local-First, Sincronização Distribuída e Resolução de Conflitos

---

## 1. Visão Geral da Arquitetura Local-First

O KaironTask adota o paradigma **Local-First**, onde:

1. Todos os dados residem primariamente no dispositivo do usuário (IndexedDB).
2. Cada modificação gera uma operação imutável versionada por **Relógios Vetoriais (Vector Clocks)**.
3. A sincronização entre dispositivos é determinística, suportando múltiplos nós offline sem servidor central autoritativo obrigatório.

```
                    ┌───────────────────────────────┐
                    │        NgRx Root Store        │
                    └───────────────┬───────────────┘
                                    │ Mutação do Usuário
                                    ▼
                    ┌───────────────────────────────┐
                    │    src/app/op-log/capture/    │
                    │   (Gera Operação + UUIDv7)    │
                    └───────────────┬───────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│     src/app/op-log/apply/     │               │     src/app/op-log/sync/      │
│  - OperationApplierService    │               │  - OperationLogSyncService    │
│  - ArchiveOperationHandler    │               │  - ConflictResolutionService  │
│  - BulkHydrationMetaReducer   │               │  - VectorClockService         │
│  - HydrationStateService      │               │  - SuperSyncWebSocketService  │
└───────────────┬───────────────┘               └───────────────┬───────────────┘
                │                                               │
                ▼                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│        src/app/pfapi/         │               │     src/app/imex/sync/        │
│   - IndexedDB (idb) Engine    │               │  - WebDAV (Nextcloud/Apache)  │
│   - Stores: op_log, app_data, │               │  - Dropbox API                │
│             archive           │               │  - SuperSync (Self-hosted)    │
└───────────────────────────────┘               │  - LocalFile (Direct Disk)    │
                                                └───────────────────────────────┘
```

---

## 2. O Subsistema de Log de Operações (`src/app/op-log/`)

### 2.1. Anatomia de uma Operação

Cada operação gerada no sistema possui a seguinte estrutura tipada:

```typescript
interface Operation {
  id: string; // UUIDv7 (ordenável no tempo por timestamp embutido)
  action: Action; // Ação tipada do NgRx
  vectorClock: VectorClock; // Mapa { [clientId: string]: number }
  timestamp: number; // Unix timestamp em milissegundos
  clientId: string; // Identificador único deste cliente
  entityType?: string; // Ex: 'TASK', 'PROJECT', 'TAG'
  entityId?: string; // ID da entidade afetada
}
```

---

## 3. Inventário dos 17+ Serviços de Sincronização em `src/app/op-log/sync/`

| Serviço                       | Arquivo                                    | Responsabilidade Técnica                                                                                      |
| :---------------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Orquestrador Mestre**       | `operation-log-sync.service.ts`            | Conduz o ciclo de sincronização: lock → download → resolução → aplicação → upload.                            |
| **Resolução de Conflitos**    | `conflict-resolution.service.ts`           | Avalia causalidade via Vector Clocks e aplica regras de Last-Write-Wins (LWW) para operações concorrentes.    |
| **Processamento Remoto**      | `remote-ops-processing.service.ts`         | Converte operações recebidas do servidor em ações executáveis no NgRx do cliente.                             |
| **Filtro de Sync Import**     | `sync-import-filter.service.ts`            | Invalida e descarta operações concorrentes quando uma importação de backup total (`SYNC_IMPORT`) é executada. |
| **Relógio Vetorial**          | `vector-clock.service.ts`                  | Compara versões causais (`EQUAL`, `GREATER_THAN`, `LESS_THAN`, `CONCURRENT`) e incrementa o clock local.      |
| **WebSocket SuperSync**       | `super-sync-websocket.service.ts`          | Mantém conexão persistente WebSocket com o servidor SuperSync para push instantâneo de novas operações.       |
| **Gatilho por WS**            | `ws-triggered-download.service.ts`         | Dispara download de deltas imediatamente ao receber notificação via WebSocket.                                |
| **Upload de Operações**       | `operation-log-upload.service.ts`          | Empacota e envia operações locais pendentes para o servidor ou pasta remota.                                  |
| **Download de Operações**     | `operation-log-download.service.ts`        | Baixa operações pendentes registradas por outros dispositivos desde o último sync.                            |
| **Upload Imediato**           | `immediate-upload.service.ts`              | Envia mutações críticas em tempo real sem esperar o intervalo periódico padrão.                               |
| **Mutex Lock**                | `lock.service.ts`                          | Impede concorrência de sincronização entre abas do navegador ou múltiplos processos simultâneos.              |
| **Resolvedor de Supressão**   | `superseded-operation-resolver.service.ts` | Descarta operações intermediárias obsoletas (ex: 10 edições rápidas do mesmo título de tarefa).               |
| **Tratamento de Rejeições**   | `rejected-ops-handler.service.ts`          | Trata operações rejeitadas pelo servidor por violação de schema ou incompatibilidade.                         |
| **Criptografia de Operações** | `operation-encryption.service.ts`          | Criptografa/decriptografa payloads de operações com AES-GCM antes do envio e após o download.                 |
| **Flush de Escrita**          | `operation-write-flush.service.ts`         | Agrupa escritas no IndexedDB com debounce para otimizar I/O em discos lentos ou mobile.                       |
| **Migração de Servidor**      | `server-migration.service.ts`              | Gerencia transições suaves de endereço de servidor ou recriação de tabelas remotas.                           |
| **Status do SuperSync**       | `super-sync-status.service.ts`             | Expõe estado reativo da conexão (online, offline, sincronizando, erro).                                       |

---

## 4. O Subsistema de Aplicação de Operações (`src/app/op-log/apply/`)

1. **`OperationApplierService` (`operation-applier.service.ts`)**:
   - Aplica operações remotas despachando ações no NgRx Store em lote.
   - **Regra Crítica**: Executa `await new Promise(resolve => setTimeout(resolve, 0))` após despachos em lote para permitir que o Event Loop do JavaScript processe o estado antes de operações subsequentes.
2. **`ArchiveOperationHandlerService` (`archive-operation-handler.service.ts`)**:
   - Como tarefas arquivadas não ficam na memória do NgRx (para poupar RAM), este serviço grava e remove tarefas arquivadas diretamente no IndexedDB quando operações de arquivamento são recebidas de outros clientes.
3. **`HydrationStateService` (`hydration-state.service.ts`)**:
   - Flag reativa `isApplyingRemoteOps()` que sinaliza quando o store está sendo atualizado por sincronização remota, permitindo que componentes e seletores ignorem side-effects locais.

---

## 5. Persistência Local com IndexedDB (`src/app/pfapi/`)

O KaironTask utiliza uma camada de persistência robusta baseada em IndexedDB encapsulada em [`src/app/pfapi/`](file:///c:/Projects/kairontask/src/app/pfapi/):

- **Object Store `op_log`**: Tabela sequencial contendo todas as operações pendentes e aplicadas.
- **Object Store `app_data`**: Armazena snapshots periódicos compactados do estado do NgRx. Na inicialização do app, o snapshot mais recente é carregado e apenas as operações posteriores a ele são reprocessadas (_Fast Startup_).
- **Object Store `archive`**: Repositório persistente de tarefas e logs de dias passados arquivados.

---

## 6. Provedores de Sincronização (`src/app/imex/sync/`)

### 6.1. WebDAV (`src/app/imex/sync/`)

- Suporta Nextcloud, ownCloud, Apache e servidores WebDAV customizados.
- Arquivos de estado gravados remotamente:
  - `super-productivity-backup.json` (Snapshot)
  - `op-log/` (Deltas de operações criptografadas)

### 6.2. Dropbox (`src/app/imex/sync/dropbox/`)

- Integração via API v2 oficial do Dropbox.
- Gestão de tokens de renovação (refresh tokens) e fluxo OAuth no Electron e Web.

### 6.3. SuperSync (`packages/super-sync-server/`)

- Backend dedicado em Node.js e PostgreSQL.
- Sincronização bidirecional em milissegundos via WebSocket com verificação de integridade criptográfica de snapshots.

### 6.4. Sincronização em Arquivo Local (`LocalFile`)

- Exclusivo para Desktop Electron. Permite apontar o sync para um diretório local sincronizado via Syncthing, Google Drive Desktop, OneDrive ou NFS.

---

## 7. Criptografia Ponta a Ponta (E2EE)

- **Serviços**: `FileBasedEncryptionService`, `EncryptionPasswordChangeService`, `SuperSyncEncryptionToggleService`.
- **Tecnologia**: Criptografia autenticada com `@noble/ciphers` (AES-256-GCM) e KDF com sal para derivação da chave a partir da senha do usuário.
- **Zero-Knowledge**: O servidor (SuperSync ou WebDAV) nunca tem acesso à chave de descriptografia nem aos dados em texto puro.

---

## 8. Backups e Recuperação (`src/app/imex/local-backup/` e `file-imex/`)

- **Backup Automático no Electron**: Gera arquivos `.json` timestamped em `user-data-dir/backup/`.
- **Restauração Segura**: O diálogo `dialog-restore-point` permite inspecionar snapshots, comparar datas e restaurar com um clique.
- **Semântica de Restauração**: Ao restaurar um backup, o sistema emite um `BACKUP_IMPORT`, redefinindo a linhagem causal e impedindo contaminação por estados desatualizados.
