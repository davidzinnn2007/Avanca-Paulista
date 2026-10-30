/* AVANÇA PAULISTA | recuperação de senha (DEMONSTRATIVA: sem envio de e-mail) */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const AP = window.AP;
  const form = document.getElementById('recoveryForm');
  if (!AP || !form) return;

  const emailInput = document.getElementById('email');
  const passwordFields = document.getElementById('passwordFields');
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const message = document.getElementById('recoveryMessage');
  const button = document.getElementById('recoveryButton');
  let emailConfirmed = false;

  const show = (text, type = '') => {
    message.textContent = text;
    message.className = `recovery-message ${type}`;
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();

    if (!emailConfirmed) {
      const exists = AP.getUsers().some(user => String(user.email || '').toLowerCase() === email);
      if (!exists) {
        show('Não encontramos uma conta com esse e-mail. Confira o endereço ou crie uma conta.', 'error');
        return;
      }
      emailConfirmed = true;
      emailInput.readOnly = true;
      passwordFields.hidden = false;
      newPassword.required = true;
      confirmPassword.required = true;
      button.textContent = 'Salvar nova senha';
      show('Conta encontrada. Agora informe sua nova senha.', 'success');
      newPassword.focus();
      return;
    }

    if (newPassword.value.length < 8) return show('A nova senha precisa ter pelo menos 8 caracteres.', 'error');
    if (newPassword.value !== confirmPassword.value) return show('As senhas não coincidem. Confira os dois campos.', 'error');
    if (!AP.hasCrypto()) return show('Seu navegador não oferece a criptografia necessária. Abra o site por Live Server ou https.', 'error');

    const users = AP.getUsers();
    const user = users.find(item => String(item.email || '').toLowerCase() === email);
    if (!user) return show('Não foi possível localizar a conta. Tente novamente.', 'error');

    button.disabled = true;
    try {
      await AP.setPassword(user, newPassword.value);
      AP.saveUsers(users);
      show('Senha alterada! Você já pode entrar com a nova senha.', 'success');
      setTimeout(() => { location.href = 'login.html'; }, 1400);
    } catch {
      button.disabled = false;
      show('Não foi possível salvar a nova senha. Tente novamente.', 'error');
    }
  });
});
