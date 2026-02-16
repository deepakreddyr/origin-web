import React from 'react';

interface LocationChangedPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const LocationChangedPopup: React.FC<LocationChangedPopupProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 px-[4vw] mob:px-[4vw]">
      <div className="bg-white rounded-[1.5vw] mob:rounded-[4vw] p-[1vw] mob:p-[5vw] flex flex-col items-start gap-[1.5vw] mob:gap-[3vw] w-full max-w-[45vw] mob:max-w-[85vw] animate-in fade-in zoom-in duration-300 shadow-2xl border border-[#F2EEE4]">
        <div className="flex flex-col gap-[.8vw] mob:gap-[2vw]">
          <h2 className="text-[1.3vw] mob:text-[5.5vw] font-bold text-[#231F20] text-left leading-tight">
            Delivery Location changed!
          </h2>
          <p className="text-[.9vw] mob:text-[3.8vw] text-black text-left font-medium leading-[1.4]">
            This may affect item availability, pricing, and maximum quantity limits based on the new delivery location.
          </p>
          <p className="text-[.9vw] mob:text-[3.8vw] text-black text-left font-medium leading-[1.4]">
            Please review your cart before continuing.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-[#E6B703] text-black font-extrabold py-[.6vw] mob:py-[3.5vw] rounded-[1vw] mob:rounded-[4vw] text-[.9vw] mob:text-[4vw] transition-all shadow-md active:scale-[0.98]"
        >
          Alright!
        </button>
      </div>
    </div>
  );
};

export default LocationChangedPopup;
