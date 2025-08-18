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
      {/* 📷 Image container */}
      <div className="w-[40vw] h-[24vw] sm:w-[25vw] sm:h-[15vw] md:w-[15vw] md:h-[8vw]">
        <Image src={emptyCartImage} alt="empty cart icon" className="w-full h-full object-contain" />
      </div>

      <div className="mt-5 sm:mt-4 md:mt-[1.25vw] flex flex-col items-center">
        {/* 📝 Text */}
        <p className="font-[SofiaPro] text-[4vw] sm:text-[2.5vw] md:text-[.97vw] font-semibold text-center">
          Your Cart is Empty
        </p>

        {/* 🔘 Button */}
        <button
          onClick={() => {
            router.push('/shop');
            dispatch(setIsSidebarOpen(false));
          }}
          className="mt-5 sm:mt-4 md:mt-[1.67vw] bg-primary text-black font-[SofiaPro] font-semibold 
                     text-[4vw] sm:text-[2.5vw] md:text-[.97vw] 
                     px-5 sm:px-7 md:px-[2vw] py-2.5 sm:py-2 md:py-[.6vw] 
                     rounded-full"
        >
          Add Items now
        </button>
      </div>
    </div>
  );
};

export default EmptyCart;
