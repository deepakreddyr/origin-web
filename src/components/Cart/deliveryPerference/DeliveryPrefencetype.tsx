import { protectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import InstantDeliveryBtn from './InstantDeliveryBtn';
import ScheduledDeliveryBtn from './ScheduledDeliveryBtn';
import DeliveryTimings from './DeliveryTimings';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckoutDetails } from '@/store/slice/placeOrderDetails';
import { setIsProceedButtonEnabled } from '@/store/slice/CartSlice';

type DeliveryType = 'TIME_SLOT' | 'INSTANT' | undefined;

const DeliveryPrefencetype = (props: any) => {
  const getDataFromApi = useGetDataFromApi();
  const [loading, setLoading] = useState(true);
  const [activeDeliveryType, setActiveDeliveryType] = useState<DeliveryType>('TIME_SLOT');
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);

  const fetchCheckoutDetails = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['proceedToCheckout'];
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

  useEffect(() => {
    if (activeDeliveryType === 'TIME_SLOT') {
      if (placeOrderDetails.time_slot_id) {
        dispatch(setIsProceedButtonEnabled(true));
        return;
      }
      dispatch(setIsProceedButtonEnabled(false));
    } else if (activeDeliveryType === 'INSTANT') {
      dispatch(setIsProceedButtonEnabled(true));
    }
  }, [activeDeliveryType, placeOrderDetails.time_slot_id]);

  if (loading) return <>loading</>;

  return (
    <div>
      <div className="grid grid-cols-2 p-[1.1vw] mob:p-[4.1vw] mob:gap-[4.1vw] gap-[1.1vw] ">
        {/* <InstantDeliveryBtn
          activeDeliveryType={activeDeliveryType}
          setActiveDeliveryType={setActiveDeliveryType}
        /> */}
        {/* <ScheduledDeliveryBtn
          activeDeliveryType={activeDeliveryType}
          setActiveDeliveryType={setActiveDeliveryType}
        /> */}
      </div>
      {activeDeliveryType === 'TIME_SLOT' && (
        <div>
          <DeliveryTimings />
        </div>
      )}
    </div>
  );
};

export default DeliveryPrefencetype;
