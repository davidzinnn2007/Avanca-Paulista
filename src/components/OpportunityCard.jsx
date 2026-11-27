const TYPE_CLASS = { estagio: 'internship', curso: 'course' };

/**
 * Cartão de uma oportunidade (vaga, estágio, curso ou conteúdo).
 *
 * Props:
 * - item: { id, category, label, location, title, company, description, details[] }
 * - saved: se a oportunidade já foi salva pelo usuário
 * - onToggleSave(item): salva ou remove a oportunidade
 */
export default function OpportunityCard({ item, saved, onToggleSave }) {
  return (
    <article className="opportunity-item">
      <div className="opportunity-top">
        <span className={`opportunity-type ${TYPE_CLASS[item.category] || ''}`}>{item.label}</span>
        <span className="opportunity-location">{item.location}</span>
      </div>
      <h3>{item.title}</h3>
      <p className="company-name">{item.company}</p>
      <p className="opportunity-description">{item.description}</p>
      <div className="opportunity-details">
        {item.details.map(detail => <span key={detail}>{detail}</span>)}
      </div>
      <button className="opportunity-link" onClick={() => onToggleSave(item)} aria-pressed={saved}>
        {saved ? '★ Salva · remover' : '☆ Salvar oportunidade'}
      </button>
    </article>
  );
}
