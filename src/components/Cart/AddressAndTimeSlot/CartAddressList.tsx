import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addressAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { ADDRESS_ICON_MAP } from '@/utilities/maps';
import { useRouter } from 'next/router';
import { setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setRouteSourceToLs } from '@/utilities/utils';
import { useCartStore } from '@/hooks/useCartStore';
import { editAddress } from '@/features/AddressEditDetails/services/editAddress';
import Address from '@/features/AccountPage/types/Address';

const CartAddressList = (props: any) => {
  const { actions } = useCartStore();
  const { setCartTabType } = actions;
  const { setTimeSelectorOrListTab, onAddressChanged } = props;
  const [address, setAddress] = useAtom(addressAtom);
  const router = useRouter();
  const dispatch = useDispatch();
  // const [address, setAddress] = useAtom(addressAtom);

  const sendUserToAddAddress = () => {
    // localStorage.setItem('tabSource', TabTypeConstant.CART);
    setRouteSourceToLs(TabTypeConstant.CART);
    dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
    dispatch(setCartTabType(TabTypeConstant.CART_MAIN));
  };

  const handleSetAddress = async (address: any) => {
    let apiData = {
      ...address,
      is_default: true
    };
    await editAddress(apiData as Address, setAddress);
    setTimeSelectorOrListTab(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR);
    dispatch(setCartTabType(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR));
    if (onAddressChanged) {
      onAddressChanged();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-[1.1vw] mob:p-[5vw] flex flex-col gap-[.97vw] mob:gap-[4vw] pb-[5vw] mob:pb-[10vw]">
        {address?.address?.map((item: any) => (
          <button
            key={item.address_id}
            onClick={() => handleSetAddress(item)}
            className="border text-start flex items-center gap-[.78vw] mob:gap-[3vw] border-[#F2EEE4] bg-[#F2EEE44D] rounded-[1.1vw] mob:rounded-[4vw] p-[.83vw] mob:p-[4vw] hover:bg-[#F2EEE488] transition-colors"
          >
            <div className="w-[3vw] h-[3vw] mob:w-[12vw] mob:h-[12vw] flex-shrink-0 rounded-[.6vw] mob:rounded-[2.5vw] relative bg-[#F2EEE4] flex items-center justify-center">
              <div className="w-[1.25vw] h-[1.25vw] mob:w-[6vw] mob:h-[6vw] relative">
                <Image src={ADDRESS_ICON_MAP[item.address_name]} fill className="object-contain" alt="home-icon" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-[SofiaPro] text-[.83vw] mob:text-[4vw] font-semibold">{item.address_name}</p>
                {item.address_id === address.defaultAddress?.address_id && (
                  <span className="bg-[#E7F6EC] text-[#039855] text-[.6vw] mob:text-[2.5vw] px-[.5vw] mob:px-[2vw] py-[.1vw] mob:py-[.3vw] rounded-full font-bold">
                    Selected Location
                  </span>
                )}
              </div>
              <p className="font-[SofiaPro] text-[.83vw] mob:text-[3.5vw] font-medium text-[#231F2080] leading-tight mt-1">
                {item.address}
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="p-[1.1vw] mob:p-[5vw] pb-[2vw] mob:pb-[8vw] flex justify-center mt-auto border-t border-[#F2EEE44D] bg-white">
        <button
          onClick={sendUserToAddAddress}
          className="bg-primary w-full py-[.7vw] mob:py-[4vw] font-[SofiaPro] text-[.97vw] mob:text-[4.5vw] font-semibold rounded-full shadow-lg active:scale-[0.98] transition-all"
        >
          Add New Address +
        </button>
      </div>
    </div>
  );
};

export default CartAddressList;
