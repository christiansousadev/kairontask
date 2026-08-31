# KaironTask

<p align="center">
  <strong>
    Aplicativo avançado de gerenciamento de tarefas, timeboxing e rastreamento de tempo com arquitetura Local-First, Pomodoro, integrações (Jira, GitHub, GitLab, Linear, Azure DevOps) e privacidade absoluta.
  </strong>
</p>

<p align="center">
  <img alt="MIT License" src="https://img.shields.io/badge/License-MIT-indigo.svg?style=flat-square"/>
  &nbsp;
  <img alt="Local First" src="https://img.shields.io/badge/Architecture-Local--First-teal.svg?style=flat-square"/>
  &nbsp;
  <img alt="Angular & Electron" src="https://img.shields.io/badge/Stack-Angular_%7C_Electron_%7C_Capacitor-blue.svg?style=flat-square"/>
</p>

---

## ⚡ Principais Funcionalidades

- **Organização Inteligente**: Planeje e categorize suas tarefas usando subtarefas hierárquicas, projetos, tags coloridas e sintaxe rápida (`#tag`, `30m`, `@fri 10pm`, `+Projeto`).
- **Timeboxing & Time Tracking**: Meça o tempo gasto com precisão segundo a segundo, gere relatórios e exporte folhas de ponto.
- **Hábitos e Foco Produtivo**:
  - **Temporizador Pomodoro** e lembretes de descanso para pausas regulares.
  - **Modo Foco** em tela cheia sem distrações com cronômetro grande.
  - **Painel de Fim de Dia** para reflexão diária e planejamento do amanhã.
  - **Detecção de Ociosidade (_Idle Time_)** para descartar tempo em que esteve longe da máquina.
- **Integrações de Issue Trackers**:
  - Sincronização nativa com **Jira**, **GitHub**, **GitLab**, **Linear**, **Azure DevOps**, **Trello**, **Gitea**, **OpenProject**, **Redmine** e calendários **CalDAV**.
  - Importação de tarefas atribuídas, apontamento de horas (_worklogs_) e transição de status.
- **Sincronização Distribuída com Op-Log**:
  - Arquitetura determinística com **Relógios Vetoriais (Vector Clocks)**.
  - Suporte a **WebDAV** (Nextcloud, ownCloud), **Dropbox**, **SuperSync** e pasta local.
  - Criptografia autenticada Ponta a Ponta (**E2EE**) com AES-GCM.
- **Privacidade Soberana**:
  - **Zero telemetria**, sem contas obrigatórias, sem rastreadores. Seus dados residem 100% no seu dispositivo.

---

## 🚀 Como Executar em Desenvolvimento

### Pré-requisitos

- Node.js (versão 20+ ou 22 LTS)
- npm

### 1. Instalar dependências

```bash
npm i -g @angular/cli
npm i
```

### 2. Configurar variáveis de ambiente

```bash
npm run env
```

### 3. Rodar na Web

```bash
npm run serve
# ou: ng serve
```

Acesse `http://localhost:4200` no seu navegador.

### 4. Rodar no Desktop (Electron)

```bash
npm start
```

---

## 📦 Empacotamento e Build para Produção

| Plataforma                      | Comando                         | Saída Gerada                         |
| :------------------------------ | :------------------------------ | :----------------------------------- |
| **Web / PWA**                   | `npm run buildFrontend:prodWeb` | `dist/browser/`                      |
| **Desktop (Windows/Linux/Mac)** | `npm run dist`                  | `.tmp/app-builds/`                   |
| **Android (APK Debug/Release)** | `npm run dist:android`          | `android/app/build/outputs/apk/`     |
| **iOS**                         | `npm run dist:ios:prod`         | `ios/App/` (sincronizado para Xcode) |

---

## 🐳 Execução via Docker

```bash
docker compose up -d
```

O container servirá a versão web através do Nginx em `http://localhost`.

---

## 📚 Auditoria e Documentação Técnica

Para entender detalhadamente todos os módulos, arquitetura e governança do projeto, consulte a pasta [`auditorias/`](auditorias/):

- [`auditorias/01_arquitetura_e_core.md`](auditorias/01_arquitetura_e_core.md): Core, Root Store, Meta-Reducers e LOCAL_ACTIONS.
- [`auditorias/02_persistencia_sync_oplog.md`](auditorias/02_persistencia_sync_oplog.md): Op-Log, Vector Clocks, IndexedDB e Sync.
- [`auditorias/03_modulos_e_features.md`](auditorias/03_modulos_e_features.md): Todas as 41 features de domínio e integrações.
- [`auditorias/04_desktop_electron.md`](auditorias/04_desktop_electron.md): Main process, IPC e subsistemas desktop.
- [`auditorias/05_mobile_capacitor.md`](auditorias/05_mobile_capacitor.md): Configuração mobile Android e iOS.
- [`auditorias/06_packages_e_plugins.md`](auditorias/06_packages_e_plugins.md): Extensibilidade e sub-pacotes.
- [`auditorias/07_ui_design_system_i18n.md`](auditorias/07_ui_design_system_i18n.md): Design system, temas e traduções.
- [`auditorias/08_infra_build_cicd_testes.md`](auditorias/08_infra_build_cicd_testes.md): Infraestrutura, testes e CI/CD.
- [`auditorias/09_varredura_vestigios_opensource.md`](auditorias/09_varredura_vestigios_opensource.md): Mapeamento de vestígios e guia de substituição.

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).
