import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function formatCnpj(value) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function AuthShell({ eyebrow, title, description, features, children, footer }) {
  const defaultFeatures = [
    'Explore oportunidades',
    'Descubra novos cursos',
    'Desenvolva sua carreira',
  ];

  return (
    <main className="auth-container">
      <section className="welcome">
        <span className="tag">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="features">
          {(features || defaultFeatures).map((item) => (
            <div key={item}>✓ {item}</div>
          ))}
        </div>
      </section>
      <section className="form-card">
        {children}
        {footer && <div className="form-footer">{footer}</div>}
      </section>
    </main>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setBusy(true);
    try {
      await login(form.email, form.password, form.remember);
      const next = searchParams.get('next');
      const destination =
        next && next.startsWith('/') && !next.startsWith('//')
          ? next
          : '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="BEM-VINDO DE VOLTA"
      title={
        <>
          Continue construindo <span>seu futuro.</span>
        </>
      }
      description="Entre na sua conta e continue explorando oportunidades para desenvolver seu potencial."
      footer={
        <>
          Ainda não possui conta? <Link to="/cadastro">Criar conta</Link>
        </>
      }
    >
      <div className="form-header">
        <h2>Entrar na plataforma</h2>
        <p>Informe seus dados de acesso.</p>
      </div>
      <div className="demo-notice">
        <strong>Versão demonstrativa</strong>
        <span>Os dados ficam apenas neste navegador. Não use uma senha real.</span>
      </div>
      <form onSubmit={submit}>
        <div className="input-group">
          <label>E-mail</label>
          <input
            type="email"
            autoComplete="username"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="seuemail@exemplo.com"
            required
          />
        </div>
        <div className="input-group">
          <label>Senha</label>
          <input
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Digite sua senha"
            required
          />
        </div>
        <div className="login-options">
          <label className="remember">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
            />{' '}
            Lembrar de mim
          </label>
          <Link to="/recuperar-senha">Esqueceu a senha?</Link>
        </div>
        {message && (
          <p className="form-message error" role="alert">
            {message}
          </p>
        )}
        <button className="submit-button" disabled={busy}>
          {busy ? 'Entrando...' : 'Entrar →'}
        </button>
      </form>
      <p className="consent-login-link">
        Ao utilizar a plataforma, consulte nosso{' '}
        <a href="/termo-de-consentimento.html">Termo de Consentimento</a>.
      </p>
    </AuthShell>
  );
}

export function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('candidato'); // 'candidato' | 'empresa'
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    cnpj: '',
    email: '',
    password: '',
    confirm: '',
    terms: false,
  });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const isCompany = accountType === 'empresa';

  const switchAccountType = (type) => {
    setAccountType(type);
    setMessage('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');

    const cleanCnpj = form.cnpj.replace(/\D/g, '');

    if (isCompany) {
      if (form.companyName.trim().length < 2) {
        return setMessage('Informe a razão social ou nome da empresa.');
      }
      if (cleanCnpj.length !== 14) {
        return setMessage('Digite um CNPJ válido com 14 números.');
      }
    } else if (form.name.trim().length < 3) {
      return setMessage('Digite seu nome completo.');
    }

    if (form.password.length < 8) {
      return setMessage('A senha precisa ter pelo menos 8 caracteres.');
    }
    if (form.password !== form.confirm) {
      return setMessage('As senhas não coincidem.');
    }
    if (!form.terms) {
      return setMessage('Aceite os termos para continuar.');
    }

    setBusy(true);
    try {
      const payload = {
        ...form,
        accountType,
        name: isCompany ? form.companyName.trim() : form.name.trim(),
        ...(isCompany
          ? {
              companyName: form.companyName.trim(),
              cnpj: cleanCnpj,
            }
          : {}),
      };

      await register(payload);
      await login(form.email, form.password, true);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="FAÇA PARTE"
      title={
        <>
          Seu futuro começa com uma <span>nova oportunidade.</span>
        </>
      }
      description={
        isCompany
          ? 'Cadastre sua empresa para divulgar vagas, conectar-se a talentos e apoiar o desenvolvimento profissional.'
          : 'Crie sua conta e descubra oportunidades de emprego, cursos e desenvolvimento profissional.'
      }
      features={
        isCompany
          ? [
              'Divulgação de oportunidades',
              'Conexão com novos talentos',
              'Apoio ao desenvolvimento profissional',
            ]
          : undefined
      }
      footer={
        <>
          Já possui cadastro? <Link to="/login">Faça login</Link>
        </>
      }
    >
      <div className="form-header">
        <h2>{isCompany ? 'Criar conta da empresa' : 'Criar sua conta'}</h2>
        <p>
          {isCompany
            ? 'Preencha os dados da empresa para começar.'
            : 'Preencha seus dados para começar.'}
        </p>
      </div>
      <div className="demo-notice">
        <strong>Versão demonstrativa</strong>
        <span>Os dados ficam apenas neste navegador. Não use uma senha real.</span>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="account-type-switch" role="group" aria-label="Tipo de conta">
          <button
            type="button"
            className={`account-type-btn ${!isCompany ? 'is-active' : ''}`}
            onClick={() => switchAccountType('candidato')}
          >
            Candidato
          </button>
          <button
            type="button"
            className={`account-type-btn ${isCompany ? 'is-active' : ''}`}
            onClick={() => switchAccountType('empresa')}
          >
            Empresa
          </button>
        </div>

        {isCompany ? (
          <>
            <div className="input-group">
              <label>Razão social / Nome da empresa</label>
              <input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Digite o nome ou razão social da empresa"
                required
                minLength={2}
              />
            </div>

            <div className="input-group">
              <label>CNPJ</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.cnpj}
                onChange={(e) =>
                  setForm({ ...form, cnpj: formatCnpj(e.target.value) })
                }
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
          </>
        ) : (
          <div className="input-group">
            <label>Nome completo</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
              placeholder="Digite seu nome completo"
              required
              minLength={3}
            />
          </div>
        )}

        <div className="input-group">
          <label>{isCompany ? 'E-mail corporativo' : 'E-mail'}</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
            placeholder={isCompany ? 'contato@empresa.com.br' : 'seuemail@exemplo.com'}
            required
          />
        </div>

        <div className="input-group">
          <label>Senha</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
            placeholder="Mínimo de 8 caracteres"
            minLength={8}
            required
          />
        </div>

        <div className="input-group">
          <label>Confirmar senha</label>
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            autoComplete="new-password"
            placeholder="Digite sua senha novamente"
            required
          />
        </div>

        <label className="terms">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.checked })}
          />
          <span>
            Li e concordo com o{' '}
            <a
              href="/termo-de-consentimento.html"
              target="_blank"
              rel="noopener"
            >
              Termo de Consentimento
            </a>{' '}
            para tratamento de dados pessoais.
          </span>
        </label>

        {message && (
          <p className="form-message error" role="alert">
            {message}
          </p>
        )}

        <button className="submit-button" disabled={busy}>
          {busy
            ? 'Criando conta...'
            : isCompany
            ? 'Criar conta da empresa →'
            : 'Criar minha conta →'}
        </button>
      </form>
    </AuthShell>
  );
}

export function Recovery() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password.length < 8) {
      return setMessage('A senha precisa ter pelo menos 8 caracteres.');
    }
    if (password !== confirm) {
      return setMessage('As senhas não coincidem.');
    }
    try {
      await resetPassword(email, password);
      navigate('/login?senha=alterada', { replace: true });
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <AuthShell
      eyebrow="RECUPERAR ACESSO"
      title={
        <>
          Vamos recuperar seu <span>acesso.</span>
        </>
      }
      description="Informe o e-mail cadastrado e escolha uma nova senha."
      footer={<Link to="/login">Voltar para entrar</Link>}
    >
      <div className="form-header">
        <h2>Redefinir senha</h2>
        <p>Preencha os campos abaixo.</p>
      </div>
      <form onSubmit={submit}>
        <div className="input-group">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Nova senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <div className="input-group">
          <label>Confirmar nova senha</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        {message && <p className="form-message error">{message}</p>}
        <button className="submit-button">Salvar nova senha →</button>
      </form>
    </AuthShell>
  );
}