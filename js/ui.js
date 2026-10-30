/* AVANÇA PAULISTA | núcleo compartilhado
   Responsável por: tema, menu, animações, transição entre páginas,
   sessão/usuários (demonstrativo, localStorage) e proteção de rotas.
   Deve ser o PRIMEIRO script carregado em todas as páginas. */
(() => {
  'use strict';

  /* ---------- Armazenamento seguro (pode falhar em modo privado) ---------- */
  const store = {
    get(area, key) { try { return area.getItem(key); } catch { return null; } },
    set(area, key, value) { try { area.setItem(key, value); return true; } catch { return false; } },
    remove(area, key) { try { area.removeItem(key); } catch { /* ignora */ } }
  };
  const readJSON = (area, key, fallback) => {
    try {
      const value = JSON.parse(store.get(area, key));
      return value ?? fallback;
    } catch { return fallback; }
  };

  const KEYS = {
    theme: 'avancaTheme',
    users: 'avancaUsers',
    session: 'avancaSession',
    saved: 'avancaSaved',
    count: 'avancaOpportunityCount'
  };
  const PBKDF2_ITERATIONS = 120000;
  const NEXT_WHITELIST = ['dashboard.html', 'oportunidades.html'];

  /* ---------- Caminhos (páginas ficam em /pages, a home na raiz) ---------- */
  const inPages = /\/pages\/[^/]*$/.test(location.pathname);
  const toPage = name => (inPages ? name : `pages/${name}`);

  /* ---------- Usuários ---------- */
  const getUsers = () => {
    const users = readJSON(localStorage, KEYS.users, []);
    return Array.isArray(users) ? users : [];
  };
  const saveUsers = users => store.set(localStorage, KEYS.users, JSON.stringify(users));

  /* ---------- Senhas: PBKDF2 (Web Crypto) ----------
     Melhor que texto puro, mas continua sendo demonstração: o hash fica no
     navegador do próprio usuário. Produção exige backend. */
  const toBase64 = bytes => btoa(String.fromCharCode(...bytes));
  const fromBase64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
  const hasCrypto = () => Boolean(window.crypto && crypto.subtle);

  const createSalt = () => toBase64(crypto.getRandomValues(new Uint8Array(16)));
  const hashPassword = async (password, salt, iterations = PBKDF2_ITERATIONS) => {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64(salt), iterations }, key, 256);
    return toBase64(new Uint8Array(bits));
  };
  const setPassword = async (user, password) => {
    user.salt = createSalt();
    user.iterations = PBKDF2_ITERATIONS;
    user.hash = await hashPassword(password, user.salt, user.iterations);
    delete user.password; // remove senha em texto puro de contas antigas
    return user;
  };
  /* Confere a senha. Contas antigas (texto puro) são aceitas uma vez e migradas. */
  const checkPassword = async (user, password) => {
    if (user.hash && user.salt) {
      return (await hashPassword(password, user.salt, user.iterations || PBKDF2_ITERATIONS)) === user.hash;
    }
    if (typeof user.password === 'string' && user.password === password) {
      await setPassword(user, password);
      const users = getUsers().map(item => (item.id === user.id ? user : item));
      saveUsers(users);
      return true;
    }
    return false;
  };

  /* ---------- Sessão ---------- */
  const clearSession = () => {
    store.remove(sessionStorage, KEYS.session);
    store.remove(localStorage, KEYS.session);
  };
  const getSession = () => {
    const raw = readJSON(sessionStorage, KEYS.session, null) || readJSON(localStorage, KEYS.session, null);
    if (!raw || !raw.userId) return null;
    // A sessão só vale se o usuário ainda existir.
    if (!getUsers().some(user => user.id === raw.userId)) { clearSession(); return null; }
    return raw;
  };
  const getCurrentUser = () => {
    const session = getSession();
    return session ? getUsers().find(user => user.id === session.userId) || null : null;
  };
  const startSession = (user, remember) => {
    clearSession();
    const area = remember ? localStorage : sessionStorage;
    store.set(area, KEYS.session, JSON.stringify({ userId: user.id }));
  };

  /* ---------- Oportunidades salvas (por usuário) ---------- */
  const getSaved = userId => {
    const all = readJSON(localStorage, KEYS.saved, {});
    const list = all && typeof all === 'object' ? all[userId] : [];
    return Array.isArray(list) ? list : [];
  };
  const setSaved = (userId, list) => {
    const all = readJSON(localStorage, KEYS.saved, {});
    const next = all && typeof all === 'object' && !Array.isArray(all) ? all : {};
    next[userId] = list;
    store.set(localStorage, KEYS.saved, JSON.stringify(next));
  };

  /* ---------- Mensagens inline acessíveis ---------- */
  const showMessage = (element, text, type = '') => {
    if (!element) return;
    element.textContent = text;
    element.className = `form-message ${type}`.trim();
    element.setAttribute('role', type === 'error' ? 'alert' : 'status');
  };

  const getNext = () => {
    const next = new URLSearchParams(location.search).get('next');
    return NEXT_WHITELIST.includes(next) ? next : null;
  };

  window.AP = {
    KEYS, store, readJSON, toPage, getNext, hasCrypto,
    getUsers, saveUsers, createSalt, hashPassword, setPassword, checkPassword,
    getSession, getCurrentUser, startSession, logout: clearSession,
    getSaved, setSaved, showMessage
  };

  /* ---------- Proteção de rota ----------
     Páginas com data-requires-auth exigem sessão válida.
     Atenção: isto é só experiência de uso; sem backend não é segurança real. */
  const requiresAuth = () => document.body && document.body.hasAttribute('data-requires-auth');
  if (requiresAuth() && !getSession()) {
    location.replace(`login.html?next=${encodeURIComponent(location.pathname.split('/').pop())}`);
    return;
  }

  /* ---------- Tema ---------- */
  const root = document.documentElement;
  const saved = store.get(localStorage, KEYS.theme);
  const preferred = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.dataset.theme = saved === 'dark' || saved === 'light' ? saved : preferred;

  const applyTheme = (theme, persist = true) => {
    root.dataset.theme = theme;
    if (persist) store.set(localStorage, KEYS.theme, theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const dark = theme === 'dark';
      button.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
      button.setAttribute('aria-pressed', String(dark));
      button.innerHTML = dark
        ? '<span aria-hidden="true">☀</span><span class="theme-label">Claro</span>'
        : '<span aria-hidden="true">☾</span><span class="theme-label">Escuro</span>';
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    /* Botão de tema em todos os cabeçalhos */
    document.querySelectorAll('.header').forEach(header => {
      if (header.querySelector('[data-theme-toggle]')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'theme-toggle';
      button.dataset.themeToggle = '';
      const actions = header.querySelector('.header-actions');
      if (actions) actions.prepend(button); else header.append(button);
    });
    applyTheme(root.dataset.theme, false);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
    });

    /* Estado do cabeçalho conforme sessão (home e oportunidades) */
    if (getSession()) {
      document.querySelectorAll('.header-actions').forEach(actions => {
        const login = actions.querySelector('a.login-link');
        if (login) {
          login.textContent = 'Minha área';
          login.setAttribute('href', login.getAttribute('href').replace('login.html', 'dashboard.html'));
        }
        const signup = actions.querySelector('a.button-primary[href$="cadastro.html"]');
        if (signup) {
          const out = document.createElement('button');
          out.type = 'button';
          out.className = 'logout-link';
          out.textContent = 'Sair';
          out.addEventListener('click', () => { clearSession(); location.reload(); });
          signup.replaceWith(out);
        }
      });
    }

    /* Menu responsivo (único responsável, todas as páginas) */
    document.querySelectorAll('.header').forEach(header => {
      const nav = header.querySelector('.nav');
      if (!nav) return;
      let toggle = header.querySelector('.menu-toggle');
      if (!toggle) {
        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'menu-toggle';
        toggle.setAttribute('aria-label', 'Abrir menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span></span><span></span><span></span>';
        header.append(toggle);
      }
      const setOpen = open => {
        nav.classList.toggle('open', open);
        toggle.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      };
      toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
      nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
      });
    });

    /* Animação de entrada ao rolar (respeita prefers-reduced-motion) */
    const targets = document.querySelectorAll(
      'main section, .section-heading, .opportunity-card, .opportunity-item, .courses-content, .courses-decoration,' +
      '.about-points article, .cta-section, .dashboard-panel, .dashboard-stat, .form-card, .welcome,' +
      '.filter-area, .results-header, .search-box');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !reduced) {
      targets.forEach((el, i) => {
        el.dataset.reveal = '';
        el.style.setProperty('--reveal-delay', `${(i % 4) * 70}ms`);
      });
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      }), { threshold: 0.1, rootMargin: '0px 0px -25px 0px' });
      targets.forEach(el => observer.observe(el));
    }

    /* Transição de saída entre páginas internas */
    if (!reduced) {
      document.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
            link.target === '_blank' || link.hasAttribute('download') ||
            event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
        let destination;
        try { destination = new URL(link.href, location.href); } catch { return; }
        if (destination.origin !== location.origin && destination.protocol !== 'file:') return;
        if (destination.pathname === location.pathname && destination.search === location.search) return;
        event.preventDefault();
        document.body.classList.add('is-leaving');
        setTimeout(() => { location.href = destination.href; }, 220);
      });
    }

    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  });

  /* Voltar pelo histórico não pode deixar a página "saindo" */
  window.addEventListener('pageshow', () => document.body && document.body.classList.remove('is-leaving'));
})();
