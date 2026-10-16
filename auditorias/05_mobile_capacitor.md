# Auditoria 05 — Camada Mobile (Capacitor / Android / iOS)

> **Módulos**: `capacitor.config.ts`, `android/`, `ios/`, `fastlane/`, `src/app/features/android/`, `src/app/features/mobile/`  
> **Camada**: Wrapper Mobile Híbrido, Projetos Nativos Gradle/Xcode, Plugins de Hardware e Adaptação Tátil

---

## 1. Visão Geral da Arquitetura Mobile

O KaironTask utiliza o **Capacitor 7** para empacotar o bundle Angular de produção ([`dist/browser/`](file:///c:/Projects/kairontask/dist/browser)) em aplicações nativas de alta performance para Android e iOS.

```
                  ┌────────────────────────────────────────┐
                  │          dist/browser/ (Angular)       │
                  └───────────────────┬────────────────────┘
                                      │ npx cap sync
                  ┌───────────────────┴────────────────────┐
                  │          Capacitor Bridge 7            │
                  │        (capacitor.config.ts)           │
                  └─────────┬────────────────────┬─────────┘
                            │                    │
          ┌─────────────────▼──────┐      ┌──────▼──────────────────┐
          │     Android Native     │      │       iOS Native        │
          │     (android/app/)     │      │       (ios/App/)        │
          │  - Gradle / Java / XML │      │  - Xcode / Swift        │
          │  - F-Droid / PlayStore │      │  - Fastlane / App Store │
          └────────────────────────┘      └─────────────────────────┘
```

---

## 2. Configuração do Capacitor (`capacitor.config.ts`)

O arquivo [`capacitor.config.ts`](file:///c:/Projects/kairontask/capacitor.config.ts) define o comportamento da ponte nativa:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.superproductivity.superproductivity',
  appName: 'Super Productivity',
  webDir: 'dist/browser',
  server: {
    androidScheme: 'https', // Garante contexto seguro para Web Crypto e IndexedDB
  },
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_name',
      iconColor: '#0b77d2',
    },
    StatusBar: {
      overlaysWebView: true,
    },
  },
};
export default config;
```

### 2.1. Plugins Nativos Integrados

- `@capacitor/keyboard`: Controla a exibição do teclado virtual evitando sobreposição de campos de entrada de tarefas.
- `@capacitor/local-notifications`: Agenda alarmes e notificações locais precisas para lembretes de tarefas e pausas.
- `@capacitor/status-bar`: Ajusta cores e translucidez da barra de status do sistema.
- `@capawesome/capacitor-android-dark-mode-support`: Sincroniza o tema do app com as configurações do sistema operacional Android.
- `@capawesome/capacitor-background-task`: Permite que ciclos de sincronização do `op-log` terminem mesmo se o app for minimizado.
- `capacitor-plugin-safe-area`: Injeta os limites de entalhes (notches) e barras gestuais nos tokens de layout da UI.

---

## 3. Arquitetura e Build Android (`android/`)

### 3.1. Sabores de Build (Flavors)

O projeto Android possui dois _product flavors_ configurados no [`android/app/build.gradle`](file:///c:/Projects/kairontask/android/app/build.gradle):

1. **`playstore`**: Versão para distribuição no Google Play Store, com suporte a serviços Google Play.
2. **`fdroid`**: Versão 100% livre e de código aberto (_FOSS_), sem bibliotecas proprietárias da Google, aprovada para os repositórios do F-Droid.

### 3.2. Modos de Conectividade (Documentados em `android/README.md`)

- **Connectivity-Free Mode**: Modo de máxima privacidade onde a aplicação é compilada sem código de rede externa, operando puramente offline.
- **Compatibility / Online Mode**: Modo padrão com sincronização ativa via WebDAV, Dropbox e SuperSync.

### 3.3. Permissões no `AndroidManifest.xml`

- `android.permission.INTERNET`: Sincronização e integração com Jira/GitHub.
- `android.permission.POST_NOTIFICATIONS`: Notificações no Android 13+ (API 33+).
- `android.permission.RECEIVE_BOOT_COMPLETED`: Restauração dos alarmes de tarefas após reiniciar o aparelho.
- `android.permission.FOREGROUND_SERVICE`: Cronômetro persistente em background.

---

## 4. Arquitetura e Build iOS (`ios/` e `fastlane/`)

- **Projeto Xcode**: Localizado em `ios/App/App.xcodeproj`.
- **Automação Fastlane**: O diretório `fastlane/` contém as rotinas `Fastfile` para compilação, assinatura e upload automático para o Apple TestFlight e App Store.
- **Adaptação de Safe Area**: O CSS do Angular consome `--safe-area-inset-top` e `--safe-area-inset-bottom` para evitar que elementos fiquem sob a Dynamic Island ou o indicador de início do iPhone.

---

## 5. Integração Frontend com o Ambiente Mobile

### 5.1. Serviço Android (`src/app/features/android/android-interface.service.ts`)

- **Botão Físico de Voltar (_Hardware Back Button_)**: Intercepta o evento `backbutton` do Android. Se houver um modal, gaveta lateral ou menu aberto, o botão fecha o componente aberto em vez de fechar o aplicativo.

### 5.2. Serviço Mobile (`src/app/features/mobile/mobile.service.ts`)

- **Adaptações de Toque**: Transforma comportamentos de hover em ações de toque e ajusta áreas de clique (_hit targets_) para cumprir as diretrizes de ergonomia móvel (mínimo de 48x48px).
- **Long-Press Menu**: Substitui o clique direito do mouse por toque longo para exibir o menu de contexto da tarefa.

---

## 6. Diretrizes de Manutenção Mobile

1. **Ciclo de Atualização de Versões (`tools/bump-android-version.js`)**: Executado via `npm run version` para incrementar automaticamente o `versionCode` e `versionName` no `build.gradle` em sincronia com o `package.json`.
2. **Quotas de Armazenamento no iOS**: No iOS WebKit, o IndexedDB pode sofrer limpeza pelo sistema operacional se o armazenamento do aparelho ficar crítico. Recomenda-se incentivar o usuário a manter sincronização remota ativa ou exportar backups periódicos.
