import { protectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import React, { useEffect, useState } from 'react';
import InstantDeliveryBtn from './InstantDeliveryBtn';
import ScheduledDeliveryBtn from './ScheduledDeliveryBtn';
import DeliveryTimings from './DeliveryTimings';
import SubscriptionTimeslot from './SubscriptionTimeslot';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckoutDetails, updateDeliveryType } from '@/store/slice/placeOrderDetails';
import { useCartStore } from '@/hooks/useCartStore';

type DeliveryType = 'TIME_SLOT' | 'INSTANT' | undefined;

const DeliveryPrefencetype = ({
  isSubscription = false,
  onShowToast
}: {
  isSubscription?: boolean;
  onShowToast?: (message: string) => void;
}) => {
  const { cart, subscriptionCart, actions } = useCartStore();
  const { setIsProceedButtonEnabled } = actions;

  const getDataFromApi = useGetDataFromApi();
  const sendDataToApi = useSendDataToApi();
  const [loading, setLoading] = useState(true);
  const [activeDeliveryType, setActiveDeliveryType] = useState<DeliveryType>(undefined);
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);

  const fetchCheckoutDetails = () => {
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const successHandler = (data: any) => {
      dispatch(setCheckoutDetails({ ...data }));
      setLoading(false);
    };
    const failureHandler = (data: any) => {
      setLoading(false);
      if (data?.message && onShowToast) {
        onShowToast(data.message);
      }
    };

    if (isSubscription) {
      const apiUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL +
        `/api/v5/user/web-subscription-checkout?max_qty=${subscriptionCart.totalQuantity}`;
      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    } else {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['proceedToCheckout'];
      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    }
  };

  useEffect(() => {
    fetchCheckoutDetails();
  }, [isSubscription]);

  useEffect(() => {
    if (loading) {
      dispatch(setIsProceedButtonEnabled(false));
    }
  }, [loading, dispatch]);

  // Auto-update activeDeliveryType based on Redux state changes
  useEffect(() => {
    if (placeOrderDetails.delivery_type !== '') {
      setActiveDeliveryType(placeOrderDetails.delivery_type);
    }
  }, [placeOrderDetails.delivery_type]);

  // Enable/disable proceed button based on selections
  useEffect(() => {
    let canProceed = false;

    if (placeOrderDetails.delivery_type === 'TIME_SLOT') {
      // For time slot delivery, user must select a specific timing
      canProceed = placeOrderDetails.time_slot_id !== '';
    } else if (placeOrderDetails.delivery_type === 'INSTANT') {
      // For instant delivery, no additional selection needed
      canProceed = true;
    }

    // Enable proceed button if user has made all required selections
    dispatch(setIsProceedButtonEnabled(canProceed));
  }, [placeOrderDetails.delivery_type, placeOrderDetails.time_slot_id, dispatch]);

  if (loading)
    return (
      <div className="grid grid-cols-2 mob:gap-[2vw] gap-[0.5vw]">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-[1vw] mob:rounded-[4vw] min-h-[10vw] mob:min-h-[35vw] p-[1vw] mob:p-[4vw] bg-[#F0F0F0] overflow-hidden relative"
          >
            {/* shimmer overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'deliveryShimmer 1.4s infinite'
              }}
            />
            {/* icon placeholder */}
            <div className="mb-[1vw] mob:mb-[3.5vw] w-[1.4vw] h-[1.4vw] mob:w-[6vw] mob:h-[6vw] rounded-full bg-[#D8D8D8]" />
            {/* title placeholder */}
            <div className="h-[1vw] mob:h-[4vw] w-[60%] rounded-full bg-[#D8D8D8] mb-[0.6vw] mob:mb-[2vw]" />
            {/* subtitle placeholder */}
            <div className="h-[0.75vw] mob:h-[3vw] w-[80%] rounded-full bg-[#D8D8D8]" />
            <style>{`
              @keyframes deliveryShimmer {
                0%   { background-position: -200% 0; }
                100% { background-position:  200% 0; }
              }
            `}</style>
          </div>
        ))}
      </div>
    );

  // ── SUBSCRIPTION FLOW: Show fixed timeslot card, no user selection needed ──
  if (isSubscription) {
    return <SubscriptionTimeslot />;
  }

  // ── NORMAL FLOW ──
  // Check if instant delivery is available
  const isInstantDeliveryAvailable =
    placeOrderDetails?.checkoutDetails?.dash_delivery?.immediate_delivery_available &&
    placeOrderDetails?.checkoutDetails?.dash_delivery?.immediate_delivery_enabled &&
    placeOrderDetails?.checkoutDetails?.dash_delivery?.immediate_delivery_time_enabled &&
    !placeOrderDetails?.checkoutDetails?.dash_delivery?.is_immediate_delivery_busy;

  return (
    <div>
      <div className={`grid ${isInstantDeliveryAvailable ? 'grid-cols-2' : 'grid-cols-1'} mob:gap-[2vw] gap-[0.5vw]`}>
        {isInstantDeliveryAvailable && (
          <InstantDeliveryBtn activeDeliveryType={activeDeliveryType} setActiveDeliveryType={setActiveDeliveryType} />
        )}
        <ScheduledDeliveryBtn activeDeliveryType={activeDeliveryType} setActiveDeliveryType={setActiveDeliveryType} />
      </div>

      {/* CONDITIONAL RENDERING: Only show DeliveryTimings if TIME_SLOT is active */}
      {activeDeliveryType === 'TIME_SLOT' && (
        <div>
          <DeliveryTimings />
        </div>
      )}
    </div>
  );
};

export default DeliveryPrefencetype;
