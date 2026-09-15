import React from 'react';
import Link from 'next/link';

const OGRecommends = () => {
  return (
    <section className="section-pad section-pad--tight-b texture-cream">
      <div className="wrap">
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '56px' }} data-reveal="true">
          <div style={{ order: 2 }}>
            <span className="eyebrow mb-[12px] block">OG Recommends</span>
            <h2 className="h-lg mb-[16px]">Wild Cherries from The US of A.</h2>
            <p className="body-copy mb-[32px]">
              Hand-picked at peak ripeness and cold-shipped straight from the orchard. A taste you won't find on any
              other shelf.
            </p>
            <Link href="/shop" className="btn btn-outline">
              Shop Wild Cherries
            </Link>
          </div>
          <div className="media media--4-5" style={{ order: 1 }}>
            <img src="/assets/revamp/Images/wild-cherries.jpg" alt="Wild Cherries from The US of A." loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OGRecommends;
