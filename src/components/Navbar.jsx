import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo_light_bg.png';

const Navbar = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Bites Creative" className="logo-img" />
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/store" className="nav-link">Tienda</Link>
          <Link to="/custom" className="nav-link">Personalizar</Link>
          <Link to="/about" className="nav-link">Nosotros</Link>
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn" aria-label="Open cart">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button
            className="menu-btn mobile-only"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
          <Link to="/store" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Tienda</Link>
          <Link to="/custom" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Personalizar</Link>
          <Link to="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
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
        }
        
        .nav-content {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-img {
          height: 50px;
          object-fit: contain;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--secondary);
          text-transform: uppercase;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .cart-btn, .menu-btn {
          background: none;
          color: var(--secondary);
          position: relative;
          padding: 8px;
        }

        .cart-btn:hover {
          color: var(--primary);
        }

        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--primary);
          color: #fff;
          font-size: 0.7rem;
          font-weight: bold;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-only { display: none; }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          
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
          }

          .mobile-link {
            padding: 10px;
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--secondary);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
