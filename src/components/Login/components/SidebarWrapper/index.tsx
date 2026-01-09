import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Cross from '../../../../../public/assets/svg/xmark.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import backIcon from '/public/assets/icons/backIcon.png';
import { TabTypeConstant } from '../../constants/tabTypeContent';

interface Props {
  children: React.ReactNode;
  onClickBackButton: () => void;
  isBackButtonEnable: boolean;
  headerTitle: string;
}

const SidebarWrapper = (props: Props) => {
  const { children, onClickBackButton, isBackButtonEnable, headerTitle } = props;
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const dispatch = useDispatch();

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
      {loginDetails.isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000]"
          onClick={() => dispatch(setIsSidebarOpen(false))}
        ></div>
      )}
      <div
        className={`fixed top-0 ${loginDetails.isSidebarOpen ? 'right-0' : '-right-full'
          } w-[30vw] mob:w-screen h-screen bg-white shadow-md flex flex-col 
    transition-all duration-300 ease-in-out z-[1001]`}
      >
        {loginDetails.isHeaderVisible && (
          <div
            className="h-[5.0vw] mob:h-[15vw] flex items-center justify-between w-full gap-[.6vw] mob:gap-[2vw] px-4 sticky top-0 z-[1] 
                border-b border-[#F2EEE4] bg-white shadow-md"
          >
            {isBackButtonEnable && (
              <div className="flex items-center justify-end ">
                <button
                  onClick={onClickBackButton}
                  className="relative w-[2.5vw] mob:w-[6vw] mob:h-[6vw] h-[2.5vw] cursor-pointer bg-transparent border-none rounded-full flex items-center justify-center
        hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200"
                >
                  <div className="relative w-[1.25vw] mob:w-[5vw] mob:h-[5vw] h-[1.25vw]">
                    <Image src={backIcon} alt="back" />
                  </div>
                </button>
              </div>
            )}
            <div className="flex items-center justify-between w-full">
              <p className="font-[SofiaPro] text-[1.67vw] mob:text-[5vw] font-bold mt-[.6vw] mob:mt-[3vw] ">
                {headerTitle}
              </p>
              <button
                onClick={() => {
                  dispatch(setIsSidebarOpen(false));
                  if (
                    loginDetails.tabType === TabTypeConstant.SELECT_ADDRESS ||
                    loginDetails.tabType === TabTypeConstant.CART
                  ) {
                    dispatch(setTabType(''));
                  }
                }}
                className="w-[2.5vw] h-[2.5vw] mob:w-[6vw] mob:h-[6vw] rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-[1.67vw] h-[1.67vw] mob:w-[6vw] mob:h-[6vw] relative ">
                  <Image src={Cross} alt="close" fill />
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
