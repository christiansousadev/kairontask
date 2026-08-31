# Auditoria 06 — Sub-pacotes, Plugins e Ecossistema de Extensibilidade

> **Módulos**: `packages/`, `src/app/plugins/`, `src/assets/community-plugins.json`, `docs/plugin-development.md`  
> **Camada**: SDKs Internos, Tipagem Compartilhada, Backend SuperSync e Sistema de Extensão por Plugins

---

## 1. Visão Geral da Pasta `packages/`

O Super Productivity estrutura suas bibliotecas reutilizáveis e microsserviços na pasta [`packages/`](file:///c:/Projects/super-productivity/packages). Todos os sub-pacotes são gerenciados via npm workspaces e orquestrados pelo script de compilação [`packages/build-packages.js`](file:///c:/Projects/super-productivity/packages/build-packages.js).

```
                            packages/
                                │
      ┌─────────────────────────┼─────────────────────────┐
      ▼                         ▼                         ▼
plugin-api              shared-schema             super-sync-server
(SDK para Plugins)      (Tipos Compartilhados)    (Backend PostgreSQL/Node)
      │                         │                         │
      ▼                         ▼                         ▼
Consumido pelo          Consumido pelo            Backend de Sincronização
Frontend & Electron     Frontend & Servidor       para Self-Hosting
```

---

## 2. Inventário e Auditoria dos Sub-pacotes

### 2.1. `packages/plugin-api` (SDK Oficial de Plugins)

- **Propósito**: Conjunto de interfaces TypeScript e classes utilitárias que os desenvolvedores utilizam para criar extensões para o Super Productivity.
- **Capacidades Expostas pela API**:
  - `tasks`: Criar, listar, atualizar e concluir tarefas programaticamente.
  - `ui`: Adicionar botões no cabeçalho (_Header Buttons_), itens na barra lateral e renderizar componentes customizados.
  - `notifications`: Emitir alertas visuais e sonoros na interface.
  - `storage`: Acesso a armazenamento persistente isolado (_Scoped Key-Value Storage_) para configurações do plugin.
  - `issueProviders`: Registrar novos provedores de issues de terceiros.
- **Distribuição**: Compilado em formato ESModules com declarações de tipo `.d.ts` e consumido como dependência interna.

---

### 2.2. `packages/shared-schema` (Validação Ultrarrápida com Typia)

- **Propósito**: Garantir que as estruturas de dados (operações do `op-log`, payloads de snapshots, modelos de tarefas) possuam exatamente o mesmo esquema e validação no frontend e no backend.
- **Tecnologia**: Utiliza **Typia** (`typia`), que compila validadores TypeScript diretamente em código JavaScript puro de alta performance (_AOT Validation_), sendo até 15.000% mais rápido que validadores tradicionais em runtime (como Zod ou Joi).

---

### 2.3. `packages/super-sync-server` (Backend Dedicado de Sincronização)

- **Propósito**: Servidor backend autônomo para usuários que desejam hospedar sua própria nuvem de sincronização (_Self-Hosted SuperSync_).
- **Stack Tecnológica**: Node.js, Fastify/Express, PostgreSQL, JWT para autenticação.
- **Principais Endpoints & Recursos**:
  - `POST /api/auth/register` e `POST /api/auth/login`: Autenticação segura com hashing Argon2/Bcrypt.
  - `POST /api/sync/operations`: Recebimento de lotes de operações do `op-log` com validação de relógio vetorial.
  - `GET /api/sync/operations`: Consulta de deltas com base na última versão do cliente.
  - `WebSocket /api/sync/ws`: Notificações push em tempo real para sincronização instantânea entre múltiplos computadores e celulares conectados.
- **Implantação**: Pode ser iniciado com um comando via [`docker-compose.supersync.yaml`](file:///c:/Projects/super-productivity/docker-compose.supersync.yaml).

---

### 2.4. `packages/vite-plugin` & `packages/plugin-dev` (Ambiente de Desenvolvimento de Plugins)

- **Propósito**: Ferramentas de compilação baseadas em Vite para desenvolvedores de plugins.
- **Destaques**:
  - Fornece Hot Module Reloading (HMR) para desenvolvedores testarem alterações em seus plugins instantaneamente dentro do Super Productivity em execução local.

---

## 3. Gerenciamento e Execução de Plugins no Frontend (`src/app/plugins/`)

- **Instalação Dinâmica**: Usuários podem instalar plugins colando uma URL de script ou selecionando um arquivo local `.js`.
- **Catálogo da Comunidade (`src/assets/community-plugins.json`)**:
  - Arquivo JSON versionado no repositório que lista plugins validados pela comunidade (ex: integrações com Toggl, Obsidian, Habitica).
- **Modelo de Execução e Segurança**:
  - Na versão Web: Plugins rodam dentro de um Web Worker / Sandbox JS com permissões limitadas.
  - Na versão Desktop (Electron): Chamadas que exigem acesso ao sistema de arquivos ou rede local são delegadas para o executor Node seguro [`electron/plugin-node-executor.ts`](file:///c:/Projects/super-productivity/electron/plugin-node-executor.ts).

---

## 4. Diretrizes de Manutenção do Ecossistema de Plugins

1. **Compatibilidade Semântica de API**: Ao modificar métodos em `packages/plugin-api`, nunca remover parâmetros ou alterar assinaturas de métodos existentes sem um ciclo formal de depreciação.
2. **Isolamento de Falhas**: O carregador de plugins em `src/app/plugins/` envolve todas as chamadas de extensões em blocos `try/catch` protegidos para garantir que um erro em um plugin de terceiro nunca trave o fluxo de trabalho do usuário.
