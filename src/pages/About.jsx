const About = () => {
    return (
        <div className="about-page section-padding container">
            <div className="about-hero">
                <h1>Nuestra Historia</h1>
                <p className="subtitle">Desde 2008 transformando ideas en realidad.</p>
            </div>

            <div className="about-content">
                <div className="text-block">
                    <h2>Orígenes</h2>
                    <p>
                        Nuestra historia comenzó en el año <strong>2008</strong> en Ecuador, como una empresa familiar dedicada a la sublimación, bordados y servicios publicitarios. Desde el principio, nos impulsó la pasión por ofrecer productos personalizados de alta calidad que ayudaran a las marcas a destacar.
                    </p>
                </div>

                <div className="text-block">
                    <h2>Expansión Internacional</h2>
                    <p>
                        Tras años de experiencia y crecimiento, decidimos llevar nuestra visión más allá de las fronteras. Hace 3 años, establecimos nuestra presencia en <strong>New Jersey, Estados Unidos</strong>, trayendo con nosotros la dedicación y el arte que nos caracteriza.
                    </p>
                </div>

                <div className="text-block highlight">
                    <h2>La Esencia de Bites Creative Labs</h2>
                    <p>
                        Bites Creative Labs nace de la pasión por el servicio, el branding y el marketing estratégico. No solo imprimimos o bordamos logos; ayudamos a construir identidades visuales memorables. Nuestra misión es potenciar tu marca a través de productos promocionales y textiles que hablen por sí mismos.
                    </p>
                </div>
            </div>

            <style>{`
        .about-page {
          padding-top: calc(var(--nav-height) + 60px);
          max-width: 900px;
        }

        .about-hero {
          text-align: center;
          margin-bottom: 60px;
        }

        .about-hero h1 {
          font-size: 3rem;
          margin-bottom: 15px;
          color: var(--secondary);
        }

        .subtitle {
          font-size: 1.25rem;
          color: var(--muted-text);
        }

        .about-content {
          display: flex;
          flex-direction: column;
          gap: 50px;
        }

        .text-block h2 {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: var(--primary);
        }

        .text-block p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--light-text);
        }

        .highlight {
          background: #f8fafc;
          padding: 40px;
          border-radius: 12px;
          border-left: 5px solid var(--accent);
        }

        @media (max-width: 768px) {
          .about-hero h1 { font-size: 2.5rem; }
        }
      `}</style>
        </div>
    );
};

export default About;
