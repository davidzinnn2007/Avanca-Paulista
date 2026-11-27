/**
 * Barra de filtros em botões (uma opção ativa por vez).
 *
 * Props:
 * - options: lista de { key, label }
 * - value: key da opção ativa
 * - onChange(key): chamado ao escolher uma opção
 */
export default function FilterBar({ options, value, onChange }) {
  return (
    <div className="filter-buttons">
      {options.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`filter-button ${value === key ? 'active' : ''}`}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
