window.KAIRON_TRANSLATIONS = {
  en: {
    metaTitle: 'KaironTask — Local-First Task Management & Timeboxing',
    metaDescription:
      'Calm, local-first task manager, timeboxer, and worklog tool with end-to-end encrypted sync. Available on Web, Desktop, and Mobile.',
    controls: {
      langGroupAria: 'Select language',
      themeToggleAria: 'Toggle color theme',
    },
    nav: {
      workflow: 'Workflow',
      syntax: 'Syntax',
      privacy: 'Architecture',
      platforms: 'Platforms',
      openApp: 'Open Web App',
    },
    hero: {
      eyebrow: 'LOCAL-FIRST · OPEN SOURCE · AES-256-GCM',
      title: 'Calm, local-first task management and timeboxing.',
      subtitle:
        'Built for software engineers and technical teams who want keyboard-driven planning, accurate time tracking, and zero vendor lock-in. Your data stays in IndexedDB and syncs under your own key.',
      ctaPrimary: 'Launch Web App',
      ctaSecondary: 'Source on GitHub',
      specLine: 'IndexedDB · Vector-Clock Op-Log · Web / Desktop / Mobile · MIT',
    },
    screens: {
      today: {
        tab: 'Today',
        caption:
          'Today workspace with sidebar projects, live capacity bar, active cyan tracking, subtasks, and Markdown detail panel.',
      },
      focus: {
        tab: 'Focus',
        caption:
          'Distraction-free Focus Mode with Countdown, Pomodoro, and Flowtime timers.',
      },
      planner: {
        tab: 'Planner',
        caption:
          'Multi-day weekly planner columns with daily workload totals and drag-and-drop scheduling.',
      },
      schedule: {
        tab: 'Timeline',
        caption:
          'Automatic workday timeblocking with color-coded project slots and break intervals.',
      },
      boards: {
        tab: 'Boards',
        caption:
          'Custom Kanban columns and built-in Eisenhower Matrix tabs for visual triage.',
      },
      summary: {
        tab: 'Daily Summary',
        caption:
          'End-of-day wrap-up showing workday window, completed tasks by project, and time KPIs.',
      },
      worklog: {
        tab: 'Worklog',
        caption:
          'Weekly and daily worklog aggregation with fast inspection and timesheet export.',
      },
    },
    workflow: {
      kicker: 'DAILY LOOP',
      title: 'Structured execution from capture to wrap-up.',
      steps: {
        capture: {
          title: 'Capture & Triage',
          desc: 'Add tasks anywhere via Shift+A with inline tags, project routing, natural dates, and time estimates without touching the mouse.',
        },
        focus: {
          title: 'Timebox & Focus',
          desc: 'Track active tasks down to the second in the Today list or switch to Focus Mode with Countdown, Pomodoro, or Flowtime timers.',
        },
        plan: {
          title: 'Plan & Schedule',
          desc: 'Distribute workload across multi-day Planner columns, automatic Timeline blocks, Kanban boards, and the Eisenhower Matrix.',
        },
        review: {
          title: 'Wrap-up & Export',
          desc: 'Review work windows and completed tasks in Daily Summary, then inspect weekly hours or export timesheets from the Worklog.',
        },
      },
    },
    syntax: {
      kicker: 'KEYBOARD-FIRST',
      title: 'Inline short syntax & default bindings.',
      subtitle:
        'Edit the command line below to test how KaironTask parses projects, tags, timeboxes, and natural-language dates.',
      inputLabel: 'Quick-Add Bar Simulation',
      shortcutsLabel: 'Default Keybindings',
      none: 'None',
      parsed: {
        title: 'Title',
        project: 'Project',
        tags: 'Tags',
        time: 'Timebox',
        due: 'Schedule',
        spentPrefix: 'spent',
        estPrefix: 'est',
      },
      keys: {
        addTask: 'Open Quick-Add bar',
        togglePlay: 'Start / pause time tracking',
        done: 'Toggle task completion',
        subtask: 'Add subtask under selected item',
        estimate: 'Edit spent & estimated time',
        schedule: 'Schedule task date / reminder',
        notes: 'Toggle Markdown detail drawer',
        focus: 'Enter Deep Focus Mode',
        today: 'Return to Today workspace',
        timeline: 'Open Timeline schedule view',
      },
    },
    privacy: {
      kicker: 'ENGINEERING & PRIVACY',
      title: 'Offline by default. Encrypted before transit.',
      subtitle:
        'No mandatory cloud account, no analytics scripts, and no third-party data brokers.',
      rows: {
        storage: {
          label: 'Primary Persistence',
          value:
            'Local IndexedDB stores (app_data & sequential op_log) with zero network latency.',
        },
        crypto: {
          label: 'Client-Side E2EE',
          value:
            'Authenticated AES-256-GCM encryption derives keys locally before any delta leaves your device.',
        },
        sync: {
          label: 'Conflict Resolution',
          value:
            'Immutable UUIDv7 operation logs combined with deterministic Vector Clock ordering.',
        },
        targets: {
          label: 'Sync Targets',
          value:
            'KaironSync (self-hostable Node/PostgreSQL), WebDAV (Nextcloud / ownCloud), Dropbox, or shared local folder.',
        },
        integrations: {
          label: 'Issue & Calendar Integrations',
          value:
            'GitHub, GitLab, Jira, Linear, ClickUp, Trello, Gitea, Redmine, OpenProject, CalDAV, and Nextcloud Deck.',
        },
      },
    },
    platforms: {
      kicker: 'DISTRIBUTION',
      title: 'Run anywhere you work.',
      items: {
        web: {
          title: 'Browser & PWA',
          desc: 'Zero install. Works offline via Service Worker with full IndexedDB local storage.',
          cta: 'Open Web App →',
        },
        desktop: {
          title: 'Windows, macOS & Linux',
          desc: 'Electron desktop build with global shortcuts, idle detection, and system tray timer.',
          cta: 'Download Releases →',
        },
        mobile: {
          title: 'Android & iOS',
          desc: 'Capacitor native wrapper with background sync notifications and mobile gestures.',
          cta: 'Mobile Builds →',
        },
        docker: {
          title: 'Docker & KaironSync',
          desc: 'Deploy both the web client and KaironSync server in your own Docker host.',
          cta: 'Deployment Guide →',
        },
      },
    },
    footer: {
      releases: 'Releases',
      architecture: 'Architecture',
    },
  },
  'pt-BR': {
    metaTitle: 'KaironTask — Gestão de Tarefas Local-First & Timeboxing',
    metaDescription:
      'Gerenciador de tarefas local-first com timeboxing, modo foco e sincronização E2EE. Disponível para Web, Desktop e Mobile.',
    controls: {
      langGroupAria: 'Selecionar idioma',
      themeToggleAria: 'Alternar tema claro/escuro',
    },
    nav: {
      workflow: 'Fluxo',
      syntax: 'Sintaxe',
      privacy: 'Arquitetura',
      platforms: 'Plataformas',
      openApp: 'Abrir Web App',
    },
    hero: {
      eyebrow: 'LOCAL-FIRST · OPEN SOURCE · AES-256-GCM',
      title: 'Gestão de tarefas local-first e timeboxing sem ruído.',
      subtitle:
        'Projetado para engenheiros de software e times técnicos que buscam planejamento por teclado, medição real de tempo e zero dependência de nuvem proprietária. Seus dados ficam no IndexedDB e sincronizam com a sua própria chave.',
      ctaPrimary: 'Abrir Web App',
      ctaSecondary: 'Código no GitHub',
      specLine: 'IndexedDB · Op-Log Vetorial · Web / Desktop / Mobile · MIT',
    },
    screens: {
      today: {
        tab: 'Hoje',
        caption:
          'Workspace Hoje com projetos na barra lateral, barra de capacidade, rastreio ativo em ciano, subtarefas e painel em Markdown.',
      },
      focus: {
        tab: 'Foco',
        caption:
          'Modo Foco livre de distrações com timers Countdown, Pomodoro e Flowtime.',
      },
      planner: {
        tab: 'Planejador',
        caption:
          'Colunas semanais multi-dia com carga horária diária e agendamento por arrastar e soltar.',
      },
      schedule: {
        tab: 'Cronograma',
        caption:
          'Timeblocking automático na jornada de trabalho com blocos por projeto e pausas.',
      },
      boards: {
        tab: 'Quadros',
        caption:
          'Quadros Kanban customizados e Matriz de Eisenhower integrada para triagem visual.',
      },
      summary: {
        tab: 'Resumo Diário',
        caption:
          'Fechamento do expediente com janela de trabalho, tarefas concluídas por projeto e KPIs.',
      },
      worklog: {
        tab: 'Worklog',
        caption:
          'Consolidação semanal e diária de horas trabalhadas com exportação rápida de folha de ponto.',
      },
    },
    workflow: {
      kicker: 'CICLO DIÁRIO',
      title: 'Execução estruturada da captura ao fechamento.',
      steps: {
        capture: {
          title: 'Captura & Triagem',
          desc: 'Adicione tarefas de qualquer lugar com Shift+A usando tags inline, projeto, datas naturais e estimativa sem tirar as mãos do teclado.',
        },
        focus: {
          title: 'Timebox & Foco',
          desc: 'Meça o tempo ativo segundo a segundo na lista Hoje ou entre no Modo Foco com ciclos Countdown, Pomodoro ou Flowtime.',
        },
        plan: {
          title: 'Planejamento & Agenda',
          desc: 'Distribua a carga da semana no Planejador multi-dia, blocos automáticos na Timeline, quadros Kanban e Matriz de Eisenhower.',
        },
        review: {
          title: 'Fechamento & Exportação',
          desc: 'Revise sua janela de trabalho e entregas no Resumo Diário e consulte totais semanais ou folha de ponto no Worklog.',
        },
      },
    },
    syntax: {
      kicker: 'TECLADO EM PRIMEIRO LUGAR',
      title: 'Sintaxe rápida inline & atalhos padrão.',
      subtitle:
        'Edite a linha de comando abaixo para testar como o KaironTask interpreta projetos, tags, timeboxes e datas em linguagem natural.',
      inputLabel: 'Simulação da Barra Rápida',
      shortcutsLabel: 'Atalhos Padrão',
      none: 'Nenhum',
      parsed: {
        title: 'Título',
        project: 'Projeto',
        tags: 'Tags',
        time: 'Timebox',
        due: 'Agenda',
        spentPrefix: 'gasto',
        estPrefix: 'est.',
      },
      keys: {
        addTask: 'Abrir barra de adição rápida',
        togglePlay: 'Iniciar / pausar cronômetro',
        done: 'Marcar / desmarcar conclusão',
        subtask: 'Adicionar subtarefa no item atual',
        estimate: 'Editar tempo gasto e estimativa',
        schedule: 'Agendar data / lembrete da tarefa',
        notes: 'Abrir painel lateral Markdown',
        focus: 'Entrar no Modo Foco Profundo',
        today: 'Voltar para o workspace Hoje',
        timeline: 'Abrir visualização Timeline',
      },
    },
    privacy: {
      kicker: 'ENGENHARIA & PRIVACIDADE',
      title: 'Offline por padrão. Criptografado antes da rede.',
      subtitle:
        'Sem conta obrigatória, sem scripts de telemetria e sem intermediários lendo suas tarefas.',
      rows: {
        storage: {
          label: 'Persistência Primária',
          value:
            'IndexedDB local (app_data & op_log sequencial) com resposta instantânea sem latência de rede.',
        },
        crypto: {
          label: 'Criptografia E2EE',
          value:
            'AES-256-GCM autenticado com derivação de chave no cliente antes de qualquer envio pela rede.',
        },
        sync: {
          label: 'Resolução de Conflitos',
          value:
            'Log imutável de operações com UUIDv7 e ordenação determinística por Relógio Vetorial.',
        },
        targets: {
          label: 'Destinos de Sync',
          value:
            'KaironSync (servidor próprio Node/PostgreSQL), WebDAV (Nextcloud / ownCloud), Dropbox ou pasta local compartilhada.',
        },
        integrations: {
          label: 'Integrações de Issues & Agenda',
          value:
            'GitHub, GitLab, Jira, Linear, ClickUp, Trello, Gitea, Redmine, OpenProject, CalDAV e Nextcloud Deck.',
        },
      },
    },
    platforms: {
      kicker: 'DISTRIBUIÇÃO',
      title: 'Rode em qualquer ambiente.',
      items: {
        web: {
          title: 'Navegador & PWA',
          desc: 'Sem instalação. Funciona offline via Service Worker com banco IndexedDB local.',
          cta: 'Abrir Web App →',
        },
        desktop: {
          title: 'Windows, macOS & Linux',
          desc: 'Build desktop Electron com atalhos globais, detecção de ociosidade e bandeja do sistema.',
          cta: 'Baixar Versões →',
        },
        mobile: {
          title: 'Android & iOS',
          desc: 'App nativo via Capacitor com sincronização em segundo plano e gestos móveis.',
          cta: 'Builds Mobile →',
        },
        docker: {
          title: 'Docker & KaironSync',
          desc: 'Suba o cliente web e o servidor KaironSync diretamente na sua infraestrutura Docker.',
          cta: 'Guia de Deploy →',
        },
      },
    },
    footer: {
      releases: 'Versões',
      architecture: 'Arquitetura',
    },
  },
  es: {
    metaTitle: 'KaironTask — Gestión de Tareas Local-First y Timeboxing',
    metaDescription:
      'Gestor de tareas local-first con timeboxing, modo enfoque y sincronización E2EE. Disponible para Web, Desktop y Móvil.',
    controls: {
      langGroupAria: 'Seleccionar idioma',
      themeToggleAria: 'Cambiar tema claro/oscuro',
    },
    nav: {
      workflow: 'Flujo',
      syntax: 'Sintaxis',
      privacy: 'Arquitectura',
      platforms: 'Plataformas',
      openApp: 'Abrir Web App',
    },
    hero: {
      eyebrow: 'LOCAL-FIRST · OPEN SOURCE · AES-256-GCM',
      title: 'Gestión de tareas local-first y timeboxing sin distracciones.',
      subtitle:
        'Diseñado para ingenieros de software y equipos técnicos que buscan planificación por teclado, registro preciso de tiempo y cero bloqueo de proveedor. Tus datos viven en IndexedDB y se sincronizan con tu propia clave.',
      ctaPrimary: 'Abrir Web App',
      ctaSecondary: 'Código en GitHub',
      specLine: 'IndexedDB · Op-Log Vectorial · Web / Desktop / Móvil · MIT',
    },
    screens: {
      today: {
        tab: 'Hoy',
        caption:
          'Espacio Hoy con proyectos laterales, barra de capacidad, seguimiento activo en cian, subtareas y panel Markdown.',
      },
      focus: {
        tab: 'Enfoque',
        caption:
          'Modo Enfoque sin distracciones con temporizadores Countdown, Pomodoro y Flowtime.',
      },
      planner: {
        tab: 'Planificador',
        caption:
          'Columnas semanales multi-día con carga horaria diaria y programación arrastrando tareas.',
      },
      schedule: {
        tab: 'Cronograma',
        caption:
          'Timeblocking automático en la jornada laboral con bloques por proyecto y pausas.',
      },
      boards: {
        tab: 'Tableros',
        caption:
          'Tableros Kanban personalizados y Matriz de Eisenhower integrada para priorización visual.',
      },
      summary: {
        tab: 'Resumen Diario',
        caption:
          'Cierre de jornada con horario laboral, tareas completadas por proyecto y KPIs de tiempo.',
      },
      worklog: {
        tab: 'Worklog',
        caption:
          'Resumen semanal y diario de horas trabajadas con exportación rápida de partes de horas.',
      },
    },
    workflow: {
      kicker: 'CICLO DIARIO',
      title: 'Ejecución estructurada de la captura al cierre.',
      steps: {
        capture: {
          title: 'Captura y Triaje',
          desc: 'Crea tareas desde cualquier vista con Shift+A usando etiquetas inline, proyecto, fechas naturales y estimaciones sin soltar el teclado.',
        },
        focus: {
          title: 'Timebox y Enfoque',
          desc: 'Registra el tiempo activo al segundo en la lista Hoy o cambia al Modo Enfoque con Countdown, Pomodoro o Flowtime.',
        },
        plan: {
          title: 'Planifica y Agenda',
          desc: 'Equilibra tu semana entre columnas del Planificador, bloques automáticos en Timeline, tableros Kanban y Matriz de Eisenhower.',
        },
        review: {
          title: 'Cierre y Exportación',
          desc: 'Revisa tu jornada y tareas terminadas en el Resumen Diario y consulta totales semanales en el Worklog.',
        },
      },
    },
    syntax: {
      kicker: 'PRIMERO EL TECLADO',
      title: 'Sintaxis rápida inline y atajos por defecto.',
      subtitle:
        'Edita la línea inferior para probar cómo KaironTask interpreta proyectos, etiquetas, timeboxes y fechas naturales.',
      inputLabel: 'Simulación de Barra Rápida',
      shortcutsLabel: 'Atajos por Defecto',
      none: 'Ninguno',
      parsed: {
        title: 'Título',
        project: 'Proyecto',
        tags: 'Etiquetas',
        time: 'Timebox',
        due: 'Agenda',
        spentPrefix: 'invertido',
        estPrefix: 'est.',
      },
      keys: {
        addTask: 'Abrir barra de entrada rápida',
        togglePlay: 'Iniciar / pausar cronómetro',
        done: 'Marcar / desmarcar como hecha',
        subtask: 'Añadir subtarea bajo el elemento actual',
        estimate: 'Editar tiempo invertido y estimado',
        schedule: 'Programar fecha / recordatorio',
        notes: 'Abrir panel lateral Markdown',
        focus: 'Entrar en Modo Enfoque Profundo',
        today: 'Volver a la vista Hoy',
        timeline: 'Abrir vista de Cronograma Timeline',
      },
    },
    privacy: {
      kicker: 'INGENIERÍA Y PRIVACIDAD',
      title: 'Offline por defecto. Cifrado antes de salir.',
      subtitle:
        'Sin cuenta obligatoria, sin scripts de analítica y sin intermediarios leyendo tus tareas.',
      rows: {
        storage: {
          label: 'Persistencia Primaria',
          value:
            'Almacenamiento local IndexedDB (app_data y op_log secuencial) con latencia cero.',
        },
        crypto: {
          label: 'Cifrado E2EE en Cliente',
          value:
            'Cifrado autenticado AES-256-GCM con derivación local de claves antes de transmitir cualquier delta.',
        },
        sync: {
          label: 'Resolución de Conflictos',
          value:
            'Registro inmutable de operaciones UUIDv7 combinado con ordenamiento determinista por Reloj Vectorial.',
        },
        targets: {
          label: 'Destinos de Sincronización',
          value:
            'KaironSync (autoalojado en Node/PostgreSQL), WebDAV (Nextcloud / ownCloud), Dropbox o carpeta local compartida.',
        },
        integrations: {
          label: 'Integraciones de Issues y Calendario',
          value:
            'GitHub, GitLab, Jira, Linear, ClickUp, Trello, Gitea, Redmine, OpenProject, CalDAV y Nextcloud Deck.',
        },
      },
    },
    platforms: {
      kicker: 'DISTRIBUCIÓN',
      title: 'Ejecuta donde trabajas.',
      items: {
        web: {
          title: 'Navegador y PWA',
          desc: 'Sin instalación. Funciona offline mediante Service Worker con almacenamiento IndexedDB.',
          cta: 'Abrir Web App →',
        },
        desktop: {
          title: 'Windows, macOS y Linux',
          desc: 'Compilación Electron con atajos globales, detección de inactividad y bandeja del sistema.',
          cta: 'Descargar Versiones →',
        },
        mobile: {
          title: 'Android e iOS',
          desc: 'Envoltorio nativo Capacitor con notificaciones en segundo plano y gestos móviles.',
          cta: 'Compilaciones Móvil →',
        },
        docker: {
          title: 'Docker y KaironSync',
          desc: 'Despliega tanto el cliente web como el servidor KaironSync en tu propio host Docker.',
          cta: 'Guía de Despliegue →',
        },
      },
    },
    footer: {
      releases: 'Versiones',
      architecture: 'Arquitectura',
    },
  },
};
