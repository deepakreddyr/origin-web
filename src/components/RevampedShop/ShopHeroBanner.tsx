import React from 'react';

const ShopHeroBanner = () => {
  return (
    <section className="hero">
      <div className="media media--hero" style={{ borderRadius: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/revamp/Images/Shop/hero-banner-web.jpg" alt="Fresh produce at Origin Fresh" loading="lazy" />
      </div>
      <div className="hero__overlay">
        <div className="wrap">
          <h1 className="h-xl hero__title font-recleta font-bold" data-reveal="true">
            Shop
          </h1>
          <p className="lede mt-[1vw]" data-reveal="true" style={{ color: 'rgba(255,253,248,.85)' }}>
            Everything on this page left a farm within the last two days.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShopHeroBanner;
