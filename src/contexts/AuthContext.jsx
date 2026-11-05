import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const USERS_KEY = 'avancaUsers';
const SESSION_KEY = 'avancaSession';
const PROFILE_KEY = 'avancaProfile';
const SAVED_KEY = 'avancaSavedOpportunities';

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
async function hashPassword(password) {
  if (!globalThis.crypto?.subtle) throw new Error('Abra o projeto por localhost para habilitar a proteção de senha.');
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const session = readJSON(SESSION_KEY, null) || (() => { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; } })();
    if (!session?.userId) return null;
    return readJSON(USERS_KEY, []).find(item => item.id === session.userId) || null;
  });

  useEffect(() => {
    const onStorage = () => {
      const session = readJSON(SESSION_KEY, null) || (() => { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; } })();
      setUser(session?.userId ? readJSON(USERS_KEY, []).find(item => item.id === session.userId) || null : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const register = async ({ name, email, password }) => {
    const users = readJSON(USERS_KEY, []);
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some(item => item.email === normalizedEmail)) throw new Error('Este e-mail já possui cadastro. Faça login.');
    const created = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, passwordHash: await hashPassword(password), area: '' };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, created]));
    return created;
  };

  const login = async (email, password, remember = true) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = readJSON(USERS_KEY, []).find(item => item.email === normalizedEmail);
    if (!found || found.passwordHash !== await hashPassword(password)) throw new Error('E-mail ou senha incorretos. Verifique seus dados.');
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify({ userId: found.id }));
    localStorage.removeItem(SESSION_KEY);
    if (!remember) sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: found.id }));
    else localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: found.id }));
    setUser(found);
    return found;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    const users = readJSON(USERS_KEY, []).map(item => item.id === user.id ? { ...item, ...updates } : item);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const updated = users.find(item => item.id === user.id);
    setUser(updated);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  };

  const resetPassword = async (email, password) => {
    const users = readJSON(USERS_KEY, []);
    const index = users.findIndex(item => item.email === email.trim().toLowerCase());
    if (index < 0) throw new Error('Não encontramos uma conta com esse e-mail.');
    users[index].passwordHash = await hashPassword(password);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const value = useMemo(() => ({ user, register, login, logout, updateProfile, resetPassword }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
export const readLocal = (key, fallback = []) => readJSON(key, fallback);
export const writeLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const SAVED_KEY_NAME = SAVED_KEY;
