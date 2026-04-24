import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Cross from '../../../../../public/assets/svg/xmark.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import backIcon from '/public/assets/icons/backIcon.png';
import { TabTypeConstant } from '../../constants/tabTypeContent';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { OriginCloseIcon } from '../../../../Icons/OriginIcons';

interface Props {
  children: React.ReactNode;
  onClickBackButton: () => void;
  isBackButtonEnable: boolean;
  headerTitle: string;
}

// --- NEW IMPORTS ---
// (Integrated above)
// -------------------

// Sidebar Component
const SidebarWrapper = (props: Props) => {
  const { children, onClickBackButton, isBackButtonEnable, headerTitle } = props;
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const dispatch = useDispatch();

  const handleCloseAttempt = () => {
    // Prevent close if in registration map flow
    if (
      loginDetails.isFreshLogin &&
      (loginDetails.tabType === TabTypeConstant.SERVICEABILITY ||
        loginDetails.tabType === TabTypeConstant.MANUAL_ADDRESS ||
        loginDetails.tabType === TabTypeConstant.COMPLETE_ADDRESS)
    ) {
      return;
    }

    // Allow close regardless of state
    dispatch(setIsSidebarOpen(false));
    if (loginDetails.isFreshLogin) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    if (loginDetails.tabType === TabTypeConstant.SELECT_ADDRESS || loginDetails.tabType === TabTypeConstant.CART) {
      dispatch(setTabType(''));
    }
  };

  const handleBackAttempt = () => {
    // We allow the back button as requested, it only navigates within the sidebar/backwards
    onClickBackButton();
  };

  useEffect(() => {
    if (loginDetails.isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      dispatch(setTabType(''));
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [loginDetails.isSidebarOpen]);

  return (
    <div className="">
      {loginDetails.isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-[110]"></div>}
      <div
        className={`fixed top-0 ${
          loginDetails.isSidebarOpen ? 'right-0' : '-right-full'
        } w-[30vw] mob:w-screen h-screen bg-white shadow-md flex flex-col 
    transition-all duration-300 ease-in-out z-[120]`}
      >
        {loginDetails.isHeaderVisible && (
          <div
            className="h-[5.0vw] mob:h-[15vw] flex items-center w-full px-4 sticky top-0 z-[1] 
                border-b border-[#F2EEE4] bg-white shadow-md relative"
          >
            {/* Left Section: Back Button */}
            {isBackButtonEnable && (
              <div className="flex-shrink-0 w-[3vw] mob:w-[10vw]">
                <button
                  onClick={handleBackAttempt}
                  className="relative w-[2.5vw] mob:w-[8vw] mob:h-[8vw] h-[2.5vw] cursor-pointer bg-transparent border-none rounded-full flex items-center justify-center
                      hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200"
                >
                  <div className="relative w-[1.25vw] mob:w-[5vw] mob:h-[5vw] h-[1.25vw]">
                    <Image src={backIcon} alt="back" fill className="object-contain" />
                  </div>
                </button>
              </div>
            )}

            {/* Center Section: Title */}
            <div className="flex-grow flex justify-start">
              <h1 className="text-[1.67vw] mob:text-[5vw] font-bold">{headerTitle}</h1>
            </div>

            {/* Right Section: Close Button */}
            <div className="flex-shrink-0 w-[3vw] mob:w-[10vw] flex justify-end">
              <button
                onClick={handleCloseAttempt}
                className="w-[2.5vw] h-[2.5vw] mob:w-[8vw] mob:h-[8vw] rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200 text-black"
                aria-label="close"
              >
                <div className="w-[1vw] h-[1vw] mob:w-[4vw] mob:h-[4vw] flex items-center justify-center">
                  <OriginCloseIcon sx={{ fontSize: '0.6vw', '@media (max-width: 600px)': { fontSize: '2.5vw' } }} />
                </div>
              </button>
            </div>
          </div>
        )}
        {/* */}
        <div className="p-[1.1vw] mob:p-[4.1vw] h-[calc(100vh-5vw)] overflow-auto flex flex-col grow gap-[1.1vw]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarWrapper;
