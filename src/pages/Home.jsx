import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ContactSection = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone || ''
      }));
    }
  }, [user]);

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
      setFormData({ name: '', email: '', phone: '', message: '' });
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
                <label>{t('contact.phone')}</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
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
        .contact-section { background: #f8fafc; }
        .contact-form-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 25px; /* Mobile padding */
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .contact-form .form-group { margin-bottom: 15px; }
        .contact-form label { display: block; margin-bottom: 5px; font-weight: 600; color: var(--secondary); font-size: 0.9rem; }
        .contact-form input, .contact-form textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 16px; /* Prevent zoom on mobile */
        }
        .contact-form button { width: 100%; padding: 14px; }
        .success-msg { text-align: center; padding: 40px 20px; }
        .success-msg h3 { color: var(--primary); margin-bottom: 10px; font-size: 1.5rem; }
        .error-text { color: red; text-align: center; margin-top: 10px; }

        /* Desktop Styles */
        @media (min-width: 768px) {
          .contact-form-wrapper { padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
          .contact-form .form-group { margin-bottom: 20px; }
          .contact-form label { margin-bottom: 8px; font-size: 1rem; }
        }
      `}</style>
    </section>
  );
};

import { X, MessageCircle, Facebook, Instagram, Share2, Copy, Check } from 'lucide-react';

const ProductGallery = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

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

  const handleShare = (e, product, type) => {
    e.stopPropagation();
    // For individual sharing, we can use the image URL or a deep link
    const imageLink = product.imageUrl;
    const siteLink = `${window.location.origin}/#gallery`;

    if (type === 'copy') {
      navigator.clipboard.writeText(imageLink);
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2000);
    } else if (type === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageLink)}`;
      window.open(facebookUrl, '_blank');
    } else if (type === 'instagram') {
      // Instagram doesn't have a web sharer, so we link to the profile or open the app
      window.open('https://instagram.com/BitesCreative', '_blank');
    }
  };

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
                  <div className="gallery-actions">
                    <button
                      className="gallery-action-btn"
                      onClick={(e) => handleShare(e, product, 'copy')}
                      title={t('gallery.modal.copy_link')}
                    >
                      {copiedId === product.id ? <Check size={18} color="#4ade80" /> : <Copy size={18} />}
                    </button>
                    <button
                      className="gallery-action-btn"
                      onClick={(e) => handleShare(e, product, 'facebook')}
                      title={t('gallery.modal.share_facebook')}
                    >
                      <Facebook size={18} fill="white" />
                    </button>
                    <button
                      className="gallery-action-btn"
                      onClick={(e) => handleShare(e, product, 'instagram')}
                      title="Instagram"
                    >
                      <Instagram size={18} />
                    </button>
                  </div>
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
          const modalShareUrl = `${window.location.origin}/#gallery`;
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
                      <div className="modal-share-row">
                        <button
                          className={`modal-action-btn secondary ${copiedId === selectedProduct.id ? 'success' : ''}`}
                          onClick={(e) => handleShare(e, selectedProduct, 'copy')}
                        >
                          {copiedId === selectedProduct.id ? <Check size={18} /> : <Copy size={18} />}
                          {copiedId === selectedProduct.id ? t('gallery.modal.link_copied') : t('gallery.modal.copy_link')}
                        </button>

                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedProduct.imageUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="modal-action-btn facebook-btn"
                        >
                          <Facebook size={18} fill="white" />
                          {t('gallery.modal.share_facebook')}
                        </a>

                        <a
                          href="https://instagram.com/BitesCreative"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="modal-action-btn instagram-btn"
                        >
                          <Instagram size={18} />
                          Instagram
                        </a>
                      </div>

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
            gap: 20px;
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

        /* Modal Styles - Mobile First */
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
            padding: 10px; /* Smaller padding on mobile */
            backdrop-filter: blur(5px);
            animation: fadeIn 0.3s ease;
        }

        .gallery-modal-content {
            background: white;
            width: 100%;
            max-width: 1200px;
            height: 90vh; /* Max height for mobile */
            border-radius: 12px;
            overflow-y: auto; /* Allow full modal scroll on mobile */
            position: relative;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .modal-layout {
            display: flex;
            flex-direction: column-reverse; /* Info on bottom (or top depending on preference, actually often info first is better for context, but design was reverse) */
            /* Previous design had reverse on mobile, meaning Gallery on top, Info on bottom? No wait. 
               Desktop: Gallery Left, Info Right.
               Mobile (previous): Column Reverse -> Info Bottom, Gallery Top?
               Let's stick to: Gallery Top, Info Bottom for mobile.
            */
            width: 100%;
        }

        .modal-gallery-column {
            width: 100%;
            background: #f8fafc;
            padding: 15px;
            /* On mobile, this just flows */
        }

        .modal-info-column {
            width: 100%;
            background: white;
            padding: 60px 20px 30px 20px; /* Top padding for close button */
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
            z-index: 20; /* Ensure above content */
        }
        
        .close-modal-btn:hover {
            background: #e2e8f0;
            color: #ef4444;
        }

        .modal-info-column h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
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
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); /* Smaller grid items on mobile */
            gap: 10px;
        }

        .modal-img-item {
            border-radius: 8px;
            overflow: hidden;
            height: 180px; /* Smaller height on mobile */
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
            padding: 10px;
            animation: fadeIn 0.2s ease;
        }

        .lightbox-img {
            max-width: 100%;
            max-height: 80vh; /* Leave room for close button */
            border-radius: 4px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            cursor: pointer;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        }

        .lightbox-close:hover {
            background: rgba(255,255,255,0.3);
        }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .gallery-actions {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 8px;
            z-index: 20;
            opacity: 1; /* Always visible on mobile */
        }

        .gallery-action-btn {
            background: rgba(255, 255, 255, 0.9);
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--secondary);
            transition: all 0.2s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .gallery-action-btn:hover {
            background: white;
            transform: scale(1.1);
        }

        .gallery-action-btn .lucide-facebook {
            fill: #1877F2;
            color: #1877F2;
        }

        .gallery-action-btn:hover .lucide-instagram {
            color: white;
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            border-radius: 50%;
        }

        .modal-actions-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 30px;
        }

        .modal-share-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        @media (max-width: 600px) {
            .modal-share-row {
                grid-template-columns: 1fr;
            }
        }

        .modal-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 10px 5px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            border: none;
            font-size: 0.85rem;
        }

        .modal-action-btn.secondary {
            background: #f1f5f9;
            color: var(--secondary);
        }

        .modal-action-btn.secondary:hover {
            background: #e2e8f0;
        }

        .modal-action-btn.secondary.success {
            background: #dcfce7;
            color: #166534;
        }

        .modal-action-btn.facebook-btn {
            background: #1877F2;
            color: white;
        }

        .modal-action-btn.facebook-btn:hover {
            background: #0e5a9a;
        }

        .modal-action-btn.instagram-btn {
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            color: white;
        }

        .modal-action-btn.instagram-btn:hover {
            opacity: 0.9;
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

        /* Desktop View (min-width: 900px) */
        @media (min-width: 900px) {
            .gallery-actions {
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            }

            .portfolio-item:hover .gallery-actions {
                opacity: 1;
                transform: translateY(0);
            }

            .gallery-modal-content {
                height: 85vh;
                overflow: hidden; /* Hide main scrollbar */
                display: flex;
            }

            .modal-layout {
                flex-direction: row; /* Side by side */
                height: 100%;
                overflow: hidden;
            }

            .modal-gallery-column {
                flex: 3;
                height: 100%;
                overflow-y: auto;
                padding: 30px;
            }

            .modal-info-column {
                flex: 1;
                height: 100%;
                overflow-y: auto;
                padding: 40px 30px;
                border-left: 1px solid #e2e8f0;
            }
            
            .modal-img-item {
                height: 250px;
            }
            
            .modal-gallery-grid {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
            }
            
             .modal-info-column h3 {
                font-size: 1.8rem;
            }
        }
      `}</style>
    </section>
  );
};

const PromoPopup = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [stickerImg, setStickerImg] = useState(null);

  useEffect(() => {
    // Only show if not seen in this session
    const hasSeen = sessionStorage.getItem('bites_promo_seen');
    if (hasSeen) return;

    const fetchStickerImg = async () => {
      try {
        const q = query(collection(db, "products"));
        const snapshot = await getDocs(q);
        const stickerProd = snapshot.docs.find(doc =>
          doc.data().name === 'STICKERS PERSONALIZADOS' ||
          doc.data().name?.toLowerCase().includes('sticker')
        );
        if (stickerProd) {
          setStickerImg(stickerProd.data().imageUrl);
        }
      } catch (err) {
        console.error("Error fetching sticker img:", err);
      }
    };
    fetchStickerImg();

    // Small delay before showing to avoid "clash" at start
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 15000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('bites_promo_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="promo-overlay" onClick={closePopup}>
      <div className="promo-content-fun" onClick={e => e.stopPropagation()}>
        {/* Floating Stickers Decor */}
        <div className="sticker-item s-top-left">BITES!</div>
        <div className="sticker-item s-bottom-right">FREE</div>
        <div className="sticker-item s-top-right">NEW</div>
        <div className="sticker-item s-side">✨</div>

        <button className="promo-close-fun" onClick={closePopup}>
          <X size={28} />
        </button>

        <div className="promo-layout-split">
          {stickerImg && (
            <div className="promo-image-container">
              <img src={stickerImg} alt="Sticker Sample" className="promo-sticker-img" />
              <div className="img-tape"></div>
            </div>
          )}
          <div className="promo-inner-fun">
            <div className="fun-header">
              <h2 className="title-fun">{t('promo.title')}</h2>
            </div>
            <div className="fun-body">
              <p className="subtitle-fun">{t('promo.subtitle')}</p>
              <div className="fun-actions">
                <button className="cta-fun-btn" onClick={() => {
                  if (!user) {
                    navigate('/login', { state: { from: { pathname: '/' } } });
                    closePopup();
                    return;
                  }
                  closePopup();
                  addToCart({
                    id: 'sticker-sample-pack',
                    name: t('promo.title'),
                    price: 0,
                    imageUrl: stickerImg,
                    isSample: true
                  });
                  navigate('/cart');
                }}>
                  {t('promo.cta')}
                </button>
                <div className="disclaimer-fun-tag">
                  <span>{t('promo.shipping_note')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .promo-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: popUpIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .promo-content-fun {
          background: #FFD600; /* Super Bright Yellow */
          width: 100%;
          max-width: 850px;
          min-height: 400px;
          border: 6px solid #000;
          border-radius: 40px;
          position: relative;
          box-shadow: 15px 15px 0px #000;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .promo-layout-split {
          display: flex;
          flex-direction: column;
          gap: 30px;
          align-items: center;
        }
        .promo-image-container {
          width: 100%;
          max-width: 300px;
          position: relative;
          transform: rotate(-3deg);
          transition: transform 0.3s;
        }
        .promo-image-container:hover {
          transform: rotate(0deg) scale(1.05);
        }
        .promo-sticker-img {
          width: 100%;
          aspect-ratio: 1/1;
          object-fit: cover;
          border: 6px solid white;
          box-shadow: 10px 10px 20px rgba(0,0,0,0.2);
          border-radius: 10px;
        }
        .img-tape {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 35px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(2px);
          border: 1px solid rgba(0,0,0,0.1);
        }
        .sticker-item {
          position: absolute;
          background: white;
          border: 3px solid #000;
          padding: 8px 15px;
          font-weight: 900;
          font-family: var(--font-heading);
          box-shadow: 4px 4px 0px #000;
          z-index: 10;
          font-size: 0.9rem;
          pointer-events: none;
        }
        .s-top-left { top: -20px; left: -10px; transform: rotate(-15deg); color: #FF006E; border-radius: 50% 20% 50% 20%; }
        .s-bottom-right { bottom: -15px; right: 20px; transform: rotate(10deg); color: #3A86FF; font-size: 1.1rem; border-radius: 5px; }
        .s-top-right { top: 30px; right: -25px; transform: rotate(20deg); color: #8338EC; }
        .s-side { bottom: 50px; left: -20px; transform: rotate(-10deg); font-size: 1.5rem; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; }

        .title-fun {
          font-size: 2.5rem;
          color: #000;
          text-align: center;
          margin-bottom: 20px;
          line-height: 0.9;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -2px;
          text-shadow: 3px 3px 0px white;
        }
        .subtitle-fun {
          font-size: 1.2rem;
          font-weight: 800;
          color: #000;
          text-align: center;
          margin-bottom: 30px;
          line-height: 1.2;
        }
        .fun-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .cta-fun-btn {
          background: #FF006E; /* Electric Pink */
          color: white;
          border: 4px solid #000;
          padding: 18px 40px;
          font-weight: 900;
          font-size: 1.4rem;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 20px;
          box-shadow: 6px 6px 0px #000;
          transition: all 0.2s;
          width: 100%;
        }
        .cta-fun-btn:hover {
          transform: translate(-3px, -3px);
          box-shadow: 10px 10px 0px #000;
          background: #fb2c8d;
        }
        .disclaimer-fun-tag {
          background: white;
          border: 2px solid #000;
          padding: 5px 15px;
          transform: rotate(-2deg);
          box-shadow: 3px 3px 0px #000;
        }
        .disclaimer-fun-tag span {
          font-size: 0.8rem;
          font-weight: 900;
          text-transform: uppercase;
          color: #000;
        }
        .promo-close-fun {
          position: absolute;
          top: 15px;
          right: 15px;
          background: white;
          border: 3px solid #000;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .promo-close-fun:hover {
          background: #000;
          color: white;
          transform: rotate(90deg);
        }

        @keyframes popUpIn {
          0% { transform: scale(0.6) rotate(-5deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @media (min-width: 768px) {
          .promo-layout-split {
            flex-direction: row;
            text-align: left;
            gap: 50px;
          }
          .title-fun, .subtitle-fun { text-align: left; }
          .fun-actions { align-items: flex-start; }
          .title-fun { font-size: 3.5rem; }
          .promo-image-container { max-width: 350px; }
        }
        
        @media (max-width: 600px) {
          .title-fun { font-size: 2.22rem; }
          .sticker-item { display: none; }
        }
      `}</style>
    </div>
  );
};

const Home = () => {
  const { t } = useLanguage();
  return (
    <>
      <PromoPopup />
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
          margin-bottom: 30px;
        }

        .section-header h2 {
          font-size: 2rem;
        }

        .section-header p {
          color: var(--muted-text);
          font-size: 1rem;
        }

        .cta-section {
          padding: 40px 0;
        }

        .cta-box {
          background: #FFFFFF;
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: 30px 20px; /* Mobile padding */
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
        }

        .cta-box h2 {
          color: var(--secondary);
          margin-bottom: 15px;
        }

        .cta-box p {
          color: var(--muted-text);
          margin-bottom: 20px;
          font-size: 1.1rem;
        }

        @media (min-width: 768px) {
          .section-header { margin-bottom: 40px; }
          .section-header h2 { font-size: 2.5rem; }
          .section-header p { font-size: 1.1rem; }
          .cta-section { padding: 60px 0; }
          .cta-box { padding: 60px 40px; }
          .cta-box h2 { margin-bottom: 20px; }
          .cta-box p { margin-bottom: 30px; font-size: 1.2rem; }
        }
      `}</style>
    </>
  );
};

export default Home;
