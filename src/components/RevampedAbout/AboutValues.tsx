import React from 'react';

const AboutValues = () => {
  return (
    <section className="section-pad texture-cream">
      <div className="wrap">
        <div className="about-section-head" data-reveal="true">
          <span className="eyebrow">Values We Grow By</span>
          <h2 className="h-lg">Values We Grow By</h2>
        </div>
        <div className="grid grid-2" style={{ gap: '24px' }} data-reveal="true">
          <div className="value-card">
            <span className="value-card__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" />
              </svg>
            </span>
            <div>
              <p className="value-card__title">Integrity</p>
              <p className="value-card__text">What we say about a product is what's actually in the box.</p>
            </div>
          </div>
          <div className="value-card">
            <span className="value-card__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="8" r="3" />
                <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
                <circle cx="17" cy="9" r="2.5" />
                <path d="M16 14c2.8.3 5 2.3 5 6" />
              </svg>
            </span>
            <div>
              <p className="value-card__title">Community</p>
              <p className="value-card__text">Farmer prosperity isn't a side effect of our business. It's the point.</p>
            </div>
          </div>
          <div className="value-card">
            <span className="value-card__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" />
              </svg>
            </span>
            <div>
              <p className="value-card__title">Sustainability</p>
              <p className="value-card__text">
                90% of our last-mile delivery already runs on EVs, with 100% targeted by 2030.
              </p>
            </div>
          </div>
          <div className="value-card">
            <span className="value-card__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
              </svg>
            </span>
            <div>
              <p className="value-card__title">Craft</p>
              <p className="value-card__text">Every product is tested by us before it ever reaches our shelves.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
