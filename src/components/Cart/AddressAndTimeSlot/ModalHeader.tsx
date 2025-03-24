import Image from 'next/image';
import React, { useMemo } from 'react';
import Cross from '/public/assets/svg/xmark.svg';
import { useDispatch, useSelector } from 'react-redux';
import backIcon from '/public/assets/icons/backIcon.png';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setCartTabType } from '@/store/slice/CartSlice';
import { updateDeliveryType, updateTimeSlotId } from '@/store/slice/placeOrderDetails';

const ModalHeader = (props: any) => {
  const { setAddressModal, setTimeSelectorOrListTab } = props;
  const cart = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  const onClickBackButton = () => {
    switch (cart.cartTabType) {
      case TabTypeConstant.CART_ADDRESS_LIST: {
        dispatch(setCartTabType(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR));
        setTimeSelectorOrListTab(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR);
      }
    }
  };

  const isBackButtonEnable = useMemo(() => {
    switch (cart.cartTabType) {
      case TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR:
        return false;

      case TabTypeConstant.CART_ADDRESS_LIST:
        return true;

      default: {
        return false;
      }
    }
  }, [cart.cartTabType]);

  return (
    <div className="flex items-center justify-between shadow-[4px_4px_32px_0px_rgba(0,0,0,0.08)] mob:p-[3vw] p-[1.389vw]">
      <div className="flex items-start  gap-[.6vw] ">
        {isBackButtonEnable && (
          <button onClick={onClickBackButton} className="relative w-[1.25vw] mob:w-[5vw] mob:h-[5vw] h-[1.25vw]">
            <Image src={backIcon} alt="back" />
          </button>
        )}
        <p className="font-[Stinger] font-bold text-[1.25vw] mob:text-[4.1vw] mob:pt-[1vw] ">Select your delivery</p>
      </div>
      <button
        onClick={() => {
          setAddressModal(false);
          dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
          dispatch(updateDeliveryType(''));
          dispatch(updateTimeSlotId(''));
        }}
        className="w-[2vw] h-[2vw] mob:w-[5vw] mob:h-[5vw] mob:mt-[-1vw] mt-[-.4vw] rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200"
      >
        <div className="w-[1.67vw] h-[1.67vw] mob:w-[5vw] mob:h-[5vw] relative">
          <Image src={Cross} alt="close" fill />
        </div>
      </button>
    </div>
  );
};

export default ModalHeader;
