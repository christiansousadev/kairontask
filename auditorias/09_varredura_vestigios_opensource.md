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

| Arquivo                                                                                                       | Linha(s) | Conteúdo / Vestígio Encontrado                                                          | O que alterar                                                                                                                 |
| :------------------------------------------------------------------------------------------------------------ | :------- | :-------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| [`package.json`](file:///c:/Projects/super-productivity/package.json)                                         | 18, 303  | `"author": "Johannes Millan <contact@super-productivity.com>"`, `"owner": "johannesjo"` | Substituir pelo seu nome/empresa e usuário GitHub.                                                                            |
| [`packages/plugin-api/package.json`](file:///c:/Projects/super-productivity/packages/plugin-api/package.json) | 23       | `"author": "Johannes Millan"`                                                           | Atualizar autor do pacote.                                                                                                    |
| [`LICENSE`](file:///c:/Projects/super-productivity/LICENSE)                                                   | 3        | `Copyright (c) 2018 Johannes Millan`                                                    | **Atenção Legal**: Manter o aviso de copyright MIT original de 2018 e adicionar `Copyright (c) 2026 Seu Nome/Empresa` abaixo. |
| [`android/LICENSE`](file:///c:/Projects/super-productivity/android/LICENSE)                                   | 3        | `Copyright (c) 2020 Johannes Millan`                                                    | Mesma regra de coexistência da licença MIT.                                                                                   |
| [`build/linux/PKGBUILD_template`](file:///c:/Projects/super-productivity/build/linux/PKGBUILD_template)       | 1        | `# Maintainer & Owner: johannesjo <contact@super-productivity.com>`                     | Atualizar mantenedor do pacote Linux.                                                                                         |
| [`electron-builder.yaml`](file:///c:/Projects/super-productivity/electron-builder.yaml)                       | 43, 45   | `publisherDisplayName: johannesjo`, `identityName: ___johannesjo.SuperProductivity`     | Atualizar nome do publicador no Windows Store.                                                                                |

---

### 2.2. Categoria 2: Nome do Produto e Identidade Visual

| Arquivo                                                                                               | Linha(s)      | Conteúdo / Vestígio Encontrado                                                        | O que alterar                                                   |
| :---------------------------------------------------------------------------------------------------- | :------------ | :------------------------------------------------------------------------------------ | :-------------------------------------------------------------- |
| [`src/index.html`](file:///c:/Projects/super-productivity/src/index.html)                             | 5             | `<title>Super Productivity</title>`                                                   | Substituir pelo novo nome da sua aplicação.                     |
| [`src/index.html`](file:///c:/Projects/super-productivity/src/index.html)                             | 222-241       | `<svg class="logo">...<path d="M 0.65537046,34.582787..."/></svg>`                    | Substituir o `path d="..."` do SVG pelo logotipo da sua marca.  |
| [`src/index.html`](file:///c:/Projects/super-productivity/src/index.html)                             | 270           | `'Super Productivity requires a newer browser version to run.'`                       | Trocar o nome na mensagem de navegador incompatível.            |
| [`src/manifest.json`](file:///c:/Projects/super-productivity/src/manifest.json)                       | 2-3           | `"name": "Super Productivity"`, `"short_name": "sup"`                                 | Atualizar nome e sigla da PWA.                                  |
| [`src/assets/icons/`](file:///c:/Projects/super-productivity/src/assets/icons/)                       | Todos         | `sp.svg`, `sp-white.svg`, `favicon.ico`, `apple-touch-icon.png`, ícones de 72 a 512px | Substituir todos os arquivos de ícone pelas artes da sua marca. |
| [`build/`](file:///c:/Projects/super-productivity/build/)                                             | Todos         | `icon.ico`, `icon.png`, `icon.icns`, `512x512.png`                                    | Substituir os ícones de compilação dos instaladores desktop.    |
| [`android/app/src/main/res/`](file:///c:/Projects/super-productivity/android/app/src/main/res/)       | Pastas mipmap | Ícones adaptativos do Android (`ic_launcher.png`, `ic_launcher_round.png`).           | Gerar novos ícones via Android Studio.                          |
| [`ios/App/App/Assets.xcassets/`](file:///c:/Projects/super-productivity/ios/App/App/Assets.xcassets/) | AppIcon       | Ícones do aplicativo iOS.                                                             | Substituir no Xcode Asset Catalog.                              |

---

### 2.3. Categoria 3: Identificadores de Pacote, Bundles e Lojas (App IDs)

| Arquivo                                                                                                                 | Linha(s) | Conteúdo / Vestígio Encontrado                                                      | O que alterar                                                                    |
| :---------------------------------------------------------------------------------------------------------------------- | :------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| [`electron-builder.yaml`](file:///c:/Projects/super-productivity/electron-builder.yaml)                                 | 2, 4     | `appId: com.super-productivity.app`, `productName: Super Productivity`              | Definir seu `appId` único (ex: `br.com.suaempresa.app`).                         |
| [`capacitor.config.ts`](file:///c:/Projects/super-productivity/capacitor.config.ts)                                     | 4-5      | `appId: 'com.superproductivity.superproductivity'`, `appName: 'Super Productivity'` | Atualizar para o seu ID mobile.                                                  |
| [`android/app/build.gradle`](file:///c:/Projects/super-productivity/android/app/build.gradle)                           | 40       | `applicationId "com.superproductivity.superproductivity"`                           | Atualizar o Package Name Android.                                                |
| [`ios/App/App.xcodeproj/project.pbxproj`](file:///c:/Projects/super-productivity/ios/App/App.xcodeproj/project.pbxproj) | Várias   | `PRODUCT_BUNDLE_IDENTIFIER = com.super-productivity.app;`                           | Atualizar o Bundle ID iOS.                                                       |
| [`docker-compose.yaml`](file:///c:/Projects/super-productivity/docker-compose.yaml)                                     | 64       | `image: johannesjo/super-productivity:latest`                                       | Apontar para a imagem do seu Docker registry (ex: `seu-usuario/sua-app:latest`). |

---

### 2.4. Categoria 4: Links de Doação, Patrocínio e Comunidade

| Arquivo                                                                                                                                                           | Linha(s)       | Conteúdo / Vestígio Encontrado                                                                | O que alterar                                                                     |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [`src/app/pages/donate-page/donate-page.component.html`](file:///c:/Projects/super-productivity/src/app/pages/donate-page/donate-page.component.html)             | 11             | `href="https://github.com/sponsors/johannesjo"`                                               | Remover o botão ou redirecionar para sua página de doação / assinatura.           |
| [`src/app/core-ui/magic-side-nav/magic-nav-config.service.ts`](file:///c:/Projects/super-productivity/src/app/core-ui/magic-side-nav/magic-nav-config.service.ts) | 255-300        | Links de menu: `/donate`, `help-reddit` (`reddit.com/r/superProductivity`), `help-contribute` | Remover ou redirecionar para suas centrais de ajuda.                              |
| [`src/app/features/config/default-global-config.const.ts`](file:///c:/Projects/super-productivity/src/app/features/config/default-global-config.const.ts)         | 27             | `isDonatePageEnabled: true`                                                                   | Alterar para `false` por padrão caso não queira a rota `/donate` visível no menu. |
| [`README.md`](file:///c:/Projects/super-productivity/README.md)                                                                                                   | 28-36, 187-205 | Links para Reddit, Mastodon, Twitter, Sponsors e TestMu AI                                    | Reescrever o README com a documentação da sua empresa.                            |

---

### 2.5. Categoria 5: E-mails de Suporte e Abertura Automática de Issues

| Arquivo                                                                                                                                                     | Linha(s)               | Conteúdo / Vestígio Encontrado                                                                                                    | O que alterar                                                                                                                                            |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`src/app/core/error-handler/global-error-handler.util.ts`](file:///c:/Projects/super-productivity/src/app/core/error-handler/global-error-handler.util.ts) | 249-250                | `user: 'johannesjo'`, `repo: 'super-productivity'`                                                                                | Apontar para o repositório do seu fork ou abrir formulário interno de suporte.                                                                           |
| [`src/app/core/error-handler/global-error-handler.util.ts`](file:///c:/Projects/super-productivity/src/app/core/error-handler/global-error-handler.util.ts) | 171                    | `contact@super-productivity.com`                                                                                                  | Alterar para `suporte@suaempresa.com.br`.                                                                                                                |
| Arquivos de tradução em [`src/assets/i18n/*.json`](file:///c:/Projects/super-productivity/src/assets/i18n/) (27 arquivos)                                   | Chave `PRIVACY_EXPORT` | Menção explícita a `contact@super-productivity.com`                                                                               | Atualizar no [`src/assets/i18n/en.json`](file:///c:/Projects/super-productivity/src/assets/i18n/en.json) (chave `PRIVACY_EXPORT`) e rodar `npm run int`. |
| [`src/app/pages/config-page/config-page.component.html`](file:///c:/Projects/super-productivity/src/app/pages/config-page/config-page.component.html)       | 232, 244, 250          | Links no rodapé da página de configurações apontando para `github.com/super-productivity/...` e `super-productivity.com/privacy/` | Apontar para sua política de privacidade e seu changelog.                                                                                                |

---

### 2.6. Categoria 6: URLs e Endpoints Padrão da Nuvem Upstream

| Arquivo                                                                                                                                                               | Linha(s) | Conteúdo / Vestígio Encontrado                                        | O que alterar                                                                             |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| [`src/app/op-log/sync-providers/super-sync/super-sync.model.ts`](file:///c:/Projects/super-productivity/src/app/op-log/sync-providers/super-sync/super-sync.model.ts) | 3        | `SUPER_SYNC_DEFAULT_BASE_URL = 'https://sync.super-productivity.com'` | Apontar para o seu servidor SuperSync de produção (ex: `https://sync.suaempresa.com.br`). |
| [`src/app/plugins/oauth/plugin-oauth.service.ts`](file:///c:/Projects/super-productivity/src/app/plugins/oauth/plugin-oauth.service.ts)                               | 53       | `'com.super-productivity.app:/plugin-oauth-callback'`                 | Atualizar esquema de deep link OAuth.                                                     |
| [`src/app/imex/sync/oauth-callback-handler.service.ts`](file:///c:/Projects/super-productivity/src/app/imex/sync/oauth-callback-handler.service.ts)                   | 45       | `'com.super-productivity.app://oauth-callback'`                       | Atualizar esquema de deep link de sincronização.                                          |

---

### 2.7. Categoria 7: Documentos Institucionais Upstream

| Arquivo                                                                                                                                                               | Conteúdo Atual                                 | O que fazer                                           |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- | :---------------------------------------------------- |
| [`.github/CODEOWNERS`](file:///c:/Projects/super-productivity/.github/CODEOWNERS)                                                                                     | `@johannesjo`                                  | Substituir pelo seu usuário/equipe GitHub.            |
| [`.github/SECURITY-SETUP.md`](file:///c:/Projects/super-productivity/.github/SECURITY-SETUP.md) & [`SECURITY.md`](file:///c:/Projects/super-productivity/SECURITY.md) | Contatos de segurança do projeto original      | Atualizar canal responsável por vulnerabilidades.     |
| [`CONTRIBUTING.md`](file:///c:/Projects/super-productivity/CONTRIBUTING.md)                                                                                           | Diretrizes e links para o repositório original | Adaptar para as regras do seu time.                   |
| [`docs/`](file:///c:/Projects/super-productivity/docs/)                                                                                                               | Documentação da Wiki upstream                  | Manter como referência técnica interna ou reescrever. |

---

## 3. Plano de Ação Recomendado (Checklist Passo a Passo)

Para realizar o rebranding completo de forma limpa e sem quebras:

1. **Passo 1 — Identidade e Nomes de Pacote**:
   - Atualizar `package.json` (`name`, `author`, `homepage`, `repository.url`).
   - Atualizar `electron-builder.yaml` (`appId`, `productName`, `publisherDisplayName`).
   - Atualizar `capacitor.config.ts`, `android/app/build.gradle` e `ios/App/App.xcodeproj`.
2. **Passo 2 — UI e Assets**:
   - Substituir ícones em `src/assets/icons/`, `build/` e pastas mipmap do Android.
   - Trocar o `<title>` e o `<svg class="logo">` inline em `src/index.html`.
   - Atualizar `src/manifest.json`.
3. **Passo 3 — Suporte, Links e Menus**:
   - Desativar ou redirecionar a rota `/donate` em `src/app/pages/donate-page/`.
   - Atualizar `getGithubErrorUrl` em `src/app/core/error-handler/global-error-handler.util.ts`.
   - Atualizar a chave `PRIVACY_EXPORT` em `src/assets/i18n/en.json` e rodar `npm run int`.
   - Atualizar links do rodapé em `src/app/pages/config-page/config-page.component.html`.
4. **Passo 4 — Endpoints de Sync**:
   - Ajustar `SUPER_SYNC_DEFAULT_BASE_URL` em `src/app/op-log/sync-providers/super-sync/super-sync.model.ts` para seu servidor.
5. **Passo 5 — Validação**:
   - Rodar `npm run lint` e `npm test` para garantir integridade.
