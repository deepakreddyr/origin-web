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
import { setCartTabType } from '@/store/slice/CartSlice';
import { editAddress } from '@/features/AddressEditDetails/services/editAddress';
import Address from '@/features/AccountPage/types/Address';

const CartAddressList = (props: any) => {
  const { setTimeSelectorOrListTab, setAddressModal } = props;
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
    // setTimeSelectorOrListTab(TabTypeConstant.ADDRESS_TIMESLOT_SELECTOR);
    // REMOVED dispatch(setCartTabType) to prevent unmounting the Cart layout
    if (setAddressModal) {
      setAddressModal(false);
    }
  };

  return (
    <div className="p-[1.1vw] mob:p-[4vw] h-full flex flex-col grow relative">
      <div className="flex flex-col h-[60vh] overflow-y-auto pb-[5vw] gap-[.97vw] mob:gap-[4vw]">
        {address?.address?.map((item: any) => (
          <button
            onClick={() => handleSetAddress(item)}
            className="border text-start flex items-center gap-[.78vw] mob:gap-[3vw] border-[#F2EEE4] bg-[#F2EEE44D] rounded-[1.1vw] mob:rounded-[4vw] p-[.83vw] mob:p-[3vw]"
          >
            <div className="w-[3vw] h-[3vw] mob:w-[10vw] mob:h-[10vw] rounded-[.6vw] mob:rounded-[2vw] relative bg-[#F2EEE4] flex items-center justify-center  ">
              <div className="p-[.3vw] w-[1.25vw] h-[1.25vw] mob:w-[5vw] mob:h-[5vw] relative ">
                <Image src={ADDRESS_ICON_MAP[item.address_name]} fill alt="home-icon" />
              </div>
            </div>
            <div className="w-[19.3vw] mob:w-[65vw]">
              <p className="font-[SofiaPro] text-[.83vw] mob:text-[3.5vw] font-semibold ">{item.address_name}</p>
              <p className="font-[SofiaPro] text-[.83vw] mob:text-[3.2vw] font-medium text-[#231F20CC] text-ellipsis overflow-hidden whitespace-nowrap">{item.address}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="w-full mt-auto pt-[2vw] flex justify-center pb-[5vw] mob:pb-[20vw]">
        <button
          onClick={sendUserToAddAddress}
          className="bg-primary w-[28vw] mob:w-[80vw] py-[.7vw] mob:py-[3vw] font-[SofiaPro] text-[.97vw] mob:text-[4vw] font-bold rounded-full "
        >
          Add New Address +
        </button>
      </div>
    </div>
  );
};

export default CartAddressList;
