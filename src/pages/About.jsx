import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Encontre possibilidades',
    description:
      'Consulte oportunidades de emprego, estágio, cursos e desenvolvimento profissional.'
  },
  {
    number: '02',
    title: 'Explore seus interesses',
    description:
      'Utilize as categorias e a pesquisa para localizar conteúdos relacionados aos seus objetivos.'
  },
  {
    number: '03',
    title: 'Organize sua jornada',
    description:
      'Crie uma conta demonstrativa para salvar oportunidades e acompanhar seus interesses neste navegador.'
  }
];

export default function About() {
  return (
    <main className="dedicated-page">

      <section className="dedicated-hero about-hero">

        <span className="tag">
          SOBRE O AVANÇA PAULISTA
        </span>

        <h1>
          Informação organizada para ajudar você a
          <span> avançar.</span>
        </h1>

        <p>
          Uma plataforma digital independente criada
          para reunir e facilitar a consulta de informações
          sobre oportunidades e desenvolvimento profissional.
        </p>

        <Link
          to="/oportunidades"
          className="button-primary"
        >
          Conhecer oportunidades
        </Link>

      </section>

      <section className="dedicated-content">

        <div className="about-intro">

          <div>

            <span className="tag">
              NOSSA PROPOSTA
            </span>

            <h2>
              Conectar pessoas a novas possibilidades.
            </h2>

          </div>

          <p>
            O AVANÇA PAULISTA é um projeto acadêmico
            de desenvolvimento web. Sua proposta é organizar
            informações sobre oportunidades de trabalho,
            estágio, cursos e capacitação em uma experiência
            simples, intuitiva e acessível.
          </p>

        </div>

        <div className="about-values">

          {steps.map(step => (
            <article
              className="about-value"
              key={step.number}
            >

              <span>{step.number}</span>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </article>
          ))}

        </div>

        <section className="about-purpose">

          <span className="tag">
            NOSSO COMPROMISSO
          </span>

          <h2>
            Uma experiência clara, acessível e organizada.
          </h2>

          <p>
            O projeto busca aplicar boas práticas de
            desenvolvimento web, organização de conteúdo,
            usabilidade e responsividade. As informações
            e oportunidades de demonstração não devem ser
            interpretadas como anúncios oficiais ou como
            vínculo com órgãos públicos.
          </p>

          <Link to="/cursos" className="text-link">
            Conheça a área de cursos →
          </Link>

        </section>

      </section>

    </main>
  );
}