import React from 'react';
import Link from 'next/link';

const PromoBanner = () => {
  return (
    <section className="section-pad-sm section-pad-sm--tight-t section-pad-sm--tight-b texture-cream">
      <div className="wrap" data-reveal="true">
        <div className="promo-banner promo-banner--compact">
          <div className="promo-banner__text">
            <span className="eyebrow">Limited Time</span>
            <h2 className="h-md">
              First order? Take 20% off with code <span className="promo-banner__code">OGFIRST</span>
            </h2>
          </div>
          <Link href="/shop" className="btn btn-outline promo-banner__btn">
            Claim Offer
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
