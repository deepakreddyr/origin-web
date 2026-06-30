import { DeliveryStatusDetails } from '@/constants/orderDetailsConstants';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';

const StatusBanner = (props: any) => {
  const { orderDetails, children } = props;

  const lastStatus = orderDetails.status_list?.[orderDetails.status_list.length - 1];
  const currentStatus = lastStatus?.status_message?.toLowerCase() || 'out for delivery';

  const getRemainingDuration = () => {
    // 1. Primary Calculation (LBNP End Time)
    if (orderDetails?.lbnp?.end_time) {
      let endTime = orderDetails.lbnp.end_time;
      // Safely handle string/number, seconds/milliseconds
      if (typeof endTime === 'string') endTime = Number(endTime);
      // If it's in seconds (typical epoch < 10^12), multiply by 1000
      if (endTime < 1000000000000) endTime *= 1000;

      const targetArrival = DateTime.fromMillis(endTime).setZone('Asia/Kolkata');
      const now = DateTime.now().setZone('Asia/Kolkata');
      return targetArrival.diff(now);
    }

    // 2. Fallback Calculation (Driver ETA)
    const driverEta = orderDetails?.driver?.eta;
    const startedAt = orderDetails?.driver?.previous_order_started_at;

    if (driverEta && startedAt) {
      let startTime = startedAt;
      if (typeof startTime === 'string') startTime = Number(startTime);
      if (startTime < 1000000000000) startTime *= 1000;

      const targetArrival = DateTime.fromMillis(startTime)
        .setZone('Asia/Kolkata')
        .plus({ seconds: Number(driverEta) });

      const now = DateTime.now().setZone('Asia/Kolkata');
      return targetArrival.diff(now);
    }

    return null;
  };

  const [remainingDuration, setRemainingDuration] = useState(getRemainingDuration());

  useEffect(() => {
    // Start the countdown when the component mounts or when the eta changes
    setRemainingDuration(getRemainingDuration());

    const timer = setInterval(() => {
      setRemainingDuration(getRemainingDuration());
    }, 1000);

    // Cleanup the interval on component unmount or when eta changes
    return () => clearInterval(timer);
  }, [orderDetails?.driver?.eta, orderDetails?.driver?.previous_order_started_at, orderDetails?.lbnp?.end_time]);

  const isTimerStatus = DeliveryStatusDetails[currentStatus]?.statusDesc === 'timer';

  // "if the eta is coming as 0 do not show the box"
  const hasLbnp = !!orderDetails?.lbnp?.end_time;
  const isEtaZeroOrMissing = !hasLbnp && (!orderDetails?.driver?.eta || orderDetails?.driver?.eta === 0);

  if (isTimerStatus && isEtaZeroOrMissing) {
    return null;
  }

  // 3. Display Formatting & Live Updates
  const getFormattedETA = (): string | null => {
    if (!remainingDuration) return '2 mins';

    const totalMinutes = Math.floor(remainingDuration.as('minutes'));

    // If it's over 120 minutes, it hides the timer.
    if (totalMinutes > 120) {
      return null;
    }

    // Graceful Fallback: If the time difference is less than zero or < 2 mins, defaults to displaying "2 minutes".
    if (totalMinutes < 2) {
      return '2 mins';
    }

    // Intelligently formats the countdown (e.g., "1 hr 15 mins" or "45 mins").
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return `${hours} hr ${mins > 0 ? `${mins} mins` : ''}`.trim();
    }

    return `${totalMinutes} mins`;
  };

  const formattedEtaText = getFormattedETA();

  // If the logic dictates we hide the timer (e.g., over 120 mins)
  if (isTimerStatus && !formattedEtaText) {
    return null;
  }

  return (
    <div
      style={{
        background: '#302C2D',
        color: '#FFF2B4',
        border: '0.4px solid #FFFFFF66'
      }}
      className="relative p-[.5vw] mob:p-[1.5vw] rounded-[.7vw] mob:rounded-[2vw] min-w-[8vw] mob:min-w-[25vw]"
    >
      <div className="px-[1vw] py-[.5vw] mob:px-[4vw] mob:py-[2vw] rounded-[.4vw] mob:rounded-[1.2vw] relative">
        <span className="absolute top-[-.5vw] mob:top-[-3vw] left-[.2vw] text-base">.</span>
        <span className="absolute top-[-.5vw] mob:top-[-3vw] right-[.2vw] text-base">.</span>
        <div className="flex flex-col items-center justify-center">
          <p
            className="text-[.7vw] mob:text-[3vw] font-[SofiaPro] font-semibold pb-[.3vw]"
            style={{ color: '#FFF2B4' }}
          >
            {DeliveryStatusDetails[currentStatus]?.statusTitle || ''}
          </p>
          <p className="text-[.83vw] mob:text-[3vw] font-[SofiaPro] font-semibold" style={{ color: '#FFF2B4' }}>
            {isTimerStatus ? formattedEtaText : DeliveryStatusDetails[currentStatus]?.statusDesc}
          </p>
        </div>
        <span className="absolute bottom-[0vw] left-[.2vw] text-base">.</span>
        <span className="absolute bottom-[0vw] right-[.2vw] text-base">.</span>
      </div>
    </div>
  );
};

export default StatusBanner;
