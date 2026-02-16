const PrivacyPolicy = () => {
    return (
        <div className="legal-page section-padding container">
            <h1>Política de Privacidad</h1>
            <p className="last-updated">Última actualización: {new Date().toLocaleDateString()}</p>

            <section>
                <h2>1. Introducción</h2>
                <p>En Bites Creative Labs, respetamos su privacidad y estamos comprometidos a proteger la información personal que usted nos proporciona. Esta política explica cómo recopilamos, usamos y compartimos sus datos.</p>
            </section>

            <section>
                <h2>2. Información que Recopilamos</h2>
                <p>Podemos recopilar información personal como su nombre, dirección de correo electrónico, dirección de envío y número de teléfono cuando realiza un pedido o se pone en contacto con nosotros.</p>
            </section>

            <section>
                <h2>3. Uso de la Información</h2>
                <p>Utilizamos su información para procesar pedidos, comunicarnos con usted sobre el estado de sus compras, y mejorar nuestros servicios y productos personalizados.</p>
            </section>

            <section>
                <h2>4. Seguridad de los Datos</h2>
                <p>Implementamos medidas de seguridad para proteger sus datos personales. Utilizamos servicios confiables como Firebase para el almacenamiento seguro de la información.</p>
            </section>

            <section>
                <h2>5. Contacto</h2>
                <p>Si tiene preguntas sobre esta política, por favor contáctenos a través de nuestro formulario en la página de inicio.</p>
            </section>

            <style>{`
        .legal-page {
          padding-top: calc(var(--nav-height) + 40px);
          max-width: 800px;
        }
        .legal-page h1 { margin-bottom: 10px; color: var(--secondary); }
        .last-updated { color: var(--muted-text); margin-bottom: 40px; font-style: italic; }
        section { margin-bottom: 30px; }
        h2 { font-size: 1.5rem; margin-bottom: 15px; color: var(--primary); }
        p { line-height: 1.6; color: var(--light-text); }
      `}</style>
        </div>
    );
};

export default PrivacyPolicy;
