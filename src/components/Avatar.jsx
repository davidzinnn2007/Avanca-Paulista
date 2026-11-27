import { initials } from '../utils/format';

/**
 * Avatar com as iniciais do nome.
 *
 * Props:
 * - name: nome da pessoa
 * - small: usa a versão reduzida (comentários)
 */
export default function Avatar({ name, small = false }) {
  return (
    <div className={`community-avatar${small ? ' small' : ''}`}>{initials(name)}</div>
  );
}
