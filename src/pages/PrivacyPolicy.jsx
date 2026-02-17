import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
    const { language } = useLanguage();

    const sectionsEs = [
        {
            title: "1. Introducción",
            text: "En Bites Creative Labs, respetamos su privacidad y estamos comprometidos a proteger la información personal que usted nos proporciona. Esta política explica cómo recopilamos, usamos y compartimos sus datos."
        },
        {
            title: "2. Información que Recopilamos",
            text: "Podemos recopilar información personal como su nombre, dirección de correo electrónico, dirección de envío y número de teléfono cuando realiza un pedido o se pone en contacto con nosotros."
        },
        {
            title: "3. Uso de la Información",
            text: "Utilizamos su información para procesar pedidos, comunicarnos con usted sobre el estado de sus compras, y mejorar nuestros servicios y productos personalizados."
        },
        {
            title: "4. Seguridad de los Datos",
            text: "Implementamos medidas de seguridad para proteger sus datos personales. Utilizamos servicios confiables como Firebase para el almacenamiento seguro de la información."
        },
        {
            title: "5. Contacto",
            text: "Si tiene preguntas sobre esta política, por favor contáctenos a través de nuestro formulario en la página de inicio."
        }
    ];

    const sectionsEn = [
        {
            title: "1. Introduction",
            text: "At Bites Creative Labs, we respect your privacy and are committed to protecting the personal information you provide to us. This policy explains how we collect, use, and share your data."
        },
        {
            title: "2. Information We Collect",
            text: "We may collect personal information such as your name, email address, shipping address, and phone number when you place an order or contact us."
        },
        {
            title: "3. Use of Information",
            text: "We use your information to process orders, communicate with you about the status of your purchases, and improve our services and personalized products."
        },
        {
            title: "4. Data Security",
            text: "We implement security measures to protect your personal data. We use trusted services like Firebase for secure information storage."
        },
        {
            title: "5. Contact",
            text: "If you have questions about this policy, please contact us through our form on the home page."
        }
    ];

    const content = {
        es: { title: "Política de Privacidad", lastUpdate: "Última actualización: 2/17/2026", sections: sectionsEs },
        en: { title: "Privacy Policy", lastUpdate: "Last updated: 2/17/2026", sections: sectionsEn }
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
                .policy-section p {
                    color: var(--secondary);
                    line-height: 1.6;
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
};

export default PrivacyPolicy;
