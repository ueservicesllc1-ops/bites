const ShippingPolicy = () => {
    return (
        <div className="legal-page section-padding container">
            <h1>Política de Envíos y Devoluciones</h1>
            <p className="last-updated">Última actualización: {new Date().toLocaleDateString()}</p>

            <section>
                <h2>1. Tiempo de Procesamiento</h2>
                <p>Debido a la naturaleza personalizada de nuestros productos (bordados, grabados, sublimación), los tiempos de procesamiento varían según el artículo:</p>
                <ul>
                    <li><strong>Artículos en stock:</strong> 1-3 días hábiles.</li>
                    <li><strong>Productos personalizados:</strong> 5-10 días hábiles.</li>
                    <li><strong>Pedidos grandes o empresariales:</strong> 2-4 semanas.</li>
                </ul>
            </section>

            <section>
                <h2>2. Métodos de Envío</h2>
                <p>Realizamos envíos dentro de los Estados Unidos. Los costos y tiempos de entrega se calcularán al momento de finalizar su compra.</p>
            </section>

            <section>
                <h2>3. Devoluciones</h2>
                <p>Aceptamos devoluciones de productos defectuosos o dañados si se notifica dentro de los 7 días posteriores a la recepción. Los productos personalizados no son elegibles para devolución a menos que haya un defecto de fabricación.</p>
            </section>

            <section>
                <h2>4. Costos de Envío de Devolución</h2>
                <p>El cliente será responsable de los costos de envío de devolución a menos que el producto sea defectuoso o haya habido un error por nuestra parte.</p>
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
          strong { font-weight: 600; color: var(--primary); }
        `}</style>
        </div>
    );
};

export default ShippingPolicy;

