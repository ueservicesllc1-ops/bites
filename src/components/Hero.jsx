import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  const SAMPLE_SLIDES = [
    {
      id: 1,
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      image: "",
      link: "/#gallery"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]); // Start empty
  const [loading, setLoading] = useState(true);
  // Ideally SAMPLE_SLIDES depends on 't'. 

  // Better approach: combine logic.

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedBanners = querySnapshot.docs.map(doc => ({
          id: doc.id,
          image: doc.data().imageUrl,
          title: doc.data().title || t('hero.title'),
          subtitle: doc.data().subtitle || t('hero.subtitle'),
          link: doc.data().link || "/#gallery"
        }));

        if (fetchedBanners.length > 0) {
          setSlides(fetchedBanners);
        } else {
          setSlides(SAMPLE_SLIDES);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        setSlides(SAMPLE_SLIDES);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [t]); // Re-run when language changes to update translations

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (loading) {
    return (
      <section className="hero-slider" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{
            backgroundImage: slide.image ? `url(${slide.image})` : 'none',
            backgroundColor: '#1a1a1a'
          }}
        >
          <div className="overlay"></div>
          <div className="slide-content">
            <h1 className="animate-slide-up">{slide.title}</h1>
            <p className="animate-slide-up delay-1">{slide.subtitle}</p>
            {slide.link.includes('#') ? (
              <a href={slide.link} className="btn btn-primary animate-slide-up delay-2">
                {t('hero.cta')} <ArrowRight size={20} style={{ marginLeft: '10px' }} />
              </a>
            ) : (
              <Link to={slide.link} className="btn btn-primary animate-slide-up delay-2">
                {t('hero.cta')} <ArrowRight size={20} style={{ marginLeft: '10px' }} />
              </Link>
            )}
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button className="slider-btn prev" onClick={prevSlide} aria-label="Previous slide">
            <ChevronLeft size={30} />
          </button>
          <button className="slider-btn next" onClick={nextSlide} aria-label="Next slide">
            <ChevronRight size={30} />
          </button>

          <div className="indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </>
      )}

      <style>{`
        .hero-slider {
          position: relative;
          height: 85vh; /* Mobile height */
          max-height: 600px;
          width: 100%;
          overflow: hidden;
          margin-top: var(--nav-height);
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center; /* Center on mobile */
        }

        .slide.active {
          opacity: 1;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4); /* Darker overlay for readability on mobile */
          z-index: 1;
        }

        .slide-content {
          position: relative;
          z-index: 2;
          color: white;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center; /* Center align on mobile */
          text-align: center;
          max-width: 100%;
          padding: 0 20px;
        }

        .slide-content h1 {
          font-size: 2.5rem; /* Mobile font size */
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          color: white;
          line-height: 1.1;
        }

        .slide-content p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          max-width: 90%;
        }

        .slide-content .btn-primary {
          background: var(--accent);
          color: var(--secondary);
          border-color: var(--accent);
          width: 100%; /* Full width button on mobile */
          max-width: 280px;
        }
        
        .slide-content .btn-primary:hover {
          background: white;
          border-color: white;
          transform: translateY(-2px);
        }

        /* Nav buttons hidden on mobile by default */
        .slider-btn {
          display: none;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .slider-btn:hover {
          background: var(--accent);
          color: var(--secondary);
        }

        .prev { left: 20px; }
        .next { right: 20px; }

        .indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: var(--accent);
          transform: scale(1.2);
        }

        .animate-slide-up {
          opacity: 0;
          transform: translateY(30px);
          animation: slideUp 0.8s forwards;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Desktop Styles */
        @media (min-width: 768px) {
          .hero-slider {
            height: 650px;
            max-height: none;
          }

          .slide {
            justify-content: flex-start; /* Left align on desktop */
          }

          .overlay {
            background: rgba(0,0,0,0.2);
          }

          .slide-content {
            align-items: flex-start;
            text-align: left;
            max-width: 600px;
            padding-left: 5%; /* Push from the very edge */
            padding-right: 20px;
          }

          .slide-content h1 {
            font-size: 4rem;
          }

          .slide-content p {
            font-size: 1.25rem;
            max-width: 100%;
          }

          .slide-content .btn-primary {
            width: auto;
          }

          .slider-btn {
            display: flex; /* Show nav buttons */
          }
          
          .indicator {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
