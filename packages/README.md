# KaironTask Monorepo Packages

This directory contains internal packages, shared schemas, plugin SDKs, and the sync server backend for KaironTask.

## Architecture

For complete architectural documentation, Typia validation specifications, and package build orchestration:

- Refer to [`docs/architecture/06-packages-and-plugins.md`](../docs/architecture/06-packages-and-plugins.md).

## Packages Overview

- `plugin-api/` — TypeScript declarations and SDK for KaironTask plugins.
- `shared-schema/` — Ahead-of-Time (AOT) type validation compiled with Typia for op-log entities and synchronization.
- `super-sync-server/` — Self-hosted backend server for KaironTask sync with PostgreSQL.
- `vite-plugin/` — Custom Vite build plugin for packaging community and internal plugins.
- `plugin-dev/` — Internal issue providers and example plugins.

## Building All Packages

```bash
npm run build:packages
```
