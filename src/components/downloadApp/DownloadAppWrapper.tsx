import React, { useState, useEffect } from 'react';
import originIcon from '/public/logo.svg';
import mobileDownload from '/public/assets/images/mobileDownload.png';
import appStore from '/public/assets/images/appStore.png';
import googlePlaystore from '/public/assets/images/googlePlaystore.png';
import Image from 'next/image';
import Link from 'next/link';
import originLogo from '/public/assets/images/neworiginlogo.png';

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
    // console.log('Debug - Close button clicked');
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
    // console.log('Debug - App Store button clicked');
    window.open('https://apps.apple.com/in/app/origin-fresh-fruits-veggies/id6505096700', '_blank');
  };

  const handlePlayStoreClick = () => {
    // console.log('Debug - Play Store button clicked');
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
      <div
        className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center transition-transform duration-300 ease-out ${
          isVisible && !isClosing ? 'transform translate-y-0 sm:scale-100' : 'transform translate-y-full sm:scale-95'
        }`}
      >
        <div className="bg-white w-full max-w-md sm:max-w-4xl xl:max-w-5xl mx-auto rounded-t-[8vw] mob:rounded-t-[10vw] sm:rounded-3xl relative max-h-[90vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 sm:w-7 sm:h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop Layout (Show on Tablet and Desktop) */}
          <div className="hidden sm:flex sm:min-h-[550px] xl:min-h-[650px] 2xl:min-h-[700px]">
            {/* Left Side - Content */}
            <div className="flex-1 px-12 xl:px-16 py-12 xl:py-16 flex flex-col justify-center">
              <h2 className="font-[SofiaPro] text-3xl xl:text-4xl font-semibold text-black leading-tight mb-8 xl:mb-12">
                Join the cult of fresh!
                <br />
                Download the Origin app
              </h2>

              <div className="flex items-center gap-6 mb-8 xl:mb-12">
                <div className="w-[12vw] h-16 xl:w-20 xl:h-20 relative">
                  <Image src={originLogo} alt="Origin Fresh icon" fill className="object-contain" sizes="80px" />
                </div>
                {/* <p className="font-[SofiaPro] text-2xl xl:text-3xl font-semibold text-black">
                  Origin Fresh
                </p> */}
              </div>

              {/* <p className="font-[SofiaPro] text-xl xl:text-2xl font-medium mb-8 xl:mb-12 text-gray-800">
                #FRESHORNOTHING
              </p> */}

              {/* App Store Buttons */}
              <div className="flex items-center gap-6 xl:gap-8 mb-8 xl:mb-12">
                <button
                  onClick={handleAppStoreClick}
                  className="relative w-48 h-14 xl:w-56 xl:h-16 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                  aria-label="Download on App Store"
                >
                  <Image src={appStore} alt="Download on App Store" fill className="object-contain" sizes="224px" />
                </button>
                <button
                  onClick={handlePlayStoreClick}
                  className="relative w-48 h-14 xl:w-56 xl:h-16 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                  aria-label="Get it on Google Play"
                >
                  <Image
                    src={googlePlaystore}
                    alt="Get it on Google Play"
                    fill
                    className="object-contain"
                    sizes="224px"
                  />
                </button>
              </div>

              {/* Footer Links */}
              <div className="font-[SofiaPro] font-medium text-gray-500 text-sm xl:text-base">
                <Link
                  className="hover:underline hover:text-gray-600 transition-colors duration-200"
                  href="/terms-and-conditions"
                >
                  Terms and Conditions
                </Link>
                <span className="mx-3">|</span>
                <Link
                  className="hover:underline hover:text-gray-600 transition-colors duration-200"
                  href="/privacy-policy"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="flex-1 flex items-center justify-center p-6 xl:p-8 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="relative w-full max-w-lg xl:max-w-xl h-[450px] xl:h-[550px] 2xl:h-[600px]">
                <Image
                  src={mobileDownload}
                  alt="Download Origin Fresh app illustration"
                  fill
                  className="object-contain"
                  priority
                  sizes="600px"
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout (Hidden on Tablet and Desktop) */}
          <div className="sm:hidden">
            {/* Content */}
            <div className="px-[8vw] pt-[8vw] mob:px-[6vw] mob:pt-[10vw]">
              <p className="font-[SofiaPro] text-[5.12vw] mob:text-[4.5vw] font-semibold text-black text-center leading-tight mb-4 mt-5">
                Join the cult of fresh! <br /> Download the Origin app
              </p>

              <div className="flex items-center justify-center gap-[3vw] py-[6vw] mob:py-[4vw] mob:pb-[6vw]">
                <div className="w-[9vw] h-[9vw] mob:w-[45vw] mob:h-[12vw] relative">
                  <Image
                    src={originLogo}
                    alt="Origin Fresh icon"
                    fill
                    className="object-contain"
                    sizes="(max-width: 600px) 12vw, 9vw"
                  />
                </div>
                {/* <p className="font-[SofiaPro] text-[3.6vw] mob:text-[4vw] font-semibold text-black">
                  Origin Fresh
                </p> */}
              </div>
            </div>

            {/* Mobile Download Image */}
            <div className="relative w-full h-[40vh] mob:h-[35vh] mb-4">
              <Image
                src={mobileDownload}
                alt="Download Origin Fresh app illustration"
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>

            <div className="p-[4.1vw] mob:p-[6vw]">
              {/* <p className="font-[SofiaPro] text-center text-[4.1vw] mob:text-[3.5vw] font-medium mb-6 text-gray-800">
                #FRESHORNOTHING
              </p> */}

              {/* App Store Buttons */}
              <div className="flex items-center justify-center gap-[6vw] mob:gap-[4vw] py-[3vw] mb-6">
                <button
                  onClick={handleAppStoreClick}
                  className="relative w-[28vw] h-[8vw] mob:w-[35vw] mob:h-[10vw] hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                  aria-label="Download on App Store"
                >
                  <Image
                    src={appStore}
                    alt="Download on App Store"
                    fill
                    className="object-contain"
                    sizes="(max-width: 600px) 35vw, 28vw"
                  />
                </button>
                <button
                  onClick={handlePlayStoreClick}
                  className="relative w-[28vw] h-[8vw] mob:w-[35vw] mob:h-[10vw] hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                  aria-label="Get it on Google Play"
                >
                  <Image
                    src={googlePlaystore}
                    alt="Get it on Google Play"
                    fill
                    className="object-contain"
                    sizes="(max-width: 600px) 35vw, 28vw"
                  />
                </button>
              </div>

              {/* Footer Links */}
              <div className="font-[SofiaPro] font-medium text-[#7B7979] text-[3vw] mob:text-[3.5vw] text-center">
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
      </div>
    </>
  );
};

export default DownloadAppWrapper;
