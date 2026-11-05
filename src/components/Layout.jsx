import {
  Link,
  NavLink,
  useNavigate
} from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const leave = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner">

        <Link
          to="/"
          className="logo"
          aria-label="AVANÇA PAULISTA, início"
        >
          <img
            src="/assets/logo-avanca-paulista.png"
            alt="AVANÇA PAULISTA"
            className="brand-mark"
          />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setOpen(value => !value)}
          aria-label="Alternar menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? 'open' : ''}`}>

          <NavLink
            to="/"
            end
            onClick={() => setOpen(false)}
          >
            Início
          </NavLink>

          <NavLink
            to="/oportunidades"
            onClick={() => setOpen(false)}
          >
            Oportunidades
          </NavLink>

          <NavLink
            to="/cursos"
            onClick={() => setOpen(false)}
          >
            Cursos
          </NavLink>

          <NavLink
            to="/sobre"
            onClick={() => setOpen(false)}
          >
            Sobre
          </NavLink>

        </nav>

        <div className="header-actions">

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Ativar tema ${
              theme === 'light' ? 'escuro' : 'claro'
            }`}
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>

          {user ? (
            <>
              <Link
                className="login-link"
                to="/dashboard"
              >
                Minha área
              </Link>

              <button
                className="button-primary header-logout"
                onClick={leave}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                className="login-link"
                to="/login"
              >
                Entrar
              </Link>

              <Link
                className="button-primary"
                to="/cadastro"
              >
                Criar conta
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">

      <img
        src="/assets/logo-avanca-paulista.png"
        alt="AVANÇA PAULISTA"
        className="brand-mark"
      />

      <p>
        © {new Date().getFullYear()} AVANÇA PAULISTA.
        Projeto independente e demonstrativo.
      </p>

    </footer>
  );
}

export function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}