import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="product-img" />
        ) : (
          <div className="placeholder-img" style={{ background: `linear-gradient(135deg, ${product.color || '#334155'}, #1e293b)` }}></div>
        )}
        <button className="add-btn" onClick={() => addToCart(product)}>
          <ShoppingCart size={20} />
        </button>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-price">
          ${product.price.toFixed(2)}
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

        .add-btn {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: var(--light-text);
          color: var(--dark-bg);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .add-btn:hover {
          background: var(--primary);
          color: white;
        }

        .product-card:hover .add-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .product-info {
          padding: 20px;
        }

        .product-info h3 {
          font-size: 1.1rem;
          margin-bottom: 5px;
          color: var(--light-text); /* This variable is now dark #1E293B */
          font-weight: 700;
        }

        .product-category {
          font-size: 0.85rem;
          color: var(--muted-text);
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .product-price {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
