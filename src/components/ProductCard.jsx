import { useState } from 'react';
import { ShoppingCart, Share2, Facebook, Copy, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const shareUrl = `${window.location.origin}/store#${product.id}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="product-card" id={product.id}>
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="product-img" />
        ) : (
          <div className="placeholder-img" style={{ background: `linear-gradient(135deg, ${product.color || '#334155'}, #1e293b)` }}></div>
        )}

        <div className="product-actions">
          <button
            className={`action-btn share-toggle ${showShare ? 'active' : ''}`}
            onClick={() => setShowShare(!showShare)}
            title={t('gallery.modal.share')}
          >
            <Share2 size={20} />
          </button>

          <button className="action-btn add-btn" onClick={() => addToCart(product)}>
            <ShoppingCart size={20} />
          </button>
        </div>

        {showShare && (
          <div className="share-menu">
            <button className="share-item" onClick={handleCopy}>
              {copied ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
              <span>{copied ? t('gallery.modal.link_copied') : t('gallery.modal.copy_link')}</span>
            </button>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="share-item">
              <Facebook size={16} fill="#1877F2" color="#1877F2" />
              <span>{t('gallery.modal.share_facebook')}</span>
            </a>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-price">
          ${product.price ? product.price.toFixed(2) : "0.00"}
        </div>
      </div>

      <style>{`
        .product-card {
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid var(--border);
          position: relative;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          border-color: var(--primary);
        }

        .product-image {
          height: 250px;
          position: relative;
          overflow: hidden;
          background: #f8fafc;
        }

        .placeholder-img, .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .placeholder-img,
        .product-card:hover .product-img {
          transform: scale(1.1);
        }

        .product-actions {
          position: absolute;
          bottom: 15px;
          right: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 10;
        }

        .action-btn {
          background: white;
          color: var(--dark-bg);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .action-btn:hover {
          background: var(--primary);
          color: white;
          transform: scale(1.1);
        }

        .action-btn.share-toggle.active {
          background: var(--secondary);
          color: white;
        }

        .share-menu {
          position: absolute;
          top: 15px;
          right: 15px;
          background: white;
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 20;
          animation: slideInRight 0.3s ease;
          border: 1px solid var(--border);
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .share-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--light-text);
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          transition: background 0.2s;
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
        }

        .share-item:hover {
          background: #f1f5f9;
        }

        /* Desktop Hover Effect */
        @media (min-width: 1024px) {
          .product-actions {
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
          }

          .product-card:hover .product-actions {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .product-info {
          padding: 15px;
        }

        .product-info h3 {
          font-size: 1.1rem;
          margin-bottom: 5px;
          color: var(--light-text);
          font-weight: 700;
        }

        .product-category {
          font-size: 0.85rem;
          color: var(--muted-text);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .product-price {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
        }

        @media (min-width: 768px) {
          .product-info { padding: 20px; }
          .product-category { margin-bottom: 15px; }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
