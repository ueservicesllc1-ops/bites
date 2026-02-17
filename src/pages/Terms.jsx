import { useLanguage } from '../context/LanguageContext';

const Terms = () => {
    const { language } = useLanguage();

    const sectionsEs = [
        {
            title: "1. Aceptación de los Términos",
            text: "Al acceder y utilizar el sitio web de Bites Creative Labs, usted acepta estar obligado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte, por favor no utilice nuestros servicios."
        },
        {
            title: "2. Productos Personalizados",
            text: "Como empresa de diseño y personalización (sublimación, bordados, grabado láser), nos esforzamos por garantizar la satisfacción del cliente. Sin embargo, debido a la naturaleza personalizada de nuestros productos:",
            list: [
                "No se aceptan devoluciones de productos personalizados a menos que haya un defecto de fabricación o error nuestro.",
                "Es responsabilidad del cliente verificar los diseños y detalles aprobados antes de la producción."
            ]
        },
        {
            title: "3. Propiedad Intelectual",
            text: "Todo el contenido de este sitio, incluyendo logotipos, diseños, textos y gráficos, es propiedad de Bites Creative Labs y está protegido por las leyes de propiedad intelectual."
        },
        {
            title: "4. Pedidos y Pagos",
            text: "Nos reservamos el derecho de rechazar cualquier pedido. Los precios están sujetos a cambios sin previo aviso. El pago completo o un depósito acordado puede ser necesario antes de iniciar trabajos personalizados grandes."
        },
        {
            title: "5. Limitación de Responsabilidad",
            text: "Bites Creative Labs no será responsable de daños indirectos, incidentales o consecuentes que resulten del uso de nuestros productos o servicios."
        }
    ];

    const sectionsEn = [
        {
            title: "1. Acceptance of Terms",
            text: "By accessing and using the Bites Creative Labs website, you agree to be bound by these Terms and Conditions. If you do not agree with any part, please do not use our services."
        },
        {
            title: "2. Custom Products",
            text: "As a design and customization company (sublimation, embroidery, laser engraving), we strive to ensure customer satisfaction. However, due to the personalized nature of our products:",
            list: [
                "Returns of custom products are not accepted unless there is a manufacturing defect or error on our part.",
                "It is the customer's responsibility to verify approved designs and details prior to production."
            ]
        },
        {
            title: "3. Intellectual Property",
            text: "All content on this site, including logos, designs, text, and graphics, is the property of Bites Creative Labs and is protected by intellectual property laws."
        },
        {
            title: "4. Orders and Payments",
            text: "We reserve the right to refuse any order. Prices are subject to change without notice. Full payment or an agreed deposit may be required before starting large custom jobs."
        },
        {
            title: "5. Limitation of Liability",
            text: "Bites Creative Labs shall not be liable for indirect, incidental, or consequential damages resulting from the use of our products or services."
        }
    ];

    const content = {
        es: { title: "Términos y Condiciones", lastUpdate: "Última actualización: 2/17/2026", sections: sectionsEs },
        en: { title: "Terms and Conditions", lastUpdate: "Last updated: 2/17/2026", sections: sectionsEn }
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

export default Terms;
