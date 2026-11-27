import Avatar from './Avatar';
import CommentSection from './CommentSection';
import { formatDate } from '../utils/format';

/**
 * Cartão de uma publicação da comunidade.
 *
 * Props:
 * - post: { id, title, content, category, authorId, authorName, createdAt, updatedAt, likes[], comments[] }
 * - currentUser: usuário logado (ou null)
 * - commentsOpen: se a área de comentários está aberta
 * - commentDraft: rascunho do comentário
 * - onToggleLike(post), onToggleComments(post), onEdit(post), onDelete(post), onReport(post)
 * - onCommentDraftChange(post, texto), onCommentSubmit(event, post)
 */
export default function PostCard({
  post,
  currentUser,
  commentsOpen,
  commentDraft,
  onToggleLike,
  onToggleComments,
  onEdit,
  onDelete,
  onReport,
  onCommentDraftChange,
  onCommentSubmit
}) {
  const liked = Boolean(currentUser && post.likes?.includes(currentUser.id));
  const ownPost = Boolean(currentUser && post.authorId === currentUser.id);
  const comments = post.comments || [];

  return (
    <article className="community-post">
      <div className="community-post-top">
        <div className="community-author">
          <Avatar name={post.authorName} />
          <div>
            <strong>{post.authorName}</strong>
            <span>{formatDate(post.createdAt)}{post.updatedAt ? ' · editado' : ''}</span>
          </div>
        </div>
        <div className="community-post-menu">
          <span className="community-category-tag">{post.category}</span>
          <button title="Denunciar publicação" aria-label="Denunciar publicação" onClick={() => onReport(post)}>•••</button>
        </div>
      </div>

      <h4>{post.title}</h4>
      <p className="community-post-text">{post.content}</p>

      <div className="community-post-actions">
        <button className={liked ? 'liked' : ''} onClick={() => onToggleLike(post)} aria-pressed={liked}>
          <span aria-hidden="true">♥</span> {post.likes?.length || 0} Curtir
        </button>
        <button onClick={() => onToggleComments(post)}>
          <span aria-hidden="true">▢</span> {comments.length} Comentários
        </button>
        {ownPost && (
          <>
            <button onClick={() => onEdit(post)}>Editar</button>
            <button className="community-delete" onClick={() => onDelete(post)}>Excluir</button>
          </>
        )}
      </div>

      {commentsOpen && (
        <CommentSection
          comments={comments}
          draft={commentDraft}
          isLoggedIn={Boolean(currentUser)}
          onDraftChange={text => onCommentDraftChange(post, text)}
          onSubmit={event => onCommentSubmit(event, post)}
        />
      )}
    </article>
  );
}
