import React from 'react';

const WhyChooseOrigin = () => {
  return (
    <section className="texture-cream fruit-video fruit-video--bleed" data-reveal="true">
      <video
        className="fruit-video__media"
        muted
        loop
        playsInline
        autoPlay
        poster="/assets/revamp/Video/orange-tree-poster.jpg"
      >
        <source src="/assets/revamp/Video/orange-tree-web.mp4" type="video/mp4" />
      </video>
      <div className="fruit-video__scrim"></div>
      <div className="fruit-video__copy">
        <span className="eyebrow">Why Choose Origin Fresh?</span>
        <h2 className="h-lg">From all the brands in all the countries, why us?</h2>
      </div>

      <button className="fruit-hotspot" style={{ '--x': '42%', '--y': '50%' } as React.CSSProperties}>
        <span className="fruit-hotspot__dot"></span>
        <span className="fruit-hotspot__tip">10,000+ farmer families. No middlemen, ever.</span>
      </button>
      <button className="fruit-hotspot" style={{ '--x': '70%', '--y': '58%' } as React.CSSProperties}>
        <span className="fruit-hotspot__dot"></span>
        <span className="fruit-hotspot__tip">Every batch tasted and inspected before it's listed.</span>
      </button>
      <button className="fruit-hotspot" style={{ '--x': '49%', '--y': '80%' } as React.CSSProperties}>
        <span className="fruit-hotspot__dot"></span>
        <span className="fruit-hotspot__tip">Harvest, wash, sort, chill, pack. Nothing skipped.</span>
      </button>
      <button className="fruit-hotspot" style={{ '--x': '82%', '--y': '79%' } as React.CSSProperties}>
        <span className="fruit-hotspot__dot"></span>
        <span className="fruit-hotspot__tip">Picked this week. On your counter within 48 hours.</span>
      </button>
    </section>
  );
};

export default WhyChooseOrigin;
