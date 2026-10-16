# Auditoria 09 — Varredura Completa de Vestígios Open-Source e Rebranding

> **Objetivo**: Mapeamento exaustivo de todas as referências ao projeto original upstream (`Super Productivity`), ao autor original (`Johannes Millan` / `johannesjo`), URLs externas, identificadores de lojas, doações e e-mails de suporte.  
> **Finalidade**: Servir como guia definitivo para _White-labeling_, _Rebranding_ e desvinculação completa do repositório original.

---

## 1. Sumário dos Vestígios Encontrados

A varredura identificou **7 categorias de vestígios** espalhadas pela base de código:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                    CATEGORIAS DE VESTÍGIOS OPEN-SOURCE                         │
├──────────────────────────┬──────────────────────────┬──────────────────────────┤
│ 1. Autoria & Licença     │ 2. Identidade Visual     │ 3. Identificadores de App│
│ - Johannes Millan        │ - Nome "Super Product."  │ - com.super-productivity │
│ - johannesjo             │ - SVG Logo no Splash     │ - Imagens Docker         │
├──────────────────────────┼──────────────────────────┼──────────────────────────┤
│ 4. Doações & Patrocínio  │ 5. Reporte & Suporte     │ 6. Endpoints & Nuvem     │
│ - GitHub Sponsors        │ - contact@super-prod...  │ - sync.super-product...  │
│ - Página /donate         │ - Issues no GitHub       │ - app.super-product...   │
└──────────────────────────┴──────────────────────────┴──────────────────────────┘
```

---

## 2. Inventário Detalhado por Categoria

### 2.1. Categoria 1: Autoria e Metadados do Autor (`Johannes Millan` / `johannesjo`)

| Arquivo                                                                                               | Linha(s) | Conteúdo / Vestígio Encontrado                                                          | O que alterar                                                                                                                 |
| :---------------------------------------------------------------------------------------------------- | :------- | :-------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| [`package.json`](file:///c:/Projects/kairontask/package.json)                                         | 18, 303  | `"author": "Johannes Millan <contact@super-productivity.com>"`, `"owner": "johannesjo"` | Substituir pelo seu nome/empresa e usuário GitHub.                                                                            |
| [`packages/plugin-api/package.json`](file:///c:/Projects/kairontask/packages/plugin-api/package.json) | 23       | `"author": "Johannes Millan"`                                                           | Atualizar autor do pacote.                                                                                                    |
| [`LICENSE`](file:///c:/Projects/kairontask/LICENSE)                                                   | 3        | `Copyright (c) 2018 Johannes Millan`                                                    | **Atenção Legal**: Manter o aviso de copyright MIT original de 2018 e adicionar `Copyright (c) 2026 Seu Nome/Empresa` abaixo. |
| [`android/LICENSE`](file:///c:/Projects/kairontask/android/LICENSE)                                   | 3        | `Copyright (c) 2020 Johannes Millan`                                                    | Mesma regra de coexistência da licença MIT.                                                                                   |
| [`build/linux/PKGBUILD_template`](file:///c:/Projects/kairontask/build/linux/PKGBUILD_template)       | 1        | `# Maintainer & Owner: johannesjo <contact@super-productivity.com>`                     | Atualizar mantenedor do pacote Linux.                                                                                         |
| [`electron-builder.yaml`](file:///c:/Projects/kairontask/electron-builder.yaml)                       | 43, 45   | `publisherDisplayName: johannesjo`, `identityName: ___johannesjo.SuperProductivity`     | Atualizar nome do publicador no Windows Store.                                                                                |

---

### 2.2. Categoria 2: Nome do Produto e Identidade Visual

| Arquivo                                                                                       | Linha(s)      | Conteúdo / Vestígio Encontrado                                                        | O que alterar                                                   |
| :-------------------------------------------------------------------------------------------- | :------------ | :------------------------------------------------------------------------------------ | :-------------------------------------------------------------- |
| [`src/index.html`](file:///c:/Projects/kairontask/src/index.html)                             | 5             | `<title>Super Productivity</title>`                                                   | Substituir pelo novo nome da sua aplicação.                     |
| [`src/index.html`](file:///c:/Projects/kairontask/src/index.html)                             | 222-241       | `<svg class="logo">...<path d="M 0.65537046,34.582787..."/></svg>`                    | Substituir o `path d="..."` do SVG pelo logotipo da sua marca.  |
| [`src/index.html`](file:///c:/Projects/kairontask/src/index.html)                             | 270           | `'Super Productivity requires a newer browser version to run.'`                       | Trocar o nome na mensagem de navegador incompatível.            |
| [`src/manifest.json`](file:///c:/Projects/kairontask/src/manifest.json)                       | 2-3           | `"name": "Super Productivity"`, `"short_name": "sup"`                                 | Atualizar nome e sigla da PWA.                                  |
| [`src/assets/icons/`](file:///c:/Projects/kairontask/src/assets/icons/)                       | Todos         | `sp.svg`, `sp-white.svg`, `favicon.ico`, `apple-touch-icon.png`, ícones de 72 a 512px | Substituir todos os arquivos de ícone pelas artes da sua marca. |
| [`build/`](file:///c:/Projects/kairontask/build/)                                             | Todos         | `icon.ico`, `icon.png`, `icon.icns`, `512x512.png`                                    | Substituir os ícones de compilação dos instaladores desktop.    |
| [`android/app/src/main/res/`](file:///c:/Projects/kairontask/android/app/src/main/res/)       | Pastas mipmap | Ícones adaptativos do Android (`ic_launcher.png`, `ic_launcher_round.png`).           | Gerar novos ícones via Android Studio.                          |
| [`ios/App/App/Assets.xcassets/`](file:///c:/Projects/kairontask/ios/App/App/Assets.xcassets/) | AppIcon       | Ícones do aplicativo iOS.                                                             | Substituir no Xcode Asset Catalog.                              |

---

### 2.3. Categoria 3: Identificadores de Pacote, Bundles e Lojas (App IDs)

| Arquivo                                                                                                         | Linha(s) | Conteúdo / Vestígio Encontrado                                                      | O que alterar                                                                    |
| :-------------------------------------------------------------------------------------------------------------- | :------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| [`electron-builder.yaml`](file:///c:/Projects/kairontask/electron-builder.yaml)                                 | 2, 4     | `appId: com.super-productivity.app`, `productName: Super Productivity`              | Definir seu `appId` único (ex: `br.com.suaempresa.app`).                         |
| [`capacitor.config.ts`](file:///c:/Projects/kairontask/capacitor.config.ts)                                     | 4-5      | `appId: 'com.superproductivity.superproductivity'`, `appName: 'Super Productivity'` | Atualizar para o seu ID mobile.                                                  |
| [`android/app/build.gradle`](file:///c:/Projects/kairontask/android/app/build.gradle)                           | 40       | `applicationId "com.superproductivity.superproductivity"`                           | Atualizar o Package Name Android.                                                |
| [`ios/App/App.xcodeproj/project.pbxproj`](file:///c:/Projects/kairontask/ios/App/App.xcodeproj/project.pbxproj) | Várias   | `PRODUCT_BUNDLE_IDENTIFIER = com.super-productivity.app;`                           | Atualizar o Bundle ID iOS.                                                       |
| [`docker-compose.yaml`](file:///c:/Projects/kairontask/docker-compose.yaml)                                     | 64       | `image: johannesjo/super-productivity:latest`                                       | Apontar para a imagem do seu Docker registry (ex: `seu-usuario/sua-app:latest`). |

---

### 2.4. Categoria 4: Links de Doação, Patrocínio e Comunidade

| Arquivo                                                                                                                                                   | Linha(s)       | Conteúdo / Vestígio Encontrado                                                                | O que alterar                                                                     |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [`src/app/pages/donate-page/donate-page.component.html`](file:///c:/Projects/kairontask/src/app/pages/donate-page/donate-page.component.html)             | 11             | `href="https://github.com/sponsors/johannesjo"`                                               | Remover o botão ou redirecionar para sua página de doação / assinatura.           |
| [`src/app/core-ui/magic-side-nav/magic-nav-config.service.ts`](file:///c:/Projects/kairontask/src/app/core-ui/magic-side-nav/magic-nav-config.service.ts) | 255-300        | Links de menu: `/donate`, `help-reddit` (`reddit.com/r/superProductivity`), `help-contribute` | Remover ou redirecionar para suas centrais de ajuda.                              |
| [`src/app/features/config/default-global-config.const.ts`](file:///c:/Projects/kairontask/src/app/features/config/default-global-config.const.ts)         | 27             | `isDonatePageEnabled: true`                                                                   | Alterar para `false` por padrão caso não queira a rota `/donate` visível no menu. |
| [`README.md`](file:///c:/Projects/kairontask/README.md)                                                                                                   | 28-36, 187-205 | Links para Reddit, Mastodon, Twitter, Sponsors e TestMu AI                                    | Reescrever o README com a documentação da sua empresa.                            |

---

### 2.5. Categoria 5: E-mails de Suporte e Abertura Automática de Issues

| Arquivo                                                                                                                                             | Linha(s)               | Conteúdo / Vestígio Encontrado                                                                                                    | O que alterar                                                                                                                                    |
| :-------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| [`src/app/core/error-handler/global-error-handler.util.ts`](file:///c:/Projects/kairontask/src/app/core/error-handler/global-error-handler.util.ts) | 249-250                | `user: 'johannesjo'`, `repo: 'super-productivity'`                                                                                | Apontar para o repositório do seu fork ou abrir formulário interno de suporte.                                                                   |
| [`src/app/core/error-handler/global-error-handler.util.ts`](file:///c:/Projects/kairontask/src/app/core/error-handler/global-error-handler.util.ts) | 171                    | `contact@super-productivity.com`                                                                                                  | Alterar para `suporte@suaempresa.com.br`.                                                                                                        |
| Arquivos de tradução em [`src/assets/i18n/*.json`](file:///c:/Projects/kairontask/src/assets/i18n/) (27 arquivos)                                   | Chave `PRIVACY_EXPORT` | Menção explícita a `contact@super-productivity.com`                                                                               | Atualizar no [`src/assets/i18n/en.json`](file:///c:/Projects/kairontask/src/assets/i18n/en.json) (chave `PRIVACY_EXPORT`) e rodar `npm run int`. |
| [`src/app/pages/config-page/config-page.component.html`](file:///c:/Projects/kairontask/src/app/pages/config-page/config-page.component.html)       | 232, 244, 250          | Links no rodapé da página de configurações apontando para `github.com/super-productivity/...` e `super-productivity.com/privacy/` | Apontar para sua política de privacidade e seu changelog.                                                                                        |

---

### 2.6. Categoria 6: URLs e Endpoints Padrão da Nuvem Upstream

| Arquivo                                                                                                                                                       | Linha(s) | Conteúdo / Vestígio Encontrado                                        | O que alterar                                                                             |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- | :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| [`src/app/op-log/sync-providers/super-sync/super-sync.model.ts`](file:///c:/Projects/kairontask/src/app/op-log/sync-providers/super-sync/super-sync.model.ts) | 3        | `SUPER_SYNC_DEFAULT_BASE_URL = 'https://sync.super-productivity.com'` | Apontar para o seu servidor SuperSync de produção (ex: `https://sync.suaempresa.com.br`). |
| [`src/app/plugins/oauth/plugin-oauth.service.ts`](file:///c:/Projects/kairontask/src/app/plugins/oauth/plugin-oauth.service.ts)                               | 53       | `'com.super-productivity.app:/plugin-oauth-callback'`                 | Atualizar esquema de deep link OAuth.                                                     |
| [`src/app/imex/sync/oauth-callback-handler.service.ts`](file:///c:/Projects/kairontask/src/app/imex/sync/oauth-callback-handler.service.ts)                   | 45       | `'com.super-productivity.app://oauth-callback'`                       | Atualizar esquema de deep link de sincronização.                                          |

---

### 2.7. Categoria 7: Documentos Institucionais Upstream

| Arquivo                                                                                                                                               | Conteúdo Atual                                 | O que fazer                                           |
| :---------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- | :---------------------------------------------------- |
| [`.github/CODEOWNERS`](file:///c:/Projects/kairontask/.github/CODEOWNERS)                                                                             | `@johannesjo`                                  | Substituir pelo seu usuário/equipe GitHub.            |
| [`.github/SECURITY-SETUP.md`](file:///c:/Projects/kairontask/.github/SECURITY-SETUP.md) & [`SECURITY.md`](file:///c:/Projects/kairontask/SECURITY.md) | Contatos de segurança do projeto original      | Atualizar canal responsável por vulnerabilidades.     |
| [`CONTRIBUTING.md`](file:///c:/Projects/kairontask/CONTRIBUTING.md)                                                                                   | Diretrizes e links para o repositório original | Adaptar para as regras do seu time.                   |
| [`docs/`](file:///c:/Projects/kairontask/docs/)                                                                                                       | Documentação da Wiki upstream                  | Manter como referência técnica interna ou reescrever. |

---

## 3. Status de Execução do Plano de Rebranding e Desvinculação

Todas as etapas do plano de ação foram **100% executadas e consolidadas**:

1. [x] **Passo 1 — Identidade e Nomes de Pacote (Concluído)**:
   - `package.json` atualizado (`name: kairontask`, autor `Christian Sousa <support@kairontask.app>`, `https://kairontask.app`).
   - `electron-builder.yaml`, `build/electron-builder.mas.yaml` e `build/electron-builder.mas-dev.yaml` atualizados para `com.kairontask.app` e `KaironTask`.
   - `capacitor.config.ts`, `android/app/build.gradle` e `ios/App/App.xcodeproj` apontando para `com.kairontask.app` e `https://app.kairontask.app`.
   - `LICENSE` e `android/LICENSE` atribuídos a `Copyright (c) 2026 Christian Sousa`.
2. [x] **Passo 2 — UI, Nova Identidade Visual & Novo Logo (Concluído)**:
   - Novo logotipo vetorial oficial KaironTask criado em `src/assets/icons/sp.svg` e `src/assets/icons/sp-white.svg` (emblema geométrico com gradiente Cyan/Indigo/Violeta e núcleo temporal Kairos).
   - Splash screen em `src/index.html` atualizado com o novo logotipo e iluminação ambiente.
   - Cabeçalho de marca `nav-brand-header` adicionado à barra lateral (`magic-side-nav`), perfeitamente adaptado aos modos expandido e compacto.
   - Paleta de cores padrão modernizada para a identidade oficial KaironTask (Primary `#6366f1`, Accent `#06b6d4`, Warn `#ef4444`).
3. [x] **Passo 3 — Suporte, Links e Menus (Concluído)**:
   - Rota e botão `/donate` redirecionados para `https://kairontask.app`.
   - `getGithubErrorUrl` apontando para `github.com/christiansousadev/kairontask`.
   - E-mail `support@kairontask.app` e chave `PRIVACY_EXPORT` propagados para todos os 27 arquivos de idioma em `src/assets/i18n/`.
   - `.github/CODEOWNERS`, `SECURITY.md` e `CONTRIBUTING.md` transferidos para `@christiansousadev`.
4. [x] **Passo 4 — Endpoints de Sync e Infraestrutura (Concluído)**:
   - `SUPER_SYNC_DEFAULT_BASE_URL` em `super-sync.model.ts` e `default-global-config.const.ts` atualizados para `https://sync.kairontask.app`.
   - `docker-compose.yaml` atualizado para build local e imagem `kairontask:latest`.
   - `nginx/default.conf.template` e sub-pacotes em `packages/` atualizados para KaironTask.
5. [x] **Passo 5 — Validação e Testes (Concluído)**:
   - Validação de integridade de tradução `npm run int:test` aprovada com 100% de sucesso.
   - Verificação de formatação e linting via `npm run checkFile` aprovada.
