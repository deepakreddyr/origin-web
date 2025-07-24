import React, { useState, useEffect } from 'react';
import originIcon from '/public/assets/images/originIcon.png';
import mobileDownload from '/public/assets/images/mobileDownload.png';
import appStore from '/public/assets/images/appStore.png';
import googlePlaystore from '/public/assets/images/googlePlaystore.png';
import Image from 'next/image';
import Link from 'next/link';

interface DownloadAppWrapperProps {
  onClose?: () => void;
}

const DownloadAppWrapper: React.FC<DownloadAppWrapperProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect for smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    console.log('Debug - Close button clicked');
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300); // Match animation duration
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleAppStoreClick = () => {
    console.log('Debug - App Store button clicked');
    window.open('https://apps.apple.com/in/app/origin-fresh-fruits-veggies/id6505096700', '_blank');
  };

  const handlePlayStoreClick = () => {
    console.log('Debug - Play Store button clicked');
    window.open('https://play.google.com/store/apps/details?id=com.originfresh.user&hl=en_IN&pli=1', '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[9998] ${
          isVisible && !isClosing ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content */}
      <div className={`fixed inset-0 z-[9999] flex items-end desktop:items-center justify-center transition-transform duration-300 ease-out ${
        isVisible && !isClosing ? 'transform translate-y-0 desktop:scale-100' : 'transform translate-y-full desktop:scale-95'
      }`}>
        <div className="bg-white w-full max-w-md desktop:max-w-lg mx-auto rounded-t-[8vw] mob:rounded-t-[10vw] desktop:rounded-2xl relative max-h-[90vh] desktop:max-h-[80vh] overflow-hidden shadow-2xl desktop:min-h-[600px]">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 desktop:w-10 desktop:h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 desktop:w-6 desktop:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="px-[8vw] pt-[8vw] mob:px-[6vw] mob:pt-[10vw] desktop:px-8 desktop:pt-8">
            <p className="font-[SofiaPro] text-[5.12vw] mob:text-[4.5vw] desktop:text-2xl font-semibold text-black text-center leading-tight mb-4 desktop:mb-6">
              Change your idea of fresh! Download the Origin app
            </p>
            
            <div className="flex items-center justify-center gap-[3vw] py-[6vw] mob:py-[8vw] desktop:gap-4 desktop:py-6">
              <div className="w-[9vw] h-[9vw] mob:w-[12vw] mob:h-[12vw] desktop:w-16 desktop:h-16 relative">
                <Image 
                  src={originIcon} 
                  alt="Origin Fresh icon" 
                  fill
                  className="object-contain"
                  sizes="(max-width: 600px) 12vw, (max-width: 1200px) 9vw, 64px"
                />
              </div>
              <p className="font-[SofiaPro] text-[3.6vw] mob:text-[4vw] desktop:text-xl font-semibold text-black">
                Origin Fresh
              </p>
            </div>
          </div>

          {/* Mobile Download Image */}
          <div className="relative w-full h-[40vh] mob:h-[35vh] desktop:h-[280px] mb-4 desktop:mb-6">
            <Image 
              src={mobileDownload} 
              alt="Download Origin Fresh app illustration" 
              fill
              className="object-contain"
              priority
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 500px"
            />
          </div>

          <div className="p-[4.1vw] mob:p-[6vw] desktop:px-8 desktop:pb-8">
            <p className="font-[SofiaPro] text-center text-[4.1vw] mob:text-[3.5vw] desktop:text-lg font-medium mb-6 desktop:mb-8 text-gray-800">
              #FRESHORNOTHING
            </p>
            
            {/* App Store Buttons */}
            <div className="flex items-center justify-center gap-[6vw] mob:gap-[4vw] desktop:gap-6 py-[3vw] mb-6 desktop:mb-8">
              <button
                onClick={handleAppStoreClick}
                className="relative w-[28vw] h-[8vw] mob:w-[35vw] mob:h-[10vw] desktop:w-[160px] desktop:h-[48px] hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                aria-label="Download on App Store"
              >
                <Image 
                  src={appStore} 
                  alt="Download on App Store" 
                  fill
                  className="object-contain"
                  sizes="(max-width: 600px) 35vw, (max-width: 1200px) 28vw, 160px"
                />
              </button>
              <button
                onClick={handlePlayStoreClick}
                className="relative w-[28vw] h-[8vw] mob:w-[35vw] mob:h-[10vw] desktop:w-[160px] desktop:h-[48px] hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                aria-label="Get it on Google Play"
              >
                <Image 
                  src={googlePlaystore} 
                  alt="Get it on Google Play" 
                  fill
                  className="object-contain"
                  sizes="(max-width: 600px) 35vw, (max-width: 1200px) 28vw, 160px"
                />
              </button>
            </div>
            
            {/* Footer Links */}
            <div className="font-[SofiaPro] font-medium text-[#7B7979] text-[3vw] mob:text-[3.5vw] desktop:text-sm text-center">
              <Link 
                className="hover:underline hover:text-gray-600 transition-colors duration-200" 
                href="/terms-and-conditions"
              >
                Terms and Conditions
              </Link>
              <span className="mx-2">|</span>
              <Link 
                className="hover:underline hover:text-gray-600 transition-colors duration-200" 
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadAppWrapper;