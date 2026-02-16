import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const SAMPLE_SLIDES = [
  {
    id: 1,
    title: "Diseño Publicitario",
    subtitle: "Destaca tu marca con productos únicos y personalizados.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    link: "/store"
  },
  {
    id: 2,
    title: "Estampados Exclusivos",
    subtitle: "Camisetas y textiles con la mejor calidad del mercado.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    link: "/store"
  },
  {
    id: 3,
    title: "Grabado Láser Preciso",
    subtitle: "Detalles que marcan la diferencia en metal, madera y más.",
    image: "https://images.unsplash.com/photo-1622606543924-49c7482f5677?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    link: "/custom"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(SAMPLE_SLIDES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedBanners = querySnapshot.docs.map(doc => ({
          id: doc.id,
          image: doc.data().imageUrl,
          // If banners in DB don't have titles yet, use details from sample or generic default
          title: doc.data().title || "Bites Creative Labs",
          subtitle: doc.data().subtitle || "Diseño y Publicidad a tu medida",
          link: doc.data().link || "/store"
        }));

        if (fetchedBanners.length > 0) {
          setSlides(fetchedBanners);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="overlay"></div>
          <div className="slide-content container">
            <h1 className="animate-slide-up">{slide.title}</h1>
            <p className="animate-slide-up delay-1">{slide.subtitle}</p>
            <Link to={slide.link} className="btn btn-primary animate-slide-up delay-2">
              Ver Productos <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </Link>
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
          height: 500px;
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
          background-position: center;
          display: flex;
          align-items: center;
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
          background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%);
          z-index: 1;
        }

        .slide-content {
          position: relative;
          z-index: 2;
          color: white;
          max-width: 800px;
        }

        .slide-content h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          color: white;
        }

        .slide-content p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .slide-content .btn-primary {
          background: var(--accent);
          color: var(--secondary);
          border-color: var(--accent);
        }
        .slide-content .btn-primary:hover {
          background: white;
          border-color: white;
          transform: translateY(-2px);
        }

        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
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
          width: 12px;
          height: 12px;
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

        @media (max-width: 768px) {
          .slide-content h1 { font-size: 2.5rem; }
          .hero-slider { height: 400px; }
          .slider-btn { display: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
