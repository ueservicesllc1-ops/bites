const Terms = () => {
    return (
        <div className="legal-page section-padding container">
            <h1>Términos y Condiciones</h1>
            <p className="last-updated">Última actualización: {new Date().toLocaleDateString()}</p>

            <section>
                <h2>1. Aceptación de los Términos</h2>
                <p>Al acceder y utilizar el sitio web de Bites Creative Labs, usted acepta estar obligado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte, por favor no utilice nuestros servicios.</p>
            </section>

            <section>
                <h2>2. Productos Personalizados</h2>
                <p>Como empresa de diseño y personalización (sublimación, bordados, grabado láser), nos esforzamos por garantizar la satisfacción del cliente. Sin embargo, debido a la naturaleza personalizada de nuestros productos:</p>
                <ul>
                    <li>No se aceptan devoluciones de productos personalizados a menos que haya un defecto de fabricación o error nuestro.</li>
                    <li>Es responsabilidad del cliente verificar los diseños y detalles aprobados antes de la producción.</li>
                </ul>
            </section>

            <section>
                <h2>3. Propiedad Intelectual</h2>
                <p>Todo el contenido de este sitio, incluyendo logotipos, diseños, textos y gráficos, es propiedad de Bites Creative Labs y está protegido por las leyes de propiedad intelectual.</p>
            </section>

            <section>
                <h2>4. Pedidos y Pagos</h2>
                <p>Nos reservamos el derecho de rechazar cualquier pedido. Los precios están sujetos a cambios sin previo aviso. El pago completo o un depósito acordado puede ser necesario antes de iniciar trabajos personalizados grandes.</p>
            </section>

            <section>
                <h2>5. Limitación de Responsabilidad</h2>
                <p>Bites Creative Labs no será responsable de daños indirectos, incidentales o consecuentes que resulten del uso de nuestros productos o servicios.</p>
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
          p, li { line-height: 1.6; color: var(--light-text); }
          ul { list-style-type: disc; margin-left: 20px; }
          li { margin-bottom: 10px; }
        `}</style>
        </div>
    );
};

export default Terms;

