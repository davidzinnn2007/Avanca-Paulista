import Avatar from './Avatar';
import { formatDate } from '../utils/format';

/**
 * Comentários de uma publicação e formulário para comentar.
 *
 * Props:
 * - comments: lista de { id, authorName, content, createdAt }
 * - draft: texto do comentário em edição
 * - isLoggedIn: define o texto de apoio do campo
 * - onDraftChange(texto): atualiza o rascunho
 * - onSubmit(event): envia o comentário
 */
export default function CommentSection({ comments, draft, isLoggedIn, onDraftChange, onSubmit }) {
  return (
    <div className="community-comments">
      <div className="community-comments-list">
        {comments.length === 0 ? (
          <p className="community-no-comments">Ainda não há comentários. Comece a conversa.</p>
        ) : comments.map(comment => (
          <div className="community-comment" key={comment.id}>
            <Avatar name={comment.authorName} small />
            <div>
              <strong>{comment.authorName} <span>{formatDate(comment.createdAt)}</span></strong>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form className="community-comment-form" onSubmit={onSubmit}>
        <input
          value={draft}
          onChange={event => onDraftChange(event.target.value)}
          placeholder={isLoggedIn ? 'Escreva um comentário...' : 'Entre para comentar'}
          aria-label="Escreva um comentário"
        />
        <button type="submit" disabled={!draft.trim()}>Enviar</button>
      </form>
    </div>
  );
}
