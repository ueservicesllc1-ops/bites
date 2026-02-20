import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Fallback data in case Firebase is empty or fails
const SAMPLE_PRODUCTS = [
  { id: 101, name: "Camiseta Blanca Básica", category: "Ropa", price: 15.00, color: "#f1f5f9" },
  { id: 102, name: "Sudadera Negra", category: "Ropa", price: 35.00, color: "#1e293b" },
  { id: 201, name: "Termo Negro 20oz", category: "Grabado", price: 25.00, color: "#000000" },
  { id: 301, name: "Llavero Metálico", category: "Promocional", price: 5.00, color: "#94a3b8" },
];

const CATEGORIES = ["Todos", "Ropa", "Grabado", "Promocional"];

const Store = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // In a real scenario, you'd fetch from a 'products' collection
        const q = activeCategory === "Todos"
          ? collection(db, "products")
          : query(collection(db, "products"), where("category", "==", activeCategory));

        const querySnapshot = await getDocs(q);
        const fetchedProducts = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });

        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        } else {
          // Keep sample products if DB is empty for demo purposes
          const filteredSample = activeCategory === "Todos"
            ? SAMPLE_PRODUCTS
            : SAMPLE_PRODUCTS.filter(p => p.category === activeCategory);
          setProducts(filteredSample);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to sample data on error
        const filteredSample = activeCategory === "Todos"
          ? SAMPLE_PRODUCTS
          : SAMPLE_PRODUCTS.filter(p => p.category === activeCategory);
        setProducts(filteredSample);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="store-page section-padding">
      <div className="container">
        <div className="store-header">
          <h2>Nuestra Colección</h2>
          <p>Encuentra el producto perfecto para tu marca.</p>
        </div>

        <div className="category-filter">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Cargando productos...</div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .store-page {
          min-height: 80vh;
          padding-top: calc(var(--nav-height) + 20px);
        }

        .store-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 0 10px;
        }
        
        .store-header h2 {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .category-filter {
          display: flex;
          justify-content: flex-start; /* Left align for scroll */
          gap: 10px;
          margin-bottom: 30px;
          overflow-x: auto; /* Horizontal scroll on mobile */
          padding-bottom: 10px; /* Space for scrollbar */
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Hide scrollbar Firefox */
        }
        
        .category-filter::-webkit-scrollbar {
          display: none; /* Hide scrollbar Chrome/Safari */
        }

        .filter-btn {
          background: var(--dark-card);
          color: var(--muted-text);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap; /* Prevent breaking */
          transition: all 0.3s ease;
          flex-shrink: 0; /* Don't shrink */
        }

        .filter-btn:hover, .filter-btn.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* Smaller min-width for mobile 2-col */
          gap: 15px;
        }

        /* Desktop Styles */
        @media (min-width: 768px) {
          .store-page { padding-top: calc(var(--nav-height) + 40px); }
          .store-header { margin-bottom: 40px; }
          .store-header h2 { font-size: 2.5rem; }
          
          .category-filter {
            justify-content: center; /* Center on desktop */
            overflow-x: visible;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 50px;
          }
          
          .filter-btn {
            font-size: 1rem;
            padding: 8px 24px;
          }
          
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default Store;
