# 08. Infraestrutura, Build, Deploy, Testes e CI/CD

> **Módulos**: `Dockerfile*`, `docker-compose*.yaml`, `nginx/`, `.github/workflows/`, `e2e/`, `tools/`, `package.json`  
> **Camada**: Esteira de Build, Conteinerização, Automações de CI/CD, Testes Automatizados e Governança

---

## 1. Visão Geral da Infraestrutura de Build

O repositório possui uma infraestrutura completa para gerar artefatos para web, containers Docker, instaladores desktop e pacotes mobile a partir de scripts orquestrados no [`package.json`](file:///c:/Projects/kairontask/package.json).

```
                             npm run build / dist
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
   Build Web / PWA               Build Desktop                 Build Mobile
- npm run env                 - buildFrontend:prod:es6       - buildFrontend:prodWeb
- node tools/git-version.js   - electron:build               - cap sync android/ios
- ng build --prod             - electron-builder             - gradle / fastlane
- Saída: dist/browser/        - Saída: .tmp/app-builds/      - Saída: APK / IPA
```

---

## 2. Conteinerização e Servidor Web (`Dockerfile` e `Nginx`)

### 2.1. Dockerfile Multi-Stage (`Dockerfile`)

- **Stage 1 (`builder`)**: Base `node:22-alpine` instala dependências, compila sub-pacotes em `packages/` e gera o build de produção do Angular com flags de otimização estrita.
- **Stage 2 (`production`)**: Base `nginx:1.27-alpine` recebe apenas os artefatos compilados de `dist/browser/`, o template de configuração do Nginx e o script de inicialização.

### 2.2. Script de Entrada Dinâmico (`docker-entrypoint.sh`)

- Executado no momento em que o container é iniciado (_container startup_).
- Injeta dinamicamente as variáveis de ambiente em [`nginx/default.conf.template`](file:///c:/Projects/kairontask/nginx/default.conf.template) (porta do app `${APP_PORT}` e backend WebDAV `${WEBDAV_BACKEND}`).
- Gera automaticamente o arquivo `src/assets/sync-config-default-override.json` a partir das variáveis `WEBDAV_BASE_URL`, `WEBDAV_USERNAME`, `SYNC_INTERVAL`, etc. Isso permite que instâncias corporativas ou de usuário único já inicializem com as configurações de sincronização pré-definidas sem necessidade de configuração manual na interface.

### 2.3. As 4 Orquestrações Docker Compose

| Compose File                                                                                    | Propósito              | Serviços Declarados                                                                              |
| :---------------------------------------------------------------------------------------------- | :--------------------- | :----------------------------------------------------------------------------------------------- |
| [`docker-compose.yaml`](file:///c:/Projects/kairontask/docker-compose.yaml)                     | Stack completo padrão  | `app` (Web Nginx), `webdav` (servidor WebDAV local), `db` (Postgres), `supersync` (Node.js API). |
| [`docker-compose.supersync.yaml`](file:///c:/Projects/kairontask/docker-compose.supersync.yaml) | Overlay para SuperSync | Sobe o servidor SuperSync dedicado conectado ao PostgreSQL.                                      |
| [`docker-compose.e2e.yaml`](file:///c:/Projects/kairontask/docker-compose.e2e.yaml)             | Ambiente de testes E2E | Servidor web otimizado apontando para as portas de teste do Playwright.                          |
| [`docker-compose.e2e.fast.yaml`](file:///c:/Projects/kairontask/docker-compose.e2e.fast.yaml)   | E2E acelerado          | Variante com builds em memória temporária para aceleração de pipelines de CI.                    |

---

## 3. Estratégia de Testes Automatizados

### 3.1. Testes Unitários com Karma e Jasmine

- **Execução**: `npm test` ou `npm run test:file <caminho_do_arquivo>`.
- **Arquivos**: Co-localizados com o código-fonte (`*.spec.ts`).
- **Bateria Multi-Fuso Horário (`npm run test:tz:all`)**:
  - Como o KaironTask executa cálculos críticos de agendamento de tarefas e viradas de dia, a suíte de testes executa baterias automáticas em 5 fusos horários distintos:
    - `TZ='Europe/Berlin'`
    - `TZ='America/Los_Angeles'`
    - `TZ='Asia/Tokyo'`
    - `TZ='Australia/Sydney'`
    - `TZ='UTC'`
  - Isso garante que bugs de fuso horário e horário de verão sejam identificados antes de qualquer release.

### 3.2. Testes de Ponta a Ponta com Playwright (`e2e/`)

- **Configuração**: [`e2e/playwright.config.ts`](file:///c:/Projects/kairontask/e2e/playwright.config.ts).
- **Comandos Principais**:
  - `npm run e2e`: Executa toda a suíte de testes E2E de interface.
  - `npm run e2e:file <filepath> -- --retries=0`: Executa um teste específico com feedback imediato.
  - `npm run e2e:supersync`: Sobe o container Docker temporário do servidor SuperSync, valida a sincronização em tempo real e desliga o container ao final.

---

## 4. Governança de CI/CD (GitHub Actions)

A suíte de automações no GitHub Actions foi enxugada e desativada de execuções automáticas não solicitadas (sem autodeploy e sem agendamentos noturnos via cron), mantendo o repositório sob controle 100% manual e silencioso:

| Workflow                     | Gatilho                      | Responsabilidade                                                                                                  |
| :--------------------------- | :--------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **`ci.yml`**                 | Pull Requests ou Manual      | Validação de ESLint, integridade de i18n, compilação e suíte de testes. Sem `paths-ignore` (o wiki foi removido). |
| **`manual-build.yml`**       | Manual (`workflow_dispatch`) | Compilação sob demanda de instaladores Windows (`.exe`) e macOS (`.dmg`) com upload de artefatos.                 |
| **`supersync-docker.yml`**   | Manual (`workflow_dispatch`) | Compilação e push sob demanda da imagem Docker do SuperSync Server.                                               |
| **`test-mac-dmg-build.yml`** | Manual (`workflow_dispatch`) | Teste sob demanda de compilação do instalador DMG para macOS.                                                     |

> **Nota de Saneamento**: Todos os cron jobs noturnos (`e2e-scheduled.yml`, `stale.yml`, `stale-discussions.yml`), auto-replies de bots, atualizações automáticas do Dependabot (`dependabot.yml`) e autodeploys externos para lojas/servidores foram completamente removidos para evitar consumo de cota e deploys não autorizados.

> **Saneamento de Documentação & CI/CD (2026-11-10)**:

- O job de Lighthouse no `ci.yml` teve suas configurações em `tools/lighthouse/` restauradas com orçamentos de performance alinhados.
- O workflow de validação macOS (`test-mac-dmg-build.yml`) foi corrigido para buscar artefatos `KaironTask-*.dmg` e verificar `KaironTask.app`.
- Os scripts de instalação local no `package.json` (`localInstall*`) foram atualizados para os nomes oficiais do KaironTask (`kairontask*.deb`, `KaironTask.app`, `kairontask*.snap`).
- O gerador `tools/generate-all-kairon-icons.js` foi estendido para produzir automaticamente todos os 60+ azulejos do Windows Store AppX (`build/appx/`) e os ícones da bandeja do sistema (`electron/assets/icons/indicator/`).

---

## 5. Governança e Qualidade de Código

### 5.1. Padronização e Linters

- **ESLint**: Configurado via Flat Config moderno (`eslint.config.js`) + regras customizadas em `eslint-local-rules/` para impedir o uso de `console.log` direto ou logs que exponham dados de tarefas.
- **Stylelint**: Configurado em `.stylelintrc.mjs` para garantir coerência no SCSS.
- **Prettier**: Configurado em `.prettierrc.json` para formatação automática de código.

### 5.2. O Utilitário Essencial `npm run checkFile`

- **Comando**: `npm run checkFile <caminho_do_arquivo>` (executa [`tools/check-file.js`](file:///c:/Projects/kairontask/tools/check-file.js)).
- **Diretriz Obrigatória**: Sempre que modificar um arquivo `.ts` ou `.scss`, rode este comando para validar formatação e linting instantaneamente antes de commitar.

### 5.3. Gates do Husky (`.husky/`)

- `pre-commit`: Executa `pretty-quick --staged && npm run lint` impedindo commits fora do padrão.
- `pre-push`: Executa `npm run lint && npm run test` impedindo envio de código quebrado para o repositório remoto.

### 5.4. Padrão de Mensagens de Commit

- Segue o formato Angular Conventional Commits: `type(scope): description`.
- **Regra**: Nunca usar `fix(test):`; alterações em testes devem sempre usar o tipo `test:` (ex: `test(e2e): fix flaky sync test`).
