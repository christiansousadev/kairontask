(function () {
  var THEME_KEY = 'kairon_landing_theme';
  var LANG_KEY = 'kairon_landing_lang';
  var SUPPORTED_LANGS = ['pt-BR', 'en', 'es'];

  var SCREEN_ASSETS = {
    today: {
      dark: 'assets/screenshot-tasks-dark.png',
      light: 'assets/screenshot-tasks-light.png',
    },
    focus: {
      dark: 'assets/screenshot-focus-mode.png',
      light: 'assets/screenshot-focus-mode.png',
    },
    planner: {
      dark: 'assets/screenshot-planner.png',
      light: 'assets/screenshot-planner.png',
    },
    schedule: {
      dark: 'assets/screenshot-schedule.png',
      light: 'assets/screenshot-schedule.png',
    },
    boards: {
      dark: 'assets/screenshot-boards.png',
      light: 'assets/screenshot-boards.png',
    },
    summary: {
      dark: 'assets/screenshot-daily-summary.png',
      light: 'assets/screenshot-daily-summary.png',
    },
    worklog: {
      dark: 'assets/screenshot-worklog.png',
      light: 'assets/screenshot-worklog.png',
    },
  };

  var state = {
    theme: document.documentElement.getAttribute('data-theme') || 'dark',
    lang: detectInitialLang(),
    screen: 'today',
  };

  function detectInitialLang() {
    try {
      var stored = localStorage.getItem(LANG_KEY);
      if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) {
        return stored;
      }
    } catch (e) {}
    var nav = (navigator.language || 'en').toLowerCase();
    if (nav.indexOf('pt') === 0) return 'pt-BR';
    if (nav.indexOf('es') === 0) return 'es';
    return 'en';
  }

  function getPath(obj, dotPath) {
    return dotPath.split('.').reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function dict() {
    return (window.KAIRON_TRANSLATIONS && window.KAIRON_TRANSLATIONS[state.lang]) || {};
  }

  function applyTheme(nextTheme) {
    state.theme = nextTheme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    try {
      localStorage.setItem(THEME_KEY, state.theme);
    } catch (e) {}
    renderScreen();
  }

  function applyLang(nextLang) {
    if (SUPPORTED_LANGS.indexOf(nextLang) === -1) return;
    state.lang = nextLang;
    document.documentElement.setAttribute('lang', state.lang);
    try {
      localStorage.setItem(LANG_KEY, state.lang);
    } catch (e) {}

    var t = dict();
    if (t.metaTitle) document.title = t.metaTitle;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && t.metaDescription) {
      metaDesc.setAttribute('content', t.metaDescription);
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = getPath(t, el.getAttribute('data-i18n'));
      if (typeof val === 'string') {
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var val = getPath(t, el.getAttribute('data-i18n-aria'));
      if (typeof val === 'string') {
        el.setAttribute('aria-label', val);
      }
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === state.lang);
    });

    renderScreen();
    renderParsedSyntax();
  }

  function renderScreen() {
    var img = document.getElementById('showcase-img');
    var captionEl = document.getElementById('showcase-caption');
    if (!img || !captionEl) return;

    var asset = SCREEN_ASSETS[state.screen] || SCREEN_ASSETS.today;
    var src = state.theme === 'light' ? asset.light : asset.dark;
    if (img.getAttribute('src') !== src) {
      img.setAttribute('src', src);
    }

    var screenCopy = getPath(dict(), 'screens.' + state.screen);
    if (screenCopy && screenCopy.caption) {
      captionEl.textContent = screenCopy.caption;
      img.setAttribute('alt', 'KaironTask — ' + (screenCopy.tab || state.screen));
    }

    document.querySelectorAll('.showcase-tabs .tab-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-screen') === state.screen;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function parseQuickAdd(raw) {
    var text = raw || '';

    var tags = [];
    text = text.replace(/(?:^|\s)#([^\s+@#]+)/g, function (_, tag) {
      tags.push('#' + tag);
      return '';
    });

    var due = null;
    text = text.replace(
      /(?:^|\s)@([^+@#]+?)(?=\s+(?:[+#]|t?\d+(?:\.\d+)?[mh]\b)|\s*$)/i,
      function (_, d) {
        due = d.trim();
        return '';
      },
    );

    var spent = null;
    var est = null;
    text = text.replace(
      /(?:^|\s)t?((?:\d+(?:\.\d+)?[mh]\s*)+)(?:\s*\/\s*((?:\d+(?:\.\d+)?[mh]\s*)+))?(?=\s|$)/i,
      function (_, left, right) {
        if (right) {
          spent = left.trim();
          est = right.trim();
        } else {
          est = left.trim();
        }
        return '';
      },
    );

    var project = null;
    text = text.replace(
      /(?:^|\s)\+(?!\s)((?:(?!\s+(?:[#@]|t?\d+[mh]\b)).)+)/i,
      function (_, p) {
        project = p.trim();
        return '';
      },
    );

    return {
      title: text.replace(/\s+/g, ' ').trim(),
      project: project,
      tags: tags,
      spent: spent,
      est: est,
      due: due,
    };
  }

  function renderParsedSyntax() {
    var input = document.getElementById('syntax-input');
    if (!input) return;

    var parsed = parseQuickAdd(input.value);
    var t = dict();
    var none = (t.syntax && t.syntax.none) || 'None';
    var pLabels = (t.syntax && t.syntax.parsed) || {};

    var outTitle = document.getElementById('out-title');
    var outProject = document.getElementById('out-project');
    var outTags = document.getElementById('out-tags');
    var outTime = document.getElementById('out-time');
    var outDue = document.getElementById('out-due');

    if (outTitle) outTitle.textContent = parsed.title || '—';
    if (outProject) outProject.textContent = parsed.project ? '+' + parsed.project : none;

    if (outTags) {
      outTags.innerHTML = '';
      if (parsed.tags.length === 0) {
        outTags.textContent = none;
      } else {
        parsed.tags.forEach(function (tag) {
          var span = document.createElement('span');
          span.className = 'parsed-tag';
          span.textContent = tag;
          outTags.appendChild(span);
        });
      }
    }

    if (outTime) {
      if (parsed.spent && parsed.est) {
        outTime.textContent =
          (pLabels.spentPrefix || 'spent') +
          ': ' +
          parsed.spent +
          ' / ' +
          (pLabels.estPrefix || 'est') +
          ': ' +
          parsed.est;
      } else if (parsed.est) {
        outTime.textContent = (pLabels.estPrefix || 'est') + ': ' + parsed.est;
      } else {
        outTime.textContent = none;
      }
    }

    if (outDue) outDue.textContent = parsed.due || none;
  }

  function bindEvents() {
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang'));
      });
    });

    document.querySelectorAll('.showcase-tabs .tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.screen = btn.getAttribute('data-screen') || 'today';
        renderScreen();
      });
    });

    var syntaxInput = document.getElementById('syntax-input');
    if (syntaxInput) {
      syntaxInput.addEventListener('input', renderParsedSyntax);
    }

    document.querySelectorAll('.chip-btn').forEach(function (chip) {
      chip.addEventListener('click', function () {
        if (!syntaxInput) return;
        syntaxInput.value = chip.getAttribute('data-sample') || '';
        renderParsedSyntax();
      });
    });
  }

  bindEvents();
  applyLang(state.lang);
})();
