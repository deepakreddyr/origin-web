import React from 'react';
import Link from 'next/link';

const OrganicBanner = () => {
  return (
    <div className="texture-cream">
      <section className="texture-ink organic-banner organic-banner--bleed" data-reveal="true">
        <video
          className="organic-banner__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/revamp/Video/organic-poster.jpg"
        >
          <source src="/assets/revamp/Video/organic-web.mp4" type="video/mp4" />
        </video>
        <div className="organic-banner__scrim"></div>
        <div className="organic-banner__copy">
          <span className="eyebrow">100% Organic</span>
          <h2 className="organic-banner__title">Organic to the core.</h2>
          <p className="organic-banner__sub">From soil to shoot.</p>
          <Link href="/shop" className="btn btn-yellow">
            Explore Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OrganicBanner;
