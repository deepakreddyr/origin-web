import React from 'react';
import emptyCartImage from '/public/assets/images/emptyCart.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setIsSidebarOpen } from '@/store/slice/loginSlice';
const EmptyCart = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col items-center justify-center grow">
      <div className="w-[10vw] h-[5vw] ">
        <Image src={emptyCartImage} alt="empty cart icon" />
      </div>
      <div className="mt-[1.25vw]">
        <p className="font-[SofiaPro] text-[.97vw] font-semibold text-center ">Your Cart is Empty</p>
        <button
          onClick={() => {
            router.push('/shop');
            dispatch(setIsSidebarOpen(false));
          }}
          className="text-[.97vw] font-[SofiaPro] font-semibold mt-[1.67vw] bg-primary text-black px-[2vw] py-[.6vw] rounded-full "
        >
          Add Items now
        </button>
      </div>
    </div>
  );
};

export default EmptyCart;
