import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const POSTS_KEY = 'avancaCommunityPosts';
const REPORTS_KEY = 'avancaCommunityReports';
const CATEGORIES = ['Todos', 'Empregos', 'Estágios', 'Educação', 'Tecnologia', 'Empreendedorismo', 'Networking'];

function readPosts() {
  try {
    const value = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Agora';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
}

function initials(name = 'Comunidade') {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(readPosts);
  const [category, setCategory] = useState('Todos');
  const [tab, setTab] = useState('recentes');
  const [query, setQuery] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [newCategory, setNewCategory] = useState('Empregos');
  const [activeComments, setActiveComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const sync = () => setPosts(readPosts());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const persist = (next) => {
    setPosts(next);
    localStorage.setItem(POSTS_KEY, JSON.stringify(next));
  };

  const visiblePosts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    let result = posts.filter(post => category === 'Todos' || post.category === category);
    if (tab === 'minhas') result = result.filter(post => user && post.authorId === user.id);
    if (normalized) result = result.filter(post => `${post.title} ${post.content} ${post.authorName} ${post.category}`.toLocaleLowerCase('pt-BR').includes(normalized));
    return [...result].sort((a, b) => tab === 'populares'
      ? (b.likes?.length || 0) - (a.likes?.length || 0) || new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, category, tab, query, user]);

  const requireLogin = (action) => {
    if (user) return true;
    navigate(`/login?next=${encodeURIComponent('/comunidade')}`);
    setNotice(`Entre na sua conta para ${action}.`);
    return false;
  };

  const submitPost = (event) => {
    event.preventDefault();
    if (!requireLogin('publicar')) return;
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (cleanTitle.length < 5 || cleanBody.length < 15) {
      setNotice('Use um título com pelo menos 5 caracteres e uma mensagem com pelo menos 15.');
      return;
    }
    if (editingId) {
      const next = posts.map(post => post.id === editingId && post.authorId === user.id
        ? { ...post, title: cleanTitle, content: cleanBody, category: newCategory, updatedAt: new Date().toISOString() }
        : post);
      persist(next);
      setNotice('Publicação atualizada.');
    } else {
      const post = {
        id: crypto.randomUUID(), title: cleanTitle, content: cleanBody, category: newCategory,
        authorId: user.id, authorName: user.name || 'Usuário', createdAt: new Date().toISOString(),
        likes: [], comments: []
      };
      persist([post, ...posts]);
      setNotice('Sua publicação foi criada.');
      setTab('recentes');
      setCategory('Todos');
      setQuery('');
    }
    setTitle(''); setBody(''); setNewCategory('Empregos'); setEditingId(null); setComposerOpen(false);
  };

  const startEdit = (post) => {
    setEditingId(post.id); setTitle(post.title); setBody(post.content); setNewCategory(post.category);
    setComposerOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePost = (post) => {
    if (!user || post.authorId !== user.id) return;
    if (!window.confirm('Excluir esta publicação e seus comentários?')) return;
    persist(posts.filter(item => item.id !== post.id));
    setNotice('Publicação excluída.');
  };

  const toggleLike = (post) => {
    if (!requireLogin('curtir')) return;
    persist(posts.map(item => item.id !== post.id ? item : {
      ...item,
      likes: item.likes?.includes(user.id) ? item.likes.filter(id => id !== user.id) : [...(item.likes || []), user.id]
    }));
  };

  const addComment = (event, post) => {
    event.preventDefault();
    if (!requireLogin('comentar')) return;
    const content = (commentDrafts[post.id] || '').trim();
    if (!content) return;
    persist(posts.map(item => item.id !== post.id ? item : {
      ...item,
      comments: [...(item.comments || []), { id: crypto.randomUUID(), authorId: user.id, authorName: user.name || 'Usuário', content, createdAt: new Date().toISOString() }]
    }));
    setCommentDrafts(current => ({ ...current, [post.id]: '' }));
  };

  const reportPost = (post) => {
    if (!requireLogin('denunciar conteúdo')) return;
    const reports = (() => { try { return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]'); } catch { return []; } })();
    if (reports.some(report => report.postId === post.id && report.reporterId === user.id)) {
      setNotice('Você já denunciou esta publicação.'); return;
    }
    localStorage.setItem(REPORTS_KEY, JSON.stringify([...reports, { id: crypto.randomUUID(), postId: post.id, reporterId: user.id, createdAt: new Date().toISOString() }]));
    setNotice('Denúncia registrada neste navegador. A análise por moderação depende de um backend.');
  };

  return (
    <main className="community-page">
      <section className="community-hero">
        <div className="community-hero-inner">
          <span className="community-eyebrow">COMUNIDADE AVANÇA</span>
          <h1>Ideias que conectam.<br /><span>Oportunidades que avançam.</span></h1>
          <p>Um espaço para compartilhar experiências, fazer perguntas e aprender com pessoas que também estão construindo seus caminhos.</p>
          <button className="community-hero-button" onClick={() => user ? (setComposerOpen(true), setNotice('')) : navigate('/login?next=%2Fcomunidade')}>
            <span aria-hidden="true">＋</span> Criar publicação
          </button>
        </div>
        <div className="community-hero-mark" aria-hidden="true">A+</div>
      </section>

      <section className="community-content">
        <div className="community-heading-row">
          <div><span className="community-kicker">TROCA DE CONHECIMENTO</span><h2>Converse com a comunidade</h2><p>Encontre discussões ou comece uma nova conversa.</p></div>
          <div className="community-total"><strong>{posts.length}</strong><span>{posts.length === 1 ? 'publicação' : 'publicações'}</span></div>
        </div>

        {notice && <div className="community-notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Fechar aviso">×</button></div>}

        {composerOpen && (
          <form className="community-composer" onSubmit={submitPost}>
            <div className="community-composer-heading"><div><span className="community-kicker">SUA VOZ NA COMUNIDADE</span><h3>{editingId ? 'Editar publicação' : 'Criar uma publicação'}</h3></div><button type="button" className="community-close" onClick={() => { setComposerOpen(false); setEditingId(null); setTitle(''); setBody(''); }}>×</button></div>
            <label htmlFor="community-title">Título</label>
            <input id="community-title" value={title} onChange={event => setTitle(event.target.value)} maxLength={100} placeholder="Ex.: Como me preparar para uma entrevista?" required />
            <label htmlFor="community-category">Categoria</label>
            <select id="community-category" value={newCategory} onChange={event => setNewCategory(event.target.value)}>{CATEGORIES.filter(item => item !== 'Todos').map(item => <option key={item}>{item}</option>)}</select>
            <label htmlFor="community-body">Mensagem</label>
            <textarea id="community-body" value={body} onChange={event => setBody(event.target.value)} rows={5} maxLength={3000} placeholder="Compartilhe sua dúvida, experiência ou ideia..." required />
            <div className="community-form-footer"><span>{body.length}/3000 caracteres</span><button className="community-primary-button" type="submit">{editingId ? 'Salvar alterações' : 'Publicar'}</button></div>
          </form>
        )}

        <div className="community-toolbar">
          <div className="community-tabs" role="tablist" aria-label="Ordenar publicações">
            <button className={tab === 'recentes' ? 'active' : ''} onClick={() => setTab('recentes')} role="tab" aria-selected={tab === 'recentes'}>Recentes</button>
            <button className={tab === 'populares' ? 'active' : ''} onClick={() => setTab('populares')} role="tab" aria-selected={tab === 'populares'}>Populares</button>
            <button className={tab === 'minhas' ? 'active' : ''} onClick={() => user ? setTab('minhas') : navigate('/login?next=%2Fcomunidade')} role="tab" aria-selected={tab === 'minhas'}>Minhas publicações</button>
          </div>
          <label className="community-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar discussões..." aria-label="Buscar discussões" /><button type="button" onClick={() => setQuery('')} aria-label="Limpar busca">×</button></label>
        </div>

        <div className="community-layout">
          <aside className="community-sidebar">
            <h3>Assuntos</h3>
            <div className="community-categories">{CATEGORIES.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}><span>{item === 'Todos' ? '◈' : item === 'Empregos' ? '▣' : item === 'Estágios' ? '⌁' : item === 'Educação' ? '▤' : item === 'Tecnologia' ? '⌘' : item === 'Empreendedorismo' ? '↗' : '◎'}</span>{item}<small>{item === 'Todos' ? posts.length : posts.filter(post => post.category === item).length}</small></button>)}</div>
            <div className="community-guideline"><strong>Um espaço para todos</strong><p>Respeite as pessoas, compartilhe informações úteis e não publique dados pessoais ou conteúdos ofensivos.</p></div>
          </aside>

          <div className="community-feed">
            <div className="community-feed-heading"><h3>{tab === 'minhas' ? 'Minhas publicações' : tab === 'populares' ? 'Em destaque' : 'Discussões recentes'}</h3><span>{visiblePosts.length} {visiblePosts.length === 1 ? 'resultado' : 'resultados'}</span></div>
            {visiblePosts.length === 0 ? (
              <div className="community-empty"><div className="community-empty-icon">✳</div><h3>{posts.length === 0 ? 'A comunidade começa com você.' : 'Nenhuma discussão encontrada.'}</h3><p>{posts.length === 0 ? 'Ainda não há publicações. Compartilhe uma dúvida ou experiência para iniciar a conversa.' : 'Experimente outra busca ou categoria, ou seja a primeira pessoa a iniciar uma conversa por aqui.'}</p><button className="community-primary-button" onClick={() => user ? setComposerOpen(true) : navigate('/login?next=%2Fcomunidade')}>Criar primeira publicação</button></div>
            ) : visiblePosts.map(post => {
              const liked = Boolean(user && post.likes?.includes(user.id));
              const ownPost = Boolean(user && post.authorId === user.id);
              const commentsOpen = Boolean(activeComments[post.id]);
              return (
                <article className="community-post" key={post.id}>
                  <div className="community-post-top"><div className="community-author"><div className="community-avatar">{initials(post.authorName)}</div><div><strong>{post.authorName}</strong><span>{formatDate(post.createdAt)}{post.updatedAt ? ' · editado' : ''}</span></div></div><div className="community-post-menu"><span className="community-category-tag">{post.category}</span><button title="Denunciar publicação" aria-label="Denunciar publicação" onClick={() => reportPost(post)}>•••</button></div></div>
                  <h4>{post.title}</h4><p className="community-post-text">{post.content}</p>
                  <div className="community-post-actions"><button className={liked ? 'liked' : ''} onClick={() => toggleLike(post)} aria-pressed={liked}><span aria-hidden="true">♥</span> {post.likes?.length || 0} Curtir</button><button onClick={() => setActiveComments(current => ({ ...current, [post.id]: !current[post.id] }))}><span aria-hidden="true">▢</span> {post.comments?.length || 0} Comentários</button>{ownPost && <><button onClick={() => startEdit(post)}>Editar</button><button className="community-delete" onClick={() => deletePost(post)}>Excluir</button></>}</div>
                  {commentsOpen && <div className="community-comments"><div className="community-comments-list">{(post.comments || []).length === 0 ? <p className="community-no-comments">Ainda não há comentários. Comece a conversa.</p> : post.comments.map(comment => <div className="community-comment" key={comment.id}><div className="community-avatar small">{initials(comment.authorName)}</div><div><strong>{comment.authorName} <span>{formatDate(comment.createdAt)}</span></strong><p>{comment.content}</p></div></div>)}</div><form className="community-comment-form" onSubmit={event => addComment(event, post)}><input value={commentDrafts[post.id] || ''} onChange={event => setCommentDrafts(current => ({ ...current, [post.id]: event.target.value }))} placeholder={user ? 'Escreva um comentário...' : 'Entre para comentar'} aria-label="Escreva um comentário" /><button type="submit" disabled={!commentDrafts[post.id]?.trim()}>Enviar</button></form></div>}
                </article>
              );
            })}
          </div>
        </div>
        <p className="community-demo-note">Versão demonstrativa: publicações e interações ficam armazenadas neste navegador. Para compartilhar conteúdo entre diferentes usuários e dispositivos, será necessária uma API com banco de dados e moderação no servidor.</p>
      </section>
    </main>
  );
}
