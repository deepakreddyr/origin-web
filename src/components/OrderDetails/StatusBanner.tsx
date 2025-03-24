import { DeliveryStatusDetails } from '@/constants/orderDetailsConstants';
import React, { useEffect, useState } from 'react';

const StatusBanner = (props: any) => {
  const { orderDetails, children } = props;

  const lastStatus = orderDetails.status_list[orderDetails.status_list.length - 1];
  const currentStatus = lastStatus.status_message.toLowerCase() || 'out for delivery';

  const [remainingEta, setRemainingEta] = useState(orderDetails?.driver?.eta || 0);

  // Converts seconds into minutes and seconds format
  const convertEtaToMins = (eta: number): string => {
    const minutes = Math.floor(eta / 60);
    const seconds = eta % 60;
    return `${minutes} mins ${Math.floor(seconds)}s`;
  };

  useEffect(() => {
    // Start the countdown when the component mounts or when the eta changes
    setRemainingEta(orderDetails?.driver?.eta || 0);

    const timer = setInterval(() => {
      setRemainingEta((prevEta: any) => {
        if (prevEta > 0) {
          return prevEta - 1;
        } else {
          clearInterval(timer); // Stop the timer when it reaches 0
          return 0;
        }
      });
    }, 5000);

    // Cleanup the interval on component unmount or when eta changes
    return () => clearInterval(timer);
  }, [orderDetails?.driver?.eta]);
  return (
    <div
      style={{
        background: DeliveryStatusDetails[currentStatus].background,
        color: DeliveryStatusDetails[currentStatus].color
      }}
      className="relative p-1 rounded-[.7vw] text-white min-w-[7vw]"
    >
      <div className="p-2 rounded-[.4vw] border border-gray-300 relative">
        <span className="absolute top-[-.5vw] mob:top-[-3vw] left-[.2vw] text-base">.</span>
        <span className="absolute top-[-.5vw] mob:top-[-3vw] right-[.2vw] text-base">.</span>
        <div className="flex flex-col items-center justify-center">
          <p className="text-[.7vw] mob:text-[3vw] font-[SofiaPro] font-semibold pb-[.3vw]">
            {DeliveryStatusDetails[currentStatus].statusTitle}
          </p>
          <p className="text-[.83vw] mob:text-[3vw] font-[SofiaPro] font-semibold ">
            {DeliveryStatusDetails[currentStatus]?.statusDesc === 'timer'
              ? convertEtaToMins(remainingEta)
              : DeliveryStatusDetails[currentStatus]?.statusDesc}
          </p>
        </div>
        <span className="absolute bottom-[0vw] left-[.2vw] text-base">.</span>
        <span className="absolute bottom-[0vw] right-[.2vw] text-base">.</span>
      </div>
    </div>
  );
};

export default StatusBanner;
