import { DeliveryStatusDetails } from '@/constants/orderDetailsConstants';
import React, { useEffect, useState } from 'react';

const StatusBanner = (props: any) => {
  const { orderDetails, children } = props;

  const lastStatus = orderDetails.status_list[orderDetails.status_list.length - 1];
  const currentStatus = lastStatus.status_message.toLowerCase() || 'out for delivery';

  const getEtaInSeconds = () => {
    if (orderDetails?.lbnp?.end_time) {
      const nowEpoch = Math.floor(Date.now() / 1000);
      const diff = orderDetails.lbnp.end_time - nowEpoch;
      // If lbnp is present, use the remaining time. If it's already past, show minimum 2 mins.
      return diff > 120 ? diff : 120;
    }
    // Fallback: use driver.eta (already in seconds)
    return orderDetails?.driver?.eta || 0;
  };

  const [remainingEta, setRemainingEta] = useState(getEtaInSeconds());

  const MIN_ETA_SECONDS = 120;
  // lbnp exists but start_time or end_time is missing → hide ETA entirely
  const lbnpExistsButNoTimes = !!orderDetails?.lbnp && (!orderDetails.lbnp.start_time || !orderDetails.lbnp.end_time);
  const hasLbnp = !!orderDetails?.lbnp?.end_time;

  // Converts seconds into minutes and seconds format
  const convertEtaToMins = (eta: number): string => {
    if (hasLbnp && eta <= MIN_ETA_SECONDS) return '2 mins';
    const minutes = Math.floor(eta / 60);
    const seconds = eta % 60;
    return `${minutes} mins ${Math.floor(seconds)}s`;
  };

  useEffect(() => {
    // Start the countdown when the component mounts or when the eta changes
    setRemainingEta(getEtaInSeconds());

    const timer = setInterval(() => {
      setRemainingEta((prevEta: any) => {
        // If lbnp is present, never go below 2 mins (120s)
        const minEta = hasLbnp ? MIN_ETA_SECONDS : 0;
        if (prevEta > minEta) {
          return prevEta - 1;
        } else {
          if (!hasLbnp) clearInterval(timer);
          return minEta;
        }
      });
    }, 1000);

    // Cleanup the interval on component unmount or when eta changes
    return () => clearInterval(timer);
  }, [orderDetails?.driver?.eta, orderDetails?.lbnp?.start_time, orderDetails?.lbnp?.end_time]);
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
              ? lbnpExistsButNoTimes
                ? null
                : convertEtaToMins(remainingEta)
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
