import React from 'react';

const AboutHowItWorks = () => {
  return (
    <section className="section-pad texture-paper">
      <div className="wrap">
        <div className="about-section-head" data-reveal="true">
          <span className="eyebrow">How Origin Fresh Works</span>
        </div>

        <div
          className="grid grid-2"
          style={{ alignItems: 'center', gap: '56px', marginBottom: '32px' }}
          data-reveal="true"
        >
          <div className="media media--4-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/revamp/Images/About/how-web.jpg"
              alt="Origin Fresh supply chain, farm to doorstep"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="h-lg">A supply chain built to preserve fresh</h2>
            <p className="body-copy">Everything you get in your order has been harvested no more than 48 hours ago.</p>
          </div>
        </div>

        <div className="grid grid-4" data-reveal="true">
          <div className="icon-card">
            <div className="icon-card__top">
              <span className="icon-card__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22V12M12 12C12 7 16 3 21 3C21 8 17 12 12 12ZM12 12C12 8 9 5 5 5C5 9 8 12 12 12Z" />
                </svg>
              </span>
              <span className="icon-card__num">01</span>
            </div>
            <p className="icon-card__title">Direct Sourcing</p>
            <p className="icon-card__text">We source directly from farms, cutting out mandis and middlemen.</p>
          </div>
          <div className="icon-card">
            <div className="icon-card__top">
              <span className="icon-card__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <span className="icon-card__num">02</span>
            </div>
            <p className="icon-card__title">Quality Checked</p>
            <p className="icon-card__text">
              Every product passes a 5-step quality check before it leaves our collection centres.
            </p>
          </div>
          <div className="icon-card">
            <div className="icon-card__top">
              <span className="icon-card__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 16V6a1 1 0 011-1h9v11" />
                  <path d="M13 9h4l3 3v4h-7" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                </svg>
              </span>
              <span className="icon-card__num">03</span>
            </div>
            <p className="icon-card__title">Fast Delivery</p>
            <p className="icon-card__text">
              Orders are packed and delivered within 60 minutes, most of it on electric vehicles.
            </p>
          </div>
          <div className="icon-card">
            <div className="icon-card__top">
              <span className="icon-card__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v10M9 9.5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5-1.3 2-3 2.5-3 1-3 2.5 1.3 2.5 3 2.5 3-1 3-2.5" />
                </svg>
              </span>
              <span className="icon-card__num">04</span>
            </div>
            <p className="icon-card__title">Fair Pay</p>
            <p className="icon-card__text">
              Farmers get paid fairly and fast, including interest-free loans when they need them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHowItWorks;
