import React from 'react';
import Link from 'next/link';

const UpcomingEvent = () => {
  return (
    <section className="section-pad section-pad--tight-t texture-cream">
      <div className="wrap">
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '56px' }} data-reveal="true">
          <div className="media media--4-5">
            <img src="/assets/revamp/Images/thai-market.jpg" alt="OG Thai Market" loading="lazy" />
          </div>
          <div>
            <span className="eyebrow mb-[12px] block">Upcoming Event</span>
            <h2 className="h-lg mb-[16px]">OG Thai Market</h2>
            <p className="lede mb-[16px]">Chennai · Sept 19th &amp; 20th</p>
            <p className="body-copy mb-[16px]">
              Experience the best of Thailand, in a Thai-market inspired event. From galangal, to Pandan, Mangosteen,
              Rambutan and more. All of this in one place.
            </p>
            <p className="body-copy mb-[16px]" style={{ fontWeight: 600 }}>
              Anna Nagar | Besant Nagar
            </p>
            <Link href="/events" className="btn btn-outline">
              See Event Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvent;
