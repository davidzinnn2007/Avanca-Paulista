/* AVANÇA PAULISTA | lógica das páginas: cadastro, login e oportunidades.
   Tema, menu, animações e sessão ficam em ui.js (carregado antes deste). */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const AP = window.AP;
  if (!AP) return;

  const field = id => document.getElementById(id);
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setBusy = (form, busy) => {
    const button = form.querySelector('button[type="submit"]');
    if (button) { button.disabled = busy; button.setAttribute('aria-busy', String(busy)); }
  };

  /* ---------- Cadastro ---------- */
  const registerForm = field('registerForm');
  if (registerForm) {
    const message = field('formMessage');
    registerForm.addEventListener('submit', async event => {
      event.preventDefault();
      const name = field('name').value.trim().replace(/\s+/g, ' ');
      const email = field('email').value.trim().toLowerCase();
      const password = field('password').value;
      const confirmation = field('confirmPassword').value;
      const terms = field('terms').checked;
      const fail = text => AP.showMessage(message, text, 'error');

      if (name.length < 3) return fail('Digite seu nome completo.');
      if (!EMAIL_PATTERN.test(email)) return fail('Informe um e-mail válido.');
      if (password.length < 8) return fail('A senha precisa ter pelo menos 8 caracteres.');
      if (password !== confirmation) return fail('As senhas não coincidem.');
      if (!terms) return fail('Aceite os termos para continuar.');
      if (!AP.hasCrypto()) return fail('Seu navegador não oferece a criptografia necessária. Abra o site por Live Server ou https.');

      const users = AP.getUsers();
      if (users.some(user => user.email === email)) return fail('Este e-mail já possui cadastro. Faça login.');

      setBusy(registerForm, true);
      try {
        const user = { id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}-${Math.random().toString(16).slice(2)}`, name, email, area: '' };
        await AP.setPassword(user, password);
        users.push(user);
        if (!AP.saveUsers(users)) throw new Error('storage');
        AP.showMessage(message, 'Conta criada com sucesso! Redirecionando para o login...', 'success');
        setTimeout(() => { location.href = 'login.html?cadastro=ok'; }, 900);
      } catch {
        setBusy(registerForm, false);
        fail('Não foi possível salvar o cadastro neste navegador. Verifique se o armazenamento local está liberado.');
      }
    });
  }

  /* ---------- Login ---------- */
  const loginForm = field('loginForm');
  if (loginForm) {
    const message = field('formMessage');
    const params = new URLSearchParams(location.search);
    if (params.get('cadastro') === 'ok') AP.showMessage(message, 'Conta criada! Entre com seu e-mail e senha.', 'success');
    else if (params.get('next')) AP.showMessage(message, 'Faça login para acessar essa área.', 'error');
    else if (params.get('saiu') === '1') AP.showMessage(message, 'Você saiu da sua conta.', 'success');

    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      const email = field('email').value.trim().toLowerCase();
      const password = field('password').value;
      const remember = field('remember').checked;
      const fail = text => AP.showMessage(message, text, 'error');

      if (!email || !password) return fail('Preencha e-mail e senha.');
      if (!AP.hasCrypto()) return fail('Seu navegador não oferece a criptografia necessária. Abra o site por Live Server ou https.');

      setBusy(loginForm, true);
      try {
        const user = AP.getUsers().find(item => item.email === email);
        const valid = user ? await AP.checkPassword(user, password) : false;
        if (!valid) { setBusy(loginForm, false); return fail('E-mail ou senha incorretos. Verifique seus dados.'); }
        AP.startSession(user, remember);
        location.href = AP.getNext() || 'dashboard.html';
      } catch {
        setBusy(loginForm, false);
        fail('Não foi possível entrar agora. Tente novamente.');
      }
    });
  }

  /* ---------- Oportunidades: pesquisa, filtros e salvar ---------- */
  const searchInput = field('searchInput');
  const items = [...document.querySelectorAll('.opportunity-item')];
  if (!searchInput || !items.length) return;

  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const resultsCount = field('resultsCount');
  const emptyResults = field('emptyResults');
  const validFilters = ['todos', 'emprego', 'estagio', 'curso', 'empreendedorismo'];
  const requested = new URLSearchParams(location.search).get('categoria');
  let activeFilter = validFilters.includes(requested) ? requested : 'todos';

  AP.store.set(localStorage, AP.KEYS.count, String(items.length));

  // Pesquisa só nos textos da oportunidade (não nos botões da interface)
  const SEARCH_PARTS = ['.opportunity-type', '.opportunity-location', 'h3', '.company-name', '.opportunity-description', '.opportunity-details'];
  const searchable = new Map(items.map(item => [
    item,
    SEARCH_PARTS.map(selector => item.querySelector(selector)?.textContent || '').join(' ').toLocaleLowerCase('pt-BR')
  ]));

  function updateResults() {
    const term = searchInput.value.trim().toLocaleLowerCase('pt-BR');
    let count = 0;
    items.forEach(item => {
      const visible = (activeFilter === 'todos' || item.dataset.category === activeFilter) && searchable.get(item).includes(term);
      item.hidden = !visible;
      if (visible) count++;
    });
    if (resultsCount) {
      resultsCount.textContent = `${count} ${count === 1 ? 'oportunidade encontrada' : 'oportunidades encontradas'}`;
    }
    if (emptyResults) emptyResults.hidden = count > 0;
  }

  function selectFilter(filter) {
    activeFilter = validFilters.includes(filter) ? filter : 'todos';
    filterButtons.forEach(button => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateResults();
  }

  filterButtons.forEach(button => button.addEventListener('click', () => selectFilter(button.dataset.filter)));
  searchInput.addEventListener('input', updateResults);
  field('searchButton')?.addEventListener('click', updateResults);
  searchInput.addEventListener('keydown', event => { if (event.key === 'Enter') updateResults(); });
  selectFilter(activeFilter);

  // Salvar oportunidades (exige login; salvas por usuário)
  const user = AP.getCurrentUser();
  const savedIds = () => new Set(user ? AP.getSaved(user.id).map(entry => entry.id) : []);

  const paint = (button, saved) => {
    button.setAttribute('aria-pressed', String(saved));
    button.textContent = saved ? '★ Salva · remover' : '☆ Salvar oportunidade';
  };

  const current = savedIds();
  items.forEach(item => {
    const button = item.querySelector('[data-save]');
    if (!button) return;
    paint(button, current.has(item.dataset.id));
    button.addEventListener('click', () => {
      if (!user) { location.href = 'login.html?next=oportunidades.html'; return; }
      const list = AP.getSaved(user.id);
      const exists = list.some(entry => entry.id === item.dataset.id);
      const next = exists
        ? list.filter(entry => entry.id !== item.dataset.id)
        : [...list, {
            id: item.dataset.id,
            title: item.querySelector('h3')?.textContent.trim() || 'Oportunidade',
            company: item.querySelector('.company-name')?.textContent.trim() || '',
            category: item.dataset.category,
            categoryLabel: item.querySelector('.opportunity-type')?.textContent.trim() || ''
          }];
      AP.setSaved(user.id, next);
      paint(button, !exists);
      button.setAttribute('aria-label', !exists ? 'Oportunidade salva. Ative para remover.' : 'Oportunidade removida dos salvos.');
    });
  });
});
