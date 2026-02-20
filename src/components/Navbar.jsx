import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo_light_bg.png';

const Navbar = () => {
  const { cartCount } = useCart();
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Bites Creative" className="logo-img" />
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links">
          <Link to="/" className="nav-link">{t('nav.home')}</Link>
          <Link to="/about" className="nav-link">{t('nav.about')}</Link>
          <a href="/#gallery" className="nav-link">{t('nav.products')}</a>
          <a href="/#contact" className="nav-link">{t('nav.contact')}</a>
        </div>

        <div className="nav-actions">
          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="lang-toggle-btn" title="Change Language">
            <Globe size={20} />
            <span className="lang-code">{language.toUpperCase()}</span>
          </button>

          {/* Cart hidden for now
          <Link to="/cart" className="cart-btn" aria-label="Open cart">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          */}

          <button
            className="menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</Link>
          <a href="/#gallery" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t('nav.products')}</a>
          <a href="/#contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t('nav.contact')}</a>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid var(--accent);
          z-index: 1000;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: height 0.3s;
        }
        
        .nav-content {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-img {
          height: 40px; /* Smaller on mobile */
          object-fit: contain;
        }

        /* Default: Mobile View */
        .nav-links {
          display: none; /* Hidden on mobile by default */
        }

        .menu-btn {
          background: none;
          color: var(--secondary);
          position: relative;
          padding: 8px;
          display: block; /* Visible on mobile */
          border: none;
          cursor: pointer;
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .lang-toggle-btn {
            background: none;
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 4px 10px;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            color: var(--secondary);
            font-weight: 600;
            font-size: 0.8rem;
            transition: all 0.2s;
        }
        
        .lang-toggle-btn:hover {
            background: #f1f5f9;
            color: var(--primary);
            border-color: var(--primary);
        }

        /* Mobile Menu Overlay */
        .mobile-menu {
          position: absolute;
          top: var(--nav-height);
          left: 0;
          width: 100%;
          background: #fff;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-bottom: 2px solid var(--accent);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-link {
          padding: 12px;
          text-align: center;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--secondary);
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .mobile-link:hover {
          background: var(--dark-card);
          color: var(--primary);
        }

        /* Desktop View (min-width: 768px) */
        @media (min-width: 768px) {
          .logo-img {
            height: 50px;
          }

          .nav-links {
            display: flex; /* Visible on desktop */
            gap: 2rem;
          }

          .nav-link {
            font-weight: 700;
            font-size: 0.95rem;
            color: var(--secondary);
            text-transform: uppercase;
            text-decoration: none;
            transition: color 0.2s;
          }

          .nav-link:hover {
            color: var(--primary);
          }

          .menu-btn {
            display: none; /* Hidden on desktop */
          }

          /* Hide mobile menu on desktop if open (though logic handles this mostly) */
          .mobile-menu {
            display: none; 
          }
          
          .nav-actions {
            gap: 15px;
          }
           
          .lang-toggle-btn {
             padding: 5px 12px;
             font-size: 0.85rem;
             gap: 6px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
