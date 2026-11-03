# KaironTask — Android Platform

This directory contains the native Android project for KaironTask, built with Capacitor 7.

## Architecture & Build

For full architectural documentation, Gradle flavor configurations, and production build pipelines:

- Refer to [`docs/architecture/05-mobile-capacitor.md`](../docs/architecture/05-mobile-capacitor.md).

## Quick Build Commands

From the monorepo root:

```bash
# Run in Android emulator or connected device
npm run droid

# Build release APK (F-Droid flavor)
npm run dist:android

# Build release APK (Play Store flavor)
npm run dist:android:playstore
```
