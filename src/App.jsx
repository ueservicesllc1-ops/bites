import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Store from './pages/Store';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import { db } from './firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import './App.css';

import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ShippingPolicy from './pages/ShippingPolicy';

// Placeholder Pages
const Custom = () => <div className="container section-padding" style={{ paddingTop: '120px' }}><h2>Personalizador</h2><p>Herramienta de diseño en construcción.</p></div>;

function App() {
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
    <CartProvider>
      <div className="app">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/custom" element={<Custom />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
          </Routes>
        </main>

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
              <a href="/store" className="footer-link">Tienda</a>
              <a href="/about" className="footer-link">Nosotros</a>
              <a href="/shipping" className="footer-link">Envíos y Devoluciones</a>
              <a href="/terms" className="footer-link">Términos</a>
              <a href="/privacy" className="footer-link">Privacidad</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
              {footerConfig.instagram && <a href={footerConfig.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>Instagram</a>}
              {footerConfig.facebook && <a href={footerConfig.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>Facebook</a>}
              {footerConfig.tiktok && <a href={footerConfig.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>TikTok</a>}
            </div>
            {/* Optional: Add Phone/Address if available in config */}
            {footerConfig.phone && <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{footerConfig.phone}</p>}
            {footerConfig.email && <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{footerConfig.email}</p>}

            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '10px' }}>© 2026 Bites Creative Labs. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
