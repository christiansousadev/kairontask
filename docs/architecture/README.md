# KaironTask — System Architecture & Technical Specifications

> **Project**: KaironTask  
> **Reference Version**: `18.1.3` (Angular 18+/21, Electron 37+, Capacitor 7)  
> **Author & Maintainer**: Christian Sousa — [christiansousa.dev](https://christiansousa.dev) · `contato@christiansousa.dev`  
> **Repository**: [github.com/christiansousadev/kairontask](https://github.com/christiansousadev/kairontask)

---

## 🗺️ Architectural Documentation Map

This directory contains the authoritative technical documentation for KaironTask's engineering, core systems, distributed data sync, and multi-platform architecture:

| Document                                                               | Subsystem / Layer                  | Topics Covered                                                                                                                                                                                                             |
| :--------------------------------------------------------------------- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[`01. Core & State Management`](01-core-and-state.md)**              | **Core & State Infrastructure**    | Bootstrap (`src/main.ts`), 27 core subsystems (`src/app/core/`), NgRx Root Store, atomic Meta-Reducers, `LOCAL_ACTIONS` token, Last-Write-Wins (LWW), referential data consistency.                                        |
| **[`02. Persistence & Op-Log Sync`](02-persistence-and-sync.md)**      | **Local-First & Distributed Sync** | IndexedDB (`src/app/pfapi/`), Op-Log engine with UUIDv7, Vector Clocks, conflict resolution, WebSocket push, WebDAV, Dropbox, SuperSync, AES-256-GCM E2EE encryption.                                                      |
| **[`03. Modules & Features`](03-modules-and-features.md)**             | **Domain & Business Logic**        | All 41 domain modules (`src/app/features/`): Tasks, Repeat Config, Projects, Tags, WorkContext, 11 Issue Trackers (Jira, GitHub, GitLab, Linear, Azure DevOps, CalDAV, etc.), Time Tracking, Focus Mode, Planner, Metrics. |
| **[`04. Desktop with Electron`](04-desktop-electron.md)**              | **Desktop Layer**                  | Main process (`electron/`), ContextBridge, Preload bridge, IPC contracts (`electronAPI.d.ts`), Native subsystems (Tray, Idle Detection, Jira Proxy, Local REST API, Fullscreen Blocker).                                   |
| **[`05. Mobile with Capacitor`](05-mobile-capacitor.md)**              | **Mobile Layer (Android / iOS)**   | Capacitor 7 bridge, Android Gradle flavors (PlayStore / F-Droid), iOS Xcode & Fastlane automation, Native plugins, Hardware back button, Safe Area handling.                                                               |
| **[`06. Packages & Plugins`](06-packages-and-plugins.md)**             | **Extensibility & Workspaces**     | `packages/plugin-api` (SDK), `packages/shared-schema` (Typia AOT validation), `packages/super-sync-server` (PostgreSQL/Node backend), Vite plugin tooling, frontend plugin runtime.                                        |
| **[`07. Design System & i18n`](07-design-system-and-i18n.md)**         | **UI, Theming & Localization**     | _Midnight Obsidian_ design system, CSS Custom Properties (`_css-variables.scss`), dynamic theming, offline typography, and typed i18n pipeline across 27 languages (`src/app/t.const.ts`).                                 |
| **[`08. Infrastructure, Build & Tests`](08-infra-build-and-tests.md)** | **DevOps & Quality Assurance**     | Multi-stage Dockerfile (Nginx), Docker Compose environments, multi-timezone test suite (`npm run test:tz:all`), Playwright E2E testing, ESLint rules, Husky hooks.                                                         |

---

## 🎯 Technology Stack Overview

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               KAIRONTASK MONOREPO                                │
├──────────────────────┬─────────────────────────┬─────────────────────────────────┤
│ Frontend (UI/SPA)    │ Desktop Wrapper         │ Mobile Wrapper                  │
│ - Angular 18+/21     │ - Electron 37+          │ - Capacitor 7                   │
│ - NgRx 21 + Signals  │ - Node.js Main Process  │ - Android (Java/Gradle/F-Droid) │
│ - Angular Material   │ - ContextBridge IPC     │ - iOS (Xcode/Swift/Fastlane)    │
│ - SCSS CSS-Vars      │ - Local REST API        │ - Safe Area & Dark Mode Plugins │
├──────────────────────┼─────────────────────────┼─────────────────────────────────┤
│ Persistence & Sync   │ Internal Packages       │ Quality & Tooling               │
│ - IndexedDB (idb)    │ - plugin-api            │ - Docker Multi-Stage (Nginx)    │
│ - Op-Log with UUIDv7 │ - shared-schema (Typia) │ - Karma Multi-Timezone Suite    │
│ - Vector Clocks      │ - super-sync-server     │ - Playwright End-to-End Suite   │
│ - WebDAV / Dropbox   │ - vite-plugin           │ - ESLint Flat + Husky Hooks     │
└──────────────────────┴─────────────────────────┴─────────────────────────────────┘
```

---

## 📐 Design & Architecture Principles

1. **Local-First by Default**: The application performs all reads and writes instantly against local IndexedDB storage with zero network latency.
2. **Deterministic Synchronization**: Every mutation creates an immutable operational delta stamped with a UUIDv7 and Vector Clock. Changes are merged across multiple devices without requiring an authoritative master server.
3. **Strict Side-Effect Isolation**: All NgRx effects must listen exclusively to `LOCAL_ACTIONS` to guarantee that remote sync operations replay without generating redundant notifications, sounds, or sync re-emissions.
4. **Single Source of Truth for Design Tokens**: The visual identity is governed entirely by CSS custom properties in `src/styles/_css-variables.scss` and theme configurations in `work-context.const.ts`.
