import { useLanguage } from '../context/LanguageContext';

const ShippingPolicy = () => {
    const { language } = useLanguage();

    const content = {
        es: {
            title: "Política de Envíos y Devoluciones",
            lastUpdate: "Última actualización: 2/17/2026",
            sections: [
                {
                    title: "1. Tiempo de Procesamiento",
                    text: "Debido a la naturaleza personalizada de nuestros productos (bordados, grabados, sublimación), los tiempos de procesamiento varían según el artículo:",
                    list: [
                        "Artículos en stock: 1-3 días hábiles.",
                        "Productos personalizados: 5-10 días hábiles.",
                        "Pedidos grandes o empresariales: 2-4 semanas."
                    ]
                },
                {
                    title: "2. Métodos de Envío",
                    text: "Realizamos envíos dentro de los Estados Unidos. Los costos y tiempos de entrega se calcularán al momento de finalizar su compra."
                },
                {
                    title: "3. Devoluciones",
                    text: "Aceptamos devoluciones de productos defectuosos o dañados si se notifica dentro de los 7 días posteriores a la recepción. Los productos personalizados no son elegibles para devolución a menos que haya un defecto de fabricación."
                },
                {
                    title: "4. Costos de Envío de Devolución",
                    text: "El cliente será responsable de los costos de envío de devolución a menos que el producto sea defectuoso o haya habido un error por nuestra parte."
                }
            ]
        },
        en: {
            title: "Shipping & Returns Policy",
            lastUpdate: "Last updated: 2/17/2026",
            sections: [
                {
                    title: "1. Processing Time",
                    text: "Due to the personalized nature of our products (embroidery, engraving, sublimation), processing times vary by item:",
                    list: [
                        "In-stock items: 1-3 business days.",
                        "Custom products: 5-10 business days.",
                        "Bulk or corporate orders: 2-4 weeks."
                    ]
                },
                {
                    title: "2. Shipping Methods",
                    text: "We ship within the United States. Costs and delivery times will be calculated at checkout."
                },
                {
                    title: "3. Returns",
                    text: "We accept returns for defective or damaged products if notified within 7 days of receipt. Personalized products are not eligible for return unless there is a manufacturing defect."
                },
                {
                    title: "4. Return Shipping Costs",
                    text: "The customer is responsible for return shipping costs unless the product is defective or there was an error on our part."
                }
            ]
        }
    };

    const t = content[language];

    return (
        <div className="policy-page section-padding">
            <div className="container">
                <h1>{t.title}</h1>
                <p className="last-update">{t.lastUpdate}</p>

                <div className="policy-content">
                    {t.sections.map((section, index) => (
                        <div key={index} className="policy-section">
                            <h3>{section.title}</h3>
                            <p>{section.text}</p>
                            {section.list && (
                                <ul>
                                    {section.list.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .policy-page {
                    padding-top: 120px;
                    min-height: 80vh;
                    background: #f8fafc;
                }
                .policy-page h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    color: var(--secondary);
                }
                .last-update {
                    color: var(--muted-text);
                    margin-bottom: 40px;
                    font-style: italic;
                }
                .policy-content {
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .policy-section {
                    margin-bottom: 30px;
                }
                .policy-section h3 {
                    font-size: 1.3rem;
                    margin-bottom: 15px;
                    color: var(--primary);
                }
                .policy-section p, .policy-section li {
                    color: var(--secondary);
                    line-height: 1.6;
                    margin-bottom: 10px;
                }
                .policy-section ul {
                    padding-left: 20px;
                    margin-top: 10px;
                }
            `}</style>
        </div>
    );
};

export default ShippingPolicy;
