/* AVANÇA PAULISTA | painel do usuário (a proteção de rota fica em ui.js) */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const AP = window.AP;
  const $ = id => document.getElementById(id);
  const profileForm = $('profileForm');
  if (!AP || !profileForm) return;

  const message = $('profileMessage');
  const user = AP.getCurrentUser();
  if (!user) { location.replace('login.html?next=dashboard.html'); return; }

  function updateProfile() {
    const name = user.name || 'jovem';
    $('userName').textContent = name.split(' ')[0];
    $('profileAvatar').textContent = name.charAt(0).toUpperCase();
    $('profileName').value = user.name || '';
    $('profileEmail').value = user.email || '';
    $('profileArea').value = user.area || '';
    $('profileStatus').textContent = user.name && user.email && user.area ? 'Completo' : 'Incompleto';
  }

  function updateSaved() {
    const saved = AP.getSaved(user.id);
    $('savedCount').textContent = saved.length;
    $('savedCounter').textContent = saved.length;

    const container = $('savedOpportunities');
    container.replaceChildren();

    if (!saved.length) {
      const empty = document.createElement('div');
      empty.className = 'saved-empty';
      empty.innerHTML = `
        <span aria-hidden="true">☆</span>
        <h3>Nenhuma oportunidade salva</h3>
        <p>Explore as oportunidades e salve aquelas que combinam com seus objetivos.</p>
        <a href="oportunidades.html" class="button-primary">Explorar oportunidades</a>`;
      container.append(empty);
      return;
    }

    saved.forEach(item => {
      const card = document.createElement('article');
      card.className = 'saved-item';

      const info = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = item.title || 'Oportunidade';
      const detail = document.createElement('p');
      detail.textContent = [item.company, item.categoryLabel || item.category].filter(Boolean).join(' · ');
      info.append(title, detail);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'saved-remove';
      remove.textContent = 'Remover';
      remove.setAttribute('aria-label', `Remover ${item.title || 'oportunidade'} dos salvos`);
      remove.addEventListener('click', () => {
        AP.setSaved(user.id, AP.getSaved(user.id).filter(entry => entry.id !== item.id));
        updateSaved();
      });

      card.append(info, remove);
      container.append(card);
    });
  }

  profileForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = $('profileName').value.trim().replace(/\s+/g, ' ');
    const email = $('profileEmail').value.trim().toLowerCase();
    const area = $('profileArea').value;
    const fail = text => AP.showMessage(message, text, 'error');

    if (name.length < 3) return fail('Informe seu nome completo.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Informe um e-mail válido.');

    const users = AP.getUsers();
    if (users.some(other => other.id !== user.id && other.email === email)) {
      return fail('Esse e-mail já está em uso por outra conta.');
    }

    Object.assign(user, { name, email, area });
    AP.saveUsers(users.map(item => (item.id === user.id ? user : item)));
    updateProfile();
    AP.showMessage(message, 'Perfil atualizado com sucesso!', 'success');
  });

  $('logoutButton')?.addEventListener('click', () => {
    AP.logout();
    location.href = 'login.html?saiu=1';
  });

  $('availableCount').textContent = Number(AP.store.get(localStorage, AP.KEYS.count)) || 6;

  updateProfile();
  updateSaved();
});
