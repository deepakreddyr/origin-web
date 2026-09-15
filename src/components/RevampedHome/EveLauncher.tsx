import React from 'react';

const EveLauncher = () => {
  return (
    <button className="eve-launcher" aria-label="Open Eve, your Origin Fresh shopping assistant">
      <span className="eve-launcher__orb"></span>
      <span>
        <span className="eve-launcher__label">Talk to Eve</span>
        <span className="eve-launcher__sub">Your shopping assistant</span>
      </span>
    </button>
  );
};

export default EveLauncher;
