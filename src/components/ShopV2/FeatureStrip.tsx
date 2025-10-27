'use client';

import React from 'react';
import Image from 'next/image';

const features = [
  { icon: '/assets/icons/sourced-ethically.svg', label: 'Sourced Ethically' },
  { icon: '/assets/icons/harvest-home.svg', label: 'Delivered home in 2 hrs' },
  { icon: '/assets/icons/quality-check.svg', label: '5-Step Quality Check' },
  { icon: '/assets/icons/fair-price.svg', label: 'Fair Price Promise' },
];

const FeatureStrip = () => {
  return (
    <div className="w-full bg-white border-t border-b border-gray-200 py-2 font-slab">
      {/* Desktop */}
      <div className="hidden md:flex justify-between w-full text-sm font-semibold text-[#1A1A1A] px-0">
        <div className="flex justify-between w-full px-[4vw]">
          {features.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 min-w-[160px]">
              <Image
                src={item.icon}
                alt={item.label}
                width={22}
                height={22}
                className="w-[22px] h-[22px]"
              />
              <span className='text-2xl'>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden overflow-x-auto scrollbar-hide font-slab">
        <div className="flex gap-6 px-4 text-sm font-semibold text-[#1A1A1A] whitespace-nowrap animate-scroll">
          {[...features, ...features].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 flex-shrink-0 min-w-max">
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default FeatureStrip;
