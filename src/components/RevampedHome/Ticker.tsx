import React from 'react';

const Ticker = () => {
  return (
    <div className="ticker">
      <div className="ticker__track">
        <span className="ticker__item">
          <span className="ticker__dot"></span>Ethically Sourced
        </span>
        <span className="ticker__item">
          <span className="ticker__dot"></span>Use Code Fresh50 for free delivery
        </span>
        <span className="ticker__item">
          <span className="ticker__dot"></span>60 Minute Delivery
        </span>
      </div>
    </div>
  );
};

export default Ticker;
