import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ContactSection = () => {
  const { t } = useLanguage();
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
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        <div className="section-header">
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.subtitle')}</p>
        </div>

        <div className="contact-form-wrapper">
          {status === 'success' ? (
            <div className="success-msg">
              <h3>{t('contact.success_title')}</h3>
              <p>{t('contact.success_msg')}</p>
              <button onClick={() => setStatus('')} className="btn btn-outline" style={{ marginTop: '20px' }}>{t('contact.send_another')}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('contact.name')}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>{t('contact.email')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>{t('contact.message')}</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={4}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? t('contact.sending') : t('contact.send')}
              </button>
              {status === 'error' && <p className="error-text">{t('contact.error')}</p>}
            </form>
          )}
        </div>
      </div>
      <style>{`
                /* ... keep existing styles ... */
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

import { X, MessageCircle, Facebook, Instagram } from 'lucide-react';

const ProductGallery = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openGallery = (product) => {
    setSelectedProduct(product);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeGallery = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  if (loading) return <div className="text-center py-10">{t('gallery.loading')}</div>;
  if (products.length === 0) return null;

  return (
    <section id="gallery" className="gallery-section section-padding">
      <div className="container">
        <div className="section-header">
          <h2>{t('gallery.title')}</h2>
          <p>{t('gallery.subtitle')}</p>
        </div>

        {/* Categories Grid */}
        <div className="portfolio-grid">
          {products.map((product) => {
            const displayName = t(`product_names.${product.name}`) || product.name;
            return (
              <div
                className="portfolio-item"
                key={product.id}
                onClick={() => openGallery(product)}
              >
                <div className="img-container">
                  <img src={product.imageUrl} alt={displayName} />
                  <div className="overlay-hover">
                    <span>{t('gallery.view_gallery')}</span>
                  </div>
                </div>
                <div className="item-info">
                  <h4>{displayName}</h4>
                  {product.gallery && product.gallery.length > 1 && (
                    <small>{product.gallery.length} {t('gallery.photos')}</small>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Gallery */}
        {selectedProduct && (() => {
          const modalDisplayName = t(`product_names.${selectedProduct.name}`) || selectedProduct.name;
          return (
            <div className="gallery-modal-overlay" onClick={closeGallery}>
              <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={closeGallery}>
                  <X size={24} />
                </button>

                <div className="modal-layout">
                  {/* Left Column: Gallery Images */}
                  <div className="modal-gallery-column">
                    <div className="modal-gallery-grid">
                      {selectedProduct.gallery && selectedProduct.gallery.length > 0 ? (
                        selectedProduct.gallery.map((imgUrl, index) => (
                          <div key={index} className="modal-img-item" onClick={() => setViewImage(imgUrl)}>
                            <img src={imgUrl} alt={`${modalDisplayName} ${index + 1}`} />
                          </div>
                        ))
                      ) : (
                        <div className="no-photos-msg">
                          <p>{t('gallery.no_photos')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Info */}
                  <div className="modal-info-column">
                    <h3>{modalDisplayName}</h3>
                    <div className="modal-description">
                      <p>{selectedProduct.description || t('gallery.no_description')}</p>
                    </div>

                    <div className="modal-actions-container">
                      <button className="modal-action-btn primary" onClick={() => {
                        closeGallery();
                        const contactSection = document.querySelector('.contact-section');
                        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                      }}>
                        {t('gallery.modal.quote')}
                      </button>

                      <a
                        href={`https://wa.me/15513019412?text=Hola,%20me%20interesa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20${encodeURIComponent(modalDisplayName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-action-btn whatsapp"
                      >
                        <MessageCircle size={18} /> {t('gallery.modal.whatsapp')}
                      </a>
                    </div>

                    <div className="modal-socials">
                      <p>{t('gallery.modal.follow')}</p>
                      <div className="social-icons">
                        <a href="https://instagram.com/BitesCreative" target="_blank" rel="noopener noreferrer" className="social-link instagram"><Instagram size={28} /></a>
                        <a href="https://facebook.com/BitesCreative" target="_blank" rel="noopener noreferrer" className="social-link facebook"><Facebook size={28} /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Fullscreen Image Viewer (Lightbox) */}
        {viewImage && (
          <div className="lightbox-overlay" onClick={() => setViewImage(null)}>
            <button className="lightbox-close" onClick={() => setViewImage(null)}>
              <X size={32} />
            </button>
            <img src={viewImage} alt="Fullscreen" className="lightbox-img" onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </div>

      <style>{`
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
        }

        .portfolio-item {
            cursor: pointer;
            transition: transform 0.3s;
        }
        
        .portfolio-item:hover .img-container img {
            transform: scale(1.05);
        }
        
        .portfolio-item:hover .overlay-hover {
            opacity: 1;
        }

        .img-container {
            position: relative;
            width: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            background: #f1f5f9;
        }

        .img-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .overlay-hover {
            position: absolute;
            top: 0; 
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .overlay-hover span {
            color: white;
            border: 1px solid white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 500;
        }

        .item-info {
            padding: 15px 5px;
            text-align: center;
        }
        
        .item-info h4 {
            margin: 0;
            font-size: 1.1rem;
            color: var(--secondary);
        }
        
        .item-info small {
            color: var(--muted-text);
        }

        /* Modal Styles */
        .gallery-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            backdrop-filter: blur(5px);
            animation: fadeIn 0.3s ease;
        }

        .gallery-modal-content {
            background: white;
            width: 100%;
            max-width: 1200px; /* Wider for side-by-side */
            height: 85vh; /* Fixed height for scrollable areas */
            border-radius: 12px;
            overflow: hidden; /* Hide overflow from rounded corners */
            position: relative;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .modal-layout {
            display: flex;
            height: 100%;
            overflow: hidden;
        }

        .modal-gallery-column {
            flex: 3; /* 75% width */
            background: #f8fafc;
            padding: 30px;
            overflow-y: auto;
        }

        .modal-info-column {
            flex: 1; /* 25% width */
            background: white;
            padding: 40px 30px;
            border-left: 1px solid #e2e8f0;
            overflow-y: auto;
            position: relative;
        }

        .close-modal-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #f1f5f9;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--secondary);
            transition: background 0.2s;
            z-index: 10;
        }
        
        .close-modal-btn:hover {
            background: #e2e8f0;
            color: #ef4444;
        }

        .modal-info-column h3 {
            font-size: 1.8rem;
            margin-bottom: 20px;
            color: var(--secondary);
            line-height: 1.2;
        }
        
        .modal-description {
            color: var(--muted-text);
            line-height: 1.6;
            font-size: 0.95rem;
        }

        .modal-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
        }

        .modal-img-item {
            border-radius: 8px;
            overflow: hidden;
            height: 250px;
            background: #e2e8f0;
            cursor: zoom-in;
        }

        .modal-img-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;
        }
        
        .modal-img-item:hover img {
            transform: scale(1.03);
        }
        
        .no-photos-msg {
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
            color: var(--muted-text);
        }

        /* Lightbox Styles */
        .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.2s ease;
        }

        .lightbox-img {
            max-width: 100%;
            max-height: 90vh;
            border-radius: 4px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        }

        .lightbox-close:hover {
            background: rgba(255,255,255,0.1);
        }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        @media (max-width: 900px) {
            .modal-layout {
                flex-direction: column-reverse; /* Info on top/bottom, Gallery on other */
                overflow-y: auto;
            }
            .gallery-modal-content {
                height: 90vh;
                display: block; /* Use block for vertical scrolling on mobile */
            }
            .modal-gallery-column, .modal-info-column {
                width: 100%;
                flex: none;
                border: none;
                overflow: visible;
                height: auto;
            }
            .modal-info-column {
                padding-top: 50px; /* Space for close button */
            }
            .portfolio-grid { grid-template-columns: 1fr; }
        }

        .modal-actions-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 30px;
        }

        .modal-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            border: none;
            font-size: 1rem;
        }

        .modal-action-btn.primary {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .modal-action-btn.primary:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }

        .modal-action-btn.whatsapp {
            background: #25D366;
            color: white;
            box-shadow: 0 4px 6px rgba(37, 211, 102, 0.2);
        }
        
        .modal-action-btn.whatsapp:hover {
            background: #128C7E;
            transform: translateY(-2px);
        }

        .modal-socials {
            margin-top: 30px;
            text-align: center;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
        }

        .modal-socials p {
            color: var(--muted-text);
            margin-bottom: 10px;
            font-size: 0.9rem;
        }

        .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
        }

        .social-link {
            color: var(--secondary);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #f8fafc;
        }

        .social-link:hover {
            transform: translateY(-2px);
            color: white;
        }

        .social-link.instagram:hover {
            background: #E1306C;
        }

        .social-link.facebook:hover {
            background: #1877F2;
        }
      `}</style>
    </section>
  );
};

const Home = () => {
  const { t } = useLanguage();
  return (
    <>
      <Hero />
      <ProductGallery />
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>{t('cta_box.title')}</h2>
            <p>{t('cta_box.text')}</p>
            <button className="btn btn-primary" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              {t('cta_box.button')}
            </button>
          </div>
        </div>
      </section>

      <ContactSection />

      <style>{`
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-header h2 {
          font-size: 2.5rem;
        }

        .section-header p {
          color: var(--muted-text);
          font-size: 1.1rem;
        }

        .cta-section {
          padding: 60px 0;
        }

        .cta-box {
          background: #FFFFFF;
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: 60px 40px;
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
