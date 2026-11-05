import { Link } from 'react-router-dom';

const areas = [
  {
    icon: '⌘',
    label: 'TECNOLOGIA',
    title: 'Tecnologia e informática',
    description:
      'Explore conteúdos de informática básica, ferramentas digitais, programação, segurança na internet e desenvolvimento de habilidades tecnológicas.'
  },
  {
    icon: '▤',
    label: 'GESTÃO',
    title: 'Administração e negócios',
    description:
      'Conheça temas relacionados a rotinas administrativas, empreendedorismo, organização, atendimento ao cliente e gestão.'
  },
  {
    icon: '✧',
    label: 'DESENVOLVIMENTO',
    title: 'Habilidades profissionais',
    description:
      'Desenvolva comunicação, trabalho em equipe, organização, preparação para entrevistas e outras competências profissionais.'
  },
  {
    icon: '◈',
    label: 'COMUNICAÇÃO',
    title: 'Marketing e comunicação',
    description:
      'Descubra fundamentos de marketing digital, produção de conteúdo, redes sociais e comunicação para projetos e negócios.'
  }
];

export default function Courses() {
  return (
    <main className="dedicated-page">

      <section className="dedicated-hero">

        <span className="tag">
          APRENDA E DESENVOLVA-SE
        </span>

        <h1>
          Conhecimento para abrir
          <span> novos caminhos.</span>
        </h1>

        <p>
          Explore áreas de aprendizagem, desenvolva
          competências e encontre oportunidades de
          capacitação para sua jornada profissional.
        </p>

        <Link
          to="/oportunidades?categoria=curso"
          className="button-primary"
        >
          Ver cursos disponíveis
        </Link>

      </section>

      <section className="dedicated-content">

        <div className="section-heading">

          <span className="tag">
            ÁREAS DE APRENDIZAGEM
          </span>

          <h2>
            Escolha onde quer evoluir.
          </h2>

          <p>
            Estas áreas ajudam a organizar os temas
            de formação. A disponibilidade de cursos
            deve ser consultada na listagem de oportunidades.
          </p>

        </div>

        <div className="learning-grid">

          {areas.map(area => (
            <article
              className="learning-card"
              key={area.title}
            >

              <span className="learning-icon">
                {area.icon}
              </span>

              <span className="opportunity-type">
                {area.label}
              </span>

              <h3>{area.title}</h3>

              <p>{area.description}</p>

              <Link to="/oportunidades?categoria=curso">
                Consultar oportunidades →
              </Link>

            </article>
          ))}

        </div>

        <div className="learning-cta">

          <div>

            <span className="tag">
              SEU PRÓXIMO PASSO
            </span>

            <h2>
              Transforme conhecimento em oportunidade.
            </h2>

            <p>
              Consulte a lista de cursos cadastrados
              e encontre opções para continuar aprendendo.
            </p>

          </div>

          <Link
            to="/oportunidades?categoria=curso"
            className="button-primary"
          >
            Explorar cursos
          </Link>

        </div>

        <p className="section-note">
          As áreas apresentadas são categorias informativas.
          Elas não representam, por si só, cursos ativos
          ou inscrições abertas.
        </p>

      </section>

    </main>
  );
}