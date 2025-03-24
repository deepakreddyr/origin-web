import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import CartAddressList from './CartAddressList';
import AdressAndTimeSelector from './AdressAndTimeSelector';
import ModalHeader from './ModalHeader';
import { useDispatch, useSelector } from 'react-redux';
import Payment from '../Payment/Payment';
import { setIsProceedButtonEnabled } from '@/store/slice/CartSlice';

const AddressAndTimeSlot = (props: any) => {
  const cart = useSelector((state: any) => state.cart);

  const { showAddressModal, setAddressModal } = props;
  const [timeSelectorOrListTab, setTimeSelectorOrListTab] = useState(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR);
  const [delayedModal, setDelayedModal] = useState(false);
  // const [checkoutDetails, setCheckoutDetails] = useState({});
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const dispatch = useDispatch();
  useEffect(() => {
    if (showAddressModal) {
      const timer = setTimeout(() => {
        setDelayedModal(true);
      }, 30);
      return () => clearTimeout(timer);
    } else {
      setDelayedModal(false);
    }
  }, [showAddressModal]);

  const SCREEN_MAP: any = {
    ADDRESS_TIMESLOT_SELECTOR: (
      <AdressAndTimeSelector
        setTimeSelectorOrListTab={setTimeSelectorOrListTab}
        // checkoutDetails={checkoutDetails}
        // setCheckoutDetails={setCheckoutDetails}
      />
    ),
    CART_ADDRESS_LIST: <CartAddressList setTimeSelectorOrListTab={setTimeSelectorOrListTab} />
    // PAYMENT: <Payment />
  };

  useEffect(() => {
    if (cart.cartTabType === 'ADDRESS_TIMESLOT_SELECTOR') {
      if (placeOrderDetails.delivery_type === '') {
        dispatch(setIsProceedButtonEnabled(false));
      } else {
        if (placeOrderDetails.delivery_type === 'TIME_SLOT') {
          if (placeOrderDetails.time_slot_id !== '') {
            dispatch(setIsProceedButtonEnabled(true));
          } else {
            dispatch(setIsProceedButtonEnabled(false));
          }
        } else {
          dispatch(setIsProceedButtonEnabled(true));
        }
      }
    }
  }, [placeOrderDetails.delivery_type, placeOrderDetails.time_slot_id]);

  return (
    <div
      className={`fixed bottom-0 h-full mob:left-0 left-[70vw] z-[2] inset-0 mob:w-screen w-[30vw] flex items-end justify-end bg-black bg-opacity-50`}
    >
      <div
        className={`bg-white w-full min-h-[40vh] mob:min-h-[90vh] max-h-screen pb-[7vw] rounded-t-[1.67vw] relative transform ${
          delayedModal ? 'translate-y-0' : 'translate-y-full'
        } transition-all duration-500 ease-in-out`}
      >
        <ModalHeader setAddressModal={setAddressModal} setTimeSelectorOrListTab={setTimeSelectorOrListTab} />
        {SCREEN_MAP[timeSelectorOrListTab]}
      </div>
    </div>
  );
};

export default AddressAndTimeSlot;
