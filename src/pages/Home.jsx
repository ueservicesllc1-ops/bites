import { useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

// Temporary mock data for featured - later we can make this dynamic too
const FEATURED_PRODUCTS = [
  { id: 1, name: "Camiseta Urban Flow", category: "Ropa", price: 25.00, color: "#ef4444" },
  { id: 2, name: "Termo Grabado Láser", category: "Accesorios", price: 35.00, color: "#3b82f6" },
  { id: 3, name: "Gorra Snapback Custom", category: "Ropa", price: 18.00, color: "#10b981" },
  { id: 4, name: "Llavero Acrílico", category: "Promocional", price: 8.50, color: "#f59e0b" },
];

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: new Date()
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section section-padding">
      <div className="container">
        <div className="section-header">
          <h2>Contáctanos</h2>
          <p>Déjanos un mensaje y te responderemos pronto.</p>
        </div>

        <div className="contact-form-wrapper">
          {status === 'success' ? (
            <div className="success-msg">
              <h3>¡Mensaje Enviado!</h3>
              <p>Gracias por contactarnos. Te responderemos a la brevedad.</p>
              <button onClick={() => setStatus('')} className="btn btn-outline" style={{ marginTop: '20px' }}>Enviar otro</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Mensaje</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={4}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
              {status === 'error' && <p className="error-text">Hubo un error al enviar. Intenta nuevamente.</p>}
            </form>
          )}
        </div>
      </div>
      <style>{`
                .contact-section { background: #f8fafc; }
                .contact-form-wrapper {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                .contact-form .form-group { margin-bottom: 20px; }
                .contact-form label { display: block; margin-bottom: 8px; font-weight: 600; color: var(--secondary); }
                .contact-form input, .contact-form textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    font-family: inherit;
                }
                .contact-form button { width: 100%; }
                .success-msg { text-align: center; padding: 40px 20px; }
                .success-msg h3 { color: var(--primary); margin-bottom: 10px; }
                .error-text { color: red; text-align: center; margin-top: 10px; }
            `}</style>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Hero />

      <section className="section-padding container">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <p>Lo mejor para tu marca, diseñado con pasión.</p>
        </div>

        <div className="product-grid">
          {FEATURED_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>¿Tienes una idea en mente?</h2>
            <p>Convertimos tus ideas en productos tangibles de alta calidad.</p>
            <button className="btn btn-primary">Cotizar Ahora</button>
          </div>
        </div>
      </section>

      <ContactSection />

      <style>{`
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 2.5rem;
        }

        .section-header p {
          color: var(--muted-text);
          font-size: 1.1rem;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .cta-section {
          padding: 100px 0;
        }

        .cta-box {
          background: #FFFFFF;
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: 80px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
        }

        .cta-box h2 {
          color: var(--secondary);
          margin-bottom: 20px;
        }

        .cta-box p {
          color: var(--muted-text);
          margin-bottom: 30px;
          font-size: 1.2rem;
        }
      `}</style>
    </>
  );
};

export default Home;
