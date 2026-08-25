import MapLocator from '@/assets/OrderStatusAnimations/map.json';
import { DeliveryStatusDetails } from '@/constants/orderDetailsConstants';
import Lottie from 'lottie-react';
import PersonIcon from '@mui/icons-material/Person';
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

  // lbnp tracking URL — used ONLY in the map/animation area
  const trackingUrl = orderDetailsData?.lbnp?.tracking_url;

  // prorouting data
  const prorouting = orderDetailsData?.prorouting ?? null;
  const proroutingTrackingUrl = prorouting?.order?.tracking_url ?? null;

  // prorouting_track_status: live rider coordinates, fallback to prorouting.order.rider.last_location
  const trackStatusRider = orderDetailsData?.prorouting_track_status?.orders?.[0]?.rider;
  const trackStatusLocation = trackStatusRider?.last_location || prorouting?.order?.rider?.last_location;
  const hasTrackStatusCoords =
    !!trackStatusLocation?.lat &&
    !!trackStatusLocation?.lng &&
    trackStatusLocation.lat !== 0 &&
    trackStatusLocation.lng !== 0;

  const mapDetails = useMemo(() => {
    // Driver location: prefer prorouting_track_status rider coords, fall back to driver
    const driverLocation = hasTrackStatusCoords
      ? { lat: trackStatusLocation!.lat!, lng: trackStatusLocation!.lng! }
      : { lat: Number(driver?.latitude || 0), lng: Number(driver?.longitude || 0) };

    const customerLocation = {
      lat: Number(latitude || 0),
      lng: Number(longitude || 0)
    };

    const hasValidDriverLocation = driverLocation.lat !== 0 && driverLocation.lng !== 0;

    const isActiveTrackingStatus = ['out for delivery', 'on the way', 'nearby', 'arrived at location'].includes(
      currentStatus
    );

    // MAP VIEW: show when valid coordinates available and order is in active tracking state
    const isMapAvailable = isActiveTrackingStatus && hasValidDriverLocation;
    const isMapDetailsExist = mapToggle && isMapAvailable;

    // TRACK ORDER: only when no coords but a tracking URL exists and order is in active tracking state
    const isTrackUrlOnly = isActiveTrackingStatus && !isMapAvailable && !!(trackingUrl || proroutingTrackingUrl);
    const resolvedTrackingUrl = trackingUrl || proroutingTrackingUrl;

    return {
      isMapDetailsExist,
      isMapAvailable,
      isTrackUrlOnly,
      resolvedTrackingUrl,
      driverLocation,
      customerLocation,
      isActiveTrackingStatus
    };
  }, [
    orderDetailsData,
    driver,
    latitude,
    longitude,
    mapToggle,
    hasTrackStatusCoords,
    trackStatusLocation,
    trackingUrl,
    proroutingTrackingUrl
  ]);

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
      // Show animation; map button is rendered at the top level
      return (
        <LottieContainer>
          <Lottie animationData={DeliveryStatusDetails['out for delivery'].illustration} loop={true} autoplay={true} />
        </LottieContainer>
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

  const lbnp = orderDetailsData?.lbnp ?? null;
  const hasLbnp = !!lbnp;

  // Resolve agent name & phone from lbnp or prorouting only (not driver)
  const resolvedAgentName = lbnp?.agent_name || prorouting?.order?.rider?.name || null;
  const resolvedAgentPhone = lbnp?.agent_phone || prorouting?.order?.rider?.phone || null;

  // agentName is null when rider not yet assigned (prorouting early state)
  const agentName = resolvedAgentName ?? null;
  const agentPhone = resolvedAgentPhone;

  // OTP: prefer lbnp dcc, fall back to prorouting_delivery_otp
  const otp = lbnp?.dcc || orderDetailsData?.prorouting_delivery_otp;

  // Show lbnp tracking map button only when lbnp.tracking_url is present and active tracking status
  const showTrackingMapButton = mapDetails.isActiveTrackingStatus && !!trackingUrl && !!agentName && hasLbnp;

  return (
    <div className="relative">
      <div className="relative z-[1]">
        <div className="w-full relative overflow-hidden">
          {/* lbnp iframe map overlay (only for lbnp tracking url) */}
          {showTrackingMapButton && mapToggle ? (
            <div className="relative w-full h-full">
              <button
                className="absolute top-[.6vw] mob:top-[2vw] px-[1.1vw] mob:px-[6.1vw] mob:pl-[3vw] mob:py-[2vw] pl-[.6vw] py-[.3vw] mob:rounded-[1.5vw] rounded-[.5vw] left-[.6vw] mob:left-[2vw] z-[10] flex items-center bg-[white]"
                onClick={toggleMapView}
              >
                <div className="relative w-[.97vw] mob:w-[3.6vw] mob:h-[3.6vw] mob:mr-[1.2vw] h-[.97vw] mr-[.4vw]">
                  <Image src={closeIcon} alt="Close Map" />
                </div>
                <span className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold">Close Map</span>
              </button>
              <div className="relative w-full h-full mob:min-h-[90vw] min-h-[30vw]">
                <iframe
                  src={trackingUrl}
                  className="w-full h-full mob:min-h-[95vw] min-h-[30vw]"
                  style={{ border: 'none', display: 'block' }}
                  title="Order Tracking Map"
                />
                <div className="absolute top-0 left-0 right-0 h-[5vw] mob:h-[16.1vw] bg-white z-[5] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-full mob:w-full h-[1.2vw] mob:h-[6vw] bg-[#333333] z-[5] pointer-events-none" />
              </div>
            </div>
          ) : !mapDetails.isMapDetailsExist ? (
            renderIllustration()
          ) : null}
        </div>

        {/* MAP VIEW button — when prorouting_track_status has valid coords */}
        {mapDetails.isMapAvailable && !mapToggle && (
          <button
            className="absolute top-[.6vw] mob:top-[2vw] px-[1.1vw] mob:px-[6.1vw] mob:pl-[3vw] mob:py-[2vw] pl-[.6vw] py-[.3vw] mob:rounded-[1.5vw] rounded-[.5vw] left-[.6vw] mob:left-[2vw] z-[10] flex items-center bg-[white]"
            onClick={toggleMapView}
          >
            <div className="w-[1.5vw] mob:w-[6vw] mob:h-[6vw] h-[1.5vw]">
              <Lottie
                animationData={MapLocator}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold">Map View</span>
          </button>
        )}

        {/* Close button when map is open */}
        {mapDetails.isMapAvailable && mapToggle && (
          <button
            className="absolute top-[.6vw] mob:top-[2vw] px-[1.1vw] mob:px-[6.1vw] mob:pl-[3vw] mob:py-[2vw] pl-[.6vw] py-[.3vw] mob:rounded-[1.5vw] rounded-[.5vw] left-[.6vw] mob:left-[2vw] z-[10] flex items-center bg-[white]"
            onClick={toggleMapView}
          >
            <div className="relative w-[.97vw] mob:w-[3.6vw] mob:h-[3.6vw] mob:mr-[1.2vw] h-[.97vw] mr-[.4vw]">
              <Image src={closeIcon} alt="Close Map" />
            </div>
            <span className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold">Close Map</span>
          </button>
        )}

        {/* TRACK ORDER button — no coords, but tracking URL available → opens in new tab */}
        {mapDetails.isTrackUrlOnly && (
          <button
            className="absolute top-[.6vw] mob:top-[2vw] px-[1.1vw] mob:px-[6.1vw] mob:pl-[3vw] mob:py-[2vw] pl-[.6vw] py-[.3vw] mob:rounded-[1.5vw] rounded-[.5vw] left-[.6vw] mob:left-[2vw] z-[10] flex items-center bg-[white]"
            onClick={() => window.open(mapDetails.resolvedTrackingUrl!, '_blank', 'noopener,noreferrer')}
          >
            <div className="w-[1.5vw] mob:w-[6vw] mob:h-[6vw] h-[1.5vw]">
              <Lottie
                animationData={MapLocator}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold">Track Order</span>
          </button>
        )}

        {/* When map is open, show MapContainer with prorouting_track_status coords */}
        {mapDetails.isMapDetailsExist && (
          <div className="w-full">
            <MapContainer
              driverLocation={mapDetails.driverLocation}
              customerLocation={mapDetails.customerLocation}
              fetchOrderdetails={fetchOrderdetails}
            />
          </div>
        )}
        {!mapToggle && (
          <div className="absolute bottom-0 left-0 flex items-center justify-between w-full px-[1.1vw] mob:px-[3vw] pb-[1vw] mob:pb-[2vw] z-[10]">
            <div>
              <p className="font-semibold font-[SofiaPro] text-gray-500 pb-[.4vw] text-[.97vw] mob:text-[3.6vw]">
                {!orderDetailsData.time_slot ? 'Dash Delivery' : 'Time Slot'}
              </p>
              <p className="font-semibold font-[SofiaPro] text-black text-[.97vw] mob:text-[3.6vw]">{time_formatted}</p>
            </div>
            <div>{<StatusBanner orderDetails={orderDetailsData} />}</div>
          </div>
        )}
      </div>

      <div
        className={`relative z-[0] ${mapDetails.isActiveTrackingStatus && agentName ? 'bg-white rounded-b-[1.1vw] mob:rounded-b-[3.6vw]' : ''}`}
      >
        <div
          className={`p-[1.1vw] mob:p-[4vw] rounded-b-[1.1vw] mob:rounded-b-[3.6vw]`}
          style={{ background: '#231F20F0' }}
        >
          <p
            className="font-semibold font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] uppercase tracking-wide"
            style={{ color: '#F8D34F' }}
          >
            {DeliveryStatusDetails[currentStatus]?.text}
          </p>
          <p className="pt-2 font-[SofiaPro] text-[.83vw] mob:text-[3vw]" style={{ color: '#FFFFFFCC' }}>
            {DeliveryStatusDetails[currentStatus]?.description}
          </p>
        </div>

        {/* Only show driver info and OTP if in active tracking status AND driver is assigned */}
        {mapDetails.isActiveTrackingStatus && agentName && (
          <div className="py-2">
            <div className="p-[1.1vw] mob:p-[4vw] flex items-center justify-between">
              <div className="flex items-center gap-[7px] w-[180px] h-[46.75px]">
                <div className="w-[46.75px] h-[46.75px] rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                  <PersonIcon sx={{ width: '80%', height: '80%', color: '#9E9E9E' }} />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="font-semibold font-[SofiaPro] text-[#333333] text-[15px] leading-tight truncate">
                    {agentName}
                  </span>
                  <span className="font-[SofiaPro] text-gray-500 text-[12px] mt-[2px]">Delivery Partner</span>
                </div>
              </div>

              <div className="flex items-center gap-[1.5vw] mob:gap-[4vw]">
                {otp && (
                  <div className="flex flex-col border border-gray-300 rounded-[5px] border-[1px] overflow-hidden w-[70px] h-[44px] flex-shrink-0">
                    <span className="bg-white text-gray-500 text-[13px] flex items-center justify-center h-[22px] font-regular tracking-wider">
                      OTP
                    </span>
                    <span className="bg-[#00855B] text-white text-[17px] flex items-center justify-center h-full font-semibold font-[SofiaPro] tracking-widest">
                      {otp}
                    </span>
                  </div>
                )}

                {agentPhone && (
                  <a
                    href={`tel:${agentPhone}`}
                    className="w-[2.5vw] h-[2.5vw] mob:w-[10vw] mob:h-[10vw] bg-[#E8F3EF] rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[1.2vw] h-[1.2vw] mob:w-[4.5vw] mob:h-[4.5vw]"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.03271 6.21772L4.99569 4.86937C5.227 4.5458 5.26881 4.15589 5.11203 3.79005L4.03225 1.27059C3.34785 -0.327257 1.13741 0.85522 0.410743 2.14904C-2.1369 6.68217 7.81828 16.6369 12.351 14.0892C13.6448 13.3626 14.8273 11.1521 13.2294 10.4677L10.7099 9.38796C10.3441 9.23118 9.95419 9.27299 9.63062 9.5043L8.28227 10.4673C8.16411 10.5518 8.01642 10.5586 7.89099 10.4855C6.59853 9.73107 4.76846 7.901 4.01408 6.60855C3.94091 6.48312 3.94773 6.33542 4.03225 6.21727L4.03271 6.21772Z"
                        fill="#00855B"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* OTP handover banner — always shown when OTP exists */}
            {otp && (
              <div className="bg-[#F4EED1] py-[0.8vw] mob:py-[1vw] mx-[1.1vw] mob:mx-0 mob:mb-[3vw] md:rounded-[0.5vw]">
                <p className="text-[#333333] font-[SofiaPro] text-center text-[0.8vw] mob:text-[2.6vw] font-medium m-0">
                  For successful order handover, please provide the OTP to the delivery partner.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusIllustration;
