'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
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
  const [address, setAddress] = useAtom(addressAtom);
  const [profile, setProfileAtom] = useAtom(profileAtom);

  const [topBarTransition, setTopBarTransition] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [localStorageAddress, setAddressFromLs] = useState<any>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(600);



  useEffect(() => {
    let addressFromLs = getAddressAndStoreId();
    setAddressFromLs({ ...addressFromLs });

    const token = localStorage.getItem('user_token');
    setIsLoggedIn(!!token); // set to true if token exists
  }, [loginDetails.tabType]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setTopBarTransition(position > 40 && !isMobile);
      if (position > 40) {
        setOpenSubmenu(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);

  const handleSelectAddress = () => {
    if (loginDetails.isLogin) {
      dispatch(setIsSidebarOpen(true));

      if (!profile?.data?.profile) {
        dispatch(setTabType(TabTypeConstant.REGISTER));
        return;
      }

      if (address.address.length > 0) {
        dispatch(setTabType(TabTypeConstant.SELECT_ADDRESS));
      } else {
        dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
      }
    } else {
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
    }
  };

  return (
       <div>
        {isLoggedIn && (
    <div
      className={`flex px-[10.15vw] mob:px-0 items-center justify-between w-full mob:w-screen transition-all ease-in-out duration-200`}
    >
      {/* Marquee or Offer Message */}
      <div className="h-[2vw] mob:h-[10vw] flex items-center mob:w-[50%] text-black">
        {isMobile ? (
          <div className="relative w-full overflow-hidden">
            <div
              className="flex whitespace-nowrap animate-scroll"
              style={{ animation: 'scroll 10s linear infinite' }}
            >
              <p className="text-white font-[SofiaPro] font-medium text-[3vw] px-4">
                {/* Download the App and Get FLAT 15% Off on 1st Order use coupon code "INSTALL15" */}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-white font-[SofiaPro] text-[.97vw] font-medium">
            {/* Download the App and Get FLAT 15% Off on 1st Order use coupon code "INSTALL15" */}
          </p>
        )}
      </div>

      {/* Address Button */}
      
        <div>
          <button
            onClick={handleSelectAddress}
            className="bg-black-op-30 gap-[.6vw] items-center justify-center whitespace-nowrap truncate rounded-full h-[1.508vw] mob:h-[8vw] px-[.83vw] flex mob:px-[3vw] mob:w-[48vw] mob:mr-[4vw]"
          >
            {address.defaultAddress?.address_name ? (
              <div className="flex">
                <p className="text-[.78vw] mob:text-[3vw] truncate font-bold text-[SofiaPro] text-white">
                  {address.defaultAddress?.address_name} -
                </p>
                <p className="font-light text-[.78vw] mob:text-[3vw] w-[15vw] mob:w-[30vw] truncate font-[SofiaPro] text-white">
                  &nbsp;{address.defaultAddress.address}
                </p>
              </div>
            ) : (
              <p className="text-[.78vw] mob:text-[3vw] truncate font-bold font-[SofiaPro] text-white">
                Select Address
              </p>
            )}
            <div className="relative w-[.83vw] mob:w-[3vw] mob:h-[3vw] h-[.83vw]">
              <Image src={whiteDropdownIcon} alt="dropdown" />
            </div>
          </button>
        </div>
      
    </div>
    )}
    </div>
  );
};

export default OffersRibbon;
