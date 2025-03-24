import { useAtom } from 'jotai';
import React from 'react';
import { addressAtom } from '@/features/Address/context/atoms';
import penIcon from '/public/assets/icons/penIcon.png';
import Image from 'next/image';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { useDispatch, useSelector } from 'react-redux';
import { setCartTabType } from '@/store/slice/CartSlice';
import DeliveryPrefencetype from '../deliveryPerference/DeliveryPrefencetype';

const AdressAndTimeSelector = (props: any) => {
  const { setTimeSelectorOrListTab } = props;
  const [address, setAddress] = useAtom(addressAtom);
  const cart = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="">
      <div className="flex px-[1.389vw] mob:px-[4.1vw] mob:py-[3vw] py-[.78vw] bg-[#F2EEE466] mob:rounded-[4vw] rounded-b-[1.67vw] ">
        {address && address.defaultAddress && (
          <div className="">
            <p className="font-[SofiaPro] text-[.97vw] mob:text-[3vw] ">
              <span className="font-bold">{address?.defaultAddress?.address_name} - </span>
              {address?.defaultAddress?.address}
            </p>
          </div>
        )}
        {/* <div>
          <button
            onClick={() => {
              setTimeSelectorOrListTab(TabTypeConstant.CART_ADDRESS_LIST);
              dispatch(setCartTabType(TabTypeConstant.CART_ADDRESS_LIST));
            }}
            className="relative w-[1.67vw] h-[1.67svw] "
          >
            <Image src={penIcon} alt="pen icon" fill />
          </button>
        </div> */}
      </div>
      <div>
        {/* checkoutDetails={checkoutDetails} setCheckoutDetails={setCheckoutDetails} */}
        <DeliveryPrefencetype />
      </div>
    </div>
  );
};

export default AdressAndTimeSelector;
