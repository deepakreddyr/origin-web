import React, { useState } from 'react';

interface SubscriptionGalleryProps {
  images: string[];
  harvestWeek?: string;
  portionSuitability?: string;
  className?: string;
}

const SubscriptionGallery: React.FC<SubscriptionGalleryProps> = ({
  images,
  // harvestWeek = 'Harvest Week #42',
  portionSuitability = 'Ideal for 2–4 Persons',
  className = ''
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const activeImage = images[selectedImageIndex] || images[0];

  return (
    <div
      className={`w-full lg:max-w-[758.25px] bg-[#F5F3EE] rounded-[18px] overflow-hidden border border-[#E8E4DA] shadow-xs flex flex-col ${className}`}
    >
      {/* Main Large Display Image */}
      <div className="relative w-full h-[300px] sm:h-[420px] lg:h-[568px] overflow-hidden bg-[#ECE8DF]">
        <img
          src={activeImage}
          alt="Curated Harvest Box"
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Top-Left Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
          {/* Harvest Week Badge */}
          {/* <div className="bg-[#8D4320] text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ fontFamily: 'SofiaPro' }}>{harvestWeek}</span>
          </div> */}

          {/* Portion Suitability Badge (Clean White Pill) */}
          <div className="bg-white text-[#132B1E] text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span style={{ fontFamily: 'SofiaPro' }}>{portionSuitability}</span>
          </div>
        </div>

        {/* Bottom-Right Badge: Zero Synthetic Pesticides */}
        {/* <div className="absolute bottom-4 right-4 z-10 bg-[#132B1E]/95 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#68D391" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ fontFamily: 'SofiaPro' }}>Zero Synthetic Pesticides</span>
        </div> */}
      </div>

      {/* Multiple Images Section: 90x90 thumbnails with 13.5px border-radius + 100% Certified Regenerative Soil */}
      <div className="w-full bg-[#F5F3EE] p-4 sm:p-5 lg:px-6 lg:py-[18px] flex flex-wrap items-center justify-between gap-4">
        {/* Thumbnails Row */}
        <div className="flex items-center gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar">
          {images.slice(0, 3).map((thumb, index) => {
            const isActive = selectedImageIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`w-[90px] h-[90px] rounded-[13.5px] overflow-hidden shrink-0 relative transition-all duration-200 cursor-pointer p-0 bg-white ${
                  isActive
                    ? 'ring-2 ring-[#8D4320] shadow-sm'
                    : 'opacity-90 hover:opacity-100 hover:ring-1 hover:ring-black/15'
                }`}
                style={{ width: 90, height: 90, borderRadius: '13.5px', opacity: 1 }}
              >
                <img src={thumb} alt={`Harvest Preview ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>

        {/* 100% Certified Regenerative Soil Element */}
        {/* <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#BFE4D1] text-[#1E3F2F] flex items-center justify-center shrink-0 shadow-2xs">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              <path d="M12 5l1.5 2.5h2.5l-2 2 .8 2.5L12 10.5 9.2 12l.8-2.5-2-2h2.5z" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span
              className="text-[#132B1E] font-bold text-[13px] sm:text-[14px] leading-tight"
              style={{ fontFamily: 'SofiaPro' }}
            >
              100% Certified
            </span>
            <span
              className="text-[#132B1E] font-semibold text-[11.5px] sm:text-[12.5px] leading-tight mt-0.5"
              style={{ fontFamily: 'SofiaPro' }}
            >
              Regenerative Soil
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SubscriptionGallery;
