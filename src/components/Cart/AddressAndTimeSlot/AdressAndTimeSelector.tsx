import { useAtom } from 'jotai';
import React from 'react';
import { addressAtom } from '@/features/Address/context/atoms';
import Image from 'next/image';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { useDispatch } from 'react-redux';
import { useCartStore } from '@/hooks/useCartStore';
import DeliveryPrefencetype from '../deliveryPerference/DeliveryPrefencetype';
import { ADDRESS_ICON_MAP } from '@/utilities/maps';

const AdressAndTimeSelector = (props: any) => {
  const { setTimeSelectorOrListTab, isSubscription = false, onShowToast } = props;
  const [address, setAddress] = useAtom(addressAtom);
  const { cart, actions } = useCartStore();
  const { setCartTabType } = actions;
  const dispatch = useDispatch();

  const handleAddressChangeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeSelectorOrListTab(TabTypeConstant.CART_ADDRESS_LIST);
    dispatch(setCartTabType(TabTypeConstant.CART_ADDRESS_LIST));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Drag Handle for Mobile */}
      <div className="p-[1.389vw] mob:p-[5vw] pb-[8vw] mob:pb-[25vw] flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-[1vw] mob:px-[4vw] mob:py-[3.5vw] py-[.8vw] bg-[#F9F6EE] mob:rounded-[5vw] rounded-[1.2vw] overflow-hidden">
          {address && address.defaultAddress && (
            <div className="flex items-center gap-[1.1vw] mob:gap-[4vw] flex-1 min-w-0 mr-[1vw] mob:mr-[3vw]">
              {/* Icon Container */}
              <div className="w-[3.5vw] h-[3.5vw] mob:w-[13.5vw] mob:h-[13.5vw] bg-[#EAE3D266] rounded-[0.8vw] mob:rounded-[3.5vw] flex items-center justify-center flex-shrink-0">
                <div className="w-[1.8vw] h-[1.8vw] mob:w-[7vw] mob:h-[7vw] relative">
                  <Image
                    src={ADDRESS_ICON_MAP[address.defaultAddress.address_name] || ADDRESS_ICON_MAP['Other']}
                    alt="address icon"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Address Info */}
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-[SofiaPro] font-bold text-[1vw] mob:text-[4.2vw] text-black truncate">
                  {address?.defaultAddress?.address_name}
                </p>
                <p className="font-[SofiaPro] font-normal text-[.85vw] mob:text-[3.2vw] text-[#231F20CC] truncate">
                  {address?.defaultAddress?.address}
                </p>
              </div>
            </div>
          )}

          {/* Change Link */}
          <button
            onClick={handleAddressChangeClick}
            className="font-[SofiaPro] font-bold text-[1vw] mob:text-[4vw] text-black underline underline-offset-4 flex-shrink-0"
          >
            Change
          </button>
        </div>

        <div className="mt-[1.389vw] mob:mt-[6vw]">
          <DeliveryPrefencetype isSubscription={isSubscription} onShowToast={onShowToast} />
        </div>
      </div>
    </div>
  );
};

export default AdressAndTimeSelector;
