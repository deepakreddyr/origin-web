'use client';
import React, { useEffect, useState } from 'react';

interface RestrictionData {
  title: string;
  description: string;
  until: number | string; // if your API gives string, keep this
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

  if (!orderRestrictionData || !showPopup) return null;

  return (
    <div className=" bg-[#F2EEE44D] flex flex-col border border-[#F2EEE4] p-[1.1vw] mob:py-[4.1vw] px-0 mob:rounded-[4.1vw] rounded-[1.1vw]">
      
        <div className="flex items-center justify-center mb-[0.8vw] mob:mb-[2vw]">
          {/* <div className="w-[1.5vw] h-[1.5vw] mob:w-[5vw] mob:h-[5vw] bg-red-500 rounded-full flex items-center justify-center mr-[0.8vw] mob:mr-[2vw]">
            <span className="text-white text-[0.8vw] mob:text-[2.5vw] font-bold">!</span>
          </div> */}
          <h3 className="font-[SofiaPro] text-[1.1vw] mob:text-[4vw] font-bold text-red-700">
            {/* {orderRestrictionData.title} */}
          </h3>
        </div>
        <p className="font-[SofiaPro] text-[0.9vw] mob:text-[3.2vw] text-center text-green-600 leading-relaxed">
          { "Beauty sleep mode on. See you at 4 AM?" }
          {/* || orderRestrictionData.description */}
        </p>
        <p className="font-[SofiaPro] text-[0.9vw] mob:text-[3.2vw] text-center text-green-600 leading-relaxed">
          { "Just Kidding our drivers deliver only from 8PM to 5AM" }
          {/* || orderRestrictionData.description */}
        </p>
      </div>
  );
};

export default RestrictOrderInfo;
