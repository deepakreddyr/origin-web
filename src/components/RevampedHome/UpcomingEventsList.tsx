import React from 'react';

const UpcomingEventsList = () => {
  return (
    <section className="section-pad-sm texture-cream">
      <div className="wrap" data-reveal="true">
        <span className="eyebrow">Events</span>
        <article
          className="card"
          style={{ maxWidth: '420px', display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'stretch' }}
        >
          <div className="media media--1-1" style={{ borderRadius: 0 }}>
            <span className="media__label">IMAGE</span>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="card__title">Vegan Market 2027</p>
            <p className="card__meta">Date TBD</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default UpcomingEventsList;
