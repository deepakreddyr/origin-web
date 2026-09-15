import React from 'react';
import Link from 'next/link';

const ExperienceStores = () => {
  return (
    <section className="store-cta-banner" data-reveal="true">
      <div className="media aspect-[4/3] md:aspect-[21/9]" style={{ borderRadius: 0 }}>
        <img src="/assets/revamp/Images/mysore-store.jpg" alt="Origin Fresh, Mysore experience store" loading="lazy" />
      </div>
      <div className="store-cta-banner__scrim"></div>
      <div className="store-cta-banner__copy">
        <span className="eyebrow" style={{ color: 'var(--yellow-200)' }}>
          Experience Stores
        </span>
        <h2 className="store-cta-banner__title">We're not just another app.</h2>
        <p className="store-cta-banner__sub">Visit our experience stores.</p>
        <Link href="/about" className="btn btn-yellow">
          Find a Store Near You
        </Link>
      </div>
    </section>
  );
};

export default ExperienceStores;
