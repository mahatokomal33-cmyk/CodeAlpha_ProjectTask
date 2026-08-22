import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    badge: 'NEW SEASON',
    title: 'Fresh Fashion Collection',
    subtitle: 'Trendy dresses, kurtis & more at unbeatable prices.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1600&h=600&fit=crop',
    cta: 'Shop Women Fashion',
    to: '/?category=Women%20Fashion'
  },
  {
    id: 2,
    badge: 'ELECTRONICS SALE',
    title: 'Latest Gadgets & More',
    subtitle: 'Big savings on phones, laptops & accessories.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&h=600&fit=crop',
    cta: 'Shop Electronics',
    to: '/?category=Electronics'
  },
  {
    id: 3,
    badge: 'FREE DELIVERY',
    title: 'Step Into Style',
    subtitle: 'Sneakers, boots & heels - get ready to move.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&h=600&fit=crop',
    cta: 'Shop Footwear',
    to: '/?category=Footwear'
  },
  {
    id: 4,
    badge: 'WELCOME10',
    title: 'Flat 10% Off Your First Order',
    subtitle: 'Use code WELCOME10 at checkout to save instantly.',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1600&h=600&fit=crop',
    cta: 'Shop Now',
    to: '/?sort=newest'
  }
];

function BannerSlider() {
  const [index, setIndex] = useState(0);

  const go = useCallback((dir) => {
    setIndex(prev => (prev + dir + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [go]);

  return (
    <section className="banner-slider">
      {slides.map((s, i) => (
        <div key={s.id} className={`banner-slide ${i === index ? 'active' : ''}`}>
          <img className="banner-image" src={s.image} alt={s.title} />
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <span className="banner-badge">{s.badge}</span>
            <h1>{s.title}</h1>
            <p>{s.subtitle}</p>
            <Link to={s.to} className="banner-cta">{s.cta}</Link>
          </div>
        </div>
      ))}

      <button className="banner-arrow prev" onClick={() => go(-1)} aria-label="Previous slide">&#10094;</button>
      <button className="banner-arrow next" onClick={() => go(1)} aria-label="Next slide">&#10095;</button>

      <div className="banner-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`banner-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default BannerSlider;
