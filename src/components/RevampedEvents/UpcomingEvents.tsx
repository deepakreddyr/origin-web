import React from 'react';
import Image from 'next/image';

const UpcomingEvents = () => {
  return (
    <section className="section-pad texture-paper" data-reveal="true">
      <div className="wrap">
        <div data-reveal="true" style={{ maxWidth: '560px', marginBottom: '32px' }}>
          <span className="eyebrow">Upcoming Events</span>
          <h2 className="h-lg">Save the date.</h2>
        </div>
        <div className="grid grid-4" data-reveal="true">
          <article className="card">
            <div className="media media--1-1">
              <Image
                src="/assets/revamp/Images/thai-market.jpg"
                alt="OG Thai Market"
                layout="fill"
                objectFit="cover"
                unoptimized={true}
              />
            </div>
            <div className="card__body">
              <p className="card__title">OG Thai Market</p>
              <p className="card__meta">Sept 19-20 &middot; Anna Nagar &amp; Besant Nagar</p>
            </div>
          </article>
          <article className="card">
            <div className="media media--1-1">
              <span className="media__label">
                vegan-market.jpg
                <br />
                event photo
              </span>
            </div>
            <div className="card__body">
              <p className="card__title">Vegan Market 2027</p>
              <p className="card__meta">Date TBD</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
