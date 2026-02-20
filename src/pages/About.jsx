import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { language } = useLanguage();

  const content = {
    es: {
      title: "Nuestra Historia",
      subtitle: "Desde 2008 transformando ideas en realidad.",
      sections: [
        {
          title: "Orígenes",
          text: "Nuestra historia comenzó en el año 2008 en Ecuador, como una empresa familiar dedicada a la sublimación, bordados y servicios publicitarios. Desde el principio, nos impulsó la pasión por ofrecer productos personalizados de alta calidad que ayudaran a las marcas a destacar."
        },
        {
          title: "Expansión Internacional",
          text: "Tras años de experiencia y crecimiento, decidimos llevar nuestra visión más allá de las fronteras. Hace 3 años, establecimos nuestra presencia en New Jersey, Estados Unidos, trayendo con nosotros la dedicación y el arte que nos caracteriza."
        },
        {
          title: "La Esencia de Bites Creative Labs",
          text: "Bites Creative Labs nace de la pasión por el servicio, el branding y el marketing estratégico. No solo imprimimos o bordamos logos; ayudamos a construir identidades visuales memorables. Nuestra misión es potenciar tu marca a través de productos promocionales y textiles que hablen por sí mismos.",
          highlight: true
        }
      ]
    },
    en: {
      title: "Our History",
      subtitle: "Transforming ideas into reality since 2008.",
      sections: [
        {
          title: "Origins",
          text: "Our story began in 2008 in Ecuador, as a family business dedicated to sublimation, embroidery, and advertising services. From the beginning, we were driven by a passion to offer high-quality personalized products that helped brands stand out."
        },
        {
          title: "International Expansion",
          text: "After years of experience and growth, we decided to take our vision beyond borders. 3 years ago, we established our presence in New Jersey, United States, bringing with us the dedication and art that characterizes us."
        },
        {
          title: "The Essence of Bites Creative Labs",
          text: "Bites Creative Labs was born from a passion for service, branding, and strategic marketing. We don't just print or embroider logos; we help build memorable visual identities. Our mission is to empower your brand through promotional and textile products that speak for themselves.",
          highlight: true
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="about-page section-padding container">
      <div className="about-hero">
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </div>

      <div className="about-content">
        {t.sections.map((section, index) => (
          <div key={index} className={`text-block ${section.highlight ? 'highlight' : ''}`}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </div>
        ))}
      </div>

      <style>{`
        .about-page {
          padding-top: calc(var(--nav-height) + 40px);
          max-width: 100%;
          margin: 0 auto;
        }

        .about-hero {
          text-align: center;
          margin-bottom: 40px;
          padding: 0 10px;
        }

        .about-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 15px;
          color: var(--secondary);
          line-height: 1.1;
        }

        .subtitle {
          font-size: 1.1rem;
          color: var(--muted-text);
          padding: 0 10px;
        }

        .about-content {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .text-block h2 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: var(--primary);
        }

        .text-block p {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--light-text);
        }

        .highlight {
          background: #f8fafc;
          padding: 30px 20px;
          border-radius: 12px;
          border-left: 5px solid var(--accent);
        }

        /* Desktop Styles */
        @media (min-width: 768px) {
          .about-page {
            max-width: 900px;
            padding-top: calc(var(--nav-height) + 60px);
          }
          
          .about-hero { margin-bottom: 60px; }
          .about-hero h1 { font-size: 3.5rem; }
          .subtitle { font-size: 1.25rem; }
          
          .text-block h2 { font-size: 1.8rem; margin-bottom: 20px; }
          .text-block p { font-size: 1.1rem; line-height: 1.8; }
          
          .highlight { padding: 40px; }
        }
      `}</style>
    </div>
  );
};

export default About;
