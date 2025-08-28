import { protectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import React, { useEffect, useState } from 'react';
import InstantDeliveryBtn from './InstantDeliveryBtn';
import ScheduledDeliveryBtn from './ScheduledDeliveryBtn';
import DeliveryTimings from './DeliveryTimings';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckoutDetails, updateDeliveryType } from '@/store/slice/placeOrderDetails';
import { setIsProceedButtonEnabled } from '@/store/slice/CartSlice';

type DeliveryType = 'TIME_SLOT' | 'INSTANT' | undefined;

const DeliveryPrefencetype = () => {
  const getDataFromApi = useGetDataFromApi();
  const [loading, setLoading] = useState(true);
  const [activeDeliveryType, setActiveDeliveryType] = useState<DeliveryType>(undefined);
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);

  const fetchCheckoutDetails = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['proceedToCheckout'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const successHandler = (data: any) => {
      dispatch(setCheckoutDetails({ ...data }));
      setLoading(false);
    };
    const failureHandler = () => {
      setLoading(false);
    };
    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  };

  useEffect(() => {
    fetchCheckoutDetails();
  }, []);

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

  if (loading) return <>loading</>;

  // Check if instant delivery is available
  const isInstantDeliveryAvailable = placeOrderDetails?.checkoutDetails?.dash_delivery?.immediate_delivery_available && placeOrderDetails?.checkoutDetails?.dash_delivery?.immediate_delivery_enabled;

  return (
    <div>
      <div className={`grid ${isInstantDeliveryAvailable ? 'grid-cols-2' : 'grid-cols-1'} p-[1.1vw] mob:p-[4.1vw] mob:gap-[4.1vw] gap-[1.1vw]`}>
        {isInstantDeliveryAvailable && (
          <InstantDeliveryBtn
            activeDeliveryType={activeDeliveryType}
            setActiveDeliveryType={setActiveDeliveryType}
          />
        )}
        <ScheduledDeliveryBtn
          activeDeliveryType={activeDeliveryType}
          setActiveDeliveryType={setActiveDeliveryType}
        />
      </div>

      <div>
        <DeliveryTimings />
      </div>
    </div>
  );
};

export default DeliveryPrefencetype;