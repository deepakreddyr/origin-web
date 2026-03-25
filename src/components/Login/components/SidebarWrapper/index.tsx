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

interface Props {
  children: React.ReactNode;
  onClickBackButton: () => void;
  isBackButtonEnable: boolean;
  headerTitle: string;
}

// --- NEW IMPORTS ---
// (Integrated above)
// -------------------

// Toast Component
const AlertToast: React.FC<{
  message: string;
  isVisible: boolean;
  onClose: () => void;
}> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-[99999] w-[90%] max-w-md transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center bg-black rounded-full shadow-xl h-10 px-4 w-full">
        <div className="flex items-center justify-center w-full gap-2">
          <InfoOutlinedIcon sx={{ color: 'yellow', fontSize: '1.2rem' }} />
          <p className="text-[0.8rem] font-semibold text-white text-center leading-tight font-[SofiaPro]">{message}</p>
        </div>
      </div>
    </div>
  );
};

const SidebarWrapper = (props: Props) => {
  const { children, onClickBackButton, isBackButtonEnable, headerTitle } = props;
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const dispatch = useDispatch();

  // State for Toast
  const [showToast, setShowToast] = useState(false);
  const [address] = useAtom(addressAtom);

  const handleCloseAttempt = () => {
    // Check if closing should be blocked
    const hasDefaultAddress = address.defaultAddress !== null;
    const isMandatory = loginDetails.isFreshLogin && !hasDefaultAddress;

    if (isMandatory) {
      setShowToast(true);
      return;
    }

    // Allow close
    dispatch(setIsSidebarOpen(false));
    if (loginDetails.isFreshLogin) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
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
      <AlertToast
        message="Please enter the details to proceed"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {loginDetails.isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[110]" onClick={handleCloseAttempt}></div>
      )}
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
            <div className="flex-shrink-0 w-[3vw] mob:w-[10vw]">
              {isBackButtonEnable && (
                <button
                  onClick={handleBackAttempt}
                  className="relative w-[2.5vw] mob:w-[8vw] mob:h-[8vw] h-[2.5vw] cursor-pointer bg-transparent border-none rounded-full flex items-center justify-center
                      hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200"
                >
                  <div className="relative w-[1.25vw] mob:w-[5vw] mob:h-[5vw] h-[1.25vw]">
                    <Image src={backIcon} alt="back" fill className="object-contain" />
                  </div>
                </button>
              )}
            </div>

            {/* Center Section: Title */}
            <div className="flex-grow flex justify-start">
              <h1 className="text-[1.67vw] mob:text-[5vw] font-bold text-center">{headerTitle}</h1>
            </div>

            {/* Right Section: Close Button */}
            <div className="flex-shrink-0 w-[3vw] mob:w-[10vw] flex justify-end">
              {!(loginDetails.isFreshLogin && address.defaultAddress === null) && (
                <button
                  onClick={handleCloseAttempt}
                  className="w-[2.5vw] h-[2.5vw] mob:w-[8vw] mob:h-[8vw] rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-[1.2vw] h-[1.2vw] mob:w-[6vw] mob:h-[6vw] relative">
                    <Image src={Cross} alt="close" fill className="object-contain" />
                  </div>
                </button>
              )}
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
