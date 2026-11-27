import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth, readLocal, writeLocal, SAVED_KEY_NAME } from '../contexts/AuthContext';
import SearchBox from '../components/SearchBox';
import FilterBar from '../components/FilterBar';
import OpportunityCard from '../components/OpportunityCard';

const opportunities = [
{id:'op-1',category:'emprego',label:'EMPREGO',location:'Paulista - PE',title:'Assistente Administrativo',company:'Empresa demonstrativa',description:'Atuação com organização de documentos, atendimento e rotinas administrativas.',details:['Tempo integral','Ensino médio']},
{id:'op-2',category:'estagio',label:'ESTÁGIO',location:'Recife - PE',title:'Estágio em Tecnologia',company:'Empresa demonstrativa',description:'Vaga para estudantes interessados em desenvolvimento, tecnologia e inovação.',details:['Meio período','Estudantes']},
{id:'op-3',category:'curso',label:'CURSO',location:'Online',title:'Introdução à Programação',company:'Capacitação demonstrativa',description:'Aprenda lógica de programação e dê os primeiros passos na tecnologia.',details:['Online','Iniciante']},
{id:'op-4',category:'emprego',label:'EMPREGO',location:'Paulista - PE',title:'Auxiliar de Atendimento',company:'Empresa demonstrativa',description:'Atendimento ao público, suporte ao cliente e organização de atividades.',details:['Tempo integral','Ensino médio']},
{id:'op-5',category:'estagio',label:'ESTÁGIO',location:'Paulista - PE',title:'Estágio Administrativo',company:'Empresa demonstrativa',description:'Experiência em atividades administrativas e organização de processos.',details:['Meio período','Estudantes']},
{id:'op-6',category:'curso',label:'CURSO',location:'Online',title:'Marketing Digital',company:'Capacitação demonstrativa',description:'Conheça estratégias de marketing, redes sociais e divulgação de negócios.',details:['Online','Iniciante']},
{id:'op-7',category:'empreendedorismo',label:'EMPREENDEDORISMO',location:'Online',title:'Fundamentos para tirar uma ideia do papel',company:'Conteúdo demonstrativo',description:'Conceitos iniciais de planejamento, validação de ideias e organização de pequenos negócios.',details:['Online','Iniciante']}
];
const filters = [
  { key: 'todos', label: 'Todas' },
  { key: 'emprego', label: 'Empregos' },
  { key: 'estagio', label: 'Estágios' },
  { key: 'curso', label: 'Cursos' },
  { key: 'empreendedorismo', label: 'Empreendedorismo' }
];

export default function Opportunities() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const initialFilter = params.get('categoria');
  const [term, setTerm] = useState('');
  const [filter, setFilter] = useState(filters.some(({ key }) => key === initialFilter) ? initialFilter : 'todos');
  const [, refresh] = useState(0);

  const saved = readLocal(SAVED_KEY_NAME, {});
  const mine = user ? (saved[user.id] || []) : [];

  const visible = useMemo(() => {
    const normalized = term.toLocaleLowerCase('pt-BR');
    return opportunities.filter(item => (
      (filter === 'todos' || item.category === filter)
      && `${item.title} ${item.company} ${item.description} ${item.location} ${item.label}`
        .toLocaleLowerCase('pt-BR')
        .includes(normalized)
    ));
  }, [filter, term]);

  const toggleSave = (item) => {
    if (!user) {
      window.location.href = '/login?next=/oportunidades';
      return;
    }
    const next = mine.some(entry => entry.id === item.id)
      ? mine.filter(entry => entry.id !== item.id)
      : [...mine, item];
    writeLocal(SAVED_KEY_NAME, { ...saved, [user.id]: next });
    refresh(value => value + 1);
  };

  return (
    <main>
      <section className="opportunities-hero">
        <span className="tag">EXPLORE NOVOS CAMINHOS</span>
        <h1>Oportunidades para <span>ir mais longe.</span></h1>
        <p>Encontre vagas, estágios, cursos e conteúdos demonstrativos de empreendedorismo para desenvolver suas habilidades.</p>
      </section>

      <section className="opportunities-content">
        <SearchBox
          value={term}
          onChange={setTerm}
          placeholder="Pesquise por vaga, curso ou palavra-chave..."
          ariaLabel="Pesquisar oportunidades"
        />

        <div className="filter-area">
          <div>
            <strong className="filter-title">Explore por categoria</strong>
            <p>Encontre o que procura.</p>
          </div>
          <FilterBar options={filters} value={filter} onChange={setFilter} />
        </div>

        <div className="results-header">
          <h2>Oportunidades disponíveis</h2>
          <span>{visible.length} {visible.length === 1 ? 'oportunidade encontrada' : 'oportunidades encontradas'}</span>
        </div>

        <div className="opportunities-list">
          {visible.map(item => (
            <OpportunityCard
              key={item.id}
              item={item}
              saved={mine.some(entry => entry.id === item.id)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>

        {!visible.length && (
          <div className="empty-results">
            <h3>Nenhuma oportunidade encontrada.</h3>
            <p>Tente outro termo ou selecione outra categoria.</p>
          </div>
        )}
      </section>
    </main>
  );
}
