import Image from 'next/image';
import React, { useMemo } from 'react';
import Cross from '/public/assets/svg/xmark.svg';
import { useDispatch, useSelector } from 'react-redux';
import backIcon from '/public/assets/icons/backIcon.png';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { useCartStore } from '@/hooks/useCartStore';
import { updateDeliveryType, updateTimeSlotId } from '@/store/slice/placeOrderDetails';

const ModalHeader = (props: any) => {
  const { setAddressModal, setTimeSelectorOrListTab } = props;
  const { cart, actions } = useCartStore();
  const { setCartTabType } = actions;
  const dispatch = useDispatch();

  const onClickBackButton = () => {
    switch (cart.cartTabType) {
      case TabTypeConstant.CART_ADDRESS_LIST: {
        if (cart.show_timeslot_sheet === false) {
          setAddressModal(false);
          dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
        } else {
          dispatch(setCartTabType(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR));
          setTimeSelectorOrListTab(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR);
        }
        break;
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
    <div className="flex items-center justify-between mob:p-[5vw] p-[1.389vw] bg-white">
      <div className="flex items-center gap-[.6vw] mob:gap-[2vw]">
        {isBackButtonEnable && (
          <button onClick={onClickBackButton} className="relative w-[1.25vw] mob:w-[6vw] mob:h-[6vw] h-[1.25vw]">
            <Image src={backIcon} alt="back" />
          </button>
        )}
        <p className="font-[Recoleta] font-bold text-[1.4vw] mob:text-[5.5vw] text-black ">Select your delivery</p>
      </div>
      <button
        onClick={() => {
          setAddressModal(false);
          dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
          dispatch(updateDeliveryType(''));
          dispatch(updateTimeSlotId(''));
        }}
        className="w-[2vw] h-[2vw] mob:w-[8vw] mob:h-[8vw] mob:mt-0 mt-[-.4vw] rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200"
      >
        <div className="w-[1.67vw] h-[1.67vw] mob:w-[6vw] mob:h-[6vw] relative">
          <Image src={Cross} alt="close" fill />
        </div>
      </button>
    </div>
  );
};

export default ModalHeader;
