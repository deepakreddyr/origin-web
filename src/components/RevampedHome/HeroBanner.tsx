import React from 'react';
import Link from 'next/link';

const HeroBanner = () => {
  return (
    <section className="hero">
      <div className="media media--hero" style={{ borderRadius: 0 }}>
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/revamp/Video/home-hero-poster.jpg"
        >
          <source src="/assets/revamp/Video/home-hero-web.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero__overlay">
        <div className="wrap">
          <h1 className="h-xl hero__title font-recleta font-bold" data-reveal="true">
            Sun. Soil. Soul. &amp; Taste.
          </h1>
          <p className="lede mt-[1vw]" data-reveal="true" style={{ color: 'rgba(255,253,248,.85)' }}>
            Farm-fresh groceries, delivered to your door in 60 minutes.
          </p>
          <div className="hero__ctas" data-reveal="true">
            <Link href="/shop" className="btn btn-yellow">
              Shop This Week's Picks
            </Link>
            <Link href="/about" className="btn btn-outline" style={{ color: '#fffdf8' }}>
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
