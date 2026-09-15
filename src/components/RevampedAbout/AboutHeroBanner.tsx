import React from 'react';

const AboutHeroBanner = () => {
  return (
    <section className="hero">
      <div className="media media--hero" style={{ borderRadius: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/revamp/Images/About/hero-portrait.jpg" alt="Fresh greens, close up." loading="lazy" />
      </div>
      <div className="hero__overlay">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--yellow-200)' }}>
            Our Story
          </span>
          <h1 className="h-xl hero__title" data-reveal="true">
            The Origin Story.
          </h1>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroBanner;
