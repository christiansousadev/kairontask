# KaironTask — User Guide

Welcome to **KaironTask**, a local-first task management, timeboxing, and deep focus application built for engineers and power users.

---

## 1. Quick-Add Syntax

Open the Quick-Add bar (`Shift + A` or the `+` button in the header) and combine natural tokens inline:

| Token             | Example                                       | Effect                           |
| :---------------- | :-------------------------------------------- | :------------------------------- |
| **Time Estimate** | `Refactor sync 45m` or `Design review 1h 30m` | Sets the estimated duration      |
| **Tags**          | `Fix auth bug #security #backend`             | Assigns or creates tags          |
| **Project**       | `Prepare release notes +KaironTask`           | Routes the task into a project   |
| **Schedule**      | `Deploy staging @tomorrow 10:00`              | Schedules date and reminder time |

---

## 2. Core Workflows

- **Today & Work View**: Focus on today's priorities in the pill-bar status header (remaining estimate, time worked today, and break timer). Drag tasks to reorder, or use `Ctrl + ↑` / `Ctrl + ↓` to move them with the keyboard.
- **Time Tracking**: Click the play button on any task (or the header squircle Play button) to start tracking. Active tasks highlight with an electric cyan indicator and live elapsed stopwatch.
- **Focus Mode & Pomodoro**: Launch distraction-free Focus Mode from the top bar (`F` shortcut or Focus icon). Choose between **Countdown**, **Flowtime**, or **Pomodoro** cycles over the Midnight Obsidian atmospheric canvas.
- **Daily Summary & Worklog**: Click **Finish Day** at the bottom of Today's list to review KPI metrics (start/end, completed count, time spent vs. estimated, breaks, and focus sessions), write end-of-day notes, and plan tomorrow.

---

## 3. Keyboard Shortcuts

| Action                          | Default Shortcut        |
| :------------------------------ | :---------------------- |
| Add New Task                    | `Shift + A`             |
| Toggle Play / Pause Active Task | `Y`                     |
| Open Focus Mode                 | `F`                     |
| Open Global Search              | `Ctrl + F` / `Cmd + F`  |
| Toggle Left Navigation Sidebar  | `Ctrl + B` / `Cmd + B`  |
| Move Selected Task Up / Down    | `Ctrl + ↑` / `Ctrl + ↓` |

All shortcuts can be customized under **Settings → Keyboard Shortcuts**.

---

## 4. Local-First Sync & Privacy

KaironTask stores all data locally in IndexedDB with zero telemetry or mandatory cloud accounts. To synchronize across devices:

1. Open **Settings → Sync & Backup**.
2. Choose a provider:
   - **KaironSync (`super-sync`)**: Real-time delta sync via self-hosted or managed server with optional **AES-256-GCM End-to-End Encryption (E2EE)**.
   - **WebDAV**: Compatible with Nextcloud, ownCloud, or any standard WebDAV endpoint.
   - **Dropbox**: Direct OAuth sync to your personal Dropbox folder.
   - **Local File**: Sync through a shared folder (Syncthing, iCloud Drive, NAS).

---

## 5. Issue Tracker Integrations

Connect **Jira**, **GitHub**, **GitLab**, **Linear**, **Azure DevOps**, **ClickUp**, **Trello**, **CalDAV**, **OpenProject**, **Redmine**, or **Gitea** under **Settings → Issue Providers** to pull assigned tickets directly into your backlog.
