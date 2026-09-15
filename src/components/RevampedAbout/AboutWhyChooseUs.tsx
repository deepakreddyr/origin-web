import React from 'react';

const AboutWhyChooseUs = () => {
  return (
    <section className="section-pad texture-cream">
      <div className="wrap">
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '56px' }} data-reveal="true">
          <div className="media media--4-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/revamp/Images/About/what-web.jpg"
              alt="Origin Fresh produce, freshly packed"
              loading="lazy"
            />
          </div>
          <div>
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="h-lg">What makes us Origin Fresh</h2>
            <div className="checklist">
              <div className="checklist__item">
                <span className="checklist__check">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="checklist__title">150+ Fruits and veggies</p>
              </div>
              <div className="checklist__item">
                <span className="checklist__check">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="checklist__title">Less than 5% wastage</p>
              </div>
              <div className="checklist__item">
                <span className="checklist__check">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="checklist__title">Direct from farmer procurement</p>
              </div>
              <div className="checklist__item">
                <span className="checklist__check">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="checklist__title">5-step quality check</p>
              </div>
              <div className="checklist__item">
                <span className="checklist__check">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="checklist__title">Smart packaging to preserve freshness</p>
              </div>
              <div className="checklist__item">
                <span className="checklist__check">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="checklist__title">Ripeness Quotient to personalise shopping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutWhyChooseUs;
