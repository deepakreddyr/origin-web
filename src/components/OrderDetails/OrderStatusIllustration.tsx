import MapLocator from '@/assets/OrderStatusAnimations/map.json';
import { DeliveryStatusDetails } from '@/constants/orderDetailsConstants';
import Lottie from 'lottie-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import MapContainer from './MapContainer';
import StatusBanner from './StatusBanner';
import arrivedAtLocation from '/public/assets/images/arrivedAtLocation.png';
import closeIcon from '/public/assets/images/closeIcon.png';

const OrderStatusIllustration = (props: any) => {
  const { orderDetailsData, fetchOrderdetails } = props;
  const { status, time_formatted, driver, latitude, longitude, status_list } = orderDetailsData;

  const [mapToggle, setMapToggle] = useState(false);

  const formattedStatus = orderDetailsData?.status_list[orderDetailsData.status_list.length - 1];
  const currentStatus = formattedStatus.status_message.toLowerCase() || 'out for delivery';

  const mapDetails = useMemo(() => {
    const isMapDetailsExist = mapToggle && driver && driver.latitude && driver.longitude && latitude && longitude;
    const driverLocation = {
      lat: Number(driver?.latitude || 0),
      lng: Number(driver?.longitude || 0)
    };
    const customerLocation = {
      lat: Number(latitude || 0),
      lng: Number(longitude || 0)
    };
    return { isMapDetailsExist, driverLocation, customerLocation };
  }, [driver, latitude, longitude, mapToggle]);

  const toggleMapView = () => {
    setMapToggle((prev) => !prev);
  };

  const renderIllustration = () => {
    const lastStatus = status_list && status_list.length > 0 ? status_list[status_list.length - 1] : null;
    const currentStatus = lastStatus?.status_message?.toLowerCase() || 'out for delivery';

    const LottieContainer = ({ children }: { children: React.ReactNode }) => (
      <div className="w-full flex items-center justify-center">
        <div className="w-full flex-shrink-0">{children}</div>
      </div>
    );

    if (currentStatus === 'on the way') {
      return (
        <div className="relative w-full h-full">
          {mapDetails.driverLocation.lat !== 0 && mapDetails.driverLocation.lng !== 0 && (
            <button
              className="absolute top-[.6vw] mob:top-[2vw] px-[1.1vw] mob:px-[6.1vw] mob:pl-[3vw] mob:py-[2vw] pl-[.6vw] py-[.3vw] mob:rounded-[1.5vw] rounded-[.5vw] left-[.6vw] mob:left-[2vw] z-[10] flex items-center bg-[white]"
              onClick={toggleMapView}
            >
              {mapToggle ? (
                <div className="relative w-[.97vw] mob:w-[3.6vw] mob:h-[3.6vw] mob:mr-[1.2vw] h-[.97vw] mr-[.4vw] ">
                  <Image src={closeIcon} alt="Close Map" />
                </div>
              ) : (
                <div className="w-[1.5vw] mob:w-[6vw] mob:h-[6vw] h-[1.5vw] ">
                  <Lottie
                    animationData={MapLocator}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
              <span className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold ">
                {mapToggle ? 'Close Map' : 'Map View'}
              </span>
            </button>
          )}
          {mapDetails.isMapDetailsExist &&
          mapDetails.driverLocation.lat !== 0 &&
          mapDetails.driverLocation.lng !== 0 ? (
            <MapContainer
              driverLocation={mapDetails.driverLocation}
              customerLocation={mapDetails.customerLocation}
              fetchOrderdetails={fetchOrderdetails}
            />
          ) : (
            <LottieContainer>
              <Lottie
                animationData={DeliveryStatusDetails['out for delivery'].illustration}
                loop={true}
                autoplay={true}
              />
            </LottieContainer>
          )}
        </div>
      );
    } else if (currentStatus === 'arrived at location') {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Image src={arrivedAtLocation} alt="" className="object-cover w-full h-full" />
        </div>
      );
    }

    const animationData =
      DeliveryStatusDetails[currentStatus]?.illustration || DeliveryStatusDetails['confirmed'].illustration;

    return (
      <LottieContainer>
        <Lottie animationData={animationData} loop={true} autoplay={true} />
      </LottieContainer>
    );
  };

  return (
    <div className="relative">
      <div className="relative z-[1]">
        <div className="w-full mob:h-auto mob:min-h-[90vw] h-full relative overflow-x-hidden">
          {renderIllustration()}
        </div>
        {!mapToggle && (
          <div className="absolute bottom-[1vw] mob:bottom-[3vw] flex items-center justify-between w-full pr-[1.1vw] mob:px-[3vw] ">
            <div className="px-[1.1vw]">
              <p className="font-semibold font-[SofiaPro] text-gray-500 pb-[.4vw] text-[.97vw] mob:text-[3.6vw]">
                {!orderDetailsData.time_slot ? 'Dash Delivery' : 'Time Slot'}
              </p>
              <p className="font-semibold font-[SofiaPro] text-black text-[.97vw] mob:text-[3.6vw]">{time_formatted}</p>
            </div>
            <div>{<StatusBanner orderDetails={orderDetailsData} />}</div>
          </div>
        )}
      </div>
      <div className="relative z-[0] top-[-1vw] bg-black p-[1.1vw] pt-[2vw] mob:pt-[5vw] mob:p-[4vw]  rounded-b-[1.1vw] mob:rounded-b-[3.6vw]">
        <p className="font-semibold font-[SofiaPro] text-white text-[.97vw] mob:text-[3.6vw]">
          {DeliveryStatusDetails[currentStatus]?.text}
        </p>
        <p className="pt-2 text-white font-[SofiaPro] text-[.83vw] mob:text-[3vw]">
          {DeliveryStatusDetails[currentStatus]?.description}
        </p>
      </div>
    </div>
  );
};

export default OrderStatusIllustration;
