import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedEvent = () => {
  return (
    <section className="section-pad texture-cream">
      <div className="wrap">
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '56px' }} data-reveal="true">
          <div className="media media--4-5">
            <Image
              src="/assets/revamp/Images/thai-market.jpg"
              alt="OG Thai Market"
              layout="fill"
              objectFit="cover"
              unoptimized={true}
            />
          </div>
          <div>
            <span className="eyebrow block mb-3">Featured Event</span>
            <h2 className="h-lg mb-4">OG Thai Market</h2>
            <p className="lede mb-4">Chennai &middot; Sept 19th &amp; 20th</p>
            <p className="body-copy mb-6">
              Experience the best of Thailand, in a Thai-market inspired event. From galangal, to Pandan, Mangosteen,
              Rambutan and more. All of this in one place.
            </p>
            <p className="body-copy mb-8" style={{ fontWeight: 600 }}>
              Anna Nagar &middot; Besant Nagar
            </p>
            <Link href="#" className="btn btn-outline">
              Get Directions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;
