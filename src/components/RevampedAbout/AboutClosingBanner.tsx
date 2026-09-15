import React from 'react';
import Link from 'next/link';

const AboutClosingBanner = () => {
  return (
    <section className="about-closing" data-reveal="true">
      <div className="media about-closing__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/revamp/Images/About/closing-banner.jpg" alt="Freshly harvested produce." loading="lazy" />
      </div>
      <div className="about-closing__scrim"></div>
      <div className="about-closing__copy">
        <span className="eyebrow" style={{ color: 'var(--yellow-200)' }}>
          Experience Freshness
        </span>
        <h2 className="about-closing__title">Experience Freshness Like Never Before.</h2>
        <p className="about-closing__sub">
          From our farms to your favourite recipes: freshness you can taste, sourcing you can trust.
        </p>
        <Link href="/shop" className="btn btn-yellow">
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default AboutClosingBanner;
