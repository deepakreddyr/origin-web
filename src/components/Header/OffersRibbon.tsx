'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import { getAddressAndStoreId } from '@/utilities/utils';
import Image from 'next/image';
import whiteDropdownIcon from '/public/assets/images/whiteDropdown.png';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { profileAtom } from '@/features/AccountPage/context/atoms';

const OffersRibbon = () => {
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useMediaQuery(600);

  if (!isVisible) return null;

  return (
    <div className="bg-[#D68D7F] w-full py-[1.5vw] mob:py-[2vw] px-[5vw] flex justify-between items-center z-[101]">
      <div className="flex-1 text-center text-white text-[2vw] mob:text-[3.2vw] font-[SofiaPro] font-medium">
        {isMobile ? "Now Accepting Payment on Delivery" : "WhatsApp Us For Bulk Gifting Orders"}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-white hover:opacity-80 transition-opacity"
        aria-label="Close ribbon"
      >
        <svg className="w-[3vw] h-[3vw] mob:w-[4vw] mob:h-[4vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default OffersRibbon;
