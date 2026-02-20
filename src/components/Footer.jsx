import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
    const { t } = useLanguage();
    const [footerConfig, setFooterConfig] = useState({
        instagram: '#', facebook: '#', tiktok: '#'
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, "settings", "general");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFooterConfig(docSnap.data());
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
            }
        };
        fetchConfig();
    }, []);

    return (
        <footer className="site-footer">
            <div className="container footer-content">
                <h3>BITES CREATIVE</h3>

                <div className="footer-links">
                    <Link to="/about" className="footer-link">{t('nav.about')}</Link>
                    <Link to="/shipping" className="footer-link">{t('footer.shipping')}</Link>
                    <Link to="/terms" className="footer-link">{t('footer.terms')}</Link>
                    <Link to="/privacy" className="footer-link">{t('footer.privacy')}</Link>
                </div>

                <div className="social-links">
                    {footerConfig.instagram && <a href={footerConfig.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                    {footerConfig.facebook && <a href={footerConfig.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
                    {footerConfig.tiktok && <a href={footerConfig.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>}
                </div>

                <div className="contact-info">
                    {footerConfig.phone && <p>{footerConfig.phone}</p>}
                    {footerConfig.email && <p>{footerConfig.email}</p>}
                </div>

                <p className="copyright">© 2026 Bites Creative Labs. {t('footer.rights')}</p>
                <p className="powered-by">Designed and Powered by <span style={{ color: 'white', fontWeight: 'bold' }}>Freedom Labs</span></p>
            </div>

            <style>{`
                .site-footer {
                    background: #000000;
                    padding: 40px 0;
                    text-align: center;
                    margin-top: auto;
                    color: #FFFFFF;
                }
                
                .footer-content {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    padding: 0 20px;
                }
                
                .site-footer h3 {
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                }

                .footer-links {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .footer-link {
                    color: #FFFFFF;
                    text-decoration: none;
                }
                
                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin: 10px 0;
                }
                
                .social-links a {
                    color: #94A3B8;
                    text-decoration: none;
                }
                
                .contact-info p, .copyright, .powered-by {
                    color: #64748B;
                    font-size: 0.9rem;
                    margin: 2px 0;
                }
                
                .copyright {
                    margin-top: 15px;
                }

                /* Desktop Styles */
                @media (min-width: 768px) {
                    .footer-links {
                        flex-direction: row;
                        justify-content: center;
                        gap: 25px;
                        flex-wrap: wrap;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
