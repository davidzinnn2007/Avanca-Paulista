/**
 * Campo de busca reutilizável.
 *
 * Props:
 * - value: texto atual da busca
 * - onChange(texto): chamado a cada alteração
 * - placeholder: texto de apoio do campo
 * - ariaLabel: rótulo acessível
 * - variant: 'opportunities' (barra com botão) ou 'community' (campo com botão limpar)
 */
export default function SearchBox({
  value,
  onChange,
  placeholder = 'Buscar...',
  ariaLabel = 'Buscar',
  variant = 'opportunities'
}) {
  if (variant === 'community') {
    return (
      <label className="community-search">
        <span aria-hidden="true">⌕</span>
        <input
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
        <button type="button" onClick={() => onChange('')} aria-label="Limpar busca">×</button>
      </label>
    );
  }

  return (
    <div className="search-box">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      <button type="button" onClick={() => onChange(value.trim())}>Pesquisar</button>
    </div>
  );
}
