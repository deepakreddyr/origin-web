import React from 'react';

const SubscriptionHero = () => {
  return (
    <section style={{ width: '100%', position: 'relative' }}>
      <picture>
        <source media="(max-width: 600px)" srcSet="/assets/images/subpagebannermob.webp" />
        <img
          src="/assets/images/subpagebannerweb.webp"
          alt="Subscription Hero Banner"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
          loading="eager"
        />
      </picture>
    </section>
  );
};

export default SubscriptionHero;
