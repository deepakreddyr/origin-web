import React from 'react';
import Link from 'next/link';

const AboutStores = () => {
  return (
    <section className="section-pad texture-cream">
      <div className="wrap">
        <div className="about-section-head" data-reveal="true">
          <span className="eyebrow">Origin Fresh is Here</span>
          <h2 className="h-lg">Step inside.</h2>
        </div>
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '56px' }} data-reveal="true">
          <div className="media media--4-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/revamp/Images/About/mysore-image-2-web.jpg"
              alt="Origin Fresh experience store interior, Mysore"
              loading="lazy"
            />
          </div>
          <div>
            <p className="body-copy mb-[24px]">
              We're not just another app. Step into an Origin Fresh experience store and taste the difference
              direct-from-farm makes: fresh cuts, seasonal produce, and the same-day harvest you order online.
            </p>
            <p className="body-copy mb-[40px]" style={{ fontWeight: 600 }}>
              Bangalore · Chennai · Mysore · Pune
            </p>
            <Link href="/about" className="btn btn-outline inline-block">
              Find a Store Near You
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStores;
