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
        <footer style={{
            background: '#000000',
            padding: '60px 20px',
            textAlign: 'center',
            marginTop: 'auto',
            color: '#FFFFFF'
        }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>BITES CREATIVE</h3>

                <div className="footer-links" style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <Link to="/about" className="footer-link">{t('nav.about')}</Link>
                    <Link to="/shipping" className="footer-link">{t('footer.shipping')}</Link>
                    <Link to="/terms" className="footer-link">{t('footer.terms')}</Link>
                    <Link to="/privacy" className="footer-link">{t('footer.privacy')}</Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                    {footerConfig.instagram && <a href={footerConfig.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>Instagram</a>}
                    {footerConfig.facebook && <a href={footerConfig.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>Facebook</a>}
                    {footerConfig.tiktok && <a href={footerConfig.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>TikTok</a>}
                </div>
                {/* Optional: Add Phone/Address if available in config */}
                {footerConfig.phone && <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{footerConfig.phone}</p>}
                {footerConfig.email && <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{footerConfig.email}</p>}

                <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '10px' }}>© 2026 Bites Creative Labs. {t('footer.rights')}</p>
            </div>
        </footer>
    );
};

export default Footer;
