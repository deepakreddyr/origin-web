'use client';
import React, { useEffect, useState } from 'react';

interface RestrictionData {
  title: string;
  description: string;
  until: number | string;
  is_available: boolean;
}

interface RestrictOrderInfoProps {
  orderRestrictionData: RestrictionData | null;
}

const RestrictOrderInfo: React.FC<RestrictOrderInfoProps> = ({ orderRestrictionData }) => {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    if (orderRestrictionData?.until) {
      const untilTime =
        typeof orderRestrictionData.until === 'string'
          ? parseInt(orderRestrictionData.until)
          : orderRestrictionData.until;

      const currentTime = Date.now();
      const remainingTime = untilTime - currentTime;

      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          setShowPopup(false);
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        setShowPopup(false);
      }
    }
  }, [orderRestrictionData?.until]);

  if (!orderRestrictionData) return null;

  return (
    <div className="flex items-center gap-[2.5vw] mob:gap-[3.5vw] bg-[#FFF0F0] border border-[#FFCCCC] rounded-[1.1vw] mob:rounded-[4.1vw] px-[1.5vw] mob:px-[4vw] py-[1.1vw] mob:py-[3.5vw]">
      {/* Red badge */}
      {/* <div className="flex-shrink-0 bg-[#CC0000] rounded-[0.6vw] mob:rounded-[2vw] px-[0.8vw] mob:px-[2.5vw] py-[0.6vw] mob:py-[2vw] flex flex-col items-center justify-center min-w-[5vw] mob:min-w-[18vw]">
        <p className="font-[SofiaPro] text-white text-[0.65vw] mob:text-[2.8vw] font-semibold leading-tight text-center">
          Sorry we&apos;re
        </p>
        <p className="font-[SofiaPro] text-white text-[0.85vw] mob:text-[3.5vw] font-black leading-tight tracking-wide text-center uppercase">
          {orderRestrictionData.title || 'CLOSED'}
        </p>
      </div> */}

      {/* Description */}
      <p className="font-[SofiaPro] text-[1vw] mob:text-[3vw] text-[#231f20] leading-snug">
        {orderRestrictionData.description}
      </p>
    </div>
  );
};

export default RestrictOrderInfo;
