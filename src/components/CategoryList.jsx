const ICONS = {
  Todos: '◈',
  Empregos: '▣',
  Estágios: '⌁',
  Educação: '▤',
  Tecnologia: '⌘',
  Empreendedorismo: '↗'
};

/**
 * Lista lateral de assuntos com contador de publicações.
 *
 * Props:
 * - categories: lista de nomes de categoria
 * - value: categoria ativa
 * - counts: objeto { categoria: quantidade }
 * - onChange(categoria): chamado ao escolher uma categoria
 */
export default function CategoryList({ categories, value, counts, onChange }) {
  return (
    <div className="community-categories">
      {categories.map(item => (
        <button key={item} className={value === item ? 'active' : ''} onClick={() => onChange(item)}>
          <span>{ICONS[item] || '◎'}</span>
          {item}
          <small>{counts[item] || 0}</small>
        </button>
      ))}
    </div>
  );
}
