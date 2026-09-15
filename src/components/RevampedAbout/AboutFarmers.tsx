import React from 'react';

const AboutFarmers = () => {
  return (
    <section className="section-pad texture-paper">
      <div className="wrap">
        <div className="about-section-head" data-reveal="true">
          <span className="eyebrow">Nourishing Communities at the Source</span>
          <h2 className="h-lg">Farmers first. Always.</h2>
        </div>
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '56px' }} data-reveal="true">
          <div className="media media--4-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/revamp/Images/About/farmer-3.jpg" alt="Origin Fresh farmer in the field" loading="lazy" />
          </div>
          <p className="body-copy" style={{ margin: 0 }}>
            We don't buy from mandis or middlemen. We buy directly from more than 10,000 farmers across India for the
            whole harvest, not just what looks perfect. That means less waste for them, and better produce for you.
            Every relationship is direct and fair, and everything is picked at peak ripeness and moved same-day,
            straight from the field to your fridge, with no cold-store limbo in between.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutFarmers;
