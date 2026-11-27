/**
 * Formulário para criar ou editar uma publicação.
 *
 * Props:
 * - editing: true quando está editando uma publicação existente
 * - title, body, category: valores atuais dos campos
 * - categories: categorias disponíveis para escolha
 * - onTitleChange, onBodyChange, onCategoryChange: atualizam os campos
 * - onSubmit(event): envia o formulário
 * - onClose(): fecha e limpa o formulário
 */
export default function PostComposer({
  editing,
  title,
  body,
  category,
  categories,
  onTitleChange,
  onBodyChange,
  onCategoryChange,
  onSubmit,
  onClose
}) {
  return (
    <form className="community-composer" onSubmit={onSubmit}>
      <div className="community-composer-heading">
        <div>
          <span className="community-kicker">SUA VOZ NA COMUNIDADE</span>
          <h3>{editing ? 'Editar publicação' : 'Criar uma publicação'}</h3>
        </div>
        <button type="button" className="community-close" onClick={onClose}>×</button>
      </div>

      <label htmlFor="community-title">Título</label>
      <input
        id="community-title"
        value={title}
        onChange={event => onTitleChange(event.target.value)}
        maxLength={100}
        placeholder="Ex.: Como me preparar para uma entrevista?"
        required
      />

      <label htmlFor="community-category">Categoria</label>
      <select id="community-category" value={category} onChange={event => onCategoryChange(event.target.value)}>
        {categories.map(item => <option key={item}>{item}</option>)}
      </select>

      <label htmlFor="community-body">Mensagem</label>
      <textarea
        id="community-body"
        value={body}
        onChange={event => onBodyChange(event.target.value)}
        rows={5}
        maxLength={3000}
        placeholder="Compartilhe sua dúvida, experiência ou ideia..."
        required
      />

      <div className="community-form-footer">
        <span>{body.length}/3000 caracteres</span>
        <button className="community-primary-button" type="submit">
          {editing ? 'Salvar alterações' : 'Publicar'}
        </button>
      </div>
    </form>
  );
}
